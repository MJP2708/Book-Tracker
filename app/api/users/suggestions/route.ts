export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

    const users = await prisma.user.findMany({
      where: {
        id: { not: user.id },
        followers: {
          none: { followerId: user.id },
        },
      },
      take: 3,
      include: {
        readingStats: true,
      },
    });

    return NextResponse.json(
      users.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        favoriteGenre: candidate.readingStats?.favoriteGenre ?? null,
      }))
    );
  } catch (error) {
    console.error("Suggestions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
