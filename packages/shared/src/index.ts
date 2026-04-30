export type LaunchStatus = 'planned' | 'beta' | 'live';
export type EventStatus = 'draft' | 'approved' | 'hidden' | 'expired';
export type DataSourceType = 'open_data' | 'api' | 'manual' | 'business_submission' | 'licensed_partner';
export type PlacementType = 'featured_today' | 'featured_weekend' | 'category_boost' | 'neighborhood_boost';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface City {
  id: string;
  name: string;
  slug: string;
  province_state: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  launch_status: LaunchStatus;
  created_at: string;
  updated_at: string;
}

export interface Neighborhood {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  city_id: string;
  neighborhood_id: string | null;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  phone: string | null;
  categories: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  city_id: string;
  venue_id: string | null;
  title: string;
  description_summary: string | null;
  source: string;
  source_url: string | null;
  start_time: string;
  end_time: string | null;
  price_min: number | null;
  price_max: number | null;
  currency: string;
  tags: string[];
  image_url: string | null;
  status: EventStatus;
  is_promoted: boolean;
  created_at: string;
  updated_at: string;
  last_seen_at: string | null;
}

export interface BusinessAccount {
  id: string;
  city_id: string;
  business_name: string;
  owner_name: string | null;
  email: string;
  phone: string | null;
  claimed_venue_ids: string[];
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  city_id: string;
  business_id: string | null;
  event_id: string | null;
  title: string;
  placement_type: PlacementType;
  budget: number | null;
  start_date: string;
  end_date: string;
  target_neighborhoods: string[];
  target_tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  city_id: string;
  submitter_name: string | null;
  submitter_email: string | null;
  business_name: string | null;
  event_title: string;
  event_description: string | null;
  venue_name: string | null;
  address: string | null;
  start_time: string | null;
  end_time: string | null;
  price: string | null;
  source_url: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_LAUNCH_CITY_SLUG = 'calgary';

export const CORE_TAGS = [
  'Free',
  'Under $25',
  'Tonight',
  'Date Night',
  'Family',
  'Live Music',
  'Comedy',
  'Food',
  'Outdoors',
  'Hidden Gem',
  'Near You'
] as const;
