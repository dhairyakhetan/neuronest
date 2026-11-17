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

### Parent Community
A Facebook-style feed with posts (including anonymous posting), support reactions, comments, saved posts and reporting. Parents can join circles and connect with each other, and community guidelines are shown alongside. Seed members and posts are illustrative samples.

### Rewards
Completing plan items, learning activities, speech lessons, observations and Development Checks earns **Nest Stars**. Stars build daily streaks, earn a Full Nest Day bonus, level you up from Hatchling to Sky Guardian, and unlock badges. Parents can also set real-world reward goals to redeem stars against.

## Prototype data
Everything a visitor enters is stored **only in their browser** (`localStorage`, prefixed `neuronest:`); nothing is sent to a server, and passwords are never stored. Visitors can export or clear their data from **Dashboard → Privacy**.

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

Stack: Vite, React 18, TypeScript, Tailwind CSS 3, React Router 6, lucide-react, and self-hosted Fraunces and Plus Jakarta Sans fonts.

## Deploying to Vercel
Import the repo in Vercel. It's detected as a Vite project: the build command is `npm run build` and the output directory is `dist`. `vercel.json` rewrites every route to `index.html` so deep links work. The OpenGraph image, favicons, `site.webmanifest`, `robots.txt` and `sitemap.xml` live in `public/`, and the OpenGraph tags point at `https://neuronest-official.vercel.app`. If the domain changes, update `index.html`, `public/robots.txt` and `public/sitemap.xml`.

---

NeuroNest provides supportive observations, personalised guidance, and tools for organising progress. It does not provide medical diagnoses or replace qualified professionals.
