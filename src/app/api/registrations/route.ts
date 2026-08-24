import { NextResponse } from "next/server";

import { createRegistrationRecord, isDuplicateEmailError } from "@/lib/registration.server";
import { validateRegistrationInput } from "@/lib/registration";
import type { RegistrationApiError, RegistrationApiSuccess } from "@/types/registration";

/**
 * Phase 3 note: lightweight in-memory rate limiting is intentionally not
 * added here. Prefer edge/CDN or host-level throttling for Hostinger
 * production hardening without introducing Redis for this phase.
 */

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

    const registration = await createRegistrationRecord(validation.data);

    return NextResponse.json<RegistrationApiSuccess>(
      {
        success: true,
        data: {
          registrationId: registration.id,
          registrationReference: registration.registrationReference,
          paymentStatus: registration.paymentStatus,
          amount: registration.amount.toString(),
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
            message: "A registration already exists with this email address.",
          },
        },
        { status: 409 },
      );
    }

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