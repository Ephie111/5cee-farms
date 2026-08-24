import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">Contact</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Contact Us</h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              We&apos;re always happy to hear from you — reach out any way that&apos;s easiest.
            </p>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}