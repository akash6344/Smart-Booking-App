"use server";

/**
 * Server actions for bookmark CRUD. RLS enforces user isolation.
 */
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
};

export async function addBookmark(formData: FormData) {
  const url = formData.get("url") as string;
  const title = formData.get("title") as string;

  if (!url?.trim() || !title?.trim()) {
    return { error: "URL and title are required" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user.id,
    url: url.trim(),
    title: title.trim(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookmarks").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
