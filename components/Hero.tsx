const TRUST_BADGES = [
  {
    label: "100% Natural",
    caption: "No additives or preservatives",
    icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 15a3 3 0 100-6 3 3 0 000 6z",
  },
  {
    label: "Farm Fresh Daily",
    caption: "From our farm to your table",
    icon: "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21M6.75 3h10.5A2.25 2.25 0 0119.5 5.25v13.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18.75V5.25A2.25 2.25 0 016.75 3z",
  },
  {
    label: "Safe & Nutritious",
    caption: "Wholesome poultry you can trust",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Hygienically Processed",
    caption: "Cleaned and packaged with care",
    icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0H12",
  },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-forest farm-grain"
    >
      {/* Decorative rooster-silhouette watermark — signature brand motif.
          Slow, barely-perceptible breathing motion keeps the hero from
          feeling static. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-10 h-[26rem] w-[26rem] animate-pulse rounded-full bg-leaf/10 blur-3xl [animation-duration:6s]"
      />

      <div className="relative mx-auto max-w-[1600px] px-6 pt-16 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="text-center lg:pt-4 lg:text-left">
            <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 8v4l2.5 2.5" />
              </svg>
              Farm-Fresh Poultry · Hygienically Processed
            </span>

            <h1
              className="animate-fade-in-up mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl xl:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              Fresh Poultry.
              <br />
              Clean Processing.
              <br />
              <span className="text-gold">Trusted Quality.</span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mt-6 max-w-md text-base leading-relaxed text-white/80 lg:mx-0"
              style={{ animationDelay: "240ms" }}
            >
              5CEE Farms Ltd is a family-owned agro-allied company providing
              fresh, hygienically processed, and responsibly raised poultry —
              from our farm straight to your table.
            </p>

            <div
              className="animate-fade-in-up mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
              style={{ animationDelay: "360ms" }}
            >
              <a href="/shop" className="btn-primary inline-flex items-center gap-2">
                Explore Our Products
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </a>
              <a href="#about" className="btn-secondary">
                Learn About Us
              </a>
            </div>
          </div>

          {/* Hero image placeholder — swap for a real farm / product photo */}
          <div
            className="img-placeholder animate-fade-in-up aspect-[4/3] w-full rounded-2xl bg-white/5 border-white/20"
            style={{ animationDelay: "180ms" }}
          >
            <div className="flex flex-col items-center gap-2 text-white/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
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
              <span className="text-xs font-medium">Farm / product photo</span>
            </div>
          </div>
        </div>

        {/* Trust badges — icon-circle cards, animate in after the main content settles */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 py-8 sm:grid-cols-4 lg:mt-14">
          {TRUST_BADGES.map((badge, i) => (
            <div
              key={badge.label}
              className="animate-fade-in-up flex flex-col items-center gap-2 text-center"
              style={{ animationDelay: `${480 + i * 80}ms` }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                </svg>
              </span>
              <p className="text-sm font-bold text-white">{badge.label}</p>
              <p className="text-xs leading-snug text-white/60">{badge.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}