import React from "react";

/** The five pieces of litter for the Kitchen case, drawn to the same standard
 *  as the scene: lit from the window at upper-left, grounded with a contact
 *  shadow, and angled as if dropped. They live apart from the backdrop because
 *  the game has to tap, light and remove them.
 *
 *  Each sits on its own origin inside a 200x200 window of scene units, so the
 *  screen can place it at any coordinate and it scales with the frame.
 */
/** Each clue is drawn on its own origin in a 200x200 window of scene units,
 *  so the screen can drop it at any coordinate and it scales with the frame. */
export const KITCHEN_CLUE_ART: Record<string, React.ReactNode> = {
  k1: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
{/* plastic bottle, on its side, slightly crushed at the waist */}
<g transform="rotate(-72)">
  <ellipse cx="0" cy="34" rx="64" ry="11" fill="url(#kt-castShadow)"/>
  <g filter="url(#kt-dropSm)">
    <path d="M-22 -54 h44 v88 q0 18 -22 18 q-22 0 -22 -18 Z" fill="#C6E7F5" opacity=".94"/>
    <path d="M-22 -14 h44 l-5 15 h-34 Z" fill="#93C9DE" opacity=".85"/>
    <path d="M-22 12 h44 l-4 12 h-36 Z" fill="#93C9DE" opacity=".6"/>
    <path d="M-14 -78 h28 v24 h-28 Z" fill="#D5EDF8" opacity=".92"/>
    <rect x="-16" y="-92" width="32" height="15" rx="4" fill="#2C6FB5"/>
    <rect x="-18" y="-50" width="9" height="82" rx="4.5" fill="#FFFFFF" opacity=".75"/>
    <rect x="13" y="-44" width="5" height="72" rx="2.5" fill="#5E9FC0" opacity=".5"/>
    {/* a label, so it reads as litter not decor */}
    <rect x="-22" y="-30" width="44" height="18" fill="#3E8ED0" opacity=".5"/>
  </g>
</g>
    </svg>
  ),
  k2: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
{/* banana peel, splayed open on the worktop */}
<g transform="rotate(10)">
  <ellipse cx="4" cy="14" rx="76" ry="12" fill="url(#kt-castShadow)"/>
  <ellipse cx="0" cy="8" rx="36" ry="9" fill="url(#kt-occl)"/>
  <g filter="url(#kt-dropSm)">
    {/* four tapering segments. Each is: yellow skin underside, pale inner
         face on top, a bright rim where it catches the window, brown tip. */}
    <g transform="rotate(18)">
      <path d="M0 -10 C 30 -15, 60 -8, 88 9 C 96 14, 92 26, 82 22 C 56 11, 27 5, 0 9 Z" fill="#E3A81C"/>
      <path d="M0 -8 C 28 -12, 56 -6, 82 9 C 88 12, 86 20, 78 17 C 53 7, 26 2, 0 6 Z" fill="#F6E49A"/>
      <path d="M0 -8 C 28 -12, 56 -6, 82 9 C 78 5, 50 -2, 0 -3 Z" fill="#FFF8D4" opacity=".85"/>
      <path d="M74 12 q14 4 16 10 q-11 4 -20 -3 Z" fill="#7A5C1C" opacity=".65"/>
    </g>
    <g transform="rotate(72)">
      <path d="M0 -9 C 26 -14, 52 -7, 76 8 C 83 13, 79 24, 70 21 C 48 10, 24 5, 0 9 Z" fill="#D8A016"/>
      <path d="M0 -7 C 24 -11, 48 -5, 70 8 C 76 11, 74 19, 66 16 C 45 7, 23 2, 0 6 Z" fill="#F0DC8C"/>
      <path d="M0 -7 C 24 -11, 48 -5, 70 8 C 66 4, 42 -2, 0 -2 Z" fill="#FCF3C6" opacity=".8"/>
      <path d="M62 11 q12 4 14 9 q-10 4 -17 -3 Z" fill="#7A5C1C" opacity=".6"/>
    </g>
    <g transform="rotate(-66) scale(-1,1)">
      <path d="M0 -10 C 29 -15, 58 -8, 84 9 C 92 14, 88 26, 78 22 C 53 11, 26 5, 0 9 Z" fill="#DFA61A"/>
      <path d="M0 -8 C 27 -12, 54 -6, 78 9 C 84 12, 82 20, 74 17 C 50 7, 25 2, 0 6 Z" fill="#F6E49A"/>
      <path d="M0 -8 C 27 -12, 54 -6, 78 9 C 74 5, 47 -2, 0 -3 Z" fill="#FFF8D4" opacity=".8"/>
      <path d="M70 12 q13 4 15 9 q-10 4 -18 -3 Z" fill="#7A5C1C" opacity=".6"/>
    </g>
    <g transform="rotate(-128) scale(-1,1)">
      <path d="M0 -9 C 22 -13, 45 -6, 65 7 C 71 11, 67 21, 59 18 C 41 9, 20 5, 0 8 Z" fill="#CE9612"/>
      <path d="M0 -7 C 20 -11, 42 -4, 60 7 C 65 10, 62 17, 55 14 C 38 6, 19 2, 0 5 Z" fill="#EDD884"/>
      <path d="M0 -7 C 20 -11, 42 -4, 60 7 C 56 4, 35 -2, 0 -2 Z" fill="#FAF0BE" opacity=".75"/>
    </g>
    {/* compact stalk end: small, dark, and the thing that says "banana" */}
    <ellipse cx="0" cy="-1" rx="12" ry="9" fill="#EBCE5C"/>
    <ellipse cx="-2" cy="-2" rx="7" ry="5" fill="#FAEBA8" opacity=".7"/>
    <path d="M-3 -8 q4 -13 11 -15 q4 4 -2 8 q-5 3 -4 7 Z" fill="#5E4514"/>
  </g>
