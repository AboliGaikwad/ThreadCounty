"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Upload, History, User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", href: "/upload", icon: Upload },
  { label: "History", href: "/history", icon: History },
  { label: "Profile", href: "/profile", icon: User },
];

export default function AppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/login");
      else setUser(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-ecru/50">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="hidden w-64 flex-col border-r border-surface px-4 py-6 md:flex">
        <Link href="/" className="mb-8 px-2 font-display text-lg">
          Thread<span className="text-gold">County</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  active ? "bg-surface text-gold" : "text-ecru/70 hover:bg-surface/50"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ecru/70 hover:bg-surface/50">
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Log out
        </button>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}