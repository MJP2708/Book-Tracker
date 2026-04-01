import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/bookshelf/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "6");

  return NextResponse.json({ recommendations: getRecommendations(userId, limit) });
}