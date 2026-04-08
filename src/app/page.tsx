import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedJobsSection from '@/components/FeaturedJobsSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import ImpactStats from '@/components/ImpactStats';
import TrustedBy from '@/components/TrustedBy';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedJobsSection />
      <WhyChooseUs />
      <ImpactStats />
      <TrustedBy />
      <Testimonials />
      <Footer />
      
    </>
  );
}