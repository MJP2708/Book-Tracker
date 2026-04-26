"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1b130a 0%, #2a1b0d 100%)",
        padding: "78px 0",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "0 24px" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            margin: "0 0 12px",
            color: "white",
            fontFamily: "var(--font-display), 'Playfair Display', serif",
            fontSize: "36px",
          }}
        >
          Join while it is still new.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          style={{ margin: "0 0 24px", color: "rgba(250,248,245,0.62)", fontSize: "15px" }}
        >
          Start your shelf now and help shape the next version.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.04, boxShadow: "0 10px 32px rgba(217,146,15,0.42)" }}
          whileTap={{ scale: 0.97 }}
          style={{ display: "inline-flex" }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
