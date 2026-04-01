import { BookCard } from "@/components/bookshelf/BookCard";
import type { BookRecommendation } from "@/types/bookshelf";

type RecommendationRailProps = {
  items: BookRecommendation[];
};

export function RecommendationRail({ items }: RecommendationRailProps) {
  return (
    <section className="glass-card space-y-3">
      <div>
        <h2 className="display-title text-xl">Recommended for You</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Based on your history, genres, and ratings.</p>
      </div>
      <div className="scroll-row">
        {items.map((item) => (
          <div key={item.book.id} className="min-w-[210px] max-w-[210px]">
            <BookCard book={item.book} reason={item.reason} />
          </div>
        ))}
      </div>
    </section>
  );
}