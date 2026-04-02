export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type SessionRow = {
  id: string;
  listeners: number;
};

const fallbackSessions: SessionRow[] = [];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;
  const viewer = await auth();
  const payload = (await request.json().catch(() => ({}))) as { asGuest?: boolean };

  let row = fallbackSessions.find((item) => item.id === sessionId);
  if (!row) {
    row = { id: sessionId, listeners: 0 };
    fallbackSessions.unshift(row);
  }

  row.listeners += 1;

  return NextResponse.json({
    joined: true,
    sessionId,
    listeners: row.listeners,
    listenerName: payload.asGuest ? "Guest" : viewer?.user?.name || "Guest",
    mode: "demo",
  });
}
