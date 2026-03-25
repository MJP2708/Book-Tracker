export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function toStatus(input: string) {
  const normalized = input.trim().toLowerCase();
  if (normalized === "reading" || normalized === "finished" || normalized === "unread") {
    return normalized;
  }
  return "unread";
}

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
    const statusFilter = (searchParams.get("status") || "").trim().toLowerCase();

    const books = await prisma.userBook.findMany({
      where: {
        userId: user.id,
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      include: { book: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(books);
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { bookId, status, rating, review, pagesRead, totalPages, notes, tags } = await request.json();

    if (!bookId || typeof bookId !== "string") {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    const userBook = await prisma.userBook.upsert({
      where: { userId_bookId: { userId: user.id, bookId } },
      update: {
        status: status ? toStatus(String(status)) : undefined,
        rating: Number.isFinite(Number(rating)) ? Number(rating) : undefined,
        review: typeof review === "string" ? review : undefined,
        pagesRead: Number.isFinite(Number(pagesRead)) ? Number(pagesRead) : undefined,
        totalPages: Number.isFinite(Number(totalPages)) ? Number(totalPages) : undefined,
        notes: typeof notes === "string" ? notes : undefined,
        tags: Array.isArray(tags)
          ? tags.map((entry) => String(entry).trim()).filter((entry) => entry.length > 0)
          : undefined,
      },
      create: {
        userId: user.id,
        bookId,
        status: toStatus(String(status || "unread")),
        rating: Number.isFinite(Number(rating)) ? Number(rating) : null,
        review: typeof review === "string" ? review : null,
        pagesRead: Number.isFinite(Number(pagesRead)) ? Number(pagesRead) : 0,
        totalPages: Number.isFinite(Number(totalPages)) ? Number(totalPages) : null,
        notes: typeof notes === "string" ? notes : null,
        tags: Array.isArray(tags)
          ? tags.map((entry) => String(entry).trim()).filter((entry) => entry.length > 0)
          : [],
      },
      include: { book: true },
    });

    return NextResponse.json(userBook, { status: 201 });
  } catch (error) {
    console.error("Add to library error:", error);
    return NextResponse.json({ error: "Failed to add book to library" }, { status: 500 });
  }
}
