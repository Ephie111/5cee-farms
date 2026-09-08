import TeamCard, { TeamMember } from "./TeamCard";
import ScrollReveal from "./ScrollReveal";

// Founder shown separately; operations team follows.
// Add a `photo` field (e.g. "/images/team/destiny.jpg") once real photos are ready.
// If a specific photo still looks cropped wrong (e.g. head still cut off,
// or a photo that's already a tight face-only crop), add
// `photoPosition: "center"` (or a specific value like "50% 15%") to that
// person's entry to override the "top" default — see TeamCard.tsx.
const FOUNDER: TeamMember = {
  name: "Chiso Nwokafor, PhD",
  role: "CEO",
  photo: "/images/team/chiso.jpg",
};

const OPERATIONS_TEAM: TeamMember[] = [
  { name: "Naanlang Haruna Amos", role: "Operations Team", photo: "/images/team/amosharuna.jpg" },
  { name: "Ezra Melchizedek", role: "Operations Team", photo: "/images/team/ezramelchizedek.jpg" },
  { name: "Nnaji Ogechi Elizabeth", role: "Operations Team", photo: "/images/team/nnajiogechi.jpg" },
  { name: "Ezeh Rosemary Chidimma", role: "Oeration Manager",  photo: "/images/team/ezehrosemary.jpg"},
  { name: "Chinyere Foreign Okoli", role: "Business Coordinator", photo: "/images/team/chinyereokoli.jpg" },
  { name: "Engr. Onyeka Eze", role: "Site Engineer", photo: "/images/team/onyekaeze.jpg"},
  { name: "Arc. Peter Okpala", role: "Head of Constructions",  photo: "/images/team/uchennaokpala.jpg" },
  { name: "Mr. Charles Anene", role: "Site Supervisor", photo: "/images/team/charlesanene.jpg"},
  { name: "Christopher Daniel", role: "Operations Team", photo: "/images/team/christopherdaniel.jpg"},
  { name:  "Paul Damurak", role: "Operations Team", photo: "/images/team/pauldamurak.jpg"},
  { name:  "Samuel Jacob", role: "Operations Team", photo: "/images/team/samueljacob.jpg"},
  { name:  "Onyinyechi Ndirika", role: "Operations Team"},
  { name:  "Ezra Ladat Yitina", role: "Operations Team"},
  { name:  "Anhoe Doesom Destiny", role: "Operations Team"},
  { name:  "Sambo Shekwolo Joseph", role: "Operations Team"},
  
];

export default function TeamSection() {
  return (
    <section id="team" className="bg-forest/[0.03] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow text-gold-dark">
            The People Behind the Farm
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Meet the 5CEE Farms Team
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-charcoal/70">
            Every stage of production — from husbandry to distribution — is
            carried by people committed to quality and consistency.
          </p>
        </div>

        {/* Founder — featured */}
        <div className="mx-auto mt-12 max-w-xs">
          <TeamCard {...FOUNDER} />
        </div>

        {/* Operations team grid */}
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {OPERATIONS_TEAM.map((member, i) => (
            <ScrollReveal key={member.name} delayMs={(i % 4) * 70} variant="drop-bounce">
              <TeamCard {...member} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}