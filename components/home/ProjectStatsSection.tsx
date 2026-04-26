"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Project stage", value: "Public beta" },
  { label: "Launch window", value: "April 2026" },
  { label: "Core focus", value: "Readers first" },
  { label: "Community size", value: "Growing daily" },
];

export function ProjectStatsSection() {
  return (
    <section style={{ backgroundColor: "var(--bg2)", padding: "68px 0" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "22px" }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              style={{
                backgroundColor: "white",
                border: "1px solid var(--bg3)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <p style={{ margin: "0 0 6px", fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {stat.label}
              </p>
              <p style={{ margin: 0, fontSize: "18px", color: "var(--ink)", fontWeight: 700 }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
