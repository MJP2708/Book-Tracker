"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Headphones, ShoppingBag } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live" },
  { href: "/marketplace", label: "Shop" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06]" style={{ background: "#0d0b08", height: "58px" }}>
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--gold2)" }}>
            <Headphones className="h-4 w-4 text-white" />
          </span>
          <span style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
            read<span style={{ color: "var(--gold2)" }}>live</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3.5 py-1.5 text-sm font-medium transition-all duration-150"
                style={{
                  color: active ? "white" : "rgba(255,255,255,0.45)",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/live"
            className="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-150"
            style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", background: "transparent", fontFamily: "var(--font-body)" }}
          >
            <Headphones className="h-3.5 w-3.5" />
            Listen live
          </Link>
          <Link
            href="/marketplace"
            className="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-150"
            style={{ background: "var(--gold2)", color: "white", fontFamily: "var(--font-body)" }}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Shop books
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex items-center justify-center text-white/60 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="absolute left-0 top-[58px] w-full border-t py-4 px-5 md:hidden"
          style={{ background: "#0d0b08", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium"
                  style={{
                    color: active ? "white" : "rgba(255,255,255,0.55)",
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex gap-2">
            <Link
              href="/live"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-md py-2.5 text-center text-sm font-semibold"
              style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-body)" }}
            >
              Listen live
            </Link>
            <Link
              href="/marketplace"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-md py-2.5 text-center text-sm font-semibold"
              style={{ background: "var(--gold2)", color: "white", fontFamily: "var(--font-body)" }}
            >
              Shop books
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
