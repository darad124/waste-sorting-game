/* ====================================================================== *
 *  Outlast — the item library.
 *
 *  Ported from tools/outlast/items.js, which stays the place to author and
 *  preview them: `node tools/outlast/build.mjs && open tools/outlast/index.html`.
 *
 *  Every object is drawn in a 300 x 420 box with its base on y = 400 and its
 *  centre on x = 150. Objects are NOT to scale with each other, on purpose:
 *  this mode is about time, not size, and a cigarette butt drawn to scale
 *  beside a wine bottle would be a speck.
 *
 *  `{p}` in defs and body is replaced with the lane prefix so two lanes can
 *  share a document without their gradient ids colliding.
 * ====================================================================== */

export type Material =
  | "paper" | "organic" | "plastic" | "steel" | "aluminium" | "glass";

export interface OutlastItem {
  name: string;
  material: Material;
  /** Years to break down. See src/data/outlast.ts for the source and the
   *  conditions these assume. */
  years: number;
  base: { cx: number; rx: number; cy?: number };
  /** One path, the outer outline. The decay overlays paint inside it so rot,
   *  yellowing and rust never spill past the object's edge. */
  silhouette: string;
  defs: string;
  body: string;
  /** Things lying down are short; at 1:1 they sit in the bottom third of an
   *  empty frame. Scales about the contact point. */
  scale?: number;
  /** Light bent through the object and landing in its own shadow. Glass only. */
  caustic?: { cx: number; rx: number; ry: number };
}

