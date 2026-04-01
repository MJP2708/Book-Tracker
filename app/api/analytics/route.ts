export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { getAnalytics, setGoals } from "@/lib/social-demo";
import { NextRequest, NextResponse } from "next/server";

async function readingStatsFor() {
  try {
    const base = process.env.NEXTAUTH_URL || process.env.AUTH_URL;
    if (!base) return { booksRead: 0, totalPages: 0, readingStreak: 0 };
    const res = await fetch(`${base}/api/me`, { cache: "no-store" });
    if (!res.ok) return { booksRead: 0, totalPages: 0, readingStreak: 0 };
    const payload = (await res.json()) as { stats?: { booksRead?: number; totalPages?: number; readingStreak?: number } };
    return {
      booksRead: Number(payload.stats?.booksRead || 0),
      totalPages: Number(payload.stats?.totalPages || 0),
      readingStreak: Number(payload.stats?.readingStreak || 0),
    };
  } catch {
    return { booksRead: 0, totalPages: 0, readingStreak: 0 };
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stats = await readingStatsFor();
  return NextResponse.json(getAnalytics(session.user.email, stats));
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { yearlyBooks?: number; weeklyPages?: number };
  setGoals(session.user.email, body);
  const stats = await readingStatsFor();
  return NextResponse.json(getAnalytics(session.user.email, stats));
}
