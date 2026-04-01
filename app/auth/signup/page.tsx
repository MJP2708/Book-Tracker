"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Chrome, Rocket } from "lucide-react";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const signup = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!signup.ok) {
      const payload = (await signup.json().catch(() => ({}))) as { error?: string };
      setError(payload.error || "Sign-up failed");
      setIsLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      name,
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(`Sign-up failed: ${result.error}`);
      return;
    }

    router.push("/dashboard");
  }

  async function signInGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <>
      <Navigation />
      <main className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <section className="glass-card w-full max-w-md space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="display-title text-3xl">Start your learning OS</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Create your account with your name and email.
            </p>
          </div>
          <form className="space-y-3 text-left" onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Your name"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-cyan-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
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
              minLength={6}
              placeholder="Create password"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-cyan-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button type="submit" className="primary-btn w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
            <button type="button" className="secondary-btn w-full" onClick={() => void signInGoogle()}>
              <Chrome className="h-4 w-4" />Continue with Google
            </button>
            {error ? <p className="text-center text-sm text-rose-500">{error}</p> : null}
          </form>
          <p className="text-sm text-zinc-500">
            Already have an account? <Link className="text-cyan-600" href="/auth/login">Sign in</Link>
          </p>
        </section>
      </main>
    </>
  );
}
