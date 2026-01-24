import { Playfair_Display, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bookshelf - Your Social Reading Platform",
  description: "Connect with readers, share books, track progress, and discover your next favorite read.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} bg-amber-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-amber-50`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
