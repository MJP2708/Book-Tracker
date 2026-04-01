import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "Bookshelf – Track, Discover, and Share Books",
    template: "%s | Bookshelf",
  },
  description:
    "Bookshelf helps you track your reading, discover books, and connect with readers worldwide.",
  keywords: [
    "bookshelf",
    "book tracker",
    "reading app",
    "book discovery",
    "reading community",
    "social reading",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Bookshelf – Track, Discover, and Share Books",
    description: "Bookshelf helps you track your reading, discover books, and connect with readers worldwide.",
    siteName: "Bookshelf",
    images: [{ url: "/og-cover.svg", width: 1200, height: 630, alt: "Bookshelf social reading platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookshelf – Track, Discover, and Share Books",
    description: "Bookshelf helps you track your reading, discover books, and connect with readers worldwide.",
    images: ["/og-cover.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-50 text-zinc-900 antialiased transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
