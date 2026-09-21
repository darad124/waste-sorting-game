/* ====================================================================== *
 *  Outlast — decay.
 *
 *  Four behaviours, chosen by an item's `material`. This is the thing that
 *  makes a roster affordable: an object is drawn ONCE, intact, and its
 *  whole life is a treatment applied on top. It is also the most useful
 *  thing the mode teaches, because the four behaviours are genuinely
 *  different and people only really know about one of them.
 *
 *    paper    goes ragged, rots from the base up, tears through, gone
 *    plastic  does NOT go. It embrittles, yellows, and breaks into smaller
 *             and smaller pieces which stay on the screen for ever
 *    metal    rust blooms from patches, spreads, eats holes, gone
 *    glass    nothing. Nothing at all. That is the whole point of it.
 * ====================================================================== */

const RUST = "#7A3B18";

/** Per-lane filters and masks. Ids are prefixed so two lanes can share a
 *  document without colliding — the same trick the detective scenes needed. */
export function laneDefs(p, item) {
  const m = item.material;
  if (m === "glass") return "";

  let out = `
    <filter id="${p}chew" x="-60%" y="-60%" width="220%" height="220%">
      <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="4"
                    seed="11" result="n"/>
      <feDisplacementMap id="${p}disp" in="SourceGraphic" in2="n" scale="0"
                         xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="${p}holes" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${m === "plastic" ? "0.026" : "0.038"}"
                    numOctaves="4" seed="5"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope="0" intercept="0"/>
        <feFuncG type="linear" slope="0" intercept="0"/>
        <feFuncB type="linear" slope="0" intercept="0"/>
        <feFuncA id="${p}holeA" type="linear" slope="16" intercept="-16.5"/>
      </feComponentTransfer>
    </filter>
    <mask id="${p}mask">
      <rect x="-40" y="-40" width="380" height="500" fill="#fff"/>
      <rect x="-40" y="-40" width="380" height="500" filter="url(#${p}holes)"/>
    </mask>`;

  if (m === "paper" || m === "organic") {
    out += `
    <linearGradient id="${p}rot" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#2E2110"/>
      <stop offset=".35" stop-color="#4A3317" stop-opacity=".85"/>
      <stop offset=".75" stop-color="#6B4C22" stop-opacity=".35"/>
      <stop offset="1" stop-color="#6B4C22" stop-opacity="0"/>
    </linearGradient>`;
  }
  if (m === "plastic") {
    out += `
    <linearGradient id="${p}yellow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D8C25E"/>
      <stop offset=".6" stop-color="#B99A3C"/>
      <stop offset="1" stop-color="#8A7026"/>
    </linearGradient>`;
  }
  if (m === "steel" || m === "aluminium") {
    const a = m === "steel";
    out += `
    <linearGradient id="${p}corrG" x1="0" y1="0" x2="0" y2="1">
      ${a
        ? `<stop offset="0" stop-color="#B36A2E"/>
           <stop offset=".45" stop-color="${RUST}"/>
           <stop offset="1" stop-color="#4A2210"/>`
        : `<stop offset="0" stop-color="#EFEDE6"/>
           <stop offset=".5" stop-color="#C9CBC6"/>
           <stop offset="1" stop-color="#8E928E"/>`}
    </linearGradient>
    <filter id="${p}corrF" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${a ? "0.022" : "0.045"}"
                    numOctaves="4" seed="${a ? 19 : 31}"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope="0" intercept="1"/>
        <feFuncG type="linear" slope="0" intercept="1"/>
        <feFuncB type="linear" slope="0" intercept="1"/>
        <feFuncA id="${p}corrA" type="linear" slope="9" intercept="-8.8"/>
      </feComponentTransfer>
    </filter>
    <mask id="${p}corrM">
      <rect x="-40" y="-40" width="380" height="500" filter="url(#${p}corrF)"/>
    </mask>`;
  }
  return out;
}

/** Markup that goes INSIDE the body group, on top of the item's drawing. */
export function laneOverlays(p, item) {
  const m = item.material;
  if (m === "paper" || m === "organic")
    return `<path id="${p}rotP" fill="url(#${p}rot)" opacity="0" d="${item.silhouette}"/>`;
  if (m === "plastic")
    return `<path id="${p}yel" fill="url(#${p}yellow)" opacity="0"
                  style="mix-blend-mode:multiply" d="${item.silhouette}"/>
            <path id="${p}chalk" fill="#E6E2D6" opacity="0" d="${item.silhouette}"/>`;
  if (m === "steel" || m === "aluminium")
    return `<path id="${p}corrP" fill="url(#${p}corrG)" opacity="0"
                  mask="url(#${p}corrM)" d="${item.silhouette}"/>`;
  return "";
}

/** Plastic never leaves. Once it starts breaking up it sheds specks that
 *  stay on the floor for the rest of the run — which is the single most
 *  valuable thing this mode can show anybody. */
