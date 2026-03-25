export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { listOfflineSuggestions } from "@/lib/offline-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        following: {
          select: { followingId: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const excludedIds = user.following.map((entry) => entry.followingId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...excludedIds, user.id],
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(users.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      favoriteGenre: null,
    })));
  } catch (error) {
    console.error("Suggestions fetch error:", error);
    return NextResponse.json(listOfflineSuggestions(session.user.email));
  }
}
