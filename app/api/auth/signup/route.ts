export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Credentials signup is disabled. Use Google authentication.",
    },
    { status: 410 }
  );
}
