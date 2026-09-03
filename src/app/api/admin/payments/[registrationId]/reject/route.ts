import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/admin";
import {
  ManualPaymentError,
  rejectManualPaymentAsAdmin,
} from "@/lib/manual-payment.server";

type RouteContext = {
  params: Promise<{ registrationId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { admin, error } = await requireAdminApi();
  if (error || !admin) {
    return error;
  }

  try {
    const { registrationId } = await context.params;
    const body = (await request.json().catch(() => null)) as {
      adminNote?: unknown;
    } | null;

    const adminNote =
      typeof body?.adminNote === "string" ? body.adminNote : null;

    const registration = await rejectManualPaymentAsAdmin({
      registrationId,
      adminId: admin.sub,
      adminName: admin.name,
      adminNote,
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentStatus: registration.paymentStatus,
        registrationReference: registration.registrationReference,
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

    console.error("[admin] reject manual payment failed", err);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REJECT_ERROR",
          message: "We could not reject this payment right now.",
        },
      },
      { status: 500 },
    );
  }
}
