const CONTACT_DETAILS = [
  {
    label: "Farm Address",
    value: "NKPAGU Farmland, Obodo Adaka, Ifite Awka, Awka South LGA, Anambra State",
    icon: "pin",
  },
  {
    label: "Phone",
    value: "0706 130 2674",
    href: "tel:+2347061302674",
    icon: "phone",
  },
  {
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/2347061302674",
    icon: "chat",
    highlight: true,
  },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    pin: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
    phone:
      "M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 001.5-1.5v-2.204a1.5 1.5 0 00-1.106-1.447l-3.516-.937a1.5 1.5 0 00-1.53.415l-1.11 1.11a11.25 11.25 0 01-5.472-5.472l1.11-1.11a1.5 1.5 0 00.415-1.53l-.937-3.516A1.5 1.5 0 006.204 4.5H4.5a1.5 1.5 0 00-1.5 1.5v.75z",
    chat: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12.375 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM16.125 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header — centered, matches the Team/Testimonials sections above it */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow text-gold-dark">Get In Touch</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            From Our Farm to Your Table
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-charcoal/70">
            We'd love to hear from you. Reach out with any questions, and our team will be happy to assist.
          </p>
        </div>

        {/* Contact method cards — evenly sized, WhatsApp visually emphasized as the fastest channel */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
          {CONTACT_DETAILS.map((item) => {
            const CardInner = (
              <>
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    item.highlight ? "bg-white/15 text-white" : "bg-forest/10 text-forest"
                  }`}
                >
                  <Icon name={item.icon} />
                </span>
                <p
                  className={`mt-4 text-xs font-semibold uppercase tracking-wide ${
                    item.highlight ? "text-gold" : "text-gold-dark"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`mt-1 text-sm font-medium leading-relaxed ${
                    item.highlight ? "text-white" : "text-charcoal"
                  }`}
                >
                  {item.value}
                </p>
              </>
            );

            const cardClasses = item.highlight
              ? "rounded-2xl bg-forest p-6 text-center shadow-sm transition-transform hover:-translate-y-0.5"
              : "rounded-2xl border border-forest/10 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-0.5";

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={`flex flex-col items-center ${cardClasses}`}
              >
                {CardInner}
              </a>
            ) : (
              <div key={item.label} className={`flex flex-col items-center ${cardClasses}`}>
                {CardInner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}