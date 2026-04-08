'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/icons';

const testimonials = [
  {
    quote: "Got my dream job at Pathao within 2 weeks thanks to the AI Coach. The resume feedback was incredibly accurate.",
    name: "Rafi Ahmed",
    role: "Frontend Engineer",
    company: "Pathao"
  },
  {
    quote: "As a recruiter, the admin panel and application management saved me hours every week. Best hiring tool I've used.",
    name: "Nadia Khan",
    role: "Talent Acquisition Lead",
    company: "bKash"
  },
  {
    quote: "The interview simulator helped me prepare like never before. Landed offers from 3 companies!",
    name: "Mehedi Hasan",
    role: "Software Engineer",
    company: "BrainStation"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Real Stories from Real Users
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -12 }}
              className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-xl"
            >
              <div className="text-6xl text-primary/20 mb-6">“</div>
              <p className="text-lg leading-relaxed text-base-content/80 mb-8">
                {t.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-base-300 rounded-2xl flex items-center justify-center text-primary">
                  <Icons.UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-base-content/60">{t.role} • {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}