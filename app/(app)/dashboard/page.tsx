import { requireAuth } from "@/module/auth/utils/auth-utils";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MonthlyActivityChart } from "@/components/dashboard/monthly-activity";
import { ContributionHeatmap } from "@/components/dashboard/contribution-heatmap";

export default async function DashboardPage() {
  await requireAuth();
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of repositories, PRs, and reviews.
        </p>
      </div>
      <StatsCards />
      <ContributionHeatmap />
      <MonthlyActivityChart />
      {/* <div className="grid gap-8 md:grid-cols-2">
        <MonthlyActivityChart />
        <ContributionHeatmap />
      </div> */}
    </div>
  );
}
