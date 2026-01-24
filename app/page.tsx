"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BookOpen,
  Users,
  Share2,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0 -z-10 gradient-warm gradient-warm-dark" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 animate-slideIn">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-12 h-12 text-amber-600 dark:text-amber-500" />
                <h1 className="text-5xl sm:text-6xl font-serif-title text-amber-900 dark:text-amber-50">
                  Bookshelf
                </h1>
              </div>
              <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                Connect with readers worldwide, share your favorite books, track
                your progress, and discover your next great read in our thriving
                book community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/auth/signup" className="btn-primary">
                  Start Reading Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/login" className="btn-secondary">
                  Sign In to Your Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-serif-title text-slate-900 dark:text-amber-50 text-center mb-16">
              Everything for Book Lovers
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card-bookish hover-lift">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-2">
                  Track Your Library
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Organize all your books across multiple shelves - unread,
                  reading, and finished. Get detailed reading statistics and
                  progress tracking.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card-bookish hover-lift">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-2">
                  Connect & Share
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Follow other readers, see what they're reading, share your
                  thoughts, and tag friends in books you love.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card-bookish hover-lift">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-2">
                  Social Feed
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Discover trending books, share quotes, and engage with posts
                  from your reading community.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="card-bookish hover-lift">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-2">
                  Personalized Stats
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Get insights into your reading habits, favorite genres, and
                  reading streaks.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="card-bookish hover-lift">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-2">
                  Rate & Review
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Share your honest reviews and ratings with the community to
                  help others find their next great read.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="card-bookish hover-lift">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-2">
                  Cloud Sync
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your library syncs across all your devices. Access your books
                  and progress anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-warm gradient-warm-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-serif-title text-amber-900 dark:text-amber-50 mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
              Join thousands of book lovers building their perfect library and
              connecting over stories.
            </p>
            <Link href="/auth/signup" className="btn-primary">
              Create Your Account Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 dark:bg-black text-slate-300 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>
              © 2024 Bookshelf. Made for book lovers, by book lovers. 📚
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
      root.classList.remove("dark");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const fetchBookCover = async (bookTitle: string): Promise<string | undefined> => {
    try {
      let response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}&maxResults=5&orderBy=relevance`
      );
      let data = await response.json();

      if (data.items) {
        for (const item of data.items) {
          if (item?.volumeInfo?.imageLinks?.thumbnail) {
            return item.volumeInfo.imageLinks.thumbnail.replace(/^http:/, "https:");
          }
        }
      }

      response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}&maxResults=10`
      );
      data = await response.json();

      if (data.items) {
        for (const item of data.items) {
          if (item?.volumeInfo?.imageLinks?.thumbnail) {
            return item.volumeInfo.imageLinks.thumbnail.replace(/^http:/, "https:");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching book cover:", error);
    }
    return undefined;
  };

  const addBook = async () => {
    if (!title.trim()) return;
    const coverImage = await fetchBookCover(title);
    setBooks([
      ...books,
      {
        id: Math.random().toString(),
        title,
        status,
        coverImage,
        notes: "",
        tags: [],
        rating: 0,
        review: "",
        dateAdded: new Date().toISOString().split("T")[0],
        totalPages: 0,
        pagesRead: 0,
        progress: 0,
      },
    ]);
    setTitle("");
    setStatus("Unread");
    showToast(`"${title}" added to your library! 📚`, "success");
  };

  const updateStatus = (id: string, newStatus: string) => {
    setBooks(
      books.map((b) => {
        if (b.id === id) {
          const updated = { ...b, status: newStatus };
          if (newStatus === "In Progress" && !b.dateStarted) {
            updated.dateStarted = new Date().toISOString().split("T")[0];
          }
          if (newStatus === "Finished" && !b.dateFinished) {
            updated.dateFinished = new Date().toISOString().split("T")[0];
          }
          return updated;
        }
        return b;
      })
    );
  };

  const deleteBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    setBooks(books.filter((b) => b.id !== id));
    setDeleteConfirm(null);
    showToast(`"${book?.title}" removed from your library`, "info");
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(
      books.map((b) => {
        if (b.id === id) {
          const updated = { ...b, ...updates };

          // Auto-calculate progress if pages are set
          if (updates.pagesRead !== undefined || updates.totalPages !== undefined) {
            const pagesRead = updates.pagesRead ?? b.pagesRead ?? 0;
            const totalPages = updates.totalPages ?? b.totalPages ?? 0;
            updated.progress = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;

            // Auto-move to Finished at 100%
            if (updated.progress >= 100 && b.status !== "Finished") {
              updated.status = "Finished";
              if (!b.dateFinished) {
                updated.dateFinished = new Date().toISOString().split("T")[0];
              }
              showToast(`"${b.title}" marked as finished! 🎉`, "success");
            }
          }

          // Or if progress is set directly
          if (updates.progress !== undefined) {
            if (updates.progress >= 100 && b.status !== "Finished") {
              updated.status = "Finished";
              if (!b.dateFinished) {
                updated.dateFinished = new Date().toISOString().split("T")[0];
              }
              showToast(`"${b.title}" marked as finished! 🎉`, "success");
            }
          }

          return updated;
        }
        return b;
      })
    );
  };

  const saveNotes = () => {
    if (selectedBookForNotes) {
      updateBook(selectedBookForNotes.id, { notes: noteInput });
      setSelectedBookForNotes(null);
      setNoteInput("");
      showToast("Notes saved! ✏️", "success");
    }
  };

  const startReadingSession = (bookId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    let streakUpdate = book.readingStreak || 0;
    
    // Check if they read yesterday or today
    if (book.lastReadDate) {
      const lastDate = new Date(book.lastReadDate);
      const today2 = new Date();
      const daysDiff = Math.floor((today2.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        streakUpdate += 1;
      } else if (daysDiff > 1) {
        streakUpdate = 1;
      }
      // If daysDiff === 0 (same day), keep the current streak
    } else {
      streakUpdate = 1;
    }

    updateBook(bookId, {
      lastReadDate: today,
      readingStreak: streakUpdate,
      sessionsRead: (book.sessionsRead || 0) + 1,
    });

    setCurrentReadingBook(bookId);
    setReadingMode(bookId);
    showToast(`📖 Reading session started! Streak: 🔥 ${streakUpdate}`, "success");
  };

  const endReadingSession = () => {
    setReadingMode(null);
    showToast("Reading session ended! 📚", "success");
  };

  const addReadingGoal = () => {
    if (!goalName.trim() || !goalTarget) return;
    setReadingGoals([
      ...readingGoals,
      {
        id: Math.random().toString(),
        name: goalName,
        type: goalType,
        targetBooks: parseInt(goalTarget),
        createdDate: new Date().toISOString().split("T")[0],
      },
    ]);
    setGoalName("");
    setGoalTarget("");
    setGoalType("month");
    setShowGoalForm(false);
    showToast("📖 Reading goal added!", "success");
  };

  const deleteGoal = (id: string) => {
    setReadingGoals(readingGoals.filter((g) => g.id !== id));
    showToast("Goal removed", "info");
  };

  const getGoalProgress = (goal: ReadingGoal) => {
    const today = new Date();
    const isMonth = goal.type === "month";
    
    const completed = books.filter((b) => {
      if (!b.dateFinished) return false;
      const finishDate = new Date(b.dateFinished);
      
      if (isMonth) {
        return finishDate.getMonth() === today.getMonth() && 
               finishDate.getFullYear() === today.getFullYear();
      } else {
        return finishDate.getFullYear() === today.getFullYear();
      }
    }).length;

    return { completed, percentage: Math.min((completed / goal.targetBooks) * 100, 100) };
  };

  const getReadingStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let longestStreak = 0;
    for (const book of books) {
      if (book.readingStreak) {
        longestStreak = Math.max(longestStreak, book.readingStreak);
      }
    }
    return longestStreak;
  };

  const togglePin = (id: string) => {
    updateBook(id, { isPinned: !books.find((b) => b.id === id)?.isPinned });
  };

  const handleDragStart = (bookId: string, status: string) => {
    setDraggedBook(bookId);
    setDraggedFromStatus(status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: string) => {
    if (draggedBook && draggedFromStatus) {
      updateStatus(draggedBook, newStatus);
      setDraggedBook(null);
      setDraggedFromStatus(null);
      showToast(`Book moved to ${newStatus}!`, "success");
    }
  };

  const getRecommendations = () => {
    const finishedBooks = books.filter((b) => b.status === "Finished");
    const finishedTags = new Set<string>();
    
    finishedBooks.forEach((book) => {
      book.tags.forEach((tag) => finishedTags.add(tag));
    });

    return books.filter((b) => {
      if (b.status === "Finished" || b.status === "In Progress") return false;
      return b.tags.some((tag) => finishedTags.has(tag));
    }).slice(0, 3);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addBook();
  };

  const categories = [
    {
      name: "Unread",
      icon: BookOpen,
      color: "from-blue-500/10 to-blue-500/5",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      name: "In Progress",
      icon: Clock,
      color: "from-amber-500/10 to-amber-500/5",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
    },
    {
      name: "Finished",
      icon: CheckCircle2,
      color: "from-green-500/10 to-green-500/5",
      badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    },
  ];

  const bookCount = (cat: string) => books.filter((b) => b.status === cat).length;

  const presetTags = ["Fiction", "Self-Help", "Programming", "Thai Lit", "Mystery", "Romance", "Science", "History"];

  const finishedBooks = books.filter((b) => b.status === "Finished");
  const thisMonthBooks = finishedBooks.filter((b) => {
    const date = new Date(b.dateFinished || "");
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const getProgressPercentage = (book: Book) => {
    if (book.totalPages && book.totalPages > 0) {
      return Math.round(((book.pagesRead || 0) / book.totalPages) * 100);
    }
    return book.progress || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 dark:from-blue-400 dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
              My Reading Library
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Track and organize your reading journey
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Theme Toggle */}
            <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded transition-colors ${
                  theme === "light" ? "bg-blue-500 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
                title="Light mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded transition-colors ${
                  theme === "dark" ? "bg-blue-500 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
                title="Dark mode"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded transition-colors ${
                  theme === "system" ? "bg-blue-500 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
                title="System mode"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-blue-500 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-blue-500 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              Wishlist
            </Link>
          </div>
        </div>

        {/* Currently Reading Spotlight */}
        {books.filter((b) => b.status === "In Progress").length > 0 && (
          <Card className="mb-8 sm:mb-10 shadow-lg border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8">
                {/* Book Cover */}
                <div className="flex justify-center md:justify-start">
                  {books.find((b) => b.status === "In Progress")?.coverImage && (
                    <img
                      src={books.find((b) => b.status === "In Progress")?.coverImage}
                      alt="Currently reading"
                      className="h-48 sm:h-64 w-auto object-cover rounded-xl shadow-lg"
                    />
                  )}
                </div>

                {/* Book Info */}
                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      📖 Currently Reading
                    </h2>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                      {books.find((b) => b.status === "In Progress")?.title}
                    </p>

                    {/* Progress Bar */}
                    {books.find((b) => b.status === "In Progress")?.totalPages && (
                      <div className="space-y-2 mb-6">
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${getProgressPercentage(
                                books.find((b) => b.status === "In Progress")!
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {getProgressPercentage(books.find((b) => b.status === "In Progress")!)}%{" "}
                          | {books.find((b) => b.status === "In Progress")?.pagesRead}/
                          {books.find((b) => b.status === "In Progress")?.totalPages} pages
                        </p>
                      </div>
                    )}

                    {/* Reading Streak */}
                    {books.find((b) => b.status === "In Progress")?.readingStreak && (
                      <div className="flex items-center gap-3 mb-6 bg-red-100 dark:bg-red-900/30 rounded-lg px-4 py-2 w-fit">
                        <Flame className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {books.find((b) => b.status === "In Progress")?.readingStreak} day streak!
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        const book = books.find((b) => b.status === "In Progress");
                        if (book) startReadingSession(book.id);
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Reading
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reading Goals Section */}
        <div className="mb-8 sm:mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-500" />
              Reading Goals
            </h2>
            <Button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="bg-purple-500 hover:bg-purple-600 text-white text-sm"
            >
              + Add Goal
            </Button>
          </div>

          {showGoalForm && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                    Goal Name
                  </label>
                  <Input
                    placeholder="e.g., Read 12 books"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Period
                    </label>
                    <select
                      value={goalType}
                      onChange={(e) => setGoalType(e.target.value as "month" | "year")}
                      className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                    >
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Target Books
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      placeholder="e.g., 12"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={addReadingGoal}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Add Goal
                  </Button>
                  <Button
                    onClick={() => setShowGoalForm(false)}
                    className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {readingGoals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readingGoals.map((goal) => {
                const progress = getGoalProgress(goal);
                return (
                  <Card
                    key={goal.id}
                    className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {goal.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {goal.type === "month" ? "This Month" : "This Year"}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Circular Progress */}
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="text-slate-200 dark:text-slate-700"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 - (progress.percentage / 100) * 2 * Math.PI * 40}`}
                              className="text-purple-500 transition-all duration-300"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {Math.round(progress.percentage)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {progress.completed}
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              /{goal.targetBooks}
                            </span>
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            books completed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Reading Streak Card */}
        <div className="mb-8 sm:mb-10 bg-gradient-to-r from-red-500/10 to-red-500/5 dark:from-red-900/30 dark:to-red-800/30 rounded-xl px-6 sm:px-8 py-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-4">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold uppercase">
                Longest Reading Streak
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-400 mt-1">
                🔥 {getReadingStreak()} days
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview - Compact with Status Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {categories.map((cat) => {
            const categoryColor = cat.name === "Want to Read" ? "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400" :
                                cat.name === "In Progress" ? "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400" :
                                "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400";
            return (
              <div
                key={cat.name}
                className={`bg-gradient-to-br ${categoryColor} rounded-lg p-3 sm:p-4 shadow-sm border hover:shadow-md transition-all duration-200 hover:scale-105`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">
                      {cat.name}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                      {bookCount(cat.name)}
                    </p>
                  </div>
                  <cat.icon className="w-8 h-8 sm:w-9 sm:h-9 opacity-40" />
                </div>
              </div>
            );
          })}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 rounded-lg p-3 sm:p-4 shadow-sm border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">
                  This Month
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                  {thisMonthBooks.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600 dark:text-emerald-400 opacity-40" />
            </div>
          </div>
        </div>

        {/* Add Book Card - Primary Action */}
        <div className="mb-12 sm:mb-16">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-200">
            <CardHeader className="pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">➕</span>
                Add a New Book
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">        
            <Input
              placeholder="Enter book title (English or Thai)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-sm sm:text-base h-10 sm:h-11"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="flex-1 h-10 sm:h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
              <Button
                onClick={addBook}
                size="lg"
                className="sm:w-auto w-full font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-white text-sm sm:text-base h-10 sm:h-11"
              >
                Add Book
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-6xl mb-4">📚</div>
            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 dark:text-slate-600 mb-4 opacity-60" />
            <p className="text-lg sm:text-xl text-slate-900 dark:text-white font-bold">
              Your library is empty
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 text-center max-w-md">
              Start your reading journey by adding your first book. Build your collection and track your reading progress!
            </p>
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-white font-semibold px-6 py-3">
              ➕ Add Your First Book
            </Button>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {/* Reading Recommendations */}
            {getRecommendations().length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 sm:p-8 border border-amber-200 dark:border-amber-800/50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  Reading Recommendations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getRecommendations().map((book) => (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBookForDetails(book)}
                      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      {book.coverImage && (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                        />
                      )}
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Based on your {book.tags.join(", ")} reads
                      </p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(book.id, "In Progress");
                          showToast(`Started reading "${book.title}"!`, "success");
                        }}
                        className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs h-8"
                      >
                        Start Reading
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Books by Category Section */}
            <div className="space-y-8 sm:space-y-10">
            {categories.map((cat) => {
              const pinnedBooks = books.filter((b) => b.status === cat.name && b.isPinned).sort((a, b) => (b.rating || 0) - (a.rating || 0));
              const unpinnedBooks = books.filter((b) => b.status === cat.name && !b.isPinned);
              const categoryBooks = [...pinnedBooks, ...unpinnedBooks];

              return (
                <div key={cat.name} className="mb-8 sm:mb-10">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <cat.icon className="w-6 h-6" />
                      {cat.name}
                      <span className={`text-sm px-3 py-1 rounded-full ${cat.badge}`}>
                        {bookCount(cat.name)}
                      </span>
                    </h2>
                  </div>

                  {categoryBooks.length === 0 ? (
                    <Card className={`shadow-lg border-0 bg-gradient-to-br ${cat.color}`}>
                      <CardContent className="py-12 text-center">
                        <BookMarked className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 font-semibold mb-3">
                          No {cat.name.toLowerCase()} books yet
                        </p>
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                          onClick={() => {
                            setStatus(cat.name);
                            // Focus on add book input
                            (document.querySelector('input[placeholder*="book title"]') as HTMLInputElement)?.focus();
                          }}
                        >
                          + Add to {cat.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div
                      className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" : "space-y-3"}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(cat.name)}
                    >
                      {categoryBooks.map((book) => {
                        const progress = getProgressPercentage(book);
                        return viewMode === "grid" ? (
                          // Grid View
                          <div
                            key={book.id}
                            draggable
                            onDragStart={() => handleDragStart(book.id, cat.name)}
                            className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:scale-105 transition-all duration-200 group cursor-grab active:cursor-grabbing hover:-translate-y-1"
                          >
                            {/* Pinned Badge */}
                            {book.isPinned && (
                              <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-lg">
                                <Pin className="w-4 h-4 text-white fill-white" />
                              </div>
                            )}

                            {/* Cover Image */}
                            {book.coverImage && (
                              <div className="relative">
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                            )}

                            {/* Book Info */}
                            <div className="p-4 space-y-3">
                              <div onClick={() => setSelectedBookForDetails(book)} className="cursor-pointer">
                                <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2">
                                  {book.title}
                                </h3>
                              </div>

                              {/* Tags */}
                              {book.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {book.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Rating */}
                              {book.rating > 0 && (
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < book.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"}`} />
                                  ))}
                                </div>
                              )}

                              {/* Progress */}
                              {cat.name === "In Progress" && book.totalPages && (
                                <div className="space-y-1">
                                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{progress}%</p>
                                </div>
                              )}

                              {/* Quick Actions */}
                              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePin(book.id);
                                  }}
                                  className={`flex-1 p-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-110 ${
                                    book.isPinned
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                      : "bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500"
                                  }`}
                                  title="Pin this book"
                                >
                                  <Pin className="w-3 h-3 inline mr-1" />
                                  {book.isPinned ? "Pinned" : "Pin"}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm(book.id);
                                  }}
                                  className="flex-1 p-2 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-110"
                                >
                                  <Trash2 className="w-3 h-3 inline mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // List View
                          <div
                            key={book.id}
                            draggable
                            onDragStart={() => handleDragStart(book.id, cat.name)}
                            className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-lg hover:scale-102 transition-all duration-200 group cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
                            onClick={() => setSelectedBookForDetails(book)}
                          >
                            {/* Pin Icon */}
                            {book.isPinned && (
                              <div className="flex-shrink-0 flex items-center justify-center">
                                <Pin className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              </div>
                            )}

                            {/* Cover */}
                            {book.coverImage && (
                              <div className="flex-shrink-0">
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="h-20 sm:h-24 w-14 sm:w-16 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    book.coverImage && setSelectedCover({ bookTitle: book.title, imageUrl: book.coverImage });
                                  }}
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <p className="font-semibold text-sm sm:text-base break-words text-slate-900 dark:text-white line-clamp-2">
                                  {book.title}
                                </p>
                                {book.tags.length > 0 && (
                                  <div className="flex gap-1 flex-wrap mt-2">
                                    {book.tags.slice(0, 2).map((tag) => (
                                      <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                    {book.tags.length > 2 && <span className="text-xs text-slate-500 dark:text-slate-400">+{book.tags.length - 2}</span>}
                                  </div>
                                )}
                                {book.rating > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < book.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"}`} />
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Progress Bar */}
                              {cat.name === "In Progress" && (
                                <div className="mt-3 space-y-1">
                                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {progress}% {book.totalPages && `(${book.pagesRead}/${book.totalPages})`}
                                  </p>
                                </div>
                              )}

                              {/* Quick Status Buttons */}
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {categories.map((c) => {
                                  const statusColor = c.name === "Want to Read" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50" :
                                                      c.name === "In Progress" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" :
                                                      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50";
                                  return (
                                    <button
                                      key={c.name}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(book.id, c.name);
                                      }}
                                      className={`text-xs px-2 py-1 rounded transition-all duration-200 ${
                                        book.status === c.name
                                          ? `${statusColor} font-semibold scale-105`
                                          : `${statusColor} opacity-60`
                                      } hover:scale-110`}
                                    >
                                      {c.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex gap-2 flex-col">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(book.id);
                                }}
                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${book.isPinned ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"}`}
                                title="Pin this book"
                              >
                                <Pin className="w-4 h-4" />
                              </button>
                              {cat.name === "In Progress" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startReadingSession(book.id);
                                  }}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                                  title="Start reading session"
                                >
                                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBookForNotes(book);
                                  setNoteInput(book.notes);
                                }}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                                title="Add or edit notes"
                              >
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(book.id);
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Footer */}
        {books.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl px-6 sm:px-8 py-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                📖 You have{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">{books.length}</span>{" "}
                book{books.length !== 1 ? "s" : ""} in your library
              </p>
            </div>
          </div>
        )}

        {/* Cover Image Modal */}
        {selectedCover && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCover(null)}
          >
            <div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCover(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors z-10 bg-white dark:bg-slate-800"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 flex flex-col items-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words pr-8 text-center">
                  {selectedCover.bookTitle}
                </h2>
                <img
                  src={selectedCover.imageUrl}
                  alt={selectedCover.bookTitle}
                  className="max-h-96 sm:max-h-[70vh] w-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {selectedBookForNotes && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBookForNotes(null)}
          >
            <div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBookForNotes(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors z-10 bg-white dark:bg-slate-800"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-4 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                    Notes for "{selectedBookForNotes.title}"
                  </h2>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Your Notes
                  </label>
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Write your thoughts, favorite quotes, or summary about this book..."
                    className="w-full h-48 sm:h-64 p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 resize-none font-medium"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setSelectedBookForNotes(null)}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveNotes}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 space-y-2 z-40">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-right ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>

        {/* Book Details Modal (Tags, Rating, Review, Progress) */}
        {selectedBookForDetails && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBookForDetails(null)}
          >
            <div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBookForDetails(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors z-10 bg-white dark:bg-slate-800"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-4 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {selectedBookForDetails.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Added: {selectedBookForDetails.dateAdded}
                    {selectedBookForDetails.dateStarted &&
                      ` • Started: ${selectedBookForDetails.dateStarted}`}
                    {selectedBookForDetails.dateFinished &&
                      ` • Finished: ${selectedBookForDetails.dateFinished}`}
                  </p>
                </div>

                {/* Reading Progress */}
                {selectedBookForDetails.status === "In Progress" && (
                  <div className="space-y-4">
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        <Zap className="w-4 h-4 inline mr-2 text-amber-500" />
                        Reading Progress
                      </label>

                      {/* Pages Input */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Pages Read
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={selectedBookForDetails.pagesRead || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              updateBook(selectedBookForDetails.id, {
                                pagesRead: val,
                              });
                              setSelectedBookForDetails({ ...selectedBookForDetails, pagesRead: val });
                            }}
                            className="text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Total Pages
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={selectedBookForDetails.totalPages || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              updateBook(selectedBookForDetails.id, {
                                totalPages: val,
                              });
                              setSelectedBookForDetails({
                                ...selectedBookForDetails,
                                totalPages: val,
                              });
                            }}
                            className="text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${getProgressPercentage(selectedBookForDetails)}%`,
                            }}
                          />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-2">
                          {getProgressPercentage(selectedBookForDetails)}% Complete
                        </p>
                      </div>

                      {/* Progress Slider */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={getProgressPercentage(selectedBookForDetails)}
                        onChange={(e) => {
                          const newProgress = parseInt(e.target.value);
                          updateBook(selectedBookForDetails.id, {
                            progress: newProgress,
                          });
                          setSelectedBookForDetails({
                            ...selectedBookForDetails,
                            progress: newProgress,
                          });
                        }}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-3"
                      />
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          updateBook(selectedBookForDetails.id, { rating: i + 1 })
                        }
                        className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            i < selectedBookForDetails.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {selectedBookForDetails.rating > 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedBookForDetails.rating} out of 5 stars
                    </p>
                  )}
                </div>

                {/* Review */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Review
                  </label>
                  <textarea
                    value={selectedBookForDetails.review}
                    onChange={(e) =>
                      updateBook(selectedBookForDetails.id, { review: e.target.value })
                    }
                    placeholder="Write your review..."
                    className="w-full h-32 p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 resize-none font-medium"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedBookForDetails.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          updateBook(selectedBookForDetails.id, {
                            tags: selectedBookForDetails.tags.filter((t) => t !== tag),
                          })
                        }
                        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center gap-2 hover:opacity-75 transition-opacity"
                      >
                        {tag}
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {presetTags
                      .filter((tag) => !selectedBookForDetails.tags.includes(tag))
                      .map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            updateBook(selectedBookForDetails.id, {
                              tags: [...selectedBookForDetails.tags, tag],
                            })
                          }
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setSelectedBookForDetails(null)}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Delete this book?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                The book "{books.find((b) => b.id === deleteConfirm)?.title}" will be
                permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteBook(deleteConfirm)}
                  className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reading Mode Modal */}
        {readingMode && books.find((b) => b.id === readingMode) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 max-w-2xl">
              <button
                onClick={endReadingSession}
                className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-lg transition-colors z-10"
                aria-label="Exit reading mode"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="p-8 space-y-8">
                {/* Reading Header */}
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <BookOpen className="w-12 h-12 text-blue-400" />
                    Reading Mode
                  </h1>
                  <p className="text-slate-400">Focus time for your reading journey</p>
                </div>

                {/* Book Info */}
                <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                  {books.find((b) => b.id === readingMode)?.coverImage && (
                    <img
                      src={books.find((b) => b.id === readingMode)?.coverImage}
                      alt="Book"
                      className="w-32 h-48 object-cover rounded-lg mx-auto shadow-lg"
                    />
                  )}
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">
                      {books.find((b) => b.id === readingMode)?.title}
                    </h2>
                    {books.find((b) => b.id === readingMode)?.readingStreak && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Flame className="w-6 h-6 text-red-500" />
                        <span className="text-2xl font-bold text-red-500">
                          {books.find((b) => b.id === readingMode)?.readingStreak} day streak
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Update */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Update Progress</h3>
                  {books.find((b) => b.id === readingMode)?.totalPages && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-300 block mb-2">
                          Pages Read: {books.find((b) => b.id === readingMode)?.pagesRead || 0}/
                          {books.find((b) => b.id === readingMode)?.totalPages}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max={books.find((b) => b.id === readingMode)?.totalPages || 0}
                          value={books.find((b) => b.id === readingMode)?.pagesRead || 0}
                          onChange={(e) => {
                            const newPages = parseInt(e.target.value);
                            updateBook(readingMode, { pagesRead: newPages });
                          }}
                          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <p className="text-sm text-slate-400 mt-2 text-center">
                          {getProgressPercentage(books.find((b) => b.id === readingMode)!)}% Complete
                        </p>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressPercentage(books.find((b) => b.id === readingMode)!)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reading Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Reading Sessions</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {books.find((b) => b.id === readingMode)?.sessionsRead || 0}
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Current Streak</p>
                    <p className="text-3xl font-bold text-red-500 mt-2">
                      🔥 {books.find((b) => b.id === readingMode)?.readingStreak || 0}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={endReadingSession}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-6 font-semibold text-lg"
                  >
                    End Session
                  </Button>
                  <Button
                    onClick={() => {
                      setReadingMode(null);
                      setSelectedBookForDetails(books.find((b) => b.id === readingMode) || null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 font-semibold text-lg"
                  >
                    Details
                  </Button>
                </div>

                <p className="text-center text-slate-400 text-sm">
                  ✨ Keep up your reading streak! You're making great progress 📚
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
