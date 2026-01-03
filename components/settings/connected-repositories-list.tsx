"use client";

import { Trash2 } from "lucide-react";
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
import { useConnectedRepositories } from "@/module/repository/hooks/use-connected-repositories";
import { useDisconnectRepository } from "@/module/repository/hooks/use-disconnect-repository";

export function ConnectedRepositoriesList() {
  const { data = [], isPending } = useConnectedRepositories();
  const { mutate, isPending: isDisconnecting } = useDisconnectRepository();

  if (isPending) {
    return (
      <div className="text-sm text-gray-400">
        Loading connected repositories…
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-sm text-gray-500">No repositories connected.</div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((repo) => (
        <div
          key={repo.id}
          className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2"
        >
          <span className="text-sm text-white">{repo.fullName}</span>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" disabled={isDisconnecting}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-black border border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect repository?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the GitHub webhook and stop AI reviews for
                  this repository.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDisconnecting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDisconnecting}
                  onClick={() => mutate({ repositoryId: repo.id })}
                >
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
