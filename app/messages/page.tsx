"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Thread = {
  id: string;
  participants: { id: string; name: string | null }[];
  lastMessage: { content: string; createdAt: string } | null;
};

type UserResult = {
  id: string;
  name: string | null;
  favoriteGenre?: string | null;
};

export default function MessagesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      void loadThreads();
    }
  }, [status, router]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/messages/threads");
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as Thread[];
      setThreads(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as UserResult[];
      setSearchResults(data);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStartThread = async (userId: string) => {
    const response = await fetch("/api/messages/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: userId }),
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as { id: string };
    router.push(`/messages/${data.id}`);
  };

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif-title text-amber-900 dark:text-amber-50 mb-2">
              Messages
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Catch up on private chats with your reading friends.
            </p>
          </div>

          <div className="card-bookish mb-6">
            <h2 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-3">
              Start a new chat
            </h2>
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search by username"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-lg border border-amber-200 bg-white px-4 py-2 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  disabled={searchLoading}
                >
                  {searchLoading ? "Searching..." : "Find"}
                </button>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div className="space-y-3 mt-4">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 dark:border-slate-700 p-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-amber-50 truncate">
                        {user.name ?? "Reader"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.favoriteGenre ?? "Book lover"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary px-3 py-2 text-sm"
                      onClick={() => handleStartThread(user.id)}
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-bookish">
            <h2 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
              Recent chats
            </h2>
            {isLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading conversations...
              </p>
            ) : threads.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No messages yet. Start a chat above.
              </p>
            ) : (
              <div className="space-y-3">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    className="w-full text-left flex items-start gap-3 rounded-lg border border-amber-100 dark:border-slate-700 p-3 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => router.push(`/messages/${thread.id}`)}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-200/70 dark:bg-amber-900 flex items-center justify-center text-amber-800 dark:text-amber-100 font-semibold">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-amber-50 truncate">
                        {thread.participants
                          .map((participant) => participant.name ?? "Reader")
                          .join(", ")}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {thread.lastMessage
                          ? thread.lastMessage.content
                          : "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
