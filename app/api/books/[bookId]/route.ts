import { NextResponse } from "next/server";
import { getBookById, getReviewsByBookId } from "@/lib/bookshelf/service";

type RouteContext = {
  params: Promise<{ bookId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { bookId } = await context.params;
  const book = getBookById(bookId);

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({ book, reviews: getReviewsByBookId(bookId) });
}