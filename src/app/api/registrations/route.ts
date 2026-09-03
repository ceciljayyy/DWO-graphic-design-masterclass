import { NextResponse } from "next/server";

import {
  createRegistrationRecord,
  getDuplicateRegistrationMessage,
  isDuplicateEmailError,
} from "@/lib/registration.server";
import { maybeSendWelcomeEmail } from "@/lib/registration-communication.server";
import { isDatabaseConnectionError } from "@/lib/prisma";
import { validateRegistrationInput } from "@/lib/registration";
import { isCityInCountry } from "@/lib/locations";
import { getPaymentMode } from "@/lib/payment-mode";
import type { RegistrationApiError, RegistrationApiSuccess } from "@/types/registration";

export function GET() {
  return NextResponse.json<RegistrationApiError>(
    {
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are allowed for this endpoint.",
      },
    },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const validation = validateRegistrationInput(payload);

    if (validation.success === false) {
      const { errors } = validation;

      return NextResponse.json<RegistrationApiError>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please correct the highlighted fields.",
            fieldErrors: errors,
          },
        },
        { status: 400 },
      );
    }

    if (
      !isCityInCountry(validation.data.location, validation.data.countryCode)
    ) {
      return NextResponse.json<RegistrationApiError>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please correct the highlighted fields.",
            fieldErrors: {
              location: "Please select your city or town.",
            },
          },
        },
        { status: 400 },
      );
    }

    const registration = await createRegistrationRecord(validation.data);

    void maybeSendWelcomeEmail(registration);

    return NextResponse.json<RegistrationApiSuccess>(
      {
        success: true,
        data: {
          registrationId: registration.id,
          registrationReference: registration.registrationReference,
          paymentAccessToken: registration.paymentAccessToken,
          paymentStatus: registration.paymentStatus,
          amount: registration.amount.toString(),
          paymentMode: getPaymentMode(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return NextResponse.json<RegistrationApiError>(
        {
          success: false,
          error: {
            code: "DUPLICATE_REGISTRATION",
            message: getDuplicateRegistrationMessage(error),
            fieldErrors: {
              email: "This email is already registered.",
            },
          },
        },
        { status: 409 },
      );
    }

    if (isDatabaseConnectionError(error)) {
      console.error("[registrations] database unavailable", error);

      return NextResponse.json<RegistrationApiError>(
        {
          success: false,
          error: {
            code: "DATABASE_UNAVAILABLE",
            message:
              "The registration service is temporarily unavailable. Please try again shortly.",
          },
        },
        { status: 503 },
      );
    }

    console.error("[registrations] create failed", error);

    return NextResponse.json<RegistrationApiError>(
      {
        success: false,
        error: {
          code: "REGISTRATION_ERROR",
          message: "We could not complete the registration right now. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
