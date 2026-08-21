import BulkInquiryForm from "@/components/bulk/BulkInquiryForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const IDEAL_FOR = ["Restaurants", "Caterers", "Event Planners", "Hotels & Guesthouses"];

const BENEFITS = [
  {
    title: "Better Pricing at Volume",
    body: "Bulk carton packs and large live-bird orders come with pricing built for regular, high-volume buyers.",
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Consistent Quality",
    body: "The same freshness and biosecurity standards on every order — no surprises when the volume goes up.",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Reliable Scheduling",
    body: "Coordinate recurring or event-based deliveries in advance, so your kitchen or event is never caught short.",
    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  },
];

export default function BulkOrdersPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">For Businesses</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Bulk &amp; Wholesale Orders
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
              Feeding a restaurant, catering an event, or stocking up for a
              hotel kitchen? We supply quality poultry at volume, with
              pricing built around your order size.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {IDEAL_FOR.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-gold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                  </svg>
                </span>
                <p className="mt-4 font-display text-sm font-bold text-forest">{b.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">{b.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl font-bold">How It Works</h2>
              <ol className="mt-6 space-y-5">
                {[
                  ["Tell us what you need", "Fill in the form with your estimated quantity, order type, and timeline."],
                  ["We send you a quote", "Pricing depends on order size, product mix, and delivery location — we'll confirm everything with you directly."],
                  ["We schedule delivery", "One-off or recurring, we'll work out a delivery schedule that fits your kitchen or event."],
                ].map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-charcoal">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-charcoal">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal/70">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-8 text-sm text-charcoal/60">
                Prefer to talk it through? Call or WhatsApp us directly at{" "}
                <a href="tel:+2347061302674" className="font-semibold text-forest underline">0706 130 2674</a>.
              </p>
            </div>

            <BulkInquiryForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}