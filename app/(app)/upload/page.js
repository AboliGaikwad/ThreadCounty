"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const validateAndSetFile = (selectedFile) => {
    setError("");
    if (!selectedFile) return;
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  }, []);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(10);

    const { data: { user } } = await supabase.auth.getUser();
    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    setProgress(40);
    const { error: uploadError } = await supabase.storage
      .from("fabric-images")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    setProgress(70);
    const { data: insertData, error: insertError } = await supabase
      .from("uploads")
      .insert({
        user_id: user.id,
        image_url: filePath,
        file_name: file.name,
        file_size_kb: Math.round(file.size / 1024),
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setUploading(false);
      return;
    }

    await supabase.from("activity_log").insert({
      user_id: user.id,
      action: "upload",
      description: `Uploaded ${file.name}`,
    });

    setProgress(100);
    router.push(`/analysis/${insertData.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl">Upload a swatch</h1>
      <p className="mt-1 text-sm text-ecru/60">JPG, JPEG, or PNG — up to {MAX_SIZE_MB}MB.</p>

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-16 text-center transition-colors ${
            isDragging ? "border-gold bg-surface/50" : "border-ecru/25 bg-surface/20"
          }`}
        >
          <UploadCloud className="h-10 w-10 text-gold" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-ecru/70">Drag & drop your fabric photo here</p>
          <p className="mt-1 text-xs text-ecru/40">or</p>
          <label className="mt-4 cursor-pointer rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold/90">
            Browse files
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => validateAndSetFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-surface bg-surface/30 p-4">
          <div className="flex items-start gap-4">
            <img src={preview} alt="Preview" className="h-24 w-24 rounded-md object-cover" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm">
                  <ImageIcon className="h-4 w-4 text-gold" strokeWidth={1.5} />
                  {file.name}
                </p>
                {!uploading && (
                  <button onClick={handleRemove} className="text-ecru/40 hover:text-rust">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-ecru/50">{Math.round(file.size / 1024)} KB</p>

              {uploading && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink">
                  <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rust">{error}</p>}

      {preview && !uploading && (
        <button onClick={handleUpload} className="mt-6 w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90">
          Analyze this swatch
        </button>
      )}
    </div>
  );
}