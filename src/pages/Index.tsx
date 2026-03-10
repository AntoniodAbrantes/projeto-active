import { useState } from "react";
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
import RegistrationForm from "@/components/RegistrationForm";
import FAQSection from "@/components/FAQSection";
import ActiveFooter from "@/components/ActiveFooter";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<"start" | "elite">("elite");

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
      <PricingSection onSelectPlan={setSelectedPlan} />
      <FAQSection />
      <RegistrationForm selectedPlan={selectedPlan} />
      <ActiveFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
