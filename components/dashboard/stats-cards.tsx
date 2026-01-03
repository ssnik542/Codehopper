"use client";

import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/module/dashboard/action";

const items = [
  {
    key: "totalCommits",
    label: "Total Commits",
    icon: GitCommit,
  },
  {
    key: "totalPRs",
    label: "Pull Requests",
    icon: GitPullRequest,
  },
  {
    key: "totalReviews",
    label: "AI Reviews",
    icon: MessageSquare,
  },
  {
    key: "totalRepos",
    label: "Repositories",
    icon: GitBranch,
  },
];

export function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} className="bg-black border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {item.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-blue-500" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-gray-300">
                {isLoading ? "—" : (data as any)?.[item.key]}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
