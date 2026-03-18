# Faith & Growth Tracker

A personal faith and growth dashboard built with Next.js. Track your Bible reading, prayer life, journaling, goals, and fitness — all in one place.

---

## Features

- **Bible Tracker** — Log daily readings by book, chapter, and date. View your streak, weekly progress, and reading history with charts.
- **Prayer Log** — Record prayer requests, mark them as answered, and track your prayer consistency over time.
- **Journal** — Write personal journal entries with a clean, distraction-free editor.
- **Goals (Kanban)** — Manage personal goals across a To Do / In Progress / Done board.
- **Fitness** — Log workouts with duration and type, and visualise your activity over time.
- **Home Dashboard** — A daily landing page with a rotating verse of the day and summary cards from every section.
- **Daily & Weekly Emails** — Automated email check-ins powered by Resend, sent via cron jobs on Vercel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (New York style) |
| Backend & Auth | Supabase |
| Charts | Recharts |
| Email | Resend + React Email |
| Package Manager | Bun |
| Deployment | Vercel |

---

## Project Structure

```
app/
  dashboard/
    page.tsx                  # Home dashboard
    bible-tracker/page.tsx
    prayer-log/page.tsx
    journal/page.tsx
    goals/page.tsx
    fitness/page.tsx
  api/
    verse/route.ts            # Daily verse endpoint
    send-daily/route.ts       # Cron: daily check-in email
    send-weekly/route.ts      # Cron: weekly summary email
  email/
    daily-checkin.tsx         # React Email template
    weekly-summary.tsx        # React Email template

components/
  app-sidebar.tsx             # Main navigation sidebar
  nav-main.tsx
  nav-user.tsx
  home-page/                  # Home dashboard components
  bible-tracker/              # Bible tracker components
  prayer-log/                 # Prayer log components
  journal/                    # Journal components
  goals/                      # Goals / Kanban components
  fitness/                    # Fitness components

lib/
  supabase-browser.ts         # Browser Supabase client
  supabase-server.ts          # Server Supabase client
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/LiandeWin/FaithGrowthTracker.git
cd FaithGrowthTracker
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:


### 4. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database (Supabase)

All tables use Row Level Security (RLS). Every policy is scoped to the authenticated user via `auth.uid() = user_id`.

| Table | Purpose |
|---|---|
| `profiles` | Stores user first name and email, auto-created on signup via a database trigger |
| `bible_reading` | Logs individual reading sessions |
| `prayer_log` | Prayer requests and answered status |
| `journal` | Journal entries |
| `goals` | Goal cards with Kanban status |
| `fitness` | Workout sessions with type and duration |
| `verses` | Verse pool for the daily verse feature |

---

## Authentication

Auth is handled entirely by Supabase. Sessions are managed via cookies using `@supabase/ssr`. A middleware file (`proxy.ts`) redirects unauthenticated users to `/login` for all protected routes.

---

## Deployment

The app is deployed on **Vercel**. Environment variables are configured in the Vercel project settings. Cron jobs for the daily and weekly emails are defined in `vercel.json` and hit the `/api/send-daily` and `/api/send-weekly` routes with a `CRON_SECRET` bearer token for security.

---

## Design

- Dark background: `#0a0a0f`
- Gold accent: `#d4af37`
- Fonts: Cormorant Garamond (headings) + DM Sans (body)