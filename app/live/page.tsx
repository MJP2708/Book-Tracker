"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Session = {
  id: string;
  hostName: string;
  title: string;
  bookTitle: string;
  format: "read-aloud" | "audiobook-style" | "discussion";
  scheduledFor: string;
  isLive: boolean;
  listeners: number;
  description: string;
};

export default function LivePage() {
  const { status } = useSession();
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: "", bookTitle: "", format: "read-aloud" as Session["format"], description: "" });

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  const loadSessions = async (query = "") => {
    const res = await fetch(`/api/live/sessions?q=${encodeURIComponent(query)}`);
    const payload = (await res.json()) as { sessions: Session[] };
    setSessions(payload.sessions || []);
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSessions(q.trim());
    }, 180);
    return () => clearTimeout(timer);
  }, [q]);

  const goLive = async () => {
    if (!form.title.trim() || !form.bookTitle.trim()) return;
    const res = await fetch("/api/live/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", bookTitle: "", format: "read-aloud", description: "" });
      setCreating(false);
      setMessage("Session created for beta launch.");
      void loadSessions();
    }
  };

  const join = async (sessionId: string) => {
    setJoiningId(sessionId);
    const res = await fetch(`/api/live/sessions/${sessionId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asGuest: false }),
    });
    const payload = (await res.json()) as { listeners?: number; error?: string };
    if (res.ok) {
      setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, listeners: payload.listeners || s.listeners } : s));
      setMessage("You joined the stream.");
    } else {
      setMessage(payload.error || "Could not join stream");
    }
    setJoiningId(null);
  };

  const stats = useMemo(() => ({
    liveNow: sessions.filter((s) => s.isLive).length,
    upcoming: sessions.filter((s) => !s.isLive).length,
    totalListeners: sessions.reduce((sum, s) => sum + s.listeners, 0),
  }), [sessions]);

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="premium-card overflow-hidden bg-[var(--ink)] p-5 text-white sm:p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--gold2)]">Live Reading</p>
            <p className="font-display mt-2 text-3xl">Listen To Books In Real Time</p>
            <p className="mt-2 text-sm text-white/70">Early beta stream rooms are open. Host a session or drop in and listen.</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <article className="premium-card p-4"><p className="text-xs text-[var(--ink3)]">Live now</p><p className="font-display mt-1 text-2xl">{stats.liveNow}</p></article>
            <article className="premium-card p-4"><p className="text-xs text-[var(--ink3)]">Upcoming</p><p className="font-display mt-1 text-2xl">{stats.upcoming}</p></article>
            <article className="premium-card p-4"><p className="text-xs text-[var(--ink3)]">Listeners</p><p className="font-display mt-1 text-2xl">{stats.totalListeners}</p></article>
          </section>

          <section className="premium-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-2xl">Host Studio (Beta)</p>
              <button className="premium-btn-primary" onClick={() => setCreating((v) => !v)}>{creating ? "Close" : "Start stream"}</button>
            </div>

            {creating && (
              <div className="mt-4 grid gap-3">
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Session title" className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                <input value={form.bookTitle} onChange={(e) => setForm((p) => ({ ...p, bookTitle: e.target.value }))} placeholder="Book title" className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                <select value={form.format} onChange={(e) => setForm((p) => ({ ...p, format: e.target.value as Session["format"] }))} className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm">
                  <option value="read-aloud">Read aloud</option>
                  <option value="audiobook-style">Audiobook style</option>
                  <option value="discussion">Discussion-led</option>
                </select>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Session description" className="rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                <div><button className="premium-btn-primary" onClick={() => void goLive()}>Create session</button></div>
              </div>
            )}
          </section>

          <section className="premium-card p-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search live sessions" className="w-full rounded-lg border border-[var(--gold2)] px-3 py-2 text-sm" />
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <article key={session.id} className="premium-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-1 text-xs ${session.isLive ? "bg-[var(--rose3)] text-[var(--rose)]" : "bg-[var(--bg2)] text-[var(--ink3)]"}`}>{session.isLive ? "LIVE" : "Scheduled"}</span>
                  <span className="text-xs text-[var(--ink3)]">👥 {session.listeners}</span>
                </div>
                <p className="font-display text-xl">{session.title}</p>
                <p className="text-sm text-[var(--ink3)]">{session.bookTitle} • {session.hostName}</p>
                <p className="mt-2 text-sm text-[var(--ink2)]">{session.description}</p>
                <p className="mt-2 text-xs text-[var(--ink3)]">Format: {session.format}</p>
                <div className="mt-3 flex gap-2">
                  <button className="premium-btn-primary" onClick={() => void join(session.id)} disabled={joiningId === session.id}>{joiningId === session.id ? "Joining..." : "Join & Listen"}</button>
                </div>
              </article>
            ))}
          </section>

          {message && <p className="text-sm text-[var(--grn)]">{message}</p>}
        </div>
      </main>
    </>
  );
}
