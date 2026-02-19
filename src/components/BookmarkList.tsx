"use client";

/**
 * Bookmark list with realtime subscription. Updates across tabs
 * when bookmarks are added or deleted.
 */
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteBookmark } from "@/app/actions/bookmarks";
import type { Bookmark } from "@/app/actions/bookmarks";

type BookmarkListProps = {
  initialBookmarks: Bookmark[];
};

export function BookmarkList({ initialBookmarks }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteBookmark(id);
    setDeletingId(null);
  }

  if (bookmarks.length === 0) {
    return (
      <div className="py-12 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
        <p className="text-slate-500 text-sm">No bookmarks yet.</p>
        <p className="text-slate-400 text-sm mt-1">Add one using the form above.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="py-4 flex items-start gap-4 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors first:pt-0"
        >
          <span className="mt-1 shrink-0 text-slate-400" aria-hidden>
            <LinkIcon />
          </span>
          <div className="min-w-0 flex-1">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:text-blue-600 truncate block"
            >
              {b.title}
            </a>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-blue-600 truncate block mt-0.5"
            >
              {b.url}
            </a>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(b.id)}
            disabled={deletingId === b.id}
            className="shrink-0 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
          >
            {deletingId === b.id ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}
