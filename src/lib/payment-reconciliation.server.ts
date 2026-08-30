import "server-only";

import {
  applyVerifiedPaystackTransaction,
  PaymentFlowError,
} from "@/lib/payment.server";
import { getPrismaClient } from "@/lib/prisma";
import {
  PaystackError,
  verifyPaystackTransaction,
} from "@/lib/paystack";

/** Grace period so webhooks / redirect verify can finish first. */
const RECONCILE_MIN_AGE_MS = 2 * 60 * 1000;
const RECONCILE_BATCH_LIMIT = 50;

export type ReconciliationItemResult = {
  registrationReference: string;
  paystackReference: string;
  outcome:
    | "paid"
    | "already_paid"
    | "failed"
    | "pending"
    | "skipped"
    | "error";
  message?: string;
};

export type ReconciliationReport = {
  checkedAt: string;
  candidates: number;
  recovered: number;
  alreadyPaid: number;
  failed: number;
  stillPending: number;
  errors: number;
  items: ReconciliationItemResult[];
};

export function getReconciliationSecret() {
  return (
    process.env.PAYMENT_RECONCILIATION_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    null
  );
}

export function isReconciliationAuthorized(request: Request) {
  const secret = getReconciliationSecret();

  if (!secret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (authorization === `Bearer ${secret}`) {
    return true;
  }

  return request.headers.get("x-reconciliation-secret") === secret;
}

export async function reconcilePendingPaystackPayments(): Promise<ReconciliationReport> {
  const prisma = getPrismaClient();
  const cutoff = new Date(Date.now() - RECONCILE_MIN_AGE_MS);

  const candidates = await prisma.registration.findMany({
    where: {
      paymentStatus: "PENDING",
      paystackReference: { not: null },
      updatedAt: { lte: cutoff },
    },
    orderBy: { updatedAt: "asc" },
    take: RECONCILE_BATCH_LIMIT,
    select: {
      registrationReference: true,
      paystackReference: true,
    },
  });

  const items: ReconciliationItemResult[] = [];
  let recovered = 0;
  let alreadyPaid = 0;
  let failed = 0;
  let stillPending = 0;
  let errors = 0;

  for (const candidate of candidates) {
    const paystackReference = candidate.paystackReference?.trim();

    if (!paystackReference) {
      items.push({
        registrationReference: candidate.registrationReference,
        paystackReference: "",
        outcome: "skipped",
        message: "Missing Paystack reference.",
      });
      continue;
    }

    try {
      const transaction = await verifyPaystackTransaction(paystackReference);
      const result = await applyVerifiedPaystackTransaction(transaction);

      items.push({
        registrationReference: candidate.registrationReference,
        paystackReference,
        outcome: result.outcome,
      });

      switch (result.outcome) {
        case "paid":
          recovered += 1;
          break;
        case "already_paid":
          alreadyPaid += 1;
          break;
        case "failed":
          failed += 1;
          break;
        case "pending":
          stillPending += 1;
          break;
        default:
          stillPending += 1;
          break;
      }
    } catch (error) {
      errors += 1;

      const message =
        error instanceof PaymentFlowError || error instanceof PaystackError
          ? error.message
          : "Reconciliation check failed.";

      items.push({
        registrationReference: candidate.registrationReference,
        paystackReference,
        outcome: "error",
        message,
      });
    }
  }

  const report: ReconciliationReport = {
    checkedAt: new Date().toISOString(),
    candidates: candidates.length,
    recovered,
    alreadyPaid,
    failed,
    stillPending,
    errors,
    items,
  };

  try {
    await prisma.adminAuditLog.create({
      data: {
        action: "payment.reconciliation",
        metadata: JSON.stringify({
          candidates: report.candidates,
          recovered: report.recovered,
          alreadyPaid: report.alreadyPaid,
          failed: report.failed,
          stillPending: report.stillPending,
          errors: report.errors,
        }),
      },
    });
  } catch {
    // Audit logging must not block reconciliation.
  }

  return report;
}
