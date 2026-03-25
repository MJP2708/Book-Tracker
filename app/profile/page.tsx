"use client";

import { Navigation } from "@/components/Navigation";
import { BookOpen, Link2, Save, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ProfileResponse = {
  user: {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    createdAt: string;
  };
  stats: {
    booksRead: number;
    totalPages: number;
    readingStreak: number;
  };
  counts: {
    followers: number;
    following: number;
    userBooks: number;
  };
};

type LibraryEntry = {
  id: string;
  status: "unread" | "reading" | "finished";
  book: {
    id: string;
    title: string;
    author: string | null;
  };
};

type SuggestedUser = {
  id: string;
  name: string | null;
  favoriteGenre?: string | null;
};

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [bioDraft, setBioDraft] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status !== "authenticated") return;

    const run = async () => {
      const [meRes, libraryRes, suggestionsRes] = await Promise.all([
        fetch("/api/me"),
        fetch("/api/library"),
        fetch("/api/users/suggestions"),
      ]);

      if (meRes.ok) {
        const meData = (await meRes.json()) as ProfileResponse;
        setProfile(meData);
        setBioDraft(meData.user.bio || "");
      }

      if (libraryRes.ok) {
        setLibrary((await libraryRes.json()) as LibraryEntry[]);
      }

      if (suggestionsRes.ok) {
        setSuggestions((await suggestionsRes.json()) as SuggestedUser[]);
      }
    };

    void run();
  }, [status, router]);

  const saveBio = async () => {
    setSavingBio(true);
    const response = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: bioDraft }),
    });

    if (response.ok) {
      const next = (await response.json()) as ProfileResponse;
      setProfile(next);
      setBioDraft(next.user.bio || "");
    }
    setSavingBio(false);
  };

  const sendFollow = async (userId: string) => {
    const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
    if (res.ok) {
      const data = (await res.json()) as { isFollowing: boolean };
      setFollowed((prev) => ({ ...prev, [userId]: data.isFollowing }));
    }
  };

  const shelfPreview = useMemo(() => {
    return {
      reading: library.filter((entry) => entry.status === "reading").slice(0, 3),
      finished: library.filter((entry) => entry.status === "finished").slice(0, 3),
      unread: library.filter((entry) => entry.status === "unread").slice(0, 3),
    };
  }, [library]);

  if (!profile) return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <section className="space-y-4">
            <article className="glass-card">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="display-title text-3xl">{profile.user.name || "Reader"}</p>
                  <p className="text-sm text-zinc-500">{profile.user.email}</p>
                </div>
                <Link href={`/profile/${profile.user.id}`} className="secondary-btn">
                  <Link2 className="h-4 w-4" />
                  Public profile
                </Link>
              </div>
              <textarea
                value={bioDraft}
                onChange={(event) => setBioDraft(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Tell people what you're learning"
              />
              <button type="button" onClick={() => void saveBio()} className="primary-btn mt-3" disabled={savingBio}>
                <Save className="h-4 w-4" />
                {savingBio ? "Saving..." : "Save bio"}
              </button>
            </article>

            <article className="glass-card grid gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase text-zinc-500">Books read</p>
                <p className="display-title text-2xl">{profile.stats.booksRead}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-zinc-500">Streak</p>
                <p className="display-title text-2xl">{profile.stats.readingStreak}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-zinc-500">Followers</p>
                <p className="display-title text-2xl">{profile.counts.followers}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-zinc-500">Following</p>
                <p className="display-title text-2xl">{profile.counts.following}</p>
              </div>
            </article>

            <article className="glass-card">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-500" />
                <p className="display-title text-xl">Public shelf preview</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  ["reading", "Currently Reading"],
                  ["finished", "Completed"],
                  ["unread", "Want to Read"],
                ] as const).map(([key, label]) => (
                  <div key={key} className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="mb-2 text-sm font-semibold">{label}</p>
                    <div className="space-y-1 text-xs text-zinc-500">
                      {shelfPreview[key].length > 0 ? (
                        shelfPreview[key].map((entry) => (
                          <p key={entry.id} className="truncate">
                            {entry.book.title}
                          </p>
                        ))
                      ) : (
                        <p>No books yet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="space-y-4">
            <article className="glass-card">
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-500" />
                <p className="display-title text-xl">Suggested people</p>
              </div>
              <div className="space-y-2">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div>
                      <p className="font-semibold">{user.name || "Reader"}</p>
                      <p className="text-xs text-zinc-500">{user.favoriteGenre || "Learner"}</p>
                    </div>
                    <button type="button" className="secondary-btn" onClick={() => void sendFollow(user.id)}>
                      <UserPlus className="h-4 w-4" />
                      {followed[user.id] ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
                {suggestions.length === 0 && <p className="text-sm text-zinc-500">No suggestions right now.</p>}
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
