import { NextRequest, NextResponse } from "next/server";
import { requirePremiumForApi } from "@/lib/monetization/guards";

const defaultModel = process.env.CLAUDE_MODEL ?? "claude-3-7-sonnet-20250219";

const modePrompts = {
  summarize: "Provide a concise, spoiler-safe summary with key points.",
  explain: "Explain the main ideas simply, as if teaching a new reader.",
  recommend: "Recommend similar books and explain why each fits.",
  quiz: "Create a short quiz with answers at the end.",
  themes: "Analyze central themes, motifs, and symbolism clearly.",
} as const;

export async function POST(request: NextRequest) {
  const premium = await requirePremiumForApi();
  if (!premium.allowed) {
    return premium.response!;
  }

  const { mode, prompt, title } = (await request.json()) as {
    mode?: keyof typeof modePrompts;
    prompt?: string;
    title?: string;
  };

  const selectedMode = mode && mode in modePrompts ? mode : "recommend";
  const userPrompt = String(prompt || "").trim();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      output: "Claude API is not configured. Add ANTHROPIC_API_KEY in your environment to enable the assistant.",
    });
  }

  const system = `You are Bookshelf AI, a warm literary assistant. ${modePrompts[selectedMode]}`;

  const finalPrompt = [
    title ? `Book context: ${title}` : null,
    `Mode: ${selectedMode}`,
    `User request: ${userPrompt || "Provide the best useful response for this mode."}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: defaultModel,
        max_tokens: 900,
        system,
        messages: [{ role: "user", content: finalPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Claude request failed", details: errorText }, { status: 500 });
    }

    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };

    const output = payload.content
      ?.filter((chunk) => chunk.type === "text")
      .map((chunk) => chunk.text || "")
      .join("\n\n")
      .trim();

    return NextResponse.json({ output: output || "No response generated." });
  } catch {
    return NextResponse.json({ error: "Claude API request failed" }, { status: 500 });
  }
}