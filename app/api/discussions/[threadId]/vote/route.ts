export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { voteDiscussion } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { threadId } = await context.params;

  const body = (await request.json()) as { direction?: "up" | "down" };
  const direction = body.direction === "down" ? "down" : "up";
  const result = voteDiscussion(threadId, session.user.email, direction);
  if (!result) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  return NextResponse.json(result);
}
