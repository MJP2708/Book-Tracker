export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves, shelfNameFromStatus, statusFromShelfName } from "@/lib/shelf-utils";
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

    const existing = await prisma.userBook.findUnique({ where: { id: entryId }, include: { shelf: true, book: true } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData: {
      shelfId?: string;
      pagesRead?: number;
      notes?: string;
      tags?: string[];
      highlights?: string[];
      progress?: number;
    } = {};

    if (typeof body.status === "string") {
      const shelfName = shelfNameFromStatus(body.status);
      const shelves = await ensureDefaultShelves(user.id);
      const target = Object.values(shelves).find((shelf) => shelf?.name === shelfName);
      if (target) {
        updateData.shelfId = target.id;
      }
    }

    if (Number.isFinite(Number(body.pagesRead))) {
      updateData.pagesRead = Number(body.pagesRead);
    }

    if (typeof body.notes === "string") {
      updateData.notes = body.notes;
    }

    if (Array.isArray(body.tags)) {
      updateData.tags = body.tags.map((tag: unknown) => String(tag).trim().toLowerCase()).filter(Boolean);
    }

    if (Array.isArray(body.highlights)) {
      updateData.highlights = body.highlights.map((item: unknown) => String(item).trim()).filter(Boolean);
    }

    if (Number.isFinite(Number(body.progress))) {
      updateData.progress = Math.max(0, Math.min(100, Number(body.progress)));
    }

    const updated = await prisma.userBook.update({
      where: { id: entryId },
      data: updateData,
      include: { book: true, shelf: true },
    });

    return NextResponse.json({
      id: updated.id,
      status: statusFromShelfName(updated.shelf.name),
      pagesRead: updated.pagesRead,
      totalPages: updated.book.totalPages,
      tags: updated.tags,
      book: {
        id: updated.book.id,
        title: updated.book.title,
        author: updated.book.author,
        coverImage: updated.book.coverUrl,
        description: updated.book.description,
      },
    });
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
