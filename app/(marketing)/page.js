import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Benefits from "@/components/Benefits";
import Workflow from "@/components/Workflow";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Benefits />
      <Workflow />
      <Statistics />
      <Testimonials />
      <FAQ />
      <ContactSection />
      <Footer />
    </>
  );
}