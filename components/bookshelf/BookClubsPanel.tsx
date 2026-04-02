import { addDays, format } from "date-fns";
import { demoClubs } from "@/lib/bookshelf/demo-data";

export function BookClubsPanel() {
  return (
    <section className="glass-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display-title text-xl">Active Book Clubs</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">Live discussions, deadlines, and momentum.</p>
        </div>
        <span className="rounded-full bg-red-500 px-2 py-1 text-[11px] font-semibold text-white">Live</span>
      </div>

      <div className="space-y-3">
        {demoClubs.map((club, index) => (
          <article key={club.id} className="rounded-xl border border-stone-200 bg-white/80 p-3 dark:border-stone-800 dark:bg-stone-900/80">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{club.name}</p>
              <span className="inline-flex items-center gap-1 text-xs text-red-500">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {index % 2 === 0 ? "12 discussing" : "5 discussing"}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Due {format(addDays(new Date(), 3 + index * 4), "MMM d, yyyy")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}