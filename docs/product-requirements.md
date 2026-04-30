# Product Requirements — City Picks Placeholder

## One-line concept

A multi-city mobile recommendation app that answers: "What should I do today?"

## Positioning

This is not a giant event calendar. It is a curated recommendation layer that feels like a smart local friend saying: "Here are the best things to do right now."

## Expansion principle

Calgary is the first launch market, not the brand boundary. Every core object must be city-aware:

- cities
- neighborhoods
- venues
- events
- data sources
- submissions
- promotions
- business accounts
- recommendation logs
- admin views

Do not hard-code Calgary into product identity, routing, table names, app copy, or architecture. Calgary can appear only as seed data, default launch config, or city-specific content.

## MVP user flows

1. Choose or auto-detect city.
2. Open Today, Tonight, or This Weekend.
3. Apply quick filters such as Free, Under $25, Date Night, Family, Food, Live Music, Outdoors, Near Me.
4. See 3–10 recommendation cards.
5. Open detail screen.
6. Save or share a plan.
7. View results on a map.

## MVP screens

### Mobile

- City selector
- Today tab
- Map tab
- Saved tab
- Profile/preferences tab
- Event detail screen, added in Phase 2

### Admin

- Cities
- Events
- Submissions
- Venues
- Promotions
- Data Sources

## Recommendation inputs

- city
- neighborhood
- current location
- date/time
- time available
- budget
- weather
- group type: solo, date, friends, kids/family
- mood/category: food, drinks, live music, comedy, outdoors, cozy, active, weird, free, cheap, hidden gems

## Phase boundaries

### Phase 1: Skeleton only

- Repo structure
- Docs
- Supabase schema and seed
- Mobile shell with tabs
- Admin shell with city-aware pages
- Shared TypeScript types
- No real scraping
- No payments
- No ads
- No production deployment

### Phase 2: Product MVP

- Supabase connection
- Seed events on Today screen
- City selection
- Filters
- Event detail
- Saved events
- Basic map

### Phase 3: Data operations

- Legal/open-data imports
- Scheduled refresh
- Deduplication
- Admin approval flow

### Phase 4: Business layer

- Business submission form
- Claimed profiles
- Promoted placement logic

### Phase 5: Launch/commercialization

- Payments or ads
- App Store / Google Play assets
- Privacy policy and terms
- Production deployment
