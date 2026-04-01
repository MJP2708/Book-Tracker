export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { getAiInsights } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { text?: string };
  const text = String(body.text || "").trim();
  if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });
  return NextResponse.json(getAiInsights(text));
}
