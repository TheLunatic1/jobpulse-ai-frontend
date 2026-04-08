'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Column 1 - Logo & Description */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-4xl font-bold bg-linear-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                JobPulse AI
              </span>
            </Link>
            <p className="text-base-content/70 max-w-md text-lg leading-relaxed">
              The smartest AI-powered job platform in Bangladesh. 
              Connecting talent with opportunity through beautiful design and intelligent technology.
            </p>

            <p className="mt-8 text-sm text-base-content/50">
              Built with passion as a Final Year Project • 2026
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h4 className="font-semibold text-base-content mb-6 text-lg">Platform</h4>
            <div className="space-y-4 text-base-content/70">
              <Link href="/jobs" className="block hover:text-primary transition-colors">Find Jobs</Link>
              <Link href="/companies" className="block hover:text-primary transition-colors">Companies</Link>
              <Link href="/ai-coach" className="block hover:text-primary transition-colors">AI Career Coach</Link>
              <Link href="/about" className="block hover:text-primary transition-colors">About Us</Link>
            </div>
          </motion.div>

          {/* For Job Seekers */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h4 className="font-semibold text-base-content mb-6 text-lg">Job Seekers</h4>
            <div className="space-y-4 text-base-content/70">
              <Link href="/dashboard?view=my-applications" className="block hover:text-primary transition-colors">My Applications</Link>
              <Link href="/ai-coach" className="block hover:text-primary transition-colors">Talk to AI Coach</Link>
              <Link href="/jobs" className="block hover:text-primary transition-colors">Browse All Jobs</Link>
            </div>
          </motion.div>

          {/* For Employers & Admin */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h4 className="font-semibold text-base-content mb-6 text-lg">For Employers</h4>
            <div className="space-y-4 text-base-content/70">
              <Link href="/dashboard?view=post-job" className="block hover:text-primary transition-colors">Post a Job</Link>
              <Link href="/dashboard?view=my-postings" className="block hover:text-primary transition-colors">My Postings</Link>
            </div>

            <div className="mt-10">
              <h4 className="font-semibold text-base-content mb-6 text-lg">Connect With Us</h4>
              <div className="flex gap-6 text-3xl text-base-content/60">
                <motion.a whileHover={{ y: -4 }} href="#" className="hover:text-primary transition-colors"><Icons.Send /></motion.a>
                <motion.a whileHover={{ y: -4 }} href="#" className="hover:text-primary transition-colors"><Icons.Bot /></motion.a>
                <motion.a whileHover={{ y: -4 }} href="#" className="hover:text-primary transition-colors"><Icons.UserCircle /></motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-base-300 text-center text-sm text-base-content/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p>© {new Date().getFullYear()} JobPulse AI. All Rights Reserved.</p>
          <p className="text-xs">
            Made by Salman Toha using Next.js, Tailwind CSS, and Framer Motion.
          </p>
          <p className="text-xs text-primary hover:underline cursor-pointer">
            Salman Toha • Portfolio Project
          </p>
        </motion.div>
      </div>
    </footer>
  );
}