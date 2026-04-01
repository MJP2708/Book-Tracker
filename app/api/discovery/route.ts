export const runtime = "nodejs";

import { getDiscoverySnapshot } from "@/lib/social-demo";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(getDiscoverySnapshot());
}
