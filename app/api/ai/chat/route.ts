import { NextRequest, NextResponse } from "next/server";
import { runAiPrompt } from "@/lib/bookshelf/ai";
import { requirePremiumForApi } from "@/lib/monetization/guards";

export async function POST(request: NextRequest) {
  const premium = await requirePremiumForApi();
  if (!premium.allowed) {
    return premium.response!;
  }

  const body = await request.json();
  const question = body.question ?? "Recommend similar books";
  const context = body.context ?? "";

  const output = await runAiPrompt(
    "You are Bookshelf AI. Give practical reading advice and recommendations in a warm, concise way.",
    `Question: ${question}\nContext: ${context}`
  );

  return NextResponse.json({ output });
}
