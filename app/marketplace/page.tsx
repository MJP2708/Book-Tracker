"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  title: string;
  creator: string;
  type: "book" | "audiobook";
  format: string;
  priceCents: number;
  summary: string;
  coverEmoji: string;
};

export default function MarketplacePage() {
  const { status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [type, setType] = useState<"all" | "book" | "audiobook">("all");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Item[]>([]);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  if (status === "unauthenticated") router.push("/auth/login");
  if (status === "loading") return null;

  const load = async (nextType: string, nextQ: string) => {
    const params = new URLSearchParams();
    params.set("type", nextType);
    if (nextQ.trim()) params.set("q", nextQ.trim());
    const res = await fetch(`/api/marketplace/items?${params.toString()}`);
    const payload = (await res.json()) as { items: Item[] };
    setItems(payload.items || []);
  };

  useEffect(() => {
    void load(type, q);
  }, [type, q]);

  const totalCents = useMemo(() => cart.reduce((sum, item) => sum + item.priceCents, 0), [cart]);

  const purchase = async (item: Item) => {
    setBuyingId(item.id);
    const res = await fetch("/api/marketplace/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.id,
        quantity: 1,
        totalCents: item.priceCents,
        kind: item.type,
      }),
    });
    const payload = (await res.json()) as { error?: string; fulfillment?: { note?: string } };
    if (res.ok) {
      setMessage(`Order completed in demo mode. ${payload.fulfillment?.note || ""}`.trim());
      setCart((prev) => prev.filter((entry) => entry.id !== item.id));
    } else {
      setMessage(payload.error || "Checkout failed");
    }
    setBuyingId(null);
  };

  return (
    <>
      <AppHeader />
      <main className="page-fade min-h-screen bg-[var(--bg)] pb-10">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[3fr_1.25fr] lg:px-8">
          <section className="space-y-5">
            <article className="premium-card overflow-hidden bg-[var(--ink)] p-5 text-white sm:p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--gold2)]">Marketplace</p>
              <p className="font-display mt-2 text-3xl">Buy Books & Audiobooks</p>
              <p className="mt-2 text-sm text-white/70">A newly launched catalog with hand-picked books and audiobooks.</p>
            </article>

            <article className="premium-card p-4">
              <div className="flex flex-wrap gap-2 text-sm">
                {["all", "book", "audiobook"].map((value) => (
                  <button key={value} onClick={() => setType(value as typeof type)} className={`rounded-full px-3 py-1 ${type === value ? "bg-[var(--ink)] text-white" : "border border-[var(--bg3)] text-[var(--ink2)]"}`}>{value[0].toUpperCase() + value.slice(1)}</button>
                ))}
              </div>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or creator" className="mt-3 w-full rounded-lg border border-[var(--gold2)] px-3 py-2 text-sm" />
            </article>

            <section className="grid gap-4 sm:grid-cols-2">
              {items.length === 0 && (
                <article className="premium-card p-4 sm:col-span-2">
                  <p className="font-display text-xl">No listings yet</p>
                  <p className="mt-1 text-sm text-[var(--ink3)]">The marketplace is ready, but there is no usage history or existing listings yet.</p>
                </article>
              )}
              {items.map((item) => (
                <article key={item.id} className="premium-card p-4">
                  <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--teal2)] to-[var(--gold2)] text-4xl">{item.coverEmoji}</div>
                  <p className="font-display text-xl">{item.title}</p>
                  <p className="text-sm text-[var(--ink3)]">{item.creator}</p>
                  <p className="mt-2 text-xs text-[var(--ink3)]">{item.type} • {item.format}</p>
                  <p className="mt-2 text-sm text-[var(--ink2)]">{item.summary}</p>
                  <p className="font-display mt-1 text-xl">${(item.priceCents / 100).toFixed(2)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="premium-btn-outline" onClick={() => setCart((prev) => prev.find((entry) => entry.id === item.id) ? prev : [...prev, item])}>Add to cart</button>
                    <button className="premium-btn-primary" onClick={() => void purchase(item)} disabled={buyingId === item.id}>{buyingId === item.id ? "Processing..." : "Buy now"}</button>
                  </div>
                </article>
              ))}
            </section>
          </section>

          <aside className="h-fit space-y-4 lg:sticky lg:top-20">
            <article className="premium-card p-4 sm:p-5">
              <p className="font-display text-2xl">Cart</p>
              <div className="mt-3 space-y-2">
                {cart.length === 0 && <p className="text-sm text-[var(--ink3)]">No items yet.</p>}
                {cart.map((item) => (
                  <div key={item.id} className="rounded-lg border border-[var(--bg3)] p-2 text-sm">
                    <p className="font-medium text-[var(--ink2)]">{item.title}</p>
                    <p className="text-xs text-[var(--ink3)]">${(item.priceCents / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-[var(--bg3)] pt-3 text-sm">
                <div className="flex items-center justify-between"><span>Total</span><span className="font-semibold">${(totalCents / 100).toFixed(2)}</span></div>
              </div>
            </article>

            <article className="premium-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--ink3)]">Demo Checkout</p>
              <p className="mt-2 text-sm text-[var(--ink2)]">Payments and fulfillment run in demo mode while the store is in launch phase.</p>
            </article>

            {message && <p className="text-sm text-[var(--grn)]">{message}</p>}
          </aside>
        </div>
      </main>
    </>
  );
}
