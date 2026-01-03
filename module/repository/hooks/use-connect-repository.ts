"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectRepository } from "../action";
import { toast } from "sonner";

export function useConnectRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      repo,
      owner,
      githubId,
    }: {
      repo: string;
      owner: string;
      githubId: number;
    }) => {
      await connectRepository(repo, owner, githubId);
    },
    onSuccess: () => {
      toast.success("Repository Connect Successfully");
      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },
    onError: (error) => {
      toast.error("Failed to connect repository");
      console.log(error);
    },
  });
}
