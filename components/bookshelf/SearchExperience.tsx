"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/components/bookshelf/BookCard";
import { useDebouncedValue } from "@/lib/bookshelf/use-debounced-value";
import type { Book } from "@/types/bookshelf";

type SearchExperienceProps = {
  initialBooks: Book[];
};

export function SearchExperience({ initialBooks }: SearchExperienceProps) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [maxPages, setMaxPages] = useState("");
  const [results, setResults] = useState<Book[]>(initialBooks);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (genre) params.set("genre", genre);
      if (rating) params.set("rating", rating);
      if (maxPages) params.set("maxPages", maxPages);

      const response = await fetch(`/api/books?${params.toString()}`);
      const data = await response.json();
      setResults(data.books ?? []);
      setLoading(false);
    };

    fetchResults();
  }, [debouncedQuery, genre, rating, maxPages]);

  return (
    <section className="space-y-4">
      <div className="glass-card grid gap-3 md:grid-cols-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, author, or description"
          className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
        />
        <input
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
          placeholder="Genre"
          className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
        />
        <input
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          placeholder="Min rating"
          className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
        />
        <input
          value={maxPages}
          onChange={(event) => setMaxPages(event.target.value)}
          placeholder="Max pages"
          className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
        />
      </div>

      {loading ? <p className="text-sm text-stone-500">Searching...</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}