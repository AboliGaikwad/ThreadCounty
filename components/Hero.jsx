import Link from "next/link";

export default function Hero() {
  const stats = [
    { label: "Warp count", value: "128" },
    { label: "Weft count", value: "96" },
    { label: "Confidence", value: "94%" },
  ];

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--color-ecru) 0px, var(--color-ecru) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, var(--color-ecru) 0px, var(--color-ecru) 1px, transparent 1px, transparent 24px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
          AI-powered textile analysis
        </p>

        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-6xl">
          Every thread, <span className="text-gold">counted.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-ecru/70 md:text-lg">
          Upload a fabric photo and get warp count, weft count, thread density,
          and fabric type back in seconds.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-ink hover:bg-gold/90"
          >
            Analyze your first swatch
          </Link>
          <Link
            href="#workflow"
            className="rounded-full border border-ecru/20 px-7 py-3 text-sm hover:border-gold hover:text-gold"
          >
            See how it works
          </Link>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="relative rounded-md border border-dashed border-ecru/25 bg-surface px-4 py-5">
              <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-ink ring-1 ring-ecru/30" />
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ecru/50">{stat.label}</dt>
              <dd className="mt-1 font-display text-xl text-gold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}