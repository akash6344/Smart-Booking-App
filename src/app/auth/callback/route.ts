/**
 * OAuth callback handler. Supabase redirects here after Google sign-in.
 * Exchanges code for session and sets cookies.
 */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
    );
  }

  const message = searchParams.get("error_description") ?? searchParams.get("error") ?? "Auth failed";
  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(message)}`
  );
}
