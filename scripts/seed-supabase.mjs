import { createClient } from "@supabase/supabase-js";
import { loadEnvFromProjectRoot } from "./env-loader.mjs";

loadEnvFromProjectRoot();

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const seedUsers = [
  {
    email: "ava.reader@bookshelf.app",
    password: "Bookshelf#2026",
    displayName: "Ava Reader",
    handle: "ava_reader",
    bio: "Sci-fi enthusiast and weekend marathon reader.",
    premium: true,
  },
  {
    email: "liam.pages@bookshelf.app",
    password: "Bookshelf#2026",
    displayName: "Liam Pages",
    handle: "liam_pages",
    bio: "Non-fiction, productivity, and startup books.",
    premium: false,
  },
  {
    email: "nora.novels@bookshelf.app",
    password: "Bookshelf#2026",
    displayName: "Nora Novels",
    handle: "nora_novels",
    bio: "Literary fiction with deep character arcs.",
    premium: true,
  },
];

const seedBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    cover_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=900&fit=crop",
    description: "A practical system for forming good habits and breaking bad ones.",
    genres: ["Self-Improvement", "Productivity"],
    rating: 4.7,
    pages: 320,
    published_year: 2018,
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover_image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=900&fit=crop",
    description: "A lone astronaut races to save humanity in a high-stakes sci-fi mission.",
    genres: ["Sci-Fi", "Adventure"],
    rating: 4.8,
    pages: 496,
    published_year: 2021,
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    cover_image: "https://images.unsplash.com/photo-1455885666463-9c41e569e331?w=600&h=900&fit=crop",
    description: "Rules for focused success in a distracted world.",
    genres: ["Productivity", "Business"],
    rating: 4.5,
    pages: 304,
    published_year: 2016,
  },
  {
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    cover_image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=900&fit=crop",
    description: "A decades-spanning story about friendship and creative partnership.",
    genres: ["Literary", "Contemporary"],
    rating: 4.4,
    pages: 416,
    published_year: 2022,
  },
  {
    title: "The Mountain Is You",
    author: "Brianna Wiest",
    cover_image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=900&fit=crop",
    description: "Transform self-sabotage into self-mastery through emotional intelligence.",
    genres: ["Self-Improvement", "Psychology"],
    rating: 4.3,
    pages: 248,
    published_year: 2020,
  },
];

async function ensureAuthUsers() {
  const created = [];

  for (const candidate of seedUsers) {
    const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) throw listError;

    const existing = usersPage.users.find((u) => u.email?.toLowerCase() === candidate.email.toLowerCase());

    if (existing) {
      created.push({ id: existing.id, ...candidate });
      continue;
    }

    const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
      email: candidate.email,
      password: candidate.password,
      email_confirm: true,
      user_metadata: {
        display_name: candidate.displayName,
      },
    });

    if (createError || !createdUser.user) throw createError ?? new Error("Failed to create auth user");
    created.push({ id: createdUser.user.id, ...candidate });
  }

  return created;
}

async function upsertPublicUsers(users) {
  const payload = users.map((user) => ({
    id: user.id,
    handle: user.handle,
    display_name: user.displayName,
    bio: user.bio,
    premium: user.premium,
    avatar_url: null,
  }));

  const { error } = await supabase.from("users").upsert(payload, { onConflict: "id" });
  if (error) throw error;
}

async function upsertBooks() {
  const { error } = await supabase.from("books").upsert(seedBooks, { onConflict: "title,author" });
  if (error) throw error;

  const { data, error: readError } = await supabase.from("books").select("id,title,author").in(
    "title",
    seedBooks.map((b) => b.title)
  );

  if (readError || !data) throw readError ?? new Error("Failed to read seeded books");

  return data;
}

