# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

> Use `bun` as the package manager — not npm or yarn.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
CRON_SECRET          # Bearer token for Vercel cron endpoints
```

## Architecture

**Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (New York) · Supabase (Auth + PostgreSQL) · Resend (email) · Recharts

**App purpose:** Personal faith and growth dashboard — Bible reading tracker, prayer log, journal, Kanban goals board, fitness log, and automated email check-ins.

### Key structural patterns

- **`app/dashboard/`** — All authenticated feature routes (`bible-tracker`, `prayer-log`, `journal`, `goals`, `fitness`). Each feature has its own page under this segment.
- **`app/api/`** — API routes: `verse` (daily verse), `send-daily/weekly/monthly` (Vercel cron email triggers), `send-feedback`.
- **`app/email/`** — React Email templates for daily/weekly/monthly summaries and feedback notifications.
- **`components/<feature>/`** — Feature components co-located by domain (e.g., `bible-tracker/`, `goals/`, `fitness/`).
- **`components/ui/`** — shadcn/ui primitives (do not modify directly).
- **`lib/supabase-server.ts`** vs **`lib/supabase-browser.ts`** — Always use the server client in Server Components and Route Handlers; use the browser client in Client Components.
- **`hooks/`** — Custom React hooks for data fetching per feature.

### Authentication & middleware

Auth is handled via Supabase SSR cookies. `middleware.ts` (at the root) intercepts requests and redirects unauthenticated users to `/login` for all `/dashboard/**` routes. The `profiles` table is auto-populated via a Supabase database trigger on signup.

### Database (Supabase)

All tables (`bible_reading`, `prayer_log`, `journal`, `goals`, `fitness`, `profiles`, `verses`) use Row-Level Security scoped to `auth.uid() = user_id`. Migrations live in `supabase/`.

### Cron jobs

Defined in `vercel.json`. Cron routes validate requests with `Authorization: Bearer <CRON_SECRET>`. Schedule: daily at 06:00, weekly Monday 07:00, monthly 1st at 08:00.

### Styling conventions

- Dark theme: background `#0a0a0f`, gold accent `#d4af37`
- Fonts: Cormorant Garamond (headings), DM Sans (body)
- Tailwind v4 via `@tailwindcss/postcss` — no `tailwind.config.js`
- Path alias `@/*` maps to the repo root
