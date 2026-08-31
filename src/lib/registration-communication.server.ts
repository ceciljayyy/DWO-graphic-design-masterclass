import "server-only";

import type { Registration } from "@prisma/client";

import {
  buildBrandedEmailHtml,
  buildBrandedEmailText,
  getFirstName,
  getRegisterUrl,
} from "@/lib/email-templates.server";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { masterclass, registrationFee } from "@/lib/masterclass";
import { getPrismaClient } from "@/lib/prisma";

export type CommunicationPayload = {
  firstName: string;
  fullName: string;
  email: string;
  registrationReference: string;
  courseName: string;
  amountDisplay: string;
  coursePeriod: string;
  registerUrl: string;
};

const DEFAULT_REMINDER_AFTER_HOURS = 24;
const REMINDER_BATCH_LIMIT = 50;

export function getPaymentReminderAfterHours() {
  const configured = Number(process.env.PAYMENT_REMINDER_AFTER_HOURS?.trim());

  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_REMINDER_AFTER_HOURS;
  }

  return configured;
}

export function buildCommunicationPayload(
  registration: Registration,
): CommunicationPayload {
  return {
    firstName: getFirstName(registration.fullName),
    fullName: registration.fullName,
    email: registration.email,
    registrationReference: registration.registrationReference,
    courseName: masterclass.name,
    amountDisplay: registrationFee.display,
    coursePeriod: masterclass.coursePeriod.display,
    registerUrl: getRegisterUrl(),
  };
}

export function buildWelcomeEmail(payload: CommunicationPayload) {
  const subject = `Registration Created — ${payload.courseName}`;
  const greeting = `Hi ${payload.firstName},`;
  const paragraphs = [
    "Your registration has been created. Complete payment to secure your place.",
    `Use the same email (${payload.email}) when you return if you need to finish payment.`,
  ];
  const detailRows = [
    { label: "Registration Reference", value: payload.registrationReference },
    { label: "Course", value: payload.courseName },
    { label: "Course Period", value: payload.coursePeriod },
    { label: "Fee", value: payload.amountDisplay },
    { label: "Payment Status", value: "Pending" },
  ];

  return {
    subject,
    text: buildBrandedEmailText({
      greeting,
      paragraphs,
      detailRows,
      ctaLabel: "Complete payment",
      ctaHref: payload.registerUrl,
    }),
    html: buildBrandedEmailHtml({
      greeting,
      paragraphs: paragraphs.map((paragraph) => paragraph),
      detailRows,
      ctaLabel: "Complete payment",
      ctaHref: payload.registerUrl,
    }),
  };
}

export function buildPaymentReminderEmail(payload: CommunicationPayload) {
  const subject = `Payment Reminder — ${payload.courseName}`;
  const greeting = `Hi ${payload.firstName},`;
  const paragraphs = [
    "Your registration is still awaiting payment.",
    "Complete payment now to secure your place in the class.",
  ];
  const detailRows = [
    { label: "Registration Reference", value: payload.registrationReference },
    { label: "Course", value: payload.courseName },
    { label: "Fee", value: payload.amountDisplay },
    { label: "Payment Status", value: "Pending" },
  ];

  return {
    subject,
    text: buildBrandedEmailText({
      greeting,
      paragraphs,
      detailRows,
      ctaLabel: "Complete payment",
      ctaHref: payload.registerUrl,
    }),
    html: buildBrandedEmailHtml({
      greeting,
      paragraphs,
      detailRows,
      ctaLabel: "Complete payment",
      ctaHref: payload.registerUrl,
    }),
  };
}

async function claimEmailSlot(
  registrationId: string,
  field: "welcomeEmailSentAt" | "paymentReminderEmailSentAt",
  extraWhere: Record<string, unknown> = {},
) {
  const prisma = getPrismaClient();
  const claimData =
    field === "welcomeEmailSentAt"
      ? { welcomeEmailSentAt: new Date() }
      : { paymentReminderEmailSentAt: new Date() };

  return prisma.registration.updateMany({
    where: {
      id: registrationId,
      [field]: null,
      ...extraWhere,
    },
    data: claimData,
  });
}

