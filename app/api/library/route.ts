export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { addOfflineLibraryEntry, getOrCreateOfflineUser, listOfflineLibrary } from "@/lib/offline-store";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/social-demo";
import { ensureDefaultShelves, shelfNameFromStatus, statusFromShelfName } from "@/lib/shelf-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json(listOfflineLibrary(session.user.email));
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
    return NextResponse.json(listOfflineLibrary(session.user.email));
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { bookId, status, pagesRead, notes, tags } = body;

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      const ensured = getOrCreateOfflineUser(session.user.email, session.user.name || undefined);
      if (!ensured) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const created = addOfflineLibraryEntry(session.user.email, {
        bookId,
        status: typeof status === "string" ? (status as "unread" | "reading" | "finished") : "unread",
        pagesRead: Number.isFinite(Number(pagesRead)) ? Number(pagesRead) : undefined,
        notes: typeof notes === "string" ? notes : undefined,
        tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean) : undefined,
      });
      if (!created) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      logActivity({
        actorEmail: session.user.email,
        actorName: session.user.name || session.user.email.split("@")[0],
        type: "book_added",
        text: `Added a book to ${typeof status === "string" ? status : "unread"}`,
      });
      return NextResponse.json(created, { status: 201 });
    }

    const shelves = await ensureDefaultShelves(user.id);

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

    logActivity({
      actorEmail: session.user.email,
      actorName: session.user.name || session.user.email.split("@")[0],
      type: "book_added",
      text: `Added ${entry.book.title} to ${statusFromShelfName(entry.shelf.name)}`,
      metadata: { bookId: entry.book.id },
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
    const created = addOfflineLibraryEntry(session.user.email, {
      bookId,
      status: typeof status === "string" ? (status as "unread" | "reading" | "finished") : "unread",
      pagesRead: Number.isFinite(Number(pagesRead)) ? Number(pagesRead) : undefined,
      notes: typeof notes === "string" ? notes : undefined,
      tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean) : undefined,
    });
    if (!created) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    logActivity({
      actorEmail: session.user.email,
      actorName: session.user.name || session.user.email.split("@")[0],
      type: "book_added",
      text: `Added a book to ${typeof status === "string" ? status : "unread"}`,
    });
    return NextResponse.json(created, { status: 201 });
  }
}
