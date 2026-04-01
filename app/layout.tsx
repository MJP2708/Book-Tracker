import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { getSiteUrl } from "@/lib/site-url";
import { AppHeader } from "@/components/layout/AppHeader";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "Bookshelf - Track, Discover, and Share Books",
    template: "%s | Bookshelf",
  },
  description:
    "Bookshelf is a social, AI-powered reading platform to track books, join clubs, and hit your goals.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "https://bookshelf.dekds.com",
  },
  openGraph: {
    type: "website",
    url: "https://bookshelf.dekds.com",
    title: "Bookshelf - Reading, Community, and AI",
    description:
      "Track progress, discover your next read, and discuss books with people who match your taste.",
    siteName: "Bookshelf",
    images: [{ url: "/og-cover.svg", width: 1200, height: 630, alt: "Bookshelf" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookshelf - Reading, Community, and AI",
    description:
      "Track progress, discover your next read, and discuss books with people who match your taste.",
    images: ["/og-cover.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-stone-100 text-stone-900 antialiased transition-colors duration-200 dark:bg-stone-950 dark:text-stone-50">
        <Providers>
          <AppHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}