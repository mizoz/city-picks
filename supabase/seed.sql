insert into cities (name, slug, province_state, country, timezone, latitude, longitude, is_active, launch_status)
values
  ('Calgary', 'calgary', 'Alberta', 'Canada', 'America/Edmonton', 51.0447, -114.0719, true, 'beta'),
  ('Edmonton', 'edmonton', 'Alberta', 'Canada', 'America/Edmonton', 53.5461, -113.4938, false, 'planned'),
  ('Vancouver', 'vancouver', 'British Columbia', 'Canada', 'America/Vancouver', 49.2827, -123.1207, false, 'planned')
on conflict (slug) do nothing;

with calgary as (select id from cities where slug = 'calgary')
insert into neighborhoods (city_id, name, slug, latitude, longitude)
select calgary.id, n.name, n.slug, n.latitude, n.longitude
from calgary,
(values
  ('Beltline', 'beltline', 51.0415, -114.0754),
  ('Kensington', 'kensington', 51.0527, -114.0890),
  ('Inglewood', 'inglewood', 51.0397, -114.0305)
) as n(name, slug, latitude, longitude)
on conflict (city_id, slug) do nothing;

with calgary as (select id from cities where slug = 'calgary'),
     beltline as (select id from neighborhoods where slug = 'beltline' and city_id = (select id from calgary)),
     kensington as (select id from neighborhoods where slug = 'kensington' and city_id = (select id from calgary)),
     inglewood as (select id from neighborhoods where slug = 'inglewood' and city_id = (select id from calgary))
insert into venues (city_id, neighborhood_id, name, address, latitude, longitude, website, categories)
values
  ((select id from calgary), (select id from beltline), 'Demo Listening Bar', '123 Example Ave SW', 51.041, -114.076, 'https://example.com/demo-listening-bar', array['drinks','music']),
  ((select id from calgary), (select id from kensington), 'Sample Supper Club', '456 Placeholder St NW', 51.053, -114.089, 'https://example.com/sample-supper-club', array['food','date-night']),
  ((select id from calgary), (select id from inglewood), 'Fake Riverside Stage', '789 Demo Rd SE', 51.040, -114.031, 'https://example.com/fake-riverside-stage', array['outdoors','live-music']);

with calgary as (select id from cities where slug = 'calgary'),
     venues_for_seed as (select id, name from venues where city_id = (select id from calgary))
insert into events (city_id, venue_id, title, description_summary, source, source_url, start_time, end_time, price_min, price_max, currency, tags, status, is_promoted, last_seen_at)
values
  ((select id from calgary), (select id from venues_for_seed where name = 'Demo Listening Bar'), 'Indie Night Demo Listing', 'A fake Phase 1 example for a low-key live music recommendation card.', 'manual', 'https://example.com/events/indie-night-demo', now() + interval '6 hours', now() + interval '9 hours', 10, 20, 'CAD', array['Tonight','Live Music','Under $25'], 'approved', false, now()),
  ((select id from calgary), (select id from venues_for_seed where name = 'Sample Supper Club'), 'Cozy Dinner Demo Plan', 'A fake Phase 1 example for a date-night food recommendation.', 'manual', 'https://example.com/events/cozy-dinner-demo', now() + interval '1 day', now() + interval '1 day 3 hours', 20, 45, 'CAD', array['Food','Date Night'], 'approved', false, now()),
  ((select id from calgary), (select id from venues_for_seed where name = 'Fake Riverside Stage'), 'Free Riverside Demo Hang', 'A fake Phase 1 example for a free outdoor plan.', 'manual', 'https://example.com/events/riverside-demo', now() + interval '2 days', now() + interval '2 days 2 hours', 0, 0, 'CAD', array['Free','Outdoors','Family'], 'approved', false, now());

with calgary as (select id from cities where slug = 'calgary')
insert into data_sources (city_id, name, source_type, base_url, usage_notes, refresh_interval, enabled)
values
  ((select id from calgary), 'Manual Calgary beta submissions', 'manual', null, 'Phase 1 safe manual source. No scraping.', null, true),
  ((select id from calgary), 'Future Calgary open data source', 'open_data', 'https://data.calgary.ca/', 'Only use datasets with compatible usage terms. Store factual fields and original summaries.', interval '1 day', false);

insert into app_config (key, value_json)
values ('default_launch_city_slug', '{"slug":"calgary"}'::jsonb)
on conflict (key) do update set value_json = excluded.value_json;
