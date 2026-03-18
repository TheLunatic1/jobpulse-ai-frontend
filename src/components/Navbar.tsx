'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/icons';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Find Jobs', href: '/jobs', icon: Icons.Briefcase },
  { name: 'Companies', href: '/companies', icon: Icons.Building },
  { name: 'AI Coach', href: '/ai-coach', icon: Icons.Bot },
  { name: 'About', href: '/about', icon: null },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 30);
  });

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, type: 'spring', stiffness: 100 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'py-3 bg-base-100/80 backdrop-blur-xl border-b border-base-300/40 shadow-xl'
            : 'py-5 bg-transparent'
        )}
      >
        <div className="container mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* ────────────────────────────────
              Improved Logo – cleaner & more premium
          ──────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.1,
                type: 'spring',
                stiffness: 80,
                damping: 12,
                delay: 0.3,
              }}
              whileHover={{
                scale: 1.04,
                filter: 'brightness(1.15)',
                transition: { duration: 0.4 },
              }}
              className="text-3xl md:text-3.5xl font-extrabold tracking-tight bg-linear-to-r from-primary via-blue-400 to-primary bg-size-[200%_auto] bg-clip-text text-transparent animate-gradient-x"
            >
              JobPulse AI
            </motion.div>

            {/* subtle glow ring on hover */}
            <motion.div
              className="absolute -inset-2 rounded-full bg-linear-to-r from-primary/20 to-blue-500/20 opacity-0 blur-xl pointer-events-none"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 120 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center gap-2 text-base-content/80 hover:text-primary transition-all duration-300 text-lg font-medium relative"
                >
                  {item.icon && <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />}
                  <span>{item.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary to-blue-400 transition-all duration-400 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Auth buttons – desktop */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="btn btn-outline btn-primary px-6"
            >
              <Icons.Login className="w-4 h-4 mr-2" />
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="btn btn-primary px-6 shadow-lg shadow-primary/30"
            >
              <Icons.Register className="w-4 h-4 mr-2" />
              Sign Up
            </motion.button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-3xl focus:outline-none z-50 relative"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icons.Close />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icons.Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-base-100/95 backdrop-blur-xl lg:hidden pt-24"
          >
            <motion.nav
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-10 text-2xl font-semibold pt-10"
            >
              {navItems.map((item) => (
                <motion.div key={item.name} variants={fadeInUp}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 hover:text-primary transition-colors"
                  >
                    {item.icon && <item.icon className="w-7 h-7" />}
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-6 mt-10 w-3/4 max-w-xs"
              >
                <button className="btn btn-outline btn-primary btn-lg">
                  Sign In
                </button>
                <button className="btn btn-primary btn-lg">
                  Create Account
                </button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prevent content jump */}
      <div className="h-20 lg:h-24" />
    </>
  );
}