export function laneMicro(p, item) {
  if (item.material !== "plastic") return "";
  let s = `<g id="${p}micro" opacity="0">`;
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = 0; i < 26; i++) {
    const x = 150 + (rnd() - 0.5) * 230;
    const y = 372 + rnd() * 30;
    const r = 1.1 + rnd() * 2.6;
    s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(1)}"
            ry="${(r * 0.62).toFixed(1)}" fill="#A8B6BE" opacity="${(0.4 + rnd() * 0.5).toFixed(2)}"/>`;
  }
  return s + "</g>";
}

export function bodyAttrs(p, item) {
  return item.material === "glass"
    ? ""
    : `mask="url(#${p}mask)" filter="url(#${p}chew)"`;
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const g = (id) => document.getElementById(id);

/** Advance one lane to decay `d`, 0 intact, 1 finished. */
export function apply(p, item, d) {
  const m = item.material;
  const body = g(p + "body");
  const contact = g(p + "contact");
  const cast = g(p + "cast");

  if (m === "glass") {
    // Deliberately nothing. Not a subtle dulling, not a scratch — nothing.
    return;
  }

  const disp = g(p + "disp");
  const holeA = g(p + "holeA");

  if (m === "paper" || m === "organic") {
    disp.setAttribute("scale", (d * 46).toFixed(2));
    holeA.setAttribute("intercept", (-16.5 + d * 20).toFixed(3));
    g(p + "rotP").setAttribute("opacity", clamp(d * 1.5, 0, 0.92).toFixed(3));
    const k = 1 - d * 0.16;
    body.setAttribute("transform", `translate(150 400) scale(${k.toFixed(4)}) translate(-150 -400)`);
    body.style.opacity = (1 - clamp((d - 0.75) / 0.25, 0, 1)).toFixed(3);
    contact.setAttribute("rx", (item.base.rx * (1 - d * 0.8)).toFixed(1));
    contact.setAttribute("opacity", (0.85 * Math.pow(1 - d, 1.6)).toFixed(3));
    cast.setAttribute("opacity", Math.pow(1 - d, 1.3).toFixed(3));
    return;
  }

  if (m === "plastic") {
    // Colour goes first and the shape holds far longer than anyone expects.
    g(p + "yel").setAttribute("opacity", clamp(d * 1.5, 0, 0.62).toFixed(3));
    g(p + "chalk").setAttribute("opacity", clamp((d - 0.25) * 0.5, 0, 0.22).toFixed(3));
    // It only starts coming apart late, and then it does not stop.
    const frag = clamp((d - 0.42) / 0.58, 0, 1);
    disp.setAttribute("scale", (frag * frag * 38).toFixed(2));
    // Tops out around half the object still present. Paper goes to +2.5 and
    // vanishes; plastic must not, because "it is still there" IS the lesson.
    holeA.setAttribute("intercept", (-16.5 + frag * 8.7).toFixed(3));
    // The pieces SPREAD rather than shrinking away.
    const k = 1 + frag * 0.1;
    body.setAttribute("transform", `translate(150 400) scale(${k.toFixed(4)}) translate(-150 -400)`);
    // and the floor never gets its opacity back
    body.style.opacity = (1 - frag * 0.12).toFixed(3);
    g(p + "micro").setAttribute("opacity", clamp((d - 0.5) * 2.4, 0, 0.9).toFixed(3));
    contact.setAttribute("rx", (item.base.rx * (1 - frag * 0.4)).toFixed(1));
    contact.setAttribute("opacity", (0.8 * (1 - frag * 0.55)).toFixed(3));
    cast.setAttribute("opacity", (1 - frag * 0.45).toFixed(3));
    return;
  }

  if (m === "steel" || m === "aluminium") {
    const steel = m === "steel";
    // The corrosion is PATCHY and stays patchy. Opening the mask all the way
    // paints a flat orange slab over the whole can, which is what the first
    // pass did and it looked like a colour swap rather than rust.
    g(p + "corrA").setAttribute(
      "intercept", (-8.8 + clamp(d * 1.2, 0, 1) * (steel ? 6.3 : 5.2)).toFixed(3));
    g(p + "corrP").setAttribute(
      "opacity", clamp(d * 2.0, 0, steel ? 0.92 : 0.7).toFixed(3));

    // Steel gets eaten through. Aluminium's oxide seals it, so it only pits,
    // and it does that very late.
    const eat = steel
      ? clamp((d - 0.55) / 0.45, 0, 1)
      : clamp((d - 0.82) / 0.18, 0, 1);
    disp.setAttribute("scale", (eat * (steel ? 30 : 14)).toFixed(2));
    holeA.setAttribute("intercept", (-16.5 + eat * (steel ? 19 : 17)).toFixed(3));
    const k = 1 - eat * 0.1;
    body.setAttribute("transform", `translate(150 400) scale(${k.toFixed(4)}) translate(-150 -400)`);
    body.style.opacity = (1 - clamp((eat - 0.7) / 0.3, 0, 1)).toFixed(3);
    contact.setAttribute("rx", (item.base.rx * (1 - eat * 0.7)).toFixed(1));
    contact.setAttribute("opacity", (0.85 * Math.pow(1 - eat, 1.5)).toFixed(3));
    cast.setAttribute("opacity", Math.pow(1 - eat, 1.2).toFixed(3));
  }
}

/** Where an object's decay sits at time logT. It starts going a little
 *  before its nominal life and is finished a little after, so the change is
 *  watchable instead of a switch flipping. */
export function decayAt(logT, years) {
  return clamp((logT - Math.log10(years) + 0.8) / 1.45, 0, 1);
}
