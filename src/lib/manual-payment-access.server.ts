import "server-only";

import type { PaymentStatus, Registration } from "@prisma/client";

import { getPrismaClient } from "@/lib/prisma";
import { generatePaymentAccessToken } from "@/lib/payment-access";
import { registrationFee } from "@/lib/masterclass";
import { formatManualPaymentMethod, manualMobileMoney } from "@/lib/manual-payment";

export type PublicPaymentContext = {
  registrationReference: string;
  paymentAccessToken: string;
  paymentStatus: PaymentStatus;
  amountDisplay: string;
  courseName: string;
  momo: {
    methodLabel: string;
    number: string;
    accountName: string;
  };
  activeSubmission: {
    senderName: string;
    senderPhone: string;
    transactionReference: string | null;
    paymentDateTime: string;
    submittedAt: string;
    adminNote: string | null;
  } | null;
};

export class ManualPaymentError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "ManualPaymentError";
    this.code = code;
    this.status = status;
  }
}

export async function ensurePaymentAccessToken(registration: Registration) {
  if (registration.paymentAccessToken) {
    return registration;
  }

  return getPrismaClient().registration.update({
    where: { id: registration.id },
    data: { paymentAccessToken: generatePaymentAccessToken() },
  });
}

export async function findRegistrationByPaymentAccessToken(token: string) {
  const normalized = token.trim();
  if (!normalized || normalized.length < 16) {
    return null;
  }

  return getPrismaClient().registration.findUnique({
    where: { paymentAccessToken: normalized },
    include: {
      manualPaymentSubmissions: {
        where: { isActive: true },
        orderBy: { submittedAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function getPublicPaymentContext(
  token: string,
): Promise<PublicPaymentContext | null> {
  const registration = await findRegistrationByPaymentAccessToken(token);

  if (!registration) {
    return null;
  }

  const active = registration.manualPaymentSubmissions[0] ?? null;

  return {
    registrationReference: registration.registrationReference,
    paymentAccessToken: registration.paymentAccessToken,
    paymentStatus: registration.paymentStatus,
    amountDisplay: registrationFee.display,
    courseName: "Graphic Design & Media Class",
    momo: {
      methodLabel: manualMobileMoney.methodLabel,
      number: manualMobileMoney.number,
      accountName: manualMobileMoney.accountName,
    },
    activeSubmission: active
      ? {
          senderName: active.senderName,
          senderPhone: active.senderPhone,
          transactionReference: active.transactionReference,
          paymentDateTime: active.paymentDateTime.toISOString(),
          submittedAt: active.submittedAt.toISOString(),
          adminNote: active.adminNote,
        }
      : null,
  };
}

export function toPublicPaymentSummaryLabel(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return "Payment verified";
    case "PAYMENT_SUBMITTED":
      return "Awaiting verification";
    case "PAYMENT_REJECTED":
      return "Payment rejected — please resubmit";
    case "FAILED":
      return "Payment failed";
    case "PENDING":
    default:
      return "Payment pending";
  }
}

export { formatManualPaymentMethod };
