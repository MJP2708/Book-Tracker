import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";

export default function LandingPage() {
  return (
    <>
      <PublicHeader />
      <main style={{ backgroundColor: "var(--bg)", fontFamily: "var(--font-body), 'DM Sans', sans-serif" }}>

        {/* ── Hero ── */}
        <section style={{ background: "linear-gradient(180deg, #0d0b08 0%, #1a1208 100%)", padding: "96px 0 88px" }}>
          <div
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              padding: "0 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(217,146,15,0.15)",
                color: "var(--gold2)",
                border: "1px solid rgba(217,146,15,0.3)",
                borderRadius: "999px",
                padding: "6px 16px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              🎙 Live sessions streaming now
            </span>

            <h1
              style={{
                fontFamily: "var(--font-display), 'Playfair Display', serif",
                fontSize: "clamp(32px, 6vw, 56px)",
                fontWeight: 700,
                color: "white",
                lineHeight: 1.12,
                margin: 0,
              }}
            >
              Listen to books read live.<br />
              <span style={{ color: "var(--gold2)", fontStyle: "italic" }}>Buy the ones you love.</span>
            </h1>

            <p style={{ fontSize: "15px", color: "rgba(250,248,245,0.55)", margin: 0, maxWidth: "540px", lineHeight: 1.75 }}>
              Join live reading sessions hosted by passionate readers, then shop books and audiobooks right from the platform. No account needed.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <Link
                href="/live"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "var(--gold2)",
                  color: "white",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                }}
              >
                🎙 Browse live sessions
              </Link>
              <Link
                href="/marketplace"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "transparent",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                }}
              >
                📚 Shop books
              </Link>
            </div>

            <p style={{ fontSize: "12px", color: "rgba(250,248,245,0.3)", margin: 0 }}>Free to browse · No account needed</p>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ backgroundColor: "white", padding: "80px 0" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", color: "var(--gold2)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 12px" }}>
                What we offer
              </p>
              <h2 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "36px", fontWeight: 700, color: "var(--ink)", margin: "0 0 12px" }}>
                Two ways to experience books.
              </h2>
              <p style={{ fontSize: "15px", color: "var(--ink3)", margin: 0, maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
                Watch someone read a book live, then buy your own copy — all in one place.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {[
                {
                  bg: "#fef3e2",
                  emoji: "🎙",
                  title: "Live Reading Sessions",
                  desc: "Tune in to real-time sessions where hosts read aloud from their favourite books. Ask questions, follow along, and discover your next read.",
                  href: "/live",
                  cta: "Watch live →",
                },
                {
                  bg: "#e3f4f4",
                  emoji: "📚",
                  title: "Book & Audiobook Shop",
                  desc: "Browse thousands of titles — physical books, ebooks, and audiobooks. Instant digital delivery, no subscription required.",
                  href: "/marketplace",
                  cta: "Shop now →",
                },
                {
                  bg: "#f0ebfe",
                  emoji: "🎧",
                  title: "Instant Listening",
                  desc: "Purchase any audiobook and stream it directly in your browser — no app download, no waiting. Start listening in seconds.",
                  href: "/marketplace",
                  cta: "Browse audiobooks →",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--bg3)",
                    borderRadius: "14px",
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      backgroundColor: feat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    {feat.emoji}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "17px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--ink3)", margin: 0, lineHeight: 1.7, flex: 1 }}>{feat.desc}</p>
                  <Link
                    href={feat.href}
                    style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold2)", textDecoration: "none" }}
                  >
                    {feat.cta}
                  </Link>
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
                { num: "120+", label: "Live sessions hosted" },
                { num: "8,000+", label: "Titles in the shop" },
                { num: "4.8★", label: "Average rating" },
                { num: "Free", label: "To browse & listen" },
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

        {/* ── How It Works ── */}
        <section style={{ backgroundColor: "var(--bg2)", padding: "80px 0" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ fontSize: "11px", color: "var(--gold2)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 12px" }}>
                How it works
              </p>
              <h2 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "36px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                Simple as opening a book.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px" }}>
              {[
                { step: "01", title: "Browse live sessions", desc: "See who's reading right now. Pick a session that interests you and tune in instantly — no sign-up required." },
                { step: "02", title: "Discover a great book", desc: "Loved what you heard? Find it in the shop. Physical, ebook, or audiobook — choose your format." },
                { step: "03", title: "Read or listen immediately", desc: "Digital orders are ready in seconds. Physical books shipped next-day. Audiobooks stream directly in browser." },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display), 'Playfair Display', serif",
                      fontSize: "48px",
                      fontWeight: 700,
                      color: "var(--gold2)",
                      opacity: 0.25,
                      lineHeight: 1,
                    }}
                  >
                    {item.step}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "17px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--ink3)", margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section
          style={{
            background: "linear-gradient(135deg, #1a1208 0%, #2d1e0e 60%, #1a1208 100%)",
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "620px", margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display), 'Playfair Display', serif",
                fontSize: "36px",
                fontWeight: 700,
                color: "white",
                margin: 0,
              }}
            >
              Tune in to a live session now.
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(250,248,245,0.55)", margin: 0 }}>
              No account needed. Just click and listen.
            </p>
            <Link
              href="/live"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--gold2)",
                color: "white",
                borderRadius: "8px",
                padding: "14px 30px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              🎙 Browse live sessions →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ backgroundColor: "var(--ink)", padding: "40px 24px" }}>
          <div
            style={{
              maxWidth: "1160px",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ maxWidth: "240px" }}>
              <span
                style={{
                  fontFamily: "var(--font-display), 'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "white",
                }}
              >
                read<span style={{ color: "var(--gold2)" }}>live</span>
              </span>
              <p style={{ fontSize: "12px", color: "rgba(250,248,245,0.4)", margin: "10px 0 0", lineHeight: 1.65 }}>
                Live reading sessions and an independent book shop — all in one place.
              </p>
            </div>
            <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { href: "/", label: "Home" },
                { href: "/live", label: "Live" },
                { href: "/marketplace", label: "Shop" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: "13px", color: "rgba(250,248,245,0.5)", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p style={{ fontSize: "12px", color: "rgba(250,248,245,0.3)", margin: 0, alignSelf: "flex-end" }}>
              © 2026 readlive. All rights reserved.
            </p>
          </div>
        </footer>

      </main>
    </>
  );
}
