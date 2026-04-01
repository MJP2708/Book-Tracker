import type { Achievement, UserBook, UserProfile } from "@/types/bookshelf";

type StatsOverviewProps = {
  profile: UserProfile;
  userBooks: UserBook[];
  streakDays: number;
  achievements: Achievement[];
};

export function StatsOverview({ profile, userBooks, streakDays, achievements }: StatsOverviewProps) {
  const finished = userBooks.filter((item) => item.shelf === "finished").length;
  const unlocked = achievements.filter((item) => item.unlocked).length;

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className="glass-card">
        <p className="text-xs uppercase tracking-wide text-stone-500">Monthly Goal</p>
        <p className="mt-2 text-2xl font-semibold">{finished}/{profile.monthlyGoal}</p>
      </article>
      <article className="glass-card">
        <p className="text-xs uppercase tracking-wide text-stone-500">Yearly Goal</p>
        <p className="mt-2 text-2xl font-semibold">{finished}/{profile.yearlyGoal}</p>
      </article>
      <article className="glass-card">
        <p className="text-xs uppercase tracking-wide text-stone-500">Reading Streak</p>
        <p className="mt-2 text-2xl font-semibold">{streakDays} days</p>
      </article>
      <article className="glass-card">
        <p className="text-xs uppercase tracking-wide text-stone-500">Achievements</p>
        <p className="mt-2 text-2xl font-semibold">{unlocked}/{achievements.length}</p>
      </article>
    </section>
  );
}