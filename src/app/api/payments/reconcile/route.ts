import { NextResponse } from "next/server";

import {
  isReconciliationAuthorized,
  reconcilePendingPaystackPayments,
} from "@/lib/payment-reconciliation.server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handleReconcile(request: Request) {
  if (!isReconciliationAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid reconciliation credentials.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const report = await reconcilePendingPaystackPayments();

    return NextResponse.json(
      {
        success: true,
        data: report,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RECONCILIATION_ERROR",
          message: "Payment reconciliation could not be completed.",
        },
      },
      { status: 500 },
    );
  }
}

/**
 * Periodic reconciliation for PENDING registrations with a Paystack reference.
 * Webhooks remain primary; this catches paid-but-not-updated edge cases.
 *
 * Auth: Authorization: Bearer <PAYMENT_RECONCILIATION_SECRET or CRON_SECRET>
 *   or header x-reconciliation-secret
 */
export async function GET(request: Request) {
  return handleReconcile(request);
}

export async function POST(request: Request) {
  return handleReconcile(request);
}
