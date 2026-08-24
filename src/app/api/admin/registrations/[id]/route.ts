import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/admin";
import { getRegistrationById } from "@/lib/admin/registrations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminApi();
  if (error) {
    return error;
  }

  try {
    const { id } = await context.params;
    const registration = await getRegistrationById(id);

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Registration not found.",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: registration });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REGISTRATION_DETAIL_ERROR",
          message: "Unable to load registration details. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
