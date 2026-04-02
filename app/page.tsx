import Link from "next/link";
import { ArrowRight, BookMarked, Sparkles, Trophy } from "lucide-react";
import { AnimatedSection } from "@/components/bookshelf/AnimatedSection";
import { ActivityFeed } from "@/components/bookshelf/ActivityFeed";
import { AiAssistantCard } from "@/components/bookshelf/AiAssistantCard";
import { BookCard } from "@/components/bookshelf/BookCard";
import { BookClubsPanel } from "@/components/bookshelf/BookClubsPanel";
import { DiscoverTabs } from "@/components/bookshelf/DiscoverTabs";
import { QuoteOfDay } from "@/components/bookshelf/QuoteOfDay";
import { ReadingMoodSelector } from "@/components/bookshelf/ReadingMoodSelector";
import { StatsOverview } from "@/components/bookshelf/StatsOverview";
import { demoAchievements, demoBooks, demoUser, demoUserBooks } from "@/lib/bookshelf/demo-data";
import { getActivityFeed, getContinueReading, getRecommendations, getTrendingBooks } from "@/lib/bookshelf/service";

export default function HomePage() {
  const continueReading = getContinueReading();
  const recommendations = getRecommendations();
  const trending = getTrendingBooks();
  const activity = getActivityFeed();

  const finishedThisYear = demoUserBooks.filter((entry) => entry.shelf === "finished").length;
  const yearlyProgress = Math.min(100, Math.round((finishedThisYear / demoUser.yearlyGoal) * 100));

  const newReleases = [...demoBooks].filter((book) => (book.publishedYear ?? 0) >= 2020);
  const classics = [...demoBooks].filter((book) => book.genres.includes("Classics") || (book.publishedYear ?? 9999) < 1980);

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AnimatedSection className="hero-panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-10 -top-8 h-36 w-36 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-xs font-semibold text-amber-200">
                <BookMarked className="h-3.5 w-3.5" />
                Editorial Reading Experience
              </p>
              <h1 className="display-title text-4xl leading-tight sm:text-6xl">Where Readers Build Taste Together.</h1>
              <p className="max-w-2xl text-sm text-[#d7c4a7] sm:text-base">
                Track your books, join live conversations, and ask AI deeper questions that actually help you remember what you read.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/bookshelf" className="primary-btn">
                  Open My Shelf
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/clubs" className="secondary-btn border-amber-200/30 bg-transparent text-amber-100 hover:bg-amber-100/10 dark:border-amber-200/30 dark:bg-transparent dark:text-amber-100">
                  Join a Club
                </Link>
              </div>
            </div>

            <div className="glow-bar grid gap-4 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-200/80">Readers</p>
                <p className="display-title text-3xl">28.4k</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-200/80">Books Finished</p>
                <p className="display-title text-3xl">412k</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-200/80">Club Threads</p>
                <p className="display-title text-3xl">9.1k</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.06} className="glass-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                <Trophy className="h-4 w-4" />
                2026 Reading Challenge
              </p>
              <h2 className="display-title text-3xl">{finishedThisYear} / {demoUser.yearlyGoal} books completed</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                You are ahead of {Math.max(0, Math.round((yearlyProgress - 25) * 1.4))}% of readers this month.
              </p>
            </div>
            <span className="rounded-full bg-[#2f241c] px-3 py-1 text-sm font-semibold text-[#f5e9d3] dark:bg-amber-400 dark:text-[#2f241c]">
              {yearlyProgress}% progress
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" style={{ width: `${yearlyProgress}%` }} />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <StatsOverview profile={demoUser} userBooks={demoUserBooks} streakDays={12} achievements={demoAchievements} />
        </AnimatedSection>

        <AnimatedSection delay={0.14} className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <ReadingMoodSelector />
            <QuoteOfDay />
            <BookClubsPanel />
          </div>
          <AiAssistantCard bookTitle={continueReading?.book.title} />
        </AnimatedSection>

        <AnimatedSection delay={0.18}>
          <DiscoverTabs trending={trending} forYou={recommendations} newReleases={newReleases} classics={classics} />
        </AnimatedSection>

        <AnimatedSection delay={0.22} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="display-title text-2xl">Continue Reading</h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">Pick up exactly where you left off.</p>
              </div>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            {continueReading ? (
              <BookCard book={continueReading.book} progress={continueReading.progress} />
            ) : (
              <p className="text-sm text-stone-500">Start a new book to build your streak.</p>
            )}
          </section>

          <ActivityFeed items={activity.slice(0, 5)} />
        </AnimatedSection>
      </div>
    </main>
  );
}