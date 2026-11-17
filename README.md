# NeuroNest

**Every Mind Matters. Every Milestone Counts.**

NeuroNest is an AI-powered support ecosystem for neurodiverse children and their families. This repository is the interactive product website and prototype, live at **https://neuronest-official.vercel.app**.

## What's inside

| Area | Routes |
| --- | --- |
| Marketing site | `/`, `/about`, `/features`, `/how-it-works`, `/companion`, `/pricing`, `/faqs`, `/resources`, `/contact` |
| **Development Check** (evaluate your child) | `/development-check`, `/dashboard/check` |
| **Therapist Connect** | `/therapists`, `/dashboard/therapists` |
| **Parent Community** | `/community`, `/dashboard/community` |
| **Rewards and Streaks** | `/dashboard/rewards` |
| Dashboard | `/dashboard` — Today's Plan, Milestones, Learning Activities, Speech Coach, Progress, Care Network, Resources, Profile, Settings, Privacy |
| Account | `/sign-in`, `/sign-up`, `/onboarding` (or **Enter Demo Experience** on sign-in) |

### Development Check
Parents enter the child's age (with preterm correction), gender and any concerns, then answer age-matched milestone questions across four areas: social and emotional, language and communication, learning and thinking, and movement. The results show how the child compares with their age group in each area, flag possible delays, recommend the right kind of specialist (linked to Therapist Connect), and suggest practice activities. Milestones are paraphrased from the CDC's public-domain *Learn the Signs. Act Early.* checklists (2022). The check is a screening, **not a diagnosis**.

### Therapist Connect
A directory filterable by specialty, language, city and session type. Parents can request a consultation, pick a slot, and choose — with explicit consent — whether to share their latest Development Check and observations. Access can be revoked at any time from *My care team*. Therapist profiles are illustrative samples.

### Parent Community (live, on Supabase)
A members-only, Facebook-style feed backed by Supabase. Members can post (including anonymously), send support, comment, save and report posts, join circles, and send and accept connection requests. They also have a community profile with city, family context, interests and languages. Logged-out visitors and demo users see a members-only preview with live stats and the circles. See **Backend** below.

### Rewards
Completing plan items, learning activities, speech lessons, observations and Development Checks earns **Nest Stars**. Stars build daily streaks, earn a Full Nest Day bonus, level you up from Hatchling to Sky Guardian, and unlock badges. Parents can also set real-world reward goals to redeem stars against.

## Backend (Supabase)
Accounts and the Parent Community run on the Supabase project **neuronest** (`mrtpjraipdkekibtbdzs`). The schema lives in `supabase/migrations/`.

- **Auth:** email and password through Supabase Auth. A trigger creates a `profiles` row for every new user. Members can delete their own account from Dashboard → Privacy (`delete_my_account()`), which cascades to all of their content.
- **Tables:** `profiles`, `circles`, `circle_members`, `posts`, `comments`, `post_reactions`, `post_saves`, `post_reports` and `connections`. RLS is enabled on every table.
- **Anonymity is enforced in the database.** Members can only read their own rows directly. Everyone else's posts and comments come through `community_feed()` and `post_comments()`, which return `author_id = null` for anonymous content. `community_members()` powers the member directory, and `community_stats()` returns only aggregates, so it's safe for logged-out visitors.
- **Guardrails:** members can only post into circles they've joined. Connection requests can't be tampered with (only `status` is updatable, and only by the person invited). Posting is limited to 10 posts/hour and comments to 60/hour. Moderators can set `hidden = true` on posts or comments and review `post_reports` in the Supabase dashboard.
- **Client config:** `src/lib/supabase.ts` uses the project URL and publishable key. Both are safe to ship, since RLS enforces access. Override them with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`).

**Auth emails**
Branded email templates live in `supabase/templates/`. Every link goes to `/auth/confirm` on the site, which verifies the token in the app and routes the person onward: sign-up → onboarding, password reset → `/reset-password`, email change → profile. To change the copy or design, edit the HTML and run:

```bash
SUPABASE_ACCESS_TOKEN=<personal access token> node scripts/apply-auth-config.mjs
```

This also sets the Site URL, the allowed redirect URLs and the minimum password length.

**Auth settings to check in the Supabase dashboard**
1. *Authentication → URL Configuration*: set **Site URL** to `https://neuronest-official.vercel.app` and add `https://neuronest-official.vercel.app/**` to **Redirect URLs**.
2. *Authentication → Sign In / Providers → Email*: Supabase's built-in email service only delivers to your own team's addresses. Either turn **Confirm email** off, or connect a custom SMTP provider (*Authentication → Emails → SMTP Settings*, e.g. Resend) so real parents receive confirmation and password-reset emails.

## Data that stays in the browser
Plans, observations, Development Check results, rewards, therapist requests and the demo experience are stored only in the visitor's browser (`localStorage`, prefixed `neuronest:`). Visitors can export or clear this data from **Dashboard → Privacy**.

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

Stack: Vite, React 18, TypeScript, Tailwind CSS 3, React Router 6, Supabase (`@supabase/supabase-js`), lucide-react, and self-hosted Fraunces and Plus Jakarta Sans fonts.

## Deploying to Vercel
Import the repo in Vercel. It's detected as a Vite project: the build command is `npm run build` and the output directory is `dist`. `vercel.json` rewrites every route to `index.html` so deep links work. The OpenGraph image, favicons, `site.webmanifest`, `robots.txt` and `sitemap.xml` live in `public/`, and the OpenGraph tags point at `https://neuronest-official.vercel.app`. If the domain changes, update `index.html`, `public/robots.txt` and `public/sitemap.xml`.

---

NeuroNest provides supportive observations, personalised guidance, and tools for organising progress. It does not provide medical diagnoses or replace qualified professionals.
