// src/components/Footer.tsx
'use client';

import { motion } from 'motion/react';
import { fadeInUp } from '@/lib/animations';

export default function Footer() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="bg-base-200 py-12 border-t border-base-300/30 mt-auto"
    >
      <div className="container mx-auto px-6 text-center">
        <p className="text-base-content/60">
          © {new Date().getFullYear()} JobPulse AI. Built with passion & heavy animations.
        </p>
        <p className="mt-2 text-sm text-base-content/40">
          This project is part of my portfolio – showing advanced Next.js + Motion animations
        </p>
      </div>
    </motion.footer>
  );
}