import Link from "next/link";
import { demoClubs } from "@/lib/bookshelf/demo-data";
import { getBookById } from "@/lib/bookshelf/service";

export default function ClubsPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="display-title text-3xl">Book Clubs</h1>
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                Create public or private clubs, invite members, and discuss by thread.
              </p>
            </div>
            <button className="primary-btn">Create Club</button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {demoClubs.map((club) => {
            const currentBook = club.currentBookId ? getBookById(club.currentBookId) : null;
            return (
              <article key={club.id} className="glass-card space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="display-title text-xl">{club.name}</h2>
                  <span className="rounded-full bg-stone-200 px-2 py-1 text-[11px] dark:bg-stone-800">{club.visibility}</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-300">{club.description}</p>
                <p className="text-xs text-stone-500">{club.memberCount} members</p>
                {currentBook ? (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Current read: {currentBook.title}</p>
                ) : null}
                <div className="flex gap-2">
                  <button className="secondary-btn text-xs">Join</button>
                  <Link href={`/api/clubs/${club.id}/threads`} className="secondary-btn text-xs">
                    Threads API
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}