import Hero from "@/components/Hero";
import MissionVision from "@/components/MissionVision";
import AboutSection from "@/components/AboutSection";
import Objectives from "@/components/Objectives";

export default function HomePage() {
  return (
    <main className="bg-white">
      <Hero />
      <MissionVision />
      <AboutSection />
      <Objectives />
      
    </main>
  );
}