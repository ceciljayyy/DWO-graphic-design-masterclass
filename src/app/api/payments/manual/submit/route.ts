import { NextResponse } from "next/server";

import {
  ManualPaymentError,
  submitManualPaymentDetails,
} from "@/lib/manual-payment.server";
import { isManualPaymentMode } from "@/lib/payment-mode";

export async function POST(request: Request) {
  if (!isManualPaymentMode()) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "MANUAL_MODE_DISABLED",
          message: "Manual payment submission is not active.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const payload = await request.json().catch(() => null);
    const result = await submitManualPaymentDetails(payload);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ManualPaymentError) {
      const fieldErrors =
        "fieldErrors" in error
          ? (error as ManualPaymentError & {
              fieldErrors?: Record<string, string>;
            }).fieldErrors
          : undefined;

      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            fieldErrors,
          },
        },
        { status: error.status },
      );
    }

    console.error("[manual-payment] submit failed", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SUBMISSION_ERROR",
          message:
            "Something went wrong. Your registration has not been deleted. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
