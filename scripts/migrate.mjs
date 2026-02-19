/**
 * Runs the bookmarks table + RLS migration against Supabase.
 * Usage: DATABASE_URL=... node scripts/migrate.mjs
 * Or: npm run db:migrate (ensure .env has DATABASE_URL)
 */
import "dotenv/config";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL in environment");
  process.exit(1);
}

const sql = postgres(url, { prepare: false });

const statements = [
  `create table if not exists public.bookmarks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    url text not null,
    title text not null,
    created_at timestamptz not null default now()
  )`,
  `alter table public.bookmarks enable row level security`,
  `create policy "Users can view own bookmarks" on public.bookmarks for select using (auth.uid() = user_id)`,
  `create policy "Users can insert own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id)`,
  `create policy "Users can delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id)`,
  `do $$ begin alter publication supabase_realtime add table public.bookmarks; exception when duplicate_object then null; end $$`,
];

async function run() {
  try {
    for (const statement of statements) {
      await sql.unsafe(statement);
    }
    console.log("Migration completed: bookmarks table and RLS policies created.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
