-- Site traffic: one row per session visit.
-- Mirrors the feedback pattern: anon may INSERT, only admins may read.

create table if not exists public.visits (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null,           -- device id (same one used for feedback); no FK,
                                       -- since a visitor may never create a players row
  referrer   text,
  path       text,
  created_at timestamptz not null default now()
);

create index if not exists visits_created_idx on public.visits (created_at);
create index if not exists visits_player_idx  on public.visits (player_id);

alter table public.visits enable row level security;

-- Anyone may record a visit (write-only for the public).
drop policy if exists "anon insert visits" on public.visits;
create policy "anon insert visits" on public.visits
  for insert to anon, authenticated with check (true);

-- Only admins may read.
drop policy if exists "admin read visits" on public.visits;
create policy "admin read visits" on public.visits
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
