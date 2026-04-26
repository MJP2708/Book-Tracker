"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Books tracked", value: 2400, suffix: "+" },
  { label: "Active readers", value: 180, suffix: "+" },
  { label: "Reading clubs", value: 42, suffix: "" },
  { label: "Reviews written", value: 950, suffix: "+" },
];

function AnimatedNumber({ value, duration = 1.4 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isInView, value, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export function AnimatedStatsSection() {
  return (
    <section style={{ backgroundColor: "white", padding: "72px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "44px" }}
        >
          <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold2)" }}>
            Growing together
          </p>
          <h2
            style={{
              margin: 0,
              color: "var(--ink)",
              fontFamily: "var(--font-display), 'Playfair Display', serif",
              fontSize: "32px",
            }}
          >
            Built by readers, for readers.
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "18px" }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: i * 0.09, ease: "easeOut" }}
              whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(22,16,12,0.08)" }}
              style={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--bg3)",
                borderRadius: "14px",
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "36px",
                  color: "var(--ink)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display), 'Playfair Display', serif",
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.09em" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
