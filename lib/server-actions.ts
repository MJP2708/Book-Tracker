"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      readingStats: true,
      _count: {
        select: {
          books: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  return user;
}

export async function getAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

export async function getFeedPosts(userId: string, limit = 20, skip = 0) {
  const posts = await prisma.post.findMany({
    where: {
      user: {
        OR: [
          { id: userId },
          {
            followers: {
              some: { followerId: userId },
            },
          },
        ],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          coverImage: true,
        },
      },
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  return posts;
}

export async function getUserBooks(userId: string) {
  const books = await prisma.userBook.findMany({
    where: { userId },
    include: {
      book: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return books;
}

export async function getReadingStats(userId: string) {
  const stats = await prisma.readingStats.findUnique({
    where: { userId },
  });

  return stats;
}

export async function createPost(userId: string, data: any) {
  const post = await prisma.post.create({
    data: {
      userId,
      ...data,
    },
    include: {
      user: true,
      book: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });

  return post;
}

export async function toggleLike(userId: string, postId: string) {
  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: { id: existing.id },
    });
    return false;
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
    return true;
  }
}

export async function addBookToLibrary(
  userId: string,
  bookId: string,
  data: any
) {
  const userBook = await prisma.userBook.upsert({
    where: {
      userId_bookId: { userId, bookId },
    },
    update: data,
    create: {
      userId,
      bookId,
      ...data,
    },
  });

  return userBook;
}
