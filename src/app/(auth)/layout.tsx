/* eslint-disable react-hooks/purity */
'use client';   // ← This is the key fix

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// Pre-compute particles once (pure, outside render)
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  initialX: Math.random() * 100,
  initialY: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 10,
}));

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 md:w-2 md:h-2 bg-blue-500/40 rounded-full"
            initial={{
              x: `${p.initialX}vw`,
              y: `${p.initialY}vh`,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-blue-900/30 p-8"
      >
        {children}
      </motion.div>
    </div>
  );
}