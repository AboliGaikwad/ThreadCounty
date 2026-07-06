"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setFullName(data.user?.user_metadata?.full_name || "");
      setAvatarPreview(data.user?.user_metadata?.avatar_url || null);
    });
  }, []);

  const handleAvatarChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setStatus("saving");

    let avatarUrl = user.user_metadata?.avatar_url;
    if (avatarFile) {
      const path = `${user.id}/avatar-${Date.now()}-${avatarFile.name}`;
      await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 31536000);
      avatarUrl = signed?.signedUrl;
    }

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: avatarUrl },
    });
    setStatus(error ? "error" : "saved");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus("saving-password");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setStatus(error ? "error" : "password-saved");
    setNewPassword("");
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm("This permanently deletes your account and all data. Continue?")
    )
      return;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user.id}?user_id=${user.id}`,
      { method: "DELETE" },
    );

    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <p className="text-ecru/50">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl">Profile</h1>

      <form onSubmit={handleSaveProfile} className="mt-8 space-y-4">
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface font-display text-xl text-gold">
              {fullName?.[0] || "?"}
            </div>
          )}
          <label className="cursor-pointer rounded-full border border-ecru/20 px-4 py-2 text-sm hover:border-gold hover:text-gold">
            Change photo
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-md border border-surface bg-surface/30 px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
        <input
          value={user.email}
          disabled
          className="w-full rounded-md border border-surface bg-surface/10 px-4 py-3 text-sm text-ecru/40"
        />
        <button type="submit" className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink hover:bg-gold/90">
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && <p className="text-sm text-sage">Profile updated.</p>}
      </form>

      <form onSubmit={handleChangePassword} className="mt-10 space-y-4 border-t border-surface pt-8">
        <p className="font-mono text-xs uppercase tracking-wider text-ecru/50">Change password</p>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          minLength={6}
          className="w-full rounded-md border border-surface bg-surface/30 px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
        <button type="submit" className="rounded-full border border-ecru/20 px-6 py-2.5 text-sm hover:border-gold hover:text-gold">
          {status === "saving-password" ? "Updating…" : "Update password"}
        </button>
        {status === "password-saved" && <p className="text-sm text-sage">Password updated.</p>}
      </form>

      <div className="mt-10 border-t border-rust/20 pt-8">
        <p className="font-mono text-xs uppercase tracking-wider text-rust">Danger zone</p>
        <button onClick={handleDeleteAccount} className="mt-3 rounded-full border border-rust px-5 py-2.5 text-sm text-rust hover:bg-rust/10">
          Delete account
        </button>
      </div>
    </div>
  );
}