import { NextResponse } from "next/server";

import { parseAnalyticsRange } from "@/lib/admin/analytics";
import { getRegistrationAnalytics } from "@/lib/admin/analytics.server";
import { requireAdminApi } from "@/lib/auth/admin";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(request.url);
    const range = parseAnalyticsRange(searchParams.get("range"));
    const data = await getRegistrationAnalytics(range);

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
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
