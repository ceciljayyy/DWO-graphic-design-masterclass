import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/admin";
import {
  ManualPaymentError,
  verifyManualPaymentAsAdmin,
} from "@/lib/manual-payment.server";

type RouteContext = {
  params: Promise<{ registrationId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { admin, error } = await requireAdminApi();
  if (error || !admin) {
    return error;
  }

  try {
    const { registrationId } = await context.params;

    const result = await verifyManualPaymentAsAdmin({
      registrationId,
      adminId: admin.sub,
      adminName: admin.name,
    });

    return NextResponse.json({
      success: true,
      data: {
        alreadyPaid: result.alreadyPaid,
        paymentStatus: result.registration.paymentStatus,
        registrationReference: result.registration.registrationReference,
        paidAt: result.registration.paidAt?.toISOString() ?? null,
      },
    });
  } catch (err) {
    if (err instanceof ManualPaymentError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
        },
        { status: err.status },
      );
    }

    console.error("[admin] verify manual payment failed", err);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VERIFY_ERROR",
          message: "We could not verify this payment right now.",
        },
      },
      { status: 500 },
    );
  }
}
