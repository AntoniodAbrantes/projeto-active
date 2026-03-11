import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ExperienceSection from "@/components/ExperienceSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import TransformationSection from "@/components/TransformationSection";
import PrizesSection from "@/components/PrizesSection";
import PressSection from "@/components/PressSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import ActiveFooter from "@/components/ActiveFooter";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ExperienceSection />
      <DifferentialsSection />
      <TransformationSection />
      <PrizesSection />
      <PressSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <ActiveFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
