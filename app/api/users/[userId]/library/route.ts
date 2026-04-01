export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getOfflinePublicProfile, checkOfflineIsFollowing } from "@/lib/offline-store";
import { statusFromShelfName } from "@/lib/shelf-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const session = await auth();

    const [user, userBooks] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          bio: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      }),
      prisma.userBook.findMany({
        where: { userId },
        include: { book: true, shelf: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let isFollowing = false;
    if (session?.user?.email) {
      const currentUser = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
      if (currentUser && currentUser.id !== userId) {
        const follow = await prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: currentUser.id, followingId: userId } },
        });
        isFollowing = !!follow;
      }
    }

    return NextResponse.json({
      user,
      isFollowing,
      userBooks: userBooks.map((entry) => ({
        id: entry.id,
        status: statusFromShelfName(entry.shelf.name),
        book: {
          id: entry.book.id,
          title: entry.book.title,
          author: entry.book.author,
        },
      })),
    });
  } catch (error) {
    console.error("Public profile error", error);
    const { userId } = await context.params;
    const profile = getOfflinePublicProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const session = await auth();
    const isFollowing = session?.user?.email ? checkOfflineIsFollowing(session.user.email, userId) : false;
    return NextResponse.json({ ...profile, isFollowing });
  }
}
