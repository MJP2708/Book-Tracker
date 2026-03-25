export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Direct signup endpoint is disabled. Use /auth/signup.",
    },
    { status: 410 }
  );
}
