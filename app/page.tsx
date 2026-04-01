import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { ArrowRight, BookOpen, Flame, Route } from "lucide-react";

export const metadata: Metadata = {
  title: "Bookshelf – Track, Discover, and Share Books",
  description: "Bookshelf helps you track your reading, discover books, and connect with readers worldwide.",
  keywords: ["bookshelf", "book tracker", "reading app", "social reading"],
  alternates: { canonical: "https://bookshelf.dekds.com/" },
  openGraph: {
    title: "Bookshelf – Track, Discover, and Share Books",
    description: "Bookshelf helps you track your reading, discover books, and connect with readers worldwide.",
    url: "https://bookshelf.dekds.com/",
    images: [{ url: "/og-cover.svg", width: 1200, height: 630, alt: "Bookshelf social reading platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookshelf – Track, Discover, and Share Books",
    description: "Bookshelf helps you track your reading, discover books, and connect with readers worldwide.",
    images: ["/og-cover.svg"],
  },
};

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <main className="page-shell">
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="animate-rise space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
              <BookOpen className="h-3.5 w-3.5" />
              Personalized learning for Gen Z
            </p>
            <h1 className="display-title text-4xl leading-tight sm:text-6xl">
              Your Knowledge, Organized Like Netflix
            </h1>
            <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-300">
              Build smart shelves, track progress, and follow clear paths from curiosity to mastery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/signup" className="primary-btn">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/login" className="secondary-btn">
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="glass-card">
              <div className="mb-3 flex items-center justify-between">
                <p className="display-title text-xl">Recommended for You</p>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="scroll-row">
                {[
                  "Atomic Habits",
                  "Deep Work",
                  "The Lean Startup",
                  "Show Your Work",
                ].map((title) => (
                  <div key={title} className="min-w-[170px] rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800">
                    <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-sky-300 to-cyan-500" />
                    <p className="text-sm font-semibold">{title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <div className="mb-3 flex items-center gap-2">
                <Route className="h-5 w-5 text-cyan-500" />
                <p className="display-title text-xl">Learning Paths</p>
              </div>
              <ol className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <li>1. Rich Dad Poor Dad</li>
                <li>2. Atomic Habits</li>
                <li>3. The Lean Startup</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
