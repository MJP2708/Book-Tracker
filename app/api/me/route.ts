export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { getOfflineProfile, updateOfflineUser } from "@/lib/offline-store";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves } from "@/lib/shelf-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
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

    await ensureDefaultShelves(user.id);

    const [booksRead, pageAgg] = await Promise.all([
      prisma.userBook.count({
        where: {
          userId: user.id,
          shelf: { name: "Completed" },
        },
      }),
      prisma.userBook.aggregate({
        where: { userId: user.id },
        _sum: { pagesRead: true },
      }),
    ]);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: null,
        createdAt: user.createdAt,
      },
      stats: {
        booksRead,
        totalPages: pageAgg._sum.pagesRead || 0,
        readingStreak: 0,
      },
      counts: {
        followers: user._count.followers,
        following: user._count.following,
        userBooks: user._count.userBooks,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(getOfflineProfile(session.user.email));
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, image, bio } = (await request.json()) as { name?: string; image?: string; bio?: string };

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(typeof name === "string" ? { name } : {}),
        ...(typeof bio === "string" ? { bio } : {}),
        ...(typeof image === "string" ? { image } : {}),
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            userBooks: true,
          },
        },
      },
    });

    const [booksRead, pageAgg] = await Promise.all([
      prisma.userBook.count({
        where: {
          userId: user.id,
          shelf: { name: "Completed" },
        },
      }),
      prisma.userBook.aggregate({
        where: { userId: user.id },
        _sum: { pagesRead: true },
      }),
    ]);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: {
        booksRead,
        totalPages: pageAgg._sum.pagesRead || 0,
        readingStreak: 0,
      },
      counts: {
        followers: user._count.followers,
        following: user._count.following,
        userBooks: user._count.userBooks,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    updateOfflineUser(session.user.email, {
      ...(typeof name === "string" ? { name } : {}),
      ...(typeof bio === "string" ? { bio } : {}),
      ...(typeof image === "string" ? { image } : {}),
    });
    return NextResponse.json(getOfflineProfile(session.user.email));
  }
}
