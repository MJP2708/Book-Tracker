import OpenAI from "openai";
import { getEnv } from "@/lib/env";

let cached: OpenAI | null = null;

export function getOpenAIClient() {
  const env = getEnv();

  if (!env.openAiApiKey) {
    return null;
  }

  if (!cached) {
    cached = new OpenAI({ apiKey: env.openAiApiKey });
  }

  return cached;
}