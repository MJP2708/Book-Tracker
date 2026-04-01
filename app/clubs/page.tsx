"use client";

import { Navigation } from "@/components/Navigation";
import { BookOpen, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Club = {
  id: string;
  name: string;
  description: string;
  currentBook: string;
  targetDate: string;
  ownerName: string;
  memberCount: number;
};

export default function ClubsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [book, setBook] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const load = async () => {
    const res = await fetch("/api/clubs");
    if (res.ok) setClubs((await res.json()) as Club[]);
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    void load();
  }, [status]);

  const createClub = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/clubs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, currentBook: book }),
    });
    if (res.ok) {
      setName("");
      setDescription("");
      setBook("");
      void load();
    }
  };

  const joinClub = async (clubId: string) => {
    const res = await fetch(`/api/clubs/${clubId}/join`, { method: "POST" });
    if (res.ok) void load();
  };

  if (status === "loading") return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[350px_1fr] lg:px-8">
          <aside className="glass-card h-fit">
            <p className="display-title text-xl">Create Book Club</p>
            <form className="mt-4 space-y-3" onSubmit={createClub}>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Club name"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="What is this club about?"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              <input value={book} onChange={(e) => setBook(e.target.value)} placeholder="Current group book"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              <button type="submit" className="primary-btn w-full">Create Club</button>
            </form>
          </aside>

          <section className="space-y-3">
            {clubs.map((club) => (
              <article key={club.id} className="glass-card">
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="display-title text-xl">{club.name}</p>
                    <p className="text-sm text-zinc-500">Hosted by {club.ownerName}</p>
                  </div>
                  <button className="secondary-btn w-full sm:w-auto" onClick={() => void joinClub(club.id)}>
                    <Users className="h-4 w-4" />Join
                  </button>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{club.description}</p>
                <div className="mt-3 grid gap-2 text-xs text-zinc-500 sm:grid-cols-3">
                  <p className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{club.currentBook}</p>
                  <p>Members: {club.memberCount}</p>
                  <p>Target: {new Date(club.targetDate).toLocaleDateString()}</p>
                </div>
              </article>
            ))}
            {clubs.length === 0 && <div className="glass-card text-sm text-zinc-500">No clubs yet.</div>}
          </section>
        </div>
      </main>
    </>
  );
}
