// 1. THE "USE CLIENT" DIRECTIVE
// By default, Next.js renders everything on the server for speed. 
// However, because this Navbar has a button that clicks and changes things on the screen, 
// we MUST tell Next.js: "Hey, this specific file needs JavaScript on the user's browser!"
"use client";

// 2. IMPORTING TOOLS
// useState: This is React's short-term memory tool. We use it to remember if things are open or closed.
// Link: This is Next.js's supercharged smart anchor tag (`<a>`). It switches pages instantly without reloading the browser.
import { useState } from "react";
import Link from "next/link";

// 3. STATING OUR DATA (The Menu Items)
// Instead of copy-pasting the HTML code for four different links, we store them in an Array of Objects.
// This makes our code clean, editable, and easy to loop through.
const navLinks = [
  { label: "Product", href: "/#product" }, // Directs to an ID anchor on the home page
  { label: "Pricing", href: "/pricing" },   // Directs to the pricing page
  { label: "About", href: "/about" },       // Directs to the about page
  { label: "FAQ", href: "/faq" },           // Directs to the FAQ page
];

export default function Navbar() {
  // 4. REACT STATE (The Hamburger Menu Memory)
  // isOpen: The variable holding the current state (starts as false, meaning hidden).
  // setIsOpen: The special function we must use whenever we want to change that variable.
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 5. THE VISUAL LAYOUT (JSX)
    // Tailwind classes note: 'sticky top-0' keeps the navbar pinned to the top as you scroll.
    // 'z-50' ensures it stays layered ON TOP of images or text below it.
    <header className="sticky top-0 z-50 border-b border-surface bg-ink/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* THE LOGO BRAND */}
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Thread<span className="text-gold">County</span>
        </Link>

        {/* DESKTOP LINKS (Hidden on Mobile) */}
        {/* 'hidden md:flex' means: Hide this entirely on small screens, but turn on flexbox layouts on Medium (desktop) devices. */}
        <ul className="hidden items-center gap-8 md:flex">
          {/* ARRAY MAPPING: We take our navLinks array and loop over it, spitting out a <li> for each item */}
          {navLinks.map((link) => (
            // React requires a unique 'key' property when looping so it can track changes efficiently
            <li key={link.href}>
              <Link href={link.href} className="font-body text-sm text-ecru/80 hover:text-gold">
                {link.label} {/* Renders "Product", "Pricing", etc. */}
              </Link>
            </li>
          ))}
        </ul>

        {/* DESKTOP AUTH BUTTONS (Hidden on Mobile) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="font-body text-sm text-ecru/80 hover:text-gold">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-gold px-4 py-2 font-body text-sm font-medium text-ink hover:bg-gold/90"
          >
            Get started
          </Link>
        </div>

        {/* THE MOBILE HAMBURGER BUTTON (Hidden on Desktop) */}
        {/* 'md:hidden' ensures this button completely vanishes once the screen matches a desktop view */}
        <button 
          // EVENT HANDLER: When clicked, run an anonymous function that sets 'isOpen' to the opposite of what it currently is (!isOpen).
          // If true, it becomes false. If false, it becomes true.
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden" 
          aria-label="Toggle menu"
        >
          {/* TERNARY OPERATOR: A mini conditional statement. If isOpen is true, show the "✕" icon. Otherwise, show "☰". */}
          {isOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* MOBILE DROP-DOWN MENU CONTAINER */}
      {/* LOGICAL AND (&&): This tells React: "Only evaluate and show the code inside these parentheses if 'isOpen' evaluates to true." */}
      {isOpen && (
        <ul className="flex flex-col gap-4 border-t border-surface px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                // CRUCIAL FOR MOBILE: When a user clicks a link, close the menu overlay automatically by setting state back to false
                onClick={() => setIsOpen(false)} 
                className="text-ecru/80"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}7