export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-forest farm-grain"
    >
      {/* Decorative rooster-silhouette watermark — signature brand motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-10 h-[26rem] w-[26rem] rounded-full bg-leaf/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
        <div>
          <span className="section-eyebrow bg-white/10 rounded-full px-4 py-1.5 text-gold">
            Ifite, Awka South LGA · Anambra State
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Fresh. Clean.
            <br />
            <span className="text-gold">Trusted.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
            5CEE Farms Ltd is a family-owned agro-allied company producing
            clean, nutritious, responsibly raised poultry — from our farm
            straight to your table.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#about" className="btn-primary">
              Learn Our Story
            </a>
            <a href="#contact" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>

        {/* Hero image placeholder — swap for a farm / product photo */}
        <div className="img-placeholder aspect-[4/3] w-full rounded-2xl bg-white/5 border-white/20">
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
    </section>
  );
}