type ActivityType =
  | "book_added"
  | "progress_updated"
  | "highlight_added"
  | "review_posted"
  | "followed_user"
  | "joined_club";

type Activity = {
  id: string;
  actorEmail: string;
  actorName: string;
  type: ActivityType;
  text: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
};

type Post = {
  id: string;
  authorEmail: string;
  authorName: string;
  kind: "review" | "post";
  content: string;
  bookTitle?: string;
  tags: string[];
  likes: Set<string>;
  createdAt: string;
};

type PostComment = {
  id: string;
  postId: string;
  authorEmail: string;
  authorName: string;
  content: string;
  createdAt: string;
};

type ThreadReply = {
  id: string;
  authorEmail: string;
  authorName: string;
  content: string;
  createdAt: string;
};

type DiscussionThread = {
  id: string;
  topic: string;
  title: string;
  content: string;
  authorEmail: string;
  authorName: string;
  upvotes: Set<string>;
  downvotes: Set<string>;
  replies: ThreadReply[];
  createdAt: string;
};

type Club = {
  id: string;
  name: string;
  description: string;
  ownerEmail: string;
  ownerName: string;
  memberEmails: Set<string>;
  currentBook: string;
  targetDate: string;
  createdAt: string;
};

type Quote = {
  id: string;
  authorEmail: string;
  authorName: string;
  bookTitle: string;
  text: string;
  createdAt: string;
};

type Goal = {
  yearlyBooks: number;
  weeklyPages: number;
};

type SocialState = {
  activities: Activity[];
  posts: Post[];
  comments: PostComment[];
  threads: DiscussionThread[];
  clubs: Club[];
  quotes: Quote[];
  goalsByEmail: Map<string, Goal>;
};

const globalState = globalThis as unknown as { __socialDemoState?: SocialState };

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function seed(): SocialState {
  const now = nowIso();
  const posts: Post[] = [
    {
      id: makeId("post"),
      authorEmail: "maya@example.com",
      authorName: "Maya",
      kind: "review",
      content: "Atomic Habits made behavior design practical. The systems-first idea is game-changing.",
      bookTitle: "Atomic Habits",
      tags: ["habits", "productivity"],
      likes: new Set(),
      createdAt: now,
    },
  ];

  const threads: DiscussionThread[] = [
    {
      id: makeId("thread"),
      topic: "productivity",
      title: "Best book for deep focus?",
      content: "If you had to recommend one book for focus, what would it be and why?",
      authorEmail: "kai@example.com",
      authorName: "Kai",
      upvotes: new Set(),
      downvotes: new Set(),
      replies: [],
      createdAt: now,
    },
  ];

  const clubs: Club[] = [
    {
      id: makeId("club"),
      name: "Builders Book Club",
      description: "For founders and makers reading business + execution books.",
      ownerEmail: "maya@example.com",
      ownerName: "Maya",
      memberEmails: new Set(["maya@example.com"]),
      currentBook: "The Lean Startup",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
      createdAt: now,
    },
  ];

  const quotes: Quote[] = [
    {
      id: makeId("quote"),
      authorEmail: "maya@example.com",
      authorName: "Maya",
      bookTitle: "Atomic Habits",
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      createdAt: now,
    },
  ];

  const activities: Activity[] = [
    {
      id: makeId("activity"),
      actorEmail: "maya@example.com",
      actorName: "Maya",
      type: "review_posted",
      text: "Posted a review for Atomic Habits",
      metadata: { bookTitle: "Atomic Habits" },
      createdAt: now,
    },
  ];

  return { activities, posts, comments: [], threads, clubs, quotes, goalsByEmail: new Map() };
}

function state() {
  if (!globalState.__socialDemoState) {
    globalState.__socialDemoState = seed();
  }
  return globalState.__socialDemoState;
}

