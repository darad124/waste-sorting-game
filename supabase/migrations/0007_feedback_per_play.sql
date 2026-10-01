-- Feedback is now asked after every game play, so a player can answer the
-- same (mode, level) many times. Drop the one-row-per-(player, mode, level)
-- constraint so each submission is kept as its own row.
-- feedback_stats.responses now counts submissions, not unique players.

drop index if exists public.feedback_current;
