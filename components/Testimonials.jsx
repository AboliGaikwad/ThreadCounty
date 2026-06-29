const testimonials = [
  { quote: "Cut our incoming QC time from twenty minutes a swatch to under five.", name: "R. Deshmukh", role: "QC Manager, textile mill" },
  { quote: "I use it to double-check my own manual counts before submitting lab reports.", name: "S. Patil", role: "Textile engineering student" },
  { quote: "Finally a consistent number instead of three inspectors disagreeing.", name: "A. Korde", role: "Garment exporter" },
];

export default function Testimonials() {
  return (
    <section className="bg-ink px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">From the floor</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Trusted where it counts.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-lg border border-surface bg-surface/50 p-6">
              <blockquote className="text-ecru/80">&quot;{t.quote}&quot;</blockquote>
              <figcaption className="mt-4 font-mono text-xs text-ecru/50">{t.name} — {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}