"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useParams } from "next/navigation";
import { useState } from "react";

const finishedShelf = [
  { id: 1, title: "Deep Work", author: "Cal Newport", emoji: "🎯", rating: 5 },
  { id: 2, title: "Atomic Habits", author: "James Clear", emoji: "⚡", rating: 4 },
  { id: 3, title: "The Midnight Library", author: "Matt Haig", emoji: "🌌", rating: 4 },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", emoji: "🧠", rating: 5 },
];

export default function ProfilePage() {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId || "me";
  const isMe = userId === "me";

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("Reading to build better systems and better questions.");
  const [genres, setGenres] = useState(["Sci-Fi", "Non-Fiction", "Philosophy"]);

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
          <section className="premium-card overflow-hidden bg-[var(--ink)] p-6 text-white">
            <div className="grid gap-4 sm:grid-cols-[88px_1fr_auto] sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl">📚</div>
              <div>
                <p className="font-display text-3xl">{isMe ? "Your Profile" : "Reader Profile"}</p>
                <p className="mt-1 text-sm text-white/75">@{userId === "me" ? "you" : userId}</p>
                {!editing ? <p className="mt-2 text-sm text-white/85">{bio}</p> : <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white" />}
              </div>
              <div className="flex flex-wrap gap-2">
                {isMe && (
                  <button className="premium-btn-primary" onClick={() => setEditing((v) => !v)}>{editing ? "Save profile" : "Edit profile"}</button>
                )}
                {!isMe && <button className="premium-btn-outline border-white/20 text-white">Follow</button>}
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[{ k: "Books read", v: "20" }, { k: "Followers", v: "248" }, { k: "Following", v: "133" }].map((item) => (
              <article key={item.k} className="premium-card p-4">
                <p className="text-xs text-[var(--ink3)]">{item.k}</p>
                <p className="font-display mt-1 text-2xl">{item.v}</p>
              </article>
            ))}
          </section>

          <section className="premium-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-2xl">Favorite Genres</p>
              {isMe && <button className="premium-btn-outline">Edit preferences</button>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {genres.map((genre) => (
                <button key={genre} onClick={() => setGenres((prev) => prev.includes(genre) ? prev : [...prev, genre])} className="rounded-full border border-[var(--gold2)] bg-[var(--gold3)] px-3 py-1 text-[var(--gold)]">{genre}</button>
              ))}
            </div>
          </section>

          <section className="premium-card p-5 sm:p-6">
            <p className="font-display text-2xl">Finished Shelf</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {finishedShelf.map((book) => (
                <article key={book.id} className="rounded-xl border border-[var(--bg3)] p-3">
                  <div className="mb-2 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--teal2)] to-[var(--gold2)] text-3xl">{book.emoji}</div>
                  <p className="font-display text-lg">{book.title}</p>
                  <p className="text-xs text-[var(--ink3)]">{book.author}</p>
                  <p className="mt-2 text-sm text-[var(--gold)]">{"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
