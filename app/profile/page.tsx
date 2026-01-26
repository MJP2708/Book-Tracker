"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  BookOpen,
  Heart,
  Users,
  Calendar,
  Edit,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

type ProfileData = {
  user: {
    id: string;
    name: string | null;
    email: string;
    bio?: string | null;
    createdAt: string;
  };
  stats: {
    booksRead: number;
    totalPages: number;
    readingStreak: number;
    favoriteGenre?: string | null;
  };
  counts: {
    followers: number;
    following: number;
  };
};

type UserBook = {
  id: string;
  status: string;
  rating?: number | null;
  finishedAt?: string | null;
  createdAt: string;
  book: { title: string; author?: string | null };
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [history, setHistory] = useState<UserBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    void loadProfile();
  }, [session, router]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const [meRes, libraryRes] = await Promise.all([
        fetch("/api/me"),
        fetch("/api/library"),
      ]);

      if (meRes.ok) {
        const data = (await meRes.json()) as ProfileData;
        setProfile(data);
        setBio(data.user.bio ?? "");
      }
      if (libraryRes.ok) {
        const data = (await libraryRes.json()) as UserBook[];
        setHistory(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      if (response.ok) {
        const data = (await response.json()) as ProfileData;
        setProfile(data);
        setBio(data.user.bio ?? "");
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card-bookish mb-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="font-serif-title text-amber-900 dark:text-amber-50">
                      {profile?.user.name ?? session.user?.name ?? "Reader"}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {profile?.user.email ?? session.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSaving && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 dark:text-slate-300">
                    {bio ||
                      "Add a short bio to let others know what you love to read."}
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Joined
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      {profile
                        ? new Date(profile.user.createdAt).toLocaleDateString()
                        : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4 inline mr-1" />
                      Followers
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      {profile?.counts.followers ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <BookOpen className="w-4 h-4 inline mr-1" />
                      Books Read
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      {profile?.stats.booksRead ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <Heart className="w-4 h-4 inline mr-1" />
                      Favorite Genre
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      {profile?.stats.favoriteGenre ?? "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-bookish">
              <h2 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                Reading History
              </h2>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Loading reading history...
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    No books yet. Add your first book to start tracking.
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                    >
                      <div className="w-12 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded book-shadow flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50">
                          {item.book.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {item.book.author ?? "Unknown author"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="badge">{item.status}</span>
                          {item.rating ? (
                            <span>{"*".repeat(item.rating)}</span>
                          ) : null}
                          <span>
                            {item.finishedAt
                              ? `Finished ${new Date(
                                  item.finishedAt
                                ).toLocaleDateString()}`
                              : `Added ${new Date(
                                  item.createdAt
                                ).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card-bookish">
              <h2 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4 text-sm">
                {history.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700 dark:text-slate-300">
                        {item.status === "finished" ? "Finished" : "Updated"}{" "}
                        reading "{item.book.title}"
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {history.length === 0 && !isLoading && (
                  <p className="text-slate-500 dark:text-slate-400">
                    No recent activity yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
