// src/components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/icons';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

function useTypingLine(text: string, speed = 68, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setIsActive(true), startDelay);

    let timer: NodeJS.Timeout;
    if (!isActive) return () => clearTimeout(start);

    const current = text;

    if (!isDeleting) {
      if (displayed.length < current.length) {
        timer = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 3200);
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 1.7);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setDisplayed('');
        }, 700);
      }
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, isActive, text, speed, startDelay]);

  return { displayed, isActive };
}

export default function HeroSection() {
  const line1 = useTypingLine('Find Your Dream Job', 70, 600);
  const line2 = useTypingLine('with AI Power', 70, 1700);

  const activeLine = line1.isActive ? 1 : line2.isActive ? 2 : 1;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-base-100 via-base-200/60 to-base-100 bg-size-[300%_300%] animate-[gradient_20s_ease_infinite]" />

      {/* Floating icons */}
      <motion.div className="absolute top-[10%] left-[7%] text-primary/55 text-8xl md:text-[10rem] pointer-events-none" animate={{ y: [0, -65, 0], scale: [1, 1.1, 1], rotate: [-10, 10, -10] }} transition={{ duration: 13, repeat: Infinity, repeatType: 'reverse', delay: 0.4 }}>
        <Icons.Briefcase />
      </motion.div>
      <motion.div className="absolute bottom-[20%] right-[12%] text-primary/52 text-9xl md:text-[12rem] pointer-events-none" animate={{ y: [0, 75, 0], scale: [1, 1.12, 1] }} transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', delay: 1.1 }}>
        <Icons.Bot />
      </motion.div>
      <motion.div className="absolute top-[35%] left-[65%] text-primary/48 text-7xl md:text-9xl pointer-events-none" animate={{ y: [0, -55, 0], rotate: [12, -12] }} transition={{ duration: 17, repeat: Infinity, repeatType: 'reverse', delay: 2 }}>
        <Icons.Star fill="currentColor" />
      </motion.div>

      {/* Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-primary/70 pointer-events-none"
          style={{ top: `${12 + i * 7}%`, left: `${8 + i * 9}%` }}
          animate={{ y: [0, -90, 0], scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7 + i, repeat: Infinity, repeatType: 'reverse', delay: i * 0.4 }}
        />
      ))}

      {/* Main Content - Exactly 2 clean lines */}
      <motion.div variants={staggerContainer(0.25)} initial="hidden" animate="visible" className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none mb-6">
          
          {/* Line 1 */}
          <span className="text-primary block whitespace-nowrap min-h-[1.2em]">
            {line1.displayed}
            {activeLine === 1 && <span className="text-primary ml-1 animate-pulse">|</span>}
          </span>

          {/* Line 2 */}
          <span className="bg-linear-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent block min-h-[1.2em]">
            {line2.displayed}
            {activeLine === 2 && <span className="text-primary ml-1 animate-pulse">|</span>}
          </span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-base-content/80 max-w-3xl mx-auto mb-12">
          AI-powered matching • 24/7 career coach • Smart resume tools • Interview simulator
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button whileHover={{ scale: 1.08 }} className="btn btn-primary btn-lg px-12 text-lg">Explore Jobs</motion.button>
          <motion.button whileHover={{ scale: 1.06 }} className="btn btn-outline btn-primary btn-lg px-12 text-lg">Talk to AI Coach</motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}