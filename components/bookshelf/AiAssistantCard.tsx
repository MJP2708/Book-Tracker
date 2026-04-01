"use client";

import { useState } from "react";

type ActionMode = "summarize" | "explain" | "recommend" | "ask";

type AiAssistantCardProps = {
  bookTitle?: string;
};

export function AiAssistantCard({ bookTitle }: AiAssistantCardProps) {
  const [mode, setMode] = useState<ActionMode>("recommend");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setResponse("");

    const route = mode === "summarize" ? "/api/ai/summarize" : mode === "explain" ? "/api/ai/explain" : "/api/ai/chat";

    try {
      const payload =
        mode === "recommend"
          ? { question: "Recommend similar books", context: prompt || bookTitle }
          : mode === "ask"
            ? { question: prompt, context: bookTitle }
            : { title: bookTitle, prompt };

      const res = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(data.output || data.message || "No response available.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-card space-y-3">
      <div>
        <h2 className="display-title text-xl">AI Reading Assistant</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Summaries, explanations, and tailored recommendations.</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {(["recommend", "summarize", "explain", "ask"] as ActionMode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`rounded-full px-3 py-1 ${mode === item ? "bg-emerald-700 text-white" : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Ask something about your next read..."
        className="h-24 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
      />

      <button type="button" onClick={submit} disabled={loading} className="primary-btn text-xs">
        {loading ? "Thinking..." : "Run AI"}
      </button>

      {response ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm dark:border-emerald-800 dark:bg-emerald-950/30">
          {response}
        </div>
      ) : null}
    </section>
  );
}