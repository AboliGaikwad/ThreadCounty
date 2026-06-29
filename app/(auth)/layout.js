import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center font-display text-lg">
          Thread<span className="text-gold">County</span>
        </Link>
        <div className="rounded-lg border border-surface bg-surface/40 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}