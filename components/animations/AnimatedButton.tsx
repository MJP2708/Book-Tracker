"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = HTMLMotionProps<"button">;

export function AnimatedButton({ children, className, ...props }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.1 }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
