import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { getOfflinePublicProfile } from "@/lib/offline-store";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const { userId } = await params;
  const siteUrl = getSiteUrl();

  let user: { name: string | null; bio: string | null; image: string | null } | null = null;

  try {
    const result = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, bio: true, image: true } });
    if (result) user = result;
  } catch {
    const offline = getOfflinePublicProfile(userId);
    if (offline) user = { name: offline.user.name, bio: offline.user.bio, image: offline.user.image };
  }

  if (!user) {
    return { title: "Reader Profile", robots: { index: false, follow: true } };
  }

  const displayName = user.name || "Reader";
  const title = `${displayName}'s Bookshelf`;
  const description = user.bio || `${displayName}'s public reading profile on Bookshelf.`;
  const url = `${siteUrl}/profile/${userId}`;
  const image = user.image || "/og-cover.svg";

  return {
    title,
    description,
    keywords: [displayName, "reader profile", "bookshelf profile", "reading community"],
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export default function PublicProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}