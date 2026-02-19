import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Bookmarks table. RLS is applied via migration so users only see their own rows.
 * user_id references auth.users (Supabase Auth).
 */
export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
