"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Github, Twitter } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    // Storing contact messages directly in Supabase
    // Create a `contact_messages` table: name, email, subject, message, created_at
    const { error } = await supabase.from("contact_messages").insert(form);
    setStatus(error ? "error" : "sent");
  };

  const inputClass = "w-full rounded-md border border-surface bg-surface/30 px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Contact</p>
            <h1 className="mt-3 font-display text-4xl font-semibold">Get in touch.</h1>
            <p className="mt-4 text-sm text-ecru/60">Have a question, partnership idea, or feedback? We read every message.</p>

            <div className="mt-10 space-y-4">
              <a href="mailto:hello@threadcounty.com" className="flex items-center gap-3 text-sm text-ecru/70 hover:text-gold">
                <Mail className="h-4 w-4 text-gold" strokeWidth={1.5} />
                hello@threadcounty.com
              </a>
              <a href="https://github.com" target="_blank" className="flex items-center gap-3 text-sm text-ecru/70 hover:text-gold">
                <Github className="h-4 w-4 text-gold" strokeWidth={1.5} />
                github.com/threadcounty
              </a>
              <a href="https://twitter.com" target="_blank" className="flex items-center gap-3 text-sm text-ecru/70 hover:text-gold">
                <Twitter className="h-4 w-4 text-gold" strokeWidth={1.5} />
                @threadcounty
              </a>
            </div>
          </div>

          <div>
            {status === "sent" ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="font-display text-2xl text-gold">Message sent.</p>
                <p className="mt-2 text-sm text-ecru/60">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={inputClass} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" required className={inputClass} />
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required className={inputClass} />
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" rows={5} required className={inputClass} />
                {status === "error" && <p className="text-sm text-rust">Something went wrong. Try again.</p>}
                <button type="submit" disabled={status === "loading"}
                  className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-50">
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}