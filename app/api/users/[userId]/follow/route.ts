export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { toggleOfflineFollow } from "@/lib/offline-store";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId: userIdToFollow } = await context.params;

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      const offline = toggleOfflineFollow(session.user.email, userIdToFollow);
      if ("error" in offline) {
        return NextResponse.json({ error: offline.error }, { status: 400 });
      }
      return NextResponse.json({ isFollowing: offline.isFollowing }, { status: 200 });
    }

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
    const offline = toggleOfflineFollow(session.user.email, userIdToFollow);
    if ("error" in offline) {
      return NextResponse.json({ error: offline.error }, { status: 400 });
    }
    return NextResponse.json({ isFollowing: offline.isFollowing }, { status: 200 });
  }
}
