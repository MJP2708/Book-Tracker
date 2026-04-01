import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: "user_demo_01",
        book_id: parsed.data.bookId,
        quote: parsed.data.quote,
        note: parsed.data.note,
        page_number: parsed.data.pageNumber,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ note: data }, { status: 201 });
  }

  return NextResponse.json({ note: { id: `note_${Date.now()}`, ...parsed.data }, mode: "demo" }, { status: 201 });
}