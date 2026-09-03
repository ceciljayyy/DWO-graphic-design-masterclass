import "server-only";

import { Prisma, type PaymentStatus } from "@prisma/client";

import { maybeSendRegistrationConfirmation } from "@/lib/confirmation.server";
import {
  ManualPaymentError,
  findRegistrationByPaymentAccessToken,
} from "@/lib/manual-payment-access.server";
import { manualMobileMoney } from "@/lib/manual-payment";
import { registrationFee } from "@/lib/masterclass";
import { getPrismaClient } from "@/lib/prisma";
import {
  getDefaultPhoneCountry,
  isInvalidPhone,
  validatePhoneForCountry,
} from "@/lib/phone";

export { ManualPaymentError };

export type ManualPaymentSubmissionInput = {
  paymentAccessToken: string;
  senderName: string;
  senderPhone: string;
  transactionReference?: string | null;
  paymentDate: string;
  paymentTime: string;
};

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function parsePaymentDateTime(paymentDate: string, paymentTime: string) {
  const date = paymentDate.trim();
  const time = paymentTime.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ManualPaymentError(
      "Please enter a valid payment date.",
      "INVALID_PAYMENT_DATE",
    );
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new ManualPaymentError(
      "Please enter a valid payment time.",
      "INVALID_PAYMENT_TIME",
    );
  }

  const iso = `${date}T${time}:00`;
  const parsed = new Date(iso);

  if (Number.isNaN(parsed.getTime())) {
    throw new ManualPaymentError(
      "Please enter a valid payment date and time.",
      "INVALID_PAYMENT_DATETIME",
    );
  }

  const now = new Date();
  const earliest = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const latest = new Date(now.getTime() + 15 * 60 * 1000);

  if (parsed < earliest || parsed > latest) {
    throw new ManualPaymentError(
      "Please enter a valid payment date and time.",
      "INVALID_PAYMENT_DATETIME",
    );
  }

  return parsed;
}

export type ManualPaymentFieldErrors = Partial<
  Record<
    | "senderName"
    | "senderPhone"
    | "transactionReference"
    | "paymentDate"
    | "paymentTime"
    | "form",
    string
  >
>;

export function validateManualPaymentSubmissionInput(input: unknown): {
  success: true;
  data: {
    paymentAccessToken: string;
    senderName: string;
    senderPhone: string;
    transactionReference: string | null;
    paymentDateTime: Date;
  };
} | {
  success: false;
  errors: ManualPaymentFieldErrors;
} {
  if (!input || typeof input !== "object") {
    return { success: false, errors: { form: "Invalid request payload." } };
  }

  const raw = input as Record<string, unknown>;
  const errors: ManualPaymentFieldErrors = {};

  const paymentAccessToken =
    typeof raw.paymentAccessToken === "string"
      ? raw.paymentAccessToken.trim()
      : "";
  const senderName =
    typeof raw.senderName === "string" ? normalizeText(raw.senderName) : "";
  const senderPhoneRaw =
    typeof raw.senderPhone === "string" ? raw.senderPhone : "";
  const transactionReferenceRaw =
    typeof raw.transactionReference === "string"
      ? normalizeText(raw.transactionReference)
      : "";
  const paymentDate =
    typeof raw.paymentDate === "string" ? raw.paymentDate.trim() : "";
  const paymentTime =
    typeof raw.paymentTime === "string" ? raw.paymentTime.trim() : "";

  if (!paymentAccessToken) {
    errors.form = "We couldn't find this registration. Please restart registration.";
  }

  if (!senderName || senderName.length < 2) {
    errors.senderName = "Please enter the name used to make the payment.";
  }

  const phoneResult = validatePhoneForCountry(
    senderPhoneRaw,
    getDefaultPhoneCountry(),
    { required: true, fieldLabel: "phone" },
  );
  if (isInvalidPhone(phoneResult)) {
    errors.senderPhone = phoneResult.error;
  }

  let paymentDateTime: Date | null = null;
  try {
    paymentDateTime = parsePaymentDateTime(paymentDate, paymentTime);
  } catch (error) {
    if (error instanceof ManualPaymentError) {
      if (error.code === "INVALID_PAYMENT_DATE") {
        errors.paymentDate = error.message;
      } else if (error.code === "INVALID_PAYMENT_TIME") {
        errors.paymentTime = error.message;
      } else {
        errors.paymentDate = error.message;
        errors.paymentTime = error.message;
      }
    } else {
      errors.paymentDate = "Please enter a valid payment date and time.";
    }
  }

  if (transactionReferenceRaw.length > 120) {
    errors.transactionReference =
      "Transaction reference must be 120 characters or fewer.";
  }

  if (Object.keys(errors).length > 0 || !paymentDateTime) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      paymentAccessToken,
      senderName,
      senderPhone: phoneResult.ok ? phoneResult.e164 : "",
      transactionReference: transactionReferenceRaw || null,
      paymentDateTime,
    },
  };
}

