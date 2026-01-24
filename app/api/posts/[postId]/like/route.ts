import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { postId } = await context.params;

    // Check if already liked
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: { userId: user.id, postId },
      },
    });

    let liked = false;

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });
      liked = false;
    } else {
      await prisma.like.create({
        data: { userId: user.id, postId },
      });
      liked = true;
    }

    // Get updated post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    return NextResponse.json(
      { liked, likeCount: post?._count.likes || 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
