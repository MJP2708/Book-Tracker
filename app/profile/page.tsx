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
import { useState } from "react";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("A passionate reader and book lover.");

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    }
  }, [session, router]);

  const stats = {
    booksRead: 42,
    currentlyReading: 3,
    followers: 128,
    following: 95,
    favoriteGenre: "Literary Fiction",
    joinDate: "Jan 2024",
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Save bio to server
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-amber-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="card-bookish mb-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="font-serif-title text-amber-900 dark:text-amber-50">
                      {session.user?.name}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {session.user?.email}
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

                {/* Bio */}
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
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
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
                  <p className="text-slate-700 dark:text-slate-300">{bio}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Joined
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      {stats.joinDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4 inline mr-1" />
                      Followers
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      {stats.followers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <BookOpen className="w-4 h-4 inline mr-1" />
                      Books Read
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      {stats.booksRead}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <Heart className="w-4 h-4 inline mr-1" />
                      Favorite Genre
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-amber-50">
                      Fiction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            {/* Reading History */}
            <div className="card-bookish">
              <h2 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                📚 Reading History
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                  >
                    <div className="w-12 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded book-shadow flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50">
                        Book Title {item}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Author Name
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="badge">Fiction</span>
                        <span>★★★★★</span>
                        <span>Finished Jan {item}, 2024</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-bookish">
              <h2 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-4">
                ✨ Recent Activity
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Finished reading "The Midnight Library"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700 dark:text-slate-300">
                      Started reading "Atomic Habits"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      1 week ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
