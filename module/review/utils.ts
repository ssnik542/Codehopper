// module/review/utils.ts
export function getEffectiveStatus(review: { status: string; review: string }) {
  if (review.status === "completed" && !review.review?.trim()) {
    return "processing";
  }
  if (review.status === "failed") return "failed";
  if (review.status === "pending") return "pending";
  return review.status;
}
