import type { Activity, Book, BookRecommendation, Review, ShelfType, UserBook } from "@/types/bookshelf";
import {
  demoActivities,
  demoBooks,
  demoReviews,
  demoUser,
  demoUserBooks,
  demoUsers,
} from "@/lib/bookshelf/demo-data";

export type ShelfBuckets = Record<ShelfType, (UserBook & { book: Book })[]>;

export function withBook<T extends { bookId: string }>(item: T): T & { book: Book } {
  const book = demoBooks.find((candidate) => candidate.id === item.bookId);

  if (!book) {
    throw new Error(`Book ${item.bookId} not found.`);
  }

  return { ...item, book };
}

export function getContinueReading(userId = demoUser.id) {
  const latest = demoUserBooks
    .filter((item) => item.userId === userId && item.shelf === "currently_reading")
    .sort((a, b) => +new Date(b.lastOpenedAt) - +new Date(a.lastOpenedAt))[0];

  return latest ? withBook(latest) : null;
}

export function getShelfBuckets(userId = demoUser.id): ShelfBuckets {
  const source = demoUserBooks.filter((item) => item.userId === userId).map(withBook);

  return {
    want_to_read: source.filter((item) => item.shelf === "want_to_read"),
    currently_reading: source.filter((item) => item.shelf === "currently_reading"),
    finished: source.filter((item) => item.shelf === "finished"),
  };
}

export function getTrendingBooks(limit = 5) {
  return [...demoBooks].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getActivityFeed(): Array<Activity & { actorName: string; actorAvatar: string; book: Book }> {
  return demoActivities
    .map((item) => {
      const actor = demoUsers[item.actorId as keyof typeof demoUsers];
      const book = demoBooks.find((candidate) => candidate.id === item.bookId);
      if (!actor || !book) return null;

      return {
        ...item,
        actorName: actor.displayName,
        actorAvatar: actor.avatarUrl,
        book,
      };
    })
    .filter((item): item is Activity & { actorName: string; actorAvatar: string; book: Book } => Boolean(item))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getRecommendations(userId = demoUser.id, limit = 6): BookRecommendation[] {
  const completed = demoUserBooks.filter((item) => item.userId === userId && item.rating && item.rating >= 4);
  const likedGenres = new Set(
    completed
      .flatMap((item) => demoBooks.find((book) => book.id === item.bookId)?.genres ?? [])
      .filter(Boolean)
  );

  const excludedIds = new Set(demoUserBooks.filter((item) => item.userId === userId).map((item) => item.bookId));

  const recommendations = demoBooks
    .filter((book) => !excludedIds.has(book.id))
    .map((book) => {
      const genreMatchCount = book.genres.filter((genre) => likedGenres.has(genre)).length;
      const score = Number((book.rating * 15 + genreMatchCount * 22 + Math.random() * 10).toFixed(1));
      const reason = genreMatchCount
        ? "Matches your top genre"
        : book.rating > 4.6
          ? "Trending among readers you follow"
          : "Great for your reading pace";

      return { book, score, reason } as BookRecommendation;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return recommendations;
}

export function searchBooks(query: string, filters?: { genre?: string; rating?: number; maxPages?: number }) {
  const q = query.trim().toLowerCase();

  return demoBooks.filter((book) => {
    const matchesQuery =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.description.toLowerCase().includes(q);

    const matchesGenre = !filters?.genre || book.genres.includes(filters.genre);
    const matchesRating = !filters?.rating || book.rating >= filters.rating;
    const matchesLength = !filters?.maxPages || book.pages <= filters.maxPages;

    return matchesQuery && matchesGenre && matchesRating && matchesLength;
  });
}

export function getBookById(bookId: string) {
  return demoBooks.find((book) => book.id === bookId) ?? null;
}

export function getReviewsByBookId(bookId: string): Review[] {
  return demoReviews
    .filter((review) => review.bookId === bookId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function nextShelf(from: ShelfType): ShelfType {
  switch (from) {
    case "want_to_read":
      return "currently_reading";
    case "currently_reading":
      return "finished";
    default:
      return "finished";
  }
}