export const ITEMS: Record<string, OutlastItem> = {

  /* ------------------------------------------------------------ PAPER */
  paper_bag: {
    name: "Paper bag",
    material: "paper",
    years: 0.083,
    base: { cx: 148, rx: 86 },
    silhouette: "M62 168 L78 150 L104 162 L126 142 L168 150 L196 136 L224 154 L240 170 Q248 280 238 396 Q148 412 58 396 Q52 280 62 168 Z",
    defs: `
      <linearGradient id="{p}kraftFront" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7E5828"/><stop offset=".13" stop-color="#B98C52"/>
        <stop offset=".38" stop-color="#DEB77E"/><stop offset=".62" stop-color="#C79B5E"/>
        <stop offset=".85" stop-color="#9A7040"/><stop offset="1" stop-color="#6E4C22"/>
      </linearGradient>
      <linearGradient id="{p}kraftGus" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#4E3418"/><stop offset=".4" stop-color="#7E5C2E"/>
        <stop offset=".75" stop-color="#5E4220"/><stop offset="1" stop-color="#8A6434"/>
      </linearGradient>
      <linearGradient id="{p}kraftMouth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#140D05"/><stop offset=".55" stop-color="#33230E"/>
        <stop offset="1" stop-color="#6E4E24"/>
      </linearGradient>`,
    body: `
      <!-- A paper bag is NOT a box. The first two attempts drew straight
           vertical sides and a level rim and it came out a bin with handles on.
           What actually names one is the accordion gusset down each side and a
           rim that has collapsed out of true, so both of those get the detail
           and the body is deliberately off-square and slouched. -->
      <path fill="url(#{p}kraftMouth)"
            d="M62 168 L78 150 L104 162 L126 142 L168 150 L196 136 L224 154 L240 170
               Q238 200 230 206 L74 202 Q64 196 62 168 Z"/>
      <path fill="#0E0904" opacity=".75"
            d="M80 168 L100 158 L126 166 L166 158 L196 150 L220 164 Q220 188 212 194
               L88 190 Q80 186 80 168 Z"/>
      <!-- the slouched body -->
      <path fill="url(#{p}kraftFront)"
            d="M96 196 L240 170 Q248 280 238 396 Q160 410 96 400 Z"/>
      <path fill="url(#{p}kraftGus)"
            d="M62 168 L96 196 L96 400 Q74 402 58 396 Q52 280 62 168 Z"/>
      <!-- the W-fold. This is the single thing that says paper bag. -->
      <path fill="none" stroke="#2E1E0C" stroke-opacity=".55" stroke-width="2.6"
            d="M62 168 L96 196 M78 182 L96 240 M70 226 L96 286 M64 300 L96 330
               M60 350 L96 372"/>
      <path fill="none" stroke="#B98C52" stroke-opacity=".45" stroke-width="2"
            d="M80 184 L96 220 M72 246 L96 300 M62 322 L96 352"/>
      <path fill="#3A2610" opacity=".35" d="M96 196 L110 198 L108 400 L96 400 Z"/>
      <!-- crumple. Straight creases read as printing; these wander. -->
      <path fill="none" stroke="#7A5729" stroke-opacity=".4" stroke-width="2.6"
            d="M132 204 Q126 300 138 402 M176 198 Q186 296 174 404 M214 188 Q206 292 218 398"/>
      <path fill="none" stroke="#E4C08C" stroke-opacity=".35" stroke-width="2"
            d="M120 246 Q170 236 232 244 M104 316 Q166 306 234 316"/>
      <path fill="#5E4220" opacity=".3"
            d="M96 372 Q166 384 238 372 Q238 388 238 396 Q160 410 96 400 Z"/>
      <!-- handles: one still standing, one gone slack, because a discarded bag
           never has two tidy loops -->
      <path fill="none" stroke="#4E3418" stroke-width="10" stroke-linecap="round"
            d="M104 172 C106 100 158 96 164 158"/>
      <path fill="none" stroke="#C99A5C" stroke-width="6" stroke-linecap="round"
            d="M104 172 C106 100 158 96 164 158"/>
      <path fill="none" stroke="#E8C48C" stroke-width="2" stroke-opacity=".7"
            d="M107 156 C110 108 154 104 161 146"/>
      <path fill="none" stroke="#4E3418" stroke-width="9" stroke-linecap="round"
            d="M188 146 C204 104 236 120 232 166"/>
      <path fill="none" stroke="#B08248" stroke-width="5" stroke-linecap="round"
            d="M188 146 C204 104 236 120 232 166"/>
      <path fill="none" stroke="#6E4E27" stroke-width="2" stroke-opacity=".7"
            d="M116 120 l9 -6 M136 106 l9 -2 M203 116 l8 -5 M224 132 l7 -6"/>`,
  },

  newspaper: {
    name: "Newspaper",
    material: "paper",
    years: 0.115,
    base: { cx: 150, rx: 96 },
    silhouette: "M44 196 L256 178 L262 386 Q150 404 40 388 Z",
    defs: `
      <linearGradient id="{p}newsFace" x1=".1" y1="0" x2=".9" y2="1">
        <stop offset="0" stop-color="#F2EFE4"/><stop offset=".45" stop-color="#E2DCCB"/>
        <stop offset="1" stop-color="#BFB7A2"/>
      </linearGradient>
      <linearGradient id="{p}newsEdge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#CFC8B4"/><stop offset="1" stop-color="#8E886F"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}newsEdge)" d="M40 372 L262 356 L262 386 Q150 404 40 388 Z"/>
      <path fill="#A9A188" d="M44 356 L258 340 L260 372 Q150 390 42 374 Z"/>
      <path fill="#CFC8B4" d="M44 348 L258 332 L259 350 Q150 368 43 352 Z"/>
      <path fill="url(#{p}newsFace)" d="M44 196 L256 178 L260 350 Q150 368 40 352 Z"/>
      <path fill="#000000" opacity=".06" d="M150 186 L256 178 L260 350 Q206 360 150 360 Z"/>
      <path fill="#2A2A2A" d="M62 210 L238 196 L238 226 L62 240 Z"/>
      <path fill="#4A4A4A" opacity=".5" d="M62 210 L238 196 L238 202 L62 216 Z"/>
      <path fill="none" stroke="#5A5A5A" stroke-width="3" stroke-opacity=".55"
            d="M62 254 L146 247 M62 264 L146 257 M62 274 L146 267 M62 284 L138 277
               M62 294 L146 287 M62 304 L142 297 M62 314 L146 307 M62 324 L134 317"/>
      <path fill="#8E8E8E" d="M160 244 L236 238 L236 288 L160 294 Z"/>
      <path fill="#6E6E6E" d="M160 268 L190 252 L212 270 L236 256 L236 288 L160 294 Z"/>
      <circle cx="180" cy="256" r="7" fill="#B4B4B4"/>
      <path fill="none" stroke="#5A5A5A" stroke-width="3" stroke-opacity=".5"
            d="M160 306 L236 300 M160 316 L236 310 M160 326 L222 320"/>
      <path fill="none" stroke="#9A937C" stroke-width="2" stroke-opacity=".8" d="M150 190 L152 362"/>`,
  },

  /* ---------------------------------------------------------- PLASTIC */
  plastic_bottle: {
    name: "Plastic bottle",
    material: "plastic",
    years: 450,
    base: { cx: 150, rx: 58 },
    silhouette: "M120 96 L180 96 L180 140 C180 154 190 164 198 178 C206 192 208 206 208 224 L208 384 Q208 398 194 400 L106 400 Q92 398 92 384 L92 224 C92 206 94 192 102 178 C110 164 120 154 120 140 Z",
    defs: `
      <linearGradient id="{p}pet" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7FA3B4" stop-opacity=".85"/>
        <stop offset=".1" stop-color="#C2DDE6" stop-opacity=".75"/>
        <stop offset=".3" stop-color="#EEF9FC" stop-opacity=".62"/>
        <stop offset=".55" stop-color="#BFD9E2" stop-opacity=".58"/>
        <stop offset=".84" stop-color="#7EA0B0" stop-opacity=".72"/>
        <stop offset="1" stop-color="#546F7D" stop-opacity=".85"/>
      </linearGradient>
      <linearGradient id="{p}petSpec" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
        <stop offset=".08" stop-color="#FFFFFF" stop-opacity=".95"/>
        <stop offset=".7" stop-color="#FFFFFF" stop-opacity=".45"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="{p}capBlue" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#14508E"/><stop offset=".28" stop-color="#3E8BD6"/>
        <stop offset=".6" stop-color="#2069AE"/><stop offset="1" stop-color="#0D3A69"/>
      </linearGradient>
      <linearGradient id="{p}labelW" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#9FB6C2"/><stop offset=".25" stop-color="#F4FAFC"/>
        <stop offset=".62" stop-color="#DCE9EF"/><stop offset="1" stop-color="#8CA3B0"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}pet)" d="M120 96 L180 96 L180 140 C180 154 190 164 198 178
            C206 192 208 206 208 224 L208 384 Q208 398 194 400 L106 400 Q92 398 92 384
            L92 224 C92 206 94 192 102 178 C110 164 120 154 120 140 Z"/>
      <path fill="#2E4A57" opacity=".45" d="M92 224 C92 206 94 192 102 178 L107 182
            C100 195 98 207 98 225 L98 390 L92 386 Z"/>
      <path fill="#2E4A57" opacity=".6" d="M208 224 C208 206 206 192 198 178 L193 182
            C200 195 202 207 202 225 L202 390 L208 386 Z"/>
      <path fill="none" stroke="#DCEEF5" stroke-opacity=".5" stroke-width="3"
            d="M100 240 Q150 250 200 240 M100 262 Q150 272 200 262 M100 284 Q150 294 200 284"/>
      <rect x="98" y="300" width="104" height="66" fill="url(#{p}labelW)"/>
      <rect x="98" y="300" width="104" height="7" fill="#2F86C4"/>
      <rect x="98" y="359" width="104" height="7" fill="#2F86C4"/>
      <path fill="none" stroke="#7F98A6" stroke-width="3.4" stroke-opacity=".8"
            d="M112 322 h60 M112 334 h76 M112 346 h48"/>
      <path fill="url(#{p}petSpec)" d="M110 190 C114 176 120 168 124 162 L131 170
            C126 176 119 184 117 196 L117 372 L110 372 Z"/>
      <rect x="110" y="200" width="8" height="172" rx="4" fill="url(#{p}petSpec)"/>
      <rect x="186" y="214" width="4" height="150" rx="2" fill="#FFFFFF" opacity=".28"/>
      <path fill="#3E5C6B" opacity=".5" d="M92 372 Q150 388 208 372 L208 384
            Q208 398 194 400 L106 400 Q92 398 92 384 Z"/>
      <path fill="none" stroke="#8FB4C4" stroke-width="3" stroke-opacity=".7"
            d="M108 396 q14 -14 20 0 q14 -14 22 0 q14 -14 22 0 q14 -14 20 0"/>
      <rect x="120" y="86" width="60" height="12" fill="#B9D6E2" opacity=".8"/>
      <path fill="none" stroke="#9BBDCC" stroke-width="2.4" stroke-opacity=".85"
            d="M122 92 h56 M122 98 h56"/>
      <path fill="url(#{p}capBlue)" d="M118 54 L182 54 Q186 54 186 58 L186 84
            Q186 88 182 88 L118 88 Q114 88 114 84 L114 58 Q114 54 118 54 Z"/>
      <path fill="#5FA8E4" opacity=".7" d="M118 54 L182 54 Q186 54 186 57 L186 62 L114 62 L114 57 Q114 54 118 54 Z"/>
      <path fill="none" stroke="#0C3560" stroke-width="1.8" stroke-opacity=".7"
            d="M124 60 v24 M136 60 v24 M148 60 v24 M160 60 v24 M172 60 v24"/>`,
  },

  cigarette_butt: {
    name: "Cigarette butt",
    material: "plastic",
    years: 10,
    base: { cx: 150, rx: 76 },
    silhouette: "M48 300 L252 288 L256 366 L52 378 Z",
    defs: `
      <linearGradient id="{p}filt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E8C98A"/><stop offset=".3" stop-color="#D8A85C"/>
        <stop offset=".72" stop-color="#B98443"/><stop offset="1" stop-color="#8A5E2C"/>
      </linearGradient>
      <linearGradient id="{p}papr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FCFAF4"/><stop offset=".32" stop-color="#EDE8DC"/>
        <stop offset=".76" stop-color="#C9C2B2"/><stop offset="1" stop-color="#9C9585"/>
      </linearGradient>
      <linearGradient id="{p}burn" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#4A4238"/><stop offset=".5" stop-color="#241F19"/>
        <stop offset="1" stop-color="#15120E"/>
      </linearGradient>`,
    body: `
      <g transform="rotate(-4 150 332)">
        <path fill="url(#{p}filt)" d="M48 302 L150 296 L152 372 L52 378 Q46 340 48 302 Z"/>
        <path fill="#F0D9A8" opacity=".55" d="M48 302 L150 296 L150 314 L48 320 Z"/>
        <path fill="#7C5226" opacity=".45" d="M50 356 L151 350 L152 372 L52 378 Z"/>
        <ellipse cx="50" cy="340" rx="7" ry="38" fill="#B98443"/>
        <ellipse cx="50" cy="340" rx="5" ry="34" fill="#8A5E2C" opacity=".8"/>
        <path fill="none" stroke="#9A6A32" stroke-width="1.6" stroke-opacity=".7"
              d="M62 300 L64 376 M80 299 L82 375 M98 298 L100 374 M116 297 L118 373 M134 296 L136 372"/>
        <path fill="url(#{p}papr)" d="M150 296 L236 291 L240 366 L152 372 Z"/>
        <path fill="#B9AE98" opacity=".6" d="M150 296 L236 291 L236 300 L150 305 Z"/>
        <path fill="#C4A05A" d="M150 294 L164 293 L166 373 L152 374 Z"/>
        <path fill="#E0C283" opacity=".7" d="M150 294 L164 293 L164 302 L150 303 Z"/>
        <path fill="url(#{p}burn)" d="M236 291 L252 290 Q258 328 256 366 L240 366 Z"/>
        <path fill="#0E0C09" d="M244 296 Q254 326 252 360 L242 360 Q246 326 240 297 Z"/>
        <ellipse cx="252" cy="328" rx="5" ry="37" fill="#1A1611"/>
        <ellipse cx="252" cy="328" rx="3" ry="30" fill="#33291D"/>
        <path fill="#9C9585" opacity=".5" d="M228 292 Q234 328 232 366 L240 366 Q242 328 236 291 Z"/>
      </g>
      <ellipse cx="96" cy="386" rx="22" ry="5" fill="#6B5A3A" opacity=".3"/>`,
  },

  plastic_bag: {
    name: "Carrier bag",
    material: "plastic",
    years: 20,
    base: { cx: 150, rx: 84 },
    silhouette: "M74 150 L226 150 Q240 260 234 396 Q150 410 66 396 Q60 260 74 150 Z",
    defs: `
      <linearGradient id="{p}hdpe" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7E8E98"/><stop offset=".14" stop-color="#C8D6DD"/>
        <stop offset=".34" stop-color="#F0F6F8"/><stop offset=".56" stop-color="#D2DEE4"/>
        <stop offset=".8" stop-color="#9FAFB8"/><stop offset="1" stop-color="#6E7C86"/>
      </linearGradient>
      <linearGradient id="{p}hdpeTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}hdpe)" d="M74 150 L226 150 Q240 260 234 396 Q150 410 66 396 Q60 260 74 150 Z"/>
      <path fill="url(#{p}hdpeTop)" d="M74 150 L226 150 Q230 208 228 246 Q150 262 72 246 Q70 208 74 150 Z"/>
      <path fill="none" stroke="#8C9AA4" stroke-width="10" stroke-linecap="round" stroke-opacity=".9"
            d="M84 154 C86 82 140 78 144 150"/>
      <path fill="none" stroke="#DCE6EA" stroke-width="5" stroke-linecap="round"
            d="M84 154 C86 82 140 78 144 150"/>
      <path fill="none" stroke="#8C9AA4" stroke-width="10" stroke-linecap="round" stroke-opacity=".9"
            d="M158 150 C162 78 216 82 218 154"/>
      <path fill="none" stroke="#CBD8DE" stroke-width="5" stroke-linecap="round"
            d="M158 150 C162 78 216 82 218 154"/>
      <path fill="#6E7C86" opacity=".45" d="M74 150 L226 150 L225 162 L75 162 Z"/>
      <path fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="3"
            d="M96 172 Q104 280 98 388 M150 168 Q154 282 150 394 M204 172 Q198 280 204 388"/>
      <path fill="none" stroke="#93A3AC" stroke-opacity=".55" stroke-width="2.4"
            d="M122 176 Q128 282 122 390 M178 176 Q174 282 178 390"/>
      <ellipse cx="150" cy="268" rx="46" ry="30" fill="#2E7BB8" opacity=".55"/>
      <path fill="#F4FAFC" opacity=".85" d="M128 254 h44 v7 h-44 Z M128 268 h44 v7 h-44 Z M128 282 h30 v7 h-30 Z"/>
      <path fill="#6E7C86" opacity=".4" d="M66 374 Q150 392 234 374 Q150 410 66 396 Z"/>`,
  },

  foam_cup: {
    name: "Foam cup",
    material: "plastic",
    years: 500,
    base: { cx: 150, rx: 50 },
    silhouette: "M92 130 L208 130 L192 388 Q150 398 108 388 Z",
    defs: `
      <linearGradient id="{p}foam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#B8B6AE"/><stop offset=".12" stop-color="#E6E4DC"/>
        <stop offset=".33" stop-color="#FDFDFA"/><stop offset=".58" stop-color="#EDEBE3"/>
        <stop offset=".82" stop-color="#C6C4BB"/><stop offset="1" stop-color="#9C9A92"/>
      </linearGradient>
      <linearGradient id="{p}foamRim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C2C0B7"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}foam)" d="M92 130 L208 130 L192 388 Q150 398 108 388 Z"/>
      <path fill="#9C9A92" opacity=".35" d="M92 130 L208 130 L207 142 L93 142 Z"/>
      <path fill="none" stroke="#C6C4BB" stroke-width="2.4" stroke-opacity=".7"
            d="M96 196 Q150 206 204 196 M100 262 Q150 272 200 262 M104 328 Q150 338 196 328"/>
      <ellipse cx="150" cy="130" rx="58" ry="14" fill="url(#{p}foamRim)"/>
      <ellipse cx="150" cy="132" rx="58" ry="14" fill="#B0AEA6"/>
      <ellipse cx="150" cy="129" rx="58" ry="14" fill="#FAFAF6"/>
      <ellipse cx="150" cy="131" rx="49" ry="10" fill="#8E8C84"/>
      <ellipse cx="150" cy="133" rx="45" ry="8.5" fill="#4A4842"/>
      <ellipse cx="150" cy="137" rx="41" ry="7" fill="#6E5A3E" opacity=".75"/>
      <path fill="#FFFFFF" opacity=".45" d="M112 126 q32 -10 68 -2 q-34 6 -68 2 Z"/>
      <ellipse cx="150" cy="390" rx="42" ry="8" fill="#B0AEA6"/>
      <ellipse cx="150" cy="387" rx="42" ry="8" fill="#E2E0D8"/>
      <ellipse cx="150" cy="387" rx="33" ry="5.5" fill="#C2C0B7"/>
      <g fill="#FFFFFF" opacity=".5">
        <circle cx="118" cy="200" r="3"/><circle cx="170" cy="232" r="2.4"/>
        <circle cx="132" cy="288" r="2.8"/><circle cx="186" cy="176" r="2.2"/>
        <circle cx="160" cy="330" r="2.6"/><circle cx="126" cy="350" r="2"/>
      </g>`,
  },

  face_mask: {
    scale: 1.18,
    name: "Face mask",
    material: "plastic",
    years: 450,
    base: { cx: 150, rx: 78, cy: 392 },
    silhouette: "M64 232 L236 232 Q244 318 236 392 L64 392 Q56 318 64 232 Z",
    defs: `
      <linearGradient id="{p}mask" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9FC8DC"/><stop offset=".22" stop-color="#C8E2EE"/>
        <stop offset=".5" stop-color="#A8D0E2"/><stop offset=".78" stop-color="#8ABACF"/>
        <stop offset="1" stop-color="#6E9FB6"/>
      </linearGradient>`,
    body: `
      <g transform="translate(0 36)">
      <path fill="none" stroke="#DCE6EA" stroke-width="5" stroke-linecap="round"
            d="M66 210 C24 232 22 312 64 342"/>
      <path fill="none" stroke="#9FB0B8" stroke-width="2" stroke-linecap="round"
            d="M66 212 C28 234 26 310 64 340"/>
      <path fill="none" stroke="#DCE6EA" stroke-width="5" stroke-linecap="round"
            d="M234 210 C276 232 278 312 236 342"/>
      <path fill="none" stroke="#9FB0B8" stroke-width="2" stroke-linecap="round"
            d="M234 212 C272 234 274 310 236 340"/>
      <path fill="url(#{p}mask)" d="M64 196 L236 196 Q244 282 236 356 L64 356 Q56 282 64 196 Z"/>
      <path fill="#FFFFFF" opacity=".3" d="M64 196 L236 196 Q240 226 238 244 L62 244 Q60 226 64 196 Z"/>
      <path fill="#6E9FB6" opacity=".55" d="M58 238 L242 238 L242 248 L58 248 Z"/>
      <path fill="#6E9FB6" opacity=".55" d="M57 286 L243 286 L243 296 L57 296 Z"/>
      <path fill="#6E9FB6" opacity=".55" d="M58 332 L242 332 L242 342 L58 342 Z"/>
      <path fill="#FFFFFF" opacity=".35" d="M58 248 L242 248 L242 254 L58 254 Z M57 296 L243 296 L243 302 L57 302 Z"/>
      <path fill="#B8C6CE" d="M64 196 L236 196 L236 208 L64 208 Z"/>
      <path fill="#7E8E98" d="M74 199 L226 199 L226 204 L74 204 Z"/>
      <path fill="#5A7F94" opacity=".5" d="M64 350 L236 350 L236 356 L64 356 Z"/>
      </g>`,
  },

  coffee_cup: {
    name: "Coffee cup",
    material: "plastic",
    years: 30,
    base: { cx: 150, rx: 52 },
    silhouette: "M94 116 L206 116 L192 388 Q150 398 108 388 Z",
    defs: `
      <linearGradient id="{p}cupPaper" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#B9B2A4"/><stop offset=".14" stop-color="#EFEADC"/>
        <stop offset=".36" stop-color="#FCFAF2"/><stop offset=".6" stop-color="#E8E2D2"/>
        <stop offset=".84" stop-color="#C2BBAB"/><stop offset="1" stop-color="#9A9486"/>
      </linearGradient>
      <linearGradient id="{p}sleeve" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6E4E2C"/><stop offset=".16" stop-color="#A97A46"/>
        <stop offset=".42" stop-color="#C69660"/><stop offset=".7" stop-color="#93693A"/>
        <stop offset="1" stop-color="#5E4224"/>
      </linearGradient>
      <linearGradient id="{p}lid" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#1E2226"/><stop offset=".2" stop-color="#4A5158"/>
        <stop offset=".44" stop-color="#5E666E"/><stop offset=".72" stop-color="#363C42"/>
        <stop offset="1" stop-color="#181C20"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}cupPaper)" d="M94 116 L206 116 L192 388 Q150 398 108 388 Z"/>
      <path fill="url(#{p}sleeve)" d="M100 232 L200 232 L194 320 L106 320 Z"/>
      <path fill="#F0E0C4" opacity=".8" d="M100 232 L200 232 L199 240 L101 240 Z M107 312 L193 312 L194 320 L106 320 Z"/>
      <path fill="none" stroke="#5E4224" stroke-width="2" stroke-opacity=".55"
            d="M114 234 L110 318 M134 233 L131 319 M154 233 L153 319 M174 233 L176 319"/>
      <ellipse cx="150" cy="276" rx="22" ry="17" fill="#F2E4C8" opacity=".9"/>
      <path fill="#6E4E2C" d="M138 268 h24 v5 h-24 Z M138 278 h24 v5 h-24 Z"/>
      <path fill="#FFFFFF" opacity=".45" d="M110 124 L118 124 L112 390 L106 386 Z"/>
      <path fill="#7E7768" opacity=".35" d="M188 124 L196 124 L192 388 L186 390 Z"/>
      <path fill="url(#{p}lid)" d="M88 104 L212 104 L206 126 L94 126 Z"/>
      <ellipse cx="150" cy="104" rx="62" ry="15" fill="url(#{p}lid)"/>
      <ellipse cx="150" cy="102" rx="62" ry="15" fill="#5A626A"/>
      <ellipse cx="150" cy="103" rx="52" ry="11" fill="#2A3036"/>
      <ellipse cx="150" cy="101" rx="52" ry="11" fill="#454C54"/>
      <ellipse cx="150" cy="100" rx="38" ry="7.5" fill="#2E343A"/>
      <path fill="#12161A" d="M132 94 q16 -8 34 -1 q-6 9 -18 9 q-13 0 -16 -8 Z"/>
      <path fill="#6E767E" opacity=".7" d="M112 96 q26 -11 58 -4 q-28 3 -58 4 Z"/>
      <ellipse cx="150" cy="390" rx="42" ry="8" fill="#A39C8E"/>
      <ellipse cx="150" cy="387" rx="42" ry="8" fill="#E2DCCC"/>`,
  },

  toothbrush: {
    scale: 1.22,
    name: "Toothbrush",
    material: "plastic",
    years: 500,
    // cy sits where the HANDLE rests, not at the standing baseline — the
    // scale is applied about this point, so getting it wrong leaves the brush
    // hovering 60px above its own shadow.
    base: { cx: 158, rx: 92, cy: 352 },
    silhouette: "M36 338 L104 330 L110 316 L118 316 L124 330 L258 322 Q272 322 272 334 Q272 348 258 348 L124 352 L118 366 L110 366 L104 352 L36 352 Q28 345 36 338 Z",
    defs: `
      <linearGradient id="{p}brushH" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6FD0EE"/><stop offset=".28" stop-color="#2E9CC8"/>
        <stop offset=".62" stop-color="#1A7AA4"/><stop offset="1" stop-color="#0A4664"/>
      </linearGradient>
      <linearGradient id="{p}brushG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8E98A2"/><stop offset=".3" stop-color="#4E565E"/>
        <stop offset="1" stop-color="#22282E"/>
      </linearGradient>
      <linearGradient id="{p}tuft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF"/><stop offset=".62" stop-color="#E2EDF3"/>
        <stop offset="1" stop-color="#A8BDC9"/>
      </linearGradient>`,
    body: `
      <!-- Side-on and flat, with the BRISTLES STANDING UP off the head. Drawn
           at three-quarters with the tufts sunk into the surface, which is what
           the last two attempts did, it is a pen. The comb of tufts rising
           above a flat head is the outline everybody knows. -->
      <g transform="rotate(-3 150 336)">
        <!-- bristle block first, so the head overlaps its roots -->
        <g fill="url(#{p}tuft)">
          <rect x="40" y="294" width="11" height="40" rx="5"/>
          <rect x="54" y="288" width="11" height="46" rx="5"/>
          <rect x="68" y="286" width="11" height="48" rx="5"/>
          <rect x="82" y="288" width="11" height="46" rx="5"/>
          <rect x="96" y="294" width="11" height="40" rx="5"/>
        </g>
        <g fill="#C2D6E2" opacity=".75">
          <rect x="47" y="300" width="5" height="34" rx="2.5"/>
          <rect x="61" y="294" width="5" height="40" rx="2.5"/>
          <rect x="75" y="292" width="5" height="42" rx="2.5"/>
          <rect x="89" y="294" width="5" height="40" rx="2.5"/>
          <rect x="103" y="300" width="5" height="34" rx="2.5"/>
        </g>
        <g fill="#5FC2E4" opacity=".85">
          <rect x="54" y="288" width="11" height="9" rx="4.5"/>
          <rect x="82" y="288" width="11" height="9" rx="4.5"/>
        </g>
        <!-- head: clearly wider than the neck -->
        <path fill="url(#{p}brushH)" d="M36 338 Q28 345 36 352 L108 352 Q120 345 108 330 Z"/>
        <ellipse cx="72" cy="341" rx="38" ry="12" fill="url(#{p}brushH)"/>
        <ellipse cx="72" cy="337" rx="34" ry="7" fill="#7FD8F4" opacity=".45"/>
        <!-- neck: the narrowest point, and the reason it is not a spatula -->
        <path fill="url(#{p}brushH)" d="M104 334 L150 330 L150 350 L104 348 Z"/>
        <!-- handle, tapering to a rounded end, with a rubber grip -->
        <path fill="url(#{p}brushH)" d="M150 328 L250 322 Q272 322 272 334
              Q272 348 250 348 L150 352 Z"/>
        <path fill="url(#{p}brushG)" d="M176 327 L222 324 L222 348 L176 350 Z"/>
        <g fill="#8E98A2" opacity=".6">
          <rect x="182" y="329" width="4" height="17" rx="2"/>
          <rect x="192" y="328" width="4" height="18" rx="2"/>
          <rect x="202" y="328" width="4" height="18" rx="2"/>
          <rect x="212" y="327" width="4" height="18" rx="2"/>
        </g>
        <path fill="#9FE0F4" opacity=".55" d="M150 328 L250 322 Q266 322 269 330
              L150 336 Z"/>
        <path fill="#063A54" opacity=".4" d="M150 346 L270 341 Q268 348 250 348
              L150 352 Z"/>
        <ellipse cx="256" cy="330" rx="11" ry="4" fill="#DFF3FB" opacity=".5"/>
      </g>`,
  },

  plastic_straw: {
    scale: 1.05,
    name: "Plastic straw",
    material: "plastic",
    years: 200,
    base: { cx: 150, rx: 78, cy: 392 },
    silhouette: "M96 388 L122 384 L172 196 L182 160 L246 178 L242 200 L192 186 L146 372 Z",
    defs: `
      <linearGradient id="{p}strawR" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7A1624"/><stop offset=".22" stop-color="#D42E42"/>
        <stop offset=".46" stop-color="#FF8894"/><stop offset=".72" stop-color="#C42638"/>
        <stop offset="1" stop-color="#6E1220"/>
      </linearGradient>
      <linearGradient id="{p}strawR2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FF8894"/><stop offset=".4" stop-color="#D42E42"/>
        <stop offset="1" stop-color="#7A1624"/>
      </linearGradient>`,
    body: `
      <!-- A straight tube is a stick, and a stick is a pencil or a chopstick.
           The BEND and its concertina is the only thing that says drinking
           straw, so the elbow gets the middle of the frame and the ribs are
           drawn large enough to count. -->
      <g transform="rotate(-2 160 290)">
        <!-- the long leg, standing on the ground -->
        <path fill="url(#{p}strawR)" d="M96 388 L124 384 L174 194 L148 188 Z"/>
        <path fill="#FFC2C8" opacity=".45" d="M102 386 L110 385 L158 192 L150 190 Z"/>
        <path fill="#5E0E1A" opacity=".45" d="M118 385 L124 384 L174 194 L168 192 Z"/>
        <!-- the concertina elbow: seven ribs, and they are the whole point -->
        <g>
          <path fill="url(#{p}strawR2)" d="M148 188 L174 194 L170 210 L144 204 Z"/>
          <path fill="#FF9AA6" d="M146 196 L172 202 L171 206 L145 200 Z"/>
          <path fill="url(#{p}strawR2)" d="M152 170 L178 176 L174 192 L148 186 Z"/>
          <path fill="#FF9AA6" d="M150 178 L176 184 L175 188 L149 182 Z"/>
          <path fill="url(#{p}strawR2)" d="M156 152 L182 158 L178 174 L152 168 Z"/>
          <path fill="#FF9AA6" d="M154 160 L180 166 L179 170 L153 164 Z"/>
          <path fill="url(#{p}strawR2)" d="M161 136 L187 142 L183 156 L157 150 Z"/>
          <path fill="#FF9AA6" d="M159 143 L185 149 L184 153 L158 147 Z"/>
        </g>
        <!-- the bend itself, turning the short leg over -->
        <path fill="url(#{p}strawR)" d="M161 136 Q170 112 196 110 L200 136
              Q184 138 183 156 Z"/>
        <path fill="#FF9AA6" opacity=".4" d="M166 132 Q174 116 194 114 L195 122
              Q178 124 172 138 Z"/>
        <!-- the short leg, tipped over -->
        <path fill="url(#{p}strawR)" d="M196 110 L250 128 L242 152 L188 134 Z"/>
        <path fill="#FFC2C8" opacity=".42" d="M198 116 L248 133 L246 139 L196 122 Z"/>
        <path fill="#5E0E1A" opacity=".4" d="M190 130 L244 148 L242 152 L188 134 Z"/>
        <ellipse cx="246" cy="140" rx="13" ry="6" fill="#5E0E1A" transform="rotate(20 246 140)"/>
        <ellipse cx="245" cy="139" rx="9" ry="4" fill="#1E0408" transform="rotate(20 245 139)"/>
        <ellipse cx="110" cy="386" rx="15" ry="6" fill="#7A1624" transform="rotate(-14 110 386)"/>
        <ellipse cx="110" cy="385" rx="10" ry="3.6" fill="#33060C" transform="rotate(-14 110 385)"/>
      </g>`,
  },


  /* ------------------------------------------------- PAPER AND ORGANIC */
  cardboard_box: {
    name: "Cardboard box",
    material: "paper",
    years: 0.17,
    base: { cx: 150, rx: 92 },
    silhouette: "M62 186 L150 226 L238 186 L238 340 L150 392 L62 340 Z",
    defs: `
      <linearGradient id="{p}cardL" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8A6234"/><stop offset="1" stop-color="#B4854A"/>
      </linearGradient>
      <linearGradient id="{p}cardR" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7C5628"/><stop offset="1" stop-color="#5E401C"/>
      </linearGradient>
      <linearGradient id="{p}cardIn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3A2810"/><stop offset="1" stop-color="#6E4E24"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}cardIn)" d="M62 186 L150 226 L238 186 L150 150 Z"/>
      <path fill="#2A1C0A" opacity=".65" d="M86 186 L150 214 L214 186 L150 164 Z"/>
      <path fill="url(#{p}cardL)" d="M62 186 L150 226 L150 392 L62 340 Z"/>
      <path fill="url(#{p}cardR)" d="M150 226 L238 186 L238 340 L150 392 Z"/>
      <!-- the corrugated edge, which is the whole tell -->
      <path fill="#D2A464" d="M62 182 L150 146 L238 182 L238 190 L150 154 L62 190 Z"/>
      <path fill="none" stroke="#8A6234" stroke-width="2" stroke-opacity=".8"
            d="M74 183 l4 5 M86 179 l4 5 M98 175 l4 5 M110 171 l4 5 M122 167 l4 5
               M134 163 l4 5 M162 163 l4 -5 M174 167 l4 -5 M186 171 l4 -5
               M198 175 l4 -5 M210 179 l4 -5 M222 183 l4 -5"/>
      <!-- open flaps folded out -->
      <path fill="#C1934F" d="M62 186 L150 150 L120 134 L38 168 Z"/>
      <path fill="#A87C3E" d="M238 186 L150 150 L180 132 L264 166 Z"/>
      <path fill="#8A6234" opacity=".4" d="M62 186 L150 150 L150 156 L64 191 Z"/>
      <path fill="none" stroke="#6E4A20" stroke-width="2.6" stroke-opacity=".45"
            d="M150 226 L150 392 M62 252 L150 292 M238 252 L150 292"/>
      <path fill="#F0DCB4" opacity=".75" d="M92 268 L138 288 L138 322 L92 302 Z"/>
      <path fill="#7C5628" d="M98 278 h34 v5 h-34 Z M98 290 h26 v5 h-26 Z"/>
      <path fill="#5E401C" opacity=".45" d="M150 226 L238 186 L238 196 L150 236 Z"/>`,
  },

  egg_carton: {
    scale: 1.1,
    name: "Egg carton",
    material: "paper",
    years: 0.25,
    base: { cx: 150, rx: 96, cy: 394 },
    silhouette: "M42 300 Q40 264 62 258 L236 258 Q260 264 258 300 L258 370 Q258 392 236 394 L64 394 Q42 392 42 370 Z",
    defs: `
      <linearGradient id="{p}pulp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#C6B9A0"/><stop offset=".4" stop-color="#A8997E"/>
        <stop offset="1" stop-color="#7C7059"/>
      </linearGradient>
      <linearGradient id="{p}pulpLid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#D8CCB4"/><stop offset="1" stop-color="#A89A80"/>
      </linearGradient>`,
    body: `
      <!-- lid, hinged open and leaning back -->
      <path fill="url(#{p}pulpLid)" d="M56 258 L244 258 L228 152 L72 152 Z"/>
      <path fill="#8E8168" opacity=".45" d="M72 152 L228 152 L226 162 L74 162 Z"/>
      <path fill="none" stroke="#8E8168" stroke-opacity=".5" stroke-width="2.4"
            d="M96 156 L86 256 M150 154 L150 256 M204 156 L214 256"/>
      <path fill="url(#{p}pulp)" d="M42 300 Q40 264 62 258 L236 258 Q260 264 258 300
            L258 370 Q258 392 236 394 L64 394 Q42 392 42 370 Z"/>
      <path fill="#6E634E" opacity=".5" d="M42 292 L258 292 L258 302 L42 302 Z"/>
      <!-- the six cups, which is the only thing that says egg carton -->
      <g>
        <ellipse cx="78" cy="318" rx="28" ry="19" fill="#6E634E"/>
        <ellipse cx="78" cy="315" rx="24" ry="16" fill="#8E8168"/>
        <ellipse cx="150" cy="318" rx="28" ry="19" fill="#6E634E"/>
        <ellipse cx="150" cy="315" rx="24" ry="16" fill="#8E8168"/>
        <ellipse cx="222" cy="318" rx="28" ry="19" fill="#6E634E"/>
        <ellipse cx="222" cy="315" rx="24" ry="16" fill="#8E8168"/>
        <ellipse cx="78" cy="366" rx="28" ry="19" fill="#5E5442"/>
        <ellipse cx="78" cy="363" rx="24" ry="16" fill="#7E7360"/>
        <ellipse cx="150" cy="366" rx="28" ry="19" fill="#5E5442"/>
        <ellipse cx="150" cy="363" rx="24" ry="16" fill="#7E7360"/>
        <ellipse cx="222" cy="366" rx="28" ry="19" fill="#5E5442"/>
        <ellipse cx="222" cy="363" rx="24" ry="16" fill="#7E7360"/>
      </g>
      <path fill="#C6B9A0" opacity=".7" d="M112 300 q6 22 0 44 M186 300 q6 22 0 44"/>
      <path fill="none" stroke="#C6B9A0" stroke-opacity=".6" stroke-width="5"
            d="M114 300 q4 22 0 44 M186 300 q4 22 0 44"/>`,
  },

  banana_peel: {
    scale: 1.42,
    name: "Banana peel",
    material: "organic",
    years: 0.08,
    base: { cx: 150, rx: 90, cy: 384 },
    silhouette: "M64 330 Q52 300 78 296 L150 320 L246 268 Q266 262 268 282 Q270 300 246 308 L160 356 Q108 372 64 330 Z",
    defs: `
      <linearGradient id="{p}peelA" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#8F721C"/><stop offset=".45" stop-color="#E8C93F"/>
        <stop offset="1" stop-color="#F6E27A"/>
      </linearGradient>
      <linearGradient id="{p}peelB" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#7E6316"/><stop offset=".5" stop-color="#D6B733"/>
        <stop offset="1" stop-color="#EDD86C"/>
      </linearGradient>
      <linearGradient id="{p}peelC" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#6E5512"/><stop offset=".5" stop-color="#C2A429"/>
        <stop offset="1" stop-color="#DCC55C"/>
      </linearGradient>
      <linearGradient id="{p}peelIn" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#C9B47E"/><stop offset="1" stop-color="#FBF3CE"/>
      </linearGradient>`,
    body: `
      <g transform="translate(0 46)">
        <!-- Three strips falling to ONE side from a dark stub. Four equal
             strips radiating from a centre is a starfish, which is what the
             first attempt drew. -->
        <path fill="url(#{p}peelA)" d="M94 300 C132 254 196 230 252 226
              C254 240 246 250 232 256 C186 272 138 294 108 320 Z"/>
        <path fill="url(#{p}peelIn)" opacity=".85" d="M98 300 C134 260 194 238 248 234
              C248 242 242 248 230 252 C184 266 138 288 110 314 Z"/>
        <path fill="url(#{p}peelB)" d="M92 316 C138 288 200 276 262 282
              C262 296 252 304 236 306 C186 310 136 324 104 344 Z"/>
        <path fill="url(#{p}peelIn)" opacity=".7" d="M96 316 C140 292 198 282 256 288
              C254 294 248 298 236 299 C188 302 138 316 106 338 Z"/>
        <path fill="url(#{p}peelC)" d="M90 330 C132 322 188 326 236 342
              C232 354 220 358 206 356 C166 350 124 350 96 358 Z"/>
        <ellipse cx="248" cy="240" rx="12" ry="8" fill="#5A4318" opacity=".55" transform="rotate(-20 248 240)"/>
        <ellipse cx="256" cy="292" rx="11" ry="7" fill="#5A4318" opacity=".5"/>
        <ellipse cx="228" cy="348" rx="11" ry="7" fill="#5A4318" opacity=".5"/>
        <path fill="#BE9C28" d="M64 330 Q52 300 78 296 Q100 296 104 318 Q104 344 80 348 Q64 346 64 330 Z"/>
        <path fill="#9C7C21" d="M70 328 Q62 308 80 306 Q94 306 96 320 Q96 338 80 340 Q70 338 70 328 Z"/>
        <path fill="none" stroke="#4E3A0F" stroke-width="7" stroke-linecap="round" d="M68 342 q-14 8 -24 20"/>
        <path fill="none" stroke="#5A4312" stroke-opacity=".3" stroke-width="7" stroke-linecap="round"
              d="M140 296 l24 -12 M172 310 l22 -8 M148 336 l20 -4"/>
      </g>`,
  },

  apple_core: {
    scale: 1.34,
    name: "Apple core",
    material: "organic",
    years: 0.15,
    base: { cx: 150, rx: 54, cy: 392 },
    silhouette: "M114 320 C114 288 130 268 150 268 C172 268 188 288 188 320 C188 356 172 380 150 380 C130 380 114 356 114 320 Z",
    defs: `
      <radialGradient id="{p}apFlesh" cx="41%" cy="57%" r="64%">
        <stop offset="0" stop-color="#F9F2DC"/><stop offset=".52" stop-color="#E2CFA4"/>
        <stop offset="1" stop-color="#AF9564"/>
      </radialGradient>
      <radialGradient id="{p}apSkin" cx="36%" cy="52%" r="70%">
        <stop offset="0" stop-color="#DC4A55"/><stop offset=".52" stop-color="#B02531"/>
        <stop offset="1" stop-color="#6E121B"/>
      </radialGradient>`,
    body: `
      <g transform="translate(0 32) rotate(-8 150 320)">
        <!-- A half-eaten APPLE, not a bare core. A core has no canonical
             silhouette; standing it up makes an eggcup and laying it flat
             makes a cartoon bone. An apple is a circle with a stem, and a
             bite scooped out of that circle reads instantly. -->
        <ellipse cx="152" cy="322" rx="42" ry="44" fill="url(#{p}apFlesh)"/>
        <path fill="url(#{p}apSkin)" d="M150 278 C172 278 188 296 190 316
              C172 310 154 318 156 336 C158 354 176 360 190 350
              C186 366 170 374 150 374 C126 374 108 356 108 322
              C108 296 126 278 150 278 Z"/>
        <path fill="#E8867A" opacity=".75" d="M150 278 C132 278 118 288 112 302
              C120 290 134 283 150 283 Z"/>
        <ellipse cx="130" cy="300" rx="13" ry="8" fill="#FFFFFF" opacity=".3" transform="rotate(-30 130 300)"/>
        <path fill="#FBF3DA" d="M190 316 C172 310 154 318 156 336 C158 354 176 360 190 350
              C200 340 200 328 190 316 Z"/>
        <path fill="#E6D2A0" opacity=".6" d="M190 316 C172 310 154 318 156 336
              C158 354 176 360 190 350 C180 346 166 334 170 322 Z"/>
        <path fill="none" stroke="#A8843F" stroke-width="2.4" stroke-opacity=".6"
              d="M190 316 C172 310 154 318 156 336 C158 354 176 360 190 350"/>
        <path fill="none" stroke="#D5BE8C" stroke-width="1.8" stroke-opacity=".8"
              d="M168 318 q6 6 4 13 M176 314 q6 6 4 13 M164 334 q5 6 4 12"/>
        <ellipse cx="174" cy="330" rx="2.4" ry="4" fill="#5C4718" transform="rotate(18 174 330)"/>
        <ellipse cx="178" cy="342" rx="2.2" ry="3.6" fill="#5C4718" transform="rotate(18 178 342)"/>
        <path fill="none" stroke="#6B5227" stroke-width="5" stroke-linecap="round" d="M149 278 q3 -16 13 -21"/>
        <path fill="#6E9A4A" d="M158 256 q18 -12 27 -2 q-13 11 -27 2 Z"/>
        <path fill="#8FB86A" opacity=".65" d="M160 256 q14 -8 21 -3 q-10 7 -21 3 Z"/>
        <path fill="none" stroke="#4F7634" stroke-width="1.6" d="M160 255 q13 -6 22 -2"/>
      </g>`,
  },

  orange_peel: {
    scale: 1.3,
    name: "Orange peel",
    material: "organic",
    years: 0.5,
    base: { cx: 150, rx: 62, cy: 392 },
    silhouette: "M92 388 Q64 336 96 296 Q136 250 190 272 Q236 292 228 338 Q220 380 176 390 Z",
    defs: `
      <linearGradient id="{p}rindO" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F7A62C"/><stop offset=".4" stop-color="#E4781A"/>
        <stop offset="1" stop-color="#9E480C"/>
      </linearGradient>
      <linearGradient id="{p}rindO2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#EE8E1E"/><stop offset=".5" stop-color="#C85E12"/>
        <stop offset="1" stop-color="#8A3C0A"/>
      </linearGradient>
      <linearGradient id="{p}rindW" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FDF4E0"/><stop offset=".6" stop-color="#EBD9B4"/>
        <stop offset="1" stop-color="#BFA87E"/>
      </linearGradient>`,
    body: `
      <g transform="translate(0 6)">
        <!-- One continuous ribbon coiling up, with DAYLIGHT between the coils.
             Drawn as a filled disc with a spiral scored on it, it reads as a
             cinnamon bun, which is exactly what the first attempt looked like. -->
        <path fill="url(#{p}rindW)" d="M96 386 C62 348 76 292 126 276
              C172 262 214 292 210 336 C206 372 176 388 150 380
              C128 374 120 352 130 334 C138 318 158 316 168 328
              L156 340 C152 334 144 336 142 344 C139 356 148 366 160 364
              C180 360 190 342 186 322 C180 294 148 282 122 296
              C92 312 86 350 106 378 Z"/>
        <path fill="url(#{p}rindO)" d="M96 386 C62 348 76 292 126 276
              C172 262 214 292 210 336 L196 334 C198 300 166 278 130 290
              C90 304 80 350 106 380 Z"/>
        <path fill="url(#{p}rindO2)" d="M210 336 C206 372 176 388 150 380
              C128 374 120 352 130 334 C138 318 158 316 168 328 L158 338
              C150 330 140 336 139 346 C137 358 148 368 161 365
              C182 360 192 342 196 334 Z"/>
        <path fill="#FFD9A0" opacity=".45" d="M100 372 C80 336 94 300 128 290
              C120 302 106 318 104 340 C102 356 100 366 100 372 Z"/>
        <g fill="#A8500E" opacity=".5">
          <circle cx="120" cy="288" r="2.4"/><circle cx="152" cy="278" r="2.2"/>
          <circle cx="186" cy="298" r="2.4"/><circle cx="202" cy="326" r="2.2"/>
          <circle cx="98" cy="318" r="2.4"/><circle cx="92" cy="352" r="2.2"/>
          <circle cx="112" cy="376" r="2"/><circle cx="176" cy="372" r="2.2"/>
        </g>
        <path fill="none" stroke="#7E3A08" stroke-opacity=".45" stroke-width="2"
              d="M96 386 C62 348 76 292 126 276 C172 262 214 292 210 336"/>
      </g>`,
  },

  wooden_chopsticks: {
    scale: 1.34,
    name: "Chopsticks",
    material: "organic",
    years: 2,
    base: { cx: 150, rx: 88, cy: 390 },
    silhouette: "M40 358 L58 312 L244 276 L262 288 L250 320 L64 372 Z",
    defs: `
      <linearGradient id="{p}woodA" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#9A7642"/><stop offset=".4" stop-color="#D8B57C"/>
        <stop offset="1" stop-color="#EFD7A8"/>
      </linearGradient>
      <linearGradient id="{p}woodB" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#8A6836"/><stop offset=".4" stop-color="#C6A268"/>
        <stop offset="1" stop-color="#E2C694"/>
      </linearGradient>`,
    body: `
      <g transform="translate(0 30)">
        <g transform="rotate(-9 150 330)">
          <path fill="url(#{p}woodA)" d="M44 330 L52 316 L248 272 L258 280 L250 292 Z"/>
          <path fill="#7C5E2E" opacity=".45" d="M44 330 L52 316 L248 272 L250 276 L48 324 Z"/>
          <path fill="#FBEDCE" opacity=".5" d="M50 318 L52 316 L248 272 L250 276 Z"/>
          <path fill="#6E5228" d="M248 272 L258 280 L250 292 L244 286 Z"/>
        </g>
        <g transform="rotate(2 150 348)">
          <path fill="url(#{p}woodB)" d="M46 356 L54 342 L250 300 L260 308 L252 320 Z"/>
          <path fill="#6E5228" opacity=".45" d="M46 356 L54 342 L250 300 L252 304 L50 350 Z"/>
          <path fill="#F4E2BE" opacity=".45" d="M52 344 L54 342 L250 300 L252 304 Z"/>
          <path fill="#5E4420" d="M250 300 L260 308 L252 320 L246 314 Z"/>
        </g>
        <path fill="none" stroke="#8A6836" stroke-opacity=".4" stroke-width="1.4"
              d="M90 320 L236 288 M96 346 L240 314"/>
      </g>`,
  },

  /* ------------------------------------------------------------ METAL */
  aluminium_can: {
    name: "Aluminium can",
    material: "aluminium",
    years: 200,
    base: { cx: 150, rx: 62 },
    silhouette: "M104 128 L196 128 L204 166 L204 372 Q204 392 186 396 L114 396 Q96 392 96 372 L96 166 Z",
    defs: `
      <linearGradient id="{p}alu" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#5A626B"/><stop offset=".08" stop-color="#9AA5AE"/>
        <stop offset=".22" stop-color="#E8EDF1"/><stop offset=".36" stop-color="#FBFDFE"/>
        <stop offset=".52" stop-color="#C6CFD7"/><stop offset=".72" stop-color="#8C959E"/>
        <stop offset=".88" stop-color="#B4BDC5"/><stop offset="1" stop-color="#4E555D"/>
      </linearGradient>
      <linearGradient id="{p}aluTop" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6E767E"/><stop offset=".3" stop-color="#D2D9DF"/>
        <stop offset=".62" stop-color="#9AA3AB"/><stop offset="1" stop-color="#5A626B"/>
      </linearGradient>
      <linearGradient id="{p}canBand" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7E1420"/><stop offset=".22" stop-color="#D23144"/>
        <stop offset=".45" stop-color="#F2566A"/><stop offset=".72" stop-color="#A81E2E"/>
        <stop offset="1" stop-color="#5E0E18"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}alu)" d="M104 128 L196 128 L204 166 L204 372
            Q204 392 186 396 L114 396 Q96 392 96 372 L96 166 Z"/>
      <rect x="96" y="206" width="108" height="112" fill="url(#{p}canBand)"/>
      <path fill="#FFFFFF" opacity=".22" d="M96 206 h108 v8 h-108 Z M96 310 h108 v8 h-108 Z"/>
      <ellipse cx="150" cy="262" rx="30" ry="30" fill="#FBEFD0" opacity=".9"/>
      <ellipse cx="150" cy="262" rx="24" ry="24" fill="#B01E2E"/>
      <path fill="#FBEFD0" d="M138 250 h24 v7 h-24 Z M138 268 h24 v7 h-24 Z"/>
      <path fill="none" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="3" d="M112 332 h76 M112 344 h54"/>
      <path fill="#FFFFFF" opacity=".5" d="M118 140 L126 140 L122 394 L114 392 Z"/>
      <path fill="#FFFFFF" opacity=".24" d="M134 136 L139 136 L136 394 L131 394 Z"/>
      <path fill="#39404A" opacity=".45" d="M188 136 L194 140 L192 392 L186 394 Z"/>
      <path fill="#39404A" opacity=".3" d="M96 168 L204 168 L204 176 L96 176 Z"/>
      <path fill="#39404A" opacity=".35" d="M96 366 L204 366 L204 374 L96 374 Z"/>
      <path fill="url(#{p}aluTop)" d="M104 128 L196 128 L196 120 Q150 112 104 120 Z"/>
      <ellipse cx="150" cy="120" rx="46" ry="12" fill="url(#{p}aluTop)"/>
      <ellipse cx="150" cy="120" rx="39" ry="9" fill="#8C959E"/>
      <ellipse cx="150" cy="119" rx="39" ry="9" fill="#C2CAD2"/>
      <ellipse cx="150" cy="120" rx="32" ry="7" fill="#6E767E" opacity=".55"/>
      <path fill="#4E555D" d="M138 116 q12 -7 26 -1 q-4 8 -13 8 q-10 0 -13 -7 Z"/>
      <path fill="#B4BDC5" d="M140 114 q11 -5 22 0 q-3 5 -11 5 q-8 0 -11 -5 Z"/>
      <ellipse cx="151" cy="120" rx="5" ry="3" fill="#39404A"/>
      <path fill="none" stroke="#DDE4EA" stroke-width="2.4" d="M146 117 q6 -5 13 -2"/>`,
  },

  tin_can: {
    name: "Tin can",
    material: "steel",
    years: 50,
    base: { cx: 150, rx: 66 },
    silhouette: "M92 150 L208 150 L208 382 Q208 396 192 398 L108 398 Q92 396 92 382 Z",
    defs: `
      <linearGradient id="{p}steel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#4A525A"/><stop offset=".1" stop-color="#8D97A1"/>
        <stop offset=".26" stop-color="#DCE3E9"/><stop offset=".4" stop-color="#F4F8FA"/>
        <stop offset=".58" stop-color="#B2BCC5"/><stop offset=".78" stop-color="#77818B"/>
        <stop offset="1" stop-color="#424A52"/>
      </linearGradient>
      <linearGradient id="{p}tinLabel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#1D4B2E"/><stop offset=".22" stop-color="#3C8C55"/>
        <stop offset=".46" stop-color="#57B071"/><stop offset=".74" stop-color="#2C6E42"/>
        <stop offset="1" stop-color="#0E3524"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}steel)" d="M92 150 L208 150 L208 382 Q208 396 192 398
            L108 398 Q92 396 92 382 Z"/>
      <rect x="92" y="186" width="116" height="164" fill="url(#{p}tinLabel)"/>
      <path fill="#F0E6C8" opacity=".9" d="M92 194 h116 v6 h-116 Z M92 336 h116 v6 h-116 Z"/>
      <ellipse cx="150" cy="248" rx="34" ry="24" fill="#F2E7C6"/>
      <ellipse cx="150" cy="248" rx="27" ry="18" fill="#D9452F"/>
      <ellipse cx="143" cy="242" rx="9" ry="6" fill="#F07A5E" opacity=".7"/>
      <path fill="none" stroke="#EFE5C4" stroke-width="4" stroke-opacity=".9" d="M112 292 h76 M112 306 h56"/>
      <path fill="#FFFFFF" opacity=".42" d="M112 152 L120 152 L116 396 L108 394 Z"/>
      <path fill="#FFFFFF" opacity=".2" d="M128 152 L133 152 L130 396 L125 396 Z"/>
      <path fill="#2E353C" opacity=".4" d="M194 152 L202 152 L200 394 L192 396 Z"/>
      <path fill="url(#{p}steel)" d="M90 150 L210 150 L210 164 L90 164 Z"/>
      <path fill="#39404A" opacity=".4" d="M90 160 L210 160 L210 166 L90 166 Z"/>
      <ellipse cx="150" cy="150" rx="60" ry="15" fill="url(#{p}steel)"/>
      <ellipse cx="150" cy="150" rx="52" ry="12" fill="#6E767E" opacity=".5"/>
      <ellipse cx="150" cy="149" rx="52" ry="12" fill="#C6CFD7"/>
      <ellipse cx="150" cy="150" rx="44" ry="9" fill="#5E666E" opacity=".45"/>
      <path fill="none" stroke="#EAF0F4" stroke-width="3" stroke-opacity=".8" d="M118 145 q22 -10 50 -3"/>
      <path fill="url(#{p}steel)" d="M92 376 L208 376 L208 384 Q208 396 192 398 L108 398 Q92 396 92 384 Z"/>`,
  },

  cotton_shirt: {
    scale: 1.05,
    name: "Cotton T-shirt",
    material: "organic",
    years: 0.5,
    base: { cx: 150, rx: 92, cy: 394 },
    silhouette: "M56 250 L96 208 Q124 194 150 200 Q176 194 204 208 L244 250 L216 278 L206 268 L208 388 Q150 400 92 388 L94 268 L84 278 Z",
    defs: `
      <linearGradient id="{p}cotton" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#E4E8EC"/><stop offset=".3" stop-color="#C6CED6"/>
        <stop offset=".62" stop-color="#9EA9B4"/><stop offset="1" stop-color="#6E7A86"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}cotton)" d="M56 250 L96 208 Q124 194 150 200 Q176 194 204 208
            L244 250 L216 278 L206 268 L208 388 Q150 400 92 388 L94 268 L84 278 Z"/>
      <path fill="#5E6A76" opacity=".35" d="M204 208 L244 250 L216 278 L206 268 L208 388
            Q182 394 158 396 L162 262 L186 232 Z"/>
      <path fill="#F2F5F8" opacity=".45" d="M96 208 L120 230 L104 262 L94 268 L84 278
            L56 250 Z"/>
      <path fill="none" stroke="#7E8A96" stroke-width="3" stroke-opacity=".7"
            d="M120 206 Q150 224 180 206"/>
      <path fill="none" stroke="#E8EDF2" stroke-width="2" stroke-opacity=".8"
            d="M121 211 Q150 228 179 211"/>
      <!-- crumple, which is what says a shirt on the ground and not a template -->
      <path fill="none" stroke="#7E8A96" stroke-opacity=".4" stroke-width="3"
            d="M108 296 Q134 312 108 334 M196 300 Q170 316 196 340
               M120 356 Q150 344 182 358 M126 268 Q150 282 176 268"/>
      <path fill="#6E7A86" opacity=".28" d="M92 366 Q150 384 208 366 L208 388
            Q150 400 92 388 Z"/>
      <ellipse cx="150" cy="306" rx="34" ry="24" fill="#3E5A78" opacity=".45"/>
      <path fill="#DCE4EA" opacity=".7" d="M134 296 h32 v7 h-32 Z M134 310 h32 v7 h-32 Z"/>`,
  },

  wool_sock: {
    scale: 1.22,
    name: "Wool sock",
    material: "organic",
    years: 1.5,
    base: { cx: 150, rx: 78, cy: 392 },
    silhouette: "M108 214 L176 214 Q186 288 180 330 L238 342 Q262 350 258 372 Q252 392 226 390 L120 384 Q98 378 98 350 Q96 282 108 214 Z",
    defs: `
      <linearGradient id="{p}wool" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#D8C2A2"/><stop offset=".34" stop-color="#B99D78"/>
        <stop offset=".7" stop-color="#8E7452"/><stop offset="1" stop-color="#63503A"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}wool)" d="M108 214 L176 214 Q186 288 180 330 L238 342
            Q262 350 258 372 Q252 392 226 390 L120 384 Q98 378 98 350 Q96 282 108 214 Z"/>
      <path fill="#5A4832" opacity=".38" d="M176 214 Q186 288 180 330 L238 342
            Q262 350 258 372 Q252 392 226 390 L196 389 Q228 380 226 366
            Q224 352 194 348 Q160 342 162 322 Q170 276 160 214 Z"/>
      <path fill="#EBDAC0" opacity=".45" d="M108 214 L128 214 Q116 290 118 348
            Q120 372 142 378 L122 384 Q98 378 98 350 Q96 282 108 214 Z"/>
      <!-- the ribbed cuff, which is what makes it a sock and not a mitten -->
      <path fill="#C6AC88" d="M106 210 L178 210 L176 244 L108 244 Z"/>
      <path fill="none" stroke="#8E7452" stroke-width="3" stroke-opacity=".8"
            d="M116 212 L115 242 M128 212 L127 242 M140 212 L140 242
               M152 212 L153 242 M164 212 L165 242"/>
      <path fill="#7C6446" opacity=".45" d="M106 236 L177 236 L176 244 L108 244 Z"/>
      <!-- heel and toe patches -->
      <path fill="#7C6446" opacity=".5" d="M98 342 Q118 330 134 344 Q126 372 104 372
            Q96 358 98 342 Z"/>
      <path fill="#E2CFAE" opacity=".5" d="M226 350 Q250 352 252 368 Q244 380 224 378
            Q214 364 226 350 Z"/>
      <path fill="none" stroke="#8E7452" stroke-opacity=".45" stroke-width="2.4"
            d="M124 264 Q150 276 172 266 M118 300 Q146 312 176 302"/>`,
  },

  disposable_nappy: {
    scale: 1.06,
    name: "Disposable nappy",
    material: "plastic",
    years: 450,
    base: { cx: 150, rx: 90, cy: 392 },
    silhouette: "M62 212 Q56 200 74 196 L226 196 Q244 200 238 212 Q220 268 216 300 Q214 356 190 382 Q150 396 110 382 Q86 356 84 300 Q80 268 62 212 Z",
    defs: `
      <linearGradient id="{p}nappy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FCFDFE"/><stop offset=".42" stop-color="#EDF1F4"/>
        <stop offset=".78" stop-color="#D4DBE1"/><stop offset="1" stop-color="#AEB8C0"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}nappy)" d="M62 212 Q56 200 74 196 L226 196 Q244 200 238 212
            Q220 268 216 300 Q214 356 190 382 Q150 396 110 382 Q86 356 84 300
            Q80 268 62 212 Z"/>
      <path fill="#9FAAB4" opacity=".3" d="M226 196 Q244 200 238 212 Q220 268 216 300
            Q214 356 190 382 Q172 388 154 390 Q184 362 188 300 Q192 262 210 196 Z"/>
      <!-- the tapes, which are the only reason this is not a cushion -->
      <path fill="#D8E2EA" d="M56 202 L92 200 L92 234 L56 236 Q48 218 56 202 Z"/>
      <path fill="#B9C6D0" d="M56 214 L92 212 L92 220 L56 222 Z"/>
      <path fill="#D8E2EA" d="M244 202 L208 200 L208 234 L244 236 Q252 218 244 202 Z"/>
      <path fill="#B9C6D0" d="M244 214 L208 212 L208 220 L244 222 Z"/>
      <!-- elasticated legs, gathered -->
      <path fill="none" stroke="#B9C6D0" stroke-width="4" stroke-opacity=".9"
            d="M86 246 Q94 310 112 372 M214 246 Q206 310 188 372"/>
      <path fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity=".8"
            d="M89 248 Q97 310 114 370 M211 248 Q203 310 186 370"/>
      <path fill="#E4EAEF" d="M104 252 Q150 240 196 252 Q198 314 190 358
            Q150 372 110 358 Q102 314 104 252 Z"/>
      <path fill="none" stroke="#C6D2DA" stroke-width="2.4" stroke-opacity=".8"
            d="M114 274 Q150 266 186 274 M112 300 Q150 292 188 300 M114 326 Q150 318 186 326"/>
      <ellipse cx="150" cy="222" rx="30" ry="9" fill="#8FBFE0" opacity=".65"/>
      <path fill="#5E9ECC" opacity=".7" d="M136 218 h28 v4 h-28 Z"/>`,
  },

  battery: {
    scale: 1.18,
    name: "AA battery",
    material: "steel",
    years: 100,
    base: { cx: 150, rx: 44 },
    silhouette: "M118 128 L182 128 L182 386 Q182 396 168 396 L132 396 Q118 396 118 386 Z",
    defs: `
      <linearGradient id="{p}cell" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#15181C"/><stop offset=".14" stop-color="#31363C"/>
        <stop offset=".34" stop-color="#4E555D"/><stop offset=".54" stop-color="#2A2F35"/>
        <stop offset=".82" stop-color="#1A1E22"/><stop offset="1" stop-color="#0C0E11"/>
      </linearGradient>
      <linearGradient id="{p}copper" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6E3F14"/><stop offset=".18" stop-color="#C98A45"/>
        <stop offset=".42" stop-color="#EBB877"/><stop offset=".7" stop-color="#A86A2C"/>
        <stop offset="1" stop-color="#5E3410"/>
      </linearGradient>
      <linearGradient id="{p}gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8A6A16"/><stop offset=".2" stop-color="#D8B23A"/>
        <stop offset=".46" stop-color="#F2D86A"/><stop offset=".74" stop-color="#B4901E"/>
        <stop offset="1" stop-color="#6E5410"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}cell)" d="M118 128 L182 128 L182 386 Q182 396 168 396
            L132 396 Q118 396 118 386 Z"/>
      <rect x="118" y="196" width="64" height="118" fill="url(#{p}gold)"/>
      <path fill="#2A2210" opacity=".35" d="M118 196 h64 v6 h-64 Z M118 308 h64 v6 h-64 Z"/>
      <path fill="#1A1E22" d="M128 222 h44 v9 h-44 Z M128 240 h44 v9 h-44 Z"/>
      <ellipse cx="150" cy="272" rx="17" ry="17" fill="#15181C"/>
      <path fill="url(#{p}gold)" d="M142 262 h16 v8 h-16 Z M142 274 h16 v8 h-16 Z"/>
      <path fill="#E4EAEF" opacity=".3" d="M128 132 L136 132 L134 392 L127 390 Z"/>
      <path fill="#000000" opacity=".4" d="M170 132 L178 132 L178 390 L170 392 Z"/>
      <!-- the copper cap: nothing else in a bin is a dark cylinder with a
           bright metal top, and that is the whole recognition -->
      <path fill="url(#{p}copper)" d="M118 128 L182 128 L182 116 L118 116 Z"/>
      <ellipse cx="150" cy="116" rx="32" ry="9" fill="url(#{p}copper)"/>
      <ellipse cx="150" cy="114" rx="32" ry="9" fill="#C98A45"/>
      <rect x="138" y="96" width="24" height="22" rx="4" fill="url(#{p}copper)"/>
      <ellipse cx="150" cy="96" rx="12" ry="4.5" fill="#EBB877"/>
      <ellipse cx="150" cy="97" rx="8" ry="3" fill="#8A5A22"/>
      <path fill="#9AA2AC" d="M118 386 Q118 396 132 396 L168 396 Q182 396 182 386 Z"/>
      <ellipse cx="150" cy="392" rx="32" ry="8" fill="#B4BDC5"/>
      <ellipse cx="150" cy="392" rx="22" ry="5" fill="#7E868E"/>`,
  },

  aluminium_foil: {
    scale: 1.2,
    name: "Aluminium foil",
    material: "aluminium",
    years: 400,
    base: { cx: 150, rx: 76, cy: 392 },
    silhouette: "M74 344 L92 288 L128 254 L186 246 L226 278 L234 336 L206 380 L120 384 Z",
    defs: `
      <linearGradient id="{p}foilA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FDFEFE"/><stop offset="1" stop-color="#9BA5AE"/>
      </linearGradient>
      <linearGradient id="{p}foilB" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E4E9EE"/><stop offset="1" stop-color="#6A737C"/>
      </linearGradient>`,
    body: `
      <g transform="translate(0 8)">
        <!-- Crumpled foil is FACETS. A smooth gradient cannot do it — it needs
             hard edges, near-white against near-black with no transition, which
             the Park had to learn the hard way on its own piece of foil. -->
        <path fill="#8E98A2" d="M74 344 L92 288 L128 254 L186 246 L226 278 L234 336 L206 380 L120 384 Z"/>
        <path fill="url(#{p}foilA)" d="M92 288 L128 254 L150 296 L112 318 Z"/>
        <path fill="#5E666E" d="M74 344 L92 288 L112 318 L104 354 Z"/>
        <path fill="url(#{p}foilB)" d="M128 254 L186 246 L178 292 L150 296 Z"/>
        <path fill="#B4BDC5" d="M186 246 L226 278 L206 306 L178 292 Z"/>
        <path fill="#3E464E" d="M226 278 L234 336 L208 340 L206 306 Z"/>
        <path fill="#D2DAE0" d="M150 296 L178 292 L186 330 L152 338 Z"/>
        <path fill="#6E767E" d="M112 318 L150 296 L152 338 L118 352 Z"/>
        <path fill="#FAFCFD" d="M178 292 L206 306 L208 340 L186 330 Z"/>
        <path fill="#454D55" d="M104 354 L118 352 L126 380 L120 384 Z"/>
        <path fill="#A8B2BA" d="M118 352 L152 338 L166 372 L126 380 Z"/>
        <path fill="#EEF2F5" d="M152 338 L186 330 L196 362 L166 372 Z"/>
        <path fill="#5E666E" d="M186 330 L208 340 L206 380 L196 362 Z"/>
        <path fill="#FFFFFF" opacity=".85" d="M128 254 L150 296 L146 298 L124 258 Z"/>
        <path fill="#FFFFFF" opacity=".7" d="M178 292 L186 330 L182 331 L174 293 Z"/>
        <path fill="#2E353C" opacity=".8" d="M112 318 L118 352 L114 353 L108 320 Z"/>
        <path fill="#2E353C" opacity=".65" d="M186 330 L196 362 L192 363 L182 332 Z"/>
      </g>`,
  },

  glass_jar: {
    name: "Glass jar",
    material: "glass",
    years: 1e9,
    base: { cx: 150, rx: 66 },
    silhouette: "M104 128 L196 128 L196 158 C204 172 212 186 212 208 L212 378 Q212 396 194 398 L106 398 Q88 396 88 378 L88 208 C88 186 96 172 104 158 Z",
    caustic: { cx: 194, rx: 56, ry: 11 },
    defs: `
      <linearGradient id="{p}jarX" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#2A3A36"/><stop offset=".09" stop-color="#4E6E62"/>
        <stop offset=".24" stop-color="#8FB9A8"/><stop offset=".4" stop-color="#C2E2D4"/>
        <stop offset=".58" stop-color="#8CB5A4"/><stop offset=".8" stop-color="#4A6A5E"/>
        <stop offset="1" stop-color="#22322E"/>
      </linearGradient>
      <linearGradient id="{p}jarY" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EAF6F0" stop-opacity=".35"/>
        <stop offset=".2" stop-color="#C2E2D4" stop-opacity=".12"/>
        <stop offset=".6" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#0A1412" stop-opacity=".55"/>
      </linearGradient>
      <linearGradient id="{p}jarSpec" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
        <stop offset=".08" stop-color="#FFFFFF" stop-opacity=".95"/>
        <stop offset=".7" stop-color="#E8F6F0" stop-opacity=".5"/>
        <stop offset="1" stop-color="#E8F6F0" stop-opacity="0"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}jarX)" d="M104 128 L196 128 L196 158 C204 172 212 186 212 208
            L212 378 Q212 396 194 398 L106 398 Q88 396 88 378 L88 208
            C88 186 96 172 104 158 Z"/>
      <path fill="url(#{p}jarY)" d="M104 128 L196 128 L196 158 C204 172 212 186 212 208
            L212 378 Q212 396 194 398 L106 398 Q88 396 88 378 L88 208
            C88 186 96 172 104 158 Z"/>
      <!-- the screw thread on the neck, which is what makes it a jar -->
      <path fill="none" stroke="#1E2E2A" stroke-width="4" stroke-opacity=".5"
            d="M104 136 Q150 146 196 136 M104 148 Q150 158 196 148"/>
      <path fill="none" stroke="#DDF0E8" stroke-width="2" stroke-opacity=".5"
            d="M104 133 Q150 143 196 133 M104 145 Q150 155 196 145"/>
      <path fill="#7EA898" d="M100 122 L200 122 L200 130 L100 130 Z"/>
      <path fill="#CFEADF" d="M100 122 L200 122 L200 126 L100 126 Z"/>
      <ellipse cx="150" cy="122" rx="50" ry="10" fill="#A8CCBE" opacity=".6"/>
      <ellipse cx="150" cy="122" rx="41" ry="7" fill="#16211E" opacity=".85"/>
      <path fill="url(#{p}jarSpec)" d="M106 200 C108 184 114 172 120 162 L128 168
            C121 178 116 190 115 202 L115 372 L106 372 Z"/>
      <rect x="106" y="212" width="9" height="160" rx="4.5" fill="url(#{p}jarSpec)"/>
      <rect x="192" y="220" width="4" height="146" rx="2" fill="#E8F6F0" opacity=".2"/>
      <path fill="#14201D" opacity=".5" d="M88 208 C88 186 96 172 104 158 L110 162
            C102 176 94 188 94 210 L94 380 L88 378 Z"/>
      <path fill="#14201D" opacity=".7" d="M212 208 C212 186 204 172 196 158 L190 162
            C198 176 206 188 206 210 L206 380 L212 378 Z"/>
      <path fill="#14201D" opacity=".7" d="M88 366 Q150 384 212 366 L212 378
            Q212 396 194 398 L106 398 Q88 396 88 378 Z"/>
      <ellipse cx="150" cy="384" rx="44" ry="8" fill="#8FC2AE" opacity=".35"/>
      <ellipse cx="150" cy="388" rx="24" ry="4" fill="#DDF0E8" opacity=".3"/>
      <ellipse cx="176" cy="264" rx="2.6" ry="4" fill="#E8F6F0" opacity=".35"/>
      <ellipse cx="124" cy="318" rx="2" ry="3" fill="#E8F6F0" opacity=".28"/>`,
  },

  /* ------------------------------------------------------------ GLASS */
  glass_bottle: {
    name: "Glass bottle",
    material: "glass",
    years: 1e9,
    base: { cx: 150, rx: 63 },
    silhouette: "M130 78 L170 78 L170 130 C170 144 176 152 185 161 C202 177 214 190 215 214 L215 384 Q215 399 200 400 L100 400 Q85 399 85 384 L86 214 C87 190 98 177 115 161 C124 152 130 144 130 130 Z",
    defs: `
      <linearGradient id="{p}glassX" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#0A2612"/><stop offset=".08" stop-color="#1B4A26"/>
        <stop offset=".22" stop-color="#3E8447"/><stop offset=".38" stop-color="#57A75C"/>
        <stop offset=".54" stop-color="#3B7E43"/><stop offset=".76" stop-color="#21582C"/>
        <stop offset=".92" stop-color="#112F19"/><stop offset="1" stop-color="#071C0E"/>
      </linearGradient>
      <linearGradient id="{p}glassY" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9BD49A" stop-opacity=".30"/>
        <stop offset=".16" stop-color="#6FB574" stop-opacity=".12"/>
        <stop offset=".55" stop-color="#000000" stop-opacity="0"/>
        <stop offset=".88" stop-color="#031007" stop-opacity=".45"/>
        <stop offset="1" stop-color="#031007" stop-opacity=".7"/>
      </linearGradient>
      <linearGradient id="{p}spec" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EAFBE4" stop-opacity="0"/>
        <stop offset=".07" stop-color="#F2FFEE" stop-opacity=".92"/>
        <stop offset=".62" stop-color="#CFEDC8" stop-opacity=".52"/>
        <stop offset=".93" stop-color="#CFEDC8" stop-opacity=".10"/>
        <stop offset="1" stop-color="#CFEDC8" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="{p}specNeck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F2FFEE" stop-opacity=".85"/>
        <stop offset="1" stop-color="#F2FFEE" stop-opacity=".25"/>
      </linearGradient>`,
    caustic: { cx: 196, rx: 58, ry: 11 },
    body: `
      <path fill="url(#{p}glassX)" d="M130 78 L170 78 L170 130 C170 144 176 152 185 161
            C202 177 214 190 215 214 L215 384 Q215 399 200 400 L100 400 Q85 399 85 384
            L86 214 C87 190 98 177 115 161 C124 152 130 144 130 130 Z"/>
      <path fill="url(#{p}glassY)" d="M130 78 L170 78 L170 130 C170 144 176 152 185 161
            C202 177 214 190 215 214 L215 384 Q215 399 200 400 L100 400 Q85 399 85 384
            L86 214 C87 190 98 177 115 161 C124 152 130 144 130 130 Z"/>
      <path fill="#2E6A38" d="M126 58 L174 58 Q178 58 178 62 L178 74 Q178 78 174 78
            L126 78 Q122 78 122 74 L122 62 Q122 58 126 58 Z"/>
      <path fill="#6FB974" d="M126 58 L174 58 Q178 58 178 61 L178 65 L122 65 L122 61 Q122 58 126 58 Z"/>
      <path fill="#0C2B15" opacity=".8" d="M122 74 L178 74 L178 78 Q178 80 174 80 L126 80 Q122 80 122 78 Z"/>
      <ellipse cx="150" cy="59" rx="26" ry="5" fill="#8FCC8E" opacity=".55"/>
      <ellipse cx="150" cy="59" rx="19" ry="3" fill="#0A2411" opacity=".85"/>
      <path fill="url(#{p}spec)" d="M108 186 C112 172 120 164 126 158 L133 166
            C127 172 120 180 117 192 L117 372 L108 372 Z"/>
      <rect x="108" y="200" width="9" height="172" rx="4.5" fill="url(#{p}spec)"/>
      <rect x="134" y="84" width="7" height="44" rx="3.5" fill="url(#{p}specNeck)"/>
      <rect x="196" y="216" width="4" height="150" rx="2" fill="#CFEDC8" opacity=".16"/>
      <path fill="#061A0C" opacity=".55" d="M86 214 C87 190 98 177 115 161 L119 166
            C104 181 93 193 92 215 L92 386 L86 384 Z"/>
      <path fill="#061A0C" opacity=".75" d="M215 214 C214 190 202 177 185 161 L181 166
            C196 181 208 193 209 215 L209 386 L215 384 Z"/>
      <path fill="#061A0C" opacity=".75" d="M86 368 Q150 386 215 368 L215 384
            Q215 399 200 400 L100 400 Q85 399 85 384 Z"/>
      <ellipse cx="150" cy="386" rx="42" ry="8" fill="#5FA95E" opacity=".38"/>
      <ellipse cx="150" cy="390" rx="22" ry="4" fill="#A8DDA0" opacity=".30"/>
      <ellipse cx="172" cy="252" rx="2.6" ry="4" fill="#CFEDC8" opacity=".35"/>
      <ellipse cx="128" cy="310" rx="2" ry="3" fill="#CFEDC8" opacity=".28"/>`,
  },
};
