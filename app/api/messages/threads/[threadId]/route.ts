export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ threadId: string }> }
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

    const { threadId } = await context.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: threadId },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true } } },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
          include: {
            sender: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.userId === user.id
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      id: conversation.id,
      participants: conversation.participants.map((participant) => ({
        id: participant.user.id,
        name: participant.user.name,
      })),
      messages: conversation.messages.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: message.sender,
      })),
    });
  } catch (error) {
    console.error("Thread fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load thread" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ threadId: string }> }
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

    const { threadId } = await context.params;
    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: threadId },
      include: { participants: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.userId === user.id
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: message.sender,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
