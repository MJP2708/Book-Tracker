export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { createPost, listPosts } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(listPosts());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    kind?: "review" | "post";
    content?: string;
    bookTitle?: string;
    tags?: string[];
  };
  const content = String(body.content || "").trim();
  if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

  const post = createPost({
    authorEmail: session.user.email,
    authorName: session.user.name || session.user.email.split("@")[0],
    kind: body.kind === "review" ? "review" : "post",
    content,
    bookTitle: body.bookTitle,
    tags: Array.isArray(body.tags) ? body.tags : [],
  });

  return NextResponse.json(post, { status: 201 });
}
