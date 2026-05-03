# YYC Class Finder

YYC Class Finder helps Calgarians find active City of Calgary recreation programs without digging through a giant open-data table. It filters city-run classes by age, budget, day, and activity, then links back to the official dataset for verification.

The problem: Calgary has useful public recreation data, but it is easier to browse as a parent, student, or adult learner when the first screen asks practical questions.

## Live Data

The web app calls the City of Calgary Open Data Socrata API:

- Dataset: Recreation Program Listings
- Endpoint: `https://data.calgary.ca/resource/q9hh-gfbx.json`
- Source page: `https://data.calgary.ca/Recreation-and-Culture/Recreation-Program-Listings/q9hh-gfbx`

The Next.js route at `apps/admin/app/api/programs/route.ts` queries active programs and applies filters using Socrata `$where`, `$order`, and `$limit` parameters. Responses are cached for 15 minutes with Next.js revalidation.

## Repository Structure

```txt
apps/admin        Public Next.js web app
apps/mobile       Earlier Expo shell, not part of the Vercel deployment
packages/shared   Shared TypeScript types and constants
supabase           Earlier database schema and seed notes
docs               Product and data notes
```

## Development

Prerequisites:

- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev:admin
```

Build the Vercel app:

```bash
npm run build
```

Run TypeScript checks:

```bash
npm run typecheck
```

## Vercel

The root `vercel.json` builds the Next.js app from `apps/admin`:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "apps/admin/.next",
  "framework": "nextjs"
}
```

No API key is required for the City of Calgary open-data endpoint used by this app.
