import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <MailCheck className="mx-auto h-10 w-10 text-gold" strokeWidth={1.5} />
      <h1 className="mt-4 font-display text-2xl">Check your inbox</h1>
      <p className="mt-2 text-sm text-ecru/60">We&apos;ve sent a verification link. Click it to activate your account.</p>
      <Link href="/login" className="mt-6 inline-block text-sm text-gold">Back to login</Link>
    </div>
  );
}