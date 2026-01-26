export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        id: { not: user.id },
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
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
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
