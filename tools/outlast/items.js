/* ====================================================================== *
 *  Outlast — the item library.
 *
 *  Every object is drawn in a 300 x 420 box with its base on y = 400 and
 *  its centre on x = 150. Objects are NOT to scale with each other, on
 *  purpose: this mode is about time, not size, and a cigarette butt drawn
 *  to scale beside a wine bottle would be a speck.
 *
 *  Each entry declares:
 *    material   which decay behaviour runs on it — see decay.js
 *    years      how long it lasts. PLACEHOLDERS: published figures vary a
 *               lot by source and by conditions, and the real thing has to
 *               cite one set and state the conditions on screen.
 *    defs       gradients this item alone needs
 *    body       the drawing
 *    silhouette one path, the outer outline, which the decay overlays
 *               (rot, yellowing, rust) paint inside so they never spill
 *    base       {cx, rx} for the contact shadow
 *
 *  Drawing rules learned the hard way, in order of how much they cost:
 *    - profile over plan: the silhouette is what names an object
 *    - a cylinder is the one shape a bottle never has
 *    - rigid manufactured things with clean material boundaries work;
 *      soft wet organic things need a canonical silhouette or a host
 *    - flat solid fills read as paper cutouts; volume comes from gradients
 * ====================================================================== */

export const ITEMS = {

  /* ------------------------------------------------------------ PAPER */
  paper_bag: {
    name: "Paper bag",
    material: "paper",
    years: 0.083,
    base: { cx: 150, rx: 88 },
    silhouette: "M56 130 L242 136 L240 396 Q166 406 60 396 L58 143 Z",
    defs: `
      <linearGradient id="{p}kraftFront" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8A6231"/><stop offset=".16" stop-color="#C89B5E"/>
        <stop offset=".46" stop-color="#DDB379"/><stop offset=".78" stop-color="#B98C52"/>
        <stop offset="1" stop-color="#8A6231"/>
      </linearGradient>
      <linearGradient id="{p}kraftSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#5E4020"/><stop offset=".55" stop-color="#8A6434"/>
        <stop offset="1" stop-color="#6E4E27"/>
      </linearGradient>
      <linearGradient id="{p}kraftRim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#A87C46"/><stop offset=".32" stop-color="#EDC894"/>
        <stop offset=".72" stop-color="#D0A469"/><stop offset="1" stop-color="#9A7040"/>
      </linearGradient>
      <linearGradient id="{p}bagMouth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1E1509"/><stop offset=".65" stop-color="#3A2A14"/>
        <stop offset="1" stop-color="#5A4322"/>
      </linearGradient>`,
    body: `
      <path fill="url(#{p}bagMouth)" d="M62 100 L244 106 L240 142 L84 134 Z"/>
      <path fill="#100B04" opacity=".8" d="M76 108 L238 114 L235 134 L90 127 Z"/>
      <path fill="url(#{p}kraftRim)" d="M60 90 L246 96 L244 108 L62 102 Z"/>
      <path fill="#EFCE9C" opacity=".55" d="M60 90 L246 96 L246 99 L60 93 Z"/>
      <path fill="url(#{p}kraftSide)" d="M58 136 L60 396 Q74 403 88 399 L88 142 Z"/>
      <path fill="url(#{p}kraftFront)" d="M88 142 L238 148 Q244 272 240 396 Q166 406 88 399 Z"/>
      <path fill="url(#{p}kraftRim)" d="M56 130 L242 136 L241 154 L88 147 L58 143 Z"/>
      <path fill="#7E5A2E" opacity=".45" d="M56 130 L88 136 L88 147 L58 143 Z"/>
      <path fill="#F0D0A0" opacity=".45" d="M56 130 L242 136 L242 140 L56 134 Z"/>
      <path fill="none" stroke="#5E4020" stroke-width="10" stroke-linecap="round" d="M88 134 C92 56 148 50 152 132"/>
      <path fill="none" stroke="#C99A5C" stroke-width="6" stroke-linecap="round" d="M88 134 C92 56 148 50 152 132"/>
      <path fill="none" stroke="#E8C48C" stroke-width="2" stroke-opacity=".7" d="M91 118 C95 62 144 57 149 116"/>
      <path fill="none" stroke="#6E4E27" stroke-width="2" stroke-opacity=".75" d="M99 84 l9 -6 M118 63 l9 -3 M140 76 l8 -8"/>
      <path fill="none" stroke="#5E4020" stroke-width="10" stroke-linecap="round" d="M178 138 C182 60 238 56 242 140"/>
      <path fill="none" stroke="#BC8F52" stroke-width="6" stroke-linecap="round" d="M178 138 C182 60 238 56 242 140"/>
      <path fill="none" stroke="#DDB87E" stroke-width="2" stroke-opacity=".6" d="M181 122 C185 66 234 62 239 124"/>
      <path fill="none" stroke="#6E4E27" stroke-width="2" stroke-opacity=".75" d="M189 88 l9 -6 M208 68 l9 -3 M230 81 l8 -8"/>
      <path fill="none" stroke="#7A5729" stroke-opacity=".5" stroke-width="2.4" d="M88 146 L88 399 M59 140 L60 396"/>
      <path fill="none" stroke="#B98C55" stroke-opacity=".35" stroke-width="2" d="M124 149 L122 401 M190 152 L192 403"/>
      <path fill="none" stroke="#8A6534" stroke-opacity=".3" stroke-width="1.6" d="M96 246 Q166 240 236 246 M96 308 Q166 304 238 310"/>
      <path fill="#8A6231" opacity=".4" d="M88 374 Q164 382 240 374 L240 396 Q166 406 88 399 Z"/>`,
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
