"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { BookOpen, Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials.");
    }

    setIsLoading(false);
  };

  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md space-y-4">
        <div className="mb-2 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
            <BookOpen className="h-3.5 w-3.5" />
            Bookshelf
          </div>
          <p className="display-title text-2xl">Welcome back</p>
          <p className="text-sm text-zinc-500">Sign in with your existing account.</p>
        </div>

        {error && <p className="rounded-xl bg-red-100 p-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-600 dark:text-zinc-300">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="you@example.com"
            />
          </div>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-600 dark:text-zinc-300">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="********"
            />
          </div>
        </label>

        <button type="submit" disabled={isLoading} className="primary-btn w-full">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          New here?{" "}
          <Link href="/auth/signup" className="font-semibold text-cyan-600 hover:text-cyan-700">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
