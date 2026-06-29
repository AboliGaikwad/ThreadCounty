"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/dashboard");
  };

  return (
    <>
      <h1 className="font-display text-2xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ecru/60">Log in to your ThreadCounty account.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required
          className="w-full rounded-md border border-surface bg-ink px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required
          className="w-full rounded-md border border-surface bg-ink px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ecru/60">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-gold" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-gold">Forgot password?</Link>
        </div>
        {error && <p className="text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-50">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ecru/60">
        Don&apos;t have an account? <Link href="/signup" className="text-gold">Sign up</Link>
      </p>
    </>
  );
}