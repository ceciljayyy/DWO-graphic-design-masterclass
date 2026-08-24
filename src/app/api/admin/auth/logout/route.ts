import { NextResponse } from "next/server";

import {
  destroyAdminSession,
  getCurrentAdmin,
  writeAdminAuditLog,
} from "@/lib/auth/admin";

export async function POST() {
  const admin = await getCurrentAdmin();
  await destroyAdminSession();

  if (admin) {
    await writeAdminAuditLog({
      adminId: admin.sub,
      action: "LOGOUT",
    });
  }

  return NextResponse.json({ success: true });
}
