import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">Our Story</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">About Us</h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Family-owned, farm-raised, and built on a simple promise: fresh, clean, trusted.
            </p>
          </div>
        </section>

        <AboutSection />
      </main>
      <Footer />
    </>
  );
}