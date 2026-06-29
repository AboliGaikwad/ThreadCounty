"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/verify-email");
  };

  return (
    <>
      <h1 className="font-display text-2xl">Create your account</h1>
      <p className="mt-2 text-sm text-ecru/60">Start analyzing fabric in minutes.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required
          className="w-full rounded-md border border-surface bg-ink px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required
          className="w-full rounded-md border border-surface bg-ink px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required minLength={6}
          className="w-full rounded-md border border-surface bg-ink px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
        {error && <p className="text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-50">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ecru/60">
        Already have an account? <Link href="/login" className="text-gold">Log in</Link>
      </p>
    </>
  );
}