export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { searchOfflineUsers } from "@/lib/offline-store";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim();

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json(searchOfflineUsers(session.user.email, query));
    }

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
      take: 8,
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
    console.error("User search error:", error);
    return NextResponse.json(searchOfflineUsers(session.user.email, query));
  }
}
