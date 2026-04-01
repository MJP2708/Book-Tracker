export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { createClub, listClubs } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(listClubs());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    name?: string;
    description?: string;
    currentBook?: string;
    targetDate?: string;
  };

  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  if (!name || !description) {
    return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
  }

  const club = createClub({
    name,
    description,
    currentBook: String(body.currentBook || "Atomic Habits"),
    targetDate: String(body.targetDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()),
    ownerEmail: session.user.email,
    ownerName: session.user.name || session.user.email.split("@")[0],
  });

  return NextResponse.json(club, { status: 201 });
}
