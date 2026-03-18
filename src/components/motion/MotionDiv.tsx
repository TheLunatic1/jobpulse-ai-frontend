'use client';

import { motion, HTMLMotionProps } from "motion/react";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type MotionDivProps = HTMLMotionProps<"div"> & HTMLAttributes<HTMLDivElement>;

export function MotionDiv({
  children,
  className,
  initial = "hidden",
  whileInView = "visible",
  viewport = { once: true, amount: 0.25 },
  ...props
}: MotionDivProps) {
  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}