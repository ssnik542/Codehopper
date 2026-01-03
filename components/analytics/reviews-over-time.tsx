"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useReviewsOverTime } from "@/module/analytics/hooks";

export function ReviewsOverTime() {
  const { data, isPending } = useReviewsOverTime();

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] flex items-center justify-center text-muted-foreground">
          Loading chart…
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] flex items-center justify-center text-muted-foreground">
          No reviews generated yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews Over Time</CardTitle>
      </CardHeader>

      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => v.slice(5)} // MM-DD
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              allowDecimals={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
