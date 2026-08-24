import { randomInt } from "crypto";

import { Prisma, type PaymentStatus, type Registration } from "@prisma/client";

import {
  getRegistrationFeeInMinorUnits,
  masterclass,
  registrationFee,
} from "@/lib/masterclass";
import { getPrismaClient } from "@/lib/prisma";
import {
  initializePaystackTransaction,
  PaystackError,
  verifyPaystackTransaction,
  type PaystackVerifiedTransaction,
} from "@/lib/paystack";

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type PaymentSummary = {
  registrationReference: string;
  fullName: string;
  courseName: string;
  amount: string;
  amountDisplay: string;
  paymentStatus: PaymentStatus;
  paystackReference: string | null;
  paidAt: string | null;
};

export class PaymentFlowError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "PaymentFlowError";
    this.code = code;
    this.status = status;
  }
}

function generatePaystackReference() {
  let token = "";

  for (let index = 0; index < 10; index += 1) {
    token += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }

  return `PSK-DWO-${token}`;
}

function toPaymentSummary(registration: Registration): PaymentSummary {
  return {
    registrationReference: registration.registrationReference,
    fullName: registration.fullName,
    courseName: masterclass.name,
    amount: registration.amount.toString(),
    amountDisplay: registrationFee.display,
    paymentStatus: registration.paymentStatus,
    paystackReference: registration.paystackReference,
    paidAt: registration.paidAt ? registration.paidAt.toISOString() : null,
  };
}

function assertAmountConsistency(registration: Registration) {
  const storedMinor = getRegistrationFeeInMinorUnits(
    Number(registration.amount),
  );
  const configMinor = getRegistrationFeeInMinorUnits(registrationFee.amount);

  if (storedMinor !== configMinor) {
    throw new PaymentFlowError(
      "We could not start payment for this registration right now.",
      "AMOUNT_MISMATCH",
      500,
    );
  }

  return configMinor;
}

function isSuccessfulPaystackStatus(status: string) {
  return status.toLowerCase() === "success";
}

function isFailedPaystackStatus(status: string) {
  return status.toLowerCase() === "failed";
}

async function findRegistrationByReference(registrationReference: string) {
  return getPrismaClient().registration.findUnique({
    where: { registrationReference },
  });
}

async function findRegistrationByPaystackReference(paystackReference: string) {
  return getPrismaClient().registration.findUnique({
    where: { paystackReference },
  });
}

