"use client";

import { disconnectRepository } from "@/module/settings/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDisconnectRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectRepository,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ repositoryId }) => {
      await queryClient.cancelQueries({
        queryKey: ["connected-repositories"],
      });

      const previousRepos = queryClient.getQueryData<any[]>([
        "connected-repositories",
      ]);

      queryClient.setQueryData(["connected-repositories"], (old: any[] = []) =>
        old.filter((repo) => repo.id !== repositoryId)
      );

      return { previousRepos };
    },

    // ❌ ROLLBACK ON ERROR
    onError: (_err, _vars, context) => {
      if (context?.previousRepos) {
        queryClient.setQueryData(
          ["connected-repositories"],
          context.previousRepos
        );
      }
    },

    // 🔄 FINAL SYNC
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["connected-repositories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },
  });
}
