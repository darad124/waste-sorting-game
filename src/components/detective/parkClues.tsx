import React from "react";

/** The five pieces of litter for the Park case, drawn to the same standard
 *  as the scene: late afternoon, sun low and to the upper RIGHT, so every
 *  cast shadow runs down-LEFT at twice the height of the thing that threw
 *  it, and shadows on the cloth are violet-blue because sky is the only
 *  thing filling them.
 *
 *  Two of these had no silhouette of their own and needed solving rather
 *  than drawing: the cling film is wrapped round a sandwich, which gives
 *  it an outline it can read off, and the gum is identified by its
 *  wrapper, with the chewed wad beside it.
 *
 *  The gradients and filters they reference are defined in ParkScene's
 *  defs, which is in the same document whenever these are on screen.
 */

export const PARK_CLUE_ART: Record<string, React.ReactNode> = {
  p1: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-62.5 -37.0 125.1 74.1" aria-hidden>
      <g transform="translate(-455.6,-808.4)">
  <g id="lit-p1" transform="translate(440,806) scale(0.4018)">
    {/* it has been lying here long enough to mark the cloth */}
    <path d="M-92 -6 q-8 -26 26 -32 q40 -8 78 -2 q34 6 28 26 q-6 20 -50 22
             q-48 2 -82 -14 Z" fill="#8A5A2E" opacity=".14"/>
    <path d="M-52 -2 q-10 -18 16 -21 q30 -4 46 2 q16 6 8 16 q-12 10 -40 9
             q-24 -1 -30 -6 Z" fill="#6E4520" opacity=".16"/>
    <ellipse cx="-14.9" cy="5.9" rx="83.5" ry="66" fill="url(#shadowCloth)" opacity="0.8" transform="rotate(158.3 -14.9 5.9)"/>
    <g transform="rotate(-8)">
      <path d="M-58 2 q-6 -30 0 -44 q42 -12 84 -2 q8 18 2 44 q-44 12 -86 2 Z" fill="#C0A075"/>
      {/* the wet half, where the leaf is, and it is nearly black */}
      <path d="M-56 2 q-4 -18 -1 -26 q40 10 82 2 q4 12 0 24 q-42 12 -81 0 Z" fill="#7E5730"/>
      <path d="M-50 0 q32 8 66 -1 q1 4 0 6 q-34 8 -66 -1 Z" fill="#4E3316" opacity=".75"/>
      {/* the dry top fold, still paper coloured */}
      <path d="M-58 -42 q42 -12 84 -2 q-42 14 -84 2 Z" fill="#E4CFA8"/>
      <path d="M-58 -40 q42 -12 84 -2" fill="none" stroke="#FFF6E2" strokeOpacity=".7" strokeWidth="2.5"/>
      <path d="M-16 -44 q6 24 3 46" fill="none" stroke="#9A7A50" strokeOpacity=".5" strokeWidth="2.5"/>
      <path d="M20 -45 q4 22 2 44" fill="none" stroke="#9A7A50" strokeOpacity=".4" strokeWidth="2"/>
      {/* the staple: the reason this one is not compostable as it stands */}
      <path d="M-8 -48 h16 v5 h-16 Z" fill="url(#steel)"/>
    </g>
    {/* string and tag */}
    <path d="M42 -38 C 88 -62, 126 -38, 148 -58" fill="none" stroke="#F4EBD8" strokeWidth="4"/>
    <path d="M42 -38 C 88 -62, 126 -38, 148 -58" fill="none" stroke="#B9A98C" strokeWidth="1.5"/>
    <g transform="rotate(13 166 -62)">
      <path d="M148 -76 h44 v34 h-44 Z" fill="#F6EEDC"/>
      <path d="M148 -76 h44 v10 h-44 Z" fill="#FFFAF0"/>
      <path d="M154 -66 h30 M154 -58 h22" stroke="#B9A98C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M148 -76 h44 v34 h-44 Z" fill="none" stroke="#C6B69A" strokeWidth="2"/>
    </g>
    <ellipse cx="0" cy="0" rx="82.5" ry="11" fill="url(#occl)"/>
  </g>
      </g>
    </svg>
  ),
  p2: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-59.6 -56.1 119.2 112.2" aria-hidden>
      <g transform="translate(-551.1,-772.0)">
  <g id="lit-p2" transform="translate(556,770) scale(0.3766)">
    <ellipse cx="-13" cy="5.2" rx="126.5" ry="110" fill="url(#shadowCloth)" opacity="0.9" transform="rotate(158.3 -13 5.2)"/>
    <g transform="rotate(-14)">
      <path d="M-124 -6 l248 -16 l0 13 l-248 16 Z" fill="#A9864E"/>
      <path d="M-124 -6 l248 -16 l0 5 l-248 16 Z" fill="#DFC593"/>
      <path d="M-124 1 l248 -16 l0 4 l-248 16 Z" fill="#8E6E3E" opacity=".6"/>
      <path d="M110 -22 l14 -1 l0 13 l-14 1 Z" fill="#A98A56"/>
    </g>
    <g transform="rotate(4) translate(0,14)">
      <path d="M-124 -6 l248 -10 l0 13 l-248 10 Z" fill="#A4824B"/>
      <path d="M-124 -6 l248 -10 l0 5 l-248 10 Z" fill="#D9BF8C"/>
      <path d="M-124 1 l248 -10 l0 4 l-248 10 Z" fill="#87683A" opacity=".6"/>
      <path d="M110 -16 l14 0 l0 13 l-14 0 Z" fill="#A4854F"/>
    </g>
    {/* still joined at the thick end: a pair, split only part way */}
    <path d="M104 -28 q26 -2 26 20 q0 20 -26 20 q6 -20 0 -40 Z" fill="#C0A263"/>
    <path d="M104 -28 q26 -2 26 20 q-14 2 -20 -2 q4 -12 -6 -18 Z" fill="#F2E2B8"/>
    {/* and used: the tips are stained */}
    <path d="M-124 -7 l-8 1 l0 14 l8 -1 Z" fill="#6E4A22" opacity=".75"/>
    <path d="M-124 8 l-8 0 l0 13 l8 -1 Z" fill="#7A5228" opacity=".7"/>
    <ellipse cx="0" cy="0" rx="132" ry="10" fill="url(#occl)"/>
  </g>
      </g>
    </svg>
  ),
  p3: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-43.8 -39.7 87.6 79.4" aria-hidden>
      <g transform="translate(-380.7,-854.3)">
  <g id="lit-p3" transform="translate(386,852) scale(0.434)">
    <ellipse cx="-13" cy="5.2" rx="81.5" ry="66" fill="url(#shadowCloth)" opacity="0.85" transform="rotate(158.3 -13 5.2)"/>
    {/* the paper sleeve, torn open at one end */}
    <g transform="rotate(-11)">
      <path d="M-40 6 l72 -8 l-2 -24 l-72 8 Z" fill="#F6F4EE"/>
      <path d="M-40 6 l72 -8 l-1 -7 l-72 8 Z" fill="#CBC8C0" opacity=".7"/>
      <path d="M-41 -8 l72 -8 l-1 -8 l-72 8 Z" fill="#2E7A62"/>
      <path d="M-41 -16 l72 -8" fill="none" stroke="#86DDB8" strokeOpacity=".7" strokeWidth="2"/>
      <path d="M-42 -18 l72 -8 l0 3 l-72 8 Z" fill="#FFFFFF" opacity=".85"/>
      <path d="M32 -2 l-2 -24 l7 -1 l-1 6 l6 -1 l-1 7 l6 -1 l-2 7 l5 1 l-3 5 Z" fill="#EDEAE2"/>
    </g>
    {/* the foil liner, half pulled out and crumpled. Foil is not a
         gradient — it is FACETS, each plane catching a different amount of
         sky, white hard up against near-black with nothing in between.
         That hard cut is the whole of what the eye reads as metal. */}
    <g transform="rotate(19 52 -12)">
      <path d="M30 -2 l19 -6 l4 21 l-20 6 Z" fill="#B4C0CC"/>
      <path d="M49 -8 l12 -4 l5 20 l-13 5 Z" fill="#FDFEFF"/>
      <path d="M61 -12 l10 -3 l4 19 l-10 4 Z" fill="#6E7A88"/>
      <path d="M71 -15 q13 -6 18 3 q-6 12 -18 8 Z" fill="#F4F8FC"/>
      <path d="M71 -15 q13 -6 18 3 q-4 2 -9 2 q-6 0 -9 -5 Z" fill="#FFFFFF"/>
      <path d="M75 -1 q7 3 14 -4 q-6 12 -18 8 Z" fill="#8894A2"/>
      <path d="M49 -8 l4 21 M61 -12 l4 20" stroke="#5A6672" strokeOpacity=".45" strokeWidth="1.2"/>
      <path d="M30 -2 l41 -13" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="1.6"/>
    </g>
    {/* the wad: flattened, pulled out of shape, and dull. Gum that has
         been chewed has no shine left in it at all. */}
    <g transform="translate(-72,-2)">
      <ellipse cx="1" cy="3" rx="18" ry="6" fill="#16262C" opacity=".4"/>
      <path d="M-17 1 q-6 -10 6 -13 q9 -2 15 1 q9 -4 12 1 q3 5 -4 7
               q6 3 1 6 q-8 4 -18 2 q-9 -1 -12 -4 Z" fill="#9E9092"/>
      <path d="M-17 1 q-6 -10 6 -13 q6 -1 10 0 q-8 4 -8 13 Z" fill="#B3A6A8"/>
      <path d="M4 -8 q9 -4 12 1 q3 5 -4 7 q-6 -5 -8 -8 Z" fill="#8A7C7E"/>
      <path d="M-10 -9 q6 -2 10 0" fill="none" stroke="#C6BABB" strokeOpacity=".65" strokeWidth="1.4"/>
      {/* the stringy bit it left behind on the way down */}
      <path d="M14 -4 q9 2 13 -3" fill="none" stroke="#9E9092" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
    <ellipse cx="0" cy="0" rx="82.5" ry="9" fill="url(#occl)"/>
  </g>
      </g>
    </svg>
  ),
  p4: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-59.4 -55.1 118.8 110.2" aria-hidden>
      <g transform="translate(-958.6,-795.7)">
  <g id="lit-p4" transform="translate(1000,800) scale(0.3976)">
    <ellipse cx="-104.2" cy="41.4" rx="147.1" ry="34.3" fill="url(#shadowCloth)" opacity="1" transform="rotate(158.3 -104.2 41.4)"/>
    <ellipse cx="0" cy="0" rx="42.9" ry="13" fill="url(#occl)"/>
    <path d="M-38 0 h76 v-108 h-76 Z" fill="url(#steel)"/>
    <ellipse cx="0" cy="-108" rx="38" ry="10" fill="#8E9AA4"/>
    <ellipse cx="0" cy="-110" rx="38" ry="10" fill="#C2CCD4"/>
    <ellipse cx="0" cy="-110" rx="38" ry="10" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="3.5"/>
    <ellipse cx="0" cy="-108" rx="30" ry="7" fill="#4E5A64"/>
    {/* the paper band, and the strip of bare steel where it has torn */}
    <path d="M-38 -14 h76 v-80 h-76 Z" fill="#C0392B"/>
    <path d="M-38 -14 h13 v-80 h-13 Z" fill="#E4685C" opacity=".6"/>
    <path d="M28 -14 h10 v-80 h-10 Z" fill="#7E2018" opacity=".55"/>
    <path d="M-38 -70 h76 v16 h-76 Z" fill="#F4E8CE"/>
    <path d="M-26 -62 h52" stroke="#C0392B" strokeWidth="5" strokeLinecap="round"/>
    <path d="M-30 -44 h60 M-30 -34 h44" stroke="#F4E8CE" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round"/>
    <path d="M-38 -94 h76" fill="none" stroke="#FFD8CE" strokeOpacity=".55" strokeWidth="2.5"/>
    <path d="M14 -94 l5 12 l-4 10 l6 11 l-5 12 l4 11 l-5 13 l4 10 l-3 11
             l8 0 l0 -90 Z" fill="url(#steel)"/>
    <path d="M14 -94 l5 12 l-4 10 l6 11 l-5 12 l4 11 l-5 13 l4 10 l-3 11"
          fill="none" stroke="#7E2018" strokeOpacity=".5" strokeWidth="2"/>
    {/* the lid, peeled off and standing up. It is bent, and the cut edge
         is the brightest line on the object — that is what a fresh cut in
         steel does with a low sun. */}
    <g transform="rotate(-24 -30 -112)">
      <ellipse cx="-58" cy="-134" rx="37" ry="12" fill="#8E9AA4"/>
      <ellipse cx="-58" cy="-137" rx="37" ry="12" fill="url(#steel)"/>
      <ellipse cx="-58" cy="-137" rx="37" ry="12" fill="none" stroke="#FFFFFF" strokeOpacity=".95" strokeWidth="3"/>
      <ellipse cx="-58" cy="-137" rx="26" ry="7" fill="none" stroke="#7E8A94" strokeOpacity=".6" strokeWidth="2.5"/>
      <path d="M-95 -137 q14 16 37 16 q23 0 37 -16 l0 9 q-14 16 -37 16 q-23 0 -37 -16 Z" fill="#6E7A84"/>
    </g>
  </g>
      </g>
    </svg>
  ),
  p5: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-61.8 -53.5 123.6 107.0" aria-hidden>
      <g transform="translate(-687.0,-737.2)">
  <g id="lit-p5" transform="translate(700,732) scale(0.35)">
    <ellipse cx="-37.2" cy="14.8" rx="148" ry="105.6" fill="url(#shadowCloth)" opacity="0.85" transform="rotate(158.3 -37.2 14.8)"/>
    <ellipse cx="0" cy="0" rx="126.5" ry="20" fill="url(#occl)"/>
    {/* the half sandwich that gives the film something to be */}
    <g transform="rotate(-6)">
      <path d="M-52 -4 l104 -6 l-6 -44 l-96 4 Z" fill="#E8D2A6"/>
      <path d="M-52 -4 l104 -6 l-2 -13 l-102 6 Z" fill="#C9A86E"/>
      <path d="M-54 -50 l96 -4 q-48 -12 -96 4 Z" fill="#F4E4BE"/>
      <path d="M-50 -30 l100 -6" stroke="#9EC060" strokeWidth="7" strokeLinecap="round"/>
      <path d="M-48 -22 l98 -6" stroke="#D8703E" strokeWidth="6" strokeLinecap="round"/>
      <path d="M-46 -38 l96 -5" stroke="#F2E0B4" strokeWidth="5" strokeLinecap="round"/>
      {/* bitten, not simply left */}
      <path d="M26 -52 q18 6 20 20 q-18 -4 -20 -20 Z" fill="#B3A894" opacity=".5"/>
    </g>
    {/* the film. Take one had a single smooth arc for an outline and came
         out as a glass dome. Cling film has no smooth edges anywhere on it:
         it is a CREASED sheet, so the outline is a run of short straight
         facets meeting at angles, it sits close in around what it was
         wrapped around instead of ballooning off it, and the slack is
         gathered and twisted to one side. Almost none of it is opaque —
         it is made of the light along its creases, and it only exists at
         all because the sandwich is showing through it. */}
    <g>
      <path d="M-96 4 L-118 -14 L-101 -39 L-88 -54 L-55 -71 L-27 -86 L9 -83
               L48 -84 L88 -66 L101 -55 L117 -28 L100 -9 L87 9 L36 11 L-11 18
               L-48 11 Z" fill="#DCE8F0" opacity=".17"/>
      <path d="M-96 4 L-118 -14 L-101 -39 L-88 -54 L-55 -71 L-27 -86 L9 -83
               L48 -84 L88 -66 L101 -55 L117 -28 L100 -9 L87 9 L36 11 L-11 18
               L-48 11 Z" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2.6"/>
      <path d="M-96 4 L-118 -14 L-101 -39 L-88 -54 L-55 -71 L-27 -86 L9 -83"
            fill="none" stroke="#FFFFFF" strokeOpacity=".95" strokeWidth="3.2"/>
      {/* creases. Every one of them is a straight segment or a hard corner,
           because a crease in film is a fold and folds are not curves. */}
      <g fill="none" stroke="#FFFFFF" strokeLinejoin="miter">
        <path d="M-84 -50 L-60 -62 L-30 -70" strokeOpacity=".8" strokeWidth="2.4"/>
        <path d="M-92 -22 L-70 -40 L-48 -46" strokeOpacity=".5" strokeWidth="2"/>
        <path d="M-76 6 L-60 -14 L-50 -34" strokeOpacity=".45" strokeWidth="1.8"/>
        <path d="M50 -76 L78 -62 L96 -44" strokeOpacity=".8" strokeWidth="2.4"/>
        <path d="M78 -34 L92 -22 L86 -4" strokeOpacity=".5" strokeWidth="2"/>
        <path d="M-18 -84 L16 -78 L44 -70" strokeOpacity=".85" strokeWidth="2.6"/>
        <path d="M-30 14 L14 12 L56 6" strokeOpacity=".4" strokeWidth="1.8"/>
        <path d="M-46 -60 L-38 -30 L-44 -2" strokeOpacity=".35" strokeWidth="1.6"/>
        <path d="M62 -72 L58 -40 L66 -10" strokeOpacity=".35" strokeWidth="1.6"/>
      </g>
      {/* the slack, gathered and twisted shut at one corner */}
      <g transform="rotate(-20 -120 -30)">
        <path d="M-166 -42 L-146 -50 L-128 -44 L-124 -26 L-136 -16 L-158 -20 Z"
              fill="#E4EEF4" opacity=".34"/>
        <path d="M-166 -42 L-146 -50 L-128 -44" fill="none"
              stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.6"/>
        <path d="M-160 -32 L-144 -38 L-130 -33" fill="none"
              stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="2"/>
        <path d="M-152 -22 L-140 -27 L-128 -23" fill="none"
              stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="1.8"/>
        <path d="M-146 -50 L-142 -18 M-128 -44 L-132 -18" fill="none"
              stroke="#FFFFFF" strokeOpacity=".35" strokeWidth="1.5"/>
      </g>
      {/* two hard speculars, where the sun comes off a flat piece of it */}
      <path d="M22 -80 L58 -72 L54 -64 L18 -72 Z" fill="#FFFFFF" opacity=".8"/>
      <path d="M-84 -56 L-64 -66 L-60 -60 L-80 -50 Z" fill="#FFFFFF" opacity=".55"/>
    </g>
  </g>
      </g>
    </svg>
  ),
};

/** These are not square — the cable is 314 units wide and the milk jug
 *  is 287 tall — so each one declares the slot it needs and the screen
 *  sizes the wrapper from it. */
export const PARK_CLUE_BOX: Record<string, { w: number; h: number }> = {
  p1: { w: 125.1, h: 74.1 },
  p2: { w: 119.2, h: 112.2 },
  p3: { w: 87.6, h: 79.4 },
  p4: { w: 118.8, h: 110.2 },
  p5: { w: 123.6, h: 107 },
};
