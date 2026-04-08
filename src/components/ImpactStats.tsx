'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { label: 'Jobs Posted', value: 12458, suffix: '+' },
  { label: 'Candidates Hired', value: 4892, suffix: '+' },
  { label: 'Active Users', value: 8734, suffix: '+' },
  { label: 'Average Match Rate', value: 96, suffix: '%' },
];

function AnimatedCounter({ value, suffix, label }: { 
  value: number; 
  suffix: string; 
  label: string 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div 
      ref={ref} 
      className="text-center h-full flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Auto-scaling number */}
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-none tracking-tighter">
        {count}{suffix}
      </div>
      <p className="text-base-content/70 mt-4 text-sm sm:text-base font-medium">
        {label}
      </p>
    </motion.div>
  );
}

export default function ImpactStats() {
  return (
    <section className="py-20 md:py-24 bg-base-200">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16"
        >
          JobPulse AI in Numbers
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-base-100 rounded-3xl p-8 md:p-12 border border-base-300 text-center min-h-45 flex items-center justify-center"
            >
              <AnimatedCounter 
                value={stat.value} 
                suffix={stat.suffix} 
                label={stat.label} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}