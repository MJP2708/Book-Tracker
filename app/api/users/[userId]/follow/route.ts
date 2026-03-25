export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { userId: userIdToFollow } = await context.params;

    if (user.id === userIdToFollow) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userIdToFollow,
        },
      },
    });

    let isFollowing = false;

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      isFollowing = false;
    } else {
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: userIdToFollow,
        },
      });
      isFollowing = true;
    }

    return NextResponse.json({ isFollowing }, { status: 200 });
  } catch (error) {
    console.error("Follow toggle error:", error);
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 });
  }
}
