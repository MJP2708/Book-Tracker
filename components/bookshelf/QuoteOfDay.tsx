"use client";

import { useMemo } from "react";

const quotes = [
  "A reader lives a thousand lives before he dies.",
  "There is no friend as loyal as a book.",
  "Books are mirrors: you only see what you already have inside you.",
  "The only thing that you absolutely have to know is the location of the library.",
  "Reading is to the mind what exercise is to the body.",
];

const authors = ["George R.R. Martin", "Ernest Hemingway", "Carlos Ruiz Zafon", "Albert Einstein", "Joseph Addison"];

export function QuoteOfDay() {
  const dayIndex = useMemo(() => {
    const now = new Date();
    const dayOfYear = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
    return dayOfYear % quotes.length;
  }, []);

  return (
    <section className="glass-card space-y-2">
      <p className="text-xs uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Quote of the Day</p>
      <blockquote className="display-title text-2xl leading-snug">&quot;{quotes[dayIndex]}&quot;</blockquote>
      <p className="text-sm text-stone-500 dark:text-stone-400">{authors[dayIndex]}</p>
    </section>
  );
}