export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

type SessionRow = {
  id: string;
  listeners: number;
};

const fallbackSessions: SessionRow[] = [
  { id: "live_1", listeners: 36 },
  { id: "live_2", listeners: 12 },
];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;
  const payload = (await request.json().catch(() => ({}))) as { listenerName?: string };

  const row = fallbackSessions.find((item) => item.id === sessionId);
  if (!row) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  row.listeners += 1;

  return NextResponse.json({
    joined: true,
    sessionId,
    listeners: row.listeners,
    listenerName: String(payload.listenerName || "").trim() || "Listener",
    mode: "demo",
  });
}
