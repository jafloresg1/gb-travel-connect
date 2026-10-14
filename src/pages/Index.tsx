import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import PromotionsHomeSection from "@/components/catalog/PromotionsHomeSection";
import PackagesSection from "@/components/PackagesSection";
import FacebookSection from "@/components/FacebookSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Header />
    <main>
      <HeroSection />
      <TrustSection />
      <PromotionsHomeSection />
      <PackagesSection />
      <FacebookSection />
      <AboutSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

export default Index;
