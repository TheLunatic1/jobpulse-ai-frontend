'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bot, Target, MessageCircle, FileText, TrendingUp, Clock, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'react-toastify';

export default function AICoachPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleStartCoaching = () => {
    if (!isAuthenticated) {
      toast.info("Please login as a Job Seeker to access AI Coach", { theme: 'dark' });
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'jobseeker') {
      toast.warning("AI Coach is available only for Job Seekers", { theme: 'dark' });
      return;
    }
    router.push('/dashboard?view=ai-coach');
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-100 pt-20 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 mb-8 bg-base-200 px-8 py-4 rounded-full border border-primary/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Powered by Grok-3-Mini</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
              Your Personal<br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Career Coach
              </span>
            </h1>

            <p className="text-2xl text-base-content/70 max-w-2xl mx-auto">
              Get instant, personalized career advice, interview preparation, 
              resume feedback, and job matching insights — 24/7.
            </p>
          </motion.div>

          {/* Status / CTA */}
          {!isAuthenticated || user?.role !== 'jobseeker' ? (
            <div className="mb-20 p-16 bg-base-200 rounded-3xl border border-primary/20 text-center">
              <Bot className="w-24 h-24 text-primary mx-auto mb-8" />
              <h3 className="text-4xl font-semibold mb-6">Login as a Job Seeker to use AI Coach</h3>
              <p className="text-xl text-base-content/70 max-w-md mx-auto">
                The AI Career Coach is exclusively available for registered job seekers. 
                Get tailored advice, mock interviews, and smart career strategies.
              </p>
            </div>
          ) : (
            <div className="flex justify-center mb-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleStartCoaching}
                className="btn btn-primary btn-lg text-lg px-14 py-5 rounded-2xl"
              >
                Start AI Coaching Session →
              </motion.button>
            </div>
          )}

          {/* Features - Better spacing & rounded cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Target className="w-14 h-14" />, title: "Personalized Guidance", desc: "Tailored career advice based on your profile and goals" },
              { icon: <MessageCircle className="w-14 h-14" />, title: "Mock Interviews", desc: "Practice with realistic interview simulations" },
              { icon: <FileText className="w-14 h-14" />, title: "Resume Feedback", desc: "Instant AI-powered resume analysis and improvements" },
              { icon: <TrendingUp className="w-14 h-14" />, title: "Job Matching", desc: "Smart recommendations for roles that match your skills" },
              { icon: <Clock className="w-14 h-14" />, title: "24/7 Availability", desc: "Get help anytime, anywhere" },
              { icon: <Star className="w-14 h-14" />, title: "Skill Development", desc: "Learning paths and resources to level up fast" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-base-200 p-12 rounded-3xl border border-base-300 hover:border-primary/40 text-center flex flex-col h-full"
              >
                <div className="text-primary mx-auto mb-8">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-5">{feature.title}</h3>
                <p className="text-base-content/70 flex-1 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}