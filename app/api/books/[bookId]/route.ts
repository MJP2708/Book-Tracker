export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function parseNotes(raw: string | null) {
  if (!raw) {
    return { note: "", highlights: [] as string[] };
  }

  try {
    const parsed = JSON.parse(raw) as { note?: string; highlights?: string[] };
    return {
      note: parsed.note || "",
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
    };
  } catch {
    return { note: raw, highlights: [] as string[] };
  }
}

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

    const [book, userBook] = await Promise.all([
      prisma.book.findUnique({ where: { id: bookId } }),
      prisma.userBook.findUnique({
        where: { userId_bookId: { userId: user.id, bookId } },
      }),
    ]);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const parsed = parseNotes(userBook?.notes ?? null);

    return NextResponse.json({
      ...book,
      userBook: userBook
        ? {
            id: userBook.id,
            status: userBook.status,
            pagesRead: userBook.pagesRead,
            totalPages: userBook.totalPages,
            progress: userBook.totalPages
              ? Math.min(100, Math.round(((userBook.pagesRead || 0) / userBook.totalPages) * 100))
              : 0,
            note: parsed.note,
            highlights: parsed.highlights,
            tags: userBook.tags,
            isPinned: userBook.isPinned,
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

    const body = await request.json();
    const note = String(body.note || "");
    const highlights = Array.isArray(body.highlights)
      ? body.highlights
          .map((entry: unknown) => String(entry).trim())
          .filter((entry: string) => entry.length > 0)
      : [];

    const status = String(body.status || "unread");
    const pagesRead = Number.isFinite(Number(body.pagesRead)) ? Number(body.pagesRead) : 0;
    const totalPages = Number.isFinite(Number(body.totalPages))
      ? Number(body.totalPages)
      : body.totalPages === null
      ? null
      : undefined;

    const userBook = await prisma.userBook.upsert({
      where: { userId_bookId: { userId: user.id, bookId } },
      update: {
        status,
        pagesRead,
        ...(typeof totalPages === "number" || totalPages === null
          ? { totalPages }
          : {}),
        notes: JSON.stringify({ note, highlights }),
      },
      create: {
        userId: user.id,
        bookId,
        status,
        pagesRead,
        totalPages: typeof totalPages === "number" ? totalPages : null,
        notes: JSON.stringify({ note, highlights }),
      },
    });

    return NextResponse.json(userBook);
  } catch (error) {
    console.error("Book update error", error);
    return NextResponse.json({ error: "Failed to update book details" }, { status: 500 });
  }
}
