"use client";

import { Navigation } from "@/components/Navigation";
import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { PostCard } from "@/components/feed/PostCard";
import { BookX, UserPlus, Users } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [addedFriends, setAddedFriends] = useState<Record<string, boolean>>({});
  // This will be replaced with real data from the server
  const recentBooks = [
    {
      id: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      status: "reading" as const,
      pagesRead: 245,
      totalPages: 288,
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      status: "finished" as const,
      rating: 5,
    },
  ];
  const suggestedFriends = [
    { name: "Avery M.", tag: "Historical fiction" },
    { name: "Jules K.", tag: "Fantasy & YA" },
    { name: "Priya R.", tag: "Nonfiction streak" },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif-title text-amber-900 dark:text-amber-50 mb-2">
              Welcome Back!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your reading, connect with other book lovers, and discover
              your next favorite read.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <CreatePostForm />

              {/* Sample Posts */}
              <div className="space-y-4">
                <PostCard
                  id="1"
                  author={{
                    id: "user1",
                    name: "Sarah Anderson",
                    avatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                  }}
                  type="repost"
                  book={{
                    title: "The Midnight Library",
                    author: "Matt Haig",
                  }}
                  content="Just finished this beautiful book about second chances. A must-read!"
                  createdAt={new Date()}
                  likes={234}
                  comments={12}
                />
                <PostCard
                  id="2"
                  author={{
                    id: "user2",
                    name: "James Chen",
                  }}
                  type="quote"
                  content={
                    '"Between the pages of a book is a perfect place to be." - Unknown'
                  }
                  createdAt={new Date()}
                  likes={89}
                  comments={5}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Add Friends */}
              <div className="card-bookish mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50">
                    Add Friends
                  </h3>
                  <span className="badge">New</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Grow your circle and share shelves.
                  </p>
                </div>
                <div className="space-y-3">
                  {suggestedFriends.map((friend) => (
                    <div
                      key={friend.name}
                      className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 dark:border-slate-700 p-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-amber-50 truncate">
                          {friend.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {friend.tag}
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`btn-secondary px-3 py-2 text-sm gap-1 ${
                          addedFriends[friend.name]
                            ? "cursor-default opacity-80"
                            : ""
                        }`}
                        onClick={() =>
                          setAddedFriends((prev) => ({
                            ...prev,
                            [friend.name]: true,
                          }))
                        }
                        disabled={addedFriends[friend.name]}
                      >
                        <UserPlus className="w-4 h-4" />
                        {addedFriends[friend.name] ? "Sent" : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reading Goals */}
              <div className="card-bookish mb-6">
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                  Currently Reading
                </h3>
                <div className="space-y-4">
                  {recentBooks.length > 0 ? (
                    recentBooks.map((book) => (
                      <div key={book.id} className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                        <h4 className="font-semibold text-slate-900 dark:text-amber-50 line-clamp-1">
                          {book.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {book.author}
                        </p>
                        {book.status === "reading" && (
                          <>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                              {book.pagesRead} / {book.totalPages} pages
                            </p>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                                style={{
                                  width: `${
                                    ((book.pagesRead || 0) /
                                      (book.totalPages || 1)) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <BookX className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        No books currently reading. Start one now!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="card-bookish">
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                  Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Books Read
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-amber-50">
                      12
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Pages This Year
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-amber-50">
                      2,847
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Reading Streak
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-amber-50">
                      15 days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
