import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero animates on load (it's above the fold), not on scroll */}
        <Hero />

        <ScrollReveal><AboutSection /></ScrollReveal>
        <ScrollReveal><TeamSection /></ScrollReveal>
        <ScrollReveal><Testimonials /></ScrollReveal>
        <ScrollReveal><ContactSection /></ScrollReveal>
        <ScrollReveal><FeaturedProducts /></ScrollReveal>
      </main>
      <Footer />
    </>
  );
}