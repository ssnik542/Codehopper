"use client";

import { getConnectedRepositories } from "@/module/settings/actions";
import { useQuery } from "@tanstack/react-query";

export function useConnectedRepositories() {
  return useQuery({
    queryKey: ["connected-repositories"],
    queryFn: getConnectedRepositories,
  });
}
