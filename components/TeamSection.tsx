import TeamCard, { TeamMember } from "./TeamCard";

// Founder shown separately; operations team follows.
// Add a `photo` field (e.g. "/images/team/destiny.jpg") once real photos are ready.
const FOUNDER: TeamMember = {
  name: "Dr. Chiso Nwokafor",
  role: "Founder",
};

const OPERATIONS_TEAM: TeamMember[] = [
  { name: "Anhoe Doesom Destiny", role: "Operations Team" },
  { name: "Naanlang Haruna Amos", role: "Operations Team" },
  { name: "Ezra Ladat Yitina", role: "Operations Team" },
  { name: "Ezra Melchizedek", role: "Operations Team" },
  { name: "Nnaji Ogechi Elizabeth", role: "Operations Team" },
  { name: "Sambo Shekwolo Joseph", role: "Operations Team" },
  { name: "Ezeh Rosemary Chidimma", role: "Operations Team" },
  { name: "Chinyere Okoli", role: "Operations Team" },
  { name: "Onyeka Eze", role: "Operations Team" },
  { name: "Uchenna Okpala", role: "Operations Team" },
  { name: "Charles Anene", role: "Operations Team" },
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
          {OPERATIONS_TEAM.map((member) => (
            <TeamCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}