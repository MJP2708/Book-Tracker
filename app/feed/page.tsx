"use client";

import { Navigation } from "@/components/Navigation";
import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { PostCard } from "@/components/feed/PostCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FeedPost = {
  id: string;
  type: "post" | "repost" | "quote" | "progress_update";
  content?: string | null;
  createdAt: string;
  user: { id: string; name: string | null; avatar?: string | null };
  book?: { title: string; author: string | null; coverImage?: string | null } | null;
  _count: { likes: number; comments: number };
};

export default function FeedPage() {
  const { status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      void loadPosts();
    }
  }, [status, router]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Failed to load feed.");
      }
      const data = (await response.json()) as FeedPost[];
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (data: { type: string; content: string }) => {
    const payload = {
      type: data.type === "progress" ? "progress_update" : data.type,
      content: data.content,
    };
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to create post.");
    }
    const created = (await response.json()) as FeedPost;
    setPosts((prev) => [created, ...prev]);
  };

  const handleToggleLike = async (postId: string) => {
    const response = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as { likeCount: number };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, _count: { ...post._count, likes: data.likeCount } }
          : post
      )
    );
  };

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif-title text-amber-900 dark:text-amber-50 mb-2">
              Community Feed
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Discover what your friends are reading and share your thoughts.
            </p>
          </div>

          {/* Create Post */}
          <CreatePostForm onPost={handleCreatePost} />

          {/* Feed Posts */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="space-y-4">
            {isLoading ? (
              <div className="card-bookish">Loading your feed...</div>
            ) : posts.length === 0 ? (
              <div className="card-bookish">
                Your feed is quiet. Follow more readers or create your first
                post.
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={{
                    id: post.user.id,
                    name: post.user.name ?? "Reader",
                    avatar: post.user.avatar ?? undefined,
                  }}
                  type={post.type}
                  book={
                    post.book
                      ? {
                          title: post.book.title,
                          author: post.book.author ?? "Unknown",
                          coverImage: post.book.coverImage ?? undefined,
                        }
                      : undefined
                  }
                  content={post.content ?? undefined}
                  createdAt={post.createdAt}
                  likes={post._count.likes}
                  comments={post._count.comments}
                  onLike={() => handleToggleLike(post.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
