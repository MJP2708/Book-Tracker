"use client";

import { useState } from "react";

type Mood = "Cozy" | "Deep" | "Quick";

const moodMeta: Record<Mood, string> = {
  Cozy: "Warm tea + low-pressure pages.",
  Deep: "Long focus block, no distractions.",
  Quick: "Fast chapter sprint before your next task.",
};

export function ReadingMoodSelector() {
  const [selected, setSelected] = useState<Mood>("Cozy");

  return (
    <section className="glass-card space-y-3">
      <div>
        <h2 className="display-title text-xl">Today&apos;s Reading Mood</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Pick your vibe and keep a daily streak.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["Cozy", "Deep", "Quick"] as Mood[]).map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => setSelected(mood)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selected === mood
                ? "bg-amber-500 text-[#2f241c]"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      <p className="text-sm text-amber-700 dark:text-amber-300">{moodMeta[selected]}</p>
    </section>
  );
}