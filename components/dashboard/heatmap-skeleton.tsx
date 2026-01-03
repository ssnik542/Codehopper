import { Skeleton } from "@/components/ui/skeleton";

export function HeatmapSkeleton() {
  return (
    <div className="space-y-3">
      {/* Month labels */}
      <div className="flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-10 rounded" />
        ))}
      </div>

      {/* Heatmap blocks */}
      <div className="grid grid-cols-12 gap-2">
        {Array.from({ length: 12 * 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
