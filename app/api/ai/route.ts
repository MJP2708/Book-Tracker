export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type AiPayload = {
  question?: string;
  bookTitle?: string;
  currentPage?: number;
};

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as AiPayload;
  const question = String(body.question || "").trim();
  const bookTitle = String(body.bookTitle || "Project Hail Mary").trim();
  const currentPage = Number(body.currentPage || 0);

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ANTHROPIC_API_KEY on server" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system:
          "You are a helpful reading assistant for the Bookshelf app. Be warm, concise, and insightful. The user is currently reading Project Hail Mary by Andy Weir.",
        messages: [
          {
            role: "user",
            content: `Book: ${bookTitle}\nCurrent page: ${currentPage}\nQuestion: ${question}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Anthropic request failed", detail: errorText },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };

    const answer =
      payload.content?.find((block) => block.type === "text")?.text ||
      "I could not generate a response right now.";

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      {
        error: "AI request failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
