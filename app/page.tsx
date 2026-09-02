import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

// Must live here (the route file), not inside FeaturedProducts.tsx —
// Next.js only reads this special export from page.tsx/layout.tsx
// files, not from arbitrary imported components. Without it here,
// admin product changes (featured status, price, stock) won't show
// on this page until the next deployment, since it would otherwise
// be cached indefinitely on Vercel.
export const revalidate = 0;

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