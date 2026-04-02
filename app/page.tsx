import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";

export default function LandingPage() {
  return (
    <>
      <AppHeader />
      <main style={{ backgroundColor: "var(--bg)", fontFamily: "var(--font-body), 'DM Sans', sans-serif" }}>

        {/* ── Hero ── */}
        <section style={{ backgroundColor: "var(--ink)", padding: "80px 0 72px" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "56px",
                alignItems: "center",
              }}
            >
              {/* Left */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Badge */}
                <span
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "var(--gold3)",
                    color: "var(--gold2)",
                    borderRadius: "999px",
                    padding: "5px 14px",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                  }}
                >
                  ✦ Now with AI-powered reading
                </span>

                {/* H1 */}
                <h1
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', serif",
                    fontSize: "clamp(28px, 5vw, 42px)",
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.18,
                    margin: 0,
                  }}
                >
                  The reading app that{" "}
                  <span style={{ color: "var(--gold2)", fontStyle: "italic" }}>actually</span> keeps you reading.
                </h1>

                {/* Subtitle */}
                <p style={{ fontSize: "14px", color: "rgba(250,248,245,0.6)", margin: 0, lineHeight: 1.7 }}>
                  Track every page, join reading clubs, and get AI-powered insights — all in one place.
                </p>

                {/* CTAs */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Link
                    href="/auth/signup"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "var(--gold2)",
                      color: "white",
                      borderRadius: "8px",
                      padding: "13px 26px",
                      fontSize: "14px",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                      transition: "all 0.18s ease",
                    }}
                  >
                    Start for free →
                  </Link>
                  <Link
                    href="/dashboard"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "transparent",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "8px",
                      padding: "13px 26px",
                      fontSize: "14px",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                      transition: "all 0.18s ease",
                    }}
                  >
                    See the app
                  </Link>
                </div>

                {/* Social proof */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ display: "flex" }}>
                    {[
                      { label: "AL", bg: "#1a6060" },
                      { label: "MR", bg: "#7a2848" },
                      { label: "JK", bg: "#4a2d8a" },
                      { label: "SL", bg: "#1e5c1e" },
                    ].map((av, i) => (
                      <div
                        key={av.label}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: av.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "white",
                          marginLeft: i === 0 ? 0 : "-8px",
                          border: "2px solid var(--ink)",
                          position: "relative",
                          zIndex: 4 - i,
                        }}
                      >
                        {av.label}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(250,248,245,0.5)" }}>
                    Loved by 48,000+ readers worldwide
                  </span>
                </div>
              </div>

              {/* Right — mockup card */}
              <div
                style={{
                  backgroundColor: "#1e1812",
                  border: "1px solid #3d332a",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Traffic lights */}
                <div style={{ display: "flex", gap: "6px" }}>
                  {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                    <span key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: c, display: "inline-block" }} />
                  ))}
                </div>

                {/* Label */}
                <p style={{ margin: 0, fontSize: "10px", color: "var(--gold2)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Currently Reading
                </p>

                {/* Books */}
                {[
                  { bg: "#1a5c3a", emoji: "🪐", title: "Project Hail Mary", author: "Andy Weir", pct: 67 },
                  { bg: "#2d1a5c", emoji: "🌌", title: "Dune", author: "Frank Herbert", pct: 34 },
                ].map((book) => (
                  <div key={book.title} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        backgroundColor: book.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        flexShrink: 0,
                      }}
                    >
                      {book.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {book.title}
                      </p>
                      <p style={{ margin: "2px 0 6px", fontSize: "11px", color: "rgba(250,248,245,0.45)" }}>{book.author}</p>
                      <div style={{ height: "4px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${book.pct}%`, borderRadius: "999px", backgroundColor: "var(--gold2)" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--gold2)", fontWeight: 600, flexShrink: 0 }}>{book.pct}%</span>
                  </div>
                ))}

                {/* Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["🔥 12-day streak", "📚 3 clubs", "✦ AI ready"].map((pill) => (
                    <span
                      key={pill}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "white",
                        borderRadius: "999px",
                        padding: "4px 10px",
                        fontSize: "10px",
                        fontWeight: 500,
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ backgroundColor: "white", padding: "80px 0" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", color: "var(--gold2)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 12px" }}>
                Everything You Need
              </p>
              <h2 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "36px", fontWeight: 700, color: "var(--ink)", margin: "0 0 12px" }}>
                Built for serious readers.
              </h2>
              <p style={{ fontSize: "15px", color: "var(--ink3)", margin: 0, maxWidth: "540px", marginLeft: "auto", marginRight: "auto" }}>
                Everything you need to read more, understand better, and connect with like-minded readers.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                { bg: "#e3f4f4", emoji: "📊", title: "Smart Progress Tracking", desc: "Log pages with a slider, set daily targets, and watch your streak build day by day." },
                { bg: "#fef3e2", emoji: "🤖", title: "AI Reading Assistant", desc: "Ask Claude anything about your book — summaries, explanations, themes, and recommendations." },
                { bg: "#fce8f0", emoji: "👥", title: "Book Clubs", desc: "Create or join clubs, discuss chapters, set reading deadlines together." },
                { bg: "#f0ebfe", emoji: "📈", title: "Deep Analytics", desc: "Heatmaps, genre breakdowns, pages per month — understand how you really read." },
                { bg: "#e8f5e8", emoji: "🌐", title: "Community Feed", desc: "Share reviews, follow readers with similar taste, discover what's trending." },
                { bg: "#fef3e2", emoji: "🏆", title: "Challenges & Badges", desc: "Join reading challenges, earn badges, and hit your yearly goal." },
              ].map((feat) => (
                <div
                  key={feat.title}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--bg3)",
                    borderRadius: "14px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    transition: "all 0.18s ease",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: feat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    {feat.emoji}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "16px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--ink3)", margin: 0, lineHeight: 1.65 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section style={{ backgroundColor: "var(--ink)", padding: "48px 0" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "32px",
                textAlign: "center",
              }}
            >
              {[
                { num: "48K", label: "Active Readers" },
                { num: "2.1M", label: "Books Tracked" },
                { num: "340+", label: "Book Clubs" },
                { num: "4.9★", label: "App Store Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    style={{
                      fontFamily: "var(--font-display), 'Playfair Display', serif",
                      fontSize: "36px",
                      fontWeight: 700,
                      color: "var(--gold2)",
                      margin: "0 0 6px",
                    }}
                  >
                    {stat.num}
                  </p>
                  <p style={{ fontSize: "12px", color: "rgba(250,248,245,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ backgroundColor: "var(--bg2)", padding: "80px 0" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", color: "var(--gold2)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 12px" }}>
                Testimonials
              </p>
              <h2 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "36px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                Readers love it.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {[
                { quote: "I've tried every reading app. Bookshelf is the first one that actually stuck.", name: "Sarah M.", sub: "Reading 52 books in 2026" },
                { quote: "The AI assistant is wild. I was totally lost in Moby Dick and it helped me understand everything.", name: "James K.", sub: "Book club moderator" },
                { quote: "My reading streak is at 47 days. I've never been this consistent in my life.", name: "Priya R.", sub: "Avid reader · Pro member" },
              ].map((t) => (
                <div
                  key={t.name}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--bg3)",
                    borderRadius: "14px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ color: "var(--gold2)", fontSize: "15px", letterSpacing: "2px" }}>★★★★★</div>
                  <p style={{ fontSize: "14px", color: "var(--ink2)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: "var(--ink)", margin: "0 0 2px" }}>{t.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--ink3)", margin: 0 }}>{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section style={{ backgroundColor: "white", padding: "80px 0" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", color: "var(--gold2)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 12px" }}>
                Pricing
              </p>
              <h2 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "36px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                Simple pricing.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", alignItems: "start" }}>
              {[
                {
                  name: "Free",
                  price: "$0",
                  sub: "Perfect for casual readers",
                  popular: false,
                  features: [
                    { ok: true, text: "Track up to 20 books" },
                    { ok: true, text: "3 shelves" },
                    { ok: true, text: "Basic stats" },
                    { ok: false, text: "AI assistant" },
                    { ok: false, text: "Analytics" },
                    { ok: false, text: "Priority support" },
                  ],
                  cta: "Get started free",
                  ctaHref: "/auth/signup",
                },
                {
                  name: "Pro",
                  price: "$6",
                  sub: "For serious readers",
                  popular: true,
                  features: [
                    { ok: true, text: "Unlimited books" },
                    { ok: true, text: "All shelf types" },
                    { ok: true, text: "Full analytics" },
                    { ok: true, text: "AI assistant" },
                    { ok: true, text: "Priority support" },
                    { ok: true, text: "Early features" },
                  ],
                  cta: "Start Pro free",
                  ctaHref: "/auth/signup?plan=pro",
                },
                {
                  name: "Club",
                  price: "$18",
                  sub: "For reading groups",
                  popular: false,
                  features: [
                    { ok: true, text: "Everything in Pro" },
                    { ok: true, text: "Unlimited clubs" },
                    { ok: true, text: "Group analytics" },
                    { ok: true, text: "Club AI summaries" },
                    { ok: true, text: "Admin tools" },
                    { ok: true, text: "White-label option" },
                  ],
                  cta: "Start Club trial",
                  ctaHref: "/auth/signup?plan=club",
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  style={{
                    position: "relative",
                    backgroundColor: "white",
                    border: plan.popular ? "1.5px solid var(--gold2)" : "1px solid var(--bg3)",
                    borderRadius: "14px",
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    marginTop: plan.popular ? "20px" : "0",
                  }}
                >
                  {plan.popular && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-14px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "var(--gold3)",
                        color: "var(--gold2)",
                        borderRadius: "999px",
                        padding: "4px 14px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      MOST POPULAR
                    </span>
                  )}
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--ink)", margin: "0 0 4px" }}>{plan.name}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                      <span style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "32px", fontWeight: 700, color: "var(--ink)" }}>{plan.price}</span>
                      <span style={{ fontSize: "12px", color: "var(--ink3)" }}>/mo</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--ink3)", margin: "4px 0 0" }}>{plan.sub}</p>
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {plan.features.map((f) => (
                      <li key={f.text} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: f.ok ? "var(--ink2)" : "var(--ink3)" }}>
                        <span style={{ fontWeight: 700, color: f.ok ? "var(--grn)" : "var(--ink3)" }}>{f.ok ? "✓" : "—"}</span>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.ctaHref}
                    style={{
                      display: "block",
                      textAlign: "center",
                      backgroundColor: plan.popular ? "var(--gold2)" : "transparent",
                      color: plan.popular ? "white" : "var(--ink2)",
                      border: plan.popular ? "none" : "1px solid var(--bg3)",
                      borderRadius: "8px",
                      padding: "11px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                      transition: "all 0.18s ease",
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section
          style={{
            background: "linear-gradient(135deg, #1e1408 0%, #2d1e0e 50%, #1a1208 100%)",
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display), 'Playfair Display', serif",
                fontSize: "36px",
                fontWeight: 700,
                color: "white",
                margin: 0,
              }}
            >
              Start reading smarter.
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(250,248,245,0.6)", margin: 0 }}>
              Join 48,000 readers who track their books, beat their goals, and read more — every single day.
            </p>
            <Link
              href="/auth/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "var(--gold2)",
                color: "white",
                borderRadius: "8px",
                padding: "14px 30px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                transition: "all 0.18s ease",
              }}
            >
              Start reading smarter — it&apos;s free →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ backgroundColor: "var(--ink)", padding: "40px 24px" }}>
          <div
            style={{
              maxWidth: "1160px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "32px",
              alignItems: "start",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-display), 'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "white",
                }}
              >
                book <span style={{ color: "var(--gold2)" }}>shelf</span>
              </span>
              <p style={{ fontSize: "12px", color: "rgba(250,248,245,0.4)", margin: "10px 0 0", lineHeight: 1.6 }}>
                The reading app for people who take their books seriously.
              </p>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/search", label: "Discover" },
                { href: "/clubs", label: "Book Clubs" },
                { href: "/pricing", label: "Pricing" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: "13px", color: "rgba(250,248,245,0.5)", textDecoration: "none", transition: "color 0.18s ease" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p style={{ fontSize: "12px", color: "rgba(250,248,245,0.3)", margin: 0 }}>
              © 2026 Bookshelf. All rights reserved.
            </p>
          </div>
        </footer>

      </main>
    </>
  );
}
