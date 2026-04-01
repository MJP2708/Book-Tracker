export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { togglePostLike } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { postId } = await context.params;

  const result = togglePostLike(postId, session.user.email);
  if (!result) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(result);
}
