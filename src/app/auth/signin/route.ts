/**
 * API route to get Google OAuth URL. Client redirects via window.location
 * for more reliable OAuth flow than server-action redirect.
 */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.url) {
    return NextResponse.json(
      { error: "No redirect URL returned. Ensure Google OAuth is enabled in Supabase." },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.url });
}
