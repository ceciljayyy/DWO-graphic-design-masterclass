import { NextResponse } from "next/server";

import {
  initializePaymentForRegistration,
  toSafePaymentError,
} from "@/lib/payment.server";
import type {
  PaymentApiError,
  PaymentInitializeSuccess,
} from "@/types/payment";

/**
 * Phase 4 note: lightweight rate limiting is intentionally omitted.
 * Prefer CDN / host-level throttling on Hostinger for production hardening.
 */

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as {
      registrationReference?: unknown;
    } | null;

    const registrationReference =
      typeof payload?.registrationReference === "string"
        ? payload.registrationReference
        : "";

    const result = await initializePaymentForRegistration(registrationReference);

    return NextResponse.json<PaymentInitializeSuccess>(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    );
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
