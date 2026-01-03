"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useReviewStatusStats } from "@/module/analytics/hooks";

export function ReviewStatusBreakdown() {
  const { data, isPending } = useReviewStatusStats();

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Status</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Loading…
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <StatusRow label="Completed" count={data.completed} variant="success" />
        <StatusRow
          label="Processing"
          count={data.processing}
          variant="processing"
        />
        <StatusRow label="Pending" count={data.pending} variant="pending" />
        <StatusRow label="Failed" count={data.failed} variant="failed" />
      </CardContent>
    </Card>
  );
}

function StatusRow({
  label,
  count,
  variant,
}: {
  label: string;
  count: number;
  variant: "success" | "processing" | "pending" | "failed";
}) {
  const styles = {
    success: "border-green-500/30 text-green-500",
    pending: "border-yellow-500/30 text-yellow-500",
    failed: "border-red-500/30 text-red-500",
    processing: "border-blue-500/30 text-blue-500",
  };

  return (
    <div className="flex items-center justify-between">
      <Badge variant="outline" className={styles[variant]}>
        {variant === "processing" && (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        )}
        {label}
      </Badge>
      <span className="font-medium">{count}</span>
    </div>
  );
}
