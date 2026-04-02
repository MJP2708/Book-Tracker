import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

  const auth = await requireAuthenticatedUserForApi();
  if (!auth.allowed) {
    return auth.response!;
  }

  try {
    const created = await prisma.discussionThread.create({
      data: {
        userId: auth.userId!,
        clubId,
        topic: String(body.topic || "club"),
        title: String(body.title || "Untitled discussion"),
        content: String(body.body || ""),
      },
    });

    return NextResponse.json({ clubId, thread: created }, { status: 201 });
  } catch {
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
}