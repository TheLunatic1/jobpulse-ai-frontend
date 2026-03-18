import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';
import WhyChooseUs from '@/components/WhyChooseUs';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedJobsSection />
      <WhyChooseUs />
      <Footer />
    </>
  );
}