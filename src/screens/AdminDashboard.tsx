import React, { useEffect, useMemo, useRef, useState } from "react";
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
  score: number | null;
  accuracy: number | null;
  stars: number | null;
  created_at: string;
}
interface PlayerRow {
  id: string;
  age_range: string | null;
}
interface VisitRow {
  player_id: string;
  created_at: string;
  language: string | null;
  device: string | null;
  country: string | null;
}

// Validated categorical palette (see dataviz skill: references/palette.md).
const C = {
  blue: "#2a78d6",
  orange: "#eb6834",
  aqua: "#1baf7a",
  yellow: "#eda100",
  magenta: "#e87ba4",
  violet: "#4a3aa7",
  good: "#1baf7a",
  bad: "#e34948",
  ink: "#0f172a",
  sub: "#475569",
  muted: "#94a3b8",
  track: "#eef1f5",
  line: "#e6e8ee",
};

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
const shortLevel = (id: number | null) => (id == null ? "—" : `Lvl ${id}`);

// ---------------------------------------------------------------------------
// Presentational primitives
// ---------------------------------------------------------------------------
const Card: React.FC<{ title?: string; subtitle?: string; className?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  className = "",
  children,
}) => (
  <section className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm ${className}`}>
    {title && (
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid place-items-center py-10 text-sm text-slate-400 text-center">{children}</div>
);

const StatTile: React.FC<{ label: string; value: React.ReactNode; sub?: string; accent?: string }> = ({
  label,
  value,
  sub,
  accent,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
    <div className="mt-1.5 text-3xl font-black tabular-nums leading-none" style={{ color: accent ?? C.ink }}>
      {value}
    </div>
    {sub && <div className="mt-1.5 text-xs text-slate-400">{sub}</div>}
  </div>
);

// Horizontal bar list — magnitude by length, value direct-labeled.
const BarList: React.FC<{
  rows: { label: string; value: number; caption?: string; tone?: string }[];
  max?: number;
  labelWidth?: string;
}> = ({ rows, max, labelWidth = "9rem" }) => {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-3 text-sm group">
          <span className="shrink-0 truncate text-slate-500" style={{ width: labelWidth }} title={r.label}>
            {r.label}
          </span>
          <div className="flex-1 h-6 rounded-md bg-slate-100 overflow-hidden relative">
            <div
              className="h-full rounded-md transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max((r.value / top) * 100, 2)}%`, background: r.tone ?? C.blue }}
            />
          </div>
          <span className="shrink-0 text-right font-semibold text-slate-700 tabular-nums" style={{ width: "5rem" }}>
            {r.caption ?? r.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Donut / ring chart with legend and direct value labels.
const Donut: React.FC<{
  segments: { label: string; value: number; color: string }[];
  centerTop?: string;
  centerBottom?: string;
  size?: number;
}> = ({ segments, centerTop, centerBottom, size = 150 }) => {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const thickness = 20;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const gap = total > 0 ? 3 : 0; // px gap between segments
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.track} strokeWidth={thickness} />
          {total > 0 &&
            segments.map((s, i) => {
              const len = Math.max((s.value / total) * circ - gap, 0);
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={-offset}
                  style={{ transition: "stroke-dasharray .6s ease, stroke-dashoffset .6s ease" }}
                />
              );
              offset += (s.value / total) * circ;
              return el;
            })}
        </g>
        {centerTop && (
          <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" style={{ fontWeight: 800, fontSize: 26, fill: C.ink }}>
            {centerTop}
          </text>
        )}
        {centerBottom && (
          <text x="50%" y="62%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fill: C.muted }}>
            {centerBottom}
          </text>
        )}
      </svg>
      <ul className="flex flex-col gap-2 text-sm min-w-0">
        {segments.map((s, i) => {
          const pct = total ? Math.round((s.value / total) * 100) : 0;
          return (
            <li key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
              <span className="text-slate-500 truncate">{s.label}</span>
              <span className="ml-auto pl-3 font-semibold text-slate-700 tabular-nums">
                {s.value} <span className="text-slate-400 font-normal">· {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Interactive area+line chart for a time series.
const AreaChart: React.FC<{ data: { label: string; count: number }[]; color?: string }> = ({
  data,
  color = C.blue,
}) => {
  const W = 720;
  const H = 190;
  const pad = { t: 14, r: 14, b: 24, l: 30 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(1, ...data.map((d) => d.count));
  const n = data.length;
  const x = (i: number) => pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.count)}`).join(" ");
  const areaPath = `${linePath} L${x(n - 1)},${pad.t + ih} L${x(0)},${pad.t + ih} Z`;

  const [hi, setHi] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const rx = ((e.clientX - rect.left) / rect.width) * W;
    let idx = Math.round(((rx - pad.l) / iw) * (n - 1));
    idx = Math.max(0, Math.min(n - 1, idx));
    setHi(idx);
  };

  const gridVals = [0, Math.round(max / 2), max].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div ref={ref} className="relative w-full" onPointerMove={onMove} onPointerLeave={() => setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {gridVals.map((v) => (
          <g key={v}>
            <line x1={pad.l} y1={y(v)} x2={W - pad.r} y2={y(v)} stroke={C.line} strokeWidth={1} />
            <text x={pad.l - 6} y={y(v)} textAnchor="end" dominantBaseline="central" style={{ fontSize: 10, fill: C.muted }}>
              {v}
            </text>
          </g>
        ))}
        <path d={areaPath} fill="url(#areaFill)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {/* x labels: every other to avoid crowding */}
        {data.map((d, i) =>
          i % 2 === 0 ? (
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" style={{ fontSize: 9, fill: C.muted }}>
              {d.label}
            </text>
          ) : null,
        )}
        {/* hover marker */}
        {hi != null && (
          <g>
            <line x1={x(hi)} y1={pad.t} x2={x(hi)} y2={pad.t + ih} stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
            <circle cx={x(hi)} cy={y(data[hi].count)} r={4.5} fill="#fff" stroke={color} strokeWidth={2.5} />
          </g>
        )}
      </svg>
      {hi != null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap"
          style={{ left: `${(x(hi) / W) * 100}%`, top: `${(y(data[hi].count) / H) * 100}%` }}
        >
          <span className="font-bold tabular-nums">{data[hi].count}</span>{" "}
          <span className="text-slate-300">session{data[hi].count === 1 ? "" : "s"}</span>
          <span className="text-slate-400"> · {data[hi].label}</span>
        </div>
      )}
    </div>
  );
};

const enjoymentTone = (pct: number) => (pct >= 70 ? C.good : pct >= 50 ? C.yellow : C.bad);

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
    <div className="h-[100dvh] overflow-y-auto grid place-items-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-7 shadow-lg flex flex-col gap-4">
        <div className="flex flex-col items-center text-center gap-1 mb-1">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 grid place-items-center text-white text-xl font-black">E</div>
          <h1 className="text-xl font-black text-slate-900 mt-2">EcoSort Analytics</h1>
          <p className="text-sm text-slate-500">Admin sign-in required</p>
        </div>
        <label className="text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [enjoyFilter, setEnjoyFilter] = useState<"all" | "yes" | "no">("all");

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      setLoading(true);

      // Confirm this account is an admin. RLS returns an empty set (not an
      // error) to non-admins, so without this check a non-admin would just see
      // an empty dashboard and think there's no data.
      const { data: me } = await supabase.auth.getUser();
      const adminCheck = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", me.user?.id ?? "")
        .maybeSingle();
      if (!adminCheck.data) {
        setError(
          `Signed in as ${me.user?.email ?? "unknown"}, but this account is not in the admins table. ` +
            "Run 0002_seed_admin.sql with this exact email, then reload.",
        );
        setLoading(false);
        return;
      }

      const [s, f, p, v] = await Promise.all([
        supabase.from("feedback_stats").select("*"),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("players").select("id, age_range"),
        supabase
          .from("visits")
          .select("player_id, created_at, language, device, country")
          .order("created_at", { ascending: false })
          .limit(5000),
      ]);
      if (s.error || f.error || p.error || v.error) {
        setError((s.error || f.error || p.error || v.error)?.message ?? "Query failed");
      } else {
        setStats((s.data as StatRow[]) ?? []);
        setFeedback((f.data as FeedbackRow[]) ?? []);
        setPlayers((p.data as PlayerRow[]) ?? []);
        setVisits((v.data as VisitRow[]) ?? []);
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
      notEnjoyed: responses - enjoyed,
      comments,
      pct: responses ? Math.round((enjoyed / responses) * 100) : 0,
      players: players.length,
    };
  }, [stats, players]);

  const traffic = useMemo(() => {
    const uniqueVisitors = new Set(visits.map((v) => v.player_id)).size;
    const sessions = visits.length;
    const responders = new Set(feedback.map((f) => f.player_id)).size;
    const conversion = uniqueVisitors ? Math.round((responders / uniqueVisitors) * 100) : 0;

    const byDay: Record<string, number> = {};
    for (const v of visits) {
      const d = v.created_at.slice(0, 10);
      byDay[d] = (byDay[d] ?? 0) + 1;
    }
    const days: { label: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ label: key.slice(5), count: byDay[key] ?? 0 });
    }
    return { uniqueVisitors, sessions, responders, conversion, days };
  }, [visits, feedback]);

  // Coarse demographics across all visits (near-100% coverage, unlike age).
  const demographics = useMemo(() => {
    const tally = (pick: (v: VisitRow) => string | null) => {
      const m: Record<string, number> = {};
      let known = 0;
      for (const v of visits) {
        const k = pick(v);
        if (k) {
          m[k] = (m[k] ?? 0) + 1;
          known++;
        }
      }
      return { rows: Object.entries(m).sort((a, b) => b[1] - a[1]), known };
    };
    return {
      countries: tally((v) => v.country),
      devices: tally((v) => v.device),
      languages: tally((v) => (v.language ? v.language.split("-")[0].toLowerCase() : null)),
    };
  }, [visits]);

  const perLevel = useMemo(
    () =>
      stats
        .filter((r) => r.game_mode === "arcade" && r.level_id != null)
        .sort((a, b) => (a.level_id ?? 0) - (b.level_id ?? 0)),
    [stats],
  );

  const perMode = useMemo(() => stats.filter((r) => r.game_mode !== "arcade"), [stats]);

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
          (modeFilter === "all" || f.game_mode === modeFilter) &&
          (enjoyFilter === "all" || (enjoyFilter === "yes" ? f.enjoyed : !f.enjoyed)),
      ),
    [feedback, modeFilter, enjoyFilter],
  );

  const [exporting, setExporting] = useState(false);
  const exportXlsx = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      // Lazy-load SheetJS only when the admin actually exports.
      const XLSX = await import("xlsx");
      const ageOf = new Map(players.map((p) => [p.id, p.age_range]));

      const rows = feedback.map((f) => ({
        Date: new Date(f.created_at).toLocaleString(),
        Mode: MODE_LABELS[f.game_mode] ?? f.game_mode,
        Level: f.level_id == null ? "" : levelName(f.level_id),
        Enjoyed: f.enjoyed ? "Yes" : "No",
        "Age range": ageOf.get(f.player_id) ? AGE_LABEL[ageOf.get(f.player_id) as string] : "",
        Comment: f.learned ?? "",
        Score: f.score ?? "",
        "Accuracy %": f.accuracy ?? "",
        Stars: f.stars ?? "",
        Player: f.player_id,
      }));

      const summary = stats.map((r) => ({
        Mode: MODE_LABELS[r.game_mode] ?? r.game_mode,
        Level: r.level_id == null ? "" : levelName(r.level_id),
        Responses: r.responses,
        "Enjoyed %": r.enjoyed_pct ?? "",
        Comments: r.comment_count,
        "Avg accuracy": r.avg_accuracy ?? "",
        "Avg score": r.avg_score ?? "",
      }));

      const visitRows = visits.map((v) => ({
        Date: new Date(v.created_at).toLocaleString(),
        Country: v.country ?? "",
        Device: v.device ?? "",
        Language: v.language ?? "",
        Player: v.player_id,
      }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Feedback");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), "Summary");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(visitRows), "Visits");
      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `ecosort-feedback-${stamp}.xlsx`);
    } catch (e) {
      alert("Export failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <div className="h-[100dvh] grid place-items-center bg-slate-100 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-emerald-600 animate-spin" />
          Loading analytics…
        </div>
      </div>
    );

  const deviceColors: Record<string, string> = { mobile: C.blue, desktop: C.orange, tablet: C.aqua };

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-100 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 grid place-items-center text-white font-black shrink-0">E</div>
            <div className="min-w-0">
              <h1 className="text-base font-black text-slate-900 leading-tight truncate">EcoSort Analytics</h1>
              <p className="text-[11px] text-slate-400 leading-tight">Player feedback &amp; traffic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportXlsx}
              disabled={exporting || feedback.length === 0}
              className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3.5 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting ? "Exporting…" : "↓ Export .xlsx"}
            </button>
            <button
              onClick={onSignOut}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 border border-slate-300 rounded-lg px-3 py-2 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 pb-24 flex flex-col gap-5">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatTile label="Unique visitors" value={traffic.uniqueVisitors} sub="distinct devices" />
          <StatTile label="Sessions" value={traffic.sessions} sub="total visits" />
          <StatTile label="Responses" value={totals.responses} sub={`${totals.comments} with comments`} />
          <StatTile
            label="Enjoyment"
            value={`${totals.pct}%`}
            accent={enjoymentTone(totals.pct)}
            sub={`${totals.enjoyed} liked it`}
          />
          <StatTile label="Feedback rate" value={`${traffic.conversion}%`} sub="visitors → responders" />
          <StatTile label="With age" value={ageDist.known} sub="shared age range" />
        </div>

        {/* Trend + enjoyment */}
        <div className="grid lg:grid-cols-3 gap-5">
          <Card title="Sessions" subtitle="Last 14 days" className="lg:col-span-2">
            {traffic.sessions === 0 ? <Empty>No visits recorded yet.</Empty> : <AreaChart data={traffic.days} />}
          </Card>
          <Card title="Enjoyment" subtitle="All responses">
            {totals.responses === 0 ? (
              <Empty>No feedback yet.</Empty>
            ) : (
              <Donut
                centerTop={`${totals.pct}%`}
                centerBottom="enjoyed"
                segments={[
                  { label: "Enjoyed", value: totals.enjoyed, color: C.good },
                  { label: "Didn’t enjoy", value: totals.notEnjoyed, color: C.bad },
                ]}
              />
            )}
          </Card>
        </div>

        {/* Engagement */}
        <div className="grid lg:grid-cols-2 gap-5">
          <Card title="Enjoyment by arcade level" subtitle="% who enjoyed · (responses)">
            {perLevel.length === 0 ? (
              <Empty>No arcade feedback yet.</Empty>
            ) : (
              <BarList
                max={100}
                rows={perLevel.map((r) => ({
                  label: levelName(r.level_id),
                  value: r.enjoyed_pct ?? 0,
                  caption: `${r.enjoyed_pct ?? 0}% (${r.responses})`,
                  tone: enjoymentTone(r.enjoyed_pct ?? 0),
                }))}
              />
            )}
          </Card>
          <Card title="Enjoyment by game mode" subtitle="% who enjoyed · (responses)">
            {perMode.length === 0 ? (
              <Empty>No mini-game feedback yet.</Empty>
            ) : (
              <BarList
                max={100}
                rows={perMode.map((r) => ({
                  label: MODE_LABELS[r.game_mode] ?? r.game_mode,
                  value: r.enjoyed_pct ?? 0,
                  caption: `${r.enjoyed_pct ?? 0}% (${r.responses})`,
                  tone: enjoymentTone(r.enjoyed_pct ?? 0),
                }))}
              />
            )}
          </Card>
        </div>

        {/* Audience: age */}
        <div className="grid lg:grid-cols-2 gap-5">
          <Card title="Age distribution" subtitle="Players who shared an age range">
            {ageDist.known === 0 ? (
              <Empty>No age data yet.</Empty>
            ) : (
              <BarList
                rows={AGE_RANGES.map((a) => ({
                  label: a.label,
                  value: ageDist.counts[a.value] ?? 0,
                  tone: C.violet,
                }))}
              />
            )}
          </Card>
          <Card title="Enjoyment by age" subtitle="% who enjoyed · (responses)">
            {Object.keys(enjoyByAge).length === 0 ? (
              <Empty>Not enough data yet.</Empty>
            ) : (
              <BarList
                max={100}
                rows={AGE_RANGES.filter((a) => enjoyByAge[a.value]).map((a) => {
                  const row = enjoyByAge[a.value];
                  const pct = row.total ? Math.round((row.enjoyed / row.total) * 100) : 0;
                  return { label: a.label, value: pct, caption: `${pct}% (${row.total})`, tone: enjoymentTone(pct) };
                })}
              />
            )}
          </Card>
        </div>

        {/* Demographics from traffic */}
        <div className="grid lg:grid-cols-3 gap-5">
          <Card title="Top countries" subtitle="From visit geo (Vercel)">
            {demographics.countries.known === 0 ? (
              <Empty>No country data yet.<br />Populates once deployed on Vercel.</Empty>
            ) : (
              <BarList
                labelWidth="3.5rem"
                rows={demographics.countries.rows.slice(0, 8).map(([code, n]) => ({ label: code, value: n, tone: C.blue }))}
              />
            )}
          </Card>
          <Card title="Devices" subtitle="All sessions">
            {demographics.devices.known === 0 ? (
              <Empty>No device data yet.</Empty>
            ) : (
              <Donut
                size={130}
                centerTop={String(demographics.devices.known)}
                centerBottom="sessions"
                segments={demographics.devices.rows.map(([d, n]) => ({
                  label: d[0].toUpperCase() + d.slice(1),
                  value: n,
                  color: deviceColors[d] ?? C.muted,
                }))}
              />
            )}
          </Card>
          <Card title="Top languages" subtitle="Browser locale">
            {demographics.languages.known === 0 ? (
              <Empty>No language data yet.</Empty>
            ) : (
              <BarList
                labelWidth="3.5rem"
                rows={demographics.languages.rows.slice(0, 8).map(([lang, n]) => ({ label: lang, value: n, tone: C.aqua }))}
              />
            )}
          </Card>
        </div>

        {/* Comments table */}
        <Card title="Comments" subtitle="What players learned / suggestions">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(["all", "arcade", "trivia", "detective", "hunt"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModeFilter(m)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  modeFilter === m
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                {m === "all" ? "All modes" : MODE_LABELS[m] ?? m}
              </button>
            ))}
            <span className="w-px h-5 bg-slate-200 mx-1" />
            {(["all", "yes", "no"] as const).map((e) => (
              <button
                key={e}
                onClick={() => setEnjoyFilter(e)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  enjoyFilter === e
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                {e === "all" ? "Any" : e === "yes" ? "👍 Enjoyed" : "👎 Didn’t"}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 tabular-nums">{comments.length} shown</span>
          </div>

          {comments.length === 0 ? (
            <Empty>No written comments for this filter.</Empty>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <th className="font-semibold py-2 px-2 whitespace-nowrap">Date</th>
                    <th className="font-semibold py-2 px-2 whitespace-nowrap">Where</th>
                    <th className="font-semibold py-2 px-2 whitespace-nowrap">Rating</th>
                    <th className="font-semibold py-2 px-2 w-full">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0 align-top hover:bg-slate-50/60">
                      <td className="py-2.5 px-2 whitespace-nowrap text-slate-400 text-xs tabular-nums">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-2 whitespace-nowrap text-slate-500 text-xs">
                        {MODE_LABELS[c.game_mode] ?? c.game_mode}
                        {c.level_id != null && <span className="text-slate-400"> · {shortLevel(c.level_id)}</span>}
                      </td>
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            c.enjoyed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {c.enjoyed ? "👍" : "👎"}
                        </span>
                      </td>
                      {/* Plain text — never rendered as HTML. */}
                      <td className="py-2.5 px-2 text-slate-700 whitespace-pre-wrap break-words min-w-[16rem]">
                        {c.learned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-slate-400 pt-2">
          {traffic.uniqueVisitors} visitors · {totals.responses} responses · updated {new Date().toLocaleString()}
        </p>
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
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(Boolean(session)));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <div className="h-[100dvh] overflow-y-auto grid place-items-center bg-slate-100 p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-black text-slate-900 mb-2">Dashboard not configured</h1>
          <p className="text-sm text-slate-600">
            Set <code className="bg-slate-200 px-1 rounded">VITE_SUPABASE_URL</code> and{" "}
            <code className="bg-slate-200 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your environment, then reload.
          </p>
        </div>
      </div>
    );
  }

  if (authed === null)
    return <div className="h-[100dvh] grid place-items-center bg-slate-100 text-slate-400">Loading…</div>;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return (
    <Dashboard
      onSignOut={async () => {
        await supabase?.auth.signOut();
        setAuthed(false);
      }}
    />
  );
};

export default AdminDashboard;
