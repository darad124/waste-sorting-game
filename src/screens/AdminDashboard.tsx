import React, { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { LEVELS } from "../data/levels";
import { AGE_RANGES } from "../api/feedback";

// ---------------------------------------------------------------------------
// Types matching the SQL view / tables
// ---------------------------------------------------------------------------
interface StatRow {
  game_mode: string;
  level_id: number | null;
  responses: number;
  enjoyed_count: number;
  enjoyed_pct: number | null;
  comment_count: number;
  avg_accuracy: number | null;
  avg_score: number | null;
}
interface FeedbackRow {
  id: string;
  player_id: string;
  game_mode: string;
  level_id: number | null;
  enjoyed: boolean;
  learned: string | null;
  created_at: string;
}
interface PlayerRow {
  id: string;
  age_range: string | null;
}

const MODE_LABELS: Record<string, string> = {
  arcade: "Arcade Levels",
  trivia: "Yes/No Trivia",
  detective: "Trash Detective",
  hunt: "Imposter Hunt",
  game_overall: "Game (overall)",
};
const AGE_LABEL = Object.fromEntries(AGE_RANGES.map((a) => [a.value, a.label]));
const levelName = (id: number | null) =>
  id == null ? "—" : LEVELS.find((l) => l.id === id)?.name ?? `Level ${id}`;

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------
const Bar: React.FC<{ pct: number; label: string; value: string; tone?: string }> = ({
  pct,
  label,
  value,
  tone = "#10b981",
}) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="w-40 shrink-0 truncate text-slate-600" title={label}>
      {label}
    </span>
    <div className="flex-1 h-5 rounded bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded transition-all"
        style={{ width: `${Math.max(pct, 2)}%`, background: tone }}
      />
    </div>
    <span className="w-16 shrink-0 text-right font-semibold text-slate-800">{value}</span>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">{title}</h2>
    {children}
  </section>
);

// ---------------------------------------------------------------------------
// Login gate
// ---------------------------------------------------------------------------
const Login: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(error.message);
    else onDone();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Feedback Dashboard</h1>
          <p className="text-sm text-slate-500">Admin sign-in required.</p>
        </div>
        <label className="text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
        </label>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
