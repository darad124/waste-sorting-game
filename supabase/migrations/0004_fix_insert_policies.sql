-- Repair: ensure anonymous clients can INSERT feedback, and only admins can read.
-- Safe/idempotent — run this if inserts fail with 42501
-- ("new row violates row-level security policy"), which means RLS is on but the
-- INSERT policy is missing or targets the wrong role.

-- Make sure RLS is enabled (default-deny once on).
alter table public.players  enable row level security;
alter table public.feedback enable row level security;
alter table public.admins   enable row level security;

-- --- INSERT: anon + authenticated may write players & feedback -------------
drop policy if exists "anon insert players" on public.players;
create policy "anon insert players" on public.players
  for insert to anon, authenticated with check (true);

drop policy if exists "anon insert feedback" on public.feedback;
create policy "anon insert feedback" on public.feedback
  for insert to anon, authenticated with check (true);

-- --- SELECT: only admins may read -----------------------------------------
drop policy if exists "admin read players" on public.players;
create policy "admin read players" on public.players
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admin read feedback" on public.feedback;
create policy "admin read feedback" on public.feedback
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admin read admins" on public.admins;
create policy "admin read admins" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- Note: no UPDATE/DELETE policies -> tables stay insert-only for the public.
