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
                  Connect and Share
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Follow other readers, see what they are reading, share your
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
                  Rate and Review
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
            <p>(c) 2024 Bookshelf. Made for book lovers, by book lovers.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
