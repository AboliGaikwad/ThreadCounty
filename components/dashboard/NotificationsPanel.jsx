"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Derive notifications from real data instead of a separate table
      const { data: uploads } = await supabase
        .from("uploads")
        .select("*, analysis_results(*)")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!uploads) { setLoading(false); return; }

      const derived = [];
      uploads.forEach((u) => {
        if (u.status === "complete" && u.analysis_results?.length > 0) {
          const score = u.analysis_results[0].confidence_score;
          if (score < 70) {
            derived.push({
              id: `low-conf-${u.id}`,
              type: "warning",
              message: `Low confidence (${score}%) on ${u.file_name} — consider re-uploading a clearer photo.`,
              href: `/analysis/${u.id}`,
            });
          } else {
            derived.push({
              id: `complete-${u.id}`,
              type: "success",
              message: `Analysis complete for ${u.file_name} — ${score}% confidence.`,
              href: `/analysis/${u.id}`,
            });
          }
        }
        if (u.status === "pending") {
          derived.push({
            id: `pending-${u.id}`,
            type: "info",
            message: `${u.file_name} is still pending analysis.`,
            href: `/upload`,
          });
        }
      });

      setNotifications(derived.slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  const iconMap = {
    success: <CheckCircle className="h-4 w-4 text-sage" strokeWidth={1.5} />,
    warning: <AlertTriangle className="h-4 w-4 text-rust" strokeWidth={1.5} />,
    info: <Info className="h-4 w-4 text-gold" strokeWidth={1.5} />,
  };

  if (loading) return <p className="text-sm text-ecru/40">Loading notifications…</p>;
  if (notifications.length === 0) {
    return <p className="text-sm text-ecru/40">You&apos;re all caught up.</p>;
  }

  return (
    <ul className="space-y-3">
      {notifications.map((n) => (
        <li key={n.id}>
          <Link href={n.href} className="flex items-start gap-3 rounded-lg border border-surface bg-surface/30 p-3 hover:border-ecru/30">
            <span className="mt-0.5 shrink-0">{iconMap[n.type]}</span>
            <p className="text-sm text-ecru/80">{n.message}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}