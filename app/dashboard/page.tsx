"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { Sparkles, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const quotePool = [
  "A reader lives a thousand lives before he dies.",
  "We read to know we are not alone.",
  "Reading is to the mind what exercise is to the body.",
  "Books are a uniquely portable magic.",
  "Words can change entire futures.",
];

const friendActivitySeed: Array<{ id: number; name: string; action: string; time: string }> = [];

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  const [logOpen, setLogOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [pages, setPages] = useState(0);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState("");
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [aiMode, setAiMode] = useState("Summarize");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [mood, setMood] = useState("Cozy");
  const [reacted, setReacted] = useState<Record<number, string>>({});

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  const challengePct = 0;

  const askAi = async () => {
    if (!question.trim()) return;
    setAsking(true);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `[Mode: ${aiMode}] ${question}`,
        bookTitle: "Project Hail Mary",
        currentPage: pages,
      }),
    });
    const payload = (await res.json().catch(() => ({}))) as { answer?: string; error?: string };
    setAnswer(payload.answer || payload.error || "No response");
    setAsking(false);
  };

  const todayQuote = useMemo(() => quotePool[quoteIdx], [quoteIdx]);

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="premium-card overflow-hidden bg-[var(--ink)] text-white">
            <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-display text-2xl">2026 Reading Challenge</p>
                <p className="mt-1 text-sm text-white/70">No reading activity yet. Start your first session.</p>
                <div className="mt-4 h-2 w-full rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-[var(--teal2)]" style={{ width: `${challengePct}%` }} />
                </div>
                <p className="mt-2 text-xs text-white/70">0 / 4,800 pages</p>
              </div>
              <div className="text-right">
                <p className="font-display text-6xl leading-none text-[var(--gold2)]">0</p>
                <p className="text-xs uppercase tracking-[0.12em] text-white/65">Books Read</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
            <section className="space-y-6">
              <article className="premium-card p-5 sm:p-6">
                <p className="font-display text-2xl text-[var(--ink)]">Continue Reading</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-[98px_1fr]">
                  <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--pur)] to-[var(--teal2)] text-4xl">🚀</div>
                  <div>
                    <p className="font-display text-xl text-[var(--ink)]">Project Hail Mary</p>
                    <p className="text-sm text-[var(--ink3)]">Andy Weir</p>
                    <span className="mt-2 inline-flex rounded-full bg-[var(--teal3)] px-2 py-1 text-xs font-medium text-[var(--teal)]">Sci-Fi</span>
                    <div className="mt-3 h-2 rounded-full bg-[var(--bg3)]">
                      <div className="h-full rounded-full bg-[var(--gold2)]" style={{ width: "61%" }} />
                    </div>
                    <p className="mt-1 text-xs text-[var(--ink3)]">0% • page {pages} of 300</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <button className="rounded-full bg-[var(--gold3)] px-3 py-1 text-[var(--gold)]" onClick={() => { setLogOpen((v) => !v); setSaved(""); }}>📖 Log pages</button>
                  <button className="rounded-full bg-[var(--teal3)] px-3 py-1 text-[var(--teal)]" onClick={() => { setNoteOpen((v) => !v); setSaved(""); }}>📝 Note</button>
                  <button className="rounded-full bg-[var(--rose3)] px-3 py-1 text-[var(--rose)]" onClick={() => { setRatingOpen((v) => !v); setSaved(""); }}>⭐ Rate</button>
                  <button className="rounded-full bg-[var(--pur3)] px-3 py-1 text-[var(--pur)]">💬 Club</button>
                </div>

                {logOpen && (
                  <div className="mt-4 rounded-xl border border-[var(--bg3)] p-4">
                    <label className="text-sm font-medium text-[var(--ink2)]">Log pages</label>
                    <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_120px]">
                      <input type="range" min={0} max={300} value={pages} onChange={(e) => setPages(Number(e.target.value))} />
                      <input value={pages} onChange={(e) => setPages(Number(e.target.value) || 0)} className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="premium-btn-primary" onClick={() => setSaved("Pages updated successfully")}>Save</button>
                      <button className="premium-btn-outline" onClick={() => setLogOpen(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {noteOpen && (
                  <div className="mt-4 rounded-xl border border-[var(--bg3)] p-4">
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Write a quick thought..." className="w-full rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                    <div className="mt-3 flex gap-2">
                      <button className="premium-btn-primary" onClick={() => setSaved("Note saved")}>Save</button>
                      <button className="premium-btn-outline" onClick={() => setNoteOpen(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {ratingOpen && (
                  <div className="mt-4 rounded-xl border border-[var(--bg3)] p-4">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button key={i} onClick={() => setStars(i + 1)}>
                          <Star className={`h-5 w-5 ${i < stars ? "fill-[var(--gold2)] text-[var(--gold2)]" : "text-[var(--bg3)]"}`} />
                        </button>
                      ))}
                    </div>
                    <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={3} placeholder="Optional review" className="mt-2 w-full rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                    <div className="mt-3 flex gap-2">
                      <button className="premium-btn-primary" onClick={() => setSaved("Review posted")}>Post review</button>
                      <button className="premium-btn-outline" onClick={() => setRatingOpen(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {saved && <p className="mt-3 text-sm text-[var(--grn)]">{saved}</p>}
              </article>

              <article className="premium-card bg-[var(--ink)] p-5 text-white sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold2)]">Powered by Claude</p>
                <p className="font-display mt-2 text-2xl">AI Reading Assistant</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Summarize", "Explain", "Next book", "Quiz me", "Themes"].map((mode) => (
                    <button key={mode} onClick={() => setAiMode(mode)} className={`rounded-full px-3 py-1 text-xs transition-all duration-[0.18s] ${aiMode === mode ? "bg-[var(--gold2)] text-white" : "bg-white/10 text-white/80"}`}>
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about your current book..." className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/55" />
                  <button className="premium-btn-primary" onClick={() => void askAi()} disabled={asking}>{asking ? "Asking..." : "Ask"}</button>
                </div>
                {answer && <div className="mt-3 rounded-xl border border-white/15 bg-white/8 p-3 text-sm text-white/90">{answer}</div>}
              </article>
            </section>

            <aside className="space-y-6">
              <article className="premium-card p-5 sm:p-6">
                <p className="font-display text-xl">Goals & Streak</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-[var(--gold3)] p-3"><p className="text-xs text-[var(--ink3)]">Streak</p><p className="font-display text-2xl text-[var(--gold)]">0d</p></div>
                  <div className="rounded-xl bg-[var(--teal3)] p-3"><p className="text-xs text-[var(--ink3)]">Monthly goal</p><p className="font-display text-2xl text-[var(--teal)]">0%</p></div>
                  <div className="rounded-xl bg-[var(--rose3)] p-3"><p className="text-xs text-[var(--ink3)]">Year count</p><p className="font-display text-2xl text-[var(--rose)]">0</p></div>
                  <div className="rounded-xl bg-[var(--grn3)] p-3"><p className="text-xs text-[var(--ink3)]">Genres</p><p className="font-display text-2xl text-[var(--grn)]">0</p></div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[var(--bg3)]"><div className="h-full w-0 rounded-full bg-[var(--teal2)]" /></div>
                <p className="mt-3 text-xs text-[var(--ink3)]">Today&apos;s mood</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {["Cozy", "Deep", "Quick", "Late night"].map((m) => (
                    <button key={m} onClick={() => setMood(m)} className={`rounded-full px-3 py-1 ${mood === m ? "bg-[var(--gold3)] text-[var(--gold)] border border-[var(--gold2)]" : "border border-[var(--bg3)] text-[var(--ink2)]"}`}>{m}</button>
                  ))}
                </div>
              </article>

              <article className="premium-card bg-[var(--ink)] p-5 text-white sm:p-6">
                <p className="text-3xl text-[var(--gold)]">"</p>
                <p className="font-display text-xl italic">{todayQuote}</p>
                <p className="mt-2 text-sm text-white/65">- Quote of the Day</p>
                <button className="mt-3 premium-btn-outline border-white/20 text-white" onClick={() => setQuoteIdx((v) => (v + 1) % quotePool.length)}>New quote ↻</button>
              </article>

              <article className="premium-card p-5 sm:p-6">
                <p className="font-display text-xl">Friends Activity</p>
                <div className="mt-3 space-y-2">
                  {friendActivitySeed.length === 0 && (
                    <p className="text-sm text-[var(--ink3)]">No activity yet. This account has no history.</p>
                  )}
                  {friendActivitySeed.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[var(--bg3)] p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--teal3)] text-xs font-semibold text-[var(--teal)]">{item.name.split(" ").map((v) => v[0]).join("")}</div>
                        <p className="text-sm text-[var(--ink2)]"><span className="font-medium">{item.name}</span> {item.action}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-[var(--ink3)]">{item.time} ago</p>
                        <div className="flex gap-1 text-xs">
                          {["❤️", "👏", "🔥"].map((emoji) => (
                            <button key={emoji} onClick={() => setReacted((prev) => ({ ...prev, [item.id]: emoji }))} className={`rounded-full border px-2 py-0.5 ${reacted[item.id] === emoji ? "border-[var(--gold2)] bg-[var(--gold3)]" : "border-[var(--bg3)]"}`}>{emoji}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
