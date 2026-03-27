/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Icons } from '@/components/icons';

interface Company {
  _id: string;
  companyName: string;
  companyLogo?: string;
  companyDescription?: string;
  industry?: string;
  location?: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`);
        const data = await res.json();

        if (data.success) {
          setCompanies(data.companies || []);
        }
      } catch (err) {
        console.error('Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-100 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Partner Companies
            </h1>
            <p className="mt-4 text-xl text-base-content/70">
              Discover amazing companies hiring right now
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="card bg-base-200 border border-base-300 hover:border-primary shadow-xl overflow-hidden group"
              >
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30">
                      {company.companyLogo ? (
                        <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Icons.Building className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {company.companyName}
                      </h3>
                      <p className="text-sm text-primary">{company.industry || 'Technology'}</p>
                    </div>
                  </div>

                  <p className="text-base-content/80 line-clamp-3 mb-8 flex-1">
                    {company.companyDescription || 'A forward-thinking company looking for talented professionals.'}
                  </p>

                  <Link href={`/companies/${company._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="btn btn-primary w-full"
                    >
                      View Company Profile →
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {companies.length === 0 && (
            <div className="text-center py-20 text-xl text-base-content/60">
              No companies registered yet.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}