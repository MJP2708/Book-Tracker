"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellDot, BookOpenText, Search, Sparkles, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home", icon: BookOpenText },
  { href: "/bookshelf", label: "Bookshelf", icon: Sparkles },
  { href: "/clubs", label: "Book Clubs", icon: Users, hasNotification: true },
  { href: "/search", label: "Search", icon: Search },
];

export function AppHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated" && !!session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-[#d7c5ab]/60 bg-[#f8f1e5]/85 backdrop-blur-lg dark:border-[#3a2d22] dark:bg-[#15100c]/88">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-xl bg-amber-500 p-2 text-[#2f241c]">
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
                  "relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-[#2f241c] text-[#f7ecdd] dark:bg-amber-400 dark:text-[#2f241c]"
                    : "text-stone-700 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.hasNotification ? (
                  <span className="absolute -right-1 -top-1 inline-flex items-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                    <BellDot className="h-3 w-3" />
                  </span>
                ) : null}
              </Link>
            );
          })}
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Link href="/profile/me" className="secondary-btn text-xs">
                {session.user?.name || session.user?.email || "My Profile"}
              </Link>
              <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="primary-btn text-xs">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="secondary-btn text-xs">
                Login
              </Link>
              <Link href="/auth/signup" className="primary-btn text-xs">
                Join Free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}