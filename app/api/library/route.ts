export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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

    const books = await prisma.userBook.findMany({
      where: { userId: user.id },
      include: { book: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Library fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch library" },
      { status: 500 }
    );
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

    const { bookId, status, rating, review, pagesRead, totalPages } =
      await request.json();

    const userBook = await prisma.userBook.upsert({
      where: {
        userId_bookId: { userId: user.id, bookId },
      },
      update: {
        status,
        rating,
        review,
        pagesRead,
        totalPages,
      },
      create: {
        userId: user.id,
        bookId,
        status,
        rating,
        review,
        pagesRead,
        totalPages,
      },
    });

    return NextResponse.json(userBook, { status: 201 });
  } catch (error) {
    console.error("Add to library error:", error);
    return NextResponse.json(
      { error: "Failed to add book to library" },
      { status: 500 }
    );
  }
}
