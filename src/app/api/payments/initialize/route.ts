import { NextResponse } from "next/server";

import {
  initializePaymentForRegistration,
  toSafePaymentError,
} from "@/lib/payment.server";
import type {
  PaymentApiError,
  PaymentInitializeSuccess,
} from "@/types/payment";

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
