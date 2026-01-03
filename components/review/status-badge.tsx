import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type Props = {
  status: "pending" | "processing" | "completed" | "failed";
};

export function ReviewStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "processing":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-blue-500/30 text-blue-500"
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </Badge>
      );

    case "completed":
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-500">
          Completed
        </Badge>
      );

    case "failed":
      return (
        <Badge variant="outline" className="border-red-500/30 text-red-500">
          Failed
        </Badge>
      );

    default:
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/30 text-yellow-500"
        >
          Pending
        </Badge>
      );
  }
}
