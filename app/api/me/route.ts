export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        readingStats: true,
        _count: {
          select: {
            followers: true,
            following: true,
            userBooks: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: {
        booksRead: user.readingStats?.booksRead ?? 0,
        totalPages: user.readingStats?.totalPages ?? 0,
        readingStreak: user.readingStats?.readingStreak ?? 0,
        favoriteGenre: user.readingStats?.favoriteGenre ?? null,
      },
      counts: {
        followers: user._count.followers,
        following: user._count.following,
        userBooks: user._count.userBooks,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio } = await request.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { bio: typeof bio === "string" ? bio : null },
      include: {
        readingStats: true,
        _count: {
          select: {
            followers: true,
            following: true,
            userBooks: true,
          },
        },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: {
        booksRead: user.readingStats?.booksRead ?? 0,
        totalPages: user.readingStats?.totalPages ?? 0,
        readingStreak: user.readingStats?.readingStreak ?? 0,
        favoriteGenre: user.readingStats?.favoriteGenre ?? null,
      },
      counts: {
        followers: user._count.followers,
        following: user._count.following,
        userBooks: user._count.userBooks,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
