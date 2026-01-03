"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRepoUsageStats } from "@/module/analytics/hooks";

function formatRelative(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function RepoUsageTable() {
  const { data, isPending } = useRepoUsageStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Usage</CardTitle>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <div className="text-sm text-muted-foreground">
            Loading repositories…
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No repositories connected yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead className="text-right">Reviews</TableHead>
                <TableHead className="text-right">PRs</TableHead>
                <TableHead>Last Review</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((repo) => (
                <TableRow key={repo.name}>
                  <TableCell className="font-medium">{repo.name}</TableCell>

                  <TableCell className="text-right">{repo.reviews}</TableCell>

                  <TableCell className="text-right">{repo.reviews}</TableCell>

                  <TableCell className="text-muted-foreground">
                    {repo.lastReview ? formatRelative(repo.lastReview) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
