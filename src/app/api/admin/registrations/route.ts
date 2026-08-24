import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/admin";
import {
  listRegistrations,
  parseRegistrationListQuery,
} from "@/lib/admin/registrations";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = parseRegistrationListQuery(searchParams);
    const data = await listRegistrations(query);

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REGISTRATIONS_ERROR",
          message: "Unable to load registrations. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
