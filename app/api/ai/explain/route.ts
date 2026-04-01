import { NextRequest, NextResponse } from "next/server";
import { runAiPrompt } from "@/lib/bookshelf/ai";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const title = body.title ?? "this book";
  const prompt = body.prompt ?? "";

  const output = await runAiPrompt(
    "You explain books in simple language for all reading levels. Avoid spoilers unless asked.",
    `Explain ${title} in simple terms. Additional context: ${prompt}`
  );

  return NextResponse.json({ output });
}