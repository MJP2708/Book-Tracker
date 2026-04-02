import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUserForApi } from "@/lib/monetization/guards";

const moveSchema = z.object({
  userBookId: z.string().min(1),
  fromShelf: z.enum(["want_to_read", "currently_reading", "finished"]),
  toShelf: z.enum(["want_to_read", "currently_reading", "finished"]),
  progress: z.number().min(0).max(100).optional(),
});

const shelfNameMap = {
  want_to_read: "Want to Read",
  currently_reading: "Currently Reading",
  finished: "Finished",
} as const;

export async function POST(request: NextRequest) {
  const parsed = moveSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const auth = await requireAuthenticatedUserForApi();
  if (!auth.allowed) {
    return auth.response!;
  }

  try {
    const userBook = await prisma.userBook.findFirst({
      where: { id: parsed.data.userBookId, userId: auth.userId },
    });

    if (!userBook) {
      return NextResponse.json({ error: "Book entry not found" }, { status: 404 });
    }

    const shelfName = shelfNameMap[parsed.data.toShelf];

    const shelf =
      (await prisma.shelf.findUnique({
        where: { userId_name: { userId: auth.userId!, name: shelfName } },
      })) ??
      (await prisma.shelf.create({
        data: { userId: auth.userId!, name: shelfName },
      }));

    const updated = await prisma.userBook.update({
      where: { id: userBook.id },
      data: {
        shelfId: shelf.id,
        ...(typeof parsed.data.progress === "number" ? { progress: parsed.data.progress } : {}),
      },
      include: { shelf: true },
    });

    return NextResponse.json({ updated });
  } catch {
    return NextResponse.json({ updated: parsed.data, mode: "demo" });
  }
}