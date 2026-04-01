export const runtime = "nodejs";

import { registerDemoAuthUser } from "@/lib/demo-auth";
import { getOrCreateOfflineUser } from "@/lib/offline-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { name?: string; email?: string; password?: string };
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const registered = await registerDemoAuthUser({ email, password, name });
  if (!registered.ok) {
    return NextResponse.json({ error: registered.error }, { status: 400 });
  }

  try {
    await prisma.user.upsert({
      where: { email },
      update: { name: name || email.split("@")[0] },
      create: { email, name: name || email.split("@")[0] },
    });
  } catch {
    getOrCreateOfflineUser(email, name || email.split("@")[0]);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