const Dashboard: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      setLoading(true);
      const [s, f, p] = await Promise.all([
        supabase.from("feedback_stats").select("*"),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("players").select("id, age_range"),
      ]);
      if (s.error || f.error || p.error) {
        // Most likely cause: signed-in user is not in the admins table.
        setError(
          (s.error || f.error || p.error)?.message +
            " — is this account listed in the admins table?",
        );
      } else {
        setStats((s.data as StatRow[]) ?? []);
        setFeedback((f.data as FeedbackRow[]) ?? []);
        setPlayers((p.data as PlayerRow[]) ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const totals = useMemo(() => {
    const responses = stats.reduce((a, r) => a + r.responses, 0);
    const enjoyed = stats.reduce((a, r) => a + r.enjoyed_count, 0);
    const comments = stats.reduce((a, r) => a + r.comment_count, 0);
    return {
      responses,
      enjoyed,
      comments,
      pct: responses ? Math.round((enjoyed / responses) * 100) : 0,
      players: players.length,
    };
  }, [stats, players]);

  // Enjoyment per arcade level
  const perLevel = useMemo(
    () =>
      stats
        .filter((r) => r.game_mode === "arcade" && r.level_id != null)
        .sort((a, b) => (a.level_id ?? 0) - (b.level_id ?? 0)),
    [stats],
  );

  // Enjoyment per mini-game mode
  const perMode = useMemo(
    () => stats.filter((r) => r.game_mode !== "arcade"),
    [stats],
  );

  // Age distribution
  const ageDist = useMemo(() => {
    const counts: Record<string, number> = {};
    let known = 0;
    for (const p of players) {
      if (p.age_range) {
        counts[p.age_range] = (counts[p.age_range] ?? 0) + 1;
        known++;
      }
    }
    return { counts, known };
  }, [players]);

  // Enjoyment by age (join feedback -> player age)
  const enjoyByAge = useMemo(() => {
    const ageOf = new Map(players.map((p) => [p.id, p.age_range]));
    const agg: Record<string, { total: number; enjoyed: number }> = {};
    for (const f of feedback) {
      const age = ageOf.get(f.player_id);
      if (!age) continue;
      agg[age] ??= { total: 0, enjoyed: 0 };
      agg[age].total++;
      if (f.enjoyed) agg[age].enjoyed++;
    }
    return agg;
  }, [feedback, players]);

  const comments = useMemo(
    () =>
      feedback.filter(
        (f) =>
          f.learned &&
          f.learned.trim().length > 0 &&
          (modeFilter === "all" || f.game_mode === modeFilter),
      ),
    [feedback, modeFilter],
  );

  if (loading) return <div className="min-h-screen grid place-items-center text-slate-500">Loading…</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-black text-slate-900">Feedback Dashboard</h1>
        <button
          onClick={onSignOut}
          className="text-sm font-semibold text-slate-500 hover:text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total responses", value: totals.responses },
            { label: "Enjoyment rate", value: `${totals.pct}%` },
            { label: "Players", value: totals.players },
            { label: "Written comments", value: totals.comments },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="text-2xl font-black text-slate-900">{k.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-1">
                {k.label}
              </div>
            </div>
          ))}
        </div>

        <Card title="Enjoyment by arcade level">
          {perLevel.length === 0 ? (
            <p className="text-sm text-slate-400">No arcade feedback yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {perLevel.map((r) => (
                <Bar
                  key={r.level_id}
                  label={levelName(r.level_id)}
                  pct={r.enjoyed_pct ?? 0}
                  value={`${r.enjoyed_pct ?? 0}% (${r.responses})`}
                  tone={(r.enjoyed_pct ?? 0) >= 60 ? "#10b981" : "#f59e0b"}
                />
              ))}
            </div>
          )}
        </Card>

        <Card title="Enjoyment by game mode">
          {perMode.length === 0 ? (
            <p className="text-sm text-slate-400">No mini-game feedback yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {perMode.map((r) => (
                <Bar
                  key={r.game_mode + r.level_id}
                  label={MODE_LABELS[r.game_mode] ?? r.game_mode}
                  pct={r.enjoyed_pct ?? 0}
                  value={`${r.enjoyed_pct ?? 0}% (${r.responses})`}
                  tone="#3b82f6"
                />
              ))}
            </div>
          )}
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Age distribution">
            {ageDist.known === 0 ? (
              <p className="text-sm text-slate-400">No age data yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {AGE_RANGES.map((a) => {
                  const c = ageDist.counts[a.value] ?? 0;
                  return (
                    <Bar
                      key={a.value}
                      label={a.label}
                      pct={ageDist.known ? (c / ageDist.known) * 100 : 0}
                      value={String(c)}
                      tone="#8b5cf6"
                    />
                  );
                })}
              </div>
            )}
          </Card>

          <Card title="Enjoyment by age">
            {Object.keys(enjoyByAge).length === 0 ? (
              <p className="text-sm text-slate-400">Not enough data yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {AGE_RANGES.map((a) => {
                  const row = enjoyByAge[a.value];
                  if (!row) return null;
                  const pct = row.total ? Math.round((row.enjoyed / row.total) * 100) : 0;
                  return (
                    <Bar
                      key={a.value}
                      label={AGE_LABEL[a.value]}
                      pct={pct}
                      value={`${pct}% (${row.total})`}
                      tone={pct >= 60 ? "#10b981" : "#f59e0b"}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <Card title="Comments — what players learned / suggestions">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {["all", "arcade", "trivia", "detective", "hunt"].map((m) => (
              <button
                key={m}
                onClick={() => setModeFilter(m)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  modeFilter === m
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                {m === "all" ? "All" : MODE_LABELS[m] ?? m}
              </button>
            ))}
          </div>
          {comments.length === 0 ? (
            <p className="text-sm text-slate-400">No written comments for this filter.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {comments.map((c) => (
                <li key={c.id} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${c.enjoyed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {c.enjoyed ? "Enjoyed" : "Didn't enjoy"}
                    </span>
                    <span>{MODE_LABELS[c.game_mode] ?? c.game_mode}</span>
                    {c.level_id != null && <span>· {levelName(c.level_id)}</span>}
                    <span className="ml-auto">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  {/* Rendered as plain text — never as HTML. */}
                  <p className="text-sm text-slate-800 whitespace-pre-wrap break-words">{c.learned}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Entry — handles auth state
// ---------------------------------------------------------------------------
const AdminDashboard: React.FC = () => {
  // null = still checking; false = no session; true = signed in.
  const [authed, setAuthed] = useState<boolean | null>(supabase ? null : false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setAuthed(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setAuthed(Boolean(session)),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-black text-slate-900 mb-2">Dashboard not configured</h1>
          <p className="text-sm text-slate-600">
            Set <code className="bg-slate-200 px-1 rounded">VITE_SUPABASE_URL</code> and{" "}
            <code className="bg-slate-200 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your
            environment, then reload.
          </p>
        </div>
      </div>
    );
  }

  if (authed === null) return <div className="min-h-screen grid place-items-center text-slate-500">Loading…</div>;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Dashboard onSignOut={async () => { await supabase?.auth.signOut(); setAuthed(false); }} />;
};

export default AdminDashboard;
