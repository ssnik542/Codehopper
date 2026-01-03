"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/module/settings/actions";

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name ?? "");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    try {
      await updateUserProfile({ name });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* AVATAR */}
      <div className="flex items-center gap-4">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User avatar"}
            width={64}
            height={64}
            className="rounded-full border border-white/10"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-lg font-medium text-white">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}

        <div className="text-sm text-gray-400">
          <p className="text-white font-medium">
            {user.name ?? "Unnamed User"}
          </p>
          <p>{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Avatar is synced from GitHub
          </p>
        </div>
      </div>

      {/* NAME */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-black border-white/10  text-gray-200"
        />
      </div>

      {/* EMAIL (READ ONLY) */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Email</label>
        <Input
          value={user.email}
          disabled
          className="bg-black border-white/10 opacity-70 text-gray-200"
        />
        <p className="text-xs text-gray-500">
          Email is managed by your authentication provider.
        </p>
      </div>

      {/* ACTION */}
      <div className="pt-2">
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
