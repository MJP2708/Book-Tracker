import type {
  Achievement,
  Activity,
  Book,
  BookClub,
  Review,
  UserBook,
  UserProfile,
} from "@/types/bookshelf";

export const demoUser: UserProfile = {
  id: "user_demo_01",
  handle: "matthreads",
  displayName: "Matt Harper",
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop",
  bio: "Product builder, night reader, and fan of thoughtful sci-fi.",
  monthlyGoal: 6,
  yearlyGoal: 52,
  premium: true,
};

export const demoBooks: Book[] = [
  {
    id: "book_atomic_habits",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=900&fit=crop",
    description: "A practical framework for building systems that make good habits inevitable.",
    genres: ["Self-Improvement", "Productivity"],
    rating: 4.7,
    pages: 320,
    publishedYear: 2018,
    affiliateUrl: "https://bookshelf.dekds.com/affiliate/atomic-habits",
  },
  {
    id: "book_project_hail_mary",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=900&fit=crop",
    description: "A lone astronaut must save Earth with science, humor, and a surprising friendship.",
    genres: ["Sci-Fi", "Adventure"],
    rating: 4.8,
    pages: 496,
    publishedYear: 2021,
  },
  {
    id: "book_deep_work",
    title: "Deep Work",
    author: "Cal Newport",
    coverImage: "https://images.unsplash.com/photo-1455885666463-9c41e569e331?w=600&h=900&fit=crop",
    description: "Rules for focused success in a distracted world.",
    genres: ["Productivity", "Business"],
    rating: 4.5,
    pages: 304,
    publishedYear: 2016,
  },
  {
    id: "book_tomorrow",
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=900&fit=crop",
    description: "A decades-spanning story of friendship, creativity, and the worlds we build.",
    genres: ["Literary", "Contemporary"],
    rating: 4.4,
    pages: 416,
    publishedYear: 2022,
  },
  {
    id: "book_meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=900&fit=crop",
    description: "Personal writings on resilience, discipline, and living with purpose.",
    genres: ["Philosophy", "Classics"],
    rating: 4.6,
    pages: 256,
  },
  {
    id: "book_the_mountain",
    title: "The Mountain Is You",
    author: "Brianna Wiest",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=900&fit=crop",
    description: "Transform self-sabotage into self-mastery through emotional awareness.",
    genres: ["Self-Improvement", "Psychology"],
    rating: 4.3,
    pages: 248,
    publishedYear: 2020,
  },
];

export const demoUserBooks: UserBook[] = [
  {
    id: "ub_01",
    userId: demoUser.id,
    bookId: "book_project_hail_mary",
    shelf: "currently_reading",
    progress: 62,
    liked: true,
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    rating: 5,
  },
  {
    id: "ub_02",
    userId: demoUser.id,
    bookId: "book_atomic_habits",
    shelf: "finished",
    progress: 100,
    liked: true,
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    rating: 5,
  },
  {
    id: "ub_03",
    userId: demoUser.id,
    bookId: "book_deep_work",
    shelf: "want_to_read",
    progress: 0,
    liked: false,
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "ub_04",
    userId: demoUser.id,
    bookId: "book_meditations",
    shelf: "finished",
    progress: 100,
    liked: true,
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    rating: 4,
  },
];

export const demoActivities: Activity[] = [
  {
    id: "act_01",
    actorId: "user_amy",
    type: "finished",
    bookId: "book_atomic_habits",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "act_02",
    actorId: "user_jon",
    type: "rated",
    bookId: "book_tomorrow",
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    metadata: { rating: 5 },
  },
  {
    id: "act_03",
    actorId: "user_amy",
    type: "added",
    bookId: "book_project_hail_mary",
    createdAt: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
  },
];

export const demoReviews: Review[] = [
  {
    id: "review_01",
    userId: "user_amy",
    bookId: "book_project_hail_mary",
    rating: 5,
    body: "Hard sci-fi with heart. The pacing stays intense and surprisingly emotional.",
    tags: ["Mind-blowing"],
    helpfulVotes: 38,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "review_02",
    userId: "user_jon",
    bookId: "book_the_mountain",
    rating: 4,
    body: "Strong practical insights. Slower opening, then it clicks.",
    tags: ["Slow start"],
    helpfulVotes: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

export const demoClubs: BookClub[] = [
  {
    id: "club_01",
    name: "Sci-Fi Sundays",
    description: "Weekly chapter sprints and deep lore discussions.",
    visibility: "public",
    ownerId: "user_amy",
    currentBookId: "book_project_hail_mary",
    memberCount: 142,
  },
  {
    id: "club_02",
    name: "Mindset Builders",
    description: "Read, reflect, and apply one concrete idea per week.",
    visibility: "private",
    ownerId: demoUser.id,
    currentBookId: "book_atomic_habits",
    memberCount: 19,
  },
];

export const demoAchievements: Achievement[] = [
  {
    id: "ach_10_books",
    title: "Read 10 Books",
    description: "Complete 10 books in total.",
    unlocked: true,
  },
  {
    id: "ach_5_genres",
    title: "Genre Explorer",
    description: "Finish books from 5 different genres.",
    unlocked: false,
  },
  {
    id: "ach_streak_14",
    title: "Consistency Champion",
    description: "Maintain a 14-day reading streak.",
    unlocked: true,
  },
];

export const demoUsers = {
  user_amy: {
    id: "user_amy",
    displayName: "Amy Chen",
    handle: "amyreads",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
  },
  user_jon: {
    id: "user_jon",
    displayName: "Jon Park",
    handle: "jonbooked",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
  },
};