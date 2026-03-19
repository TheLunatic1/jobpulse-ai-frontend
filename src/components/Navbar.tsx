/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/icons';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Find Jobs', href: '/jobs', icon: Icons.Briefcase },
  { name: 'Companies', href: '/companies', icon: Icons.Building },
  { name: 'AI Coach', href: '/ai-coach', icon: Icons.Bot },
  { name: 'About', href: '/about', icon: null },
];

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 30);
  });

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push('/login');
  };

  // Safe user name display (fallback to "User" if undefined)
  const displayName = user?.name?.split(' ')[0] ?? 'User';

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, type: 'spring', stiffness: 80, damping: 12, delay: 0.3 }}
              whileHover={{ scale: 1.04, filter: 'brightness(1.15)', transition: { duration: 0.4 } }}
              className="text-3xl md:text-3.5xl font-extrabold tracking-tight bg-linear-to-r from-primary via-blue-400 to-primary bg-size-[200%_auto] bg-clip-text text-transparent animate-gradient-x"
            >
              JobPulse AI
            </motion.div>

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

          {/* Auth / User Area – Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className="avatar">
                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? 'User')}&background=random`}
                        alt={user.name ?? 'User'}
                      />
                    </div>
                  </div>
                  <span className="font-medium text-base-content/80">
                    {displayName}
                  </span>
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-base-100 border border-base-300 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Icons.UserCircle className="w-5 h-5" />
                          Dashboard
                        </Link>

                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Icons.UserCircle className="w-5 h-5" />
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-5 py-3 w-full text-left hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <Icons.Logout className="w-5 h-5" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push('/login')}
                  className="btn btn-outline btn-primary px-6"
                >
                  <Icons.Login className="w-4 h-4 mr-2" />
                  Sign In
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push('/register')}
                  className="btn btn-primary px-6 shadow-lg shadow-primary/30"
                >
                  <Icons.Register className="w-4 h-4 mr-2" />
                  Sign Up
                </motion.button>
              </>
            )}
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

              {/* Mobile auth area */}
              <motion.div variants={fadeInUp} className="flex flex-col gap-6 mt-10 w-3/4 max-w-xs">
                {token && user ? (
                  <>
                    <div className="flex items-center gap-4 justify-center">
                      <div className="avatar">
                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? 'User')}&background=random`}
                            alt={user.name ?? 'User'}
                          />
                        </div>
                      </div>
                      <span className="text-xl font-medium">{user.name ?? 'User'}</span>
                    </div>

                    <Link href="/dashboard" className="btn btn-outline btn-primary btn-lg" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>

                    <button className="btn btn-error btn-lg" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-outline btn-primary btn-lg" onClick={() => { setMobileOpen(false); router.push('/login'); }}>
                      Sign In
                    </button>
                    <button className="btn btn-primary btn-lg" onClick={() => { setMobileOpen(false); router.push('/register'); }}>
                      Create Account
                    </button>
                  </>
                )}
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