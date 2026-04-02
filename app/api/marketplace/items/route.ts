export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

type MarketItem = {
  id: string;
  title: string;
  creator: string;
  type: "book" | "audiobook";
  format: string;
  priceCents: number;
  summary: string;
  coverEmoji: string;
};

const demoItems: MarketItem[] = [
  {
    id: "mk_1",
    title: "Project Hail Mary",
    creator: "Andy Weir",
    type: "book",
    format: "Hardcover",
    priceCents: 1899,
    summary: "A science-heavy survival story with high emotional payoff.",
    coverEmoji: "🚀",
  },
  {
    id: "mk_2",
    title: "Deep Work",
    creator: "Cal Newport",
    type: "audiobook",
    format: "MP3 + App",
    priceCents: 1499,
    summary: "Practical framework for doing focused, valuable work.",
    coverEmoji: "🎯",
  },
  {
    id: "mk_3",
    title: "The Midnight Library",
    creator: "Matt Haig",
    type: "book",
    format: "Paperback",
    priceCents: 1299,
    summary: "A reflective novel about choice, regret, and possibility.",
    coverEmoji: "🌌",
  },
  {
    id: "mk_4",
    title: "Atomic Habits",
    creator: "James Clear",
    type: "audiobook",
    format: "AAC",
    priceCents: 1699,
    summary: "A system-first playbook for compounding habits.",
    coverEmoji: "⚡",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const q = (searchParams.get("q") || "").toLowerCase();

  const items = demoItems.filter((item) => {
    const matchesType = !type || type === "all" || item.type === type;
    const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.creator.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  return NextResponse.json({ items, mode: "demo" });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    title?: string;
    creator?: string;
    type?: "book" | "audiobook";
    format?: string;
    priceCents?: number;
    summary?: string;
  };

  const title = String(payload.title || "").trim();
  const creator = String(payload.creator || "").trim();

  if (!title || !creator || typeof payload.priceCents !== "number") {
    return NextResponse.json({ error: "title, creator, and priceCents are required" }, { status: 400 });
  }

  const item: MarketItem = {
    id: `mk_${Date.now()}`,
    title,
    creator,
    type: payload.type || "book",
    format: payload.format || "Digital",
    priceCents: payload.priceCents,
    summary: String(payload.summary || "").trim() || "Community marketplace listing.",
    coverEmoji: payload.type === "audiobook" ? "🎧" : "📘",
  };

  demoItems.unshift(item);
  return NextResponse.json({ item, mode: "demo" }, { status: 201 });
}
