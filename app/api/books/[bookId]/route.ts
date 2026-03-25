export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves, shelfNameFromStatus, statusFromShelfName } from "@/lib/shelf-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await context.params;

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await ensureDefaultShelves(user.id);

    const [book, userBook] = await Promise.all([
      prisma.book.findUnique({ where: { id: bookId } }),
      prisma.userBook.findUnique({
        where: { userId_bookId: { userId: user.id, bookId } },
        include: { shelf: true },
      }),
    ]);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverUrl,
      description: book.description,
      totalPages: book.totalPages,
      userBook: userBook
        ? {
            id: userBook.id,
            status: statusFromShelfName(userBook.shelf.name),
            pagesRead: userBook.pagesRead,
            totalPages: book.totalPages,
            progress: userBook.progress,
            note: userBook.notes || "",
            highlights: userBook.highlights,
          }
        : null,
    });
  } catch (error) {
    console.error("Book detail error", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await context.params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const shelves = await ensureDefaultShelves(user.id);

    const body = await request.json();
    const status = typeof body.status === "string" ? body.status : "unread";
    const pagesRead = Number.isFinite(Number(body.pagesRead)) ? Number(body.pagesRead) : 0;
    const totalPages = Number.isFinite(Number(body.totalPages)) ? Number(body.totalPages) : null;
    const note = typeof body.note === "string" ? body.note : "";
    const highlights = Array.isArray(body.highlights)
      ? body.highlights.map((entry: unknown) => String(entry).trim()).filter(Boolean)
      : [];

    const shelfName = shelfNameFromStatus(status);
    const targetShelf = Object.values(shelves).find((shelf) => shelf?.name === shelfName);

    if (!targetShelf) {
      return NextResponse.json({ error: "Target shelf not found" }, { status: 500 });
    }

    if (totalPages !== null) {
      await prisma.book.update({
        where: { id: bookId },
        data: { totalPages },
      });
    }

    const progress = totalPages && totalPages > 0 ? Math.min(100, Math.round((pagesRead / totalPages) * 100)) : 0;

    const userBook = await prisma.userBook.upsert({
      where: { userId_bookId: { userId: user.id, bookId } },
      update: {
        shelfId: targetShelf.id,
        pagesRead,
        notes: note,
        highlights,
        progress,
      },
      create: {
        userId: user.id,
        bookId,
        shelfId: targetShelf.id,
        pagesRead,
        notes: note,
        highlights,
        progress,
      },
    });

    return NextResponse.json(userBook);
  } catch (error) {
    console.error("Book update error", error);
    return NextResponse.json({ error: "Failed to update book details" }, { status: 500 });
  }
}
