"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const bars = [
  { genre: "Sci-Fi", value: 42, color: "bg-[var(--pur)]" },
  { genre: "Non-Fiction", value: 31, color: "bg-[var(--teal)]" },
  { genre: "Fiction", value: 52, color: "bg-[var(--gold)]" },
  { genre: "Philosophy", value: 17, color: "bg-[var(--rose)]" },
];

const timeline = [
  { month: "Jan", pages: 520 },
  { month: "Feb", pages: 640 },
  { month: "Mar", pages: 710 },
  { month: "Apr", pages: 580 },
  { month: "May", pages: 810 },
  { month: "Jun", pages: 690 },
];

export default function StatsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [pro, setPro] = useState(false);

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="premium-card overflow-hidden bg-[var(--ink)] p-5 text-white sm:p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--gold2)]">Reading Intelligence</p>
            <p className="font-display mt-2 text-3xl">Your Reading Analytics</p>
            <p className="mt-2 text-sm text-white/70">Unlock deeper trend modeling and predictive pacing with Pro.</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[{ k: "Books", v: "20" }, { k: "Pages", v: "1,824" }, { k: "Streak", v: "12 days" }, { k: "Avg speed", v: "24 ppd" }].map((item) => (
              <article key={item.k} className="premium-card p-4">
                <p className="text-xs text-[var(--ink3)]">{item.k}</p>
                <p className="font-display mt-1 text-2xl">{item.v}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <article className="premium-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-xl">Monthly Reading Pattern</p>
                <span className="rounded-full bg-[var(--teal3)] px-2 py-1 text-xs text-[var(--teal)]">Demo data</span>
              </div>
              <div className="flex h-44 items-end gap-2 rounded-xl bg-[var(--bg2)] p-3">
                {timeline.map((t) => (
                  <div key={t.month} className="flex-1">
                    <div className="mx-auto w-full max-w-[38px] rounded-t-md bg-[var(--gold2)]" style={{ height: `${Math.max(14, Math.round((t.pages / 900) * 130))}px` }} />
                    <p className="mt-2 text-center text-xs text-[var(--ink3)]">{t.month}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="premium-card p-5 sm:p-6">
              <p className="font-display text-xl">Genre Breakdown</p>
              <div className="mt-3 space-y-2">
                {bars.map((bar) => (
                  <div key={bar.genre}>
                    <div className="mb-1 flex items-center justify-between text-xs text-[var(--ink3)]"><span>{bar.genre}</span><span>{bar.value}%</span></div>
                    <div className="h-2 rounded-full bg-[var(--bg3)]"><div className={`${bar.color} h-full rounded-full`} style={{ width: `${bar.value}%` }} /></div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className={`premium-card p-5 sm:p-6 ${!pro ? "relative overflow-hidden" : ""}`}>
            {!pro && (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,245,240,0.2),rgba(248,245,240,0.92))]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <p className="font-display text-2xl">Upgrade to Pro</p>
                  <p className="max-w-md text-sm text-[var(--ink3)]">Predictive finish dates, intelligent momentum alerts, and custom benchmarking.</p>
                  <button className="premium-btn-primary" onClick={() => setPro(true)}>Unlock Pro Insights</button>
                </div>
              </>
            )}
            <p className="font-display text-xl">Advanced Insights</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["Reading velocity trend", "Session duration map", "Mood-to-genre correlation"].map((item) => (
                <div key={item} className="rounded-xl border border-[var(--bg3)] p-4 text-sm text-[var(--ink2)]">{item}</div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
