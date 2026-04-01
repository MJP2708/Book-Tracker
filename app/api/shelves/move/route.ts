import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const moveSchema = z.object({
  userBookId: z.string().min(1),
  fromShelf: z.enum(["want_to_read", "currently_reading", "finished"]),
  toShelf: z.enum(["want_to_read", "currently_reading", "finished"]),
  progress: z.number().min(0).max(100).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = moveSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("user_books")
      .update({
        shelf: parsed.data.toShelf,
        progress: parsed.data.progress,
        last_opened_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.userBookId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ updated: data });
  }

  return NextResponse.json({ updated: parsed.data, mode: "demo" });
}