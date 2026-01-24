"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BookOpen, Home, Users, User, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 paper-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-amber-600 dark:text-amber-500" />
            <span className="font-serif-title text-amber-900 dark:text-amber-50">
              Bookshelf
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/library"
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Library
                </Link>
                <Link
                  href="/feed"
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Feed
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-2">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/library"
                  className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Library
                </Link>
                <Link
                  href="/feed"
                  className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Feed
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4">
                <Link href="/auth/login" className="btn-secondary flex-1">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary flex-1">
                  Join
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
