import { masterclass } from "@/lib/masterclass";
import type { PaymentSummaryData } from "@/types/payment";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPaidAt(paidAt: string | null) {
  if (!paidAt) {
    return "Confirmed";
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(paidAt));
  } catch {
    return paidAt;
  }
}

function formatPaymentStatus(status: string) {
  if (status === "PENDING") return "Pending";
  if (status === "PAID") return "Paid";
  if (status === "FAILED") return "Failed";
  return status;
}

export function buildRegistrationReceiptHtml(summary: PaymentSummaryData) {
  const phones = masterclass.contact.phoneNumbers
    .map((phone) => escapeHtml(phone.label))
    .join(" · ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DWO Receipt — ${escapeHtml(summary.registrationReference)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f3eb;
      --card: #fffdf9;
      --ink: #1a1210;
      --muted: #6f6258;
      --line: #e4ddd3;
      --accent: #c9921a;
      --red: #a10f16;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px 16px;
      font-family: "Segoe UI", Arial, sans-serif;
      background: var(--bg);
      color: var(--ink);
    }
    .receipt {
      max-width: 640px;
      margin: 0 auto;
      background: var(--card);
      border: 1px solid var(--line);
      padding: 32px;
    }
    .eyebrow {
      margin: 0;
      font-size: 11px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 700;
    }
    h1 {
      margin: 12px 0 0;
      font-size: 28px;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      line-height: 1;
    }
    .brand {
      margin-top: 8px;
      font-size: 13px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .intro {
      margin: 18px 0 0;
      color: var(--muted);
      line-height: 1.6;
      font-size: 14px;
    }
    .divider {
      height: 1px;
      background: var(--line);
      margin: 24px 0;
    }
    .row {
      border: 1px solid var(--line);
      padding: 14px 16px;
      margin-bottom: 10px;
    }
    .label {
      margin: 0;
      font-size: 11px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 700;
    }
    .value {
      margin: 8px 0 0;
      font-size: 16px;
      font-weight: 600;
    }
    .value.large {
      font-size: 20px;
      letter-spacing: 0.02em;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: var(--muted);
      line-height: 1.7;
    }
    @media print {
      body { background: white; padding: 0; }
      .receipt { border: none; max-width: none; }
    }
  </style>
</head>
<body>
  <article class="receipt">
    <p class="eyebrow">Payment receipt</p>
    <h1>Registration confirmed</h1>
    <p class="brand">${escapeHtml(masterclass.brand)} · ${escapeHtml(masterclass.brandFull)}</p>
    <p class="intro">
      This receipt confirms payment for the ${escapeHtml(summary.courseName)}.
      Keep it for your records.
    </p>
    <div class="divider"></div>
    <div class="row">
      <p class="label">Participant</p>
      <p class="value">${escapeHtml(summary.fullName)}</p>
    </div>
    <div class="row">
      <p class="label">Course</p>
      <p class="value large">${escapeHtml(summary.courseName)}</p>
    </div>
    <div class="row">
      <p class="label">Registration reference</p>
      <p class="value large">${escapeHtml(summary.registrationReference)}</p>
    </div>
    ${
      summary.paystackReference
        ? `<div class="row">
      <p class="label">Payment reference</p>
      <p class="value">${escapeHtml(summary.paystackReference)}</p>
    </div>`
        : ""
    }
    <div class="grid">
      <div class="row">
        <p class="label">Amount paid</p>
        <p class="value large">${escapeHtml(summary.amountDisplay)}</p>
      </div>
      <div class="row">
        <p class="label">Payment status</p>
        <p class="value">${escapeHtml(formatPaymentStatus(summary.paymentStatus))}</p>
      </div>
    </div>
    <div class="row">
      <p class="label">Paid at</p>
      <p class="value">${escapeHtml(formatPaidAt(summary.paidAt))}</p>
    </div>
    <div class="row">
      <p class="label">Course period</p>
      <p class="value">${escapeHtml(masterclass.coursePeriod.display)}</p>
    </div>
    <p class="footer">
      ${escapeHtml(masterclass.brandFull)} · ${escapeHtml(masterclass.name)}<br />
      ${phones}<br />
      ${escapeHtml(masterclass.contact.instagram.handle)}
    </p>
  </article>
</body>
</html>`;
}

export function downloadRegistrationReceipt(summary: PaymentSummaryData) {
  const html = buildRegistrationReceiptHtml(summary);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `DWO-receipt-${summary.registrationReference}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
