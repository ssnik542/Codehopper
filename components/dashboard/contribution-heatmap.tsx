"use client";

import React, { useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getContributionStats } from "@/module/dashboard/action";
import { CalendarTooltip } from "@/components/ui/calendar-tooltip";
import { HeatmapSkeleton } from "@/components/dashboard/heatmap-skeleton";

export function ContributionHeatmap() {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    count: number;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["contribution-stats"],
    queryFn: () => getContributionStats(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-gray-400">GitHub Contributions</CardTitle>
          <CardDescription className="text-gray-500">
            Visualizing your commit activity over the past year
          </CardDescription>
        </CardHeader>
        <CardContent className="text-gray-400">
          <HeatmapSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="bg-black border-white/10 relative">
      <CardHeader>
        <CardTitle className="text-gray-400">GitHub Contributions</CardTitle>
        <CardDescription className="text-gray-500">
          Visualizing your commit activity over the past year
        </CardDescription>
      </CardHeader>

      <CardContent className="text-gray-400">
        <ActivityCalendar
          data={data.contributions.map((d: any) => ({
            date: d.date,
            count: d.count,
            level: d.level,
          }))}
          colorScheme="dark"
          blockSize={12}
          blockMargin={4}
          showWeekdayLabels
          theme={{
            dark: ["#1f2937", "#1e3a8a", "#1d4ed8", "#3b82f6", "#60a5fa"],
          }}
          renderBlock={(block, activity) =>
            React.cloneElement(block, {
              onMouseEnter: (e: React.MouseEvent<SVGRectElement>) => {
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  date: activity.date,
                  count: activity.count,
                });
              },
              onMouseMove: (e: React.MouseEvent<SVGRectElement>) => {
                setTooltip((prev) =>
                  prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                );
              },
              onMouseLeave: () => setTooltip(null),
            })
          }
        />

        <CalendarTooltip data={tooltip} />
      </CardContent>
    </Card>
  );
}
