"use server";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { createWebhook, getRepositories } from "@/module/github/lib/github";
import {
  canConnectRepository,
  incrementRepositoryCount,
} from "@/module/payment/lib/subscription";
import { headers } from "next/headers";

export const fetchRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("User is not authenticated");
    }
    const githubRepositories = await getRepositories(page, perPage);
    const dbRepositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });
    const dbRepoNames = new Set(
      dbRepositories.map((repo: any) => repo.githubId)
    );
    const mergedRepositories = githubRepositories.map((repo: any) => ({
      ...repo,
      isConnected: dbRepoNames.has(BigInt(repo.id)),
    }));
    return mergedRepositories;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return { error: "Failed to fetch repositories" };
  }
};

export async function connectRepository(
  repo: string,
  owner: string,
  githubId: number
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Todo :check
  const canConnect = await canConnectRepository(session.user.id);
  if (!canConnect) {
    throw new Error("Repository limit reached");
  }

  const webhook = await createWebhook({ owner, repo });

  if (webhook) {
    await prisma.repository.create({
      data: {
        githubId: BigInt(githubId),
        name: repo,
        owner: owner,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId: session.user.id,
      },
    });
  }

  // increement repo count
  await incrementRepositoryCount(session.user.id);

  // trigger repo indexing for rag
  try {
    await inngest.send({
      name: "repository.connected",
      data: {
        owner,
        repo,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return webhook;
}
