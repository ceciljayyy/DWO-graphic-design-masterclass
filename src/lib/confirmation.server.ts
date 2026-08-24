import type { Registration } from "@prisma/client";

import { masterclass, registrationFee } from "@/lib/masterclass";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { getPrismaClient } from "@/lib/prisma";

export type ConfirmationPayload = {
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
  const contactLines = [
    ...payload.phoneContacts,
    payload.instagramHandle,
  ].join("\n");

  const subject = `Registration Confirmed — ${payload.courseName}`;

  const text = [
    `Hi ${payload.fullName},`,
    "",
    `Your payment for the ${payload.courseName} has been confirmed.`,
    "",
    `Registration Reference: ${payload.registrationReference}`,
    `Course: ${payload.courseName}`,
    `Course Period: ${payload.coursePeriod}`,
    `Amount Paid: ${payload.amountDisplay}`,
    `Payment Status: PAID`,
    `Payment Date: ${paidLabel}`,
    "",
    "Please keep your registration reference for your records.",
    "",
    "If you have any questions, contact us:",
    contactLines,
    "",
    `— ${masterclass.brand} (${masterclass.brandFull})`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 560px;">
      <p>Hi ${escapeHtml(payload.fullName)},</p>
      <p>Your payment for the <strong>${escapeHtml(payload.courseName)}</strong> has been confirmed.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Registration Reference</td>
          <td style="padding: 8px 0; font-weight: bold;">${escapeHtml(payload.registrationReference)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Course</td>
          <td style="padding: 8px 0;">${escapeHtml(payload.courseName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Course Period</td>
          <td style="padding: 8px 0;">${escapeHtml(payload.coursePeriod)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Amount Paid</td>
          <td style="padding: 8px 0;">${escapeHtml(payload.amountDisplay)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Payment Status</td>
          <td style="padding: 8px 0;">PAID</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Payment Date</td>
          <td style="padding: 8px 0;">${escapeHtml(paidLabel)}</td>
        </tr>
      </table>
      <p>Please keep your registration reference for your records.</p>
      <p style="color: #666;">
        Questions? Contact us:<br/>
        ${payload.phoneContacts.map(escapeHtml).join("<br/>")}<br/>
        ${escapeHtml(payload.instagramHandle)}
      </p>
      <p>— ${escapeHtml(masterclass.brand)} (${escapeHtml(masterclass.brandFull)})</p>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
  } catch {
    return false;
  }
}
