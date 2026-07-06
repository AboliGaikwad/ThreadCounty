"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ImageIcon, FileText, Trash2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState({ users: 0, uploads: 0, analyses: 0, messages: 0 });
  const [uploads, setUploads] = useState([]);
  const [contactMessages, setContactMessages] = useState([]); // 1. Added State for Messages
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: adminCheck } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).single();
      if (!adminCheck) { router.push("/dashboard"); return; }
      setAuthorized(true);

      // Fetch recent uploads directly from Supabase client
      const { data: recentUploads } = await supabase
        .from("uploads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      try {
        // Fetch centralized aggregation metrics from your FastAPI/Python backend
        const backendStats = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/stats?user_id=${user.id}`,
        ).then((r) => r.json());

        // 2. Updated to accurately read properties mapped from your backend response
        setStats({
          users: backendStats.total_users || 0,
          uploads: backendStats.total_uploads || 0,
          analyses: backendStats.total_analyses || 0,
          messages: backendStats.total_messages || 0, 
        });

        // 3. Capture the messages array passed down from your backend
        setContactMessages(backendStats.contact_messages || []);
      } catch (err) {
        console.error("Failed to parse backend stats:", err);
      }
      
      setUploads(recentUploads || []);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleDeleteUpload = async (id, imagePath) => {
    if (!confirm("Delete this report permanently?")) return;
    try {
      if (imagePath) {
        await supabase.storage.from("fabric-images").remove([imagePath]);
      }
      await supabase.from("uploads").delete().eq("id", id);
      setUploads((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting upload record:", err);
    }
  };

  if (!authorized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-ecru/50">{authorized ? "Loading…" : "Checking access…"}</p>
      </div>
    );
  }

  // Cards display metrics aggregated dynamically from your backend endpoints
  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Total Uploads", value: stats.uploads, icon: ImageIcon },
    { label: "Analyses Run", value: stats.analyses, icon: FileText },
    { label: "Contact Messages", value: stats.messages, icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-ink px-6 py-10 text-ecru">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Admin</p>
            <h1 className="mt-1 font-display text-2xl">Platform overview</h1>
          </div>
          <a href="/dashboard" className="text-sm text-ecru/50 hover:text-gold">← Dashboard</a>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="relative rounded-lg border border-dashed border-ecru/25 bg-surface p-5">
              <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-ink ring-1 ring-ecru/30" />
              <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ecru/50">{label}</p>
              <p className="mt-1 font-display text-2xl">{value}</p>
            </div>
          ))}
        </div>

        {/* Recent Uploads Section */}
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg">Recent uploads</h2>
          <div className="overflow-hidden rounded-lg border border-surface bg-surface/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface/50 text-ecru/50">
                <tr>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">File</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {uploads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-ecru/40 italic">No recent uploads found.</td>
                  </tr>
                ) : (
                  uploads.map((u) => (
                    <tr key={u.id} className="hover:bg-surface/30">
                      <td className="px-4 py-3 font-medium">{u.file_name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${
                          u.status === "complete" ? "bg-sage/20 text-sage" :
                          u.status === "pending" ? "bg-gold/20 text-gold" :
                          "bg-rust/20 text-rust"
                        }`}>{u.status}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-ecru/60">{u.file_size_kb || 0} KB</td>
                      <td className="px-4 py-3 text-ecru/60">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDeleteUpload(u.id, u.image_url)} className="text-ecru/40 hover:text-rust transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Added Contact Messages Data Table Section Below */}
        <div className="mt-12">
          <h2 className="mb-4 font-display text-lg">Incoming Contact Messages</h2>
          <div className="overflow-hidden rounded-lg border border-surface bg-surface/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface/50 text-ecru/50">
                <tr>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Sender</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {contactMessages.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-ecru/40 italic">No contact messages received yet.</td>
                  </tr>
                ) : (
                  contactMessages.map((msg) => (
                    <tr key={msg.id || msg.created_at} className="hover:bg-surface/30">
                      <td className="px-4 py-3 font-medium">{msg.name || "Anonymous"}</td>
                      <td className="px-4 py-3 font-mono text-gold/90">{msg.email}</td>
                      <td className="px-4 py-3 max-w-xs truncate text-ecru/80" title={msg.message}>
                        {msg.message}
                      </td>
                      <td className="px-4 py-3 text-ecru/60 text-xs">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}