import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { demoReviews } from "@/lib/bookshelf/demo-data";
import { requireAuthenticatedUserForApi } from "@/lib/monetization/guards";

const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().min(1).max(5),
  body: z.string().min(10),
  tags: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    let query = supabase
      .from("reviews")
      .select("id,user_id,book_id,rating,body,tags,helpful_votes,created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (bookId) {
      query = query.eq("book_id", bookId);
    }

    const { data, error } = await query;
    if (!error && data) {
      return NextResponse.json({ reviews: data });
    }
  }

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
    const auth = await requireAuthenticatedUserForApi();
    if (!auth.allowed) {
      return auth.response!;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: auth.userId,
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
        userId: "demo_local_user",
        helpfulVotes: 0,
        createdAt: new Date().toISOString(),
        ...parsed.data,
      },
      mode: "demo",
    },
    { status: 201 }
  );
}
