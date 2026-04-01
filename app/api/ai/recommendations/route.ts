export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { getAiRecommendations } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const interests = (searchParams.get("interests") || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const profileTags = ["productivity", "business", "learning"];
  return NextResponse.json(getAiRecommendations({ profileTags, interests }));
}
