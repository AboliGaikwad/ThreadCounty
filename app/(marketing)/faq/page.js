"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  {
    label: "Platform",
    faqs: [
      { q: "What is ThreadCounty?", a: "ThreadCounty is an AI-powered platform for analyzing fabric photos. Upload an image, get back warp count, weft count, thread density, fabric type, and a confidence score." },
      { q: "Do I need to install anything?", a: "No. ThreadCounty runs entirely in your browser." },
    ],
  },
  {
    label: "AI Analysis",
    faqs: [
      { q: "How accurate is the analysis?", a: "Every result includes a confidence score so you can judge it. Accuracy improves with clearer, well-lit photos taken flat against a neutral background." },
      { q: "What fabric types can it detect?", a: "Currently: cotton, linen, denim, twill, and blends. More types are being added." },
    ],
  },
  {
    label: "Uploads",
    faqs: [
      { q: "What formats are accepted?", a: "JPG, JPEG, and PNG." },
      { q: "Is there a file size limit?", a: "Yes — 10MB per image." },
      { q: "Can I delete uploaded images?", a: "Yes, from your History page at any time." },
    ],
  },
  {
    label: "Pricing",
    faqs: [
      { q: "Is there a free plan?", a: "Yes. The Free plan includes 5 analyses per month, no credit card required." },
      { q: "Can I upgrade or downgrade anytime?", a: "Yes, plan changes take effect at the start of your next billing cycle." },
    ],
  },
  {
    label: "Account",
    faqs: [
      { q: "How do I reset my password?", a: "Use the 'Forgot password' link on the login page. We'll email you a reset link." },
      { q: "Can I delete my account?", a: "Yes, from your Profile page. Deletion removes all your data permanently." },
    ],
  },
];

export default function FAQPage() {
  const [openKey, setOpenKey] = useState(null);

  return (
    <>
      
      <main className="min-h-screen bg-ink px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">FAQ</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Common questions.</h1>
          <p className="mt-3 text-sm text-ecru/60">Can&apos;t find your answer? <a href="/contact" className="text-gold">Contact us.</a></p>

          <div className="mt-12 space-y-10">
            {categories.map((cat) => (
              <section key={cat.label}>
                <p className="mb-4 font-mono text-xs uppercase tracking-wider text-ecru/50">{cat.label}</p>
                <div className="divide-y divide-surface rounded-lg border border-surface">
                  {cat.faqs.map((item) => {
                    const key = `${cat.label}-${item.q}`;
                    const isOpen = openKey === key;
                    return (
                      <div key={key}>
                        <button
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm hover:text-gold"
                        >
                          <span>{item.q}</span>
                          {isOpen ? <Minus className="h-4 w-4 shrink-0 text-gold" /> : <Plus className="h-4 w-4 shrink-0 text-ecru/40" />}
                        </button>
                        {isOpen && (
                          <p className="px-5 pb-4 text-sm text-ecru/70">{item.a}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}