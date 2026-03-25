export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    const [user, userBooks] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          bio: true,
          avatar: true,
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
        include: { book: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, userBooks });
  } catch (error) {
    console.error("Public profile error", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
