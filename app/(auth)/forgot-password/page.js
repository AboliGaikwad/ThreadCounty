"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setStatus(error ? "error" : "sent");
  };

  if (status === "sent") {
    return <p className="text-center text-ecru/80">Check <span className="text-gold">{email}</span> for a reset link.</p>;
  }

  return (
    <>
      <h1 className="font-display text-2xl">Reset your password</h1>
      <p className="mt-2 text-sm text-ecru/60">We&apos;ll email you a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
          className="w-full rounded-md border border-surface bg-ink px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
        {status === "error" && <p className="text-sm text-rust">Something went wrong. Try again.</p>}
        <button type="submit" disabled={status === "loading"}
          className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-50">
          {status === "loading" ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ecru/60"><Link href="/login" className="text-gold">Back to login</Link></p>
    </>
  );
}