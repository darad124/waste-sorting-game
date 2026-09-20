-- Feedback capture for the Waste Sorting Game
-- Run this in the Supabase SQL editor (or via the Supabase CLI).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per anonymous device/browser. `id` is generated client-side
-- (crypto.randomUUID) and persisted in localStorage as ws_playerId.
create table if not exists public.players (
  id         uuid primary key,
  age_range  text check (age_range in
              ('under_13','13_17','18_24','25_34','35_49','50_plus')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One *current* feedback row per player per (mode, level). Resubmitting the
-- same level overwrites the previous answer (see unique index below).
create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references public.players(id) on delete cascade,
  game_mode   text not null
              check (game_mode in ('arcade','trivia','detective','hunt','game_overall')),
  level_id    int,                                    -- null for mini-games / overall
  enjoyed     boolean not null,                       -- thumbs up / down
  learned     text check (char_length(learned) <= 500), -- optional: what they learned / improvements
  score       int,
  accuracy    int check (accuracy is null or (accuracy between 0 and 100)),
  stars       int check (stars is null or (stars between 0 and 3)),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Overwrite-on-resubmit: at most one current answer per player per level+mode.
-- NULLS NOT DISTINCT (Postgres 15+) makes the null level_id of mini-games
-- collide too, and the plain column list lets the client upsert target it.
create unique index if not exists feedback_current
  on public.feedback (player_id, game_mode, level_id) nulls not distinct;

create index if not exists feedback_mode_level_idx
  on public.feedback (game_mode, level_id);

-- ---------------------------------------------------------------------------
-- Admins (who may read the dashboard)
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.players  enable row level security;
alter table public.feedback enable row level security;
alter table public.admins   enable row level security;

-- Anonymous players may create and update their own player + feedback rows.
-- They may NOT read anything back (feedback is write-only for the public).
create policy "anon insert players" on public.players
  for insert to anon, authenticated with check (true);
create policy "anon update players" on public.players
  for update to anon, authenticated using (true) with check (true);

create policy "anon insert feedback" on public.feedback
  for insert to anon, authenticated with check (true);
create policy "anon update feedback" on public.feedback
  for update to anon, authenticated using (true) with check (true);

-- Admins (signed-in users listed in public.admins) may read everything.
create policy "admin read players" on public.players
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admin read feedback" on public.feedback
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admin read admins" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists players_touch on public.players;
create trigger players_touch before update on public.players
  for each row execute function public.touch_updated_at();

drop trigger if exists feedback_touch on public.feedback;
create trigger feedback_touch before update on public.feedback
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Aggregate view for the dashboard (per mode + level)
-- Admin-readable via the feedback SELECT policy (security_invoker).
-- ---------------------------------------------------------------------------
create or replace view public.feedback_stats
with (security_invoker = true) as
select
  game_mode,
  level_id,
  count(*)                                             as responses,
  count(*) filter (where enjoyed)                      as enjoyed_count,
  round(100.0 * count(*) filter (where enjoyed) / nullif(count(*), 0), 1) as enjoyed_pct,
  count(*) filter (where learned is not null and length(trim(learned)) > 0) as comment_count,
  round(avg(accuracy)::numeric, 1)                     as avg_accuracy,
  round(avg(score)::numeric, 0)                        as avg_score
from public.feedback
group by game_mode, level_id
order by game_mode, level_id;
