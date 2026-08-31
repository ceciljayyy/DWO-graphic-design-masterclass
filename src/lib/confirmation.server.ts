import type { Registration } from "@prisma/client";

import {
  buildBrandedEmailHtml,
  buildBrandedEmailText,
  escapeHtml,
  getFirstName,
} from "@/lib/email-templates.server";
import { masterclass, registrationFee } from "@/lib/masterclass";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { getPrismaClient } from "@/lib/prisma";

export type ConfirmationPayload = {
  firstName: string;
  fullName: string;
  email: string;
  registrationReference: string;
  courseName: string;
  amountDisplay: string;
  coursePeriod: string;
  paidAt: Date | null;
  phoneContacts: string[];
  instagramHandle: string;
};

function formatPaidAt(value: Date | null) {
  if (!value) {
    return "Confirmed";
  }

  return value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildConfirmationPayload(
  registration: Registration,
): ConfirmationPayload {
  return {
    firstName: getFirstName(registration.fullName),
    fullName: registration.fullName,
    email: registration.email,
    registrationReference: registration.registrationReference,
    courseName: masterclass.name,
    amountDisplay: registrationFee.display,
    coursePeriod: masterclass.coursePeriod.display,
    paidAt: registration.paidAt,
    phoneContacts: masterclass.contact.phoneNumbers.map((item) => item.label),
    instagramHandle: masterclass.contact.instagram.handle,
  };
}

function buildConfirmationEmail(payload: ConfirmationPayload) {
  const paidLabel = formatPaidAt(payload.paidAt);
  const subject = `You're officially registered! — ${payload.courseName}`;
  const greeting = `Hi ${payload.firstName},`;
  const paragraphs = [
    "You're officially registered! 🎉",
    "Your payment has been confirmed and your place in the class is secured.",
    "Please keep your registration reference for your records.",
  ];
  const detailRows = [
    { label: "Registration Reference", value: payload.registrationReference },
    { label: "Course", value: payload.courseName },
    { label: "Course Period", value: payload.coursePeriod },
    { label: "Amount Paid", value: payload.amountDisplay },
    { label: "Payment Status", value: "Paid" },
    { label: "Payment Date", value: paidLabel },
  ];

  const text = buildBrandedEmailText({
    greeting,
    paragraphs,
    detailRows,
  });

  const html = buildBrandedEmailHtml({
    greeting,
    paragraphs: [
      "<strong>You're officially registered! 🎉</strong>",
      "Your payment has been confirmed and your place in the class is secured.",
      "Please keep your registration reference for your records.",
    ],
    detailRows,
  });

  return { subject, text, html };
}

/**
 * Sends the participant confirmation email once per paid registration.
 * Payment success is never blocked by email delivery failures.
 */
export async function sendRegistrationConfirmationEmail(
  registration: Registration,
): Promise<{ sent: boolean; skipped: boolean }> {
  if (registration.paymentStatus !== "PAID") {
    return { sent: false, skipped: true };
  }

  if (registration.confirmationEmailSentAt) {
    return { sent: false, skipped: true };
  }

  if (!isEmailConfigured()) {
    return { sent: false, skipped: true };
  }

  const prisma = getPrismaClient();

  // Claim the send slot first so verify + webhook races do not double-send.
  const claim = await prisma.registration.updateMany({
    where: {
      id: registration.id,
      paymentStatus: "PAID",
      confirmationEmailSentAt: null,
    },
    data: {
      confirmationEmailSentAt: new Date(),
    },
  });

  if (claim.count === 0) {
    return { sent: false, skipped: true };
  }

  const payload = buildConfirmationPayload(registration);
  const email = buildConfirmationEmail(payload);

  try {
    await sendEmail({
      to: payload.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  } catch (error) {
    await prisma.registration.update({
      where: { id: registration.id },
      data: { confirmationEmailSentAt: null },
    });
    throw error;
  }

  const notifyTo = process.env.REGISTRATION_NOTIFY_EMAIL?.trim();

  if (notifyTo) {
    try {
      await sendEmail({
        to: notifyTo,
        subject: `New paid registration — ${payload.registrationReference}`,
        text: [
          "A new paid registration was confirmed.",
          "",
          `Name: ${payload.fullName}`,
          `Email: ${payload.email}`,
          `Reference: ${payload.registrationReference}`,
          `Course: ${payload.courseName}`,
          `Amount: ${payload.amountDisplay}`,
          `Paid at: ${formatPaidAt(payload.paidAt)}`,
        ].join("\n"),
        html: `
          <p>A new paid registration was confirmed.</p>
          <ul>
            <li><strong>Name:</strong> ${escapeHtml(payload.fullName)}</li>
            <li><strong>Email:</strong> ${escapeHtml(payload.email)}</li>
            <li><strong>Reference:</strong> ${escapeHtml(payload.registrationReference)}</li>
            <li><strong>Course:</strong> ${escapeHtml(payload.courseName)}</li>
            <li><strong>Amount:</strong> ${escapeHtml(payload.amountDisplay)}</li>
            <li><strong>Paid at:</strong> ${escapeHtml(formatPaidAt(payload.paidAt))}</li>
          </ul>
        `,
      });
    } catch {
      // Organizer notification failure must not affect participant flow.
    }
  }

  return { sent: true, skipped: false };
}

export async function maybeSendRegistrationConfirmation(
  registration: Registration,
): Promise<boolean> {
  try {
    const result = await sendRegistrationConfirmationEmail(registration);
    return result.sent;
  } catch (error) {
    console.error("[communication] confirmation email failed", {
      registrationId: registration.id,
      error,
    });
    return false;
  }
}
