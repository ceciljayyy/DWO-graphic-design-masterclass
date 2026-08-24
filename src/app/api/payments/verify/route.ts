import { NextResponse } from "next/server";

import {
  toSafePaymentError,
  verifyPaymentByPaystackReference,
} from "@/lib/payment.server";
import type { PaymentApiError, PaymentVerifySuccess } from "@/types/payment";

/**
 * Phase 4 note: verification is idempotent. Repeated calls for an already
 * paid registration return the current paid summary without mutating state.
 */

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as {
      reference?: unknown;
    } | null;

    const reference =
      typeof payload?.reference === "string" ? payload.reference : "";

    const result = await verifyPaymentByPaystackReference(reference);

    return NextResponse.json<PaymentVerifySuccess>({
      success: true,
      data: result,
    });
  } catch (error) {
    const safe = toSafePaymentError(error);

    return NextResponse.json<PaymentApiError>(
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference") ?? "";

    const result = await verifyPaymentByPaystackReference(reference);

    return NextResponse.json<PaymentVerifySuccess>({
      success: true,
      data: result,
    });
  } catch (error) {
    const safe = toSafePaymentError(error);

    return NextResponse.json<PaymentApiError>(
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
