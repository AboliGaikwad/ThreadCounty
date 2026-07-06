"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload, FileText, HardDrive, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ totalUploads: 0, completeCount: 0, storageUsedKB: 0 });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // 2. Check if the user is listed as an admin
        const { data: adminCheck } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (adminCheck) {
          setIsAdmin(true);
        }
      }

      const { data: uploads } = await supabase
        .from("uploads")
        .select("file_size_kb, status");

      if (uploads) {
        const totalUploads = uploads.length;
        const completeCount = uploads.filter(u => u.status === "complete").length;
        const storageUsedKB = uploads.reduce((sum, u) => sum + (u.file_size_kb || 0), 0);
        setStats({ totalUploads, completeCount, storageUsedKB });
      }
    }
    load();
  }, []);

  const quickStats = [
    { label: "Total uploads", value: stats.totalUploads, icon: Upload },
    { label: "Analyses done", value: stats.completeCount, icon: FileText },
    {
      label: "Storage used",
      value: stats.storageUsedKB > 1024
        ? `${(stats.storageUsedKB / 1024).toFixed(1)} MB`
        : `${stats.storageUsedKB} KB`,
      icon: HardDrive
    },
  ];

  return (
    <div>
      {/* ─── DYNAMIC TOP BANNER FOR ADMINS ─── */}
      {isAdmin && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-gold/30 bg-gold/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-wider text-gold flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Admin Access Active
            </p>
          </div>
          <Link href="/admin" className="text-xs font-mono uppercase tracking-wider text-gold hover:underline">
            Go to Platform Overview →
          </Link>
        </div>
      )}

      <h1 className="font-display text-2xl">
        Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-ecru/60">Here&apos;s your ThreadCounty overview.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {quickStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="relative rounded-lg border border-dashed border-ecru/25 bg-surface p-5">
            <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-ink ring-1 ring-ecru/30" />
            <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ecru/50">{label}</p>
            <p className="mt-1 font-display text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/upload" className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold/90">
          Upload new swatch
        </Link>
        <Link href="/history" className="rounded-full border border-ecru/20 px-5 py-2.5 text-sm hover:border-gold hover:text-gold">
          View all history
        </Link>

        {/* ─── ADMIN QUICK ACTION LINK ─── */}
        {isAdmin && (
          <Link href="/admin" className="rounded-full bg-rust/20 border border-rust/30 px-5 py-2.5 text-sm text-rust hover:bg-rust/30 transition">
            Platform Overview
          </Link>
        )}

      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 font-display text-lg">Activity timeline</h2>
          <ActivityTimeline />
        </div>
        <div>
          <h2 className="mb-5 font-display text-lg">Notifications</h2>
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
}