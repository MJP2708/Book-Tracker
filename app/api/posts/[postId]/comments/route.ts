export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { addPostComment, listPostComments } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;
  return NextResponse.json(listPostComments(postId));
}

export async function POST(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { postId } = await context.params;

  const body = (await request.json()) as { content?: string };
  const content = String(body.content || "").trim();
  if (!content) return NextResponse.json({ error: "Comment content is required" }, { status: 400 });

  const comment = addPostComment({
    postId,
    authorEmail: session.user.email,
    authorName: session.user.name || session.user.email.split("@")[0],
    content,
  });

  if (!comment) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(comment, { status: 201 });
}
