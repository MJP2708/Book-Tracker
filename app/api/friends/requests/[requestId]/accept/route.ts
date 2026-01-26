export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { requestId } = await context.params;

    const requestRecord = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!requestRecord || requestRecord.receiverId !== user.id) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (requestRecord.status !== "pending") {
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "accepted" },
      }),
      prisma.follows.upsert({
        where: {
          followerId_followingId: {
            followerId: requestRecord.senderId,
            followingId: requestRecord.receiverId,
          },
        },
        update: {},
        create: {
          followerId: requestRecord.senderId,
          followingId: requestRecord.receiverId,
        },
      }),
      prisma.follows.upsert({
        where: {
          followerId_followingId: {
            followerId: requestRecord.receiverId,
            followingId: requestRecord.senderId,
          },
        },
        update: {},
        create: {
          followerId: requestRecord.receiverId,
          followingId: requestRecord.senderId,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Friend request accept error:", error);
    return NextResponse.json(
      { error: "Failed to accept request" },
      { status: 500 }
    );
  }
}
