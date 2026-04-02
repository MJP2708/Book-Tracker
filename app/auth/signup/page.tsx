"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setMessage(payload.error || "Unable to create account.");
      setLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    setLoading(false);

    if (!signInResult || signInResult.error) {
      setMessage("Account created. Please sign in.");
      return;
    }

    window.location.href = signInResult.url || "/";
  };

  const signupWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="page-shell">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md items-center px-4 py-10">
        <section className="glass-card w-full space-y-4">
          <div>
            <h1 className="display-title text-3xl">Create Account</h1>
            <p className="mt-1 text-sm text-stone-500">Start tracking, reviewing, and joining clubs.</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Display name"
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring dark:border-stone-700 dark:bg-stone-900"
            />
            <button disabled={loading} className="primary-btn w-full">
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <button type="button" onClick={signupWithGoogle} className="secondary-btn w-full">
            Continue with Google
          </button>

          {message ? <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p> : null}

          <p className="text-xs text-stone-500">
            Already have an account? <Link href="/auth/login" className="text-emerald-700 dark:text-emerald-300">Sign in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}