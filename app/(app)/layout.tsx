import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeHopper - AI-powered GitHub Code Reviews",
  description:
    "This is a full-stack application that automatically reviews your GitHub pull requests using RAG (Retrieval Augmented Generation) and Google's Gemini AI. It leverages Next.js for the frontend and backend, integrates with the GitHub API to fetch pull request data, and uses vector embeddings to understand the entire codebase context, not just the diff. The app provides actionable insights to help developers ship better code without slowing down.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
