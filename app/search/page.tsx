import { SearchExperience } from "@/components/bookshelf/SearchExperience";
import { demoBooks } from "@/lib/bookshelf/demo-data";

export default function SearchPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card">
          <h1 className="display-title text-3xl">Search</h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Instant debounced search with filters for genre, rating, and length.
          </p>
        </section>

        <SearchExperience initialBooks={demoBooks} />
      </div>
    </main>
  );
}