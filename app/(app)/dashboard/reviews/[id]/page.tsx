import Link from "next/link";
import { notFound } from "next/navigation";
import { getReviewById } from "@/module/review/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEffectiveStatus } from "@/module/review/utils";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {review.repository.owner}/{review.repository.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            PR #{review.prNumber} • {review.prTitle}
          </p>
        </div>

        <StatusBadge status={review.status} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Reviewed on {new Date(review.createdAt).toLocaleDateString()}
        </span>

        <Link
          href={review.prUrl}
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          View Pull Request →
        </Link>
      </div>

      <Separator />

      {/* AI Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Code Review</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-muted/40 p-6">
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {review.review}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer actions */}
      <div className="flex justify-between pt-4">
        <Button asChild variant="outline" className="bg-black">
          <Link href="/dashboard/reviews">← Back to Reviews</Link>
        </Button>

        <Button asChild>
          <Link href={review.prUrl} target="_blank">
            Open PR on GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Badge variant="outline" className={map[status] ?? ""}>
      {status.toUpperCase()}
    </Badge>
  );
}
