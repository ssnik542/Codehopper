"use client";

import { useEffect, useRef, useState } from "react";
import { RepositorySkeleton } from "./repository-skeleton";
import { RepositoryCard } from "./repository-card";
import { useRepositories } from "@/module/repository/hooks/use-repositories";
import { RepositorySearch } from "./repository-search";
import { RepositoryCardSkeleton } from "./RepositoryLoader";
import { useConnectRepository } from "@/module/repository/hooks/use-connect-repository";
import { useDisconnectRepository } from "@/module/repository/hooks/use-disconnect-repository";

export function RepositoriesList() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRepositories();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [localConnectingId, setLocalConnectingId] = useState<string | null>(
    null
  );
  const { mutate: connectRepo } = useConnectRepository();
  // const { mutate, isPending: isDisconnecting } = useDisconnectRepository();
  const onToggleConnect = (repo: any) => {
    setLocalConnectingId(repo.id);
    connectRepo(
      {
        owner: repo.full_name.split("/")[0],
        repo: repo.name,
        githubId: repo.id,
      },
      {
        onSettled: () => setLocalConnectingId(null),
      }
    );
  };
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <RepositorySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-400">Failed to load repositories.</div>
    );
  }

  const repos = data?.pages.flatMap((page) => page) ?? [];
  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
      repo.full_name.toLowerCase().includes(search.toLocaleLowerCase())
  );

  if (repos.length === 0) {
    return <div className="text-sm text-gray-400">No repositories found.</div>;
  }

  return (
    <>
      <RepositorySearch onSearch={setSearch} />
      <div className="space-y-4">
        {filteredRepos.map((repo: any) => (
          <RepositoryCard
            key={repo.id}
            repo={repo}
            onToggleConnect={onToggleConnect}
            localConnectingId={localConnectingId}
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="py-6 text-center text-gray-400">
        {true ? (
          <RepositoryCardSkeleton />
        ) : hasNextPage ? (
          "Scroll to load more"
        ) : (
          <p className="text-center text-muted-foreground">
            No More Repositories
          </p>
        )}
      </div>
    </>
  );
}
