"use client";

import { useState } from "react";
import { Sparkles, BookOpen, Share2, Quote } from "lucide-react";

interface CreatePostProps {
  onPost?: (data: { type: string; content: string }) => Promise<void> | void;
}

export function CreatePostForm({ onPost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"post" | "quote" | "progress">(
    "post"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onPost?.({ type: postType, content });
      setContent("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to share your post."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-bookish mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setPostType("post")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              postType === "post"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Post
          </button>
          <button
            type="button"
            onClick={() => setPostType("quote")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              postType === "quote"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            <Quote className="w-4 h-4" />
            Quote
          </button>
          <button
            type="button"
            onClick={() => setPostType("progress")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              postType === "progress"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Progress
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            postType === "quote"
              ? "Share a meaningful quote you loved..."
              : "What are you reading? Share your thoughts..."
          }
          className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
          rows={4}
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-4 h-4" />
            {isSubmitting ? "Sharing..." : "Share"}
          </button>
        </div>
      </form>
    </div>
  );
}
