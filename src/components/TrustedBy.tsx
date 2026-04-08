/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/icons';

const companies = [
  'TechNova', 'Daffodil', 'BrainStation', 'Pathao', 'bKash', 
  'Grameenphone', 'Chaldal', 'Sheba.xyz', 'Aamra'
];

export default function TrustedBy() {
  return (
    <section className="py-20 bg-base-100 border-t border-base-300">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-base-content/60 text-sm tracking-widest mb-8"
        >
          TRUSTED BY LEADING COMPANIES
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 opacity-75">
          {companies.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.15, opacity: 1 }}
              className="font-semibold text-2xl text-base-content/70 hover:text-primary transition-colors"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}