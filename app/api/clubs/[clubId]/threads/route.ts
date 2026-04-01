import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuthenticatedUserForApi } from "@/lib/monetization/guards";

const demoThreads = [
  {
    id: "thread_01",
    title: "Chapter 1 reactions",
    messages: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "thread_02",
    title: "Favorite quote this week",
    messages: 11,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
  },
];

type RouteContext = {
  params: Promise<{ clubId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { clubId } = await context.params;

  return NextResponse.json({
    clubId,
    threads: demoThreads,
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { clubId } = await context.params;
  const body = await request.json();
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const auth = await requireAuthenticatedUserForApi();
    if (!auth.allowed) {
      return auth.response!;
    }

    const { data, error } = await supabase
      .from("club_threads")
      .insert({
        club_id: clubId,
        title: body.title ?? "Untitled discussion",
        body: body.body ?? null,
        created_by: auth.userId,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ clubId, thread: data }, { status: 201 });
  }

  return NextResponse.json(
    {
      clubId,
      thread: {
        id: `thread_${Date.now()}`,
        title: body.title ?? "Untitled discussion",
        messages: 0,
        createdAt: new Date().toISOString(),
      },
      mode: "demo",
    },
    { status: 201 }
  );
}
