const benefits = [
  "No specialized lab equipment required",
  "Results in seconds, not hours",
  "Works from a phone camera photo",
  "Every report is downloadable and shareable",
];

export default function Benefits() {
  return (
    <section className="bg-surface/30 px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Why ThreadCounty</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Built for the people actually checking fabric.
          </h2>
          <ul className="mt-8 space-y-4">
            {benefits.map((item) => (
              <li key={item} className="flex gap-3 text-ecru/80">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-lg border border-dashed border-ecru/25 bg-surface p-8">
          <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-ink ring-1 ring-ecru/30" />
          <p className="font-mono text-[10px] uppercase tracking-wider text-ecru/50">Avg. analysis time</p>
          <p className="mt-2 font-display text-5xl text-gold">4.2s</p>
          <p className="mt-4 text-sm text-ecru/60">vs. 15–20 minutes for a manual count under a loupe.</p>
        </div>
      </div>
    </section>
  );
}