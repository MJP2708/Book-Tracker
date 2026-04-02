"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Menu, X, Bell } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/shelf", label: "My Shelf" },
  { href: "/discover", label: "Discover" },
  { href: "/clubs", label: "Clubs", hasNotification: true },
  { href: "/stats", label: "Stats" },
  { href: "/profile", label: "Profile" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated" && !!session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      style={{ backgroundColor: "var(--ink)", height: "54px" }}
      className="sticky top-0 z-50 flex items-center"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span
            style={{
              fontFamily: "var(--font-display), 'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "white",
              letterSpacing: "-0.01em",
            }}
          >
            book{" "}
            <span style={{ color: "var(--gold2)" }}>shelf</span>
          </span>
        </Link>

        {/* Center Nav — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-[0.18s]"
                style={{
                  color: active ? "white" : "rgba(250,248,245,0.5)",
                  backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(250,248,245,0.85)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(250,248,245,0.5)";
                }}
              >
                {item.label}
                {item.hasNotification && (
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#ef4444" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-2 md:flex">
          {isSignedIn ? (
            <>
              <Link
                href="/notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:text-white transition-colors duration-[0.18s]"
              >
                <Bell className="h-4 w-4" />
                <span
                  className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "#ef4444" }}
                />
              </Link>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "var(--ink2)",
                  border: "2px solid var(--gold2)",
                  color: "var(--gold2)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {initials}
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-[0.18s]"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.7)",
                  background: "transparent",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-[0.18s]"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.7)",
                  background: "transparent",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-[0.18s]"
                style={{
                  backgroundColor: "var(--gold2)",
                  color: "white",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}
              >
                Join free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex items-center justify-center text-white/70 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute left-0 top-[54px] w-full z-50 border-t py-4 px-4"
          style={{
            backgroundColor: "var(--ink)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-[0.18s]"
                  style={{
                    color: active ? "white" : "rgba(250,248,245,0.6)",
                    backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                  {item.hasNotification && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#ef4444" }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="mt-3 flex gap-2">
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex-1 rounded-md px-3 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--gold2)",
                    color: "white",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-md px-3 py-2 text-center text-sm font-medium"
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-md px-3 py-2 text-center text-sm font-medium"
                    style={{
                      backgroundColor: "var(--gold2)",
                      color: "white",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                    }}
                  >
                    Join free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