export async function initializePaymentForRegistration(
  registrationReference: string,
) {
  const normalizedReference = registrationReference.trim().toUpperCase();

  if (!normalizedReference) {
    throw new PaymentFlowError(
      "Registration reference is required.",
      "MISSING_REGISTRATION_REFERENCE",
    );
  }

  const registration = await findRegistrationByReference(normalizedReference);

  if (!registration) {
    throw new PaymentFlowError(
      "Registration not found.",
      "REGISTRATION_NOT_FOUND",
      404,
    );
  }

  if (registration.paymentStatus === "PAID") {
    throw new PaymentFlowError(
      "This registration has already been paid for.",
      "ALREADY_PAID",
      409,
    );
  }

  const amountInMinorUnits = assertAmountConsistency(registration);
  const prisma = getPrismaClient();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const paystackReference = generatePaystackReference();

    try {
      await prisma.registration.update({
        where: { id: registration.id },
        data: {
          paystackReference,
          paymentStatus: "PENDING",
        },
      });

      const initialization = await initializePaystackTransaction({
        email: registration.email,
        amountInMinorUnits,
        reference: paystackReference,
        metadata: {
          registrationReference: registration.registrationReference,
          courseName: masterclass.name,
        },
      });

      return {
        authorizationUrl: initialization.authorizationUrl,
        paystackReference: initialization.reference,
        registrationReference: registration.registrationReference,
        amountDisplay: registrationFee.display,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new PaymentFlowError(
    "Unable to prepare a unique payment reference.",
    "REFERENCE_GENERATION_FAILED",
    500,
  );
}

function validateVerifiedTransaction(
  registration: Registration,
  transaction: PaystackVerifiedTransaction,
) {
  const expectedAmount = assertAmountConsistency(registration);

  if (transaction.amount !== expectedAmount) {
    throw new PaymentFlowError(
      "Payment amount could not be confirmed.",
      "AMOUNT_MISMATCH",
      422,
    );
  }

  if (transaction.currency.toUpperCase() !== registrationFee.currency) {
    throw new PaymentFlowError(
      "Payment currency could not be confirmed.",
      "CURRENCY_MISMATCH",
      422,
    );
  }

  const metadataReference = transaction.metadata.registrationReference;

  if (
    typeof metadataReference === "string" &&
    metadataReference.trim().toUpperCase() !==
      registration.registrationReference
  ) {
    throw new PaymentFlowError(
      "Payment reference could not be confirmed.",
      "REGISTRATION_MISMATCH",
      422,
    );
  }
}

export async function applyVerifiedPaystackTransaction(
  transaction: PaystackVerifiedTransaction,
) {
  const registration = await findRegistrationByPaystackReference(
    transaction.reference,
  );

  if (!registration) {
    throw new PaymentFlowError(
      "Registration not found for this payment reference.",
      "REGISTRATION_NOT_FOUND",
      404,
    );
  }

  if (registration.paymentStatus === "PAID") {
    return {
      outcome: "already_paid" as const,
      summary: toPaymentSummary(registration),
    };
  }

  validateVerifiedTransaction(registration, transaction);

  if (isSuccessfulPaystackStatus(transaction.status)) {
    const paidAt = transaction.paidAt
      ? new Date(transaction.paidAt)
      : new Date();

    const updated = await getPrismaClient().registration.update({
      where: { id: registration.id },
      data: {
        paymentStatus: "PAID",
        paidAt,
        paystackReference: transaction.reference,
      },
    });

    return {
      outcome: "paid" as const,
      summary: toPaymentSummary(updated),
    };
  }

  if (isFailedPaystackStatus(transaction.status)) {
    const updated = await getPrismaClient().registration.update({
      where: { id: registration.id },
      data: {
        paymentStatus: "FAILED",
      },
    });

    return {
      outcome: "failed" as const,
      summary: toPaymentSummary(updated),
    };
  }

  // Abandoned / cancelled / pending remain retryable as PENDING.
  if (registration.paymentStatus === "FAILED") {
    const updated = await getPrismaClient().registration.update({
      where: { id: registration.id },
      data: { paymentStatus: "PENDING" },
    });

    return {
      outcome: "pending" as const,
      summary: toPaymentSummary(updated),
    };
  }

  return {
    outcome: "pending" as const,
    summary: toPaymentSummary(registration),
  };
}

export async function verifyPaymentByPaystackReference(reference: string) {
  const normalizedReference = reference.trim();

  if (!normalizedReference) {
    throw new PaymentFlowError(
      "Payment reference is required.",
      "MISSING_PAYMENT_REFERENCE",
    );
  }

  const registration = await findRegistrationByPaystackReference(
    normalizedReference,
  );

  if (!registration) {
    throw new PaymentFlowError(
      "Invalid payment reference.",
      "INVALID_PAYMENT_REFERENCE",
      404,
    );
  }

  if (registration.paymentStatus === "PAID") {
    return {
      outcome: "already_paid" as const,
      summary: toPaymentSummary(registration),
    };
  }

  let transaction: PaystackVerifiedTransaction;

  try {
    transaction = await verifyPaystackTransaction(normalizedReference);
  } catch (error) {
    if (error instanceof PaystackError) {
      throw new PaymentFlowError(error.message, error.code, 502);
    }

    throw error;
  }

  return applyVerifiedPaystackTransaction(transaction);
}

export function toSafePaymentError(error: unknown) {
  if (error instanceof PaymentFlowError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
    };
  }

  if (error instanceof PaystackError) {
    return {
      code: error.code,
      message: error.message,
      status: error.code === "PAYSTACK_NOT_CONFIGURED" ? 503 : 502,
    };
  }

  return {
    code: "PAYMENT_ERROR",
    message:
      "We could not process the payment request right now. Please try again.",
    status: 500,
  };
}
