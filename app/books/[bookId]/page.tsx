import { notFound } from "next/navigation";
import { AiAssistantCard } from "@/components/bookshelf/AiAssistantCard";
import { BookCard } from "@/components/bookshelf/BookCard";
import { getBookById, getRecommendations, getReviewsByBookId } from "@/lib/bookshelf/service";

type PageProps = {
  params: Promise<{ bookId: string }>;
};

export default async function BookDetailsPage({ params }: PageProps) {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) {
    notFound();
  }

  const reviews = getReviewsByBookId(book.id);
  const similar = getRecommendations().filter((item) => item.book.id !== book.id).slice(0, 4);

  return (
    <main className="page-shell">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section className="space-y-6">
          <div className="glass-card grid gap-6 sm:grid-cols-[220px_1fr]">
            <BookCard book={book} />
            <div className="space-y-4">
              <div>
                <h1 className="display-title text-3xl">{book.title}</h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">{book.author}</p>
              </div>
              <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{book.description}</p>
              <div className="flex flex-wrap gap-2">
                {book.genres.map((genre) => (
                  <span key={genre} className="rounded-full bg-stone-200 px-3 py-1 text-xs dark:bg-stone-800">
                    {genre}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="primary-btn">Add to Shelf</button>
                <button className="secondary-btn">Rate 1-5</button>
                <button className="secondary-btn">Like</button>
              </div>
            </div>
          </div>

          <section className="glass-card space-y-4">
            <h2 className="display-title text-xl">Reader Reviews</h2>
            {reviews.map((review) => (
              <article key={review.id} className="rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                <p className="text-sm text-stone-700 dark:text-stone-200">{review.body}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {review.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="glass-card space-y-4">
            <h2 className="display-title text-xl">Similar Books</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((item) => (
                <BookCard key={item.book.id} book={item.book} reason={item.reason} />
              ))}
            </div>
          </section>
        </section>

        <AiAssistantCard bookTitle={book.title} />
      </div>
    </main>
  );
}