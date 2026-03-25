"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Rocket } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
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
              Create your account instantly using Google.
            </p>
          </div>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="primary-btn w-full"
          >
            Sign up with Google
          </button>
          <p className="text-sm text-zinc-500">
            Already have an account? <Link className="text-cyan-600" href="/auth/login">Sign in</Link>
          </p>
        </section>
      </main>
    </>
  );
}
