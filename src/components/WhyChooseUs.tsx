'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/icons';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Icons.Bot,
    title: "AI-Powered Matching",
    description: "Get jobs that actually fit your skills — 96% match accuracy powered by advanced AI.",
    color: "text-primary",
  },
  {
    icon: Icons.User,
    title: "24/7 AI Career Coach",
    description: "Chat anytime for resume tips, interview prep, salary negotiation, and career guidance.",
    color: "text-blue-400",
  },
  {
    icon: Icons.Star,
    title: "Smart Resume Builder",
    description: "Create ATS-friendly resumes in minutes with AI suggestions and instant scoring.",
    color: "text-green-400",
  },
  {
    icon: Icons.Clock,
    title: "Interview Simulator",
    description: "Practice real interviews with AI feedback on answers, tone, and confidence.",
    color: "text-purple-400",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden bg-linear-to-b from-base-200 to-base-100">
      {/* Animated subtle background */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{ backgroundPosition: ['0% 0%', '200% 200%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose JobPulse AI?
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Designed for job seekers who want faster results, smarter tools, and real confidence in every step.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.14)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{
                y: -14,
                scale: 1.05,
                boxShadow: '0 25px 50px -12px rgba(59,130,246,0.5)',
                transition: { type: 'spring', stiffness: 300, damping: 15 },
              }}
              className="card bg-base-100 border border-base-300 hover:border-primary/60 shadow-xl hover:shadow-2xl p-8 group transition-all duration-300 flex flex-col"
            >
              <motion.div
                className={cn("text-6xl mb-6 mx-auto", f.color)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.5, type: 'spring', stiffness: 200 }}
                whileHover={{ rotate: [0, -15, 15, -10, 0], scale: 1.2 }}
              >
                <f.icon />
              </motion.div>

              <h3 className="text-2xl font-bold text-center mb-4 group-hover:text-primary transition-colors">
                {f.title}
              </h3>

              <p className="text-base-content/70 text-center flex-1">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}