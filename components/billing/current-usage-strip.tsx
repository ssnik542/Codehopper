"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  tier: "FREE" | "PRO";
  reposUsed: number;
  reposLimit: number | "unlimited";
  reviewsLimit: number | "unlimited";
};

export function CurrentUsageStrip({
  tier,
  reposUsed,
  reposLimit,
  reviewsLimit,
}: Props) {
  return (
    <Card className="border border-white/10 px-6 py-4">
      <p className="text-sm text-muted-foreground mb-3">Current Usage</p>

      <div className="flex items-center justify-between gap-6">
        {/* Repositories */}
        <div>
          <p className="text-xs text-muted-foreground">Repositories</p>
          <Badge variant="outline" className="mt-1">
            {reposUsed} / {reposLimit === "unlimited" ? "∞" : reposLimit}
          </Badge>
        </div>

        {/* Reviews */}
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Reviews per Repository
          </p>
          <p className="text-sm font-medium mt-1">
            {reviewsLimit === "unlimited" ? "Unlimited" : reviewsLimit}
          </p>
          <p className="text-xs text-muted-foreground">No limits on reviews</p>
        </div>
      </div>
    </Card>
  );
}
