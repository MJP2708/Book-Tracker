import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { demoReviews } from "@/lib/bookshelf/demo-data";

const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().min(1).max(5),
  body: z.string().min(10),
  tags: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ reviews: demoReviews });
  }

  return NextResponse.json({ reviews: demoReviews.filter((review) => review.bookId === bookId) });
}

export async function POST(request: NextRequest) {
  const parsed = reviewSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: "user_demo_01",
        book_id: parsed.data.bookId,
        rating: parsed.data.rating,
        body: parsed.data.body,
        tags: parsed.data.tags,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ review: data }, { status: 201 });
  }

  return NextResponse.json(
    {
      review: {
        id: `review_${Date.now()}`,
        userId: "user_demo_01",
        helpfulVotes: 0,
        createdAt: new Date().toISOString(),
        ...parsed.data,
      },
      mode: "demo",
    },
    { status: 201 }
  );
}