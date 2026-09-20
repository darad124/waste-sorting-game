import React from "react";

/** The five pieces of litter for the School case, drawn to the same
 *  standard as the scene: tall windows out of frame to the RIGHT, so the
 *  hot edge of everything is on its right and its shadow runs left, and
 *  anything lying flat is squashed by that plane's own foreshortening.
 *
 *  The milk jug's handle is a real HOLE — a second subpath with fill-rule
 *  evenodd — so the table shows through it, which is most of what makes
 *  one of these look like a milk jug rather than a bottle.
 *
 *  The gradients and filters they reference are defined in SchoolScene's
 *  defs, which is in the same document whenever these are on screen.
 */

export const SCHOOL_CLUE_ART: Record<string, React.ReactNode> = {
  s1: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-112.5 -143.6 225.1 287.2" aria-hidden>
      <g transform="translate(-112.6,-756.4)">
  <g id="lit-s1" transform="translate(168,828) scale(0.6114)">
    <ellipse cx="-282" cy="102" rx="374.2" ry="69.3" fill="url(#shadow)" opacity="1" transform="rotate(160.1 -282 102)"/>
    {/* the shadow a translucent thing casts: light comes through the milk
         and warms the middle of it */}
    <ellipse cx="-190" cy="26" rx="150" ry="52" fill="#FFE8B4" opacity=".3"
             transform="rotate(-20 -190 26)"/>
    <g transform="scale(1,0.545)"><ellipse cx="0" cy="0" rx="92" ry="80" fill="url(#occl)"/></g>

    {/* what is left in the bottom of it, drawn BE0.545 the body so it reads
         through the plastic instead of on top of it */}
    <path d="M-70 -6 q70 13 140 0 l0 -84 q-70 15 -140 0 Z" fill="#FFFFFF"/>
    <path d="M-70 -90 q70 15 140 0 l0 12 q-70 15 -140 0 Z" fill="#F2F8F6"/>
    <path d="M-70 -90 q70 15 140 0" fill="none" stroke="#DCE8E4" strokeWidth="4"/>
    <path d="M-62 -80 q34 8 68 5" fill="none" stroke="#FFFFFF" strokeWidth="6"/>
    <path d="M40 -84 q22 -2 30 -6 l0 78 q-14 5 -30 7 Z" fill="#E4EEEC" opacity=".7"/>

    {/* the body, with the handle punched through it */}
    <path fillRule="evenodd" opacity=".9" fill="url(#hdpe)"
          d="M-72 0 Q-80 0 -80 -14 L-80 -196 Q-80 -206 -74 -214 L-50 -256
             Q-44 -264 -44 -274 L-44 -300 L44 -300 L44 -274 Q44 -264 50 -256
             L74 -214 Q80 -206 80 -196 L80 -14 Q80 0 72 0 Z
             M34 -206 Q34 -222 48 -222 L54 -222 Q68 -222 68 -206 L68 -130
             Q68 -114 54 -114 L48 -114 Q34 -114 34 -130 Z"/>
    {/* the far wall of the jug, seen through the near one */}
    <path d="M-58 -14 L-58 -192 Q-58 -200 -54 -206 L-34 -244 L34 -244
             L54 -206 Q58 -200 58 -192 L58 -14 Z" fill="#B8C8C6" opacity=".2"/>
    {/* the two corners the window finds, which is where the shape reads */}
    <path d="M-80 -14 L-80 -196 Q-80 -206 -74 -214 L-50 -256" fill="none"
          stroke="#FFFFFF" strokeOpacity=".75" strokeWidth="9"/>
    <path d="M80 -14 L80 -196 Q80 -206 74 -214 L50 -256" fill="none"
          stroke="#FFFBEC" strokeWidth="13"/>
    <path d="M78 -20 L78 -194" fill="none" stroke="#FFFFFF" strokeWidth="5"/>
    <path d="M68 -206 Q68 -222 54 -222" fill="none"
          stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="6"/>
    <path d="M-80 -30 L-80 -196" fill="none" stroke="#7E9290" strokeOpacity=".3" strokeWidth="4"/>
    {/* the ribs round the bottom, which is where the plastic is stiffened */}
    <g stroke="#9EB2B0" strokeOpacity=".38" strokeWidth="4" fill="none">
      <path d="M-76 -24 q76 12 152 0 M-77 -44 q77 12 154 0 M-78 -64 q78 12 156 0"/>
    </g>
    <g stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="2.4" fill="none">
      <path d="M-76 -28 q76 12 152 0 M-77 -48 q77 12 154 0"/>
    </g>
    {/* the recessed panel, and the date stamped into it */}
    <path d="M-58 -178 h84 v54 h-84 Z" fill="#DCE8E6" opacity=".45"/>
    <path d="M-58 -178 h84 v54 h-84 Z" fill="none" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="2.4"/>
    <path d="M-48 -160 h60 M-48 -146 h44" stroke="#8EA2A0" strokeOpacity=".6" strokeWidth="5" strokeLinecap="round"/>
    {/* the label */}
    <path d="M-78 -120 h124 v-3 q0 0 0 0 h-124 Z" fill="none"/>
    <path d="M-76 -112 q76 12 150 0 l0 44 q-74 12 -150 0 Z" fill="#F8FCFA" opacity=".95"/>
    <path d="M-76 -112 q76 12 150 0 l0 13 q-74 12 -150 0 Z" fill="#2E86C4"/>
    <path d="M-64 -86 q56 8 110 0 M-64 -74 q42 6 82 2" stroke="#6E8E9E" strokeWidth="5"
          strokeLinecap="round" fill="none"/>
    {/* neck, tamper ring and a ribbed cap */}
    <path d="M-44 -300 h88 v-18 h-88 Z" fill="#EEF4F2" opacity=".92"/>
    <path d="M-44 -318 h88 v-8 h-88 Z" fill="#C6D4D2" opacity=".9"/>
    <path d="M-50 -326 h100 v34 q0 6 -8 6 h-84 q-8 0 -8 -6 Z" fill="#2E86C4"
          transform="translate(0,-26)"/>
    <path d="M-50 -352 h24 v40 h-16 q-8 0 -8 -6 Z" fill="#7EC0EE" opacity=".85"/>
    <path d="M-50 -352 h100 v6 h-100 Z" fill="#A6DCFA" opacity=".85"/>
    <path d="M26 -352 h24 v34 q0 6 -8 6 h-16 Z" fill="#1E5E92" opacity=".55"/>
    <g stroke="#1E5E92" strokeOpacity=".45" strokeWidth="2.6">
      <path d="M-38 -350 v32M-24 -350 v32M-10 -350 v32M4 -350 v32M18 -350 v32M32 -350 v32"/>
    </g>
  </g>
      </g>
    </svg>
  ),
  s2: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-124.2 -37.6 248.4 75.3" aria-hidden>
      <g transform="translate(-660.1,-723.8)">
  <g id="lit-s2" transform="translate(700,716) scale(0.5147,0.236) rotate(-5)">
    <ellipse cx="-80" cy="26" rx="230" ry="140" fill="url(#shadow)" opacity=".85"/>
    <path d="M-128 -92 h256 q14 0 14 14 v156 q0 14 -14 14 h-256 q-14 0 -14 -14
             v-156 q0 -14 14 -14 Z" fill="#2A3038"/>
    <path d="M-128 -92 h256 q14 0 14 14 v6 h-284 v-6 q0 -14 14 -14 Z" fill="#59626C"/>
    <path d="M-114 -78 h228 v164 h-228 Z" fill="#12161C"/>
    <g id="sc-screenLive">
      <path d="M-114 -78 h228 v164 h-228 Z" fill="#1E4A7E"/>
      <g fill="#4A7EBE" opacity=".85">
        <rect x="-96" y="-58" width="44" height="44" rx="9"/><rect x="-42" y="-58" width="44" height="44" rx="9"/>
        <rect x="12" y="-58" width="44" height="44" rx="9"/><rect x="66" y="-58" width="44" height="44" rx="9"/>
        <rect x="-96" y="-4" width="44" height="44" rx="9"/><rect x="-42" y="-4" width="44" height="44" rx="9"/>
        <rect x="12" y="-4" width="44" height="44" rx="9"/>
      </g>
    </g>
    {/* the crack. It starts at ONE impact point and radiates from it, with
         concentric rings crossing the radials — glass that is cracked all
         over evenly has not been dropped, it has been scribbled on. */}
    <g stroke="#E4EEF6" fill="none" strokeOpacity=".85">
      <path d="M-52 -18 L-114 -66 M-52 -18 L-70 -78 M-52 -18 L-8 -78 M-52 -18 L52 -60
               M-52 -18 L114 -6 M-52 -18 L86 60 M-52 -18 L18 86 M-52 -18 L-50 86
               M-52 -18 L-114 42 M-52 -18 L-114 -14" strokeWidth="2.2"/>
      <path d="M-76 -44 L-62 -52 L-40 -50 L-22 -40 L-18 -22 L-24 -2 L-40 8 L-64 4
               L-78 -12 L-80 -32 Z" strokeWidth="1.8" strokeOpacity=".7"/>
      <path d="M-104 -62 L-70 -70 L-26 -62 L14 -42 L24 -18 L16 14 L-14 40 L-56 44
               L-90 28 L-104 -6 Z" strokeWidth="1.6" strokeOpacity=".5"/>
    </g>
    <circle cx="-52" cy="-18" r="7" fill="#D8E4EE" opacity=".8"/>
    <circle cx="-52" cy="-18" r="16" fill="#9EB4C6" opacity=".25"/>
    {/* the glare the window puts on it, which is why the crack shows */}
    <path d="M28 -78 L114 -78 L114 -40 L-12 86 L-88 86 Z" fill="#FFF2CE" opacity=".16"/>
    <path d="M60 -78 L92 -78 L-28 86 L-60 86 Z" fill="#FFF6DC" opacity=".2"/>
    <circle cx="0" cy="-86" r="4" fill="#3E4650"/>
  </g>
      </g>
    </svg>
  ),
  s3: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-89.0 -29.6 178.0 59.2" aria-hidden>
      <g transform="translate(-406.7,-865.1)">
  <g id="lit-s3" transform="translate(432,858) scale(0.6373,0.3618) rotate(-8)">
    <ellipse cx="-44" cy="14" rx="130" ry="64" fill="url(#shadow)" opacity=".8"/>
    {/* the blister strip, three domes empty, one still full */}
    <path d="M-96 -24 h176 q10 0 10 10 v34 q0 10 -10 10 h-176 q-10 0 -10 -10
             v-34 q0 -10 10 -10 Z" fill="url(#foil)"/>
    <path d="M-96 -24 h176 q10 0 10 10 v8 h-196 v-8 q0 -10 10 -10 Z" fill="#FFFFFF" opacity=".7"/>
    <g fill="#B8C2CC">
      <ellipse cx="-62" cy="-6" rx="20" ry="16"/><ellipse cx="-16" cy="-6" rx="20" ry="16"/>
      <ellipse cx="30" cy="-6" rx="20" ry="16"/>
    </g>
    <g fill="#8E98A4" opacity=".8">
      <path d="M-80 -14 q18 -10 36 0 q-18 8 -36 0 Z"/>
      <path d="M-34 -14 q18 -10 36 0 q-18 8 -36 0 Z"/>
      <path d="M12 -14 q18 -10 36 0 q-18 8 -36 0 Z"/>
    </g>
    <ellipse cx="66" cy="-6" rx="21" ry="17" fill="#E8EEF4"/>
    <ellipse cx="62" cy="-11" rx="12" ry="8" fill="#FFFFFF"/>
    <path d="M-96 -24 h176 q10 0 10 10 v34 q0 10 -10 10 h-176 q-10 0 -10 -10
             v-34 q0 -10 10 -10 Z" fill="none" stroke="#6E7A86" strokeOpacity=".45" strokeWidth="2"/>
    <path d="M-106 4 h196" stroke="#6E7A86" strokeOpacity=".3" strokeWidth="1.6"/>
    {/* and the one that was in it, on the table, going grey */}
    <g transform="translate(-140,4)">
      <ellipse cx="2" cy="4" rx="26" ry="12" fill="#17302E" opacity=".4"/>
      <path d="M-24 2 q-8 -14 8 -18 q13 -3 21 1 q12 -5 17 2 q4 7 -6 9
               q8 4 1 9 q-11 5 -25 3 q-12 -1 -16 -6 Z" fill="#A79A9C"/>
      <path d="M-24 2 q-8 -14 8 -18 q8 -2 14 0 q-11 6 -11 18 Z" fill="#BEB2B4"/>
      <path d="M5 -15 q12 -5 17 2 q4 7 -6 9 q-8 -7 -11 -11 Z" fill="#908486"/>
      <path d="M-14 -11 q8 -3 14 0" fill="none" stroke="#D2C8C9" strokeOpacity=".6" strokeWidth="2"/>
    </g>
  </g>
      </g>
    </svg>
  ),
  s4: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-87.8 -70.5 175.7 141.1" aria-hidden>
      <g transform="translate(-768.0,-829.5)">
  <g id="lit-s4" transform="translate(822,832) scale(0.6149) rotate(-9)">
    <ellipse cx="-90.2" cy="32.6" rx="123.9" ry="26" fill="url(#shadow)" opacity="1" transform="rotate(160.1 -90.2 32.6)"/>
    <g transform="scale(1,0.537)"><ellipse cx="0" cy="0" rx="40" ry="34" fill="url(#occl)"/></g>
    {/* the waist: what is left between two bites, and it is not white any
         more — cut apple goes brown in about ten minutes */}
    <path d="M-24 -6 q-6 -18 4 -30 q-8 -14 -2 -28 q10 6 22 6 q12 0 22 -6
             q6 14 -2 28 q10 12 4 30 q-12 -6 -24 -6 q-12 0 -24 6 Z" fill="#E0CCA0"/>
    <path d="M-24 -6 q-6 -18 4 -30 q-8 -14 -2 -28 q6 4 12 5 q-10 26 -4 46
             q2 6 4 10 q-8 -4 -14 -3 Z" fill="#EFE0BC"/>
    <path d="M24 -64 q6 14 -2 28 q10 12 4 30 q-6 -2 -13 -3 q8 -22 2 -40
             q-2 -8 -5 -12 q8 -1 14 -3 Z" fill="#B49A6A" opacity=".8"/>
    <path d="M-20 -36 q20 -8 40 0" fill="none" stroke="#9E7C46" strokeOpacity=".55" strokeWidth="3"/>
    <path d="M-18 -52 q18 -7 36 0" fill="none" stroke="#9E7C46" strokeOpacity=".4" strokeWidth="2.6"/>
    {/* a pip showing through, because a core is a core */}
    <path d="M-2 -40 q7 -3 9 4 q-2 7 -9 4 Z" fill="#4E3A1E"/>
    {/* the skin still on, top and bottom */}
    <path d="M-30 -70 q30 -16 60 -2 q4 12 -6 14 q-24 -10 -48 0 q-10 -4 -6 -12 Z" fill="#C0392B"/>
    <path d="M-30 -70 q30 -16 60 -2 q-30 -4 -60 6 Z" fill="#E4685C"/>
    <path d="M16 -84 q14 2 14 12 q-6 -6 -14 -8 Z" fill="#8E2418" opacity=".55"/>
    <path d="M-28 4 q28 12 56 0 q-4 12 -14 15 q-16 5 -28 0 q-10 -3 -14 -15 Z" fill="#B3352A"/>
    <path d="M-28 4 q28 12 56 0 q-2 5 -4 8 q-26 8 -48 0 q-3 -4 -4 -8 Z" fill="#D8584A"/>
    {/* stalk and one leaf */}
    <path d="M0 -80 q-5 -22 8 -34" fill="none" stroke="#6E5230" strokeWidth="6" strokeLinecap="round"/>
    <path d="M0 -80 q-5 -22 8 -34" fill="none" stroke="#A0804E" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M6 -106 q18 -12 28 0 q-16 12 -28 0 Z" fill="#6E8E3A"/>
    <path d="M6 -106 q18 -12 28 0 q-14 -3 -28 0 Z" fill="#8FB050"/>
  </g>
      </g>
    </svg>
  ),
  s5: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-156.8 -46.5 313.7 92.9" aria-hidden>
      <g transform="translate(-978.9,-805.2)">
  <g id="lit-s5" transform="translate(1010,800) scale(0.5872,0.3072) rotate(4)">
    <ellipse cx="-80" cy="34" rx="230" ry="120" fill="url(#shadow)" opacity=".8"/>
    <g fill="none" strokeLinecap="round">
      {/* the far loop, laid down first so the near one crosses over it */}
      <path d="M-196 40 C -250 -40, -150 -104, -46 -86 C 60 -68, 122 -6, 78 44"
            stroke="#1A1E24" strokeWidth="20"/>
      <path d="M-196 40 C -250 -40, -150 -104, -46 -86 C 60 -68, 122 -6, 78 44"
            stroke="#EFF2F5" strokeWidth="13"/>
      <path d="M-46 -86 C 60 -68, 122 -6, 78 44"
            stroke="#FFFFFF" strokeWidth="4"/>
      {/* the near loop, crossing it twice */}
      <path d="M78 44 C 10 78, -90 54, -110 -6 C -128 -60, -40 -78, 10 -40"
            stroke="#1A1E24" strokeWidth="20"/>
      <path d="M78 44 C 10 78, -90 54, -110 -6 C -128 -60, -40 -78, 10 -40"
            stroke="#F4F6F8" strokeWidth="13"/>
      <path d="M78 44 C 10 78, -90 54, -110 -6"
            stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="4"/>
      {/* the tail that runs out of the tangle to the second plug */}
      <path d="M10 -40 C 56 -14, 118 -30, 152 -72"
            stroke="#1A1E24" strokeWidth="20"/>
      <path d="M10 -40 C 56 -14, 118 -30, 152 -72"
            stroke="#EFF2F5" strokeWidth="13"/>
    </g>
    {/* end one: a USB-A plug, which is a shape people know */}
    <g transform="rotate(-38 -206 44)">
      <rect x="-246" y="28" width="58" height="34" rx="4" fill="#F2F5F8"/>
      <rect x="-246" y="28" width="58" height="11" rx="4" fill="#FFFFFF"/>
      <rect x="-292" y="33" width="50" height="24" rx="2.5" fill="#C6D0D8"/>
      <rect x="-292" y="33" width="50" height="7" rx="2.5" fill="#F4F8FA"/>
      <rect x="-286" y="42" width="36" height="9" rx="1.5" fill="#2E3840"/>
      <rect x="-190" y="36" width="10" height="18" rx="3" fill="#A6B0BA" opacity=".8"/>
    </g>
    {/* end two: the device connector */}
    <g transform="rotate(-26 162 -78)">
      <rect x="148" y="-96" width="46" height="32" rx="9" fill="#F2F5F8"/>
      <rect x="148" y="-96" width="46" height="10" rx="5" fill="#FFFFFF"/>
      <rect x="188" y="-89" width="17" height="18" rx="3" fill="#AAB4C0"/>
      <rect x="190" y="-85" width="11" height="10" rx="1.5" fill="#6E7A86"/>
    </g>
  </g>
      </g>
    </svg>
  ),
};

/** These are not square — the cable is 314 units wide and the milk jug
 *  is 287 tall — so each one declares the slot it needs and the screen
 *  sizes the wrapper from it. */
export const SCHOOL_CLUE_BOX: Record<string, { w: number; h: number }> = {
  s1: { w: 225.1, h: 287.2 },
  s2: { w: 248.4, h: 75.3 },
  s3: { w: 178, h: 59.2 },
  s4: { w: 175.7, h: 141.1 },
  s5: { w: 313.7, h: 92.9 },
};
