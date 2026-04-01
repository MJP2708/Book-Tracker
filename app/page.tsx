import { ArrowRight, Flame, Rocket } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/bookshelf/AnimatedSection";
import { RecommendationRail } from "@/components/bookshelf/RecommendationRail";
import { ActivityFeed } from "@/components/bookshelf/ActivityFeed";
import { BookCard } from "@/components/bookshelf/BookCard";
import { AiAssistantCard } from "@/components/bookshelf/AiAssistantCard";
import { StatsOverview } from "@/components/bookshelf/StatsOverview";
import { demoAchievements, demoUser, demoUserBooks } from "@/lib/bookshelf/demo-data";
import {
  getActivityFeed,
  getContinueReading,
  getRecommendations,
  getTrendingBooks,
} from "@/lib/bookshelf/service";

export default function HomePage() {
  const continueReading = getContinueReading();
  const recommendations = getRecommendations();
  const trending = getTrendingBooks();
  const activity = getActivityFeed();

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AnimatedSection className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="glass-card relative overflow-hidden">
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/20" />
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
              <Rocket className="h-3.5 w-3.5" />
              Reading, Social, AI
            </p>
            <h1 className="display-title mt-4 text-3xl leading-tight sm:text-5xl">
              Make Reading Addictive, Social, and Personalized.
            </h1>
            <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-300">
              Bookshelf combines progress tracking, smart recommendations, and community momentum to help you read more and remember more.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/bookshelf" className="primary-btn">
                Open My Bookshelf
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className="secondary-btn">
                Explore Books
              </Link>
            </div>
          </section>

          <AiAssistantCard bookTitle={continueReading?.book.title} />
        </AnimatedSection>

        <AnimatedSection delay={0.06}>
          <StatsOverview profile={demoUser} userBooks={demoUserBooks} streakDays={12} achievements={demoAchievements} />
        </AnimatedSection>

        <AnimatedSection delay={0.12} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="glass-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="display-title text-xl">Continue Reading</h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">Auto-picked from your latest open book.</p>
              </div>
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            {continueReading ? (
              <BookCard book={continueReading.book} progress={continueReading.progress} />
            ) : (
              <p className="text-sm text-stone-500">Start a new book to build your streak.</p>
            )}
          </section>

          <ActivityFeed items={activity.slice(0, 4)} />
        </AnimatedSection>

        <AnimatedSection delay={0.18}>
          <RecommendationRail items={recommendations} />
        </AnimatedSection>

        <AnimatedSection delay={0.24}>
          <section className="glass-card">
            <div className="mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              <h2 className="display-title text-xl">Trending Books</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {trending.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </AnimatedSection>
      </div>
    </main>
  );
}