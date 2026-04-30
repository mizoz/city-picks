# Data and Legal Rules

## Principle

Do not build the product around risky scraping. The app should be a legally safe, curated recommendation layer.

## Approved first data sources

- Open-data portals
- Official public APIs
- Business-submitted events
- Manually approved listings
- Licensed partners
- Event/ticket/reservation sources only where API terms allow usage

## Avoid

- Copying full event descriptions from third-party sites without permission
- Copying copyrighted images, logos, reviews, or full pages
- Circumventing access controls
- Ignoring robots.txt or terms of service
- Presenting third-party content as owned content

## Third-party event storage rule

For third-party events, store only factual/basic fields where appropriate:

- title
- date
- time
- venue
- category/tags
- price range
- source URL
- short original summary written by us

Always link users back to the original source/ticket page for full details.

## Image rule

Only use images that are:

- submitted by the business with rights
- licensed for use
- from an allowed API with usage rights
- original assets created for the product

## Admin approval rule

All business submissions and imported listings should support a draft/pending state before appearing publicly.

## City-aware data rule

All data importers, submissions, promotions, recommendations, and admin views must be scoped by `city_id`.
