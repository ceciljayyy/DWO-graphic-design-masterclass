import { NextResponse } from "next/server";

import { buildRegistrationsCsv } from "@/lib/admin/export";
import { parseRegistrationListQuery } from "@/lib/admin/registrations";
import { requireAdminApi, writeAdminAuditLog } from "@/lib/auth/admin";

export async function GET(request: Request) {
  const { admin, error } = await requireAdminApi();
  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = parseRegistrationListQuery(searchParams);
    const csv = await buildRegistrationsCsv(query);

    await writeAdminAuditLog({
      adminId: admin?.sub,
      action: "EXPORT_CSV",
      metadata: {
        paymentStatus: query.paymentStatus,
        experienceLevel: query.experienceLevel,
        dateRange: query.dateRange,
        q: query.q ?? null,
      },
    });

    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="dwo-registrations-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EXPORT_ERROR",
          message: "Unable to export registrations. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
