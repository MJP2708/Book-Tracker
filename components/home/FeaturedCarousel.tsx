"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const books = [
  { id: 1, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", pages: 320, rating: 4.8, bg: "linear-gradient(150deg, #c8813a 0%, #7a4a18 100%)" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", pages: 208, rating: 4.6, bg: "linear-gradient(150deg, #4a7c59 0%, #2a4a32 100%)" },
  { id: 3, title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", pages: 476, rating: 4.9, bg: "linear-gradient(150deg, #2d6a8a 0%, #1a3d52 100%)" },
  { id: 4, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Psychology", pages: 499, rating: 4.5, bg: "linear-gradient(150deg, #7a4a8a 0%, #4a2a5a 100%)" },
  { id: 5, title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", pages: 288, rating: 4.7, bg: "linear-gradient(150deg, #8a4a5a 0%, #5a2a3a 100%)" },
  { id: 6, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", pages: 688, rating: 4.9, bg: "linear-gradient(150deg, #8a7a2a 0%, #5a4a10 100%)" },
  { id: 7, title: "Man's Search for Meaning", author: "Viktor Frankl", genre: "Philosophy", pages: 200, rating: 4.8, bg: "linear-gradient(150deg, #3a5a6a 0%, #1a3040 100%)" },
];

export function FeaturedCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <section style={{ backgroundColor: "white", padding: "72px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold2)" }}>
              Featured picks
            </p>
            <h2
              style={{
                margin: 0,
                color: "var(--ink)",
                fontFamily: "var(--font-display), 'Playfair Display', serif",
                fontSize: "30px",
              }}
            >
              Discover your next read.
            </h2>
          </motion.div>

          <div style={{ display: "flex", gap: "8px" }}>
            {(["left", "right"] as const).map((dir) => (
              <motion.button
                key={dir}
                onClick={() => scroll(dir)}
                whileHover={{ scale: 1.08, borderColor: "var(--gold2)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.14 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid var(--bg3)",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {dir === "left" ? (
                  <ChevronLeft size={15} color="var(--ink2)" />
                ) : (
                  <ChevronRight size={15} color="var(--ink2)" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="carousel-track"
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            cursor: "grab",
            paddingBottom: "4px",
          }}
        >
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: i * 0.055, ease: "easeOut" }}
              onHoverStart={() => setHoveredId(book.id)}
              onHoverEnd={() => setHoveredId(null)}
              style={{ flexShrink: 0, width: 158, scrollSnapAlign: "start" }}
            >
              {/* Cover with overlay preview */}
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 18px 44px rgba(22,16,12,0.24)" }}
                transition={{ duration: 0.22 }}
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: "10px",
                  background: book.bg,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(22,16,12,0.15)",
                  cursor: "pointer",
                }}
              >
                {/* Shine */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(160deg, rgba(255,255,255,0.1) 0%, transparent 55%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Default info at bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "32px 12px 12px",
                    background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, transparent 100%)",
                  }}
                >
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.92)", fontSize: "11px", fontWeight: 700, lineHeight: 1.3 }}>{book.title}</p>
                  <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.58)", fontSize: "10px" }}>{book.author}</p>
                </div>

                {/* Hover preview overlay */}
                <AnimatePresence>
                  {hoveredId === book.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(22,16,12,0.78)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "16px",
                        gap: "6px",
                      }}
                    >
                      <p style={{ margin: 0, color: "white", fontSize: "12px", fontWeight: 700, lineHeight: 1.3 }}>{book.title}</p>
                      <p style={{ margin: 0, color: "rgba(250,248,245,0.62)", fontSize: "11px" }}>{book.author}</p>
                      <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--gold2)",
                            background: "rgba(217,146,15,0.18)",
                            padding: "2px 8px",
                            borderRadius: "999px",
                            border: "1px solid rgba(217,146,15,0.3)",
                          }}
                        >
                          {book.genre}
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "10px", color: "rgba(250,248,245,0.5)" }}>
                        ⭐ {book.rating} · {book.pages} pages
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Below-cover info */}
              <div style={{ marginTop: "10px" }}>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>{book.title}</p>
                <p style={{ margin: "3px 0 0", fontSize: "11px", color: "var(--ink3)" }}>{book.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