export async function submitManualPaymentDetails(input: unknown) {
  const validation = validateManualPaymentSubmissionInput(input);

  if (validation.success === false) {
    throw Object.assign(
      new ManualPaymentError(
        "Please correct the highlighted fields.",
        "VALIDATION_ERROR",
        400,
      ),
      { fieldErrors: validation.errors },
    );
  }

  const registration = await findRegistrationByPaymentAccessToken(
    validation.data.paymentAccessToken,
  );

  if (!registration) {
    throw new ManualPaymentError(
      "We couldn't find this registration. Please restart the registration process or contact DWO support.",
      "REGISTRATION_NOT_FOUND",
      404,
    );
  }

  if (registration.paymentStatus === "PAID") {
    throw new ManualPaymentError(
      "Your payment has already been verified.",
      "ALREADY_PAID",
      409,
    );
  }

  if (registration.paymentStatus === "PAYMENT_SUBMITTED") {
    throw new ManualPaymentError(
      "Your payment details have already been submitted and are awaiting verification.",
      "ALREADY_SUBMITTED",
      409,
    );
  }

  if (
    registration.paymentStatus !== "PENDING" &&
    registration.paymentStatus !== "PAYMENT_REJECTED" &&
    registration.paymentStatus !== "FAILED"
  ) {
    throw new ManualPaymentError(
      "Payment details cannot be submitted for this registration right now.",
      "INVALID_STATUS",
      409,
    );
  }

  const expectedAmount = new Prisma.Decimal(registrationFee.amount);
  const prisma = getPrismaClient();

  const submission = await prisma.$transaction(async (tx) => {
    await tx.manualPaymentSubmission.updateMany({
      where: { registrationId: registration.id, isActive: true },
      data: { isActive: false },
    });

    const created = await tx.manualPaymentSubmission.create({
      data: {
        registrationId: registration.id,
        method: manualMobileMoney.methodKey,
        amount: expectedAmount,
        currency: registrationFee.currency,
        senderName: validation.data.senderName,
        senderPhone: validation.data.senderPhone,
        transactionReference: validation.data.transactionReference,
        paymentDateTime: validation.data.paymentDateTime,
        isActive: true,
      },
    });

    await tx.registration.update({
      where: { id: registration.id },
      data: {
        paymentStatus: "PAYMENT_SUBMITTED",
        amount: expectedAmount,
      },
    });

    return created;
  });

  await prisma.adminAuditLog.create({
    data: {
      action: "MANUAL_PAYMENT_SUBMITTED",
      metadata: JSON.stringify({
        registrationId: registration.id,
        registrationReference: registration.registrationReference,
        submissionId: submission.id,
      }),
    },
  });

  return {
    registrationReference: registration.registrationReference,
    paymentAccessToken: registration.paymentAccessToken,
    paymentStatus: "PAYMENT_SUBMITTED" as PaymentStatus,
    submissionId: submission.id,
  };
}

