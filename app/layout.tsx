import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { getSiteUrl } from "@/lib/site-url";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

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
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
