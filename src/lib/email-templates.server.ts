import "server-only";

import { masterclass } from "@/lib/masterclass";

export type EmailDetailRow = {
  label: string;
  value: string;
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getAppBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  if (!appUrl) {
    return "http://localhost:3000";
  }

  return appUrl;
}

export function getRegisterUrl() {
  return `${getAppBaseUrl()}/register`;
}

export function buildContactTextLines() {
  return [
    ...masterclass.contact.phoneNumbers.map((item) => item.label),
    masterclass.contact.instagram.handle,
  ];
}

export function buildContactHtml() {
  const lines = [
    ...masterclass.contact.phoneNumbers.map((item) => escapeHtml(item.label)),
    escapeHtml(masterclass.contact.instagram.handle),
  ];

  return lines.join("<br/>");
}

export function buildBrandedEmailHtml({
  greeting,
  paragraphs,
  detailRows = [],
  ctaLabel,
  ctaHref,
}: {
  greeting: string;
  paragraphs: string[];
  detailRows?: EmailDetailRow[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const detailsTable =
    detailRows.length === 0
      ? ""
      : `
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        ${detailRows
          .map(
            (row) => `
          <tr>
            <td style="padding: 8px 0; color: #666; vertical-align: top;">${escapeHtml(row.label)}</td>
            <td style="padding: 8px 0; font-weight: bold;">${escapeHtml(row.value)}</td>
          </tr>`,
          )
          .join("")}
      </table>`;

  const ctaBlock =
    ctaLabel && ctaHref
      ? `
      <p style="margin: 28px 0;">
        <a href="${escapeHtml(ctaHref)}" style="display: inline-block; background: #c9a227; color: #0a0505; text-decoration: none; padding: 12px 20px; font-weight: bold;">
          ${escapeHtml(ctaLabel)}
        </a>
      </p>`
      : "";

  return `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 560px;">
      <p>${escapeHtml(greeting)}</p>
      ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      ${detailsTable}
      ${ctaBlock}
      <p style="color: #666;">
        Questions? Contact us:<br/>
        ${buildContactHtml()}
      </p>
      <p>— ${escapeHtml(masterclass.brand)} (${escapeHtml(masterclass.brandFull)})</p>
    </div>
  `;
}

export function buildBrandedEmailText({
  greeting,
  paragraphs,
  detailRows = [],
  ctaLabel,
  ctaHref,
}: {
  greeting: string;
  paragraphs: string[];
  detailRows?: EmailDetailRow[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const detailLines =
    detailRows.length === 0
      ? []
      : ["", ...detailRows.map((row) => `${row.label}: ${row.value}`)];

  const ctaLines =
    ctaLabel && ctaHref ? ["", `${ctaLabel}: ${ctaHref}`] : [];

  return [
    greeting,
    "",
    ...paragraphs,
    ...detailLines,
    ...ctaLines,
    "",
    "If you have any questions, contact us:",
    ...buildContactTextLines(),
    "",
    `— ${masterclass.brand} (${masterclass.brandFull})`,
  ].join("\n");
}

export function getFirstName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "there";
  }

  return trimmed.split(/\s+/)[0] ?? trimmed;
}
