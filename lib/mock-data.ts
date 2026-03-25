export type DiscoveryCategory = {
  key: string;
  title: string;
  tag: string;
  books: Array<{
    title: string;
    author: string;
    description: string;
    coverUrl: string;
  }>;
};

export const discoveryCategories: DiscoveryCategory[] = [
  {
    key: "recommended",
    title: "Recommended for you",
    tag: "personalized",
    books: [
      {
        title: "Atomic Habits",
        author: "James Clear",
        description: "Build better systems and long-term habits.",
        coverUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Deep Work",
        author: "Cal Newport",
        description: "Master focused work in a distracted world.",
        coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        description: "Timeless lessons about wealth and behavior.",
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    key: "trending",
    title: "Trending books",
    tag: "popular",
    books: [
      {
        title: "The Almanack of Naval Ravikant",
        author: "Eric Jorgenson",
        description: "Leverage, wealth, and building a life.",
        coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Make Time",
        author: "Jake Knapp",
        description: "Practical methods to focus each day.",
        coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Zero to One",
        author: "Peter Thiel",
        description: "Notes on startups and innovation.",
        coverUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    key: "business",
    title: "Popular in business/self-improvement",
    tag: "business",
    books: [
      {
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        description: "Mindset shifts around money and assets.",
        coverUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "The Lean Startup",
        author: "Eric Ries",
        description: "Build-measure-learn for product teams.",
        coverUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Think and Grow Rich",
        author: "Napoleon Hill",
        description: "Classic principles for achievement.",
        coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

export const learningPaths = [
  {
    id: "learn-business",
    title: "Learn Business",
    description: "From money mindset to startup execution.",
    steps: ["Rich Dad Poor Dad", "Atomic Habits", "The Lean Startup"],
  },
  {
    id: "focus-and-output",
    title: "Focus and Output",
    description: "Improve consistency and creative execution.",
    steps: ["Deep Work", "Make Time", "Show Your Work"],
  },
];
