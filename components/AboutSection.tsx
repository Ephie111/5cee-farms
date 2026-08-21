import CountUp from "./CountUp";

const PILLARS = [
  {
    title: "Science-Led",
    body: "Founded by a neuroscientist, our operations run on evidence-based decisions, continuous innovation, and disciplined systems.",
    icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  },
  {
    title: "Biosecure & Clean",
    body: "Sound husbandry and strict biosecurity at every stage, delivering wholesome chicken families can trust.",
    icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
  {
    title: "Built to Scale",
    body: "Pursuing vertical integration — hatchery, feed milling, processing, cold-chain and branded retail.",
    icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75h-3.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z",
  },
];

const QUICK_FACTS = [
  { label: "Founded", value: "2020", numeric: 2020 },
  { label: "Poultry Since", value: "2021", numeric: 2021 },
  { label: "Ownership", value: "Family-Owned", numeric: null },
  { label: "Location", value: "Anambra, NG", numeric: null },
];

export default function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
        {/* Copy column */}
        <div>
          <span className="section-eyebrow text-gold-dark">Who We Are</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Building a Sustainable Future
            <br /> Through Agriculture
          </h2>

          {/* Quick facts strip — breaks up the text visually and gives the story a scannable anchor */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-forest/10 bg-white px-4 py-3">
                <p className="font-display text-sm font-extrabold text-forest">
                  {fact.numeric !== null ? <CountUp target={fact.numeric} /> : fact.value}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-charcoal/50">{fact.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-charcoal/80">
            <p>
              5CEE Farms is a family-owned indigenous agro-allied company
              located in Ifite, Awka South LGA, Anambra State.
              Construction began in 2020; commercial
              operations started in 2021 with goat and cattle fattening,
              before we strategically transitioned into poultry production
              to meet Nigeria&rsquo;s growing demand for affordable,
              high-quality animal protein.
            </p>
            <p>
              We&rsquo;re pursuing vertical integration across the poultry
              value chain — hatchery operations, feed milling, processing,
              cold-chain distribution, and branded retail — while creating
              employment, equipping aspiring farmers with modern
              agricultural skills, and fostering entrepreneurship throughout
              the value chain.
            </p>
            <p>
              At 5CEE Farms, we are not simply producing poultry — we are
              building an integrated food company dedicated to nourishing
              communities, empowering people, creating jobs, and helping
              shape the future of agriculture in Nigeria.
            </p>
          </div>
        </div>

        {/* Farm photo placeholder */}
        <div className="img-placeholder aspect-video w-full rounded-2xl lg:sticky lg:top-24">
          <div className="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z"
              />
            </svg>
            <span className="text-xs font-medium">Farm site photo</span>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-forest/10 bg-forest p-7 text-white shadow-sm">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Our Mission
          </span>
          <p className="mt-4 text-[15px] leading-relaxed text-white/85">
            Our mission is to produce clean, nutritious, and responsibly
            raised poultry products that consumers can trust. We emphasize
            sound husbandry practices, strict biosecurity, and high
            production standards to deliver wholesome chicken products that
            support healthier diets for Nigerian families. By focusing on
            quality rather than shortcuts, we seek to build a trusted brand
            known for consistency, food safety, and customer confidence.
          </p>
        </div>

        <div className="rounded-2xl border border-forest/10 bg-white p-7 shadow-sm">
          <span className="section-eyebrow text-gold-dark">Our Vision</span>
          <p className="mt-4 text-[15px] leading-relaxed text-charcoal/80">
            The vision for 5CEE Farms originated from a lifelong aspiration
            to build an enterprise with lasting social and economic impact.
            Rather than pursuing agriculture solely as a business
            opportunity, the company was founded on the belief that
            sustainable food production can improve lives, empower
            communities, and stimulate local economic growth.
          </p>
        </div>
      </div>

      {/* Pillars — evenly sized, icon-led cards */}
      <dl className="mt-6 grid gap-5 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
              </svg>
            </span>
            <dt className="mt-4 font-display text-sm font-bold text-forest">
              {p.title}
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-charcoal/70">
              {p.body}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}