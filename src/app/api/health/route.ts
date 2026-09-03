import { NextResponse } from "next/server";

import {
  getPrismaClient,
  isDatabaseConnectionError,
} from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deep = url.searchParams.get("deep") === "1";

  if (!deep) {
    return NextResponse.json({
      status: "ok",
      service: "dwo-graphic-design-masterclass",
    });
  }

  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      service: "dwo-graphic-design-masterclass",
      database: "ok",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        status: "degraded",
        service: "dwo-graphic-design-masterclass",
        database: isDatabaseConnectionError(error) ? "unreachable" : "error",
        error: message,
      },
      { status: 503 },
    );
  }
}
