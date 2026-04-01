import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  let books: Array<{ id: string; updatedAt: Date }> = [];
  let users: Array<{ id: string; updatedAt: Date }> = [];

  try {
    [books, users] = await Promise.all([
      prisma.book.findMany({ select: { id: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 500 }),
      prisma.user.findMany({ select: { id: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 500 }),
    ]);
  } catch {
    books = [];
    users = [];
  }

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...books.map((book) => ({
      url: `${siteUrl}/books/${book.id}`,
      lastModified: book.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...users.map((user) => ({
      url: `${siteUrl}/profile/${user.id}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
