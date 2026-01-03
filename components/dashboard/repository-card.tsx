"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  Star,
  Lock,
  ExternalLink,
  Plug,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "../ui/badge";

type Repository = {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  stars?: number;
  private: boolean;
  defaultBranch?: string;
  language?: string;
  topics: string[];
  isConnected?: boolean;
};

export function RepositoryCard({
  repo,
  onToggleConnect,
  localConnectingId,
}: {
  repo: Repository;
  onToggleConnect?: (repo: Repository) => void;
  localConnectingId: string | null;
}) {
  return (
    <Card className="bg-black border-white/10 p-5 transition hover:bg-white/5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-3 items-center">
              <h3 className="truncate text-lg font-semibold text-white">
                {repo.name}
              </h3>
              {/* {repo.isConnected ? (
                <Badge variant={"outline"} className="text-white">
                  Connected
                </Badge>
              ) : null} */}
            </div>
            {repo.private && <Lock className="h-4 w-4 text-gray-400" />}

            {repo.isConnected && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>

          {repo.description && (
            <p className="mt-1 text-sm text-gray-400 line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant={repo.isConnected ? "secondary" : "default"}
            onClick={() => onToggleConnect?.(repo)}
            disabled={localConnectingId === repo.id || repo.isConnected}
            className="cursor-pointer"
          >
            <Plug className="h-4 w-4 mr-1" />
            {localConnectingId === repo.id
              ? "Connecting..."
              : repo.isConnected
              ? "Connected"
              : "Connect"}
          </Button>

          <Link
            href={repo.html_url}
            target="_blank"
            className="inline-flex items-center justify-center rounded-md border border-white/10 px-2.5 py-2 text-gray-400 hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* META */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          {repo.defaultBranch ?? "main"}
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {repo.stars ?? 0}
        </div>

        {repo.language && (
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            {repo.language}
          </div>
        )}
      </div>

      {/* TOPICS */}
      {repo.topics?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-300"
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 3 && (
            <span className="text-xs text-gray-500">
              +{repo.topics.length - 3} more
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
