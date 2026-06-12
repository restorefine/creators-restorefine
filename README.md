# RestoRefine Creators

A creator application form and admin review panel, built with Next.js, Tailwind CSS, Prisma, and Supabase (Postgres, Storage, Auth).

- **Public form** (`/`) — creators apply with their personal info (full name, nationality, age, hourly rate, contact info) and upload a front-facing and side-profile photo.
- **Admin panel** (`/admin`) — authenticated staff can browse submissions, view both photos, and approve/reject applications.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM (`prisma/schema.prisma`) for the `creators` table
- Supabase Postgres as the database
- Supabase Storage for the uploaded photos (private bucket, accessed via signed URLs)
- Supabase Auth for admin login

## Setup

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then go to **Project Settings**:

- **API**: copy the **Project URL**, **anon public** key, and **service_role** key.
- **Database -> Connection string**: copy the pooled (port 6543) and direct (port 5432) connection strings.

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from step 1:

```bash
cp .env.local.example .env.local
```

### 3. Create the database table

Run the Prisma migration to create the `creators` table:

```bash
npx prisma migrate dev --name init
```

### 4. Create the storage bucket

```bash
npm run setup:storage
```

This creates a private `creator-photos` bucket using your service role key (idempotent - safe to re-run). All uploads/reads go through the service role key on the server, so no extra storage policies are required.

Alternatively, run `supabase/setup.sql` in the Supabase SQL Editor, or create the bucket manually under **Storage -> New bucket** (leave "Public bucket" unchecked).

### 5. Create an admin user

In the Supabase Dashboard, go to **Authentication -> Users -> Add user** and create an account (email + password) for whoever should access `/admin`. They'll use these credentials to sign in at `/admin/login`.

### 6. Run the app

```bash
npm run dev
```

- Public application form: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin) (redirects to login if signed out)

## Project structure

- `src/app/page.tsx` + `creator-application-form.tsx` — public application form
- `src/app/actions.ts` — server action that validates input, uploads photos to Supabase Storage, and writes the `Creator` row via Prisma
- `src/app/admin/login` — admin sign-in (Supabase Auth)
- `src/app/admin/(dashboard)` — protected admin list + detail views, approve/reject actions
- `src/lib/supabase` — Supabase client helpers (browser, server, middleware, service-role admin client)
- `src/lib/prisma.ts` — Prisma client singleton (uses `@prisma/adapter-pg`)
- `prisma/schema.prisma` — `Creator` model and database config
- `scripts/setup-storage.ts` — one-time storage bucket creation (`npm run setup:storage`)
- `supabase/setup.sql` — manual SQL alternative for storage bucket setup
