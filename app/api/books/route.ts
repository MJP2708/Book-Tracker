import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { demoBooks } from "@/lib/bookshelf/demo-data";
import { searchBooks } from "@/lib/bookshelf/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") || undefined;
  const ratingRaw = searchParams.get("rating");
  const maxPagesRaw = searchParams.get("maxPages");

  const rating = ratingRaw ? Number(ratingRaw) : undefined;
  const maxPages = maxPagesRaw ? Number(maxPagesRaw) : undefined;

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    let query = supabase.from("books").select("*").limit(60);

    if (q) {
      query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (genre) {
      query = query.contains("genres", [genre]);
    }

    if (rating) {
      query = query.gte("rating", rating);
    }

    if (maxPages) {
      query = query.lte("pages", maxPages);
    }

    const { data, error } = await query;

    if (!error && data) {
      return NextResponse.json({ books: data });
    }
  }

  const books = searchBooks(q, { genre, rating, maxPages });
  return NextResponse.json({ books: books.length ? books : demoBooks });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("books")
      .insert({
        title: payload.title,
        author: payload.author,
        cover_image: payload.coverImage,
        description: payload.description,
        genres: payload.genres,
        rating: payload.rating ?? 0,
        pages: payload.pages,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ book: data }, { status: 201 });
  }

  return NextResponse.json({ book: payload, mode: "demo" }, { status: 201 });
}