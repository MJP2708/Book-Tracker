import { NextRequest, NextResponse } from "next/server";
import { runAiPrompt } from "@/lib/bookshelf/ai";
import { requirePremiumForApi } from "@/lib/monetization/guards";

export async function POST(request: NextRequest) {
  const premium = await requirePremiumForApi();
  if (!premium.allowed) {
    return premium.response!;
  }

  const body = await request.json();
  const title = body.title ?? "this book";
  const prompt = body.prompt ?? "";

  const output = await runAiPrompt(
    "You are an expert reading assistant. Give concise and accurate summaries in 3-6 bullet points.",
    `Summarize the book ${title}. Extra context: ${prompt}`
  );

  return NextResponse.json({ output });
}
