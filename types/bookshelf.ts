export type ShelfType = "want_to_read" | "currently_reading" | "finished";

export type Book = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genres: string[];
  rating: number;
  pages: number;
  publishedYear?: number;
  affiliateUrl?: string;
};

export type UserProfile = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  monthlyGoal: number;
  yearlyGoal: number;
  premium: boolean;
};

export type UserBook = {
  id: string;
  userId: string;
  bookId: string;
  shelf: ShelfType;
  progress: number;
  rating?: number;
  liked: boolean;
  lastOpenedAt: string;
};

export type ReviewTag = "Easy read" | "Slow start" | "Mind-blowing";

export type Review = {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  body: string;
  tags: ReviewTag[];
  helpfulVotes: number;
  createdAt: string;
};

export type ActivityType = "finished" | "rated" | "added";

export type Activity = {
  id: string;
  actorId: string;
  type: ActivityType;
  bookId: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export type BookClub = {
  id: string;
  name: string;
  description: string;
  visibility: "public" | "private";
  ownerId: string;
  currentBookId?: string;
  memberCount: number;
};

export type Note = {
  id: string;
  userId: string;
  bookId: string;
  quote?: string;
  note: string;
  pageNumber?: number;
  createdAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export type RecommendationReason =
  | "Matches your top genre"
  | "Because you rated similar books highly"
  | "Trending among readers you follow"
  | "Great for your reading pace";

export type BookRecommendation = {
  book: Book;
  score: number;
  reason: RecommendationReason;
};