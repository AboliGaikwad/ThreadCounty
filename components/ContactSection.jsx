"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // wiring to Supabase comes later
  };

  return (
    <section id="contact" className="bg-ink px-6 py-20">
      <div className="mx-auto max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Contact</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Get in touch.</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name"
            className="w-full rounded-md border border-surface bg-surface/50 px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email"
            className="w-full rounded-md border border-surface bg-surface/50 px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={4}
            className="w-full rounded-md border border-surface bg-surface/50 px-4 py-3 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none" />
          <button type="submit" className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}