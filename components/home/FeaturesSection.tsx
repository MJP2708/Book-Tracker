"use client";

import { motion } from "framer-motion";

const features = [
  { title: "Personal tracking", desc: "Log pages and keep momentum with lightweight daily progress." },
  { title: "Live reading rooms", desc: "Host a live reading or listen to one in progress." },
  { title: "Starter marketplace", desc: "Browse an early catalog of books and audiobooks." },
];

export function FeaturesSection() {
  return (
    <section style={{ backgroundColor: "white", padding: "78px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "42px" }}
        >
          <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold2)" }}>
            Early features
          </p>
          <h2
            style={{
              margin: "0 0 10px",
              color: "var(--ink)",
              fontFamily: "var(--font-display), 'Playfair Display', serif",
              fontSize: "36px",
            }}
          >
            Small, clear, and focused.
          </h2>
          <p style={{ margin: 0, color: "var(--ink3)", fontSize: "15px" }}>
            We kept the first version intentionally simple.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px" }}>
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -5, boxShadow: "0 14px 36px rgba(22,16,12,0.09)" }}
              style={{
                border: "1px solid var(--bg3)",
                borderRadius: "14px",
                padding: "22px",
                cursor: "default",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "18px",
                  color: "var(--ink)",
                  fontFamily: "var(--font-display), 'Playfair Display', serif",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ margin: 0, color: "var(--ink3)", fontSize: "13px", lineHeight: 1.7 }}>{feature.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
