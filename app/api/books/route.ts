export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "").trim();
    const tag = (searchParams.get("tag") || "").trim().toLowerCase();

    const books = await prisma.book.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { author: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
          tag ? { tags: { has: tag } } : {},
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 40,
    });

    return NextResponse.json(
      books.map((book) => ({
        ...book,
        coverImage: book.coverUrl,
      }))
    );
  } catch (error) {
    console.error("Books fetch error", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title || "").trim();
    const author = String(body.author || "Unknown").trim();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const created = await prisma.book.create({
      data: {
        title,
        author,
        coverUrl: String(body.coverImage || body.coverUrl || "").trim() || null,
        description: String(body.description || "").trim() || null,
        totalPages: Number.isFinite(Number(body.totalPages)) ? Number(body.totalPages) : null,
        tags: Array.isArray(body.tags)
          ? body.tags.map((tag: unknown) => String(tag).trim().toLowerCase()).filter(Boolean)
          : String(body.genre || "")
              .split(",")
              .map((tag) => tag.trim().toLowerCase())
              .filter(Boolean),
      },
    });

    return NextResponse.json(
      {
        ...created,
        coverImage: created.coverUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Book create error", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
