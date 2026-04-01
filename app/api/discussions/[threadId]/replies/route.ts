export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { replyDiscussion } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { threadId } = await context.params;

  const body = (await request.json()) as { content?: string };
  const content = String(body.content || "").trim();
  if (!content) return NextResponse.json({ error: "Reply content is required" }, { status: 400 });

  const reply = replyDiscussion({
    threadId,
    authorEmail: session.user.email,
    authorName: session.user.name || session.user.email.split("@")[0],
    content,
  });

  if (!reply) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  return NextResponse.json(reply, { status: 201 });
}
