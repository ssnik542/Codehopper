import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { ContributionCalendar, ContributionResponse } from "./types";

export const getGithubToken = async (): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("User is not authenticated");
  }
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });
  if (!account?.accessToken) {
    throw new Error("GitHub access token not found");
  }
  return account.accessToken;
};

export async function fetchUserContribution(
  token: string,
  username: string
): Promise<ContributionCalendar | null> {
  try {
    const octokit = new Octokit({ auth: token });
    const response = await octokit.graphql<ContributionResponse>(
      `
        query ($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    color
                  }
                }
              }
            }
          }
        }
      `,
      { username }
    );
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return null;
  }
}

export async function getRepositories(page: number = 1, perPage: number = 10) {
  try {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      page,
      per_page: perPage,
      sort: "updated",
      direction: "desc",
      visibility: "all",
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error);
    return [];
  }
}

export async function createWebhook({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: process.env.GITHUB_ADMIN_TOKEN });

  const webhookUrl = `${process.env.APP_BASE_URL}/api/webhooks/github`;

  const { data: hooks } = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
  });

  const normalize = (url: string) => url.replace(/\/$/, "");

  const existingHook = hooks.find(
    (hook) =>
      hook.config?.url && normalize(hook.config.url) === normalize(webhookUrl)
  );

  if (existingHook) {
    return existingHook;
  }

  const { data } = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    name: "web",
    active: true,
    events: ["pull_request", "push"],
    config: {
      url: webhookUrl,
      content_type: "json",
      insecure_ssl: "0",
    },
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return data;
}

type DeleteWebhookInput = {
  owner: string;
  repo: string;
  webhookId?: number; // preferred
};

export async function deleteWebhook({
  owner,
  repo,
  webhookId,
}: DeleteWebhookInput) {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_ADMIN_TOKEN,
    });

    /* ---------------- DELETE BY ID (BEST PATH) ---------------- */
    if (webhookId) {
      await octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: webhookId,
      });

      return { success: true, deleted: true };
    }

    /* ---------------- FALLBACK: FIND BY URL ---------------- */
    const webhookUrl = `${process.env.APP_BASE_URL}/api/webhooks/github`;
    const normalize = (url: string) => url.replace(/\/$/, "");

    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const existingHook = hooks.find(
      (hook) =>
        hook.config?.url && normalize(hook.config.url) === normalize(webhookUrl)
    );

    if (!existingHook) {
      // Idempotent: already deleted
      return { success: true, deleted: false };
    }

    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: existingHook.id,
    });

    return { success: true, deleted: true };
  } catch (error) {
    console.error("deleteWebhook error:", error);
    throw new Error("Failed to delete webhook");
  }
}

export async function getRepoFileContents(
  token: string,
  owner: string,
  repo: string,
  path: string = ""
): Promise<{ path: string; content: string }[]> {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

  // Handle single file case
  if (!Array.isArray(data)) {
    if (data.type === "file" && data.content) {
      return [
        {
          path: data.path,
          content: Buffer.from(data.content, "base64").toString("utf-8"),
        },
      ];
    }
    return [];
  }

  let files: { path: string; content: string }[] = [];

  for (const item of data) {
    if (item.type === "file") {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: item.path,
      });

      if (
        !Array.isArray(fileData) &&
        fileData.type === "file" &&
        fileData.content
      ) {
        // Filter out non-text / binary files
        if (!item.path.match(/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz)$/i)) {
          files.push({
            path: item.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
          });
        }
      }
    } else if (item.type === "dir") {
      const subFiles = await getRepoFileContents(token, owner, repo, item.path);

      files = files.concat(subFiles);
    }
  }

  return files;
}

export async function getPullRequestDetailsWithDiff(
  githubToken: string,
  owner: string,
  repo: string,
  prNumber: number
): Promise<{
  title: string;
  description: string;
  diff: string;
}> {
  const octokit = new Octokit({
    auth: githubToken,
  });

  // Fetch pull request metadata
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  // Fetch PR diff
  const { data: diff } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: {
      format: "diff",
    },
  });

  return {
    title: pullRequest.title,
    description: pullRequest.body || "",
    diff: diff as unknown as string,
  };
}

export async function postReviewComment(
  githubToken: string,
  owner: string,
  repo: string,
  prNumber: number,
  reviewBody: string
) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ADMIN_TOKEN,
  });

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `## 🤖 AI Code Review ### Summary \n\n${reviewBody}\n\n---\n*Powered by CodeHopper`,
    event: "COMMENT", // COMMENT | APPROVE | REQUEST_CHANGES
  });
}
