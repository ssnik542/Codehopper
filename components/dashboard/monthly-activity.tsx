"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyActivity } from "@/module/dashboard/action";
import { MonthlyActivityTooltip } from "@/components/dashboard/monthly-activity-tooltip";
import { ChartSkeleton } from "@/components/dashboard/chart-skeleton";

export function MonthlyActivityChart() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: () => getMonthlyActivity(),
    refetchOnWindowFocus: false,
  });

  return (
    <Card className="bg-black border-white/10">
      <CardHeader>
        <CardTitle className="text-gray-400">Activity Overview</CardTitle>
        <CardDescription className="text-gray-500">
          Summary of your monthly commits, PRs, and reviews
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[320px]">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<MonthlyActivityTooltip />} />
              <Legend />
              <Bar dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prs" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reviews" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
