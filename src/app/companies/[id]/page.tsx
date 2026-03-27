/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { Icons } from '@/components/icons';

interface Company {
  _id: string;
  companyName: string;
  companyLogo?: string;
  companyDescription: string;
  website?: string;
  industry?: string;
  location?: string;
  bio?: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  image: string;
}

export default function CompanyProfilePage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}`);
        const data = await res.json();

        if (data.success) {
          setCompany(data.company);
          setJobs(data.jobs.map((job: any) => ({
            ...job,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 50}/400/220`
          })));
        }
      } catch (err) {
        console.error('Failed to fetch company');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Company not found
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-100 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Company Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-200 border border-base-300 rounded-3xl p-10 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-primary">
                {company.companyLogo ? (
                  <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Icons.Building className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl font-bold">{company.companyName}</h1>
                <p className="text-xl text-primary mt-2">{company.industry || 'Technology Company'}</p>
                <p className="mt-4 text-base-content/80 max-w-2xl mx-auto md:mx-0">{company.companyDescription}</p>

                <div className="flex flex-wrap gap-6 mt-8 justify-center md:justify-start text-sm">
                  {company.website && (
                    <a href={company.website} target="_blank" className="flex items-center gap-2 hover:text-primary">
                      <Icons.Send className="w-5 h-5" /> Website
                    </a>
                  )}
                  {company.location && (
                    <div className="flex items-center gap-2">
                      <Icons.Location className="w-5 h-5" /> {company.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Open Jobs Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-8">Open Positions at {company.companyName}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.length > 0 ? (
                jobs.map((job, i) => (
                  <JobCard
                    key={job._id}
                    job={{
                      id: job._id,
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      salary: job.salary,
                      type: job.type,
                      image: `https://picsum.photos/id/${50 + i}/400/220`
                    }}
                    index={i}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-base-content/60">
                  No open positions at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}