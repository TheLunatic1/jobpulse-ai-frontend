// src/app/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedJobsSection />
      <Footer />
    </>
  );
}