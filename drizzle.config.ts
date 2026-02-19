import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit config. Uses Supabase Postgres connection string.
 * Run: npm run db:migrate (creates tables from migrations)
 * Or: npm run db:push (syncs schema to DB, no RLS - use migrate for full setup)
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
