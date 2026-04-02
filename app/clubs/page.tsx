"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Club = { id: number; name: string; members: number; current: string; summary: string; joined: boolean };

const seed: Club[] = [
  { id: 1, name: "Sci-Fi Society", members: 128, current: "Project Hail Mary", summary: "Weekly theory drops and chapter debriefs.", joined: true },
  { id: 2, name: "Philosophy Circle", members: 84, current: "The Stranger", summary: "Quiet reading + sharp, layered interpretations.", joined: false },
  { id: 3, name: "Builders & Biographies", members: 62, current: "The Creative Act", summary: "For founders, makers, and curious tinkerers.", joined: true },
];

const liveChat = [
  { id: 1, user: "Maya", text: "Chapter 10 twist was wild." },
  { id: 2, user: "Jordan", text: "The pacing finally clicked for me." },
  { id: 3, user: "Elle", text: "Anybody highlighting page 214?" },
];

export default function ClubsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [clubs, setClubs] = useState(seed);
  const [active, setActive] = useState<number>(1);
  const [message, setMessage] = useState("");

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  const activeClub = clubs.find((club) => club.id === active) || clubs[0];

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="premium-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-3xl">Clubs</p>
                <p className="text-sm text-[var(--ink3)]">Read together with focused communities and live chapter chats.</p>
              </div>
              <button className="premium-btn-primary">Create club</button>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
            <section className="grid gap-4 sm:grid-cols-2">
              {clubs.map((club) => (
                <article key={club.id} className={`premium-card cursor-pointer p-4 ${active === club.id ? "ring-2 ring-[var(--gold2)]" : ""}`} onClick={() => setActive(club.id)}>
                  <div className="flex items-start justify-between">
                    <p className="font-display text-xl">{club.name}</p>
                    <span className="rounded-full bg-[var(--bg2)] px-2 py-1 text-xs text-[var(--ink3)]">{club.members} members</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--ink2)]">{club.summary}</p>
                  <p className="mt-2 text-xs text-[var(--teal)]">Current read: {club.current}</p>
                  <button
                    className={`mt-3 rounded-full px-3 py-1 text-xs ${club.joined ? "bg-[var(--teal3)] text-[var(--teal)]" : "bg-[var(--gold3)] text-[var(--gold)]"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setClubs((prev) => prev.map((item) => item.id === club.id ? { ...item, joined: !item.joined } : item));
                    }}
                  >
                    {club.joined ? "Joined" : "Join"}
                  </button>
                </article>
              ))}
            </section>

            <aside className="premium-card flex min-h-[420px] flex-col p-4 sm:p-5">
              <p className="font-display text-xl">{activeClub.name} Live Chat</p>
              <p className="text-xs text-[var(--ink3)]">Discussing {activeClub.current}</p>
              <div className="mt-3 flex-1 space-y-2 overflow-auto rounded-xl border border-[var(--bg3)] p-3">
                {liveChat.map((msg) => (
                  <div key={msg.id} className="rounded-lg bg-[var(--bg2)] px-3 py-2 text-sm">
                    <span className="font-medium text-[var(--ink2)]">{msg.user}:</span> <span className="text-[var(--ink3)]">{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Drop a thought..." className="w-full rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
                <button className="premium-btn-primary" onClick={() => setMessage("")}>Send</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
