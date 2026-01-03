"use client";

import { disconnectAllRepositories } from "@/module/settings/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDisconnectAllRepositories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectAllRepositories,

    // 🔥 OPTIMISTIC CLEAR
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["connected-repositories"],
      });

      const previousRepos = queryClient.getQueryData<any[]>([
        "connected-repositories",
      ]);

      queryClient.setQueryData(["connected-repositories"], []);

      return { previousRepos };
    },

    // ❌ ROLLBACK
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
