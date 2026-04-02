import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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

  const auth = await requireAuthenticatedUserForApi();
  if (!auth.allowed) {
    return auth.response!;
  }

  return NextResponse.json(
    {
      review: {
        id: `review_${Date.now()}`,
        userId: auth.userId,
        helpfulVotes: 0,
        createdAt: new Date().toISOString(),
        ...parsed.data,
      },
      mode: "demo",
    },
    { status: 201 }
  );
}