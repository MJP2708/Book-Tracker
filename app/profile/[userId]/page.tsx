import Image from "next/image";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/bookshelf/BookCard";
import { demoUser, demoUserBooks } from "@/lib/bookshelf/demo-data";
import { getBookById } from "@/lib/bookshelf/service";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;

  if (userId !== demoUser.id && userId !== "me") {
    notFound();
  }

  const publicFinished = demoUserBooks
    .filter((item) => item.shelf === "finished")
    .map((item) => ({ ...item, book: getBookById(item.bookId) }))
    .filter((item) => Boolean(item.book));

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card grid gap-4 sm:grid-cols-[84px_1fr]">
          <Image
            src={demoUser.avatarUrl}
            alt={demoUser.displayName}
            width={84}
            height={84}
            className="rounded-2xl object-cover"
          />
          <div>
            <h1 className="display-title text-3xl">{demoUser.displayName}</h1>
            <p className="text-sm text-stone-500">@{demoUser.handle}</p>
            <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">{demoUser.bio}</p>
          </div>
        </section>

        <section className="glass-card">
          <h2 className="display-title text-xl">Public Finished Shelf</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {publicFinished.map((entry) => (
              <BookCard key={entry.id} book={entry.book!} progress={entry.progress} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}