export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { createDiscussion, listDiscussions } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(listDiscussions());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { topic?: string; title?: string; content?: string };
  const topic = String(body.topic || "general").trim().toLowerCase();
  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const thread = createDiscussion({
    topic,
    title,
    content,
    authorEmail: session.user.email,
    authorName: session.user.name || session.user.email.split("@")[0],
  });

  return NextResponse.json(thread, { status: 201 });
}
