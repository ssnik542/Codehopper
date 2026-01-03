"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function requireUnAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect("/dashboard");
  }
  return session?.user;
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
