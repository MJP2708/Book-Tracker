type ReadingStatus = "unread" | "reading" | "finished";

type OfflineBook = {
  id: string;
  title: string;
  author: string | null;
  coverImage: string | null;
  description: string | null;
  totalPages: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type OfflineUser = {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

type OfflineLibraryEntry = {
  id: string;
  userEmail: string;
  bookId: string;
  status: ReadingStatus;
  pagesRead: number;
  notes: string | null;
  tags: string[];
  updatedAt: string;
  highlights: string[];

type OfflineState = {
  books: Map<string, OfflineBook>;
  usersByEmail: Map<string, OfflineUser>;
  usersById: Map<string, OfflineUser>;
  libraryByUserEmail: Map<string, Map<string, OfflineLibraryEntry>>;
  follows: Set<string>;
};

const globalState = globalThis as unknown as { __offlineStore?: OfflineState };

function createState(): OfflineState {
  const now = new Date().toISOString();
  const books = new Map<string, OfflineBook>();

  const starter: OfflineBook[] = [
    {
      id: "offline-book-1",
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: null,
      description: "Build better habits and break bad ones.",
      totalPages: 320,
      tags: ["habits", "productivity"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "offline-book-2",
      title: "Deep Work",
      author: "Cal Newport",
      coverImage: null,
      description: "Focused success in a distracted world.",
      totalPages: 304,
      highlights?: string[];
    }) {
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const book of starter) {
    books.set(book.id, book);
  }

  return {
    books,
    usersByEmail: new Map(),
    usersById: new Map(),
    libraryByUserEmail: new Map(),
    follows: new Set(),
          highlights: existing.highlights || [],
          tags: Array.isArray(input.tags) ? input.tags : existing.tags,
}

function state(): OfflineState {
  if (!globalState.__offlineStore) {
    globalState.__offlineStore = createState();
  }
  return globalState.__offlineStore;
}

          highlights: [],
function nowIso() {
  return new Date().toISOString();
}

function slug(value: string) {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned || "user";
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getOrCreateOfflineUser(email: string, name?: string | null) {
  const s = state();
  const normalized = email.trim().toLowerCase();
  const existing = s.usersByEmail.get(normalized);
  if (existing) {
    if (name && existing.name !== name) {
      existing.name = name;
      existing.updatedAt = nowIso();
      s.usersByEmail.set(normalized, existing);
      s.usersById.set(existing.id, existing);
    }
    return existing;
  }

  const user: OfflineUser = {
    id: `offline-user-${slug(normalized)}`,
    email: normalized,
    name: name || normalized.split("@")[0],
    bio: null,
    image: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  s.usersByEmail.set(normalized, user);
  s.usersById.set(user.id, user);
  return user;
}

export function updateOfflineUser(email: string, patch: { name?: string; bio?: string; image?: string }) {
  const user = getOrCreateOfflineUser(email);
  if (typeof patch.name === "string") user.name = patch.name;
  if (typeof patch.bio === "string") user.bio = patch.bio;
  if (typeof patch.image === "string") user.image = patch.image;
  user.updatedAt = nowIso();
  return user;
}

export function listOfflineBooks(query?: string, tag?: string) {
  const s = state();
  const q = (query || "").trim().toLowerCase();
  const t = (tag || "").trim().toLowerCase();

  return Array.from(s.books.values())
    .filter((book) => {
      const matchesQuery =
        !q ||
        book.title.toLowerCase().includes(q) ||
        (book.author || "").toLowerCase().includes(q);
      const matchesTag = !t || book.tags.includes(t);
      return matchesQuery && matchesTag;
    })
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
}

export function createOfflineBook(input: {
  title: string;
  author?: string;
  coverImage?: string | null;
  description?: string | null;
  totalPages?: number | null;
  tags?: string[];
}) {
  const s = state();
  const timestamp = nowIso();
  const book: OfflineBook = {
    id: makeId("offline-book"),
    title: input.title,
    author: input.author || "Unknown",
    coverImage: input.coverImage || null,
    description: input.description || null,
    totalPages: typeof input.totalPages === "number" ? input.totalPages : null,
    tags: (input.tags || []).map((tag) => tag.toLowerCase()),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  s.books.set(book.id, book);
  return book;
}

export function listOfflineLibrary(email: string) {
  const s = state();
  const user = getOrCreateOfflineUser(email);
  const entries = s.libraryByUserEmail.get(user.email);
  if (!entries) return [];

  return Array.from(entries.values())
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
    .map((entry) => {
      const book = s.books.get(entry.bookId);
      if (!book) return null;
      return {
        id: entry.id,
        status: entry.status,
        pagesRead: entry.pagesRead,
        totalPages: book.totalPages,
        tags: entry.tags,
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          description: book.description,
        },
      };
    })
    .filter(Boolean);
}

export function addOfflineLibraryEntry(
  email: string,
  input: {
    bookId: string;
    status?: ReadingStatus;
    pagesRead?: number;
    notes?: string;
    tags?: string[];
  }
) {
  const s = state();
  const user = getOrCreateOfflineUser(email);
  const book = s.books.get(input.bookId);
  if (!book) return null;

  const key = user.email;
  const current = s.libraryByUserEmail.get(key) || new Map<string, OfflineLibraryEntry>();
  const existing = current.get(book.id);

  const entry: OfflineLibraryEntry = existing
    ? {
        ...existing,
        status: input.status || existing.status,
        pagesRead: Number.isFinite(input.pagesRead) ? Number(input.pagesRead) : existing.pagesRead,
        notes: typeof input.notes === "string" ? input.notes : existing.notes,
        tags: Array.isArray(input.tags) ? input.tags : existing.tags,
        updatedAt: nowIso(),
      }
    : {
        id: makeId("offline-entry"),
        userEmail: user.email,
        bookId: book.id,
        status: input.status || "unread",
        pagesRead: Number.isFinite(input.pagesRead) ? Number(input.pagesRead) : 0,
        notes: typeof input.notes === "string" ? input.notes : null,
        tags: Array.isArray(input.tags) ? input.tags : [],
        updatedAt: nowIso(),
      };

  current.set(book.id, entry);
  s.libraryByUserEmail.set(key, current);

  return {
    id: entry.id,
    status: entry.status,
    pagesRead: entry.pagesRead,
    totalPages: book.totalPages,
    tags: entry.tags,
    book: {
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      description: book.description,
    },
  };
}

export function getOfflineProfile(email: string) {
  const user = getOrCreateOfflineUser(email);
  const library = listOfflineLibrary(email);
  const finished = library.filter((entry) => entry && entry.status === "finished").length;
  const pages = library.reduce((acc, entry) => acc + (entry?.pagesRead || 0), 0);
  const s = state();

  let followers = 0;
  let following = 0;
  for (const relation of s.follows) {
    const [from, to] = relation.split("::");
    if (to === user.id) followers += 1;
    if (from === user.id) following += 1;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
    },
    stats: {
      booksRead: finished,
      totalPages: pages,
      readingStreak: 0,
    },
    counts: {
      followers,
      following,
      userBooks: library.length,
    },
  };
}

export function listOfflineSuggestions(email: string) {
  const s = state();
  const current = getOrCreateOfflineUser(email);
  const users = Array.from(s.usersByEmail.values()).filter((user) => user.id !== current.id);
  return users.slice(0, 5).map((user) => ({
    id: user.id,
    name: user.name,
    favoriteGenre: null,
  }));
}

export function searchOfflineUsers(email: string, query: string) {
  const s = state();
  const current = getOrCreateOfflineUser(email);
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return Array.from(s.usersByEmail.values())
    .filter((user) => user.id !== current.id && (user.name || "").toLowerCase().includes(q))
    .slice(0, 8)
    .map((user) => ({
      id: user.id,
      name: user.name,
      favoriteGenre: null,
    }));
}

export function toggleOfflineFollow(email: string, userIdToFollow: string) {
  const s = state();
  const current = getOrCreateOfflineUser(email);
  if (current.id === userIdToFollow) {
    return { error: "Cannot follow yourself" as const };
  }

  const key = `${current.id}::${userIdToFollow}`;
  if (s.follows.has(key)) {
    s.follows.delete(key);
    return { isFollowing: false };
  }
  s.follows.add(key);
  return { isFollowing: true };
}

export function getOfflinePublicProfile(userId: string) {
  const s = state();
  const user = s.usersById.get(userId);
  if (!user) return null;

  const entries = listOfflineLibrary(user.email);
  return {
    user: {
      id: user.id,
      name: user.name,
      bio: user.bio,
      image: user.image,
      createdAt: user.createdAt,
      _count: {
        followers: 0,
        following: 0,
      },
    },
    userBooks: entries.map((entry) => ({
      id: entry?.id,
      status: entry?.status,
      book: {
        id: entry?.book.id,
        title: entry?.book.title,
        author: entry?.book.author,
      },
    })),
  };
}

export function getOfflineBook(bookId: string) {
  return state().books.get(bookId) || null;
}

export function getOfflineUserBook(email: string, bookId: string) {
  const s = state();
  const user = getOrCreateOfflineUser(email);
  const entries = s.libraryByUserEmail.get(user.email);
  if (!entries) return null;
  const entry = entries.get(bookId);
  if (!entry) return null;
  const book = s.books.get(bookId);
  if (!book) return null;
  const progress = book.totalPages && book.totalPages > 0 ? Math.min(100, Math.round((entry.pagesRead / book.totalPages) * 100)) : 0;
  return { id: entry.id, status: entry.status, pagesRead: entry.pagesRead, totalPages: book.totalPages, progress, note: entry.notes || "", highlights: entry.highlights || [] };
}

export function updateOfflineUserBookByBookId(
  email: string,
  bookId: string,
  patch: { status?: ReadingStatus; pagesRead?: number; totalPages?: number | null; notes?: string; highlights?: string[] }
) {
  const s = state();
  const user = getOrCreateOfflineUser(email);
  const book = s.books.get(bookId);
  if (!book) return null;
  const existing = s.libraryByUserEmail.get(user.email);
  const map = existing || new Map<string, OfflineLibraryEntry>();
  let entry = map.get(bookId);
  if (!entry) {
    entry = { id: makeId("offline-entry"), userEmail: user.email, bookId, status: patch.status || "unread", pagesRead: typeof patch.pagesRead === "number" ? patch.pagesRead : 0, notes: typeof patch.notes === "string" ? patch.notes : null, highlights: Array.isArray(patch.highlights) ? patch.highlights : [], tags: [], updatedAt: nowIso() };
  } else {
    if (patch.status) entry.status = patch.status;
    if (typeof patch.pagesRead === "number") entry.pagesRead = patch.pagesRead;
    if (typeof patch.notes === "string") entry.notes = patch.notes;
    if (Array.isArray(patch.highlights)) entry.highlights = patch.highlights;
    entry.updatedAt = nowIso();
  }
  map.set(bookId, entry);
  s.libraryByUserEmail.set(user.email, map);
  if (patch.totalPages !== undefined) { book.totalPages = patch.totalPages; book.updatedAt = nowIso(); }
  return entry;
}

function findEntryById(email: string, entryId: string): { entry: OfflineLibraryEntry; bookId: string } | null {
  const s = state();
  const user = getOrCreateOfflineUser(email);
  const userEntries = s.libraryByUserEmail.get(user.email);
  if (!userEntries) return null;
  for (const [bookId, entry] of userEntries) {
    if (entry.id === entryId) return { entry, bookId };
  }
  return null;
}

export function updateOfflineLibraryEntryById(
  email: string,
  entryId: string,
  patch: { status?: ReadingStatus; pagesRead?: number; notes?: string; tags?: string[]; highlights?: string[] }
) {
  const found = findEntryById(email, entryId);
  if (!found) return null;
  const { entry, bookId } = found;
  if (patch.status) entry.status = patch.status;
  if (typeof patch.pagesRead === "number") entry.pagesRead = patch.pagesRead;
  if (typeof patch.notes === "string") entry.notes = patch.notes;
  if (Array.isArray(patch.tags)) entry.tags = patch.tags;
  if (Array.isArray(patch.highlights)) entry.highlights = patch.highlights;
  entry.updatedAt = nowIso();
  const book = state().books.get(bookId);
  if (!book) return null;
  return { id: entry.id, status: entry.status, pagesRead: entry.pagesRead, totalPages: book.totalPages, tags: entry.tags, book: { id: book.id, title: book.title, author: book.author, coverImage: book.coverImage, description: book.description } };
}

export function deleteOfflineLibraryEntryById(email: string, entryId: string) {
  const found = findEntryById(email, entryId);
  if (!found) return false;
  const s = state();
  const user = getOrCreateOfflineUser(email);
  const userEntries = s.libraryByUserEmail.get(user.email);
  if (!userEntries) return false;
  userEntries.delete(found.bookId);
  return true;
}

export function checkOfflineIsFollowing(followerEmail: string, followingId: string) {
  const s = state();
  const follower = getOrCreateOfflineUser(followerEmail);
  return s.follows.has(`${follower.id}::${followingId}`);
}
