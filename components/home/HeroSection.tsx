"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const liveItems = [
  { title: "Evening chapter room", sub: "2 listeners" },
  { title: "Audiobook discovery", sub: "Launching soon" },
  { title: "New book drop", sub: "First listings this week" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

export function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: "var(--ink)",
        padding: "92px 0 84px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating book-shaped decorations */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "10%", right: "4%",
          width: 90, height: 128, borderRadius: 10,
          background: "rgba(217,146,15,0.06)",
          border: "1px solid rgba(217,146,15,0.13)",
          transform: "rotate(7deg)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{
          position: "absolute", bottom: "14%", left: "2%",
          width: 64, height: 90, borderRadius: 8,
          background: "rgba(122,40,72,0.07)",
          border: "1px solid rgba(122,40,72,0.13)",
          transform: "rotate(-6deg)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        style={{
          position: "absolute", top: "35%", right: "17%",
          width: 44, height: 62, borderRadius: 6,
          background: "rgba(26,96,96,0.07)",
          border: "1px solid rgba(26,96,96,0.13)",
          transform: "rotate(13deg)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <motion.span
              {...fadeUp(0)}
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
            </motion.span>

            <motion.h1
              {...fadeUp(0.1)}
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
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              style={{ margin: 0, color: "rgba(250,248,245,0.62)", fontSize: "15px", lineHeight: 1.7, maxWidth: "560px" }}
            >
              We are just getting started. Track books, join live reads, and explore a simple marketplace while the platform grows with early members.
            </motion.p>

            <motion.div {...fadeUp(0.3)} style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(217,146,15,0.38)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16 }}
                style={{ display: "inline-flex" }}
              >
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
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16 }}
                style={{ display: "inline-flex" }}
              >
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
              </motion.div>
            </motion.div>
          </div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
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
            {liveItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.32 + i * 0.08, ease: "easeOut" }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  cursor: "default",
                  transition: "background-color 0.18s ease",
                }}
              >
                <p style={{ margin: 0, color: "white", fontSize: "13px", fontWeight: 600 }}>{item.title}</p>
                <p style={{ margin: "4px 0 0", color: "rgba(250,248,245,0.52)", fontSize: "11px" }}>{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
