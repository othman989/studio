import { HeroSection } from '@/components/HeroSection';
import { FeaturedCarsSection } from '@/components/FeaturedCarsSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCarsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
