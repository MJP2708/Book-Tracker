"use client";

import { Navigation } from "@/components/Navigation";
import { Heart, MessageCircle, Quote, Send, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Activity = {
  id: string;
  actorName: string;
  text: string;
  createdAt: string;
};

type Post = {
  id: string;
  authorName: string;
  kind: "review" | "post";
  content: string;
  bookTitle?: string;
  tags: string[];
  likeCount: number;
  createdAt: string;
};

type QuoteItem = {
  id: string;
  authorName: string;
  bookTitle: string;
  text: string;
  createdAt: string;
};

export default function FeedPage() {
  const { status } = useSession();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [postDraft, setPostDraft] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [kind, setKind] = useState<"review" | "post">("post");
  const [insight, setInsight] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const load = async () => {
    const [feedRes, postRes, quoteRes] = await Promise.all([
      fetch("/api/feed"),
      fetch("/api/posts"),
      fetch("/api/quotes"),
    ]);
    if (feedRes.ok) setActivities((await feedRes.json()) as Activity[]);
    if (postRes.ok) setPosts((await postRes.json()) as Post[]);
    if (quoteRes.ok) setQuotes((await quoteRes.json()) as QuoteItem[]);
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    void load();
  }, [status]);

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (!postDraft.trim()) return;
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, content: postDraft, bookTitle }),
    });
    if (res.ok) {
      setPostDraft("");
      setBookTitle("");
      void load();
    }
  };

  const likePost = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) void load();
  };

  const extractInsights = async () => {
    if (!postDraft.trim()) return;
    const res = await fetch("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: postDraft }),
    });
    if (!res.ok) return;
    const payload = (await res.json()) as { summary?: string };
    setInsight(payload.summary || "");
  };

  const topQuotes = useMemo(() => quotes.slice(0, 4), [quotes]);

  if (status === "loading") return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_330px] lg:px-8">
          <section className="space-y-4">
            <article className="glass-card">
              <p className="display-title text-2xl">Community Feed</p>
              <p className="text-sm text-zinc-500">Share thoughts, reviews, and progress updates.</p>
              <form className="mt-4 space-y-3" onSubmit={submitPost}>
                <select value={kind} onChange={(e) => setKind(e.target.value as "review" | "post")}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                  <option value="post">Short Post</option>
                  <option value="review">Book Review</option>
                </select>
                <input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Book title (optional)"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
                <textarea value={postDraft} onChange={(e) => setPostDraft(e.target.value)} rows={4} placeholder="What did you learn today?"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
                {insight && <p className="rounded-xl bg-cyan-50 p-3 text-xs text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">AI Insight: {insight}</p>}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="submit" className="primary-btn w-full sm:w-auto"><Send className="h-4 w-4" />Publish</button>
                  <button type="button" className="secondary-btn w-full sm:w-auto" onClick={() => void extractInsights()}><Sparkles className="h-4 w-4" />Summarize</button>
                </div>
              </form>
            </article>

            <article className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="glass-card">
                  <div className="mb-2 flex flex-col gap-1 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>{post.authorName} • {post.kind === "review" ? "Review" : "Post"}</p>
                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                  {post.bookTitle && <p className="mb-1 text-sm font-semibold text-cyan-600">{post.bookTitle}</p>}
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">{post.content}</p>
                  {post.tags.length > 0 && <p className="mt-2 text-xs text-zinc-500">#{post.tags.join(" #")}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="secondary-btn text-xs" onClick={() => void likePost(post.id)}>
                      <Heart className="h-4 w-4" />{post.likeCount}
                    </button>
                    <button type="button" className="secondary-btn text-xs">
                      <MessageCircle className="h-4 w-4" />Comment
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <div className="glass-card text-sm text-zinc-500">No posts yet.</div>}
            </article>
          </section>

          <aside className="space-y-4">
            <article className="glass-card">
              <p className="display-title text-xl">Activity</p>
              <div className="mt-3 space-y-2 text-sm">
                {activities.slice(0, 12).map((item) => (
                  <div key={item.id} className="rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800">
                    <p className="font-semibold">{item.actorName}</p>
                    <p className="text-zinc-600 dark:text-zinc-300">{item.text}</p>
                  </div>
                ))}
                {activities.length === 0 && <p className="text-zinc-500">No activity yet.</p>}
              </div>
            </article>

            <article className="glass-card">
              <div className="mb-2 flex items-center gap-2">
                <Quote className="h-4 w-4 text-cyan-500" />
                <p className="display-title text-xl">Quote Feed</p>
              </div>
              <div className="space-y-2 text-sm">
                {topQuotes.map((q) => (
                  <div key={q.id} className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="italic">"{q.text}"</p>
                    <p className="mt-2 text-xs text-zinc-500">{q.bookTitle} • {q.authorName}</p>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </main>
    </>
  );
}