async function rollbackEmailSlot(
  registrationId: string,
  field: "welcomeEmailSentAt" | "paymentReminderEmailSentAt",
) {
  const prisma = getPrismaClient();
  const rollbackData =
    field === "welcomeEmailSentAt"
      ? { welcomeEmailSentAt: null }
      : { paymentReminderEmailSentAt: null };

  await prisma.registration.update({
    where: { id: registrationId },
    data: rollbackData,
  });
}

export async function sendWelcomeEmail(
  registration: Registration,
): Promise<{ sent: boolean; skipped: boolean }> {
  if (registration.paymentStatus === "PAID") {
    return { sent: false, skipped: true };
  }

  if (registration.welcomeEmailSentAt) {
    return { sent: false, skipped: true };
  }

  if (!isEmailConfigured()) {
    return { sent: false, skipped: true };
  }

  const claim = await claimEmailSlot(registration.id, "welcomeEmailSentAt", {
    paymentStatus: { in: ["PENDING", "FAILED"] },
  });

  if (claim.count === 0) {
    return { sent: false, skipped: true };
  }

  const payload = buildCommunicationPayload(registration);
  const email = buildWelcomeEmail(payload);

  try {
    await sendEmail({
      to: payload.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  } catch (error) {
    await rollbackEmailSlot(registration.id, "welcomeEmailSentAt");
    throw error;
  }

  return { sent: true, skipped: false };
}

export async function maybeSendWelcomeEmail(
  registration: Registration,
): Promise<boolean> {
  try {
    const result = await sendWelcomeEmail(registration);
    return result.sent;
  } catch (error) {
    console.error("[communication] welcome email failed", {
      registrationId: registration.id,
      error,
    });
    return false;
  }
}

export async function sendPaymentReminderEmail(
  registration: Registration,
): Promise<{ sent: boolean; skipped: boolean }> {
  if (registration.paymentStatus !== "PENDING") {
    return { sent: false, skipped: true };
  }

  if (registration.paymentReminderEmailSentAt) {
    return { sent: false, skipped: true };
  }

  if (!isEmailConfigured()) {
    return { sent: false, skipped: true };
  }

  const claim = await claimEmailSlot(
    registration.id,
    "paymentReminderEmailSentAt",
    {
      paymentStatus: "PENDING",
    },
  );

  if (claim.count === 0) {
    return { sent: false, skipped: true };
  }

  const payload = buildCommunicationPayload(registration);
  const email = buildPaymentReminderEmail(payload);

  try {
    await sendEmail({
      to: payload.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  } catch (error) {
    await rollbackEmailSlot(registration.id, "paymentReminderEmailSentAt");
    throw error;
  }

  return { sent: true, skipped: false };
}

export type PaymentReminderReport = {
  checkedAt: string;
  reminderAfterHours: number;
  candidates: number;
  sent: number;
  skipped: number;
  errors: number;
};

export async function sendPendingPaymentReminders(): Promise<PaymentReminderReport> {
  const prisma = getPrismaClient();
  const reminderAfterHours = getPaymentReminderAfterHours();
  const cutoff = new Date(Date.now() - reminderAfterHours * 60 * 60 * 1000);

  const candidates = await prisma.registration.findMany({
    where: {
      paymentStatus: "PENDING",
      paymentReminderEmailSentAt: null,
      createdAt: { lte: cutoff },
    },
    orderBy: { createdAt: "asc" },
    take: REMINDER_BATCH_LIMIT,
  });

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const registration of candidates) {
    try {
      const result = await sendPaymentReminderEmail(registration);

      if (result.sent) {
        sent += 1;
      } else {
        skipped += 1;
      }
    } catch (error) {
      errors += 1;
      console.error("[communication] payment reminder failed", {
        registrationId: registration.id,
        error,
      });
    }
  }

  const report: PaymentReminderReport = {
    checkedAt: new Date().toISOString(),
    reminderAfterHours,
    candidates: candidates.length,
    sent,
    skipped,
    errors,
  };

  try {
    await prisma.adminAuditLog.create({
      data: {
        action: "communication.payment_reminder",
        metadata: JSON.stringify(report),
      },
    });
  } catch {
    // Audit logging must not block reminders.
  }

  return report;
}
