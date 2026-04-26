import { notFound } from "next/navigation";
import { AiAssistantCard } from "@/components/bookshelf/AiAssistantCard";
import { BookDetailClient } from "@/components/books/BookDetailClient";
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
  const similar = getRecommendations()
    .filter((item) => item.book.id !== book.id)
    .slice(0, 4);

  return (
    <main className="page-shell">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <BookDetailClient book={book} reviews={reviews} similar={similar} />
        <AiAssistantCard bookTitle={book.title} />
      </div>
    </main>
  );
}
