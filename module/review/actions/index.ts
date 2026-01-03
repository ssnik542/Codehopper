"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export async function getReviews() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const reviews = await prisma.review.findMany({
    where: {
      repository: {
        userId: session.user.id,
      },
    },
    include: {
      repository: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return reviews;
}

export async function getReviewById(reviewId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        // user : session.user.id, // 🔒 ownership check
        repository: {
          userId: session.user.id,
        },
      },
      include: {
        repository: {
          select: {
            id: true,
            name: true,
            owner: true,
          },
        },
      },
    });

    return review;
  } catch (error) {
    console.error("getReviewById error:", error);
    return null;
  }
}
