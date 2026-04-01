import { AnimatedSection } from "@/components/bookshelf/AnimatedSection";
import { ShelfBoard } from "@/components/bookshelf/ShelfBoard";
import { AiAssistantCard } from "@/components/bookshelf/AiAssistantCard";
import { getContinueReading, getShelfBuckets } from "@/lib/bookshelf/service";

export default function BookshelfPage() {
  const shelves = getShelfBuckets();
  const current = getContinueReading();

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AnimatedSection className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="glass-card">
            <h1 className="display-title text-3xl">My Bookshelf</h1>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Visual shelf management with drag and drop, progress tracking, and quick state updates.
            </p>
          </section>
          <AiAssistantCard bookTitle={current?.book.title} />
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <ShelfBoard initialShelves={shelves} />
        </AnimatedSection>
      </div>
    </main>
  );
}