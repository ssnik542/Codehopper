"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ConnectedRepositoriesList } from "./connected-repositories-list";
import { useDisconnectAllRepositories } from "@/module/repository/hooks/use-disconnect-all-repositories";

export function DangerZone() {
  const { mutate, isPending } = useDisconnectAllRepositories();

  return (
    <Card className="border border-red-500/20 bg-black p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-red-400">
          Repository Access
        </h2>
        <p className="text-sm text-gray-400">
          Manage connected GitHub repositories.
        </p>
      </div>

      <ConnectedRepositoriesList />

      {/* DISCONNECT ALL */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isPending}>
            {isPending ? "Disconnecting…" : "Disconnect All Repositories"}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="bg-black border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect all repositories?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all GitHub webhooks and stop AI reviews across
              every connected repository. You can reconnect them later.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
              onClick={() => mutate()}
            >
              Yes, disconnect all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
