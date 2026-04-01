import { getEnv } from "@/lib/env";
import { getOpenAIClient } from "@/lib/openai";

export async function runAiPrompt(system: string, user: string) {
  const client = getOpenAIClient();
  const env = getEnv();

  if (!client) {
    return "AI is not configured yet. Add OPENAI_API_KEY to enable summaries and recommendations.";
  }

  const completion = await client.responses.create({
    model: env.openAiModel,
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return completion.output_text || "No AI response generated.";
}