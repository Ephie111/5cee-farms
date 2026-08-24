import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { FAQ_CATEGORIES } from "@/lib/faq";

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">Help</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Everything you need to know before your first order.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
          <div className="space-y-10">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.category}>
                <h2 className="text-lg font-bold text-forest">{category.category}</h2>
                <div className="mt-4">
                  <FaqAccordion items={category.items} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-forest/10 bg-forest/5 p-6 text-center">
            <p className="text-sm font-semibold text-charcoal">Still have a question?</p>
            <p className="mt-1 text-sm text-charcoal/70">
              We're happy to help — reach out directly.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/2347061302674"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="rounded-full border-2 border-forest/20 px-7 py-3 text-sm font-semibold text-forest transition-colors hover:bg-forest/5">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}