"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type TooltipData = {
  x: number;
  y: number;
  date: string;
  count: number;
};

export function CalendarTooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;

  return createPortal(
    <div
      style={{
        top: data.y + 12,
        left: data.x + 12,
      }}
      className="fixed z-50 rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white shadow-xl"
    >
      <div className="font-medium">{data.count} commits</div>
      <div className="text-gray-400">{data.date}</div>
    </div>,
    document.body
  );
}
