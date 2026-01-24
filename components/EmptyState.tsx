"use client";

import { BookOpen, Search, Users, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type: "no-books" | "no-posts" | "no-friends" | "no-results" | "no-saved";
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ type, action }: EmptyStateProps) {
  const configs = {
    "no-books": {
      icon: BookOpen,
      title: "Your Library is Empty",
      description: "Start building your library by adding books you want to read.",
      color: "from-amber-500 to-orange-500",
    },
    "no-posts": {
      icon: Sparkles,
      title: "No Posts Yet",
      description:
        "Be the first to share! Post your thoughts about books, share quotes, or update your progress.",
      color: "from-blue-500 to-purple-500",
    },
    "no-friends": {
      icon: Users,
      title: "No Friends Yet",
      description:
        "Follow other readers to see what they're reading and build your reading community.",
      color: "from-pink-500 to-rose-500",
    },
    "no-results": {
      icon: Search,
      title: "No Results Found",
      description: "Try adjusting your search terms or browse by category.",
      color: "from-slate-500 to-gray-500",
    },
    "no-saved": {
      icon: Heart,
      title: "No Saved Posts",
      description: "Save posts you want to read later and they'll appear here.",
      color: "from-red-500 to-pink-500",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mb-6 text-white`}
      >
        <Icon className="w-10 h-10" />
      </div>

      <h3 className="font-serif-subtitle text-slate-900 dark:text-amber-50 mb-2">
        {config.title}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm mb-6">
        {config.description}
      </p>

      {action && (
        <Link href={action.href} className="btn-primary">
          {action.label}
        </Link>
      )}
    </div>
  );
}
