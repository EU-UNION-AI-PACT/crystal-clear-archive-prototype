import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import CategoriesSection from "@/components/CategoriesSection";
import TimelineSection from "@/components/TimelineSection";
import RoadmapSection from "@/components/RoadmapSection";
import LiveTicker from "@/components/LiveTicker";
import FooterSection from "@/components/FooterSection";
import GlassmorphSketchCanvas from "@/components/GlassmorphSketchCanvas";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ScrollProgress />
      <GlassmorphSketchCanvas />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <PrinciplesSection />
        <ArchitectureSection />
        <CategoriesSection />
        <TimelineSection />
        <RoadmapSection />
        <LiveTicker />
        <div className="pb-24">
          <FooterSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
