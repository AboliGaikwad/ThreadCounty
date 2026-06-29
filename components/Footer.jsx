import Link from "next/link";

const columns = [
  { title: "Product", links: [{ label: "Features", href: "/#features" }, { label: "Pricing", href: "/pricing" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
  { title: "Support", links: [{ label: "FAQ", href: "/faq" }] },
];

export default function Footer() {
  return (
    <footer className="border-t border-surface bg-ink px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-4">
          <p className="font-display text-lg">Thread<span className="text-gold">County</span></p>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ecru/70 hover:text-gold">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-ecru/40">© {new Date().getFullYear()} ThreadCounty. All rights reserved.</p>
      </div>
    </footer>
  );
}