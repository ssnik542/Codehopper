"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function GithubSection() {
  return (
    <Card className="bg-black border-white/10 p-6">
      <h2 className="text-lg font-semibold text-gray-200">
        GitHub Integration
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Manage your GitHub connection and repository access.
      </p>

      <div className="flex items-center gap-4">
        <Button variant="secondary">
          <Github className="h-4 w-4 mr-2" />
          Reconnect GitHub
        </Button>

        <span className="text-xs text-gray-500">
          Used for repository access and PR reviews
        </span>
      </div>
    </Card>
  );
}
