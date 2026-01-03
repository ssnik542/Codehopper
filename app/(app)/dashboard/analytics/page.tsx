import { AnalyticsKPIs } from "@/components/analytics/analytics-kpis";
import { MonthlySummary } from "@/components/analytics/monthly-summary";
import { RepoUsageTable } from "@/components/analytics/repo-usage-table";
import { ReviewStatusBreakdown } from "@/components/analytics/review-status-breakdown";
import { ReviewsOverTime } from "@/components/analytics/reviews-over-time";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Insights into your AI-powered code reviews.
        </p>
      </div>

      <AnalyticsKPIs />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewsOverTime />
        <ReviewStatusBreakdown />
      </div>

      <RepoUsageTable />

      <MonthlySummary />
    </div>
  );
}
