export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { toggleClubMembership } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ clubId: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { clubId } = await context.params;

  const result = toggleClubMembership(
    clubId,
    session.user.email,
    session.user.name || session.user.email.split("@")[0]
  );
  if (!result) return NextResponse.json({ error: "Club not found" }, { status: 404 });
  return NextResponse.json(result);
}
