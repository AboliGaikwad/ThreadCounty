"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "What image formats are supported?", a: "JPG, PNG, and JPEG, up to 10MB per upload." },
  { q: "How accurate is the AI analysis?", a: "Every result ships with a confidence score so you can judge it yourself." },
  { q: "Is there a free plan?", a: "Yes — the Free plan includes a limited number of analyses per month." },
  { q: "Can I delete my uploaded images?", a: "Yes, anytime, from your Upload History page." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-surface/30 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Common questions.</h2>
        <div className="mt-10 divide-y divide-surface">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="py-4">
                <button onClick={() => setOpenIndex(isOpen ? null : i)} className="flex w-full items-center justify-between text-left">
                  <span>{item.q}</span>
                  {isOpen ? <Minus className="h-4 w-4 text-gold" /> : <Plus className="h-4 w-4 text-gold" />}
                </button>
                {isOpen && <p className="mt-3 text-sm text-ecru/70">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}