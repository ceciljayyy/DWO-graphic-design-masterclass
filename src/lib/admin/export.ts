import type { Registration } from "@prisma/client";

import {
  buildRegistrationWhereForExport,
  type RegistrationListQuery,
} from "@/lib/admin/registrations";
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
  "Payment Status",
  "Amount",
  "Paystack Reference",
  "Created At",
  "Paid At",
] as const;

function toRow(registration: Registration) {
  return [
    cell(registration.registrationReference),
    cell(registration.fullName),
    cell(registration.email),
    cell(registration.phone),
    cell(registration.whatsapp),
    cell(registration.location),
    cell(registration.experienceLevel),
    cell(registration.paymentStatus),
    cell(registration.amount.toString()),
    cell(registration.paystackReference),
    cell(registration.createdAt.toISOString()),
    cell(registration.paidAt?.toISOString() ?? ""),
  ].join(",");
}

export async function buildRegistrationsCsv(query: RegistrationListQuery) {
  const where = buildRegistrationWhereForExport(query);
  const registrations = await getPrismaClient().registration.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const lines = [HEADERS.join(","), ...registrations.map(toRow)];
  return `${lines.join("\n")}\n`;
}
