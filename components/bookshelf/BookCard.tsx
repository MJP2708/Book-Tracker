import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Book } from "@/types/bookshelf";

type BookCardProps = {
  book: Book;
  progress?: number;
  reason?: string;
};

export function BookCard({ book, progress, reason }: BookCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/80">
      <Link href={`/books/${book.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-2 p-3">
        <Link href={`/books/${book.id}`} className="line-clamp-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
          {book.title}
        </Link>
        <p className="line-clamp-1 text-xs text-stone-500 dark:text-stone-400">{book.author}</p>

        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            {book.rating.toFixed(1)}
          </span>
          <span>{book.pages} pages</span>
        </div>

        {typeof progress === "number" ? (
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-stone-200 dark:bg-stone-800">
              <div className="h-1.5 rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">{progress}% complete</p>
          </div>
        ) : null}

        {reason ? <p className="text-[11px] text-emerald-700 dark:text-emerald-300">{reason}</p> : null}
      </div>
    </article>
  );
}