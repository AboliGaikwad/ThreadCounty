const steps = [
  { n: "01", title: "Upload", desc: "Drag in a JPG, PNG, or JPEG of the fabric swatch." },
  { n: "02", title: "Analyze", desc: "Our model reads thread density, warp, and weft counts." },
  { n: "03", title: "Review", desc: "See fabric type, confidence score, and AI suggestions." },
  { n: "04", title: "Export", desc: "Download a report or share it with your team." },
];

export default function Workflow() {
  return (
    <section id="workflow" className="bg-ink px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Workflow</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">From swatch to report, in order.</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              <span className="font-mono text-sm text-gold/60">{step.n}</span>
              <h3 className="mt-2 font-display text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-ecru/70">{step.desc}</p>
              {i < steps.length - 1 && <span className="absolute -right-4 top-1 hidden text-ecru/20 lg:block">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}