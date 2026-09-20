/* ====================================================================== *
 *  Shrink link-preview cards that came out of Chrome too heavy.
 *
 *  Chrome writes a 24-bit PNG. That is the right thing for a screenshot of
 *  flat UI, which is what twelve of these cards are — they land between 20
 *  and 110 KB and this script leaves them alone, byte for byte. But the
 *  Trash Detective poster is a photographic SVG scene: sky gradients, lawn
 *  gradients, and several hundred soft dapple blobs. Truecolour PNG cannot
 *  compress that, and it came out at 856 KB.
 *
 *  That size is not merely slow. WhatsApp will not render a link preview
 *  whose image is much over 300 KB — it silently shows the link with no
 *  picture, which is the one outcome a share card exists to prevent.
 *
 *  So: median-cut to a palette, Floyd-Steinberg the error, and step the
 *  palette down until the file fits the budget. No dependency — Node's own
 *  zlib is the only thing a PNG needs. Cards already under budget are not
 *  rewritten, so re-running this is a no-op on a clean tree.
 * ====================================================================== */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { inflateSync, deflateSync, crc32 } from "node:zlib";

const BUDGET = 250 * 1024;
const LADDER = [256, 192, 128, 96, 64];
const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/* ---------------------------------------------------------------- read */

function readChunks(buf) {
  const out = [];
  let p = 8;
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    out.push({ type: buf.toString("ascii", p + 4, p + 8), data: buf.subarray(p + 8, p + 8 + len) });
    p += 12 + len;
  }
  return out;
}

/** Undo the per-scanline filters and hand back a flat RGB raster. */
function decode(buf) {
  const cs = readChunks(buf);
  const ihdr = cs.find((c) => c.type === "IHDR").data;
  const w = ihdr.readUInt32BE(0);
  const h = ihdr.readUInt32BE(4);
  const [depth, colour] = [ihdr[8], ihdr[9]];
  if (depth !== 8 || ihdr[12] !== 0) throw new Error(`depth ${depth} / interlace ${ihdr[12]} not handled`);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colour];
  if (!ch) return null;                                 // already indexed: nothing to do
  const raw = inflateSync(Buffer.concat(cs.filter((c) => c.type === "IDAT").map((c) => c.data)));
  const stride = w * ch;
  const px = Buffer.alloc(h * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = px.subarray(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? cur[i - ch] : 0;
      const b = prev[i];
      const c = i >= ch ? prev[i - ch] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const guess = a + b - c;
        const da = Math.abs(guess - a), db = Math.abs(guess - b), dc = Math.abs(guess - c);
        v += da <= db && da <= dc ? a : db <= dc ? b : c;
      }
      cur[i] = v & 0xff;
    }
    prev = cur;
  }
  const rgb = Buffer.alloc(w * h * 3);
  for (let i = 0, n = w * h; i < n; i++) {
    const s = i * ch, d = i * 3;
    if (ch >= 3) { rgb[d] = px[s]; rgb[d + 1] = px[s + 1]; rgb[d + 2] = px[s + 2]; }
    else rgb[d] = rgb[d + 1] = rgb[d + 2] = px[s];
  }
  return { w, h, rgb };
}

/* ------------------------------------------------------------ quantise */

/** Median cut over a 6-bit-per-channel histogram. Boxes are picked to split
 *  by extent times the cube root of population, so a wide box that nobody
 *  looks at loses to a narrow one covering half the sky. */
function medianCut(rgb, k) {
  const hist = new Map();
  for (let i = 0; i < rgb.length; i += 3) {
    const key = ((rgb[i] >> 2) << 12) | ((rgb[i + 1] >> 2) << 6) | (rgb[i + 2] >> 2);
    const e = hist.get(key);
    if (e) { e[0] += rgb[i]; e[1] += rgb[i + 1]; e[2] += rgb[i + 2]; e[3]++; }
    else hist.set(key, [rgb[i], rgb[i + 1], rgb[i + 2], 1]);
  }
  const extent = (box) => {
    const lo = [255, 255, 255], hi = [0, 0, 0];
    let n = 0;
    for (const e of box) {
      n += e[3];
      for (let c = 0; c < 3; c++) {
        const v = e[c] / e[3];
        if (v < lo[c]) lo[c] = v;
        if (v > hi[c]) hi[c] = v;
      }
    }
    return { lo, hi, n };
  };

  let boxes = [[...hist.values()]];
  while (boxes.length < k) {
    let pick = -1, best = -1;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].length < 2) continue;
      const { lo, hi, n } = extent(boxes[i]);
      const score = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) * Math.cbrt(n);
      if (score > best) { best = score; pick = i; }
    }
    if (pick < 0) break;
    const box = boxes[pick];
    const { lo, hi } = extent(box);
    const axis = [0, 1, 2].reduce((m, c) => (hi[c] - lo[c] > hi[m] - lo[m] ? c : m), 0);
    box.sort((p, q) => p[axis] / p[3] - q[axis] / q[3]);
    const total = box.reduce((s, e) => s + e[3], 0);
    let acc = 0, cut = 1;
    for (let i = 0; i < box.length - 1; i++) {
      acc += box[i][3];
      if (acc >= total / 2) { cut = i + 1; break; }
    }
    boxes.splice(pick, 1, box.slice(0, cut), box.slice(cut));
  }

  return boxes.map((box) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (const e of box) { r += e[0]; g += e[1]; b += e[2]; n += e[3]; }
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  });
}

