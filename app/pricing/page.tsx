import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Track shelves", "Rate and review", "Follow readers"],
  },
  {
    name: "Premium",
    price: "$9/mo",
    features: ["AI summaries and explainers", "Advanced recommendations", "Premium club analytics"],
  },
];

export default function PricingPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-card text-center">
          <h1 className="display-title text-4xl">Upgrade to Bookshelf Premium</h1>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
            Unlock AI-powered reading tools, advanced insights, and premium-only experiences.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className="glass-card">
              <h2 className="display-title text-2xl">{plan.name}</h2>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-stone-600 dark:text-stone-300">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              {plan.name === "Premium" ? (
                <button className="primary-btn mt-5 w-full">Start Premium</button>
              ) : (
                <Link href="/" className="secondary-btn mt-5 w-full">
                  Continue Free
                </Link>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}