export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves, shelfNameFromStatus, statusFromShelfName } from "@/lib/shelf-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await ensureDefaultShelves(user.id);

    const entries = await prisma.userBook.findMany({
      where: { userId: user.id },
      include: {
        book: true,
        shelf: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      entries.map((entry) => ({
        id: entry.id,
        status: statusFromShelfName(entry.shelf.name),
        pagesRead: entry.pagesRead,
        totalPages: entry.book.totalPages,
        tags: entry.tags,
        book: {
          id: entry.book.id,
          title: entry.book.title,
          author: entry.book.author,
          coverImage: entry.book.coverUrl,
          description: entry.book.description,
        },
      }))
    );
  } catch (error) {
    console.error("Library fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch library" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const shelves = await ensureDefaultShelves(user.id);
    const { bookId, status, pagesRead, notes, tags } = await request.json();

    if (!bookId || typeof bookId !== "string") {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    const shelfName = shelfNameFromStatus(typeof status === "string" ? status : null);
    const targetShelf = Object.values(shelves).find((shelf) => shelf?.name === shelfName);

    if (!targetShelf) {
      return NextResponse.json({ error: "Target shelf not found" }, { status: 500 });
    }

    const entry = await prisma.userBook.upsert({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId,
        },
      },
      update: {
        shelfId: targetShelf.id,
        pagesRead: Number.isFinite(Number(pagesRead)) ? Number(pagesRead) : undefined,
        notes: typeof notes === "string" ? notes : undefined,
        tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean) : undefined,
      },
      create: {
        userId: user.id,
        bookId,
        shelfId: targetShelf.id,
        pagesRead: Number.isFinite(Number(pagesRead)) ? Number(pagesRead) : 0,
        notes: typeof notes === "string" ? notes : null,
        tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean) : [],
      },
      include: {
        book: true,
        shelf: true,
      },
    });

    return NextResponse.json(
      {
        id: entry.id,
        status: statusFromShelfName(entry.shelf.name),
        pagesRead: entry.pagesRead,
        totalPages: entry.book.totalPages,
        tags: entry.tags,
        book: {
          id: entry.book.id,
          title: entry.book.title,
          author: entry.book.author,
          coverImage: entry.book.coverUrl,
          description: entry.book.description,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to library error:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}
