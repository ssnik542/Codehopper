import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <div className="h-[320px] w-full flex items-end gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-full rounded-md"
          style={{
            height: `${40 + Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
  );
}
