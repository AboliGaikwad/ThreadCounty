"use client";

import { useEffect, useState } from "react";
import { Upload, CheckCircle, Trash2, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const actionConfig = {
  upload: { icon: Upload, color: "text-gold", label: "Uploaded" },
  analysis_complete: { icon: CheckCircle, color: "text-sage", label: "Analysis complete" },
  report_deleted: { icon: Trash2, color: "text-rust", label: "Deleted report" },
  profile_update: { icon: User, color: "text-ecru/60", label: "Updated profile" },
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setEvents(data || []);
      setLoading(false);
    }
    load();

    // Real-time subscription — new activity rows appear instantly without a page refresh
    const channel = supabase
      .channel("activity-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (payload) => {
        setEvents((prev) => [payload.new, ...prev.slice(0, 9)]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading) return <p className="text-sm text-ecru/40">Loading activity…</p>;
  if (events.length === 0) {
    return <p className="text-sm text-ecru/40">No activity yet. Upload your first swatch to get started.</p>;
  }

  return (
    <ol className="relative space-y-0">
      {events.map((event, i) => {
        const config = actionConfig[event.action] || actionConfig.upload;
        const Icon = config.icon;
        const isLast = i === events.length - 1;

        return (
          <li key={event.id} className="relative flex gap-4 pb-6">
            {/* vertical line connecting dots */}
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-full w-px bg-surface" />
            )}
            <div className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface bg-ink ${config.color}`}>
              <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-ecru/90">{event.description}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ecru/40">{timeAgo(event.created_at)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}