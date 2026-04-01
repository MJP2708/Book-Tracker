"use client";

import { Navigation } from "@/components/Navigation";
import { BookOpen, UserPlus, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PublicProfileResponse = {
  user: {
    id: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    _count: {
      followers: number;
      following: number;
    };
  };
  userBooks: Array<{
    id: string;
    status: "reading" | "finished" | "unread";
    book: {
      id: string;
      title: string;
      author: string | null;
    };
  }>;
};

export default function PublicProfilePage() {
  const { data: session } = useSession();
  const params = useParams<{ userId: string }>();
  const [payload, setPayload] = useState<PublicProfileResponse | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!params?.userId) return;

    const run = async () => {
      const response = await fetch(`/api/users/${params.userId}/library`);
      if (response.ok) {
        const data = (await response.json()) as PublicProfileResponse & { isFollowing?: boolean };
        setPayload(data);
        setIsFollowing(data.isFollowing ?? false);
      }
    };

    void run();
  }, [params?.userId]);

  const toggleFollow = async () => {
    if (!payload) return;
    const res = await fetch(`/api/users/${payload.user.id}/follow`, { method: "POST" });
    if (res.ok) {
      const data = (await res.json()) as { isFollowing: boolean };
      setIsFollowing(data.isFollowing);
    }
  };

  const shelves = useMemo(() => {
    if (!payload) {
      return {
        reading: [],
        finished: [],
        unread: [],
      } as Record<"reading" | "finished" | "unread", PublicProfileResponse["userBooks"]>;
    }

    return {
      reading: payload.userBooks.filter((entry) => entry.status === "reading"),
      finished: payload.userBooks.filter((entry) => entry.status === "finished"),
      unread: payload.userBooks.filter((entry) => entry.status === "unread"),
    };
  }, [payload]);

  if (!payload) return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="glass-card">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="display-title text-3xl">{payload.user.name || "Reader"}</p>
                <p className="text-sm text-zinc-500">{payload.user.bio || "Learning in public."}</p>
              </div>
              {session?.user?.id !== payload.user.id && (
                <button type="button" onClick={() => void toggleFollow()} className="secondary-btn">
                  <UserPlus className="h-4 w-4" />
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <p className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                {payload.user._count.followers} followers
              </p>
              <p>{payload.user._count.following} following</p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {([
              ["reading", "Currently Reading"],
              ["finished", "Completed"],
              ["unread", "Want to Read"],
            ] as const).map(([key, label]) => (
              <article key={key} className="glass-card">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-500" />
                  <p className="display-title text-lg">{label}</p>
                </div>
                <div className="space-y-2 text-sm">
                  {shelves[key].length > 0 ? (
                    shelves[key].map((entry) => (
                      <div key={entry.id} className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                        <p className="font-semibold">{entry.book.title}</p>
                        <p className="text-xs text-zinc-500">{entry.book.author || "Unknown"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500">No books in this shelf.</p>
                  )}
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
