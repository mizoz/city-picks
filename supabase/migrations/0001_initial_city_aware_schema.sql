create extension if not exists "pgcrypto";

create type launch_status as enum ('planned', 'beta', 'live');
create type event_status as enum ('draft', 'approved', 'hidden', 'expired');
create type data_source_type as enum ('open_data', 'api', 'manual', 'business_submission', 'licensed_partner');
create type promotion_placement_type as enum ('featured_today', 'featured_weekend', 'category_boost', 'neighborhood_boost');
create type submission_status as enum ('pending', 'approved', 'rejected');

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  province_state text not null,
  country text not null,
  timezone text not null,
  latitude double precision not null,
  longitude double precision not null,
  is_active boolean not null default false,
  launch_status launch_status not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table neighborhoods (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null,
  slug text not null,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug)
);

create table venues (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  neighborhood_id uuid references neighborhoods(id) on delete set null,
  name text not null,
  address text,
  latitude double precision,
  longitude double precision,
  website text,
  phone text,
  categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  venue_id uuid references venues(id) on delete set null,
  title text not null,
  description_summary text,
  source text not null default 'manual',
  source_url text,
  start_time timestamptz not null,
  end_time timestamptz,
  price_min numeric(10,2),
  price_max numeric(10,2),
  currency text not null default 'CAD',
  tags text[] not null default '{}',
  image_url text,
  status event_status not null default 'draft',
  is_promoted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table data_sources (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null,
  source_type data_source_type not null,
  base_url text,
  usage_notes text,
  refresh_interval interval,
  last_sync_at timestamptz,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table business_accounts (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  business_name text not null,
  owner_name text,
  email text not null,
  phone text,
  claimed_venue_ids uuid[] not null default '{}',
  subscription_status text not null default 'none',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table promotions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  business_id uuid references business_accounts(id) on delete set null,
  event_id uuid references events(id) on delete set null,
  title text not null,
  placement_type promotion_placement_type not null,
  budget numeric(10,2),
  start_date date not null,
  end_date date not null,
  target_neighborhoods uuid[] not null default '{}',
  target_tags text[] not null default '{}',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  home_city_id uuid references cities(id) on delete set null,
  preferred_neighborhoods uuid[] not null default '{}',
  preferred_tags text[] not null default '{}',
  budget_preference text,
  family_friendly_preference boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table saved_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table recommendation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  city_id uuid not null references cities(id) on delete cascade,
  event_id uuid references events(id) on delete set null,
  shown_at timestamptz not null default now(),
  clicked boolean not null default false,
  saved boolean not null default false,
  dismissed boolean not null default false,
  context_json jsonb not null default '{}'
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  submitter_name text,
  submitter_email text,
  business_name text,
  event_title text not null,
  event_description text,
  venue_name text,
  address text,
  start_time timestamptz,
  end_time timestamptz,
  price text,
  source_url text,
  status submission_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table app_config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value_json jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_city_start_idx on events(city_id, start_time);
create index events_status_start_idx on events(status, start_time);
create index venues_city_idx on venues(city_id);
create index submissions_city_status_idx on submissions(city_id, status);
create index promotions_city_status_idx on promotions(city_id, status);
create index recommendation_logs_city_shown_idx on recommendation_logs(city_id, shown_at desc);

create trigger cities_updated_at before update on cities for each row execute function set_updated_at();
create trigger neighborhoods_updated_at before update on neighborhoods for each row execute function set_updated_at();
create trigger venues_updated_at before update on venues for each row execute function set_updated_at();
create trigger events_updated_at before update on events for each row execute function set_updated_at();
create trigger data_sources_updated_at before update on data_sources for each row execute function set_updated_at();
create trigger business_accounts_updated_at before update on business_accounts for each row execute function set_updated_at();
create trigger promotions_updated_at before update on promotions for each row execute function set_updated_at();
create trigger users_updated_at before update on users for each row execute function set_updated_at();
create trigger submissions_updated_at before update on submissions for each row execute function set_updated_at();
create trigger app_config_updated_at before update on app_config for each row execute function set_updated_at();
