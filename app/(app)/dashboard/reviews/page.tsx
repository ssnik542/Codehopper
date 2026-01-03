import Link from "next/link";
import { getReviews } from "@/module/review/actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEffectiveStatus } from "@/module/review/utils";
import { ReviewStatusBadge } from "@/components/review/status-badge";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Code Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Automatically generated pull request reviews for your repositories
        </p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
function ReviewCard({ review }: { review: any }) {
  const effectiveStatus = getEffectiveStatus(review);
  return (
    <Card className="border border-border/60 bg-black text-gray-200">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">
              {review.repository.owner}/{review.repository.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              PR #{review.prNumber} • {review.prTitle}
            </p>
          </div>

          <ReviewStatusBadge status={effectiveStatus} />
        </div>
      </CardHeader>

      <Separator />

      {/* AI Review Content */}
      <CardContent className="pt-4">
        <div className="rounded-lg bg-muted/40 p-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-5">
            {review.review}
          </p>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Reviewed on {new Date(review.createdAt).toLocaleDateString()}
        </span>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-black text-gray-200"
          >
            <Link href={review.prUrl} target="_blank">
              View PR
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href={`/dashboard/reviews/${review.id}`}>
              View Full Review
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-16 text-center space-y-3">
        <p className="text-sm font-medium">No AI reviews yet</p>
        <p className="text-xs text-muted-foreground">
          Reviews will appear automatically when pull requests are opened on
          connected repositories.
        </p>
      </CardContent>
    </Card>
  );
}
