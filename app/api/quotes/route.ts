export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { createQuote, listQuotes } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(listQuotes());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { bookTitle?: string; text?: string };

  const bookTitle = String(body.bookTitle || "").trim();
  const text = String(body.text || "").trim();
  if (!bookTitle || !text) return NextResponse.json({ error: "Book title and quote text are required" }, { status: 400 });

  const quote = createQuote({
    authorEmail: session.user.email,
    authorName: session.user.name || session.user.email.split("@")[0],
    bookTitle,
    text,
  });
  return NextResponse.json(quote, { status: 201 });
}
