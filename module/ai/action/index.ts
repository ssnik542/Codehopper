"use server";

import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { getPullRequestDetailsWithDiff } from "@/module/github/lib/github";
import {
  canCreateReview,
  incrementReviewCount,
} from "@/module/payment/lib/subscription";

export async function reviewPullRequest(
  owner: string,
  repo: string,
  prNumber: number
) {
  try {
    const repository = await prisma.repository.findFirst({
      where: {
        owner,
        name: repo,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repository || !repository.user.accounts[0]) {
      throw new Error("Repository or GitHub account not found");
    }

    const canReview = await canCreateReview(repository.user.id, repository.id);
    if (!canReview) {
      throw new Error(
        "Review limit reached for thi repository.Please upgrade to Pro for unlimited review"
      );
    }
    const githubAccount = repository.user.accounts[0];
    if (!githubAccount?.accessToken) {
      throw new Error("No github token found");
    }

    const prData = await getPullRequestDetailsWithDiff(
      githubAccount?.accessToken,
      owner,
      repo,
      prNumber
    );

    await inngest.send({
      name: "pr.review.requested",
      data: {
        owner,
        repo,
        prNumber,
        userId: repository.user.id,
      },
    });

    await incrementReviewCount(repository.user.id, repository.id);
    return {
      success: true,
      message: "Pr queued",
    };
  } catch (error) {
    try {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repo,
        },
      });

      if (!repository) return;

      await prisma.review.create({
        data: {
          repositoryId: repository.id,
          prNumber,
          prTitle: "Failed to fetch PR",
          prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
          review: "The pull request could not be fetched or processed.",
          status: "failed",
        },
      });
    } catch (error) {
      console.error("Failed to record PR review failure:", error);
    }
  }
}
