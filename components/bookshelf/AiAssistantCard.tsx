"use client";

import { type KeyboardEventHandler, useMemo, useState } from "react";

type AssistantMode = "summarize" | "explain" | "recommend" | "quiz" | "themes";

type AiAssistantCardProps = {
  bookTitle?: string;
};

const modeLabels: Record<AssistantMode, string> = {
  summarize: "Summarize",
  explain: "Explain",
  recommend: "Recommend",
  quiz: "Quiz",
  themes: "Themes",
};

export function AiAssistantCard({ bookTitle }: AiAssistantCardProps) {
  const [mode, setMode] = useState<AssistantMode>("recommend");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const placeholder = useMemo(() => {
    switch (mode) {
      case "summarize":
        return "Summarize this in bullet points with key takeaways.";
      case "explain":
        return "Explain this book like I&apos;m 12.";
      case "recommend":
        return "I liked Atomic Habits, what should I read next?";
      case "quiz":
        return "Give me a 5-question quiz about this book.";
      case "themes":
        return "What are the core themes and symbols?";
      default:
        return "Ask anything about this book";
    }
  }, [mode]);

  const submit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt, title: bookTitle }),
      });
      const data = await res.json();
      setResponse(data.output || data.message || "No response available.");
    } catch {
      setResponse("Unable to contact AI assistant right now.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <section className="glass-card space-y-3">
      <div>
        <h2 className="display-title text-xl">AI Reading Assistant</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Claude-powered helper for deep understanding.</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {(Object.keys(modeLabels) as AssistantMode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`rounded-full px-3 py-1 ${
              mode === item
                ? "bg-amber-500 text-[#2f241c]"
                : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
            }`}
          >
            {modeLabels[item]}
          </button>
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="h-24 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-amber-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
      />

      <button type="button" onClick={submit} disabled={loading} className="primary-btn text-xs">
        {loading ? "Thinking..." : "Ask"}
      </button>

      {response ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
          {response}
        </div>
      ) : null}
    </section>
  );
}
