"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BookOpen, Brain, LayoutDashboard, Library, MessageSquare, Route, Rss, User, Users } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggle").then((mod) => mod.ThemeToggle),
  { ssr: false }
);

const signedInLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/bookshelf", label: "Bookshelf", icon: Library },
  { href: "/knowledge", label: "Knowledge", icon: Brain },
  { href: "/clubs", label: "Clubs", icon: Users },
  { href: "/discussions", label: "Discussions", icon: MessageSquare },
  { href: "/learning-paths", label: "Learning Paths", icon: Route },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navigation() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-zinc-50/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-cyan-500 p-2 text-white">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="display-title text-base leading-none">Bookshelf</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">The Netflix of Knowledge</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              {signedInLinks.map((item) => (
                <Link key={item.href} href={item.href} className="secondary-btn text-xs">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <ThemeToggle />
              <button onClick={() => signOut()} className="secondary-btn text-xs">
                Logout
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link href="/auth/login" className="secondary-btn text-xs">
                Sign In
              </Link>
              <Link href="/auth/signup" className="primary-btn text-xs">
                Get Started
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="secondary-btn px-3 md:hidden"
        >
          Menu
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2 border-t border-zinc-200 p-4 md:hidden dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <button onClick={() => signOut()} className="secondary-btn">
                Logout
              </button>
            ) : null}
          </div>
          {session ? (
            signedInLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="secondary-btn w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link href="/auth/login" className="secondary-btn w-full justify-start">
                Sign In
              </Link>
              <Link href="/auth/signup" className="primary-btn w-full justify-start">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
