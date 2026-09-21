/* ====================================================================== *
 *  The loop, minus the streak: pick a pair, commit to an answer, watch the
 *  race decide it. Everything the real mode needs is here except scoring.
 * ====================================================================== */

const clamp2 = (v, a, b) => (v < a ? a : v > b ? b : v);
const CAP = 6.3;                       // stop the clock at ~2 million years
const DUR = 7600;
const BEND = 2.4;

const KEYS = Object.keys(ITEMS);
const PAIRS = [];
for (let i = 0; i < KEYS.length; i++)
  for (let j = i + 1; j < KEYS.length; j++) {
    const a = ITEMS[KEYS[i]], b = ITEMS[KEYS[j]];
    // Only pairs with a gap big enough that the ordering is not in dispute.
    // Published decomposition figures disagree; the ranking of things an
    // order of magnitude apart does not.
    if (Math.abs(Math.log10(a.years) - Math.log10(b.years)) >= 1.2)
      PAIRS.push([KEYS[i], KEYS[j]]);
  }

const CASTG = (p) => `
  <radialGradient id="${p}castG">
    <stop offset="0" stop-color="#000000" stop-opacity=".62"/>
    <stop offset=".5" stop-color="#000000" stop-opacity=".34"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${p}causticG">
    <stop offset="0" stop-color="#D6F5CB" stop-opacity=".55"/>
    <stop offset=".38" stop-color="#7EC478" stop-opacity=".30"/>
    <stop offset=".72" stop-color="#4E8E4C" stop-opacity=".12"/>
    <stop offset="1" stop-color="#4E8E4C" stop-opacity="0"/>
  </radialGradient>`;

function laneHTML(p, item) {
  const b = item.base;
  const caustic = item.caustic
    ? `<ellipse cx="${item.caustic.cx}" cy="402" rx="${item.caustic.rx}"
                ry="${item.caustic.ry}" fill="url(#${p}causticG)"/>`
    : "";
  return `
  <button class="lane" data-pick="${item.id}">
    <svg viewBox="0 0 300 420" preserveAspectRatio="xMidYMax meet">
      <defs>${CASTG(p)}${item.defs.replace(/\{p\}/g, p)}${laneDefs(p, item)}</defs>
      <ellipse id="${p}cast" cx="${b.cx + 28}" cy="${(b.cy || 400) + 3}"
               rx="${(b.rx * 1.3).toFixed(0)}" ry="15" fill="url(#${p}castG)"/>
      <ellipse id="${p}contact" cx="${b.cx + 2}" cy="${b.cy || 400}"
               rx="${b.rx}" ry="9" fill="#04070A" opacity=".85"/>
      ${caustic}
      <g id="${p}body" ${bodyAttrs(p, item)}>
        <g transform="translate(150 ${b.cy || 400}) scale(${item.scale || 1}) translate(-150 ${-(b.cy || 400)})">
          ${item.body.replace(/\{p\}/g, p)}
          ${laneOverlays(p, item)}
        </g>
      </g>
      ${laneMicro(p, item)}
      <text id="${p}mark" x="150" y="40" text-anchor="middle" font-size="14"
            font-weight="700" letter-spacing=".18em" opacity="0"></text>
    </svg>
    <div class="floor"></div>
    <div class="tag">${item.name}<span class="verdict" id="${p}verdict"></span></div>
  </button>`;
}

function label(years) {
  if (years < 1 / 52) return [Math.max(1, Math.round(years * 365)), "days"];
  if (years < 1 / 12) return [Math.max(1, Math.round(years * 52)), "weeks"];
  if (years < 1) return [Math.max(1, Math.round(years * 12)), "months"];
  if (years < 1e3) return [Math.round(years), "years"];
  if (years < 1e6) return [Math.round(years / 100) * 100, "years"];
  return [Math.round(years / 1e6), "million years"];
}

let pair = null, T0 = 0, T1 = 1, raf = null, start = null, answered = false;
const el = (id) => document.getElementById(id);

