"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMonthlySummary } from "@/module/analytics/hooks";

export function MonthlySummary() {
  const { data, isPending } = useMonthlySummary();

  if (isPending) {
    return (
      <Card>
        <CardContent>Loading…</CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Month</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Item label="Total Reviews" value={data.reviews} />
        <Item label="Completed" value={data.completed} />
        <Item label="Failed" value={data.failed} />
        <Item
          label="In Progress"
          value={data.reviews - data.completed - data.failed}
        />
      </CardContent>
    </Card>
  );
}

function Item({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
