"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Drop-in replacement for elements that use premium-card / bs-card classes.
 * Apply the card class directly to HoverCard so CSS hover transforms
 * don't stack with Framer Motion's transform.
 *
 * Usage:
 *   <HoverCard className="premium-card p-5">...</HoverCard>
 */
export function HoverCard({ children, className }: Props) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(22,16,12,0.12)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
