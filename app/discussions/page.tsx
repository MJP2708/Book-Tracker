"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useState } from "react";

type Topic = "all" | "theory" | "quotes" | "pace";

const threads = [
  { id: 1, topic: "theory", title: "Project Hail Mary chapter 4 theory", body: "How does the author plant the reveal so early without making it obvious?", votes: 32, replies: 18 },
  { id: 2, topic: "quotes", title: "Best quote this week", body: "Share one line that changed your interpretation of the chapter.", votes: 17, replies: 11 },
  { id: 3, topic: "pace", title: "Should we pace 50 pages per week?", body: "Trying to keep up while leaving space for annotation and discussion.", votes: 12, replies: 7 },
];

export default function DiscussionsPage() {
  const [topic, setTopic] = useState<Topic>("all");
  const [joined, setJoined] = useState<number[]>([]);

  const visible = topic === "all" ? threads : threads.filter((t) => t.topic === topic);

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="premium-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-3xl">Discussions</p>
                <p className="text-sm text-[var(--ink3)]">Threaded ideas from clubs and public readers.</p>
              </div>
              <button className="premium-btn-primary">Start thread</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {["all", "theory", "quotes", "pace"].map((t) => (
                <button key={t} onClick={() => setTopic(t as Topic)} className={`rounded-full px-3 py-1 ${topic === t ? "bg-[var(--ink)] text-white" : "border border-[var(--bg3)] text-[var(--ink2)]"}`}>{t[0].toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            {visible.map((thread) => {
              const inThread = joined.includes(thread.id);
              return (
                <article key={thread.id} className="premium-card p-5">
                  <span className="rounded-full bg-[var(--bg2)] px-2 py-1 text-xs text-[var(--ink3)]">#{thread.topic}</span>
                  <p className="font-display mt-2 text-2xl">{thread.title}</p>
                  <p className="mt-2 text-sm text-[var(--ink2)]">{thread.body}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <button className="rounded-full border border-[var(--bg3)] px-2 py-1">▲ {thread.votes}</button>
                    <button className="rounded-full border border-[var(--bg3)] px-2 py-1">💬 {thread.replies}</button>
                    <button className={`rounded-full px-3 py-1 ${inThread ? "bg-[var(--teal3)] text-[var(--teal)]" : "bg-[var(--gold3)] text-[var(--gold)]"}`} onClick={() => setJoined((prev) => inThread ? prev.filter((id) => id !== thread.id) : [...prev, thread.id])}>{inThread ? "Following" : "Join"}</button>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}