</g>
    </svg>
  ),
  k3: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
{/* newspaper, lying flat — almost no cast shadow, because it has no height */}
<g transform="rotate(-7)">
  <g filter="url(#kt-dropSm)">
    <path d="M-76 -34 h150 l7 68 h-164 Z" fill="#EAE7DD"/>
    <path d="M-76 -34 h150 l2 22 h-154 Z" fill="#D5D1C4"/>
    <path d="M-66 -2 h62 M-66 10 h62 M-66 22 h44" stroke="#989487" strokeWidth="3.4"/>
    <rect x="8" y="-6" width="58" height="32" fill="#BBB6A7"/>
    <path d="M-70 -18 h66" stroke="#55514A" strokeWidth="6"/>
    <path d="M-76 -34 h150 l1 8 h-152 Z" fill="#FFFFFF" opacity=".5"/>
  </g>
</g>
    </svg>
  ),
  k4: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
{/* battery, rolled up against the sink, catching one hard specular */}
<g transform="rotate(84)">
  <ellipse cx="0" cy="22" rx="36" ry="8" fill="url(#kt-castShadow)"/>
  <g filter="url(#kt-dropSm)">
    <rect x="-30" y="-14" width="60" height="28" rx="4" fill="#2C333E"/>
    <rect x="-30" y="-14" width="60" height="10" rx="4" fill="#57647A"/>
    <rect x="-30" y="-1" width="60" height="9" fill="#C8892E"/>
    <rect x="28" y="-8" width="10" height="16" rx="2" fill="#BAC1CA"/>
    <path d="M-24 -10 h48" stroke="#FFFFFF" strokeWidth="3" opacity=".5"/>
    <path d="M-16 2 h10 v5 h-10 Z" fill="#F0D9A8" opacity=".8"/>
  </g>
