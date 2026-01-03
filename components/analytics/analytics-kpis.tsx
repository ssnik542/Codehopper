"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAnalyticsKPIs } from "@/module/analytics/hooks";

export function AnalyticsKPIs() {
  const { data, isPending } = useAnalyticsKPIs();

  if (isPending) {
    return <div className="grid grid-cols-4 gap-4">Loading…</div>;
  }

  if (!data) return null;

  const items = [
    { label: "AI Reviews", value: data.reviews },
    { label: "Completed Reviews", value: data.prsReviewed },
    { label: "Repos Connected", value: data.repos },
    { label: "Est. Hours Saved", value: `${data.hoursSaved}h` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
