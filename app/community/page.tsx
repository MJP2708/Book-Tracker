"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import {
  AnimatedPage,
  AnimatedButton,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type CommunityTab = "feed" | "reviews" | "lists";

const posts = [
  { id: 1, user: "Nina", type: "review", title: "Project Hail Mary", body: "The scientific tension is balanced by surprisingly emotional beats.", hearts: 34, comments: 9 },
  { id: 2, user: "Derek", type: "list", title: "5 books for mindset resets", body: "A short curation for readers who want to rebuild focus this month.", hearts: 21, comments: 4 },
  { id: 3, user: "Elle", type: "post", title: "Reading sprint update", body: "Hit 120 pages this weekend. Looking for one literary palate cleanser.", hearts: 18, comments: 7 },
];

export default function CommunityPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<CommunityTab>("feed");
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<number[]>([]);

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  const filtered = useMemo(() => {
    if (tab === "feed") return posts;
    if (tab === "reviews") return posts.filter((p) => p.type === "review");
    return posts.filter((p) => p.type === "list");
  }, [tab]);

  return (
    <>
      <AppHeader />
      <AnimatedPage>
        <main className="min-h-screen bg-[var(--bg)] pb-10">
          <div className="mx-auto w-full max-w-7xl space-y-5 px-4 pt-6 sm:px-6 lg:px-8">
            <section className="premium-card p-5 sm:p-6">
              <p className="font-display text-3xl">Community</p>
              <p className="text-sm text-[var(--ink3)]">Conversations, reviews, and curated lists from your reading network.</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {["feed", "reviews", "lists"].map((v) => (
                  <button key={v} onClick={() => setTab(v as CommunityTab)} className={`rounded-full px-3 py-1 ${tab === v ? "bg-[var(--ink)] text-white" : "border border-[var(--bg3)] text-[var(--ink2)]"}`}>{v[0].toUpperCase() + v.slice(1)}</button>
                ))}
              </div>
            </section>

            <section className="premium-card p-4">
              <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share a thought, quote, or quick review..." className="w-full rounded-lg border border-[var(--bg3)] px-3 py-2 text-sm" />
              <div className="mt-2 flex justify-end">
                <AnimatedButton className="premium-btn-primary" onClick={() => setDraft("")}>Post</AnimatedButton>
              </div>
            </section>

            <StaggerContainer className="space-y-3">
              {filtered.map((post) => {
                const hasLiked = liked.includes(post.id);
                return (
                  <StaggerItem key={post.id}>
                    <HoverCard className="premium-card p-5">
                      <p className="text-sm text-[var(--ink3)]">@{post.user} • {post.type}</p>
                      <p className="font-display mt-1 text-xl">{post.title}</p>
                      <p className="mt-2 text-sm text-[var(--ink2)]">{post.body}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <AnimatedButton onClick={() => setLiked((prev) => hasLiked ? prev.filter((id) => id !== post.id) : [...prev, post.id])} className={`rounded-full border px-2 py-1 ${hasLiked ? "border-[var(--rose)] bg-[var(--rose3)] text-[var(--rose)]" : "border-[var(--bg3)]"}`}>❤️ {post.hearts + (hasLiked ? 1 : 0)}</AnimatedButton>
                        <AnimatedButton className="rounded-full border border-[var(--bg3)] px-2 py-1">💬 {post.comments}</AnimatedButton>
                        <AnimatedButton className="rounded-full border border-[var(--bg3)] px-2 py-1">🔖 Save</AnimatedButton>
                      </div>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </main>
      </AnimatedPage>
    </>
  );
}
