import Link from "next/link";

const demoThreads = [
  { id: "thread_01", title: "Project Hail Mary - Chapter 4 theory", replies: 18 },
  { id: "thread_02", title: "Best quote this week", replies: 11 },
  { id: "thread_03", title: "Should we pace 50 pages per week?", replies: 7 },
];

export default function DiscussionsPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="display-title text-3xl">Discussions</h1>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Book-by-book threads for clubs and public readers.
            </p>
          </div>
          <button className="primary-btn">Create Thread</button>
        </section>

        <section className="space-y-3">
          {demoThreads.map((thread) => (
            <article key={thread.id} className="glass-card">
              <h2 className="display-title text-lg">{thread.title}</h2>
              <p className="mt-1 text-xs text-stone-500">{thread.replies} replies</p>
              <Link href="/api/discussions" className="secondary-btn mt-3 text-xs">
                Discussions API
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}