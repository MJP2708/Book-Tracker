import { AppHeader } from "@/components/layout/AppHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { ContinueReadingSection } from "@/components/home/ContinueReadingSection";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { AnimatedStatsSection } from "@/components/home/AnimatedStatsSection";
import { ProjectStatsSection } from "@/components/home/ProjectStatsSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function LandingPage() {
  return (
    <>
      <AppHeader />
      <main style={{ backgroundColor: "var(--bg)", fontFamily: "var(--font-body), 'DM Sans', sans-serif" }}>
        <HeroSection />
        <ContinueReadingSection />
        <FeaturedCarousel />
        <FeaturesSection />
        <AnimatedStatsSection />
        <ProjectStatsSection />
        <CtaSection />
      </main>
    </>
  );
}
