"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

type ReviewLike = {
  status: string;
  review: string;
};

function getEffectiveStatus(review: ReviewLike) {
  if (review.status === "completed" && !review.review?.trim()) {
    return "processing";
  }

  if (review.status === "failed") {
    return "failed";
  }

  if (review.status === "pending") {
    return "pending";
  }

  return review.status;
}

/* -------------------------------- */
/* 1. KPI STATS                      */
/* -------------------------------- */
export async function getAnalyticsKPIs() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const reviews = await prisma.review.findMany({
    where: {
      repository: {
        userId: session.user.id,
      },
    },
    select: {
      status: true,
      review: true,
    },
  });

  let completed = 0;

  reviews.forEach((r) => {
    if (getEffectiveStatus(r) === "completed") {
      completed++;
    }
  });

  const repos = await prisma.repository.count({
    where: {
      userId: session.user.id,
    },
  });

  return {
    reviews: reviews.length,
    repos,
    prsReviewed: completed,
    hoursSaved: Math.round(completed * 0.35),
  };
}

/* -------------------------------- */
/* 2. REVIEWS OVER TIME              */
/* -------------------------------- */
export async function getReviewsOverTime() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const reviews = await prisma.review.findMany({
    where: {
      repository: {
        userId: session.user.id,
      },
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
    },
  });

  const map: Record<string, number> = {};

  reviews.forEach((r) => {
    const day = r.createdAt.toISOString().split("T")[0];
    map[day] = (map[day] ?? 0) + 1;
  });

  return Object.entries(map).map(([date, count]) => ({
    date,
    count,
  }));
}

/* -------------------------------- */
/* 3. REVIEW STATUS BREAKDOWN        */
/* -------------------------------- */
export async function getReviewStatusStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const reviews = await prisma.review.findMany({
    where: {
      repository: {
        userId: session.user.id,
      },
    },
    select: {
      status: true,
      review: true,
    },
  });

  const stats = {
    completed: 0,
    processing: 0,
    pending: 0,
    failed: 0,
  };

  reviews.forEach((r) => {
    const s = getEffectiveStatus(r);
    stats[s as keyof typeof stats]++;
  });

  return stats;
}

/* -------------------------------- */
/* 4. REPO USAGE TABLE               */
/* -------------------------------- */
export async function getRepoUsageStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const repos = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      reviews: {
        select: {
          createdAt: true,
        },
      },
    },
  });

  return repos.map((repo) => ({
    name: `${repo.owner}/${repo.name}`,
    reviews: repo.reviews.length,
    lastReview: repo.reviews.at(-1)?.createdAt ?? null,
  }));
}

/* -------------------------------- */
/* 5. MONTHLY SUMMARY                */
/* -------------------------------- */
export async function getMonthlySummary() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const startOfMonth = new Date();
  startOfMonth.setDate(1);

  const reviews = await prisma.review.findMany({
    where: {
      repository: {
        userId: session.user.id,
      },
      createdAt: {
        gte: startOfMonth,
      },
    },
    select: {
      status: true,
      review: true,
    },
  });

  let completed = 0;
  let failed = 0;

  reviews.forEach((r) => {
    const s = getEffectiveStatus(r);
    if (s === "completed") completed++;
    if (s === "failed") failed++;
  });

  return {
    reviews: reviews.length,
    completed,
    failed,
  };
}
