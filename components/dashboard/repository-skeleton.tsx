import { Skeleton } from "@/components/ui/skeleton";

export function RepositorySkeleton() {
  return (
    <div className="rounded-lg border border-white/10 bg-black p-5 space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
