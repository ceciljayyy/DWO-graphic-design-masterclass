import { NextResponse } from "next/server";

import {
  applyVerifiedPaystackTransaction,
  toSafePaymentError,
} from "@/lib/payment.server";
import {
  verifyPaystackTransaction,
  verifyPaystackWebhookSignature,
} from "@/lib/paystack";

/**
 * Paystack server-to-server webhook.
 * Signature is verified against the raw request body before any processing.
 */

type PaystackWebhookPayload = {
  event?: string;
  data?: {
    reference?: string;
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  try {
    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_SIGNATURE",
            message: "Invalid webhook signature.",
          },
        },
        { status: 401 },
      );
    }

    const payload = JSON.parse(rawBody) as PaystackWebhookPayload;
    const event = payload.event ?? "";

    if (event !== "charge.success") {
      return NextResponse.json({
        success: true,
        data: { ignored: true, event },
      });
    }

    const reference = payload.data?.reference?.trim();

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_PAYMENT_REFERENCE",
            message: "Payment reference is required.",
          },
        },
        { status: 400 },
      );
    }

    // Independently re-verify with Paystack before updating payment status.
    const transaction = await verifyPaystackTransaction(reference);
    const result = await applyVerifiedPaystackTransaction(transaction);

    return NextResponse.json({
      success: true,
      data: {
        outcome: result.outcome,
        registrationReference: result.summary.registrationReference,
        paymentStatus: result.summary.paymentStatus,
      },
    });
  } catch (error) {
    const safe = toSafePaymentError(error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: safe.code,
          message: safe.message,
        },
      },
      { status: safe.status },
    );
  }
}
