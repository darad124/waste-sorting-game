-- Add privacy-safe demographic signals to visits.
-- All coarse and anonymous: language, device category, country (no city, no IP).

alter table public.visits add column if not exists language text;
alter table public.visits add column if not exists device   text;  -- mobile | tablet | desktop
alter table public.visits add column if not exists country  text;  -- ISO country code (Vercel edge)
