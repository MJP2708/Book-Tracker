export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type LiveSession = {
  id: string;
  hostName: string;
  hostEmail: string;
  title: string;
  bookTitle: string;
  format: "read-aloud" | "audiobook-style" | "discussion";
  scheduledFor: string;
  isLive: boolean;
  listeners: number;
  description: string;
};

const demoSessions: LiveSession[] = [
  {
    id: "live_1",
    hostName: "Maya R.",
    hostEmail: "maya@example.com",
    title: "Late Night Sci-Fi Read",
    bookTitle: "Project Hail Mary",
    format: "read-aloud",
    scheduledFor: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    isLive: true,
    listeners: 36,
    description: "Chapter-by-chapter live read with short reactions in between.",
  },
  {
    id: "live_2",
    hostName: "Alex K.",
    hostEmail: "alex@example.com",
    title: "Philosophy Morning Session",
    bookTitle: "The Stranger",
    format: "discussion",
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    isLive: false,
    listeners: 12,
    description: "A calm reading hour plus context and interpretation notes.",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();

  const sessions = demoSessions
    .filter((session) => {
      if (!q) return true;
      return (
        session.title.toLowerCase().includes(q) ||
        session.bookTitle.toLowerCase().includes(q) ||
        session.hostName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
    });

  return NextResponse.json({ sessions, mode: "demo" });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    title?: string;
    bookTitle?: string;
    format?: "read-aloud" | "audiobook-style" | "discussion";
    scheduledFor?: string;
    description?: string;
  };

  const title = String(payload.title || "").trim();
  const bookTitle = String(payload.bookTitle || "").trim();

  if (!title || !bookTitle) {
    return NextResponse.json({ error: "title and bookTitle are required" }, { status: 400 });
  }

  const created: LiveSession = {
    id: `live_${Date.now()}`,
    hostName: session.user.name || "Reader",
    hostEmail: session.user.email,
    title,
    bookTitle,
    format: payload.format || "read-aloud",
    scheduledFor: payload.scheduledFor || new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    isLive: false,
    listeners: 0,
    description: String(payload.description || "").trim() || "Community-led reading stream.",
  };

  demoSessions.unshift(created);
  return NextResponse.json({ session: created, mode: "demo" }, { status: 201 });
}
