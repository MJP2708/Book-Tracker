export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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

    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: user.id,
        status: "pending",
      },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(
      requests.map((request) => ({
        id: request.id,
        sender: request.sender,
        createdAt: request.createdAt,
      }))
    );
  } catch (error) {
    console.error("Friend request fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch friend requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { userId } = await request.json();
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }
    if (userId === user.id) {
      return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already friends" }, { status: 409 });
    }

    const existingRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: user.id,
          receiverId: userId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Request already sent" },
        { status: 409 }
      );
    }

    const reverseRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: user.id,
        },
      },
    });

    if (reverseRequest && reverseRequest.status === "pending") {
      return NextResponse.json(
        { error: "Incoming request exists" },
        { status: 409 }
      );
    }

    const requestRecord = await prisma.friendRequest.create({
      data: {
        senderId: user.id,
        receiverId: userId,
      },
      include: {
        receiver: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      {
        id: requestRecord.id,
        receiver: requestRecord.receiver,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Friend request create error:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
