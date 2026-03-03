import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ExperienceSection from "@/components/ExperienceSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import MediaSection from "@/components/MediaSection";
import TransformationSection from "@/components/TransformationSection";
import PrizesSection from "@/components/PrizesSection";
import PressSection from "@/components/PressSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import RegistrationForm from "@/components/RegistrationForm";
import FAQSection from "@/components/FAQSection";
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
      <MediaSection />
      <TransformationSection />
      <PrizesSection />
      <PressSection />
      <TestimonialsSection />
      <FAQSection />
      <RegistrationForm />
      <ActiveFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