async function seedRelationships(users, books) {
  const bookByTitle = new Map(books.map((book) => [book.title, book.id]));

  const userBooks = [
    { user_id: users[0].id, book_id: bookByTitle.get("Project Hail Mary"), shelf: "currently_reading", progress: 62, rating: 5, liked: true },
    { user_id: users[0].id, book_id: bookByTitle.get("Atomic Habits"), shelf: "finished", progress: 100, rating: 5, liked: true },
    { user_id: users[1].id, book_id: bookByTitle.get("Deep Work"), shelf: "currently_reading", progress: 41, rating: 4, liked: true },
    { user_id: users[1].id, book_id: bookByTitle.get("Atomic Habits"), shelf: "finished", progress: 100, rating: 4, liked: true },
    { user_id: users[2].id, book_id: bookByTitle.get("Tomorrow, and Tomorrow, and Tomorrow"), shelf: "finished", progress: 100, rating: 5, liked: true },
  ].filter((entry) => Boolean(entry.book_id));

  const { error: userBooksError } = await supabase.from("user_books").upsert(userBooks, {
    onConflict: "user_id,book_id",
  });
  if (userBooksError) throw userBooksError;

  const reviews = [
    { user_id: users[0].id, book_id: bookByTitle.get("Project Hail Mary"), rating: 5, body: "Hard sci-fi with heart and momentum.", tags: ["Mind-blowing"] },
    { user_id: users[1].id, book_id: bookByTitle.get("Atomic Habits"), rating: 4, body: "Tactical and practical, easy to apply daily.", tags: ["Easy read"] },
    { user_id: users[2].id, book_id: bookByTitle.get("Tomorrow, and Tomorrow, and Tomorrow"), rating: 5, body: "Emotionally rich and beautifully written.", tags: ["Mind-blowing"] },
  ].filter((entry) => Boolean(entry.book_id));

  const { error: reviewsError } = await supabase.from("reviews").upsert(reviews, {
    onConflict: "user_id,book_id",
  });
  if (reviewsError) throw reviewsError;

  const follows = [
    { follower_id: users[0].id, followee_id: users[1].id },
    { follower_id: users[0].id, followee_id: users[2].id },
    { follower_id: users[1].id, followee_id: users[2].id },
  ];

  const { error: followsError } = await supabase.from("follows").upsert(follows, {
    onConflict: "follower_id,followee_id",
  });
  if (followsError) throw followsError;

  const activities = [
    { actor_id: users[0].id, activity_type: "finished", book_id: bookByTitle.get("Atomic Habits") },
    { actor_id: users[1].id, activity_type: "rated", book_id: bookByTitle.get("Deep Work"), metadata: { rating: 4 } },
    { actor_id: users[2].id, activity_type: "added", book_id: bookByTitle.get("Project Hail Mary") },
  ].filter((entry) => Boolean(entry.book_id));

  const { error: activitiesError } = await supabase.from("activities").insert(activities);
  if (activitiesError && !activitiesError.message.includes("duplicate")) {
    throw activitiesError;
  }

  const { data: club, error: clubError } = await supabase
    .from("book_clubs")
    .upsert(
      {
        owner_id: users[0].id,
        name: "Sci-Fi Sundays",
        description: "Weekly chapter sprints and deep lore discussion.",
        visibility: "public",
        current_book_id: bookByTitle.get("Project Hail Mary"),
      },
      { onConflict: "name" }
    )
    .select("id")
    .single();

  if (clubError || !club) {
    const { data: existingClub, error: existingClubError } = await supabase
      .from("book_clubs")
      .select("id")
      .eq("name", "Sci-Fi Sundays")
      .single();

    if (existingClubError || !existingClub) throw clubError ?? existingClubError;

    const { error: memberError } = await supabase.from("club_members").upsert(
      [
        { club_id: existingClub.id, user_id: users[0].id, role: "owner" },
        { club_id: existingClub.id, user_id: users[1].id, role: "member" },
        { club_id: existingClub.id, user_id: users[2].id, role: "member" },
      ],
      { onConflict: "club_id,user_id" }
    );

    if (memberError) throw memberError;
    return;
  }

  const { error: memberError } = await supabase.from("club_members").upsert(
    [
      { club_id: club.id, user_id: users[0].id, role: "owner" },
      { club_id: club.id, user_id: users[1].id, role: "member" },
      { club_id: club.id, user_id: users[2].id, role: "member" },
    ],
    { onConflict: "club_id,user_id" }
  );

  if (memberError) throw memberError;
}

try {
  console.log("Seeding auth users...");
  const users = await ensureAuthUsers();

  console.log("Seeding public users...");
  await upsertPublicUsers(users);

  console.log("Seeding books...");
  const books = await upsertBooks();

  console.log("Seeding relationships and social graph...");
  await seedRelationships(users, books);

  console.log("Supabase seed complete.");
  console.log("Created/updated users:", users.map((u) => `${u.email} (${u.id})`).join(", "));
} catch (error) {
  console.error(error);
  process.exit(1);
}