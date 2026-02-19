/**
 * Home page. Redirects authenticated users to dashboard.
 * Unauthenticated users see sign-in prompt with Google button.
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/SignInButton";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Smart Bookmark App
          </h1>
          <p className="mt-3 text-slate-600">
            Sign in with Google to manage your private bookmarks and keep them in sync across devices.
          </p>
        </div>
        <SignInButton />
      </div>
    </div>
  );
}
