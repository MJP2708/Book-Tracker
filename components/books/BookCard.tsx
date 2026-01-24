"use client";

import { Book, BookOpen, Star, Calendar } from "lucide-react";
import Link from "next/link";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  status: "unread" | "reading" | "finished";
  rating?: number;
  pagesRead?: number;
  totalPages?: number;
  onAddToLibrary?: () => void;
  onRepost?: () => void;
}

export function BookCard({
  id,
  title,
  author,
  coverImage,
  status,
  rating,
  pagesRead,
  totalPages,
  onAddToLibrary,
  onRepost,
}: BookCardProps) {
  const progress =
    pagesRead && totalPages ? Math.round((pagesRead / totalPages) * 100) : 0;

  const statusColors = {
    unread: "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300",
    reading:
      "bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300 animate-float",
    finished:
      "bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-300",
  };

  return (
    <Link href={`/books/${id}`}>
      <div className="group cursor-pointer h-full">
        <div className="card-bookish flex flex-col h-full hover-lift">
          {/* Book Cover */}
          <div className="relative mb-4 overflow-hidden rounded-lg book-shadow aspect-[3/4] bg-gradient-to-br from-amber-200 to-orange-300">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Book className="w-16 h-16 text-white opacity-50" />
              </div>
            )}

            {/* Status Badge */}
            <div
              className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                statusColors[status]
              }`}
            >
              {status}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 line-clamp-2 mb-1">
              {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {author}
            </p>

            {/* Rating */}
            {rating && (
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {status === "reading" && totalPages && (
              <div className="mb-3">
                <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>
                    {pagesRead} / {totalPages}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToLibrary?.();
                }}
                className="flex-1 px-3 py-2 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRepost?.();
                }}
                className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Share className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Share() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
}
