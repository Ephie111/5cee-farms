import Image from "next/image";

export type TeamMember = {
  name: string;
  role: string;
  /** Path under /public once a real photo is available, e.g. "/images/team/destiny.jpg" */
  photo?: string;
};

export default function TeamCard({ name, role, photo }: TeamMember) {
  return (
    <div className="group rounded-2xl border border-forest/10 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="img-placeholder relative mx-auto h-28 w-28 overflow-hidden rounded-full">
        {photo ? (
          <Image src={photo} alt={name} fill className="object-cover" />
        ) : (
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
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </div>
      <p className="mt-4 font-display text-sm font-bold text-charcoal">
        {name}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gold-dark">
        {role}
      </p>
    </div>
  );
}