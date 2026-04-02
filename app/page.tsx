import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";

export default function LandingPage() {
  return (
    <>
      <AppHeader />
      <main style={{ backgroundColor: "var(--bg)", fontFamily: "var(--font-body), 'DM Sans', sans-serif" }}>
        <section style={{ backgroundColor: "var(--ink)", padding: "92px 0 84px" }}>
          <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    alignItems: "center",
                    backgroundColor: "rgba(217,146,15,0.14)",
                    border: "1px solid rgba(217,146,15,0.35)",
                    color: "var(--gold2)",
                    borderRadius: "999px",
                    padding: "6px 14px",
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  New launch beta
                </span>

                <h1
                  style={{
                    margin: 0,
                    color: "white",
                    fontFamily: "var(--font-display), 'Playfair Display', serif",
                    fontSize: "clamp(30px, 5vw, 52px)",
                    lineHeight: 1.12,
                    fontWeight: 700,
                  }}
                >
                  A fresh home for readers.
                  <br />
                  <span style={{ color: "var(--gold2)", fontStyle: "italic" }}>Built from scratch this season.</span>
                </h1>

                <p style={{ margin: 0, color: "rgba(250,248,245,0.62)", fontSize: "15px", lineHeight: 1.7, maxWidth: "560px" }}>
                  We are just getting started. Track books, join live reads, and explore a simple marketplace while the platform grows with early members.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Link
                    href="/auth/signup"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "13px 24px",
                      borderRadius: "8px",
                      backgroundColor: "var(--gold2)",
                      color: "white",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Create your account
                  </Link>
                  <Link
                    href="/dashboard"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "13px 24px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.35)",
                      color: "white",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Explore the app
                  </Link>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#1b150f",
                  border: "1px solid #3a3026",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <p style={{ margin: 0, color: "var(--gold2)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                  What is live now
                </p>
                {[
                  { title: "Evening chapter room", sub: "2 listeners" },
                  { title: "Audiobook discovery", sub: "Launching soon" },
                  { title: "New book drop", sub: "First listings this week" },
                ].map((item) => (
                  <div key={item.title} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 12px" }}>
                    <p style={{ margin: 0, color: "white", fontSize: "13px", fontWeight: 600 }}>{item.title}</p>
                    <p style={{ margin: "4px 0 0", color: "rgba(250,248,245,0.52)", fontSize: "11px" }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "white", padding: "78px 0" }}>
          <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "42px" }}>
              <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold2)" }}>
                Early features
              </p>
              <h2 style={{ margin: "0 0 10px", color: "var(--ink)", fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "36px" }}>
                Small, clear, and focused.
              </h2>
              <p style={{ margin: 0, color: "var(--ink3)", fontSize: "15px" }}>
                We kept the first version intentionally simple.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px" }}>
              {[
                { title: "Personal tracking", desc: "Log pages and keep momentum with lightweight daily progress." },
                { title: "Live reading rooms", desc: "Host a live reading or listen to one in progress." },
                { title: "Starter marketplace", desc: "Browse an early catalog of books and audiobooks." },
              ].map((feature) => (
                <article key={feature.title} style={{ border: "1px solid var(--bg3)", borderRadius: "14px", padding: "22px" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "var(--ink)", fontFamily: "var(--font-display), 'Playfair Display', serif" }}>{feature.title}</h3>
                  <p style={{ margin: 0, color: "var(--ink3)", fontSize: "13px", lineHeight: 1.7 }}>{feature.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "var(--bg2)", padding: "68px 0" }}>
          <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "22px" }}>
              {[
                { label: "Project stage", value: "Public beta" },
                { label: "Launch window", value: "April 2026" },
                { label: "Core focus", value: "Readers first" },
                { label: "Community size", value: "Growing daily" },
              ].map((stat) => (
                <div key={stat.label} style={{ backgroundColor: "white", border: "1px solid var(--bg3)", borderRadius: "12px", padding: "16px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</p>
                  <p style={{ margin: 0, fontSize: "18px", color: "var(--ink)", fontWeight: 700 }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: "linear-gradient(135deg, #1b130a 0%, #2a1b0d 100%)", padding: "78px 0", textAlign: "center" }}>
          <div style={{ maxWidth: "620px", margin: "0 auto", padding: "0 24px" }}>
            <h2 style={{ margin: "0 0 12px", color: "white", fontFamily: "var(--font-display), 'Playfair Display', serif", fontSize: "36px" }}>
              Join while it is still new.
            </h2>
            <p style={{ margin: "0 0 20px", color: "rgba(250,248,245,0.62)", fontSize: "15px" }}>
              Start your shelf now and help shape the next version.
            </p>
            <Link
              href="/auth/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "13px 26px",
                borderRadius: "8px",
                backgroundColor: "var(--gold2)",
                color: "white",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Start in beta
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}