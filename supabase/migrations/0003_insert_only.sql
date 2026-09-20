-- Harden write access: make players + feedback INSERT-ONLY.
--
-- Removes the public UPDATE policies so nobody using the browser (publishable)
-- key can alter or overwrite existing rows. Anonymous clients can still INSERT
-- (that's how the game records feedback), and reads stay admin-only.
--
-- App behaviour after this: the first answer for a (player, mode, level) wins;
-- resubmits are silently ignored (ON CONFLICT DO NOTHING). Age is captured only
-- when a player's row is first created.
--
-- Run this once in the Supabase SQL editor. (Fresh setups run 0001, 0002, then
-- this file in order.)

drop policy if exists "anon update players" on public.players;
drop policy if exists "anon update feedback" on public.feedback;