export async function verifyManualPaymentAsAdmin(options: {
  registrationId: string;
  adminId: string;
  adminName: string;
}) {
  const prisma = getPrismaClient();
  const registration = await prisma.registration.findUnique({
    where: { id: options.registrationId },
    include: {
      manualPaymentSubmissions: {
        where: { isActive: true },
        take: 1,
      },
    },
  });

  if (!registration) {
    throw new ManualPaymentError("Registration not found.", "NOT_FOUND", 404);
  }

  if (registration.paymentStatus === "PAID") {
    return {
      alreadyPaid: true as const,
      registration,
    };
  }

  if (registration.paymentStatus !== "PAYMENT_SUBMITTED") {
    throw new ManualPaymentError(
      "Only submitted payments can be verified.",
      "INVALID_STATUS",
      409,
    );
  }

  const active = registration.manualPaymentSubmissions[0];
  if (!active) {
    throw new ManualPaymentError(
      "No active payment submission found for this registration.",
      "NO_SUBMISSION",
      409,
    );
  }

  const paidAt = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    const claimed = await tx.registration.updateMany({
      where: {
        id: registration.id,
        paymentStatus: "PAYMENT_SUBMITTED",
      },
      data: {
        paymentStatus: "PAID",
        paidAt,
      },
    });

    if (claimed.count === 0) {
      const current = await tx.registration.findUnique({
        where: { id: registration.id },
      });
      return { alreadyPaid: current?.paymentStatus === "PAID", registration: current };
    }

    await tx.manualPaymentSubmission.update({
      where: { id: active.id },
      data: {
        reviewedAt: paidAt,
        reviewedByAdminId: options.adminId,
      },
    });

    const next = await tx.registration.findUniqueOrThrow({
      where: { id: registration.id },
    });

    return { alreadyPaid: false, registration: next };
  });

  if (!updated.registration) {
    throw new ManualPaymentError("Registration not found.", "NOT_FOUND", 404);
  }

  if (!updated.alreadyPaid) {
    void maybeSendRegistrationConfirmation(updated.registration);

    await prisma.adminAuditLog.create({
      data: {
        adminId: options.adminId,
        action: "MANUAL_PAYMENT_VERIFIED",
        metadata: JSON.stringify({
          registrationId: registration.id,
          registrationReference: registration.registrationReference,
          reviewedBy: options.adminName,
          submissionId: active.id,
        }),
      },
    });
  } else {
    void maybeSendRegistrationConfirmation(updated.registration);
  }

  return {
    alreadyPaid: updated.alreadyPaid,
    registration: updated.registration,
  };
}

export async function rejectManualPaymentAsAdmin(options: {
  registrationId: string;
  adminId: string;
  adminName: string;
  adminNote?: string | null;
}) {
  const prisma = getPrismaClient();
  const registration = await prisma.registration.findUnique({
    where: { id: options.registrationId },
    include: {
      manualPaymentSubmissions: {
        where: { isActive: true },
        take: 1,
      },
    },
  });

  if (!registration) {
    throw new ManualPaymentError("Registration not found.", "NOT_FOUND", 404);
  }

  if (registration.paymentStatus === "PAID") {
    throw new ManualPaymentError(
      "Paid registrations cannot be rejected.",
      "ALREADY_PAID",
      409,
    );
  }

  if (registration.paymentStatus !== "PAYMENT_SUBMITTED") {
    throw new ManualPaymentError(
      "Only submitted payments can be rejected.",
      "INVALID_STATUS",
      409,
    );
  }

  const active = registration.manualPaymentSubmissions[0];
  const note = options.adminNote?.trim() || null;
  const reviewedAt = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    const claimed = await tx.registration.updateMany({
      where: {
        id: registration.id,
        paymentStatus: "PAYMENT_SUBMITTED",
      },
      data: {
        paymentStatus: "PAYMENT_REJECTED",
      },
    });

    if (claimed.count === 0) {
      throw new ManualPaymentError(
        "Only submitted payments can be rejected.",
        "INVALID_STATUS",
        409,
      );
    }

    if (active) {
      await tx.manualPaymentSubmission.update({
        where: { id: active.id },
        data: {
          reviewedAt,
          reviewedByAdminId: options.adminId,
          adminNote: note,
        },
      });
    }

    return tx.registration.findUniqueOrThrow({
      where: { id: registration.id },
    });
  });

  await prisma.adminAuditLog.create({
    data: {
      adminId: options.adminId,
      action: "MANUAL_PAYMENT_REJECTED",
      metadata: JSON.stringify({
        registrationId: registration.id,
        registrationReference: registration.registrationReference,
        reviewedBy: options.adminName,
        adminNote: note,
        submissionId: active?.id ?? null,
      }),
    },
  });

  return updated;
}
