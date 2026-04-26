"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const currentBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    progress: 67,
    pagesLeft: 104,
    bg: "linear-gradient(135deg, #c8813a 0%, #8a4a1a 100%)",
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    progress: 23,
    pagesLeft: 530,
    bg: "linear-gradient(135deg, #8a7a2a 0%, #5a4a10 100%)",
  },
];

export function ContinueReadingSection() {
  return (
    <section style={{ backgroundColor: "var(--bg)", padding: "64px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold2)" }}>
            Continue reading
          </p>
          <h2
            style={{
              margin: 0,
              color: "var(--ink)",
              fontFamily: "var(--font-display), 'Playfair Display', serif",
              fontSize: "26px",
            }}
          >
            Pick up where you left off.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {currentBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(22,16,12,0.1)" }}
              style={{
                backgroundColor: "white",
                border: "1px solid var(--bg3)",
                borderRadius: "14px",
                padding: "18px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                cursor: "pointer",
              }}
            >
              {/* Mini cover */}
              <div
                style={{
                  width: 48,
                  height: 64,
                  borderRadius: "6px",
                  background: book.bg,
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(22,16,12,0.18)",
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{book.title}</p>
                <p style={{ margin: "3px 0 12px", fontSize: "12px", color: "var(--ink3)" }}>{book.author}</p>

                {/* Progress bar */}
                <div style={{ height: 5, borderRadius: 999, backgroundColor: "var(--bg3)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${book.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.1 + 0.35, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 999, backgroundColor: "var(--gold2)" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--ink3)" }}>{book.progress}% complete</span>
                  <span style={{ fontSize: "11px", color: "var(--ink3)" }}>{book.pagesLeft} pages left</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{ marginTop: "20px", textAlign: "right" }}
        >
          <Link
            href="/bookshelf"
            style={{
              fontSize: "13px",
              color: "var(--gold2)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <BookOpen size={14} />
            View full bookshelf
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
