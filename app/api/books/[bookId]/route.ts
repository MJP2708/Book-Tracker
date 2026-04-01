export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves, shelfNameFromStatus, statusFromShelfName } from "@/lib/shelf-utils";
import { NextRequest, NextResponse } from "next/server";
import { getOfflineBook, getOfflineUserBook, updateOfflineUserBookByBookId } from "@/lib/offline-store";
import { logActivity } from "@/lib/social-demo";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await context.params;
  const session = await auth();

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    let userBook: {
      id: string;
      status: string;
      pagesRead: number;
      totalPages: number | null;
      progress: number;
      note: string;
      highlights: string[];
    } | null = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) {
        await ensureDefaultShelves(user.id);
        const userBookRecord = await prisma.userBook.findUnique({
          where: { userId_bookId: { userId: user.id, bookId } },
          include: { shelf: true },
        });
        userBook = userBookRecord
          ? {
              id: userBookRecord.id,
              status: statusFromShelfName(userBookRecord.shelf.name),
              pagesRead: userBookRecord.pagesRead,
              totalPages: book.totalPages,
              progress: userBookRecord.progress,
              note: userBookRecord.notes || "",
              highlights: userBookRecord.highlights,
            }
          : null;
      }
    }

    return NextResponse.json({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverUrl,
      description: book.description,
      totalPages: book.totalPages,
      userBook,
    });
  } catch (error) {
    console.error("Book detail error", error);
    const offlineBook = getOfflineBook(bookId);
    if (!offlineBook) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    const offlineUserBook = session?.user?.email ? getOfflineUserBook(session.user.email, bookId) : null;
    return NextResponse.json({
      id: offlineBook.id, title: offlineBook.title, author: offlineBook.author,
      coverImage: offlineBook.coverImage, description: offlineBook.description, totalPages: offlineBook.totalPages,
      userBook: offlineUserBook,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await context.params;
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as Record<string, unknown>;
  const status = typeof body.status === "string" ? body.status : "unread";
  const pagesRead = Number.isFinite(Number(body.pagesRead)) ? Number(body.pagesRead) : 0;
  const totalPages = Number.isFinite(Number(body.totalPages)) ? Number(body.totalPages) : null;
  const note = typeof body.note === "string" ? body.note : "";
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.map((entry: unknown) => String(entry).trim()).filter(Boolean)
    : [];

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not in DB");

    const shelves = await ensureDefaultShelves(user.id);
    const shelfName = shelfNameFromStatus(status);
    const targetShelf = Object.values(shelves).find((shelf) => shelf?.name === shelfName);
    if (!targetShelf) return NextResponse.json({ error: "Target shelf not found" }, { status: 500 });

    if (totalPages !== null) {
      await prisma.book.update({ where: { id: bookId }, data: { totalPages } });
    }

    const progress = totalPages && totalPages > 0 ? Math.min(100, Math.round((pagesRead / totalPages) * 100)) : 0;

    const userBook = await prisma.userBook.upsert({
      where: { userId_bookId: { userId: user.id, bookId } },
      update: { shelfId: targetShelf.id, pagesRead, notes: note, highlights, progress },
      create: { userId: user.id, bookId, shelfId: targetShelf.id, pagesRead, notes: note, highlights, progress },
    });

    logActivity({
      actorEmail: session.user.email,
      actorName: session.user.name || session.user.email.split("@")[0],
      type: highlights.length > 0 ? "highlight_added" : "progress_updated",
      text: highlights.length > 0 ? "Saved new highlights" : `Updated reading progress to ${progress}%`,
      metadata: { bookId, progress },
    });

    return NextResponse.json(userBook);
  } catch (error) {
    console.error("Book update error", error);
    const updated = updateOfflineUserBookByBookId(session.user.email, bookId, {
      status: status as "unread" | "reading" | "finished", pagesRead, totalPages, notes: note, highlights,
    });
    if (updated) {
      logActivity({
        actorEmail: session.user.email,
        actorName: session.user.name || session.user.email.split("@")[0],
        type: highlights.length > 0 ? "highlight_added" : "progress_updated",
        text: highlights.length > 0 ? "Saved new highlights" : "Updated reading progress",
        metadata: { bookId },
      });
    }
    return NextResponse.json(updated || { error: "Book not found" }, { status: updated ? 200 : 404 });
  }
}
