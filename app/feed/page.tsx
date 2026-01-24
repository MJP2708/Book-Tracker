"use client";

import { Navigation } from "@/components/Navigation";
import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { PostCard } from "@/components/feed/PostCard";

export default function FeedPage() {
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
          <CreatePostForm />

          {/* Feed Posts */}
          <div className="space-y-4">
            <PostCard
              id="1"
              author={{
                id: "user1",
                name: "Sarah Anderson",
              }}
              type="repost"
              book={{
                title: "The Midnight Library",
                author: "Matt Haig",
              }}
              content="This book absolutely changed my perspective on life choices. Highly recommended!"
              createdAt={new Date()}
              likes={456}
              comments={23}
            />
            <PostCard
              id="2"
              author={{
                id: "user2",
                name: "James Chen",
              }}
              type="quote"
              content={
                '"The only thing we never get enough of is love; and the only thing we never give enough of is love." - Henry Miller'
              }
              createdAt={new Date()}
              likes={234}
              comments={8}
            />
            <PostCard
              id="3"
              author={{
                id: "user3",
                name: "Emma Wilson",
              }}
              type="post"
              content="Finally finished my reading goal for this month! Already started the next one. What should I read next?"
              createdAt={new Date()}
              likes={145}
              comments={31}
            />
          </div>
        </div>
      </main>
    </>
  );
}
