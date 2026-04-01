export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves, shelfNameFromStatus, statusFromShelfName } from "@/lib/shelf-utils";
import { NextRequest, NextResponse } from "next/server";
import { updateOfflineLibraryEntryById, deleteOfflineLibraryEntryById } from "@/lib/offline-store";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ entryId: string }> }
) {
  const { entryId } = await context.params;
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not in DB");

    const existing = await prisma.userBook.findUnique({ where: { id: entryId }, include: { shelf: true, book: true } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const updateData: { shelfId?: string; pagesRead?: number; notes?: string; tags?: string[]; highlights?: string[]; progress?: number; } = {};
    if (typeof body.status === "string") {
      const shelfName = shelfNameFromStatus(body.status);
      const shelves = await ensureDefaultShelves(user.id);
      const target = Object.values(shelves).find((shelf) => shelf?.name === shelfName);
      if (target) updateData.shelfId = target.id;
    }
    if (Number.isFinite(Number(body.pagesRead))) updateData.pagesRead = Number(body.pagesRead);
    if (typeof body.notes === "string") updateData.notes = body.notes;
    if (Array.isArray(body.tags)) updateData.tags = body.tags.map((t: unknown) => String(t).trim().toLowerCase()).filter(Boolean);
    if (Array.isArray(body.highlights)) updateData.highlights = body.highlights.map((i: unknown) => String(i).trim()).filter(Boolean);
    if (Number.isFinite(Number(body.progress))) updateData.progress = Math.max(0, Math.min(100, Number(body.progress)));

    const updated = await prisma.userBook.update({ where: { id: entryId }, data: updateData, include: { book: true, shelf: true } });
    return NextResponse.json({
      id: updated.id, status: statusFromShelfName(updated.shelf.name), pagesRead: updated.pagesRead,
      totalPages: updated.book.totalPages, tags: updated.tags,
      book: { id: updated.book.id, title: updated.book.title, author: updated.book.author, coverImage: updated.book.coverUrl, description: updated.book.description },
    });
  } catch (error) {
    console.error("Update entry error", error);
    const patch: Parameters<typeof updateOfflineLibraryEntryById>[2] = {};
    if (typeof body.status === "string") patch.status = body.status as "unread" | "reading" | "finished";
    if (Number.isFinite(Number(body.pagesRead))) patch.pagesRead = Number(body.pagesRead);
    if (typeof body.notes === "string") patch.notes = body.notes;
    if (Array.isArray(body.tags)) patch.tags = body.tags.map((t: unknown) => String(t).trim().toLowerCase()).filter(Boolean);
    if (Array.isArray(body.highlights)) patch.highlights = body.highlights.map((i: unknown) => String(i).trim()).filter(Boolean);
    const updated = updateOfflineLibraryEntryById(session.user.email, entryId, patch);
    return NextResponse.json(updated || { error: "Entry not found" }, { status: updated ? 200 : 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ entryId: string }> }
) {
  const { entryId } = await context.params;
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not in DB");

    const existing = await prisma.userBook.findUnique({ where: { id: entryId } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    await prisma.userBook.delete({ where: { id: entryId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete entry error", error);
    const deleted = deleteOfflineLibraryEntryById(session.user.email, entryId);
    return NextResponse.json(deleted ? { ok: true } : { error: "Entry not found" }, { status: deleted ? 200 : 404 });
  }
}
