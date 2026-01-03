import Link from "next/link";
import { ArrowRight, Github, Sparkles, Zap, BarChart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="px-8 py-18 max-w-7xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-sm text-gray-400 mb-6">
          <Sparkles className="h-4 w-4 text-blue-500" />
          AI-powered GitHub code reviews
        </span>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
          Ship Better Code.
          <br />
          <span className="text-blue-500">Without Slowing Down.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-400 max-w-2xl">
          CodeHopper automatically reviews your pull requests using RAG and
          Gemini AI — understanding your entire codebase, not just the diff.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700"
          >
            Start Reviewing Smarter <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 hover:bg-white/10"
          >
            <Github className="h-4 w-4" />
            View GitHub
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 py-24 bg-white/5">
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <Feature
            icon={<Zap className="h-5 w-5 text-blue-500" />}
            title="Instant PR Reviews"
            desc="Automatic AI reviews triggered on every pull request update."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5 text-blue-500" />}
            title="RAG-Powered Context"
            desc="Semantic search across your entire repository using vector embeddings."
          />
          <Feature
            icon={<BarChart className="h-5 w-5 text-blue-500" />}
            title="Actionable Insights"
            desc="Track reviews, repositories, usage limits, and developer activity."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CodeHopper — AI for modern engineering
        teams
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-gray-400">{desc}</p>
    </div>
  );
}
