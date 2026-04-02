export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type DemoOrder = {
  id: string;
  userEmail: string;
  itemId: string;
  quantity: number;
  totalCents: number;
  kind: "book" | "audiobook";
  createdAt: string;
};

const orderLedger: DemoOrder[] = [];

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = orderLedger.filter((row) => row.userEmail === session.user.email);
  return NextResponse.json({ orders, mode: "demo" });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    itemId?: string;
    quantity?: number;
    totalCents?: number;
    kind?: "book" | "audiobook";
  };

  if (!payload.itemId || typeof payload.totalCents !== "number") {
    return NextResponse.json({ error: "itemId and totalCents are required" }, { status: 400 });
  }

  const order: DemoOrder = {
    id: `ord_${Date.now()}`,
    userEmail: session.user.email,
    itemId: payload.itemId,
    quantity: Math.max(1, payload.quantity || 1),
    totalCents: payload.totalCents,
    kind: payload.kind || "book",
    createdAt: new Date().toISOString(),
  };

  orderLedger.unshift(order);

  return NextResponse.json(
    {
      order,
      fulfillment:
        order.kind === "audiobook"
          ? { downloadUrl: `/api/marketplace/download/${order.id}`, note: "Demo link" }
          : { shippingEta: "3-5 business days", note: "Demo fulfillment" },
      mode: "demo",
    },
    { status: 201 }
  );
}
