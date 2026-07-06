"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Download, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function HistoryPage() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("uploads")
        .select("*, analysis_results(*)")
        .order("created_at", { ascending: false });
      setReports(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (uploadId, imagePath) => {
    if (!confirm("Delete this report? This cannot be undone.")) return;
    await supabase.storage.from("fabric-images").remove([imagePath]);
    await supabase.from("uploads").delete().eq("id", uploadId);
    setReports((prev) => prev.filter((r) => r.id !== uploadId));
  };

  const filtered = reports.filter((r) => {
    const matchesSearch = r.file_name.toLowerCase().includes(search.toLowerCase());
    const fabricType = r.analysis_results?.[0]?.fabric_type;
    const matchesFilter = filterType === "all" || fabricType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <p className="text-ecru/50">Loading history…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl">Upload history</h1>
      <p className="mt-1 text-sm text-ecru/60">{reports.length} total reports</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ecru/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name…"
            className="w-full rounded-md border border-surface bg-surface/30 py-2.5 pl-10 pr-4 text-sm placeholder:text-ecru/40 focus:border-gold focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-md border border-surface bg-surface/30 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        >
          <option value="all">All fabric types</option>
          <option value="Cotton Twill">Cotton Twill</option>
          <option value="Linen Blend">Linen Blend</option>
          <option value="Denim">Denim</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface/50 text-ecru/50">
            <tr>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">File</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Fabric type</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-surface/30">
                <td className="px-4 py-3">
                  <Link href={`/analysis/${r.id}`} className="hover:text-gold">{r.file_name}</Link>
                </td>
                <td className="px-4 py-3 text-ecru/70">{r.analysis_results?.[0]?.fabric_type || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    r.status === "complete" ? "bg-sage/20 text-sage" : "bg-rust/20 text-rust"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ecru/60">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button className="text-ecru/40 hover:text-gold"><Download className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(r.id, r.image_url)} className="text-ecru/40 hover:text-rust">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-4 py-8 text-center text-sm text-ecru/40">No reports match your search.</p>}
      </div>
    </div>
  );
}