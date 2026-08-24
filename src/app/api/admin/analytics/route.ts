import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/admin";
import { getDashboardAnalytics } from "@/lib/admin/registrations";

export async function GET() {
  const { admin, error } = await requireAdminApi();
  if (error) {
    return error;
  }

  try {
    const data = await getDashboardAnalytics();
    return NextResponse.json({ success: true, data, admin });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ANALYTICS_ERROR",
          message: "Unable to load analytics. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
