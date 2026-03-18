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
  const line1 = useTypingLine('Find Your Dream Job', 70, 300);
  const line2 = useTypingLine('with AI Power', 70, 1700);

  const activeLine = line1.isActive ? 1 : line2.isActive ? 2 : 1;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-base-100 via-base-200/60 to-base-100 bg-size-[300%_300%] animate-[gradient_20s_ease_infinite]" />

      {/* Floating icons – 3× larger, higher opacity, more of them, better positions */}
      <motion.div
        className="absolute top-[12%] left-[8%] text-primary/70 text-[6rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] pointer-events-none"
        animate={{ y: [0, -80, 0], scale: [1, 1.12, 1], rotate: [-12, 12, -12] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'reverse', delay: 0.3 }}
      >
        <Icons.Briefcase />
      </motion.div>

      <motion.div
        className="absolute bottom-[22%] right-[10%] text-primary/68 text-[6rem] sm:text-[9rem] md:text-[12rem] lg:text-[15rem] pointer-events-none"
        animate={{ y: [0, 90, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse', delay: 0.9 }}
      >
        <Icons.Bot />
      </motion.div>

      <motion.div
        className="absolute top-[28%] left-[65%] text-primary/65 text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[13rem] pointer-events-none"
        animate={{ y: [0, -70, 0], rotate: [15, -15] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', delay: 1.8 }}
      >
        <Icons.Star fill="currentColor" />
      </motion.div>

      <motion.div
        className="absolute bottom-[35%] left-[15%] text-primary/72 text-[5.5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] pointer-events-none"
        animate={{ y: [0, 85, 0], scale: [1, 1.1, 1], rotate: [-15, 15, -15] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', delay: 2.5 }}
      >
        <Icons.Heart fill="currentColor" />
      </motion.div>

      <motion.div
        className="absolute top-[55%] right-[18%] text-primary/70 text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem] pointer-events-none"
        animate={{ y: [0, -75, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 17, repeat: Infinity, repeatType: 'reverse', delay: 3.2 }}
      >
        <Icons.Building />
      </motion.div>

      <motion.div
        className="absolute top-[22%] left-[38%] text-primary/68 text-[4.5rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[11rem] pointer-events-none"
        animate={{ y: [0, -60, 0], rotate: [10, -10] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', delay: 0.6 }}
      >
        <Icons.Search />
      </motion.div>

      <motion.div
        className="absolute bottom-[45%] right-[32%] text-primary/72 text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] pointer-events-none"
        animate={{ y: [0, 70, 0], scale: [1, 1.09, 1] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: 'reverse', delay: 1.4 }}
      >
        <Icons.User />
      </motion.div>

      {/* Particles – slightly larger & more visible */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-primary/80 pointer-events-none"
          style={{ top: `${10 + i * 6}%`, left: `${7 + i * 8}%` }}
          animate={{ y: [0, -100 - i * 6, 0], scale: [1, 1.7, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8 + i, repeat: Infinity, repeatType: 'reverse', delay: i * 0.35 }}
        />
      ))}

      {/* Main Content - 2 lines */}
      <motion.div variants={staggerContainer(0.25)} initial="hidden" animate="visible" className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-none mb-6">
          <span className="text-primary block whitespace-nowrap overflow-hidden text-ellipsis min-h-[1.2em]">
            {line1.displayed}
            {activeLine === 1 && <span className="text-primary ml-1 animate-pulse">|</span>}
          </span>

          <span className="bg-linear-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent block min-h-[1.2em]">
            {line2.displayed}
            {activeLine === 2 && <span className="text-primary ml-1 animate-pulse">|</span>}
          </span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-12">
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