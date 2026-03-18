import type { Variants } from "motion/react";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const staggerContainer = (
  staggerChildren = 0.2,
  delayChildren = 0.1,
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren: delayChildren || 0,
    },
  },
});

export const scaleHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export const glowHover: Variants = {
  rest: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
  hover: {
    boxShadow: "0 0 30px 10px rgba(59, 130, 246, 0.4)",
    transition: { duration: 0.4 },
  },
};