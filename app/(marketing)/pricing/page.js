import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "For students and hobbyists exploring fabric analysis.",
    features: ["5 analyses per month", "JPG / PNG / JPEG upload", "Basic AI report", "Download report PDF"],
    cta: "Get started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Student",
    price: "₹99",
    period: "per month",
    desc: "For textile engineering students with regular lab work.",
    features: ["50 analyses per month", "Priority queue", "Warp, weft & density detail", "Share reports via link", "Email support"],
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Professional",
    price: "₹499",
    period: "per month",
    desc: "For QC managers and independent fabric inspectors.",
    features: ["Unlimited analyses", "Bulk upload", "CSV export", "Advanced AI suggestions", "Priority support"],
    cta: "Get Professional",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "For mills, factories, and garment exporters at scale.",
    features: ["Unlimited users", "API access", "On-premise option", "SLA guarantee", "Dedicated account manager"],
    cta: "Contact sales",
    href: "/contact",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
     
      <main className="min-h-screen bg-ink px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-gold">Pricing</p>
          <h1 className="mt-3 text-center font-display text-3xl font-semibold md:text-5xl">
            Plans for every stage.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-ecru/60">
            Start free, scale when you need to. No hidden fees.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative flex flex-col rounded-lg border p-6 ${
                plan.highlight
                  ? "border-gold bg-surface"
                  : "border-surface bg-surface/30"
              }`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink">
                    Most popular
                  </span>
                )}
                <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">{plan.name}</p>
                <p className="mt-2 font-display text-3xl">{plan.price}</p>
                <p className="font-mono text-[10px] text-ecru/40">{plan.period}</p>
                <p className="mt-3 text-sm text-ecru/60">{plan.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`mt-8 block rounded-full px-4 py-2.5 text-center text-sm font-medium ${
                  plan.highlight
                    ? "bg-gold text-ink hover:bg-gold/90"
                    : "border border-ecru/20 hover:border-gold hover:text-gold"
                }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}