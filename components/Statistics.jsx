const stats = [
  { value: "12,400+", label: "Swatches analyzed" },
  { value: "98.3%", label: "Avg. confidence score" },
  { value: "340", label: "Mills & studios onboard" },
  { value: "4.2s", label: "Avg. analysis time" },
];

export default function Statistics() {
  return (
    <section className="border-y border-surface bg-surface/20 px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl text-gold md:text-4xl">{s.value}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-ecru/50">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}