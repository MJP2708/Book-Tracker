export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { listOfflineKnowledge } from "@/lib/offline-store";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim();

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json(listOfflineKnowledge(session.user.email, query));

    const entries = await prisma.userBook.findMany({
      where: {
        userId: user.id,
        OR: query
          ? [
              { notes: { contains: query, mode: "insensitive" } },
              { highlights: { hasSome: [query] } },
              { book: { title: { contains: query, mode: "insensitive" } } },
            ]
          : undefined,
      },
      include: { book: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    return NextResponse.json(
      entries.map((entry) => ({
        entryId: entry.id,
        bookId: entry.bookId,
        bookTitle: entry.book.title,
        notes: entry.notes || "",
        highlights: entry.highlights,
      }))
    );
  } catch {
    return NextResponse.json(listOfflineKnowledge(session.user.email, query));
  }
}
