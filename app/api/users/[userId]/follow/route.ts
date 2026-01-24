import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const userIdToFollow = params.userId;

    // Check if already following
    const existing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userIdToFollow,
        },
      },
    });

    let isFollowing = false;

    if (existing) {
      await prisma.follows.delete({
        where: { id: existing.id },
      });
      isFollowing = false;
    } else {
      await prisma.follows.create({
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
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    );
  }
}
