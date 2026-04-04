import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import CategoriesSection from "@/components/CategoriesSection";
import TimelineSection from "@/components/TimelineSection";
import RoadmapSection from "@/components/RoadmapSection";
import FooterSection from "@/components/FooterSection";
import GlassmorphSketchCanvas from "@/components/GlassmorphSketchCanvas";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <GlassmorphSketchCanvas />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <PrinciplesSection />
        <ArchitectureSection />
        <CategoriesSection />
        <TimelineSection />
        <RoadmapSection />
        <div className="pb-24">
          <FooterSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
