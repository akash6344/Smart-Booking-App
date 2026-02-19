-- Bookmarks table. Each row is scoped to a user via user_id.
-- RLS policies ensure users only see and modify their own bookmarks.
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS so policies are enforced
alter table public.bookmarks enable row level security;

-- Users can only select their own bookmarks
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Users can only insert bookmarks for themselves
create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Enable realtime for bookmarks so clients can subscribe to changes
alter publication supabase_realtime add table public.bookmarks;
