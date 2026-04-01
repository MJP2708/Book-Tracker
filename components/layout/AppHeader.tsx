"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Search, Sparkles, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: BookOpenText },
  { href: "/bookshelf", label: "Bookshelf", icon: Sparkles },
  { href: "/clubs", label: "Book Clubs", icon: Users },
  { href: "/search", label: "Search", icon: Search },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-stone-50/85 backdrop-blur-lg dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-xl bg-emerald-700 p-2 text-stone-50 dark:bg-emerald-400 dark:text-stone-900">
            <BookOpenText className="h-4 w-4" />
          </span>
          <div>
            <p className="display-title text-sm leading-tight sm:text-base">Bookshelf</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">bookshelf.dekds.com</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900"
                    : "text-stone-600 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <Link href="/auth/login" className="secondary-btn text-xs">
            Login
          </Link>
          <Link href="/auth/signup" className="primary-btn text-xs">
            Join Free
          </Link>
        </nav>
      </div>
    </header>
  );
}