import { NextResponse } from "next/server";

import { isReconciliationAuthorized } from "@/lib/payment-reconciliation.server";
import { sendPendingPaymentReminders } from "@/lib/registration-communication.server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handlePaymentReminders(request: Request) {
  if (!isReconciliationAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid cron credentials.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const report = await sendPendingPaymentReminders();

    return NextResponse.json(
      {
        success: true,
        data: report,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PAYMENT_REMINDER_ERROR",
          message: "Pending payment reminders could not be processed.",
        },
      },
      { status: 500 },
    );
  }
}

/**
 * Sends one pending-payment reminder per unpaid registration after the
 * configured waiting period (default 24 hours).
 *
 * Auth: Authorization: Bearer <PAYMENT_RECONCILIATION_SECRET or CRON_SECRET>
 *   or header x-reconciliation-secret
 */
export async function GET(request: Request) {
  return handlePaymentReminders(request);
}

export async function POST(request: Request) {
  return handlePaymentReminders(request);
}