export function logActivity(input: {
  actorEmail: string;
  actorName: string;
  type: ActivityType;
  text: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const s = state();
  s.activities.unshift({ id: makeId("activity"), createdAt: nowIso(), ...input });
}

export function getActivityFeed() {
  return state().activities.slice(0, 80);
}

export function createPost(input: {
  authorEmail: string;
  authorName: string;
  kind: "review" | "post";
  content: string;
  bookTitle?: string;
  tags?: string[];
}) {
  const s = state();
  const post: Post = {
    id: makeId("post"),
    authorEmail: input.authorEmail,
    authorName: input.authorName,
    kind: input.kind,
    content: input.content,
    bookTitle: input.bookTitle,
    tags: (input.tags || []).map((t) => t.trim().toLowerCase()).filter(Boolean),
    likes: new Set(),
    createdAt: nowIso(),
  };
  s.posts.unshift(post);
  logActivity({
    actorEmail: input.authorEmail,
    actorName: input.authorName,
    type: "review_posted",
    text: input.kind === "review" ? `Posted a review${input.bookTitle ? ` for ${input.bookTitle}` : ""}` : "Shared a post",
    metadata: input.bookTitle ? { bookTitle: input.bookTitle } : undefined,
  });
  return post;
}

export function listPosts() {
  return state().posts.slice(0, 100).map((post) => ({
    ...post,
    likeCount: post.likes.size,
    likes: undefined,
  }));
}

export function togglePostLike(postId: string, userEmail: string) {
  const post = state().posts.find((p) => p.id === postId);
  if (!post) return null;
  if (post.likes.has(userEmail)) post.likes.delete(userEmail);
  else post.likes.add(userEmail);
  return { liked: post.likes.has(userEmail), likeCount: post.likes.size };
}

export function addPostComment(input: {
  postId: string;
  authorEmail: string;
  authorName: string;
  content: string;
}) {
  const s = state();
  const post = s.posts.find((p) => p.id === input.postId);
  if (!post) return null;
  const comment: PostComment = {
    id: makeId("comment"),
    postId: input.postId,
    authorEmail: input.authorEmail,
    authorName: input.authorName,
    content: input.content,
    createdAt: nowIso(),
  };
  s.comments.push(comment);
  return comment;
}

export function listPostComments(postId: string) {
  return state().comments.filter((c) => c.postId === postId).slice(-40);
}

export function createDiscussion(input: {
  topic: string;
  title: string;
  content: string;
  authorEmail: string;
  authorName: string;
}) {
  const s = state();
  const thread: DiscussionThread = {
    id: makeId("thread"),
    topic: input.topic.trim().toLowerCase() || "general",
    title: input.title,
    content: input.content,
    authorEmail: input.authorEmail,
    authorName: input.authorName,
    upvotes: new Set(),
    downvotes: new Set(),
    replies: [],
    createdAt: nowIso(),
  };
  s.threads.unshift(thread);
  return thread;
}

export function listDiscussions() {
  return state().threads.map((t) => ({
    id: t.id,
    topic: t.topic,
    title: t.title,
    content: t.content,
    authorEmail: t.authorEmail,
    authorName: t.authorName,
    createdAt: t.createdAt,
    upvotes: t.upvotes.size,
    downvotes: t.downvotes.size,
    replyCount: t.replies.length,
    replies: t.replies,
  }));
}

export function voteDiscussion(threadId: string, email: string, direction: "up" | "down") {
  const thread = state().threads.find((t) => t.id === threadId);
  if (!thread) return null;
  if (direction === "up") {
    if (thread.upvotes.has(email)) thread.upvotes.delete(email);
    else {
      thread.upvotes.add(email);
      thread.downvotes.delete(email);
    }
  } else {
    if (thread.downvotes.has(email)) thread.downvotes.delete(email);
    else {
      thread.downvotes.add(email);
      thread.upvotes.delete(email);
    }
  }
  return { upvotes: thread.upvotes.size, downvotes: thread.downvotes.size };
}

export function replyDiscussion(input: {
  threadId: string;
  authorEmail: string;
  authorName: string;
  content: string;
}) {
  const thread = state().threads.find((t) => t.id === input.threadId);
  if (!thread) return null;
  const reply: ThreadReply = {
    id: makeId("reply"),
    authorEmail: input.authorEmail,
    authorName: input.authorName,
    content: input.content,
    createdAt: nowIso(),
  };
  thread.replies.push(reply);
  return reply;
}

export function createClub(input: {
  name: string;
  description: string;
  ownerEmail: string;
  ownerName: string;
  currentBook: string;
  targetDate: string;
}) {
  const s = state();
  const club: Club = {
    id: makeId("club"),
    name: input.name,
    description: input.description,
    ownerEmail: input.ownerEmail,
    ownerName: input.ownerName,
    memberEmails: new Set([input.ownerEmail]),
    currentBook: input.currentBook,
    targetDate: input.targetDate,
    createdAt: nowIso(),
  };
  s.clubs.unshift(club);
  return club;
}

export function listClubs() {
  return state().clubs.map((club) => ({
    id: club.id,
    name: club.name,
    description: club.description,
    ownerEmail: club.ownerEmail,
    ownerName: club.ownerName,
    currentBook: club.currentBook,
    targetDate: club.targetDate,
    createdAt: club.createdAt,
    memberCount: club.memberEmails.size,
  }));
}

export function toggleClubMembership(clubId: string, email: string, name: string) {
  const club = state().clubs.find((c) => c.id === clubId);
  if (!club) return null;
  const isMember = club.memberEmails.has(email);
  if (isMember) {
    club.memberEmails.delete(email);
    return { isMember: false, memberCount: club.memberEmails.size };
  }
  club.memberEmails.add(email);
  logActivity({
    actorEmail: email,
    actorName: name,
    type: "joined_club",
    text: `Joined club ${club.name}`,
    metadata: { clubId: club.id, clubName: club.name },
  });
  return { isMember: true, memberCount: club.memberEmails.size };
}

export function createQuote(input: { authorEmail: string; authorName: string; bookTitle: string; text: string }) {
  const quote: Quote = {
    id: makeId("quote"),
    authorEmail: input.authorEmail,
    authorName: input.authorName,
    bookTitle: input.bookTitle,
    text: input.text,
    createdAt: nowIso(),
  };
  state().quotes.unshift(quote);
  return quote;
}

export function listQuotes() {
  return state().quotes.slice(0, 120);
}

export function getAnalytics(email: string, readingStats: { booksRead: number; totalPages: number; readingStreak: number }) {
  const goals = state().goalsByEmail.get(email) || { yearlyBooks: 24, weeklyPages: 150 };
  const booksProgress = Math.min(100, Math.round((readingStats.booksRead / goals.yearlyBooks) * 100));
  const weeklyPagesProgress = Math.min(100, Math.round((readingStats.totalPages / Math.max(1, goals.weeklyPages * 4)) * 100));
  const points = readingStats.booksRead * 40 + Math.floor(readingStats.totalPages / 10) + readingStats.readingStreak * 5;
  const badges = [
    points >= 200 ? "Momentum Builder" : null,
    readingStats.booksRead >= 5 ? "Book Finisher" : null,
    readingStats.totalPages >= 500 ? "Page Turner" : null,
  ].filter(Boolean) as string[];
  return {
    goals,
    progress: { yearlyBooks: booksProgress, monthlyPages: weeklyPagesProgress },
    gamification: { points, badges, achievements: badges.length },
  };
}

export function setGoals(email: string, goals: Partial<Goal>) {
  const prev = state().goalsByEmail.get(email) || { yearlyBooks: 24, weeklyPages: 150 };
  const next = {
    yearlyBooks: Number.isFinite(goals.yearlyBooks) ? Math.max(1, Number(goals.yearlyBooks)) : prev.yearlyBooks,
    weeklyPages: Number.isFinite(goals.weeklyPages) ? Math.max(1, Number(goals.weeklyPages)) : prev.weeklyPages,
  };
  state().goalsByEmail.set(email, next);
  return next;
}

export function getDiscoverySnapshot() {
  const s = state();
  const trendingDiscussions = s.threads
    .slice()
    .sort((a, b) => b.upvotes.size + b.replies.length - (a.upvotes.size + a.replies.length))
    .slice(0, 5)
    .map((t) => ({ id: t.id, title: t.title, topic: t.topic, score: t.upvotes.size + t.replies.length }));

  const trendingUsers = new Map<string, { name: string; score: number }>();
  for (const post of s.posts) {
    const prev = trendingUsers.get(post.authorEmail) || { name: post.authorName, score: 0 };
    prev.score += 1 + post.likes.size;
    trendingUsers.set(post.authorEmail, prev);
  }

  return {
    trendingDiscussions,
    trendingUsers: Array.from(trendingUsers.entries())
      .map(([email, item]) => ({ email, name: item.name, score: item.score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5),
    popularBooks: s.posts
      .filter((p) => p.bookTitle)
      .reduce<Record<string, number>>((acc, p) => {
        const key = String(p.bookTitle);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
  };
}

export function getAiRecommendations(input: { profileTags: string[]; interests: string[] }) {
  const tagPool = [...input.profileTags, ...input.interests].map((v) => v.trim().toLowerCase()).filter(Boolean);
  const seeds = [
    { title: "Deep Work", reason: "Improves focus and cognitive depth" },
    { title: "Atomic Habits", reason: "Turns intent into repeatable systems" },
    { title: "The Lean Startup", reason: "Build-measure-learn for rapid growth" },
    { title: "Show Your Work", reason: "Better creator visibility and consistency" },
  ];
  if (tagPool.includes("business")) seeds.push({ title: "Zero to One", reason: "Contrarian strategy and innovation" });
  if (tagPool.includes("psychology")) seeds.push({ title: "Thinking, Fast and Slow", reason: "Decision-making frameworks" });
  return seeds.slice(0, 5);
}

export function getAiInsights(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  const length = words.length;
  const highlights = text
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    summary: highlights.join(". ") || "No summary generated yet.",
    keyIdeas: highlights,
    estimatedReadingMinutes: Math.max(1, Math.round(length / 180)),
  };
}
