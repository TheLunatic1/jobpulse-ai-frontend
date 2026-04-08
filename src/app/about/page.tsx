/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from 'framer-motion';
import { Bot, Users, Award, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-7xl font-bold tracking-tight mb-6">
              About <span className="text-primary">JobPulse AI</span>
            </h1>
            <p className="text-2xl text-base-content/70 max-w-2xl mx-auto">
              A modern AI-powered job portal built as a final year project with beautiful design and real features.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl max-w-3xl mx-auto text-base-content/80 leading-relaxed">
              JobPulse AI was created to make job hunting smarter, faster, and more enjoyable. 
              We combine powerful AI coaching, role-based dashboards, and smooth animations 
              to help job seekers and recruiters connect better.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-200 p-10 rounded-3xl border border-base-300 hover:border-primary/30"
            >
              <Bot className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-3xl font-semibold mb-4">AI Career Coach</h3>
              <p className="text-base-content/70">
                24/7 intelligent guidance powered by Grok-3-Mini. Get resume feedback, 
                mock interviews, and personalized career strategies instantly.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-200 p-10 rounded-3xl border border-base-300 hover:border-primary/30"
            >
              <Zap className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-3xl font-semibold mb-4">Beautiful Animations</h3>
              <p className="text-base-content/70">
                Every interaction is smooth and delightful. Built with Framer Motion to 
                make the experience feel premium and modern.
              </p>
            </motion.div>
          </div>

          {/* Tech Stack */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-center mb-12">Built With Modern Technologies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Next.js 15", "Framer Motion", "Tailwind CSS", "DaisyUI",
                "MongoDB", "Express.js", "Socket.IO", "Grok-3-Mini"
              ].map((tech, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-base-200 p-8 rounded-3xl text-center border border-base-300 hover:border-primary/30"
                >
                  <div className="font-semibold text-lg">{tech}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="text-center pt-10">
            <p className="text-2xl font-medium">Made by Salman Toha</p>
            <p className="text-base-content/60 mt-2">Project Showcase</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}