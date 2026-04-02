import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoBooks } from "@/lib/bookshelf/demo-data";
import { searchBooks } from "@/lib/bookshelf/service";

function normalizeBook(book: {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  description: string | null;
  tags: string[];
  totalPages: number | null;
}) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverImage: book.coverUrl ?? "",
    description: book.description ?? "",
    genres: book.tags,
    rating: 0,
    pages: book.totalPages ?? 0,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") || undefined;
  const ratingRaw = searchParams.get("rating");
  const maxPagesRaw = searchParams.get("maxPages");

  const rating = ratingRaw ? Number(ratingRaw) : undefined;
  const maxPages = maxPagesRaw ? Number(maxPagesRaw) : undefined;

  try {
    const books = await prisma.book.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { author: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(genre ? { tags: { has: genre } } : {}),
        ...(maxPages ? { totalPages: { lte: maxPages } } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: 80,
    });

    const normalized = books.map(normalizeBook).filter((book) => (rating ? book.rating >= rating : true));

    if (normalized.length > 0) {
      return NextResponse.json({ books: normalized });
    }
  } catch {
    // Fall through to demo source.
  }

  const books = searchBooks(q, { genre, rating, maxPages });
  return NextResponse.json({ books: books.length ? books : demoBooks });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    const created = await prisma.book.create({
      data: {
        title: String(payload.title || "").trim(),
        author: String(payload.author || "").trim(),
        coverUrl: payload.coverImage ?? null,
        description: payload.description ?? null,
        tags: Array.isArray(payload.genres) ? payload.genres : [],
        totalPages: typeof payload.pages === "number" ? payload.pages : null,
      },
    });

    return NextResponse.json({ book: normalizeBook(created) }, { status: 201 });
  } catch {
    return NextResponse.json({ book: payload, mode: "demo" }, { status: 201 });
  }
}