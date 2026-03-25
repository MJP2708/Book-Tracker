export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await context.params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.userBook.findUnique({ where: { id: entryId } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const body = await request.json();
    const updatePayload: {
      status?: string;
      pagesRead?: number;
      totalPages?: number | null;
      notes?: string;
      tags?: string[];
      isPinned?: boolean;
    } = {};

    if (typeof body.status === "string") updatePayload.status = body.status;
    if (Number.isFinite(Number(body.pagesRead))) updatePayload.pagesRead = Number(body.pagesRead);
    if (body.totalPages === null) updatePayload.totalPages = null;
    if (Number.isFinite(Number(body.totalPages))) updatePayload.totalPages = Number(body.totalPages);
    if (typeof body.notes === "string") updatePayload.notes = body.notes;
    if (Array.isArray(body.tags)) {
      updatePayload.tags = body.tags
        .map((tag: unknown) => String(tag).trim().toLowerCase())
        .filter((tag: string) => tag.length > 0);
    }
    if (typeof body.isPinned === "boolean") updatePayload.isPinned = body.isPinned;

    const updated = await prisma.userBook.update({
      where: { id: entryId },
      data: updatePayload,
      include: { book: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update entry error", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await context.params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.userBook.findUnique({ where: { id: entryId } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await prisma.userBook.delete({ where: { id: entryId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete entry error", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
