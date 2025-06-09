import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import BenefitsSection from "./_components/BenefitsSection";
import CtaSection from "./_components/CtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* CTA Section */}
        <CtaSection />
      </main>
    </div>
  );
}
