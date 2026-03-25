import { prisma } from "@/lib/prisma";

export const SHELF_NAMES = {
  reading: "Currently Reading",
  finished: "Completed",
  unread: "Want to Read",
} as const;

export type ShelfStatus = keyof typeof SHELF_NAMES;

export function shelfNameFromStatus(status?: string | null) {
  const normalized = (status || "").toLowerCase();
  if (normalized === "reading") return SHELF_NAMES.reading;
  if (normalized === "finished") return SHELF_NAMES.finished;
  return SHELF_NAMES.unread;
}

export function statusFromShelfName(name: string): ShelfStatus {
  if (name === SHELF_NAMES.reading) return "reading";
  if (name === SHELF_NAMES.finished) return "finished";
  return "unread";
}

export async function ensureDefaultShelves(userId: string) {
  const names = Object.values(SHELF_NAMES);

  const existing = await prisma.shelf.findMany({
    where: {
      userId,
      name: { in: names },
    },
  });

  if (existing.length < names.length) {
    const existingNames = new Set(existing.map((shelf) => shelf.name));
    const toCreate = names
      .filter((name) => !existingNames.has(name))
      .map((name) => ({ name, userId }));

    if (toCreate.length > 0) {
      await prisma.shelf.createMany({ data: toCreate });
    }
  }

  const shelves = await prisma.shelf.findMany({
    where: { userId, name: { in: names } },
  });

  return {
    reading: shelves.find((s) => s.name === SHELF_NAMES.reading),
    finished: shelves.find((s) => s.name === SHELF_NAMES.finished),
    unread: shelves.find((s) => s.name === SHELF_NAMES.unread),
  };
}
