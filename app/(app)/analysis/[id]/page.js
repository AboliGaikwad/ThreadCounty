"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, Share2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AnalysisPage() {
  const { id } = useParams();
  const [upload, setUpload] = useState(null);
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | analyzing | done | error

  useEffect(() => {
    async function load() {
      const { data: uploadData } = await supabase.from("uploads").select("*").eq("id", id).single();
      if (!uploadData) { setStatus("error"); return; }
      setUpload(uploadData);

      const { data: signed } = await supabase.storage
        .from("fabric-images")
        .createSignedUrl(uploadData.image_url, 3600);
      setImageUrl(signed?.signedUrl);

      const { data: existingResult } = await supabase
        .from("analysis_results")
        .select("*")
        .eq("upload_id", id)
        .single();

      if (existingResult) {
        setResult(existingResult);
        setStatus("done");
        return;
      }

      // 3. No existing result — call FastAPI with the actual image
      setStatus("analyzing");
      const imageResponse = await fetch(signed.signedUrl);
      const imageBlob = await imageResponse.blob();

      const formData = new FormData();
      formData.append("file", imageBlob, uploadData.file_name);

      const analysisResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analysis/analyze/${id}`,
        { method: "POST", body: formData },
      );

      if (!analysisResponse.ok) {
        setStatus("error");
        return;
      }

      const analysisData = await analysisResponse.json();
      setResult(analysisData);
      setStatus("done");
    }
    load();
  }, [id]);

  if (status === "loading" || status === "analyzing") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ecru/60">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="mt-4 text-sm">Analyzing your swatch…</p>
      </div>
    );
  }

  if (status === "error" || !upload) {
    return <p className="text-rust">Could not find this report.</p>;
  }

  const fields = [
    { label: "Fabric type", value: result.fabric_type },
    { label: "Thread density", value: `${result.thread_density} /in²` },
    { label: "Warp count", value: result.warp_count },
    { label: "Weft count", value: result.weft_count },
    { label: "Confidence score", value: `${result.confidence_score}%` },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl">Analysis report</h1>
      <p className="mt-1 text-sm text-ecru/60">{upload.file_name}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <img
          src={imageUrl}
          alt={upload.file_name}
          className="w-full rounded-lg border border-surface object-cover"
        />

        <div className="grid grid-cols-2 gap-3">
          {fields.map((f) => (
            <div
              key={f.label}
              className="relative rounded-md border border-dashed border-ecru/25 bg-surface p-4"
            >
              <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-ink ring-1 ring-ecru/30" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-ecru/50">
                {f.label}
              </p>
              <p className="mt-1 font-display text-lg text-gold">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-surface bg-surface/30 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">
          AI suggestions
        </p>
        <p className="mt-2 text-sm text-ecru/80">{result.ai_suggestions}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/pdf`}
          download
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold/90"
        >
          <Download className="h-4 w-4" /> Download report
        </a>
        <button className="flex items-center gap-2 rounded-full border border-ecru/20 px-5 py-2.5 text-sm hover:border-gold hover:text-gold">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  );
}