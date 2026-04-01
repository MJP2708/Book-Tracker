"use client";

import { Navigation } from "@/components/Navigation";
import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Reply = {
  id: string;
  authorName: string;
  content: string;
};

type Thread = {
  id: string;
  topic: string;
  title: string;
  content: string;
  authorName: string;
  upvotes: number;
  downvotes: number;
  replyCount: number;
  replies: Reply[];
};

export default function DiscussionsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [topic, setTopic] = useState("general");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const load = async () => {
    const res = await fetch("/api/discussions");
    if (res.ok) setThreads((await res.json()) as Thread[]);
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    void load();
  }, [status]);

  const createThread = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, title, content }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      void load();
    }
  };

  const vote = async (threadId: string, direction: "up" | "down") => {
    const res = await fetch(`/api/discussions/${threadId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    if (res.ok) void load();
  };

  const reply = async (threadId: string) => {
    const text = (replyDraft[threadId] || "").trim();
    if (!text) return;
    const res = await fetch(`/api/discussions/${threadId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    if (res.ok) {
      setReplyDraft((prev) => ({ ...prev, [threadId]: "" }));
      void load();
    }
  };

  if (status === "loading") return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[380px_1fr] lg:px-8">
          <aside className="glass-card h-fit">
            <p className="display-title text-xl">Start Discussion</p>
            <form className="mt-4 space-y-3" onSubmit={createThread}>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. productivity)"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Thread title"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={4} placeholder="What are you curious about?"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
              <button type="submit" className="primary-btn w-full">Post Thread</button>
            </form>
          </aside>

          <section className="space-y-3">
            {threads.map((thread) => (
              <article key={thread.id} className="glass-card">
                <p className="mb-1 text-xs uppercase tracking-wide text-cyan-600">#{thread.topic}</p>
                <p className="display-title text-xl">{thread.title}</p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{thread.content}</p>
                <p className="mt-2 text-xs text-zinc-500">by {thread.authorName}</p>

                <div className="mt-3 flex gap-2">
                  <button className="secondary-btn text-xs" onClick={() => void vote(thread.id, "up")}> 
                    <ArrowBigUp className="h-4 w-4" />{thread.upvotes}
                  </button>
                  <button className="secondary-btn text-xs" onClick={() => void vote(thread.id, "down")}> 
                    <ArrowBigDown className="h-4 w-4" />{thread.downvotes}
                  </button>
                  <span className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-700">
                    <MessageCircle className="h-4 w-4" />{thread.replyCount}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {thread.replies.slice(-3).map((replyItem) => (
                    <div key={replyItem.id} className="rounded-xl bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
                      <p className="font-semibold">{replyItem.authorName}</p>
                      <p>{replyItem.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={replyDraft[thread.id] || ""}
                    onChange={(e) => setReplyDraft((prev) => ({ ...prev, [thread.id]: e.target.value }))}
                    placeholder="Write a reply"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <button className="secondary-btn" onClick={() => void reply(thread.id)}>Reply</button>
                </div>
              </article>
            ))}
            {threads.length === 0 && <div className="glass-card text-sm text-zinc-500">No discussions yet.</div>}
          </section>
        </div>
      </main>
    </>
  );
}
