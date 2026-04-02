"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Notice = { id: number; type: "club" | "like" | "comment" | "system"; text: string; time: string; read: boolean };

const initialNotices: Notice[] = [
  { id: 1, type: "club", text: "Philosophy Circle starts in 30 minutes", time: "10m", read: false },
  { id: 2, type: "like", text: "Maya liked your review of Dune", time: "1h", read: false },
  { id: 3, type: "comment", text: "Alex replied to your note in Space Readers", time: "3h", read: true },
  { id: 4, type: "system", text: "Weekly reading report is ready", time: "1d", read: true },
];

export default function NotificationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState(initialNotices);

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  const unread = items.filter((item) => !item.read);
  const read = items.filter((item) => item.read);

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-4xl space-y-5 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="premium-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-3xl">Notifications</p>
                <p className="text-sm text-[var(--ink3)]">Stay in sync with clubs, comments, and reactions.</p>
              </div>
              <button className="premium-btn-outline" onClick={() => setItems((prev) => prev.map((item) => ({ ...item, read: true })))}>Mark all as read</button>
            </div>
          </section>

          <section className="premium-card p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--gold)]">Unread ({unread.length})</p>
            <div className="mt-3 space-y-2">
              {unread.length === 0 ? <p className="text-sm text-[var(--ink3)]">All caught up.</p> : unread.map((item) => (
                <article key={item.id} className="rounded-xl border border-[var(--gold2)] bg-[var(--gold3)] p-3">
                  <p className="text-sm text-[var(--ink2)]">{item.text}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[var(--ink3)]">
                    <span>{item.time} ago</span>
                    <button className="underline" onClick={() => setItems((prev) => prev.map((n) => n.id === item.id ? { ...n, read: true } : n))}>Mark read</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="premium-card p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--ink3)]">Earlier</p>
            <div className="mt-3 space-y-2">
              {read.map((item) => (
                <article key={item.id} className="rounded-xl border border-[var(--bg3)] p-3">
                  <p className="text-sm text-[var(--ink2)]">{item.text}</p>
                  <p className="mt-2 text-xs text-[var(--ink3)]">{item.time} ago</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