function newPair() {
  if (raf) cancelAnimationFrame(raf);
  raf = null; start = null; answered = false;

  let next;
  do { next = PAIRS[(Math.random() * PAIRS.length) | 0]; }
  while (PAIRS.length > 1 && pair && next[0] === pair[0].id && next[1] === pair[1].id);

  const two = next.map((k) => ({ ...ITEMS[k], id: k }));
  if (Math.random() < 0.5) two.reverse();
  pair = two;

  const lo = Math.min(...two.map((i) => Math.log10(i.years)));
  const hi = Math.max(...two.map((i) => Math.log10(i.years)));
  T0 = lo - 1.3;
  T1 = Math.min(hi + 0.55, CAP);

  el("race").innerHTML = two.map((it, i) => laneHTML("l" + i + "_", it)).join("");
  el("ask").textContent = "Which one outlasts the other?";
  el("ask").className = "ask";
  el("num").textContent = "—";
  el("unit").textContent = "tap one";
  two.forEach((it, i) => apply("l" + i + "_", it, 0));

  document.querySelectorAll(".lane").forEach((btn) =>
    btn.addEventListener("click", () => answer(btn.dataset.pick)));
}

function answer(pickedId) {
  if (answered) return;
  answered = true;
  const winner = pair[0].years >= pair[1].years ? pair[0] : pair[1];
  const right = pickedId === winner.id;
  el("ask").textContent = right ? "Right." : "Not that one.";
  el("ask").className = "ask " + (right ? "good" : "bad");
  document.querySelectorAll(".lane").forEach((b) => b.classList.add("locked"));
  document.querySelector(`.lane[data-pick="${pickedId}"]`).classList.add("picked");
  start = null;
  raf = requestAnimationFrame(frame);
}

function frame(now) {
  if (start === null) start = now;
  const p = clamp2((now - start) / DUR, 0, 1);
  const logT = T0 + (T1 - T0) * Math.pow(p, BEND);
  const [n, u] = label(Math.pow(10, logT));
  el("num").textContent = n.toLocaleString();
  el("unit").textContent = u;

  pair.forEach((it, i) => {
    const pre = "l" + i + "_";
    const d = decayAt(logT, it.years);
    apply(pre, it, d);
    const v = el(pre + "verdict"), mk = el(pre + "mark");
    if (it.material === "plastic" && d >= 1 && !v.textContent) {
      v.textContent = "in pieces — but still here";
      v.className = "verdict show warn";
      mk.textContent = "STILL HERE"; mk.setAttribute("fill", "#E8C15A");
      mk.setAttribute("opacity", "1");
    } else if (it.material !== "plastic" && it.material !== "glass" && d >= 1 && !v.textContent) {
      const [ln, lu] = label(it.years);
      v.textContent = `gone in about ${ln.toLocaleString()} ${lu}`;
      v.className = "verdict show gone";
      mk.textContent = "GONE"; mk.setAttribute("fill", "#7C838C");
      mk.setAttribute("opacity", "1"); mk.setAttribute("y", "220");
    }
  });

  if (p >= 1) {
    pair.forEach((it, i) => {
      const v = el("l" + i + "_verdict"), mk = el("l" + i + "_mark");
      if (!v.textContent) {
        v.textContent = "still here";
        v.className = "verdict show here";
        mk.textContent = "STILL HERE"; mk.setAttribute("fill", "#E8C15A");
        mk.setAttribute("opacity", "1");
      }
    });
    raf = null;
    return;
  }
  raf = requestAnimationFrame(frame);
}

el("next").addEventListener("click", newPair);
newPair();

// Review hook. Not part of the game — it exists so a specific pair and a
// specific moment of its decay can be put on screen without waiting for the
// shuffle to offer it.
window.__outlast = {
  show(a, b, d) {
    pair = [{ ...ITEMS[a], id: a }, { ...ITEMS[b], id: b }];
    el("race").innerHTML = pair.map((it, i) => laneHTML("l" + i + "_", it)).join("");
    pair.forEach((it, i) => apply("l" + i + "_", it, d === undefined ? 0 : d));
    answered = true;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  },
  items: Object.keys(ITEMS),
};
