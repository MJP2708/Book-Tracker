import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { getOfflineBook } from "@/lib/offline-store";

export async function generateMetadata({ params }: { params: Promise<{ bookId: string }> }): Promise<Metadata> {
  const { bookId } = await params;
  const siteUrl = getSiteUrl();

  let book: { title: string; author: string | null; description: string | null; coverImage: string | null } | null = null;

  try {
    const result = await prisma.book.findUnique({ where: { id: bookId } });
    if (result) {
      book = {
        title: result.title,
        author: result.author,
        description: result.description,
        coverImage: result.coverUrl,
      };
    }
  } catch {
    const offline = getOfflineBook(bookId);
    if (offline) {
      book = {
        title: offline.title,
        author: offline.author,
        description: offline.description,
        coverImage: offline.coverImage,
      };
    }
  }

  if (!book) {
    return { title: "Book", robots: { index: false, follow: true } };
  }

  const title = `${book.title}${book.author ? ` by ${book.author}` : ""}`;
  const description = book.description || `Explore ${book.title} on Bookshelf.`;
  const url = `${siteUrl}/books/${bookId}`;
  const image = book.coverImage || "/og-cover.svg";

  return {
    title,
    description,
    keywords: [book.title, book.author || "books", "book review", "reading tracker"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}