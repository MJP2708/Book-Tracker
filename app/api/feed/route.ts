export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { getActivityFeed } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getActivityFeed());
}
