"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { BookOpen } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
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
            <p className="mt-2 text-sm text-zinc-500">
              Sign in with Google to sync your learning shelves.
            </p>
          </div>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="primary-btn w-full"
          >
            Continue with Google
          </button>
          <p className="text-sm text-zinc-500">
            New here? <Link className="text-cyan-600" href="/auth/signup">Create account</Link>
          </p>
        </section>
      </main>
    </>
  );
}
