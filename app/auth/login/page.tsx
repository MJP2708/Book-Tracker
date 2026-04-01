"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { BookOpen, Chrome } from "lucide-react";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });
    setIsLoading(false);

    if (result?.error) {
      setError(`Sign-in failed: ${result.error}`);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    router.push(params.get("from") || "/dashboard");
  }

  async function signInGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <>
      <Navigation />
      <main className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <section className="glass-card w-full max-w-md space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="display-title text-3xl">Welcome to Bookshelf</h1>
            <p className="mt-2 text-sm text-zinc-500">Sign in with email/password or Google.</p>
          </div>
          <form className="space-y-3 text-left" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-cyan-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Your password"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-cyan-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button type="submit" className="primary-btn w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Continue with Email"}
            </button>
            <button type="button" className="secondary-btn w-full" onClick={() => void signInGoogle()}>
              <Chrome className="h-4 w-4" />Continue with Google
            </button>
            {error ? <p className="text-center text-sm text-rose-500">{error}</p> : null}
          </form>
          <p className="text-sm text-zinc-500">
            New here? <Link className="text-cyan-600" href="/auth/signup">Create account</Link>
          </p>
        </section>
      </main>
    </>
  );
}
