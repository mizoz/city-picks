# City Picks (placeholder)

City Picks is a placeholder name for a multi-city local discovery app that answers: "What should I do today?"

The product is intentionally not Calgary-locked. Calgary is the first launch city, while the platform, data model, routes, and content structure are city-aware from day one.

## Product promise

Instead of showing hundreds of events, show a small number of good, relevant options based on city, neighborhood, time, budget, weather, company, mood, and category.

## Repository structure

```txt
apps/mobile        Expo React Native app shell
apps/admin         Next.js admin dashboard shell
packages/shared   Shared TypeScript types and constants
supabase           Database migrations, seed data, future edge functions
docs               Product, naming, data/legal, and build notes
```

## Quick start

Prerequisites:

- Node.js 20+
- npm 10+
- Supabase CLI, only when running migrations locally
- Expo Go or a mobile simulator for the mobile app

Install dependencies:

```bash
npm install
```

Run mobile app shell:

```bash
npm run dev:mobile
```

Run admin app shell:

```bash
npm run dev:admin
```

Run TypeScript checks:

```bash
npm run typecheck
```

## Supabase local setup

Start Supabase locally:

```bash
supabase start
```

Apply migrations:

```bash
supabase db reset
```

The initial seed file includes Calgary as the first beta city plus fake example venues/events. These are demo records only.

## Environment variables

Copy `.env.example` to `.env.local` in each app when ready to connect Supabase.

No real API keys are required for the Phase 1 shell.
