import { ActivityFeed } from "@/components/bookshelf/ActivityFeed";
import { getActivityFeed } from "@/lib/bookshelf/service";

export default function FeedPage() {
  const activities = getActivityFeed();

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card">
          <h1 className="display-title text-3xl">Activity Feed</h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Track what friends are finishing, rating, and adding.
          </p>
        </section>
        <ActivityFeed items={activities} />
      </div>
    </main>
  );
}