import type { Registration } from "@prisma/client";

import {
  buildRegistrationWhereForExport,
  type RegistrationListQuery,
} from "@/lib/admin/registrations";
import { formatMarketingSource } from "@/lib/admin/format";
import { getPrismaClient } from "@/lib/prisma";

function sanitizeCsvCell(value: string) {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (/^[=+\-@]/.test(normalized)) {
    return `'${normalized}`;
  }

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }

  return normalized;
}

function cell(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return sanitizeCsvCell("");
  }

  return sanitizeCsvCell(String(value));
}

const HEADERS = [
  "Registration Reference",
  "Full Name",
  "Email",
  "Phone",
  "WhatsApp",
  "Location",
  "Experience Level",
  "Marketing Source",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "Welcome Email Sent At",
  "Payment Reminder Sent At",
  "Confirmation Email Sent At",
  "Payment Status",
  "Amount",
  "Paystack Reference",
  "Manual Sender Name",
  "Manual Sender Phone",
  "Manual Payment DateTime",
  "Manual Transaction Reference",
  "Created At",
  "Paid At",
] as const;

function toRow(
  registration: Registration & {
    manualPaymentSubmissions?: Array<{
      senderName: string;
      senderPhone: string;
      paymentDateTime: Date;
      transactionReference: string | null;
      isActive: boolean;
    }>;
  },
) {
  const active = registration.manualPaymentSubmissions?.find(
    (item) => item.isActive,
  );

  return [
    cell(registration.registrationReference),
    cell(registration.fullName),
    cell(registration.email),
    cell(registration.phone),
    cell(registration.whatsapp),
    cell(registration.location),
    cell(registration.experienceLevel),
    cell(formatMarketingSource(registration.marketingSource)),
    cell(registration.utmSource),
    cell(registration.utmMedium),
    cell(registration.utmCampaign),
    cell(registration.welcomeEmailSentAt?.toISOString() ?? ""),
    cell(registration.paymentReminderEmailSentAt?.toISOString() ?? ""),
    cell(registration.confirmationEmailSentAt?.toISOString() ?? ""),
    cell(registration.paymentStatus),
    cell(registration.amount.toString()),
    cell(registration.paystackReference),
    cell(active?.senderName ?? ""),
    cell(active?.senderPhone ?? ""),
    cell(active?.paymentDateTime.toISOString() ?? ""),
    cell(active?.transactionReference ?? ""),
    cell(registration.createdAt.toISOString()),
    cell(registration.paidAt?.toISOString() ?? ""),
  ].join(",");
}

export async function buildRegistrationsCsv(query: RegistrationListQuery) {
  const where = buildRegistrationWhereForExport(query);
  const registrations = await getPrismaClient().registration.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      manualPaymentSubmissions: {
        where: { isActive: true },
        take: 1,
      },
    },
  });

  const lines = [HEADERS.join(","), ...registrations.map(toRow)];
  return `${lines.join("\n")}\n`;
}

export type PaidWhatsAppContact = {
  registrationReference: string;
  fullName: string;
  whatsapp: string;
  whatsappDigits: string;
  paidAt: string | null;
};

function toDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function listPaidWhatsAppContacts(): Promise<PaidWhatsAppContact[]> {
  const registrations = await getPrismaClient().registration.findMany({
    where: {
      paymentStatus: "PAID",
      whatsapp: { not: "" },
    },
    orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
    select: {
      registrationReference: true,
      fullName: true,
      whatsapp: true,
      paidAt: true,
    },
  });

  const seen = new Set<string>();
  const contacts: PaidWhatsAppContact[] = [];

  for (const registration of registrations) {
    const whatsapp = registration.whatsapp.trim();
    const digits = toDigits(whatsapp);
    if (!digits || seen.has(digits)) {
      continue;
    }
    seen.add(digits);
    contacts.push({
      registrationReference: registration.registrationReference,
      fullName: registration.fullName,
      whatsapp,
      whatsappDigits: digits,
      paidAt: registration.paidAt?.toISOString() ?? null,
    });
  }

  return contacts;
}

export async function buildPaidWhatsAppContactsCsv() {
  const contacts = await listPaidWhatsAppContacts();
  const headers = [
    "Full Name",
    "WhatsApp",
    "WhatsApp Digits",
    "Registration Reference",
    "Paid At",
  ];
  const lines = [
    headers.join(","),
    ...contacts.map((contact) =>
      [
        cell(contact.fullName),
        cell(contact.whatsapp),
        cell(contact.whatsappDigits),
        cell(contact.registrationReference),
        cell(contact.paidAt ?? ""),
      ].join(","),
    ),
  ];
  return `${lines.join("\n")}\n`;
}

export async function buildPaidWhatsAppNumbersText() {
  const contacts = await listPaidWhatsAppContacts();
  return `${contacts.map((contact) => contact.whatsapp).join("\n")}\n`;
}

