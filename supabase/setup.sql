-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- It creates a private storage bucket for creator face photos.
-- The `creators` table itself is managed by Prisma migrations
-- (see prisma/schema.prisma + `npx prisma migrate dev`).

insert into storage.buckets (id, name, public)
values ('creator-photos', 'creator-photos', false)
on conflict (id) do nothing;

-- No storage policies are needed: all uploads and reads happen server-side
-- using the Supabase service role key (SUPABASE_SERVICE_ROLE_KEY), which
-- bypasses Row Level Security entirely.
