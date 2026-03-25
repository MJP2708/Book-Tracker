"use client";

import { Navigation } from "@/components/Navigation";
import { learningPaths } from "@/lib/mock-data";
import { CheckCircle2, Circle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function LearningPathsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const raw = localStorage.getItem("learning-paths");
    if (!raw) return {};

    try {
      return JSON.parse(raw) as Record<string, boolean>;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    localStorage.setItem("learning-paths", JSON.stringify(completed));
  }, [completed]);

  const totalSteps = useMemo(
    () => learningPaths.reduce((acc, path) => acc + path.steps.length, 0),
    []
  );

  const doneCount = Object.values(completed).filter(Boolean).length;

  if (status === "loading") return null;

  return (
    <>
      <Navigation />
      <main className="page-shell">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="glass-card">
            <p className="display-title text-3xl">Structured Learning Paths</p>
            <p className="mt-1 text-sm text-zinc-500">
              Progress: {doneCount} / {totalSteps} steps complete.
            </p>
            <div className="mt-4 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-cyan-500"
                style={{ width: `${totalSteps ? Math.round((doneCount / totalSteps) * 100) : 0}%` }}
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {learningPaths.map((path) => (
              <article key={path.id} className="glass-card">
                <p className="display-title text-2xl">{path.title}</p>
                <p className="mb-4 text-sm text-zinc-500">{path.description}</p>
                <div className="space-y-3">
                  {path.steps.map((step, index) => {
                    const key = `${path.id}-${index}`;
                    const isDone = Boolean(completed[key]);

                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() =>
                          setCompleted((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className="flex w-full items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left transition hover:border-cyan-400 dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        {isDone ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 text-zinc-400" />
                        )}
                        <div>
                          <p className="text-xs uppercase tracking-wide text-zinc-500">Step {index + 1}</p>
                          <p className="font-semibold">{step}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
