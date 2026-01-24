"use client";

import { Heart, MessageCircle2, Bookmark, Share2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PostCardProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: "post" | "repost" | "quote";
  book?: {
    title: string;
    author: string;
    coverImage?: string;
  };
  content?: string;
  createdAt: Date;
  likes: number;
  comments: number;
  isLiked?: boolean;
  onLike?: () => void;
}

export function PostCard({
  id,
  author,
  type,
  book,
  content,
  createdAt,
  likes,
  comments,
  isLiked = false,
  onLike,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const getTypeLabel = () => {
    switch (type) {
      case "repost":
        return "🔄 Reposted";
      case "quote":
        return "💬 Shared a quote";
      default:
        return "📝 Posted";
    }
  };

  return (
    <div className="card-bookish animate-slideIn hover:shadow-xl transition-shadow">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <Link href={`/profile/${author.id}`}>
            <h3 className="font-semibold text-slate-900 dark:text-amber-50 hover:text-amber-600 dark:hover:text-amber-400">
              {author.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getTypeLabel()} • {createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Book Display */}
      {book && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-slate-700 rounded-lg border-l-4 border-amber-500">
          <div className="flex gap-3">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-12 h-16 object-cover rounded book-shadow"
              />
            )}
            <div>
              <p className="font-serif-subtitle text-amber-900 dark:text-amber-50 line-clamp-2">
                {book.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                by {book.author}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {content && (
        <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
          {content}
        </p>
      )}

      {/* Interaction Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 hover:text-red-500 transition-colors group"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              liked ? "fill-current text-red-500" : "group-hover:scale-110"
            }`}
          />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <MessageCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">{comments}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors ml-auto">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
