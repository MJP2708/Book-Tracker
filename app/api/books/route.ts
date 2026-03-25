export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function toTagList(genre?: string | null) {
  return genre ? [genre.toLowerCase()] : [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "").trim();
    const tag = (searchParams.get("tag") || "").trim().toLowerCase();

    const where: {
      OR?: Array<{ title?: { contains: string; mode: "insensitive" }; author?: { contains: string; mode: "insensitive" } }>;
      genre?: { contains: string; mode: "insensitive" };
    } = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
      ];
    }

    if (tag) {
      where.genre = { contains: tag, mode: "insensitive" };
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 40,
    });

    return NextResponse.json(books);
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

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const created = await prisma.book.create({
      data: {
        title,
        author: String(body.author || "Unknown").trim(),
        coverImage: String(body.coverImage || body.coverUrl || "").trim() || null,
        description: String(body.description || "").trim() || null,
        totalPages: Number.isFinite(Number(body.totalPages)) ? Number(body.totalPages) : null,
        genre: toTagList(body.genre).join(",") || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Book create error", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
