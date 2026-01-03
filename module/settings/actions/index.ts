"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { deleteWebhook } from "@/module/github/lib/github";

type DisconnectRepoInput = {
  repositoryId: string;
};

type UpdateProfileInput = {
  name?: string;
  email?: string;
};

export async function getUserProfile() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateUserProfile(data: UpdateProfileInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { image: data.email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    return updatedUser;
  } catch (error) {
    console.error("updateUserProfile error:", error);
    return null;
  }
}

export async function getConnectedRepositories() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
      },
    });

    return repositories;
  } catch (error) {
    console.error("getConnectedRepositories error:", error);
    return [];
  }
}

export async function disconnectRepository({
  repositoryId,
}: DisconnectRepoInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const repo = await prisma.repository.findFirst({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    if (!repo) {
      // Idempotent: already disconnected or not found
      return { success: true };
    }

    /* -------- DELETE WEBHOOK -------- */
    await deleteWebhook({
      owner: repo.owner,
      repo: repo.name,
    });

    /* -------- UPDATE DB -------- */
    await prisma.repository.delete({
      where: {
        id: repo.id,
        userId: repo.userId,
      },
    });

    revalidatePath("/dashboard/repositories", "page");
    revalidatePath("/dashboard/settings", "page");

    return { success: true };
  } catch (error) {
    console.error("disconnectRepository error:", error);
    throw new Error("Failed to disconnect repository");
  }
}

export async function disconnectAllRepositories() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const repos = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    /* -------- DELETE WEBHOOKS (BEST EFFORT) -------- */
    for (const repo of repos) {
      try {
        await deleteWebhook({
          owner: repo.owner,
          repo: repo.name,
        });
      } catch (err) {
        // Do NOT fail entire operation
        console.error(`Failed to delete webhook for ${repo.fullName}`, err);
      }
    }

    /* -------- UPDATE DB IN ONE QUERY -------- */
    await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/repositories", "page");
    revalidatePath("/dashboard/settings", "page");
    return { success: true, count: repos.length };
  } catch (error) {
    console.error("disconnectAllRepositories error:", error);
    throw new Error("Failed to disconnect repositories");
  }
}
