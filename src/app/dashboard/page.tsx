/**
 * Dashboard. Authenticated users manage bookmarks here.
 * Bookmark list uses realtime subscription for cross-tab updates.
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { BookmarkList } from "@/components/BookmarkList";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, user_id, url, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
            Smart Bookmark
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Add Bookmark</h2>
          <AddBookmarkForm />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Your Bookmarks</h2>
          <BookmarkList initialBookmarks={bookmarks ?? []} />
        </section>
      </main>
    </div>
  );
}