/** Map every pixel to the palette, pushing the error forward. Without the
 *  dither a sky gradient turns into eight visible bands. */
function mapToPalette(w, h, rgb, pal) {
  const cache = new Map();
  const nearest = (r, g, b) => {
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    let best = 0, bd = Infinity;
    for (let i = 0; i < pal.length; i++) {
      const dr = r - pal[i][0], dg = g - pal[i][1], db = b - pal[i][2];
      const d = dr * dr * 3 + dg * dg * 6 + db * db;   // luma-weighted, so greens matter most
      if (d < bd) { bd = d; best = i; }
    }
    cache.set(key, best);
    return best;
  };

  const err = new Float32Array((w + 2) * 3);
  const next = new Float32Array((w + 2) * 3);
  const idx = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    next.fill(0);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3, e = (x + 1) * 3;
      const want = [
        Math.min(255, Math.max(0, rgb[i] + err[e])),
        Math.min(255, Math.max(0, rgb[i + 1] + err[e + 1])),
        Math.min(255, Math.max(0, rgb[i + 2] + err[e + 2])),
      ];
      const p = nearest(Math.round(want[0]), Math.round(want[1]), Math.round(want[2]));
      idx[y * w + x] = p;
      for (let c = 0; c < 3; c++) {
        const d = want[c] - pal[p][c];
        err[e + 3 + c] += (d * 7) / 16;
        next[e - 3 + c] += (d * 3) / 16;
        next[e + c] += (d * 5) / 16;
        next[e + 3 + c] += d / 16;
      }
    }
    err.set(next);
  }
  return idx;
}

/* --------------------------------------------------------------- write */

function encode(w, h, idx, pal) {
  const raw = Buffer.alloc(h * (w + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w + 1)] = 0;                               // palette indices: filtering only hurts
    idx.copy(raw, y * (w + 1) + 1, y * w, (y + 1) * w);
  }
  const chunk = (type, data) => {
    const out = Buffer.alloc(data.length + 12);
    out.writeUInt32BE(data.length, 0);
    out.write(type, 4, "ascii");
    data.copy(out, 8);
    out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])) >>> 0, data.length + 8);
    return out;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;                                          // bit depth
  ihdr[9] = 3;                                          // colour type: indexed
  const plte = Buffer.alloc(pal.length * 3);
  pal.forEach((c, i) => { plte[i * 3] = c[0]; plte[i * 3 + 1] = c[1]; plte[i * 3 + 2] = c[2]; });
  return Buffer.concat([
    SIG,
    chunk("IHDR", ihdr),
    chunk("PLTE", plte),
    chunk("IDAT", deflateSync(raw, { level: 9, memLevel: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---------------------------------------------------------------- main */

const directory = join(process.cwd(), "public", "share-cards");
const kb = (n) => `${Math.round(n / 1024)} KB`;
let touched = 0;

for (const name of readdirSync(directory).filter((f) => f.endsWith(".png")).sort()) {
  const path = join(directory, name);
  const before = statSync(path).size;
  if (before <= BUDGET) continue;

  const source = decode(readFileSync(path));
  if (!source) continue;                                // already indexed

  let chosen = null;
  for (const colours of LADDER) {
    const pal = medianCut(source.rgb, colours);
    const out = encode(source.w, source.h, mapToPalette(source.w, source.h, source.rgb, pal), pal);
    chosen = { out, colours };
    if (out.length <= BUDGET) break;
  }

  writeFileSync(path, chosen.out);
  touched++;
  console.log(
    `${name}: ${kb(before)} -> ${kb(chosen.out.length)} at ${chosen.colours} colours ` +
    `(-${Math.round((1 - chosen.out.length / before) * 100)}%)`,
  );
}

console.log(touched ? `Optimised ${touched} card(s).` : `All cards already under ${kb(BUDGET)}.`);
