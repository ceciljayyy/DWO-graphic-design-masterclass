import { NextResponse } from "next/server";

import {
  buildPaidWhatsAppContactsCsv,
  buildPaidWhatsAppNumbersText,
} from "@/lib/admin/export";
import { requireAdminApi, writeAdminAuditLog } from "@/lib/auth/admin";

export async function GET(request: Request) {
  const { admin, error } = await requireAdminApi();
  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") === "txt" ? "txt" : "csv";
    const stamp = new Date().toISOString().slice(0, 10);

    if (format === "txt") {
      const text = await buildPaidWhatsAppNumbersText();

      await writeAdminAuditLog({
        adminId: admin?.sub,
        action: "EXPORT_PAID_WHATSAPP_NUMBERS",
        metadata: { format: "txt" },
      });

      return new NextResponse(text, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="dwo-paid-whatsapp-numbers-${stamp}.txt"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const csv = await buildPaidWhatsAppContactsCsv();

    await writeAdminAuditLog({
      adminId: admin?.sub,
      action: "EXPORT_PAID_WHATSAPP_CONTACTS",
      metadata: { format: "csv" },
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="dwo-paid-whatsapp-contacts-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EXPORT_ERROR",
          message: "Unable to export WhatsApp contacts. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
