"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

type UsageProps = {
  tier: "FREE" | "PRO";
  reposUsed: number;
  reposLimit: number | "unlimited";
  reviewsUsed: number;
  reviewsLimit: number | "unlimited";
};

export function CurrentUsage({
  tier,
  reposUsed,
  reposLimit,
  reviewsUsed,
  reviewsLimit,
}: UsageProps) {
  const isPro = tier === "PRO";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Current Usage</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your plan limits and usage
          </p>
        </div>

        <Badge
          variant={isPro ? "default" : "outline"}
          className={isPro ? "bg-yellow-500 text-black" : ""}
        >
          {isPro && <Crown className="h-3 w-3 mr-1" />}
          {tier} PLAN
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Repositories */}
        <UsageRow
          label="Repositories Connected"
          used={reposUsed}
          limit={reposLimit}
        />

        {/* Reviews */}
        <UsageRow
          label="AI Reviews Generated"
          used={reviewsUsed}
          limit={reviewsLimit}
        />

        {/* Upgrade hint */}
        {/* {!isPro && (
          <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/40">
            <p className="text-sm text-muted-foreground">
              Upgrade to Pro for unlimited repositories and reviews.
            </p>
            <Button size="sm">Upgrade</Button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}

function UsageRow({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | "unlimited";
}) {
  const percentage =
    limit === "unlimited"
      ? 100
      : Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used} / {limit === "unlimited" ? "∞" : limit}
        </span>
      </div>

      <Progress value={percentage} />
    </div>
  );
}
