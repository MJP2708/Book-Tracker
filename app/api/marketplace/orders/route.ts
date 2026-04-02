export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

type DemoOrder = {
  id: string;
  buyerName: string;
  itemId: string;
  quantity: number;
  totalCents: number;
  kind: "book" | "audiobook";
  createdAt: string;
};

const orderLedger: DemoOrder[] = [];

export async function GET() {
  return NextResponse.json({ orders: orderLedger.slice(0, 50), mode: "demo" });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    itemId?: string;
    quantity?: number;
    totalCents?: number;
    kind?: "book" | "audiobook";
    buyerName?: string;
  };

  if (!payload.itemId || typeof payload.totalCents !== "number") {
    return NextResponse.json({ error: "itemId and totalCents are required" }, { status: 400 });
  }

  const order: DemoOrder = {
    id: `ord_${Date.now()}`,
    buyerName: String(payload.buyerName || "").trim() || "Guest",
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
