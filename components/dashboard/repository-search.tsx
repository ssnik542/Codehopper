"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function RepositorySearch({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      onSearch(value.trim());
    }, 100);

    return () => clearTimeout(id);
  }, [value, onSearch]);

  return (
    <div className="relative max-w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search repositories…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 bg-black border-white/10 text-white"
      />
    </div>
  );
}