</g>
    </svg>
  ),
  k5: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
{/* half-eaten apple, abandoned on a side plate */}
<g>
  {/* the plate it sits on: cast shadow, occlusion, then the form */}
  <ellipse cx="6" cy="26" rx="76" ry="13" fill="url(#kt-castShadow)"/>
  <ellipse cx="0" cy="22" rx="60" ry="10" fill="url(#kt-occl)"/>
  <g filter="url(#kt-dropSm)">
    <ellipse cx="0" cy="16" rx="58" ry="17" fill="#B7C5D4"/>
    <ellipse cx="0" cy="12" rx="58" ry="17" fill="#EFF4F9"/>
    <ellipse cx="0" cy="12" rx="40" ry="11" fill="#D7E0EA"/>
    <ellipse cx="0" cy="11" rx="40" ry="11" fill="#F7FAFC"/>
    <path d="M-52 10 q20 -12 46 -13" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity=".9"/>
    <path d="M18 22 q24 -3 38 -10" fill="none" stroke="#D9AA72" strokeWidth="5" opacity=".4"/>
  </g>

  {/* the apple, tipped onto its side on the plate */}
  <g transform="translate(2 -13) rotate(-14) scale(.88)" filter="url(#kt-dropSm)">
    <ellipse cx="2" cy="30" rx="30" ry="7" fill="#2A1B10" opacity=".3"/>
    {/* flesh sits underneath and shows through the bite */}
    <circle cx="4" cy="0" r="33" fill="#F4E9C8"/>
    {/* skin, with a scoop taken out of the right side of the silhouette */}
    <path d="M0 -34
             C 17 -34, 29 -23, 33 -8
             C 18 -13, 2 -3, 4 12
             C 6 27, 23 31, 34 22
             C 30 33, 16 38, 0 38
             C -20 38, -34 24, -34 2
             C -34 -18, -22 -34, 0 -34 Z" fill="#C0453C"/>
    {/* lit face, top-left toward the window */}
    <path d="M0 -34 C -14 -34, -26 -26, -31 -12 C -24 -22, -12 -29, 0 -29 Z" fill="#E4796A" opacity=".85"/>
    <ellipse cx="-14" cy="-14" rx="11" ry="8" fill="#F0958A" opacity=".55" transform="rotate(-28 -14 -14)"/>
    {/* warm bounce off the plate along the bottom */}
    <path d="M-26 24 q26 16 52 0" fill="none" stroke="#E8A16A" strokeWidth="6" opacity=".35"/>
    {/* the bitten face: cream, browning at the rim, with teeth marks */}
    <path d="M33 -8 C 18 -13, 2 -3, 4 12 C 6 27, 23 31, 34 22 C 42 10, 42 3, 33 -8 Z" fill="#FBF3DA"/>
    <path d="M33 -8 C 18 -13, 2 -3, 4 12 C 6 27, 23 31, 34 22 C 26 20, 10 10, 14 -2 Z" fill="#E6D2A0" opacity=".55"/>
    {/* oxidised rim where the skin was broken */}
    <path d="M33 -8 C 18 -13, 2 -3, 4 12 C 6 27, 23 31, 34 22" fill="none" stroke="#A8843F" strokeWidth="2.4" opacity=".6"/>
    {/* teeth scallops along the bite */}
    <path d="M14 -6 q7 5 5 13 M22 -10 q7 5 5 13 M9 6 q6 5 5 12" fill="none" stroke="#D5BE8C" strokeWidth="1.8" opacity=".8"/>
    {/* core and seeds glimpsed inside */}
    <path d="M22 0 q7 8 2 18 q-9 -6 -7 -16 Z" fill="#EFE0B4"/>
    <ellipse cx="21" cy="6" rx="2" ry="3.4" fill="#5C4718" transform="rotate(16 21 6)"/>
    <ellipse cx="25" cy="14" rx="1.9" ry="3.2" fill="#5C4718" transform="rotate(16 25 14)"/>
    {/* stem and one leaf */}
    <path d="M-1 -33 q3 -14 12 -18" fill="none" stroke="#6B5227" strokeWidth="4.5" strokeLinecap="round"/>
    <path d="M6 -44 q16 -10 24 -2 q-12 10 -24 2 Z" fill="#6E9A4A"/>
    <path d="M8 -44 q12 -5 20 -2" fill="none" stroke="#4F7634" strokeWidth="1.6"/>
  </g>
</g>
    </svg>
  ),
};
