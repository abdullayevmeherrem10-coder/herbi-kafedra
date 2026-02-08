import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import CoursesSection from "@/components/landing/CoursesSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-light-rays">
      <Header />
      <HeroSection />
      <CoursesSection />
    </div>
  );
}
