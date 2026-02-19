"use client";

/**
 * Client-side sign-in button. Fetches OAuth URL and redirects.
 * Styled as Google sign-in button per brand guidelines.
 */
import { useState } from "react";
import { GoogleIcon } from "./GoogleIcon";

export function SignInButton() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/auth/signin");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign in failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No redirect URL received");
    } catch {
      setError("Failed to start sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      {error && (
        <p className="mb-4 text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-medium shadow-sm hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        <GoogleIcon />
        <span>{loading ? "Redirecting..." : "Sign in with Google"}</span>
      </button>
    </div>
  );
}
