import { NextResponse } from "next/server";
import { getActivityFeed } from "@/lib/bookshelf/service";

export async function GET() {
  return NextResponse.json({ activities: getActivityFeed() });
}