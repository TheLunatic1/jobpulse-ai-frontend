// src/app/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MotionDiv } from '@/components/motion/MotionDiv';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="container mx-auto px-6 pt-12 pb-24">
        <MotionDiv
          variants={staggerContainer(0.2)}
          className="max-w-5xl mx-auto text-center"
        >
          <MotionDiv variants={fadeInUp} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="text-primary">AI-Powered</span> Job Hunting
            </h1>
          </MotionDiv>

          <MotionDiv variants={fadeInUp} className="mb-12">
            <p className="text-xl md:text-2xl text-base-content/80 max-w-3xl mx-auto">
              Get matched to jobs instantly, talk to AI career coach, optimize resume — 
              all in one futuristic platform
            </p>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <button className="btn btn-primary btn-lg px-12 py-4 text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow duration-500">
              Start Exploring Jobs
            </button>
          </MotionDiv>
        </MotionDiv>
      </main>

      <Footer />
    </>
  );
}