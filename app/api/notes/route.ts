import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUserForApi } from "@/lib/monetization/guards";

const noteSchema = z.object({
  bookId: z.string().min(1),
  quote: z.string().optional(),
  note: z.string().min(1),
  pageNumber: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  const parsed = noteSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid note payload" }, { status: 400 });
  }

  const auth = await requireAuthenticatedUserForApi();
  if (!auth.allowed) {
    return auth.response!;
  }

  try {
    const contentSuffix = [
      parsed.data.quote ? `Quote: ${parsed.data.quote}` : null,
      parsed.data.pageNumber ? `Page: ${parsed.data.pageNumber}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const created = await prisma.note.create({
      data: {
        userId: auth.userId!,
        bookId: parsed.data.bookId,
        content: contentSuffix ? `${parsed.data.note}\n\n${contentSuffix}` : parsed.data.note,
      },
    });

    return NextResponse.json({ note: created }, { status: 201 });
  } catch {
    return NextResponse.json({ note: { id: `note_${Date.now()}`, ...parsed.data }, mode: "demo" }, { status: 201 });
  }
}