"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string | null };
};

type ThreadDetail = {
  id: string;
  participants: { id: string; name: string | null }[];
  messages: Message[];
};

export default function ThreadPage({ params }: { params: { threadId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      void loadThread();
    }
  }, [status, router]);

  const loadThread = async () => {
    const response = await fetch(`/api/messages/threads/${params.threadId}`);
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as ThreadDetail;
    setThread(data);
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch(`/api/messages/threads/${params.threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!response.ok) {
        return;
      }
      const newMessage = (await response.json()) as Message;
      setThread((prev) =>
        prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev
      );
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card-bookish mb-6">
            <button
              onClick={() => router.push("/messages")}
              className="btn-secondary mb-4"
            >
              Back to messages
            </button>
            <h1 className="font-serif-title text-amber-900 dark:text-amber-50 mb-2">
              {thread
                ? thread.participants
                    .filter((p) => p.id !== session?.user?.id)
                    .map((p) => p.name ?? "Reader")
                    .join(", ")
                : "Conversation"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Keep the conversation going.
            </p>
          </div>

          <div className="card-bookish mb-6">
            {thread?.messages.length ? (
              <div className="space-y-4">
                {thread.messages.map((msg) => {
                  const isMine = msg.sender.id === session?.user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                          isMine
                            ? "bg-amber-500 text-white"
                            : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-[11px] opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No messages yet. Say hello.
              </p>
            )}
          </div>

          <form onSubmit={handleSend} className="card-bookish">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-amber-200 bg-white px-4 py-2 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
