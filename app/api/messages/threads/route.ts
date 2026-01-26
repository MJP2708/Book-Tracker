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

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: user.id },
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      conversations.map((conversation) => {
        const otherParticipants = conversation.participants
          .map((participant) => participant.user)
          .filter((participant) => participant.id !== user.id);
        const lastMessage = conversation.messages[0] || null;

        return {
          id: conversation.id,
          participants: otherParticipants,
          lastMessage: lastMessage
            ? { content: lastMessage.content, createdAt: lastMessage.createdAt }
            : null,
        };
      })
    );
  } catch (error) {
    console.error("Thread list error:", error);
    return NextResponse.json(
      { error: "Failed to load conversations" },
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

    const { recipientId, message } = await request.json();
    if (!recipientId || typeof recipientId !== "string") {
      return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
    });

    const conversation =
      existingConversation ||
      (await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: user.id }, { userId: recipientId }],
          },
        },
      }));

    if (message && typeof message === "string" && message.trim().length > 0) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          content: message.trim(),
        },
      });
    }

    return NextResponse.json({ id: conversation.id }, { status: 201 });
  } catch (error) {
    console.error("Thread create error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
