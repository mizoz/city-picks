# Build Plan

## Phase 0 — Naming and brand check

Done in `docs/naming-brand-notes.md`. Use City Picks as placeholder until a final name is selected.

## Phase 1 — Structure only

Deliverables:

- folder structure
- README
- product requirements document
- naming and brand notes
- data/legal rules
- Supabase schema migration
- seed data with Calgary beta city and fake example events
- mobile shell with Today, Map, Saved, Profile tabs
- admin shell with Cities, Events, Submissions, Venues, Promotions, Data Sources pages
- shared TypeScript types

## Phase 2 — Product MVP

Only after approval:

- connect mobile app to Supabase
- show seed events in Today screen
- add city selection
- add filters
- add detail page
- add saved events
- add basic map

## Phase 3 — Data operations

- legal/open data imports city by city
- scheduled refresh job
- deduplication
- admin approval flow

## Phase 4 — Business layer

- business submission form
- claimed business profile
- promoted placement logic

## Phase 5 — Launch

- Stripe or ads if needed
- App Store / Google Play assets
- privacy policy and terms
- production deployment
