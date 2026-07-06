import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  { name: "Aboli", role: "Founder & Engineer", bio: "CS student building the intersection of textiles and machine vision." },
  { name: "Advisor", role: "Textile Industry", bio: "30 years of experience in fabric quality grading." },
];

const timeline = [
  { year: "2024", event: "Problem identified — fabric QC is still done by hand in most Indian mills." },
  { year: "2025", event: "First prototype built using computer vision and Supabase." },
  { year: "2026", event: "ThreadCounty launched at DKTESTEI hackathon, Ichalkaranji." },
];

const stack = ["Next.js", "Tailwind CSS", "Python FastAPI", "Supabase", "PostgreSQL"];

export default function AboutPage() {
  return (
    <>
     
      <main className="min-h-screen bg-ink px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">About</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Built for fabric people.</h1>

          <p className="mt-6 text-ecru/70">
            ThreadCounty started with a simple observation: fabric quality checks in most textile mills still depend entirely on a single inspector&apos;s experience and a handheld lupe. Results vary between shifts, between inspectors, between mills. We wanted to fix that.
          </p>

          <div className="mt-12">
            <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">Mission</p>
            <p className="mt-2 text-ecru/80">Make consistent, data-backed fabric analysis accessible to every mill, student, and garment exporter — not just the ones with labs.</p>
          </div>
          <div className="mt-6">
            <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">Vision</p>
            <p className="mt-2 text-ecru/80">A world where quality is a number, not an opinion.</p>
          </div>

          <div className="mt-14">
            <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">Timeline</p>
            <ol className="mt-6 space-y-0">
              {timeline.map((t, i) => (
                <li key={t.year} className="relative flex gap-6 pb-8">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[19px] top-8 h-full w-px bg-surface" />
                  )}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink font-mono text-xs text-gold">
                    {t.year.slice(2)}
                  </div>
                  <div className="pt-2">
                    <p className="font-mono text-xs text-ecru/40">{t.year}</p>
                    <p className="mt-1 text-sm text-ecru/80">{t.event}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14">
            <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">Technology</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((s) => (
                <span key={s} className="rounded-full border border-surface bg-surface/50 px-4 py-1.5 font-mono text-xs text-ecru/70">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">Team</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {team.map((member) => (
                <div key={member.name} className="rounded-lg border border-surface bg-surface/30 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface font-display text-lg text-gold">
                    {member.name[0]}
                  </div>
                  <p className="mt-3 font-display">{member.name}</p>
                  <p className="font-mono text-xs text-gold">{member.role}</p>
                  <p className="mt-2 text-sm text-ecru/60">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}