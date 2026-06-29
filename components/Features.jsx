import { ScanLine, Gauge, FileBarChart, ShieldCheck } from "lucide-react";

const features = [
  { icon: ScanLine, title: "Instant fabric scan", desc: "Upload a photo, get warp/weft counts and density in seconds." },
  { icon: Gauge, title: "Confidence scoring", desc: "Every result ships with a transparent confidence percentage." },
  { icon: FileBarChart, title: "Exportable reports", desc: "Download or share a clean report for any analysis." },
  { icon: ShieldCheck, title: "Consistent grading", desc: "Remove inspector-to-inspector variance from quality checks." },
];

export default function Features() {
  return (
    <section id="features" className="bg-ink px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Features</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold md:text-4xl">
          Everything a quality check needs, nothing it doesn&apos;t.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-surface bg-surface/50 p-6">
              <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-lg">{title}</h3>
              <p className="mt-2 text-sm text-ecru/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}