# Smart Bookmark App

Private bookmark manager with Google OAuth and real-time sync across tabs.

## Requirements

- User authentication via Google OAuth only
- Add bookmarks (URL + title)
- Private bookmarks per user (RLS enforced)
- Real-time updates across browser tabs
- Delete bookmarks
- Deployable on Vercel

## Tech Stack

- Next.js 15 (App Router)
- Supabase (Auth, Database, Realtime)
- Drizzle ORM (schema and migrations)
- Tailwind CSS

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `NEXT_PUBLIC_APP_URL` - App base URL (e.g. `http://localhost:3000` or Vercel URL)
- `DATABASE_URL` - Supabase Postgres connection string (for migrations only). From Dashboard -> Project Settings -> Database -> Connection string (URI). Use the Transaction pooler and replace `[YOUR-PASSWORD]` with your database password.

### 3. Database (create tables and RLS)

No manual SQL. Run the migration script (uses Drizzle and a small runner):

```bash
npm run db:migrate
```

This creates the `bookmarks` table and RLS policies. Schema is defined in `src/db/schema.ts`.

### 4. Google OAuth

1. Create OAuth credentials in Google Cloud Console
2. In Supabase: Authentication -> Providers -> Google
3. Enable Google, paste Client ID and Client Secret
4. Add redirect URL: `https://<project-ref>.supabase.co/auth/v1/callback`
5. In Supabase: Authentication -> URL Configuration, set Site URL to your app URL

### 5. Run locally

```bash
npm run dev
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (same as `.env.local`)
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g. `https://your-app.vercel.app`)
5. Update Supabase Site URL and Google OAuth redirect if needed

## Development Notes

### Realtime

Supabase Realtime is enabled on the `bookmarks` table. The migration adds the table to `supabase_realtime` publication. If updates do not appear across tabs, verify in Supabase Dashboard: Database -> Replication that `bookmarks` is enabled.

### RLS

Row Level Security ensures users only access their own bookmarks. Policies: select/insert/delete restricted to `auth.uid() = user_id`.
