"use client";

import { signIn } from "@/lib/auth-client";
import { GithubIcon, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function LoginUi() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({ provider: "github" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black text-white">
      {/* LEFT: TRUST + CONTEXT */}
      <div className="hidden md:flex flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-full bg-blue-500" />
          <span className="text-xl font-semibold">CodeHopper</span>
        </div>

        <h1 className="text-4xl font-bold leading-tight max-w-xl">
          Your GitHub Code Reviews,
          <br />
          <span className="text-blue-500">Automated & Intelligent</span>
        </h1>

        <p className="mt-6 text-lg text-gray-400 max-w-xl">
          Connect your GitHub account to start receiving AI-powered pull request
          reviews with full codebase context — no setup required.
        </p>

        <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          Secure OAuth · No passwords · Read-only access
        </div>
      </div>

      {/* RIGHT: LOGIN CARD */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-center">Welcome back</h2>

          <p className="text-sm text-center text-gray-400 mt-2">
            Sign in to continue to your dashboard
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="cursor-pointer mt-8 w-full flex items-center justify-center gap-3 rounded-lg bg-white text-black py-3 font-medium transition hover:bg-gray-200 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting to GitHub...
              </>
            ) : (
              <>
                <GithubIcon className="h-5 w-5" />
                Continue with GitHub
              </>
            )}
          </button>

          <p className="mt-6 text-xs text-center text-gray-400">
            We only access metadata required for reviews.
          </p>
        </div>
      </div>
    </div>
  );
}
