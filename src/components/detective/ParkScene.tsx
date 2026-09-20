import React, { useEffect, useState } from "react";
import { playSound } from "../../utils/audio";

/* ==================================================================== *
 *  Park Picnic — high-fidelity scene
 *
 *  One SVG on a fixed 1200x900 viewBox, matching the frame's 4:3, so the
 *  art never distorts.
 *
 *  A fourth camera and a fourth light. The horizon is at y=232, so the
 *  vanishing point is (600, 232) and every depth line in the picture runs
 *  to it — the blanket's sides, the gaps between its checks, the mown
 *  stripes on the lawn. Its far edge is placed so the cloth comes out
 *  SQUARE on the ground rather than square on the page, because a picnic
 *  blanket is square and the gingham is what gives it away if it isn't.
 *
 *  Everything standing on the grass is drawn in MILLIMETRES at its real
 *  size and placed by a scale rule taken from that horizon —
 *
 *      pixels per metre = 0.7 * (y - 232)
 *
 *  which is why the hat, the football and the soup can are in scale with
 *  each other and with the check of the cloth they are lying on without
 *  anybody having decided it.
 *
 *  Late afternoon, sun low and to the upper RIGHT behind the crown of the
 *  tree. Cast shadows run down-LEFT at twice the height of the thing that
 *  threw them; shadows on grass are blue-GREEN, because sky plus bounce
 *  off the surrounding grass is what fills them, and the tree's own
 *  shadow is BLUE, because over red gingham a green shadow goes brown.
 *
 *  The five pieces of litter are NOT in this backdrop — the game has to
 *  tap, light and remove them, so they live in parkClues.tsx and are
 *  positioned by the screen.
 * ==================================================================== */

/** Things at this picnic that are genuinely confusable with litter but are
 *  not waste. Each carries its own note rather than a template — a line
 *  written for the object is the difference between a game with a voice and
 *  a game that fills in a blank.
 *
 *  The bin is the one that teaches, and it teaches by being thirty metres
 *  away from all of this. */
const DECOYS: { label: string; note: string; x: number; y: number; w: number; h: number }[] = [
  { label: "hamper",       note: "Somebody's lunch is still in there.",            x: 348,  y: 563, w: 120, h: 99  },
  { label: "flask",        note: "Still hot. Still theirs.",                       x: 236,  y: 612, w: 46,  h: 100 },
  { label: "cup of tea",   note: "Half drunk. That's not abandoned, that's paused.", x: 328, y: 716, w: 62,  h: 44  },
  { label: "strawberries", note: "Food. Not leftovers — food.",                    x: 592,  y: 618, w: 66,  h: 36  },
  { label: "paperback",    note: "Face down, holding its place. Someone's coming back.", x: 774, y: 652, w: 94, h: 28 },
  { label: "sun hat",      note: "Straw. Expensive straw.",                        x: 116,  y: 792, w: 162, h: 54  },
  { label: "football",     note: "Still bouncing. Not your problem.",              x: 1075, y: 548, w: 60,  h: 60  },
  { label: "lemonade",     note: "Two thirds full. Leave it alone.",               x: 728,  y: 688, w: 42,  h: 114 },
  { label: "bin",          note: "A bin. Thirty metres away. Remember that.",      x: 262,  y: 336, w: 70,  h: 122 },
];

interface ParkSceneProps {
  /** Called with that object's own note when the player taps something that
   *  turns out not to be litter. */
  onDecoy?: (note: string) => void;
}

export const ParkScene: React.FC<ParkSceneProps> = ({ onDecoy }) => {
  // Three things the player can poke at. None of them is a clue — a toy that
  // is also a clue cannot work, because tapping a clue has to open the
  // sorting picker.
  const [shedding, setShedding] = useState(false);
  const [gusting, setGusting] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Both one-shots are owned by the state that ends them rather than by a
  // ref, so they clean themselves up if the scene unmounts mid-cycle.
  useEffect(() => {
    if (!shedding) return;
    const t = window.setTimeout(() => setShedding(false), 4300);
    return () => window.clearTimeout(t);
  }, [shedding]);

  useEffect(() => {
    if (!gusting) return;
    const t = window.setTimeout(() => setGusting(false), 1500);
    return () => window.clearTimeout(t);
  }, [gusting]);

  const shedLeaves = () => {
    if (shedding) return;
    setShedding(true);
    playSound.detectiveScan();
  };
  const sendGust = () => {
    if (gusting) return;
    setGusting(true);
    playSound.detectiveScan();
  };
  const toggleSpeaker = () => {
    setPlaying((v) => !v);
    playSound.detectiveScan();
  };

  const prop = (label: string, onActivate: () => void) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    style: { cursor: "pointer" as const, pointerEvents: "auto" as const },
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onActivate();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    },
  });

  return (
  <svg
    className={`absolute inset-0 w-full h-full${shedding ? " pk-shedding" : ""}${
      gusting ? " pk-gust" : ""}${playing ? " pk-playing" : ""}`}
    viewBox="0 0 1200 900"
    preserveAspectRatio="xMidYMid slice"
    // the backdrop is inert; only the three props and the decoys opt back in
    style={{ pointerEvents: "none" }}
  >

<defs>

  {/* ══ LIGHT MODEL ══
       Late afternoon, an hour or so before sunset. One source: the sun,
       low and to the upper RIGHT, sitting just behind the crown of the
       tree on that side. Everything in this picture follows from it:

         · cast shadows run down and to the LEFT, and they are LONG —
           twice the height of the thing that threw them, which is a sun
           about twenty-seven degrees up. A short shadow would put the
           sun overhead and make this midday.
         · shadows on grass are blue-GREEN, because what fills them is
           sky plus light bouncing back off the surrounding grass;
           shadows on the cloth are violet-blue, from sky alone
         · the upper-RIGHT edge of every object carries a hot rim
         · the gaps in that crown drop dapple on the ground below and to
           the LEFT of themselves, stretched along the light because the
           ground is raked at a shallow angle
         · distance drains contrast and pushes colour toward the blue of
           the air in between, so the far side of the park is nearly a
           flat wash and the near grass is the only place with real
           darkness in it */}

  {/* ── sky. No clouds: the sun is a low disc just off the top-right
         corner, and everything the sky does here is that glow and the
         haze it lights along the horizon. ──────────────────────────── */}
  <linearGradient id="pk-sky" x1=".92" y1="0" x2=".08" y2="1">
    <stop offset="0"   stopColor="#FFE9B8"/>
    <stop offset=".22" stopColor="#D8DCC8"/>
    <stop offset=".5"  stopColor="#A9C3DA"/>
    <stop offset="1"   stopColor="#6E9CC6"/>
  </linearGradient>
  <radialGradient id="pk-sunGlow" cx=".93" cy="-.06" r=".72">
    <stop offset="0"   stopColor="#FFF6D6" stopOpacity=".95"/>
    <stop offset=".35" stopColor="#FFE7A8" stopOpacity=".5"/>
    <stop offset="1"   stopColor="#FFDE90" stopOpacity="0"/>
  </radialGradient>
  <linearGradient id="pk-skyHaze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#EFE3C4" stopOpacity="0"/>
    <stop offset="1"   stopColor="#F6E6C0" stopOpacity=".85"/>
  </linearGradient>

  {/* ── the meadow: one plane, so its gradient runs with DEPTH and not
         with the picture — pale and blue-drained at the horizon, deep and
         saturated at the camera ─────────────────────────────────────── */}
  <linearGradient id="pk-meadow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stopColor="#BCCF92"/>
    <stop offset=".1"   stopColor="#A8C471"/>
    <stop offset=".26"  stopColor="#8CB553"/>
    <stop offset=".47"  stopColor="#6EA141"/>
    <stop offset=".72"  stopColor="#4E8033"/>
    <stop offset="1"    stopColor="#33612A"/>
  </linearGradient>
  <linearGradient id="pk-meadowSun" x1="1" y1="0" x2=".15" y2=".85">
    <stop offset="0"   stopColor="#FFEDA8" stopOpacity=".44"/>
    <stop offset=".45" stopColor="#FFE79C" stopOpacity=".14"/>
    <stop offset="1"   stopColor="#FFE79C" stopOpacity="0"/>
  </linearGradient>
  <linearGradient id="pk-meadowCool" x1=".1" y1="1" x2=".8" y2=".1">
    <stop offset="0"   stopColor="#1E3F52" stopOpacity=".4"/>
    <stop offset=".4"  stopColor="#24485A" stopOpacity=".14"/>
    <stop offset="1"   stopColor="#24485A" stopOpacity="0"/>
  </linearGradient>

  {/* ── shadow. Not grey, ever. ─────────────────────────────────────── */}
  <radialGradient id="pk-shadow" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#1B3B44" stopOpacity=".5"/>
    <stop offset=".62" stopColor="#20414A" stopOpacity=".3"/>
    <stop offset="1"   stopColor="#25454E" stopOpacity="0"/>
  </radialGradient>
  <radialGradient id="pk-shadowCloth" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#3A3160" stopOpacity=".46"/>
    <stop offset=".6"  stopColor="#413A66" stopOpacity=".26"/>
    <stop offset="1"   stopColor="#484270" stopOpacity="0"/>
  </radialGradient>
  <radialGradient id="pk-occl" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#16262C" stopOpacity=".62"/>
    <stop offset="1"   stopColor="#16262C" stopOpacity="0"/>
  </radialGradient>

  {/* ── the cloth ───────────────────────────────────────────────────── */}
  <linearGradient id="pk-clothLight" x1=".95" y1=".05" x2=".1" y2=".95">
    <stop offset="0"   stopColor="#FFF6DC"/>
    <stop offset=".34" stopColor="#F6E9CC"/>
    <stop offset=".68" stopColor="#DCCDB4"/>
    <stop offset="1"   stopColor="#B3A894"/>
  </linearGradient>
  <linearGradient id="pk-clothWarm" x1="1" y1="0" x2=".18" y2=".9">
    <stop offset="0"   stopColor="#FFE9A0" stopOpacity=".34"/>
    <stop offset=".38" stopColor="#FFE4A0" stopOpacity=".12"/>
    <stop offset="1"   stopColor="#FFE4A0" stopOpacity="0"/>
  </linearGradient>
  <linearGradient id="pk-clothShade" x1=".05" y1="1" x2=".85" y2=".05">
    <stop offset="0"   stopColor="#39325E" stopOpacity=".4"/>
    <stop offset=".34" stopColor="#3F3866" stopOpacity=".16"/>
    <stop offset="1"   stopColor="#3F3866" stopOpacity="0"/>
  </linearGradient>
  <linearGradient id="pk-clothBack" x1=".9" y1="0" x2=".1" y2="1">
    <stop offset="0"   stopColor="#F6EAD2"/>
    <stop offset=".55" stopColor="#E2D2B6"/>
    <stop offset="1"   stopColor="#BCAE97"/>
  </linearGradient>

  {/* ── materials the props and the litter share ────────────────────── */}
  <linearGradient id="pk-steel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stopColor="#6E7A84"/>
    <stop offset=".12"  stopColor="#C6D0D8"/>
    <stop offset=".26"  stopColor="#F2F6F8"/>
    <stop offset=".42"  stopColor="#9EAAB4"/>
    <stop offset=".62"  stopColor="#D6DEE4"/>
    <stop offset=".8"   stopColor="#7E8A94"/>
    <stop offset="1"    stopColor="#56626C"/>
  </linearGradient>
  <linearGradient id="pk-foil" x1="0" y1="0" x2="1" y2=".3">
    <stop offset="0"   stopColor="#8E98A4"/>
    <stop offset=".2"  stopColor="#E8EEF4"/>
    <stop offset=".38" stopColor="#AAB6C0"/>
    <stop offset=".58" stopColor="#F4F8FC"/>
    <stop offset=".78" stopColor="#96A2AE"/>
    <stop offset="1"   stopColor="#C8D2DA"/>
  </linearGradient>
  <linearGradient id="pk-wicker" x1=".85" y1="0" x2=".15" y2=".9">
    <stop offset="0"   stopColor="#E0B66E"/>
    <stop offset=".45" stopColor="#C2934E"/>
    <stop offset="1"   stopColor="#8A6430"/>
  </linearGradient>
  <linearGradient id="pk-bark" x1="1" y1="0" x2="0" y2="0">
    <stop offset="0"   stopColor="#9A7A54"/>
    <stop offset=".2"  stopColor="#6E5438"/>
    <stop offset=".55" stopColor="#4A3726"/>
    <stop offset="1"   stopColor="#33261A"/>
  </linearGradient>

  {/* a sphere lit from the upper right, with the sky bouncing back into
       its lower left — that second term is what stops a ball reading as a
       flat disc with a dot on it */}
  <radialGradient id="pk-ballLight" cx=".72" cy=".24" r=".92">
    <stop offset="0"   stopColor="#FFFBE8" stopOpacity=".85"/>
    <stop offset=".3"  stopColor="#FFF4D0" stopOpacity=".2"/>
    <stop offset=".62" stopColor="#2A3A52" stopOpacity=".1"/>
    <stop offset=".88" stopColor="#22324A" stopOpacity=".42"/>
    <stop offset="1"   stopColor="#6E90B4" stopOpacity=".3"/>
  </radialGradient>

  {/* sky, seen through a gap in the leaves. It is brighter than the
       sky at the horizon because you are looking up through it. */}
  <radialGradient id="pk-skyHole" cx=".4" cy=".35" r=".75">
    <stop offset="0"   stopColor="#FFF8E0"/>
    <stop offset=".55" stopColor="#E8EEDC"/>
    <stop offset="1"   stopColor="#C6D6DC"/>
  </radialGradient>

  {/* one blob of dapple: soft because of what is inside it */}
  <radialGradient id="pk-dappleG" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#FFF6D2"/>
    <stop offset=".46" stopColor="#FFEFB8" stopOpacity=".7"/>
    <stop offset="1"   stopColor="#FFE9A4" stopOpacity="0"/>
  </radialGradient>

  {/* ── blur is depth, not decoration ───────────────────────────────── */}
  <filter id="pk-softSm" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="5"/></filter>
  <filter id="pk-softMd" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="11"/></filter>
  <filter id="pk-shadeSoft" x="-30%" y="-140%" width="160%" height="380%">
    <feGaussianBlur stdDeviation="21"/></filter>
  <filter id="pk-shadeCore" x="-30%" y="-140%" width="160%" height="380%">
    <feGaussianBlur stdDeviation="9"/></filter>
  <filter id="pk-fgSoft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="9"/></filter>
  <filter id="pk-hazeSoft" x="-20%" y="-30%" width="140%" height="160%">
    <feGaussianBlur stdDeviation="7"/></filter>
  <filter id="pk-filmGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope=".5" intercept="-.19"/></feComponentTransfer>
  </filter>

  {/* in millimetres, because that is the space the basket is drawn in */}
  <linearGradient id="pk-mownFadeG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stopColor="#000000"/>
    <stop offset=".12"  stopColor="#4A4A4A"/>
    <stop offset=".42"  stopColor="#FFFFFF"/>
    <stop offset="1"    stopColor="#FFFFFF"/>
  </linearGradient>
  <mask id="pk-mownFade">
    <rect y="232" width="1200" height="668" fill="url(#pk-mownFadeG)"/>
  </mask>

  <clipPath id="pk-basketClip"><path d="M-165 0 L165 0 L200 -248 L-200 -248 Z"/></clipPath>
  <clipPath id="pk-clothClip"><path d="M60 898.6Q101 898.4 150.8 904.1Q198.1 901.1 241.7 899.4Q285.2 895.6 332.5 890.1Q377.4 894.9 423.3 903.7Q471.7 906.1 514.2 904.5Q557 898.8 605 891.6Q650.7 897.4 695.8 895.7Q743.5 896.9 786.7 902.3Q836.9 898.5 877.5 902.2Q922.1 898.6 968.3 889.8Q1010.3 892.6 1059.2 895.7Q1100 902.7 1150 906.4Q1136.7 876.1 1118 844.3Q1096.2 819.5 1066.9 798.5Q1052.3 776.6 1033.7 752.8Q1018.7 729.5 1002.1 707Q983 688.6 957.1 661.3Q938.9 640.1 921.2 615.6Q899.2 594.7 886 569.8Q885.6 575.2 882.4 570.7Q845.6 568.7 802.4 571Q761.3 574.3 722.5 574.2Q677.7 569.9 642.5 566.2Q599.2 561.6 562.6 564.5Q518.2 569.6 482.7 569.2Q439 568.5 402.7 572.8Q361.6 575.8 322.8 571.4Q301.1 593 287.9 615.6Q268.7 642.3 248.6 661.3Q230.5 687.8 206.1 707Q188.2 729.1 174.6 752.8Q155.1 779.5 138.4 798.5Q118.9 817.9 90.2 844.3Z"/></clipPath>
</defs>

{/* ══════════ 1. SKY ══════════
     No clouds. The sun is a low disc just off the top-right corner and
     everything the sky does here is that one glow and the haze it lights
     along the horizon. */}
<rect width="1200" height="900" fill="url(#pk-sky)"/>
<rect width="1200" height="420" fill="url(#pk-sunGlow)"/>
<rect y="60" width="1200" height="200" fill="url(#pk-skyHaze)"/>

{/* ══════════ 2. A KITE ══════════
     There are people in this park. Drawing them at this distance would
     make two ambiguous smudges; the kite says it instead, and the string
     running off toward the far side says who is holding it. */}
<g className="kite" transform="translate(386,122)">
  <path d="M0 -30 L21 0 L0 34 L-21 0 Z" fill="#E45B4A"/>
  <path d="M0 -30 L21 0 L0 34 Z" fill="#C6392B"/>
  <path d="M0 -30 L0 34 M-21 0 L21 0" stroke="#F8D8A0" strokeOpacity=".8" strokeWidth="1.4"/>
  <path d="M0 34 q10 18 -4 30 q-14 12 -4 28" fill="none" stroke="#E8B34A" strokeWidth="2.2"/>
  <path d="M-6 47 l12 4 M-9 66 l12 4" stroke="#7FC2E8" strokeWidth="3" strokeLinecap="round"/>
</g>
<path d="M377 165 C 411 197, 447 220, 473 245" fill="none"
      stroke="#F4EBD4" strokeOpacity=".42" strokeWidth="1.2"/>

{/* ══════════ 3. THE FAR SIDE OF THE PARK ══════════
     Three depths of treeline. Distance takes contrast out and pushes
     colour toward the blue of the air in between, so the furthest band is
     nearly a flat wash and only the nearest one has any modelling. */}
<g filter="url(#pk-hazeSoft)" opacity=".95">
  <path d="M-20 244 q60 -40 118 -8 q54 -46 128 -14 q46 -34 104 -6 q70 -44 150 -8
           q52 -38 126 -10 q66 -40 140 -4 q58 -32 128 -6 q54 -30 146 2 v66 H-20 Z"
        fill="#7E9EA6"/>
</g>
<g filter="url(#pk-hazeSoft)" opacity=".92">
  <path d="M-20 258 q74 -48 142 -12 q62 -40 132 -10 q54 -34 118 -4 q78 -42 152 -6
           q60 -34 132 -8 q70 -36 156 0 q54 -24 120 -4 q40 -14 90 0 v58 H-20 Z"
        fill="#5C8270"/>
</g>
<g>
  <path d="M-20 278 q82 -42 156 -10 q70 -36 144 -8 q58 -28 128 -2 q84 -38 164 -4
           q66 -28 140 -6 q76 -30 168 4 q58 -18 130 -2 q44 -8 96 4 v46 H-20 Z"
        fill="#4C7550"/>
  <path d="M-20 292 q96 -26 178 -4 q80 -22 158 -4 q64 -16 138 2 q92 -20 176 4
           q72 -14 152 2 q84 -12 178 10 v30 H-20 Z" fill="#3E6642" opacity=".8"/>
</g>

{/* ══════════ 3b. TREES ON THE FAR SIDE ══════════
     Sized off the horizon like everything else: at y=300 a metre is 48
     pixels, so a four-and-a-half metre tree comes out 210 tall. They are
     drained toward the blue of the air in between and given almost no
     internal contrast, because that is what four hundred metres does. */}
<g opacity=".92">
  <g transform="translate(78,302)">
    <ellipse cx="-34" cy="3" rx="72" ry="9" fill="#1E3F52" opacity=".22"/>
    <path d="M-7 0 q-4 -64 2 -96 h10 q6 32 2 96 Z" fill="#5E6E5A"/>
    <g fill="#6E8E6E">
      <ellipse cx="0" cy="-128" rx="62" ry="50"/><ellipse cx="-36" cy="-104" rx="44" ry="34"/>
      <ellipse cx="38" cy="-108" rx="46" ry="36"/><ellipse cx="6" cy="-168" rx="44" ry="34"/>
    </g>
    <g fill="#88A67E">
      <ellipse cx="18" cy="-142" rx="40" ry="30"/><ellipse cx="34" cy="-112" rx="30" ry="23"/>
      <ellipse cx="-4" cy="-176" rx="28" ry="21"/>
    </g>
    <g fill="#A8C08E" opacity=".8">
      <ellipse cx="30" cy="-150" rx="22" ry="16"/><ellipse cx="6" cy="-182" rx="16" ry="12"/>
    </g>
  </g>
  <g transform="translate(192,298)">
    <ellipse cx="-28" cy="3" rx="56" ry="8" fill="#1E3F52" opacity=".2"/>
    <path d="M-5 0 q-3 -52 1 -76 h8 q4 24 1 76 Z" fill="#5E6E5A"/>
    <g fill="#728E6E">
      <ellipse cx="0" cy="-104" rx="48" ry="38"/><ellipse cx="-28" cy="-84" rx="34" ry="26"/>
      <ellipse cx="30" cy="-88" rx="34" ry="27"/>
    </g>
    <g fill="#90AC80"><ellipse cx="16" cy="-118" rx="30" ry="22"/><ellipse cx="26" cy="-92" rx="22" ry="16"/></g>
    <g fill="#AEC492" opacity=".75"><ellipse cx="24" cy="-124" rx="16" ry="11"/></g>
  </g>
</g>

{/* ══════════ 4. THE LAWN ══════════
     A mown park lawn, striped by the roller. Those stripes are depth
     lines, so every one of them runs to the same point on the horizon —
     they are the scene stating its own perspective before anything is
     put on top of it. */}
<rect y="232" width="1200" height="668" fill="url(#pk-meadow)"/>
<g mask="url(#pk-mownFade)">
<path d="M-2080 1090L-1680 1090L1602.6 276L1582.1 276Z" fill="#D2E69E" opacity=".07"/>
<path d="M-1680 1090L-1280 1090L1623.1 276L1602.6 276Z" fill="#1D4430" opacity=".08"/>
<path d="M-1280 1090L-880 1090L1643.6 276L1623.1 276Z" fill="#D2E69E" opacity=".07"/>
<path d="M-880 1090L-480 1090L1664.1 276L1643.6 276Z" fill="#1D4430" opacity=".08"/>
<path d="M-480 1090L-80 1090L1684.6 276L1664.1 276Z" fill="#D2E69E" opacity=".07"/>
<path d="M-80 1090L320 1090L1705.1 276L1684.6 276Z" fill="#1D4430" opacity=".08"/>
<path d="M320 1090L720 1090L1725.6 276L1705.1 276Z" fill="#D2E69E" opacity=".07"/>
<path d="M720 1090L1120 1090L1746.2 276L1725.6 276Z" fill="#1D4430" opacity=".08"/>
<path d="M1120 1090L1520 1090L1766.7 276L1746.2 276Z" fill="#D2E69E" opacity=".07"/>
<path d="M1520 1090L1920 1090L1787.2 276L1766.7 276Z" fill="#1D4430" opacity=".08"/>
<path d="M1920 1090L2320 1090L1807.7 276L1787.2 276Z" fill="#D2E69E" opacity=".07"/>
<path d="M2320 1090L2720 1090L1828.2 276L1807.7 276Z" fill="#1D4430" opacity=".08"/>
<path d="M2720 1090L3120 1090L1848.7 276L1828.2 276Z" fill="#D2E69E" opacity=".07"/>
</g>
<rect y="232" width="1200" height="668" fill="url(#pk-meadowSun)"/>
<rect y="232" width="1200" height="668" fill="url(#pk-meadowCool)"/>

{/* ══════════ 4b. THE PATH ══════════
     A tarmac path across the middle distance. It is here to do two jobs:
     break four hundred pixels of one green, and put a second warm colour
     into a picture that otherwise only has warmth in the sky. It runs
     ACROSS rather than away, so it does not fight the blanket for the
     vanishing point. */}
<g>
  <path d="M-40 516 C 300 486, 700 446, 1240 386 L1240 356 C 700 410, 300 442, -40 470 Z"
        fill="#B5A886"/>
  <path d="M-40 470 C 300 442, 700 410, 1240 356 l0 7 C 700 417, 300 449, -40 477 Z"
        fill="#D4C8A4"/>
  <path d="M-40 516 C 300 486, 700 446, 1240 386 l0 -8 C 700 438, 300 478, -40 508 Z"
        fill="#8E8264" opacity=".55"/>
  <path d="M-40 500 C 300 470, 700 432, 1240 372" fill="none"
        stroke="#D8CEAC" strokeOpacity=".5" strokeWidth="5"/>
  <path d="M-40 492 C 300 462, 700 424, 1240 366" fill="none"
        stroke="#A99D7C" strokeOpacity=".35" strokeWidth="3"/>
</g>

{/* ══════════ 4c. A BIN ══════════
     Thirty metres from the picnic, which is the joke. */}
<g transform="translate(296,456)">
  <ellipse cx="-60" cy="4" rx="82" ry="11" fill="url(#pk-shadow)" filter="url(#pk-softSm)"/>
  <path d="M-32 0 q-5 -92 2 -108 h60 q7 16 2 108 Z" fill="#2E5E4A"/>
  <path d="M-32 0 q-5 -92 2 -108 h17 q-6 20 -3 108 Z" fill="#4A8068" opacity=".85"/>
  <path d="M20 -108 h8 q7 16 2 108 h-16 q5 -90 6 -108 Z" fill="#1E4434" opacity=".7"/>
  <path d="M-36 -108 h72 q4 0 4 7 h-80 q0 -7 4 -7 Z" fill="#234E3C"/>
  <path d="M-36 -118 h72 q6 0 6 8 q0 4 -6 4 h-72 q-6 0 -6 -4 q0 -8 6 -8 Z" fill="#37705A"/>
  <path d="M-36 -118 h72 q6 0 6 8 q-42 -6 -84 1 q0 -9 6 -9 Z" fill="#5E9A82" opacity=".8"/>
  <path d="M-20 -116 h40 v5 h-40 Z" fill="#12261E"/>
  <path d="M-30 -74 h56 v5 h-56 Z M-30 -52 h56 v5 h-56 Z" fill="#12281F" opacity=".35"/>
</g>

{/* ══════════ 4d. WHOEVER THE KITE BELONGS TO ══════════
     At this distance a person is eighty-two pixels, so their head comes
     out ABOVE the horizon — which is correct, and is the thing that
     proves where the camera is standing: the lens is 1.43m up and they
     are 1.7m tall. Backlit, because the sun is behind them. */}
<g>
  <g transform="translate(452,306)">
    <ellipse cx="-42" cy="3" rx="44" ry="6" fill="#1E3F52" opacity=".3"/>
    <path d="M-7 0 l-3 -30 l7 -1 l4 31 Z M7 0 l4 -31 l7 1 l-4 30 Z" fill="#2E4038"/>
    <path d="M-11 -30 q11 -4 22 0 l-2 -32 q-9 3 -18 0 Z" fill="#3A5246"/>
    <path d="M-9 -62 q9 3 18 0 l-1 -14 q-8 3 -16 0 Z" fill="#B23A2E"/>
    <path d="M-10 -62 q9 3 18 0 l0 -6 q-9 3 -18 0 Z" fill="#E4685C" opacity=".6"/>
    <path d="M8 -74 q10 4 16 14" fill="none" stroke="#3A5246" strokeWidth="5" strokeLinecap="round"/>
    <path d="M-9 -74 q-8 6 -10 16" fill="none" stroke="#3A5246" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="0" cy="-81" r="7.5" fill="#4E3A2A"/>
    <path d="M4 -86 q6 2 6 7 q-1 5 -5 6 Z" fill="#8E6A46" opacity=".7"/>
  </g>
  <g transform="translate(496,302)">
    <ellipse cx="-38" cy="3" rx="40" ry="6" fill="#1E3F52" opacity=".28"/>
    <path d="M-6 0 l-4 -28 l6 -1 l5 29 Z M8 0 l3 -29 l6 1 l-3 28 Z" fill="#2E4038"/>
    <path d="M-10 -28 q11 -4 21 0 l-3 -30 q-8 3 -16 0 Z" fill="#2E5E8E"/>
    <path d="M-10 -28 q6 -2 11 -2 l-2 -30 q-4 1 -7 0 Z" fill="#4C84BA" opacity=".7"/>
    <path d="M-8 -58 q8 3 16 0 l-1 -13 q-7 3 -14 0 Z" fill="#E8D2A8"/>
    <path d="M9 -70 q9 8 9 18" fill="none" stroke="#2E5E8E" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="0" cy="-77" r="7" fill="#2E2018"/>
  </g>
  <g transform="translate(556,314)">
    <ellipse cx="-26" cy="2" rx="30" ry="5" fill="#1E3F52" opacity=".26"/>
    <path d="M-16 0 l-1 -12 l5 0 l1 12 Z M-4 0 l-1 -12 l5 0 l1 12 Z
             M10 0 l-1 -13 l5 0 l1 13 Z M19 0 l-1 -13 l5 0 l1 13 Z" fill="#4E3A26"/>
    <path d="M-19 -12 q20 -9 40 -1 q4 9 -2 13 q-20 6 -38 0 q-5 -5 0 -12 Z" fill="#6E5236"/>
    <path d="M-19 -12 q20 -9 40 -1 q-20 0 -40 5 Z" fill="#8E6E48" opacity=".8"/>
    <path d="M21 -13 q10 -3 13 -10 q4 -8 -2 -10 q-7 -1 -10 6 Z" fill="#6E5236"/>
    <circle cx="30" cy="-26" r="6.5" fill="#6E5236"/>
    <path d="M34 -31 q6 1 6 6 q-1 4 -5 4 Z" fill="#8E6E48" opacity=".8"/>
    <path d="M-19 -10 q-12 -4 -14 -14" fill="none" stroke="#6E5236" strokeWidth="4" strokeLinecap="round"/>
  </g>
</g>

{/* ══════════ 5. A BENCH, MIDDLE DISTANCE ══════════
     Sized off the horizon like everything else: at this height on the
     lawn the scale is (y-232)/668 of full size, which makes a park bench
     about forty pixels tall. Guessing that number is how a scene ends up
     with furniture the wrong size for its own ground. */}
<g opacity=".95">
  <ellipse cx="150" cy="352" rx="62" ry="8" fill="url(#pk-shadow)" filter="url(#pk-softSm)"/>
  <path d="M122 318 h84 v5 h-84 Z" fill="#7E5C3A"/>
  <path d="M122 326 h84 v5 h-84 Z" fill="#8A6742"/>
  <path d="M124 334 h80 v5 h-80 Z" fill="#6E4F32"/>
  <path d="M126 342 h76 v4 h-76 Z" fill="#5E432A"/>
  <path d="M128 312 h74 v4 h-74 Z" fill="#956E46"/>
  <path d="M124 302 h78 v4 h-78 Z" fill="#8A6742"/>
  <path d="M122 300 h5 v48 h-5 Z M247 300 h5 v48 h-5 Z" fill="#3E4A44"/>
  <path d="M120 344 h12 v6 h-12 Z M242 344 h12 v6 h-12 Z" fill="#33403A"/>
</g>

{/* ══════════ 6. THE SWARD ══════════
     A dozen clumps of grass, authored once here at a unit size and then
     placed with <use>. Nothing is drawn on the open lawn: its gradient,
     the mown stripes, the tree's shadow, the dapple and the flowers were
     already carrying it, and the four thousand blades that used to sit
     underneath were 93 KB of texture nobody could see.

     What survives is the fringe along the hem of the blanket, which is
     most of what stops the cloth reading as a sticker, and a tuft at the
     foot of the tree. Those are still SAMPLED rather than placed — a
     clump of fixed real height is scaled by (y-232), which is what
     1/depth means once the horizon is fixed, and the number of them per
     unit of SCREEN falls off as (y-232)^-3, because that is how much
     ground a pixel covers up there. Scatter grass evenly instead and the
     lawn stops being a plane and becomes wallpaper. */}
<defs>
<g id="pk-tuft0"><path fill="#9FBC55" d="M-20 0Q-19 -37 -28 -59Q-15 -37 -10 0Z"/>
<path fill="#8CB04A" d="M30 0Q27 -62 1 -100Q34 -62 47 0ZM34 0Q37 -34 39 -55Q40 -34 43 0ZM-30 0Q-25 -31 -15 -50Q-22 -31 -22 0ZM20 0Q31 -61 54 -99Q37 -61 37 0Z"/>
<path fill="#77A140" d="M5 0Q1 -45 -25 -73Q6 -45 17 0ZM23 0Q22 -35 6 -56Q25 -35 33 0Z"/>
<path fill="#628F37" d="M-1 0Q-2 -37 -14 -60Q2 -37 9 0Z"/>
<path fill="#4E7B2F" d="M27 0Q24 -48 -1 -78Q29 -48 40 0Z"/></g>
<g id="pk-tuft1"><path fill="#B3C766" d="M-40 0Q-30 -44 -3 -71Q-25 -44 -28 0ZM17 0Q18 -47 11 -76Q23 -47 30 0ZM37 0Q42 -30 53 -49Q45 -30 45 0ZM27 0Q34 -52 47 -83Q40 -52 41 0Z"/>
<path fill="#9FBC55" d="M31 0Q36 -46 43 -75Q41 -46 44 0Z"/>
<path fill="#8CB04A" d="M15 0Q19 -61 18 -99Q26 -61 32 0ZM16 0Q27 -43 57 -69Q32 -43 28 0Z"/>
<path fill="#77A140" d="M-5 0Q4 -56 27 -91Q11 -56 10 0ZM-13 0Q-16 -33 -36 -53Q-12 -33 -4 0Z"/></g>
<g id="pk-tuft2"><path fill="#8CB04A" d="M-43 0Q-36 -45 -22 -72Q-31 -45 -31 0Z"/>
<path fill="#77A140" d="M-15 0Q-16 -44 -29 -72Q-11 -44 -3 0ZM-32 0Q-34 -57 -57 -91Q-28 -57 -17 0ZM-48 0Q-39 -61 -22 -98Q-33 -61 -32 0Z"/>
<path fill="#628F37" d="M2 0Q8 -45 16 -72Q13 -45 15 0Z"/>
<path fill="#4E7B2F" d="M21 0Q27 -59 36 -95Q34 -59 37 0ZM-29 0Q-32 -51 -55 -82Q-26 -51 -15 0Z"/>
<path fill="#3E6828" d="M8 0Q6 -33 -10 -54Q10 -33 18 0ZM14 0Q24 -61 45 -98Q31 -61 31 0Z"/></g>
<g id="pk-tuft3"><path fill="#B3C766" d="M-46 0Q-50 -53 -76 -86Q-44 -53 -32 0ZM26 0Q34 -46 53 -74Q39 -46 38 0Z"/>
<path fill="#8CB04A" d="M22 0Q22 -43 12 -69Q27 -43 33 0ZM27 0Q37 -54 58 -88Q43 -54 42 0Z"/>
<path fill="#77A140" d="M-36 0Q-36 -60 -50 -97Q-29 -60 -20 0ZM25 0Q24 -46 8 -75Q29 -46 38 0Z"/>
<path fill="#628F37" d="M-8 0Q-8 -42 -19 -68Q-3 -42 3 0ZM-9 0Q-6 -35 -5 -56Q-2 -35 1 0ZM29 0Q30 -31 24 -51Q33 -31 38 0Z"/></g>
<g id="pk-tuft4"><path fill="#8CB04A" d="M-37 0Q-28 -61 -10 -98Q-21 -61 -20 0Z"/>
<path fill="#77A140" d="M-23 0Q-22 -32 -27 -52Q-19 -32 -15 0ZM12 0Q12 -48 -0 -78Q17 -48 25 0Z"/>
<path fill="#628F37" d="M-5 0Q-3 -61 -10 -98Q4 -61 11 0ZM14 0Q25 -47 55 -76Q31 -47 27 0Z"/>
<path fill="#4E7B2F" d="M13 0Q10 -48 -14 -77Q15 -48 26 0Z"/>
<path fill="#3E6828" d="M-9 0Q-7 -54 -12 -86Q-1 -54 6 0ZM20 0Q23 -30 30 -49Q27 -30 28 0ZM2 0Q-2 -48 -30 -77Q3 -48 15 0Z"/></g>
<g id="pk-tuft5"><path fill="#8CB04A" d="M18 0Q21 -46 19 -75Q26 -46 31 0Z"/>
<path fill="#77A140" d="M-48 0Q-44 -44 -42 -70Q-39 -44 -36 0ZM-38 0Q-42 -41 -65 -66Q-37 -41 -27 0ZM-43 0Q-38 -53 -32 -86Q-32 -53 -29 0Z"/>
<path fill="#4E7B2F" d="M-39 0Q-36 -30 -34 -48Q-33 -30 -31 0ZM17 0Q17 -39 5 -63Q21 -39 28 0Z"/>
<path fill="#3E6828" d="M-22 0Q-16 -41 -0 -65Q-11 -41 -11 0ZM16 0Q30 -56 65 -90Q36 -56 32 0ZM3 0Q16 -56 49 -91Q22 -56 19 0Z"/></g>
<g id="pk-tuft6"><path fill="#9FBC55" d="M-8 0Q-4 -52 -2 -84Q2 -52 6 0Z"/>
<path fill="#8CB04A" d="M-7 0Q-8 -55 -23 -88Q-2 -55 8 0ZM10 0Q20 -38 45 -61Q24 -38 20 0Z"/>
<path fill="#77A140" d="M-31 0Q-24 -49 -12 -79Q-19 -49 -17 0ZM17 0Q25 -60 42 -97Q32 -60 33 0Z"/>
<path fill="#628F37" d="M-2 0Q8 -60 31 -97Q15 -60 15 0ZM24 0Q32 -55 49 -88Q38 -55 39 0ZM-23 0Q-24 -61 -46 -98Q-18 -61 -6 0ZM22 0Q22 -46 12 -74Q27 -46 34 0Z"/></g>
<g id="pk-tuft7"><path fill="#9FBC55" d="M8 0Q17 -58 34 -93Q23 -58 24 0ZM-13 0Q0 -54 37 -87Q6 -54 1 0ZM11 0Q12 -29 10 -47Q16 -29 19 0Z"/>
<path fill="#8CB04A" d="M25 0Q23 -40 4 -65Q27 -40 36 0Z"/>
<path fill="#77A140" d="M29 0Q33 -41 41 -66Q38 -41 40 0Z"/>
<path fill="#628F37" d="M19 0Q23 -47 25 -75Q28 -47 32 0ZM-15 0Q-7 -34 12 -55Q-3 -34 -5 0Z"/>
<path fill="#4E7B2F" d="M1 0Q6 -43 15 -69Q11 -43 13 0ZM-22 0Q-13 -38 8 -61Q-9 -38 -11 0Z"/></g>
<g id="pk-tuft8"><path fill="#8CB04A" d="M-36 0Q-33 -40 -32 -64Q-29 -40 -25 0ZM34 0Q29 -59 -5 -95Q35 -59 50 0ZM-1 0Q7 -58 23 -93Q14 -58 15 0Z"/>
<path fill="#77A140" d="M-40 0Q-42 -50 -59 -80Q-36 -50 -27 0Z"/>
<path fill="#628F37" d="M-21 0Q-11 -60 15 -97Q-4 -60 -5 0ZM13 0Q15 -45 12 -72Q20 -45 25 0ZM-40 0Q-37 -35 -34 -56Q-33 -35 -31 0Z"/>
<path fill="#4E7B2F" d="M30 0Q33 -34 39 -55Q37 -34 39 0ZM8 0Q6 -30 -8 -48Q9 -30 16 0Z"/></g>
<g id="pk-tuft9"><path fill="#77A140" d="M31 0Q41 -53 67 -85Q47 -53 45 0ZM-0 0Q1 -31 -3 -51Q4 -31 8 0ZM-11 0Q-14 -51 -37 -82Q-8 -51 3 0Z"/>
<path fill="#628F37" d="M19 0Q16 -38 -4 -61Q21 -38 30 0ZM19 0Q27 -46 45 -73Q32 -46 32 0ZM-20 0Q-21 -44 -35 -72Q-16 -44 -8 0Z"/>
<path fill="#4E7B2F" d="M-9 0Q-3 -53 6 -86Q3 -53 6 0ZM-39 0Q-39 -34 -49 -55Q-35 -34 -29 0Z"/>
<path fill="#3E6828" d="M21 0Q21 -30 12 -48Q24 -30 29 0Z"/></g>
<g id="pk-tuft10"><path fill="#8CB04A" d="M23 0Q31 -29 50 -47Q34 -29 31 0ZM-12 0Q-15 -35 -34 -56Q-11 -35 -3 0Z"/>
<path fill="#628F37" d="M-9 0Q-7 -55 -17 -88Q-1 -55 6 0ZM27 0Q32 -62 35 -99Q39 -62 44 0ZM-7 0Q-5 -32 -7 -51Q-2 -32 2 0Z"/>
<path fill="#4E7B2F" d="M12 0Q12 -51 -4 -82Q17 -51 26 0ZM2 0Q4 -35 6 -56Q8 -35 11 0ZM-46 0Q-46 -41 -58 -66Q-42 -41 -35 0Z"/>
<path fill="#3E6828" d="M27 0Q39 -47 70 -75Q44 -47 40 0Z"/></g>
<g id="pk-tuft11"><path fill="#9FBC55" d="M13 0Q28 -59 69 -96Q35 -59 30 0ZM7 0Q17 -55 42 -89Q23 -55 22 0Z"/>
<path fill="#8CB04A" d="M35 0Q42 -45 57 -72Q47 -45 47 0ZM10 0Q20 -50 43 -81Q25 -50 24 0Z"/>
<path fill="#77A140" d="M-19 0Q-24 -57 -58 -91Q-18 -57 -3 0Z"/>
<path fill="#628F37" d="M-47 0Q-32 -60 8 -96Q-26 -60 -31 0ZM-24 0Q-24 -43 -36 -70Q-19 -43 -12 0Z"/>
<path fill="#4E7B2F" d="M-34 0Q-21 -54 12 -87Q-16 -54 -19 0ZM-20 0Q-13 -50 0 -81Q-8 -50 -7 0Z"/></g>
<g id="pk-tuft12"><path fill="#B3C766" d="M-37 0Q-29 -39 -10 -63Q-25 -39 -26 0Z"/>
<path fill="#9FBC55" d="M9 0Q8 -61 -13 -99Q15 -61 26 0Z"/>
<path fill="#8CB04A" d="M-5 0Q-1 -31 5 -51Q3 -31 4 0Z"/>
<path fill="#77A140" d="M-26 0Q-29 -38 -47 -61Q-25 -38 -16 0ZM-36 0Q-36 -43 -47 -69Q-32 -43 -25 0ZM-6 0Q-3 -54 -8 -88Q3 -54 9 0Z"/>
<path fill="#628F37" d="M30 0Q33 -36 33 -58Q37 -36 40 0ZM10 0Q13 -29 18 -47Q17 -29 18 0ZM-38 0Q-40 -51 -62 -83Q-35 -51 -24 0Z"/></g>
<g id="pk-tuft13"><path fill="#8CB04A" d="M-33 0Q-36 -59 -65 -95Q-30 -59 -17 0ZM-24 0Q-19 -52 -14 -84Q-13 -52 -10 0ZM22 0Q37 -58 79 -94Q43 -58 38 0Z"/>
<path fill="#77A140" d="M-6 0Q-8 -46 -26 -74Q-3 -46 7 0Z"/>
<path fill="#628F37" d="M-37 0Q-30 -58 -19 -93Q-24 -58 -21 0ZM-42 0Q-40 -42 -44 -68Q-35 -42 -30 0Z"/>
<path fill="#4E7B2F" d="M-36 0Q-27 -46 -4 -74Q-22 -46 -23 0ZM-14 0Q-14 -44 -26 -71Q-9 -44 -2 0Z"/>
<path fill="#3E6828" d="M-37 0Q-32 -39 -24 -63Q-28 -39 -27 0Z"/></g>
</defs>
<g>
<path fill="#4F8730" d="M329.7 315.4Q330.5 312.2 330.9 310Q331.1 312.2 330.9 315.4ZM-17.5 307.8Q-16.8 305.3 -16.7 303.7Q-16.2 305.3 -16.3 307.8ZM394.5 335.7Q394.9 331.7 394.4 329.1Q395.5 331.7 395.7 335.7ZM1.3 334.4Q1.5 330.8 0.6 328.5Q2.1 330.8 2.5 334.4ZM421.9 313.8Q422.7 310.6 423.1 308.4Q423.3 310.6 423.1 313.8ZM440.5 322.2Q440.9 320.1 440.6 318.6Q441.5 320.1 441.7 322.2ZM588.8 457.4Q588.8 451.7 587.3 447.9Q589.4 451.7 590 457.4ZM438.4 351.2Q438.7 348.3 438 346.4Q439.3 348.3 439.6 351.2ZM623.5 501.5Q623.5 495.9 621.8 492.1Q624.2 495.9 625 501.5ZM549.5 333.8Q550.3 331 550.8 329.1Q550.9 331 550.7 333.8ZM1034.7 446.5Q1035.2 438.3 1034.7 432.9Q1036 438.3 1036.2 446.5ZM265.4 324.3Q265.9 320.7 265.6 318.3Q266.5 320.7 266.6 324.3ZM346.4 328.3Q347.3 325.7 348.2 323.9Q347.9 325.7 347.6 328.3ZM51.8 357.8Q52.1 353 51.4 349.7Q52.7 353 53 357.8ZM448.5 335.8Q449.2 333.2 449.6 331.4Q449.8 333.2 449.7 335.8ZM652.3 459.8Q652 452 649.8 446.8Q652.6 452 653.6 459.8ZM236.4 571Q237.3 562.6 237.1 557Q238.2 562.6 238.3 571ZM296.4 393.7Q297.4 388.9 298.2 385.7Q298 388.9 297.6 393.7ZM113.7 307.5Q114.1 305.2 113.8 303.7Q114.7 305.2 114.9 307.5ZM145.1 332.2Q145.7 329.6 145.8 327.9Q146.3 329.6 146.3 332.2ZM448.1 335.7Q448.4 331.7 448 328.9Q449 331.7 449.3 335.7ZM555.9 351.6Q556.6 347.4 556.8 344.6Q557.2 347.4 557.1 351.6ZM168.3 310.9Q168.9 308.9 169 307.5Q169.5 308.9 169.5 310.9ZM123.6 419.5Q124.6 412.6 125.7 408Q125.2 412.6 124.8 419.5ZM359.3 356.3Q359.8 351.4 359.5 348.2Q360.4 351.4 360.5 356.3ZM217.1 500.6Q217.1 495.2 215.5 491.7Q217.7 495.2 218.3 500.6ZM376.9 305.3Q377.3 303.2 376.7 301.8Q377.9 303.2 378.1 305.3ZM537 299.4Q537.6 296.7 537.7 295Q538.2 296.7 538.2 299.4ZM72 357.8Q72.7 355 73.1 353.1Q73.3 355 73.2 357.8ZM125.2 655.7Q126.4 639.5 125.9 628.7Q127.8 639.5 128 655.7ZM358.5 457.5Q358.6 453.2 357.4 450.3Q359.2 453.2 359.7 457.5ZM373.5 525.5Q372.9 513.2 369.3 505.1Q373.9 513.2 375.4 525.5ZM412.9 354.5Q413.6 351.8 413.8 350Q414.2 351.8 414.1 354.5ZM876 493.1Q875.3 482.7 871.8 475.8Q876.2 482.7 877.8 493.1ZM150.7 329.9Q151.1 326.1 150.5 323.5Q151.7 326.1 151.9 329.9ZM131 296.3Q131.6 293.4 131.5 291.5Q132.2 293.4 132.2 296.3ZM-1 346Q-0.7 342.8 -1.4 340.6Q-0.1 342.8 0.2 346ZM405.6 363.9Q406.5 360.6 407.1 358.4Q407.1 360.6 406.8 363.9ZM18.9 342.9Q19.6 340.2 19.9 338.4Q20.2 340.2 20.1 342.9ZM520.9 359.9Q521.7 354.4 522.1 350.7Q522.3 354.4 522.1 359.9ZM204.9 448.5Q206.2 438.8 207.5 432.4Q207 438.8 206.5 448.5ZM-30.4 305.3Q-29.5 302.4 -28.7 300.5Q-28.9 302.4 -29.2 305.3ZM185.7 427.1Q186.1 421.8 185.7 418.2Q186.7 421.8 186.9 427.1ZM1232.7 855.9Q1232.7 838.2 1227.4 826.5Q1235 838.2 1237.3 855.9ZM436.6 317.4Q437.3 314.7 437.6 312.9Q437.9 314.7 437.8 317.4ZM8.8 374.1Q9.3 370.4 8.9 367.9Q9.9 370.4 10 374.1ZM1141.4 516.7Q1142.7 509.7 1143.7 505Q1143.6 509.7 1143.2 516.7ZM400.7 302.3Q400.9 299.1 400 297Q401.5 299.1 401.9 302.3ZM277.8 321.1Q278.2 318.1 277.5 316.2Q278.8 318.1 279 321.1ZM377.6 465Q377.8 457.7 376.8 452.8Q378.5 457.7 379 465ZM124.9 535.2Q128.1 521.4 132.8 512.2Q129.2 521.4 127.1 535.2ZM947 592.1Q948.2 579.1 948.5 570.5Q949.3 579.1 949.2 592.1Z"/>
<path fill="#FFFDF4" d="M329 310A2 1 0 1 0 333 310A2 1 0 1 0 329 310ZM-18 304A2 1 0 1 0 -15 304A2 1 0 1 0 -18 304ZM392 329A2 2 0 1 0 397 329A2 2 0 1 0 392 329ZM1030 433A5 4 0 1 0 1039 433A5 4 0 1 0 1030 433ZM264 318A2 2 0 1 0 268 318A2 2 0 1 0 264 318ZM347 324A2 1 0 1 0 350 324A2 1 0 1 0 347 324ZM49 350A3 2 0 1 0 54 350A3 2 0 1 0 49 350ZM646 447A4 3 0 1 0 654 447A4 3 0 1 0 646 447ZM238 557A3 2 4 1 0 243 557A3 2 4 1 0 238 557ZM238 557A3 2 43 1 0 242 560A3 2 43 1 0 238 557ZM237 557A3 2 95 1 0 237 562A3 2 95 1 0 237 557ZM236 557A3 2 153 1 0 231 559A3 2 153 1 0 236 557ZM236 557A3 2 196 1 0 231 556A3 2 196 1 0 236 557ZM237 557A3 2 254 1 0 235 552A3 2 254 1 0 237 557ZM238 557A3 2 318 1 0 242 554A3 2 318 1 0 238 557ZM296 386A3 2 0 1 0 301 386A3 2 0 1 0 296 386ZM112 304A2 1 0 1 0 115 304A2 1 0 1 0 112 304ZM555 345A2 2 0 1 0 559 345A2 2 0 1 0 555 345ZM167 308A2 1 0 1 0 171 308A2 1 0 1 0 167 308ZM122 408A4 3 0 1 0 129 408A4 3 0 1 0 122 408ZM212 492A4 3 0 1 0 219 492A4 3 0 1 0 212 492ZM375 302A2 1 0 1 0 378 302A2 1 0 1 0 375 302ZM536 295A2 1 0 1 0 539 295A2 1 0 1 0 536 295ZM71 353A2 2 0 1 0 75 353A2 2 0 1 0 71 353ZM128 629A4 2 -7 1 0 135 628A4 2 -7 1 0 128 629ZM127 629A4 2 49 1 0 132 634A4 2 49 1 0 127 629ZM125 628A4 2 113 1 0 122 636A4 2 113 1 0 125 628ZM124 629A4 2 152 1 0 117 632A4 2 152 1 0 124 629ZM124 629A4 2 200 1 0 117 626A4 2 200 1 0 124 629ZM126 629A4 2 260 1 0 124 621A4 2 260 1 0 126 629ZM127 629A4 2 307 1 0 132 623A4 2 307 1 0 127 629ZM412 350A2 1 0 1 0 416 350A2 1 0 1 0 412 350ZM866 476A5 4 0 1 0 877 476A5 4 0 1 0 866 476ZM148 324A2 2 0 1 0 153 324A2 2 0 1 0 148 324ZM405 358A2 2 0 1 0 409 358A2 2 0 1 0 405 358ZM18 338A2 2 0 1 0 22 338A2 2 0 1 0 18 338ZM203 432A5 4 0 1 0 212 432A5 4 0 1 0 203 432ZM183 418A3 2 0 1 0 189 418A3 2 0 1 0 183 418ZM1230 826A6 4 7 1 0 1243 828A6 4 7 1 0 1230 826ZM1229 826A6 4 53 1 0 1237 836A6 4 53 1 0 1229 826ZM1227 826A6 4 97 1 0 1225 839A6 4 97 1 0 1227 826ZM1225 826A6 4 145 1 0 1215 834A6 4 145 1 0 1225 826ZM1225 827A6 4 200 1 0 1213 822A6 4 200 1 0 1225 827ZM1226 827A6 4 249 1 0 1222 815A6 4 249 1 0 1226 827ZM1229 827A6 4 300 1 0 1235 816A6 4 300 1 0 1229 827ZM436 313A2 1 0 1 0 439 313A2 1 0 1 0 436 313ZM7 368A2 2 0 1 0 11 368A2 2 0 1 0 7 368ZM372 453A4 3 0 1 0 381 453A4 3 0 1 0 372 453ZM134 512A3 2 -7 1 0 140 512A3 2 -7 1 0 134 512ZM134 512A3 2 50 1 0 138 517A3 2 50 1 0 134 512ZM133 512A3 2 95 1 0 132 518A3 2 95 1 0 133 512ZM132 512A3 2 164 1 0 126 514A3 2 164 1 0 132 512ZM132 512A3 2 207 1 0 126 509A3 2 207 1 0 132 512ZM133 512A3 2 265 1 0 132 506A3 2 265 1 0 133 512ZM134 512A3 2 308 1 0 138 508A3 2 308 1 0 134 512ZM950 571A3 2 -4 1 0 956 570A3 2 -4 1 0 950 571ZM949 570A3 2 61 1 0 952 576A3 2 61 1 0 949 570ZM948 570A3 2 103 1 0 947 576A3 2 103 1 0 948 570ZM947 570A3 2 144 1 0 942 574A3 2 144 1 0 947 570ZM947 571A3 2 209 1 0 942 568A3 2 209 1 0 947 571ZM948 571A3 2 268 1 0 948 564A3 2 268 1 0 948 571ZM949 571A3 2 311 1 0 954 566A3 2 311 1 0 949 571Z"/>
<path fill="#FFCD3C" d="M330 310A1 1 0 1 0 332 310A1 1 0 1 0 330 310ZM-17 304A1 1 0 1 0 -16 304A1 1 0 1 0 -17 304ZM394 329A1 1 0 1 0 395 329A1 1 0 1 0 394 329ZM1033 433A2 2 0 1 0 1036 433A2 2 0 1 0 1033 433ZM265 318A1 1 0 1 0 266 318A1 1 0 1 0 265 318ZM348 324A1 0 0 1 0 349 324A1 0 0 1 0 348 324ZM50 350A1 1 0 1 0 52 350A1 1 0 1 0 50 350ZM648 447A1 1 0 1 0 651 447A1 1 0 1 0 648 447ZM235 557A2 2 0 1 0 239 557A2 2 0 1 0 235 557ZM297 386A1 1 0 1 0 299 386A1 1 0 1 0 297 386ZM113 304A1 1 0 1 0 114 304A1 1 0 1 0 113 304ZM556 345A1 1 0 1 0 558 345A1 1 0 1 0 556 345ZM168 308A1 1 0 1 0 170 308A1 1 0 1 0 168 308ZM124 408A1 1 0 1 0 127 408A1 1 0 1 0 124 408ZM214 492A1 1 0 1 0 217 492A1 1 0 1 0 214 492ZM376 302A1 1 0 1 0 377 302A1 1 0 1 0 376 302ZM537 295A1 0 0 1 0 538 295A1 0 0 1 0 537 295ZM72 353A1 1 0 1 0 74 353A1 1 0 1 0 72 353ZM123 629A3 3 0 1 0 129 629A3 3 0 1 0 123 629ZM413 350A1 1 0 1 0 415 350A1 1 0 1 0 413 350ZM870 476A2 2 0 1 0 874 476A2 2 0 1 0 870 476ZM150 324A1 1 0 1 0 151 324A1 1 0 1 0 150 324ZM406 358A1 1 0 1 0 408 358A1 1 0 1 0 406 358ZM19 338A1 1 0 1 0 21 338A1 1 0 1 0 19 338ZM206 432A2 2 0 1 0 209 432A2 2 0 1 0 206 432ZM185 418A1 1 0 1 0 187 418A1 1 0 1 0 185 418ZM1222 826A5 5 0 1 0 1232 826A5 5 0 1 0 1222 826ZM437 313A1 1 0 1 0 438 313A1 1 0 1 0 437 313ZM8 368A1 1 0 1 0 10 368A1 1 0 1 0 8 368ZM375 453A2 1 0 1 0 378 453A2 1 0 1 0 375 453ZM130 512A2 2 0 1 0 135 512A2 2 0 1 0 130 512ZM946 571A2 2 0 1 0 951 571A2 2 0 1 0 946 571Z"/>
<path fill="#FFC730" d="M-1 328A1 1 0 1 0 2 328A1 1 0 1 0 -1 328ZM422 308A1 1 0 1 0 424 308A1 1 0 1 0 422 308ZM440 319A1 1 0 1 0 442 319A1 1 0 1 0 440 319ZM585 448A2 2 0 1 0 589 448A2 2 0 1 0 585 448ZM437 346A1 1 0 1 0 439 346A1 1 0 1 0 437 346ZM619 492A3 3 0 1 0 625 492A3 3 0 1 0 619 492ZM550 329A1 1 0 1 0 552 329A1 1 0 1 0 550 329ZM449 331A1 1 0 1 0 451 331A1 1 0 1 0 449 331ZM145 328A1 1 0 1 0 147 328A1 1 0 1 0 145 328ZM447 329A1 1 0 1 0 449 329A1 1 0 1 0 447 329ZM358 348A2 2 0 1 0 361 348A2 2 0 1 0 358 348ZM355 450A2 2 0 1 0 360 450A2 2 0 1 0 355 450ZM366 505A4 4 0 1 0 373 505A4 4 0 1 0 366 505ZM131 291A1 1 0 1 0 132 291A1 1 0 1 0 131 291ZM-3 341A2 2 0 1 0 0 341A2 2 0 1 0 -3 341ZM520 351A2 2 0 1 0 524 351A2 2 0 1 0 520 351ZM-30 301A1 1 0 1 0 -28 301A1 1 0 1 0 -30 301ZM1140 505A3 3 0 1 0 1147 505A3 3 0 1 0 1140 505ZM399 297A1 1 0 1 0 401 297A1 1 0 1 0 399 297ZM276 316A1 1 0 1 0 279 316A1 1 0 1 0 276 316Z"/>
<path fill="#FFE98A" d="M-0 328A1 1 0 1 0 1 328A1 1 0 1 0 -0 328ZM422 308A1 1 0 1 0 423 308A1 1 0 1 0 422 308ZM440 318A0 0 0 1 0 441 318A0 0 0 1 0 440 318ZM586 447A1 1 0 1 0 588 447A1 1 0 1 0 586 447ZM437 346A0 0 0 1 0 438 346A0 0 0 1 0 437 346ZM620 491A1 1 0 1 0 622 491A1 1 0 1 0 620 491ZM550 329A1 1 0 1 0 551 329A1 1 0 1 0 550 329ZM449 331A0 0 0 1 0 450 331A0 0 0 1 0 449 331ZM145 328A0 0 0 1 0 146 328A0 0 0 1 0 145 328ZM447 329A1 1 0 1 0 448 329A1 1 0 1 0 447 329ZM358 348A1 1 0 1 0 360 348A1 1 0 1 0 358 348ZM356 450A1 1 0 1 0 358 450A1 1 0 1 0 356 450ZM367 504A2 2 0 1 0 370 504A2 2 0 1 0 367 504ZM131 291A0 0 0 1 0 132 291A0 0 0 1 0 131 291ZM-3 340A1 1 0 1 0 -1 340A1 1 0 1 0 -3 340ZM521 350A1 1 0 1 0 522 350A1 1 0 1 0 521 350ZM-30 300A0 0 0 1 0 -29 300A0 0 0 1 0 -30 300ZM1141 504A2 2 0 1 0 1144 504A2 2 0 1 0 1141 504ZM399 297A0 0 0 1 0 400 297A0 0 0 1 0 399 297ZM277 316A1 1 0 1 0 278 316A1 1 0 1 0 277 316Z"/>
</g>

{/* ══════════ 7. THE TREE ══════════
     It is here to do a job: it stands between the sun and the blanket, so
     the gaps in it are what put the dapple on the cloth. Its crown is
     built in four tones — the mass in its own shade, the body, the
     sunlit crowns pulled up and to the RIGHT toward the sun, and loose
     leaves along the underside breaking the outline. A canopy with a
     smooth edge reads as broccoli. */}
<g {...prop("The tree. Click it and it lets go of a few leaves.", shedLeaves)}>
  <ellipse cx="1040" cy="498" rx="180" ry="26" fill="url(#pk-shadow)" filter="url(#pk-softMd)"/>
  <path d="M1196 496 q-8 -120 -22 -196 q-6 -34 4 -96 l72 -4 q-10 64 -6 100
           q10 84 16 196 Z" fill="url(#pk-bark)"/>
  <path d="M1174 300 q-14 -40 -46 -66 q-30 -22 -48 -26 l10 -28 q34 10 62 34
           q30 26 42 62 Z" fill="url(#pk-bark)"/>
  <path d="M1180 250 q28 -36 64 -52 l12 22 q-32 16 -54 48 Z" fill="#5E4630"/>
  <g stroke="#2A1F15" strokeOpacity=".5" strokeWidth="2" fill="none">
    <path d="M1186 480 q6 -100 -4 -168 M1206 484 q4 -96 -6 -170 M1224 470 q0 -80 -6 -150"/>
  </g>
  <g stroke="#B08A5E" strokeOpacity=".45" strokeWidth="2.4" fill="none">
    <path d="M1240 486 q2 -96 -6 -178 M1252 300 q-4 -60 -2 -96"/>
  </g>
  <g className="canopy">
<path fill="#122B0C" d="M1378 17A39 24 154 1 0 1308 51A39 24 154 1 0 1378 17ZM732 156A34 24 17 1 0 796 176A34 24 17 1 0 732 156ZM976 234A42 29 107 1 0 951 315A42 29 107 1 0 976 234ZM649 148A33 18 3 1 0 715 151A33 18 3 1 0 649 148ZM920 276A42 28 140 1 0 855 330A42 28 140 1 0 920 276ZM724 240A30 20 90 1 0 724 300A30 20 90 1 0 724 240ZM982 52A46 36 151 1 0 902 97A46 36 151 1 0 982 52ZM1048 240A23 12 138 1 0 1014 270A23 12 138 1 0 1048 240ZM671 156A15 8 123 1 0 654 182A15 8 123 1 0 671 156ZM751 154A29 22 72 1 0 769 208A29 22 72 1 0 751 154ZM935 17A35 21 56 1 0 975 75A35 21 56 1 0 935 17ZM1264 55A17 10 18 1 0 1296 66A17 10 18 1 0 1264 55ZM1074 160A36 20 92 1 0 1072 231A36 20 92 1 0 1074 160ZM771 104A26 20 0 1 0 823 104A26 20 0 1 0 771 104ZM1114 371A20 12 154 1 0 1079 388A20 12 154 1 0 1114 371ZM1195 350A20 11 139 1 0 1165 376A20 11 139 1 0 1195 350ZM817 209A15 9 115 1 0 804 237A15 9 115 1 0 817 209ZM1013 9A28 21 87 1 0 1016 65A28 21 87 1 0 1013 9ZM1125 335A34 20 41 1 0 1176 379A34 20 41 1 0 1125 335ZM946 343A37 29 35 1 0 1007 386A37 29 35 1 0 946 343ZM644 133A27 14 7 1 0 697 139A27 14 7 1 0 644 133ZM1073 275A21 16 107 1 0 1060 316A21 16 107 1 0 1073 275ZM814 178A45 24 86 1 0 820 268A45 24 86 1 0 814 178ZM912 333A43 24 3 1 0 998 337A43 24 3 1 0 912 333ZM999 222A15 8 96 1 0 996 251A15 8 96 1 0 999 222ZM896 77A28 17 132 1 0 859 118A28 17 132 1 0 896 77ZM869 287A14 7 164 1 0 841 295A14 7 164 1 0 869 287ZM953 204A34 22 131 1 0 908 255A34 22 131 1 0 953 204ZM773 259A28 17 8 1 0 829 267A28 17 8 1 0 773 259ZM896 15A25 17 162 1 0 849 30A25 17 162 1 0 896 15ZM633 182A29 15 119 1 0 604 233A29 15 119 1 0 633 182ZM620 141A16 11 179 1 0 588 142A16 11 179 1 0 620 141ZM596 146A37 25 79 1 0 610 219A37 25 79 1 0 596 146ZM753 271A14 9 87 1 0 754 299A14 9 87 1 0 753 271ZM723 141A39 27 88 1 0 726 219A39 27 88 1 0 723 141ZM1085 104A33 21 136 1 0 1038 151A33 21 136 1 0 1085 104ZM782 185A42 25 120 1 0 740 259A42 25 120 1 0 782 185ZM666 69A38 21 39 1 0 726 117A38 21 39 1 0 666 69ZM663 159A17 11 151 1 0 633 176A17 11 151 1 0 663 159ZM1150 32A22 12 81 1 0 1157 76A22 12 81 1 0 1150 32ZM1187 146A26 17 121 1 0 1161 190A26 17 121 1 0 1187 146ZM948 349A14 10 7 1 0 976 353A14 10 7 1 0 948 349ZM951 170A39 20 24 1 0 1022 202A39 20 24 1 0 951 170ZM1315 187A22 16 143 1 0 1280 213A22 16 143 1 0 1315 187ZM855 153A35 25 173 1 0 786 162A35 25 173 1 0 855 153ZM757 147A19 10 85 1 0 760 185A19 10 85 1 0 757 147ZM1238 212A24 17 94 1 0 1235 261A24 17 94 1 0 1238 212ZM966 321A41 29 40 1 0 1028 374A41 29 40 1 0 966 321ZM663 178A17 11 113 1 0 650 210A17 11 113 1 0 663 178ZM1047 155A42 30 170 1 0 964 170A42 30 170 1 0 1047 155ZM1190 197A16 12 144 1 0 1164 216A16 12 144 1 0 1190 197ZM980 188A45 35 97 1 0 969 278A45 35 97 1 0 980 188ZM770 296A14 9 7 1 0 797 299A14 9 7 1 0 770 296ZM750 221A29 15 146 1 0 702 254A29 15 146 1 0 750 221ZM1014 61A31 21 165 1 0 955 77A31 21 165 1 0 1014 61ZM1069 302A37 27 124 1 0 1028 363A37 27 124 1 0 1069 302ZM952 233A38 24 101 1 0 938 308A38 24 101 1 0 952 233ZM663 212A41 27 56 1 0 709 280A41 27 56 1 0 663 212ZM658 132A33 19 25 1 0 717 160A33 19 25 1 0 658 132ZM671 244A20 13 91 1 0 670 283A20 13 91 1 0 671 244ZM950 353A14 11 98 1 0 946 382A14 11 98 1 0 950 353ZM1134 325A19 14 83 1 0 1139 362A19 14 83 1 0 1134 325ZM650 172A17 11 147 1 0 621 191A17 11 147 1 0 650 172ZM963 273A27 14 47 1 0 999 312A27 14 47 1 0 963 273ZM1197 90A13 8 130 1 0 1179 111A13 8 130 1 0 1197 90ZM673 134A37 20 92 1 0 671 208A37 20 92 1 0 673 134ZM1051 88A42 21 114 1 0 1017 165A42 21 114 1 0 1051 88ZM808 251A42 27 39 1 0 872 304A42 27 39 1 0 808 251ZM806 65A41 23 133 1 0 750 125A41 23 133 1 0 806 65ZM1204 224A23 18 39 1 0 1240 254A23 18 39 1 0 1204 224ZM749 102A21 15 47 1 0 778 132A21 15 47 1 0 749 102ZM773 154A31 22 36 1 0 823 190A31 22 36 1 0 773 154ZM1225 126A25 18 65 1 0 1246 171A25 18 65 1 0 1225 126ZM888 253A46 34 145 1 0 813 306A46 34 145 1 0 888 253ZM1030 273A31 20 102 1 0 1017 334A31 20 102 1 0 1030 273ZM848 91A19 10 51 1 0 872 120A19 10 51 1 0 848 91ZM855 97A35 19 17 1 0 923 119A35 19 17 1 0 855 97ZM576 160A27 18 2 1 0 630 163A27 18 2 1 0 576 160ZM1231 104A28 20 73 1 0 1247 157A28 20 73 1 0 1231 104ZM685 109A39 23 15 1 0 761 130A39 23 15 1 0 685 109ZM643 127A32 19 137 1 0 595 171A32 19 137 1 0 643 127ZM1151 127A39 28 73 1 0 1174 201A39 28 73 1 0 1151 127ZM822 185A38 27 73 1 0 845 258A38 27 73 1 0 822 185ZM875 163A28 14 64 1 0 900 214A28 14 64 1 0 875 163ZM968 326A45 26 39 1 0 1037 382A45 26 39 1 0 968 326ZM616 121A26 20 116 1 0 594 168A26 20 116 1 0 616 121ZM961 6A14 9 133 1 0 942 26A14 9 133 1 0 961 6ZM925 234A38 26 2 1 0 1001 236A38 26 2 1 0 925 234ZM1088 303A31 20 174 1 0 1026 310A31 20 174 1 0 1088 303ZM1138 291A28 19 99 1 0 1129 345A28 19 99 1 0 1138 291ZM1086 247A26 20 154 1 0 1040 269A26 20 154 1 0 1086 247ZM705 218A44 27 95 1 0 698 306A44 27 95 1 0 705 218ZM989 367A29 17 167 1 0 933 380A29 17 167 1 0 989 367ZM997 212A32 22 74 1 0 1015 274A32 22 74 1 0 997 212ZM685 143A26 17 130 1 0 651 183A26 17 130 1 0 685 143ZM879 272A27 17 175 1 0 825 277A27 17 175 1 0 879 272ZM687 175A40 30 26 1 0 758 209A40 30 26 1 0 687 175ZM642 152A34 21 37 1 0 696 192A34 21 37 1 0 642 152ZM1145 192A25 13 75 1 0 1158 240A25 13 75 1 0 1145 192ZM976 350A27 19 96 1 0 970 404A27 19 96 1 0 976 350ZM945 60A21 11 161 1 0 905 74A21 11 161 1 0 945 60ZM853 259A22 15 102 1 0 844 302A22 15 102 1 0 853 259ZM1135 337A21 16 90 1 0 1134 379A21 16 90 1 0 1135 337ZM750 108A15 9 77 1 0 757 137A15 9 77 1 0 750 108ZM1022 346A22 16 164 1 0 979 358A22 16 164 1 0 1022 346ZM719 132A25 16 38 1 0 759 163A25 16 38 1 0 719 132ZM754 212A42 30 81 1 0 768 294A42 30 81 1 0 754 212ZM991 294A28 20 70 1 0 1010 346A28 20 70 1 0 991 294ZM803 79A46 27 99 1 0 789 169A46 27 99 1 0 803 79ZM747 186A16 12 14 1 0 778 194A16 12 14 1 0 747 186ZM954 69A40 25 148 1 0 886 111A40 25 148 1 0 954 69ZM1173 90A35 18 55 1 0 1213 146A35 18 55 1 0 1173 90ZM772 249A25 17 66 1 0 792 294A25 17 66 1 0 772 249ZM912 169A33 25 124 1 0 875 223A33 25 124 1 0 912 169ZM933 223A23 14 72 1 0 947 267A23 14 72 1 0 933 223ZM868 304A25 15 71 1 0 884 352A25 15 71 1 0 868 304ZM631 113A25 15 28 1 0 675 137A25 15 28 1 0 631 113ZM1067 294A38 28 51 1 0 1115 353A38 28 51 1 0 1067 294ZM1102 120A18 11 4 1 0 1139 123A18 11 4 1 0 1102 120ZM613 213A39 20 15 1 0 688 233A39 20 15 1 0 613 213ZM1001 84A34 18 134 1 0 954 133A34 18 134 1 0 1001 84ZM637 205A38 25 138 1 0 581 257A38 25 138 1 0 637 205ZM611 160A24 13 88 1 0 613 207A24 13 88 1 0 611 160ZM988 -44A27 19 120 1 0 961 2A27 19 120 1 0 988 -44ZM1192 -71A42 33 115 1 0 1156 5A42 33 115 1 0 1192 -71ZM888 299A17 13 165 1 0 856 308A17 13 165 1 0 888 299ZM669 104A25 14 37 1 0 709 134A25 14 37 1 0 669 104ZM604 174A42 27 132 1 0 548 237A42 27 132 1 0 604 174ZM859 161A19 10 83 1 0 864 198A19 10 83 1 0 859 161ZM1044 317A23 13 65 1 0 1063 359A23 13 65 1 0 1044 317ZM1099 359A33 18 33 1 0 1153 395A33 18 33 1 0 1099 359ZM990 258A44 30 170 1 0 904 274A44 30 170 1 0 990 258ZM664 233A42 32 62 1 0 704 308A42 32 62 1 0 664 233ZM682 230A41 25 39 1 0 746 282A41 25 39 1 0 682 230ZM847 21A30 20 49 1 0 886 68A30 20 49 1 0 847 21ZM1142 111A13 8 67 1 0 1153 136A13 8 67 1 0 1142 111ZM668 120A18 10 58 1 0 687 151A18 10 58 1 0 668 120ZM1172 144A17 12 112 1 0 1159 176A17 12 112 1 0 1172 144ZM884 276A38 19 148 1 0 819 317A38 19 148 1 0 884 276ZM839 60A22 15 17 1 0 881 73A22 15 17 1 0 839 60ZM1002 241A38 25 91 1 0 1000 316A38 25 91 1 0 1002 241ZM1180 -23A43 23 149 1 0 1106 22A43 23 149 1 0 1180 -23ZM819 135A29 22 174 1 0 761 142A29 22 174 1 0 819 135ZM795 248A23 15 129 1 0 766 284A23 15 129 1 0 795 248ZM1231 258A35 24 134 1 0 1182 308A35 24 134 1 0 1231 258ZM911 100A25 18 43 1 0 949 135A25 18 43 1 0 911 100ZM1196 331A41 30 129 1 0 1144 394A41 30 129 1 0 1196 331ZM1044 366A44 31 172 1 0 957 379A44 31 172 1 0 1044 366ZM607 146A19 12 20 1 0 643 159A19 12 20 1 0 607 146ZM1021 194A37 22 149 1 0 958 232A37 22 149 1 0 1021 194ZM1071 95A17 12 32 1 0 1100 113A17 12 32 1 0 1071 95ZM660 138A33 17 41 1 0 709 180A33 17 41 1 0 660 138ZM935 143A38 23 148 1 0 869 184A38 23 148 1 0 935 143ZM894 298A18 12 87 1 0 896 334A18 12 87 1 0 894 298ZM596 163A33 20 142 1 0 543 204A33 20 142 1 0 596 163ZM648 130A14 8 62 1 0 661 154A14 8 62 1 0 648 130ZM1348 136A30 21 149 1 0 1297 167A30 21 149 1 0 1348 136ZM947 309A31 18 42 1 0 993 350A31 18 42 1 0 947 309ZM958 311A37 28 93 1 0 954 384A37 28 93 1 0 958 311ZM699 112A35 25 25 1 0 762 141A35 25 25 1 0 699 112ZM934 250A24 18 65 1 0 954 293A24 18 65 1 0 934 250ZM1333 24A37 21 102 1 0 1317 96A37 21 102 1 0 1333 24ZM695 256A22 16 179 1 0 652 257A22 16 179 1 0 695 256ZM805 228A40 23 161 1 0 729 254A40 23 161 1 0 805 228ZM712 135A18 12 146 1 0 682 156A18 12 146 1 0 712 135ZM1334 79A46 35 119 1 0 1291 159A46 35 119 1 0 1334 79ZM938 125A43 29 115 1 0 901 203A43 29 115 1 0 938 125ZM1168 159A14 9 21 1 0 1194 169A14 9 21 1 0 1168 159ZM647 161A22 14 60 1 0 669 199A22 14 60 1 0 647 161ZM1143 55A26 17 18 1 0 1192 72A26 17 18 1 0 1143 55ZM1105 280A36 25 135 1 0 1054 330A36 25 135 1 0 1105 280ZM1093 246A43 30 149 1 0 1020 291A43 30 149 1 0 1093 246ZM795 55A30 20 78 1 0 808 114A30 20 78 1 0 795 55ZM1117 90A37 28 132 1 0 1067 145A37 28 132 1 0 1117 90ZM925 349A42 31 44 1 0 986 408A42 31 44 1 0 925 349ZM1212 198A45 29 19 1 0 1298 228A45 29 19 1 0 1212 198ZM665 171A44 33 180 1 0 577 171A44 33 180 1 0 665 171ZM1246 196A40 22 134 1 0 1191 253A40 22 134 1 0 1246 196ZM1162 331A30 16 159 1 0 1106 353A30 16 159 1 0 1162 331ZM1111 314A21 12 58 1 0 1133 350A21 12 58 1 0 1111 314ZM945 59A31 16 125 1 0 910 109A31 16 125 1 0 945 59ZM710 147A43 25 90 1 0 710 232A43 25 90 1 0 710 147ZM998 269A41 29 11 1 0 1080 284A41 29 11 1 0 998 269ZM838 214A29 16 158 1 0 785 236A29 16 158 1 0 838 214ZM706 295A19 14 9 1 0 744 301A19 14 9 1 0 706 295ZM879 181A45 26 76 1 0 901 268A45 26 76 1 0 879 181ZM768 121A39 24 30 1 0 834 160A39 24 30 1 0 768 121ZM979 252A22 15 90 1 0 979 296A22 15 90 1 0 979 252ZM942 155A35 26 106 1 0 922 222A35 26 106 1 0 942 155ZM765 169A19 11 24 1 0 800 185A19 11 24 1 0 765 169ZM1014 55A43 23 163 1 0 931 80A43 23 163 1 0 1014 55ZM1006 38A21 15 16 1 0 1047 50A21 15 16 1 0 1006 38ZM942 228A19 13 5 1 0 980 231A19 13 5 1 0 942 228ZM855 57A28 20 69 1 0 875 109A28 20 69 1 0 855 57ZM1010 269A39 29 58 1 0 1052 335A39 29 58 1 0 1010 269ZM1039 226A30 22 123 1 0 1007 276A30 22 123 1 0 1039 226ZM844 255A33 23 20 1 0 905 277A33 23 20 1 0 844 255ZM642 216A39 28 142 1 0 581 263A39 28 142 1 0 642 216ZM662 205A41 28 47 1 0 718 266A41 28 47 1 0 662 205ZM661 86A32 24 32 1 0 715 120A32 24 32 1 0 661 86Z"/>
<path fill="#1E4416" d="M821 24A40 25 130 1 0 770 84A40 25 130 1 0 821 24ZM1292 123A32 21 142 1 0 1242 161A32 21 142 1 0 1292 123ZM703 162A27 19 148 1 0 657 191A27 19 148 1 0 703 162ZM887 234A29 20 92 1 0 885 293A29 20 92 1 0 887 234ZM667 148A36 26 142 1 0 611 192A36 26 142 1 0 667 148ZM1186 245A36 25 172 1 0 1115 255A36 25 172 1 0 1186 245ZM767 42A46 25 82 1 0 779 133A46 25 82 1 0 767 42ZM1307 148A30 16 100 1 0 1297 207A30 16 100 1 0 1307 148ZM1000 294A14 11 137 1 0 980 313A14 11 137 1 0 1000 294ZM975 334A31 18 83 1 0 983 396A31 18 83 1 0 975 334ZM616 207A45 30 7 1 0 706 219A45 30 7 1 0 616 207ZM634 128A37 25 164 1 0 562 149A37 25 164 1 0 634 128ZM1113 297A41 32 38 1 0 1178 348A41 32 38 1 0 1113 297ZM648 116A24 13 99 1 0 641 164A24 13 99 1 0 648 116ZM757 141A33 23 85 1 0 762 206A33 23 85 1 0 757 141ZM1062 255A41 23 69 1 0 1092 333A41 23 69 1 0 1062 255ZM1066 30A44 30 93 1 0 1061 119A44 30 93 1 0 1066 30ZM928 194A34 19 19 1 0 993 216A34 19 19 1 0 928 194ZM1303 251A25 18 130 1 0 1271 289A25 18 130 1 0 1303 251ZM1046 126A26 13 159 1 0 998 145A26 13 159 1 0 1046 126ZM797 265A35 21 109 1 0 774 331A35 21 109 1 0 797 265ZM1023 275A33 17 56 1 0 1059 329A33 17 56 1 0 1023 275ZM544 190A30 20 56 1 0 577 240A30 20 56 1 0 544 190ZM1233 61A20 11 128 1 0 1209 92A20 11 128 1 0 1233 61ZM653 152A25 13 67 1 0 673 198A25 13 67 1 0 653 152ZM981 341A14 9 102 1 0 975 368A14 9 102 1 0 981 341ZM885 180A41 27 64 1 0 921 254A41 27 64 1 0 885 180ZM1051 95A21 14 16 1 0 1090 107A21 14 16 1 0 1051 95ZM619 207A29 22 51 1 0 656 252A29 22 51 1 0 619 207ZM1071 280A20 14 63 1 0 1089 315A20 14 63 1 0 1071 280ZM617 136A43 31 86 1 0 623 222A43 31 86 1 0 617 136ZM1017 110A36 18 70 1 0 1041 178A36 18 70 1 0 1017 110ZM1276 216A22 13 152 1 0 1237 236A22 13 152 1 0 1276 216ZM853 221A21 11 62 1 0 873 258A21 11 62 1 0 853 221ZM1107 216A35 19 84 1 0 1114 286A35 19 84 1 0 1107 216ZM940 367A14 10 39 1 0 962 384A14 10 39 1 0 940 367ZM926 -5A27 16 50 1 0 960 36A27 16 50 1 0 926 -5ZM1272 49A43 22 24 1 0 1351 85A43 22 24 1 0 1272 49ZM879 303A29 14 109 1 0 861 357A29 14 109 1 0 879 303ZM1075 265A21 10 98 1 0 1070 306A21 10 98 1 0 1075 265ZM636 146A41 29 14 1 0 716 167A41 29 14 1 0 636 146ZM706 235A39 23 19 1 0 781 261A39 23 19 1 0 706 235ZM1088 185A36 25 174 1 0 1017 193A36 25 174 1 0 1088 185ZM859 191A29 19 67 1 0 883 245A29 19 67 1 0 859 191ZM852 246A29 20 65 1 0 876 300A29 20 65 1 0 852 246ZM940 113A42 33 147 1 0 870 159A42 33 147 1 0 940 113ZM931 243A38 24 29 1 0 998 280A38 24 29 1 0 931 243ZM634 190A21 14 143 1 0 600 216A21 14 143 1 0 634 190ZM618 170A25 17 33 1 0 660 197A25 17 33 1 0 618 170ZM797 66A32 20 127 1 0 758 117A32 20 127 1 0 797 66ZM981 313A18 10 112 1 0 968 347A18 10 112 1 0 981 313ZM934 258A13 9 169 1 0 908 263A13 9 169 1 0 934 258ZM836 96A21 15 70 1 0 850 136A21 15 70 1 0 836 96ZM907 86A17 9 51 1 0 928 113A17 9 51 1 0 907 86ZM733 244A24 12 98 1 0 726 291A24 12 98 1 0 733 244ZM1033 285A27 20 117 1 0 1008 334A27 20 117 1 0 1033 285ZM628 180A38 30 70 1 0 654 252A38 30 70 1 0 628 180ZM665 111A18 10 19 1 0 698 123A18 10 19 1 0 665 111ZM1109 155A18 13 49 1 0 1133 182A18 13 49 1 0 1109 155ZM1152 340A22 12 87 1 0 1155 384A22 12 87 1 0 1152 340ZM1096 236A18 9 137 1 0 1069 261A18 9 137 1 0 1096 236ZM1090 63A18 13 178 1 0 1055 64A18 13 178 1 0 1090 63ZM532 205A40 24 10 1 0 610 220A40 24 10 1 0 532 205ZM665 229A21 12 52 1 0 691 263A21 12 52 1 0 665 229ZM717 163A41 28 32 1 0 786 206A41 28 32 1 0 717 163ZM1202 53A35 20 4 1 0 1272 58A35 20 4 1 0 1202 53ZM712 290A13 7 173 1 0 685 294A13 7 173 1 0 712 290ZM1122 1A21 16 89 1 0 1122 43A21 16 89 1 0 1122 1ZM908 162A38 30 18 1 0 981 186A38 30 18 1 0 908 162ZM933 323A21 16 4 1 0 975 326A21 16 4 1 0 933 323ZM1121 325A37 24 50 1 0 1168 382A37 24 50 1 0 1121 325ZM1121 208A23 12 118 1 0 1099 249A23 12 118 1 0 1121 208ZM1025 332A37 21 134 1 0 973 386A37 21 134 1 0 1025 332ZM695 261A24 13 67 1 0 714 306A24 13 67 1 0 695 261ZM801 146A30 18 58 1 0 832 196A30 18 58 1 0 801 146ZM722 238A14 8 12 1 0 749 244A14 8 12 1 0 722 238ZM1152 345A27 21 40 1 0 1194 380A27 21 40 1 0 1152 345ZM605 135A40 21 70 1 0 632 210A40 21 70 1 0 605 135ZM852 200A30 15 131 1 0 812 246A30 15 131 1 0 852 200ZM643 119A33 20 79 1 0 656 184A33 20 79 1 0 643 119ZM574 195A17 12 124 1 0 555 223A17 12 124 1 0 574 195ZM1144 99A41 26 68 1 0 1175 174A41 26 68 1 0 1144 99ZM677 243A14 10 80 1 0 682 270A14 10 80 1 0 677 243ZM1123 315A24 15 59 1 0 1148 356A24 15 59 1 0 1123 315ZM1041 123A37 29 72 1 0 1064 194A37 29 72 1 0 1041 123ZM866 22A17 9 166 1 0 833 30A17 9 166 1 0 866 22ZM855 30A30 23 12 1 0 914 42A30 23 12 1 0 855 30ZM1181 79A40 25 97 1 0 1172 158A40 25 97 1 0 1181 79ZM624 197A34 18 100 1 0 612 264A34 18 100 1 0 624 197ZM1053 273A29 15 157 1 0 999 297A29 15 157 1 0 1053 273ZM994 29A25 13 7 1 0 1044 34A25 13 7 1 0 994 29ZM1224 236A23 14 111 1 0 1208 278A23 14 111 1 0 1224 236ZM1238 4A43 22 178 1 0 1152 7A43 22 178 1 0 1238 4ZM711 81A45 34 101 1 0 695 168A45 34 101 1 0 711 81ZM606 230A36 27 170 1 0 535 242A36 27 170 1 0 606 230ZM991 326A38 21 104 1 0 972 400A38 21 104 1 0 991 326ZM1216 165A44 30 64 1 0 1254 245A44 30 64 1 0 1216 165ZM779 123A20 14 157 1 0 742 138A20 14 157 1 0 779 123ZM620 200A22 13 110 1 0 605 241A22 13 110 1 0 620 200ZM995 192A44 26 127 1 0 942 263A44 26 127 1 0 995 192ZM681 184A17 13 171 1 0 648 190A17 13 171 1 0 681 184ZM1002 -19A44 27 134 1 0 941 44A44 27 134 1 0 1002 -19ZM990 351A25 15 105 1 0 977 399A25 15 105 1 0 990 351ZM1019 251A35 20 74 1 0 1039 318A35 20 74 1 0 1019 251ZM757 44A26 15 18 1 0 806 61A26 15 18 1 0 757 44ZM1186 339A28 16 142 1 0 1142 373A28 16 142 1 0 1186 339ZM1037 155A35 21 162 1 0 970 177A35 21 162 1 0 1037 155ZM1077 28A15 8 91 1 0 1077 59A15 8 91 1 0 1077 28ZM1025 255A45 35 179 1 0 935 257A45 35 179 1 0 1025 255ZM588 157A31 16 10 1 0 649 168A31 16 10 1 0 588 157ZM1190 -7A44 28 105 1 0 1167 78A44 28 105 1 0 1190 -7ZM964 305A26 18 15 1 0 1014 319A26 18 15 1 0 964 305ZM931 118A39 29 119 1 0 892 186A39 29 119 1 0 931 118ZM1040 264A28 14 155 1 0 989 288A28 14 155 1 0 1040 264ZM1226 120A32 24 140 1 0 1178 161A32 24 140 1 0 1226 120ZM891 191A17 11 23 1 0 923 205A17 11 23 1 0 891 191ZM949 36A25 14 106 1 0 935 83A25 14 106 1 0 949 36ZM1307 98A28 18 83 1 0 1314 153A28 18 83 1 0 1307 98ZM963 50A18 12 31 1 0 993 69A18 12 31 1 0 963 50ZM897 326A45 28 2 1 0 986 329A45 28 2 1 0 897 326ZM834 35A37 23 53 1 0 879 94A37 23 53 1 0 834 35ZM1002 329A23 18 116 1 0 982 371A23 18 116 1 0 1002 329ZM1136 200A20 13 118 1 0 1117 235A20 13 118 1 0 1136 200ZM623 229A35 26 170 1 0 555 241A35 26 170 1 0 623 229ZM1175 314A16 11 48 1 0 1196 339A16 11 48 1 0 1175 314ZM963 344A27 17 65 1 0 986 394A27 17 65 1 0 963 344ZM578 211A23 15 29 1 0 618 234A23 15 29 1 0 578 211ZM603 131A20 11 67 1 0 619 168A20 11 67 1 0 603 131ZM766 266A30 20 132 1 0 725 311A30 20 132 1 0 766 266ZM1083 311A13 9 173 1 0 1057 314A13 9 173 1 0 1083 311ZM1287 225A41 23 137 1 0 1227 280A41 23 137 1 0 1287 225ZM1120 247A30 21 10 1 0 1179 257A30 21 10 1 0 1120 247ZM1044 88A40 30 116 1 0 1008 159A40 30 116 1 0 1044 88ZM1149 291A35 19 177 1 0 1078 295A35 19 177 1 0 1149 291ZM1041 220A40 29 116 1 0 1006 292A40 29 116 1 0 1041 220ZM1288 165A26 14 25 1 0 1336 187A26 14 25 1 0 1288 165ZM792 204A44 31 104 1 0 771 289A44 31 104 1 0 792 204ZM1191 2A24 16 164 1 0 1145 15A24 16 164 1 0 1191 2ZM1047 58A36 19 136 1 0 996 108A36 19 136 1 0 1047 58ZM657 163A43 30 150 1 0 583 205A43 30 150 1 0 657 163ZM1112 202A17 9 56 1 0 1131 229A17 9 56 1 0 1112 202ZM733 283A16 10 25 1 0 762 297A16 10 25 1 0 733 283ZM1009 167A26 20 167 1 0 957 179A26 20 167 1 0 1009 167ZM701 59A29 20 70 1 0 721 114A29 20 70 1 0 701 59ZM1051 316A18 12 36 1 0 1080 338A18 12 36 1 0 1051 316ZM1219 187A25 18 123 1 0 1191 230A25 18 123 1 0 1219 187ZM1131 44A25 16 86 1 0 1134 93A25 16 86 1 0 1131 44ZM635 166A21 12 131 1 0 607 197A21 12 131 1 0 635 166ZM1155 318A39 23 44 1 0 1212 372A39 23 44 1 0 1155 318ZM722 137A31 24 164 1 0 661 155A31 24 164 1 0 722 137ZM1222 116A19 13 122 1 0 1201 149A19 13 122 1 0 1222 116ZM888 258A36 24 99 1 0 877 329A36 24 99 1 0 888 258ZM716 218A45 27 54 1 0 769 291A45 27 54 1 0 716 218ZM709 140A20 13 110 1 0 696 176A20 13 110 1 0 709 140ZM966 150A19 14 66 1 0 980 184A19 14 66 1 0 966 150ZM777 272A37 21 154 1 0 711 304A37 21 154 1 0 777 272ZM1127 229A19 14 120 1 0 1109 262A19 14 120 1 0 1127 229ZM897 234A29 17 51 1 0 934 279A29 17 51 1 0 897 234ZM1109 172A26 19 98 1 0 1102 223A26 19 98 1 0 1109 172ZM817 23A37 24 119 1 0 781 88A37 24 119 1 0 817 23ZM1119 294A15 11 65 1 0 1132 321A15 11 65 1 0 1119 294ZM740 288A25 18 170 1 0 691 297A25 18 170 1 0 740 288ZM876 294A42 22 99 1 0 863 378A42 22 99 1 0 876 294ZM1157 313A15 12 18 1 0 1186 322A15 12 18 1 0 1157 313ZM1127 316A25 15 25 1 0 1172 338A25 15 25 1 0 1127 316ZM1070 101A18 13 175 1 0 1035 104A18 13 175 1 0 1070 101ZM858 264A35 19 125 1 0 818 322A35 19 125 1 0 858 264ZM953 312A36 22 87 1 0 956 384A36 22 87 1 0 953 312ZM957 37A44 33 16 1 0 1041 61A44 33 16 1 0 957 37ZM917 242A22 12 97 1 0 911 285A22 12 97 1 0 917 242ZM904 25A14 9 106 1 0 897 51A14 9 106 1 0 904 25ZM1082 263A44 23 93 1 0 1077 351A44 23 93 1 0 1082 263ZM1260 195A23 18 75 1 0 1272 239A23 18 75 1 0 1260 195ZM904 18A30 20 136 1 0 861 60A30 20 136 1 0 904 18ZM1070 42A39 30 150 1 0 1002 82A39 30 150 1 0 1070 42ZM573 208A26 19 44 1 0 611 243A26 19 44 1 0 573 208ZM1089 108A24 17 82 1 0 1096 156A24 17 82 1 0 1089 108ZM741 150A20 11 81 1 0 747 189A20 11 81 1 0 741 150ZM690 136A21 14 47 1 0 719 167A21 14 47 1 0 690 136ZM822 283A14 8 12 1 0 849 288A14 8 12 1 0 822 283ZM856 297A35 25 97 1 0 847 367A35 25 97 1 0 856 297ZM978 -18A28 14 100 1 0 969 36A28 14 100 1 0 978 -18ZM798 70A43 33 70 1 0 828 151A43 33 70 1 0 798 70ZM770 96A21 16 37 1 0 803 121A21 16 37 1 0 770 96ZM845 203A15 12 164 1 0 816 211A15 12 164 1 0 845 203ZM1080 170A15 11 26 1 0 1108 183A15 11 26 1 0 1080 170ZM750 151A20 12 25 1 0 787 168A20 12 25 1 0 750 151ZM854 106A44 24 24 1 0 934 143A44 24 24 1 0 854 106ZM731 110A44 28 67 1 0 766 192A44 28 67 1 0 731 110ZM1017 78A42 32 131 1 0 962 141A42 32 131 1 0 1017 78ZM1265 191A32 19 94 1 0 1261 255A32 19 94 1 0 1265 191ZM1073 328A22 11 118 1 0 1053 367A22 11 118 1 0 1073 328ZM1202 83A38 29 91 1 0 1201 159A38 29 91 1 0 1202 83ZM924 149A16 10 161 1 0 893 160A16 10 161 1 0 924 149ZM906 332A41 26 34 1 0 973 378A41 26 34 1 0 906 332ZM985 289A38 23 9 1 0 1060 301A38 23 9 1 0 985 289ZM850 178A40 31 4 1 0 930 185A40 31 4 1 0 850 178ZM591 164A35 22 33 1 0 649 201A35 22 33 1 0 591 164ZM1206 174A24 18 101 1 0 1197 222A24 18 101 1 0 1206 174ZM1014 328A18 10 104 1 0 1005 364A18 10 104 1 0 1014 328ZM972 353A28 17 164 1 0 918 368A28 17 164 1 0 972 353ZM660 100A42 29 84 1 0 668 185A42 29 84 1 0 660 100ZM725 254A19 13 42 1 0 753 279A19 13 42 1 0 725 254ZM1083 333A24 16 114 1 0 1063 377A24 16 114 1 0 1083 333ZM1036 138A29 22 93 1 0 1033 197A29 22 93 1 0 1036 138ZM648 118A26 17 152 1 0 601 142A26 17 152 1 0 648 118ZM1113 309A29 19 115 1 0 1087 362A29 19 115 1 0 1113 309ZM1078 162A16 11 42 1 0 1101 183A16 11 42 1 0 1078 162ZM637 98A43 27 77 1 0 657 181A43 27 77 1 0 637 98ZM702 237A41 22 57 1 0 747 306A41 22 57 1 0 702 237ZM813 265A34 24 80 1 0 824 333A34 24 80 1 0 813 265ZM1028 195A36 26 128 1 0 984 251A36 26 128 1 0 1028 195ZM900 177A40 23 44 1 0 957 233A40 23 44 1 0 900 177ZM1268 35A29 19 122 1 0 1238 84A29 19 122 1 0 1268 35ZM661 139A15 10 20 1 0 690 150A15 10 20 1 0 661 139Z"/>
    {/* limbs showing through the gaps, and three holes of sky */}
    <g fill="none" stroke="#2A2014" strokeLinecap="round" opacity=".85">
      <path d="M1196 330 q-52 -46 -96 -62 q-46 -16 -84 -14" strokeWidth="11"/>
      <path d="M1186 268 q-64 -30 -122 -30 q-52 0 -92 16" strokeWidth="12"/>
      <path d="M1176 214 q-58 -26 -110 -22 q-44 4 -78 22" strokeWidth="10"/>
      <path d="M1100 268 q-30 -40 -74 -56 q-38 -14 -70 -12" strokeWidth="8"/>
      <path d="M1064 238 q-44 6 -80 30" strokeWidth="7"/>
      <path d="M1016 254 q-36 -26 -78 -30" strokeWidth="6.5"/>
      <path d="M978 224 q-40 4 -70 26" strokeWidth="5.5"/>
    </g>
    <g fill="none" stroke="#7E6440" strokeOpacity=".5" strokeLinecap="round">
      <path d="M1196 326 q-50 -44 -94 -60" strokeWidth="5"/>
      <path d="M1186 264 q-62 -28 -118 -28" strokeWidth="4"/>
      <path d="M1100 264 q-28 -36 -70 -52" strokeWidth="3"/>
    </g>
    <g fill="url(#pk-skyHole)">
      <ellipse cx="1004" cy="180" rx="34" ry="22" transform="rotate(-18 1004 180)"/>
      <ellipse cx="864" cy="214" rx="26" ry="17" transform="rotate(12 864 214)"/>
      <ellipse cx="1136" cy="226" rx="22" ry="15" transform="rotate(-8 1136 226)"/>
      <ellipse cx="946" cy="128" rx="20" ry="13" transform="rotate(24 946 128)"/>
    </g>
    {/* and the sunlit foliage in front of all of it, which is what turns
         the limbs into glimpses rather than a branch lying on the tree */}
<path fill="#33661F" d="M990 173A16 11 136 1 0 967 194A16 11 136 1 0 990 173ZM981 274A29 18 73 1 0 997 330A29 18 73 1 0 981 274ZM692 80A26 20 115 1 0 670 128A26 20 115 1 0 692 80ZM1052 297A12 9 90 1 0 1052 321A12 9 90 1 0 1052 297ZM731 185A14 8 78 1 0 737 212A14 8 78 1 0 731 185ZM1302 114A28 20 170 1 0 1246 124A28 20 170 1 0 1302 114ZM818 223A11 7 105 1 0 812 245A11 7 105 1 0 818 223ZM1016 175A20 11 94 1 0 1014 214A20 11 94 1 0 1016 175ZM1083 255A30 15 136 1 0 1040 296A30 15 136 1 0 1083 255ZM895 266A26 15 59 1 0 923 312A26 15 59 1 0 895 266ZM1007 83A19 14 154 1 0 973 99A19 14 154 1 0 1007 83ZM739 249A17 11 173 1 0 706 253A17 11 173 1 0 739 249ZM917 114A22 15 146 1 0 881 139A22 15 146 1 0 917 114ZM931 238A25 20 95 1 0 927 289A25 20 95 1 0 931 238ZM826 138A27 15 174 1 0 771 143A27 15 174 1 0 826 138ZM1167 258A31 21 127 1 0 1129 308A31 21 127 1 0 1167 258ZM1361 88A36 20 45 1 0 1412 140A36 20 45 1 0 1361 88ZM1244 139A23 16 156 1 0 1202 158A23 16 156 1 0 1244 139ZM587 172A17 13 43 1 0 612 196A17 13 43 1 0 587 172ZM1005 301A26 15 103 1 0 994 351A26 15 103 1 0 1005 301ZM664 123A21 13 19 1 0 704 137A21 13 19 1 0 664 123ZM783 130A27 16 177 1 0 730 133A27 16 177 1 0 783 130ZM972 80A33 23 104 1 0 956 145A33 23 104 1 0 972 80ZM677 112A12 6 48 1 0 693 129A12 6 48 1 0 677 112ZM758 103A23 13 112 1 0 741 145A23 13 112 1 0 758 103ZM672 153A13 9 113 1 0 662 177A13 9 113 1 0 672 153ZM748 225A35 27 141 1 0 693 268A35 27 141 1 0 748 225ZM687 109A17 9 109 1 0 676 140A17 9 109 1 0 687 109ZM974 288A22 15 41 1 0 1008 317A22 15 41 1 0 974 288ZM930 19A20 14 3 1 0 969 21A20 14 3 1 0 930 19ZM636 196A13 8 155 1 0 612 207A13 8 155 1 0 636 196ZM992 170A35 18 105 1 0 974 239A35 18 105 1 0 992 170ZM813 64A27 19 137 1 0 774 100A27 19 137 1 0 813 64ZM1160 196A30 20 98 1 0 1152 255A30 20 98 1 0 1160 196ZM1249 129A19 14 171 1 0 1211 135A19 14 171 1 0 1249 129ZM1129 131A36 22 166 1 0 1058 148A36 22 166 1 0 1129 131ZM995 234A32 20 26 1 0 1054 262A32 20 26 1 0 995 234ZM1009 325A26 16 4 1 0 1060 329A26 16 4 1 0 1009 325ZM916 233A13 7 125 1 0 901 254A13 7 125 1 0 916 233ZM1226 188A18 11 97 1 0 1222 223A18 11 97 1 0 1226 188ZM1063 25A22 16 113 1 0 1047 65A22 16 113 1 0 1063 25ZM1020 325A14 7 143 1 0 998 342A14 7 143 1 0 1020 325ZM796 116A29 15 147 1 0 747 148A29 15 147 1 0 796 116ZM860 247A30 18 158 1 0 805 269A30 18 158 1 0 860 247ZM811 68A11 9 142 1 0 793 82A11 9 142 1 0 811 68ZM896 155A17 9 112 1 0 884 186A17 9 112 1 0 896 155ZM813 3A32 24 32 1 0 868 36A32 24 32 1 0 813 3ZM929 104A15 9 127 1 0 911 128A15 9 127 1 0 929 104ZM746 74A34 21 11 1 0 812 87A34 21 11 1 0 746 74ZM1066 245A29 15 151 1 0 1014 274A29 15 151 1 0 1066 245ZM765 227A19 13 137 1 0 737 253A19 13 137 1 0 765 227ZM981 243A12 7 4 1 0 1005 245A12 7 4 1 0 981 243ZM1003 310A29 20 58 1 0 1033 359A29 20 58 1 0 1003 310ZM1280 46A11 6 1 1 0 1302 46A11 6 1 1 0 1280 46ZM929 201A21 13 31 1 0 964 223A21 13 31 1 0 929 201ZM906 159A23 15 56 1 0 932 198A23 15 56 1 0 906 159ZM1042 287A30 17 147 1 0 992 320A30 17 147 1 0 1042 287ZM1153 225A25 16 142 1 0 1113 256A25 16 142 1 0 1153 225ZM698 183A21 14 7 1 0 740 189A21 14 7 1 0 698 183ZM1289 90A34 25 123 1 0 1251 147A34 25 123 1 0 1289 90ZM1215 189A21 14 158 1 0 1175 205A21 14 158 1 0 1215 189ZM802 76A37 24 93 1 0 799 150A37 24 93 1 0 802 76ZM991 193A20 16 96 1 0 987 233A20 16 96 1 0 991 193ZM998 97A21 14 20 1 0 1038 112A21 14 20 1 0 998 97ZM758 235A27 17 10 1 0 810 244A27 17 10 1 0 758 235ZM943 160A17 11 168 1 0 910 167A17 11 168 1 0 943 160ZM725 213A36 24 2 1 0 796 216A36 24 2 1 0 725 213ZM771 85A19 10 160 1 0 735 98A19 10 160 1 0 771 85ZM952 276A18 13 130 1 0 929 304A18 13 130 1 0 952 276ZM848 126A32 17 36 1 0 900 165A32 17 36 1 0 848 126ZM1159 -53A28 22 145 1 0 1113 -21A28 22 145 1 0 1159 -53ZM857 156A11 7 156 1 0 837 165A11 7 156 1 0 857 156ZM883 230A17 12 33 1 0 912 249A17 12 33 1 0 883 230ZM1014 247A27 15 36 1 0 1058 278A27 15 36 1 0 1014 247ZM1091 39A17 10 152 1 0 1061 55A17 10 152 1 0 1091 39ZM1087 71A28 17 129 1 0 1052 114A28 17 129 1 0 1087 71ZM1067 252A27 14 46 1 0 1104 290A27 14 46 1 0 1067 252ZM1070 107A21 12 27 1 0 1107 126A21 12 27 1 0 1070 107ZM1134 267A16 8 118 1 0 1118 296A16 8 118 1 0 1134 267ZM1130 263A24 12 98 1 0 1124 310A24 12 98 1 0 1130 263ZM1280 177A17 10 68 1 0 1292 208A17 10 68 1 0 1280 177ZM853 84A12 9 27 1 0 875 95A12 9 27 1 0 853 84ZM782 96A17 12 26 1 0 813 111A17 12 26 1 0 782 96ZM1290 157A37 27 107 1 0 1269 228A37 27 107 1 0 1290 157ZM726 168A14 8 115 1 0 714 193A14 8 115 1 0 726 168ZM918 136A32 20 68 1 0 942 195A32 20 68 1 0 918 136ZM893 273A19 15 5 1 0 931 277A19 15 5 1 0 893 273ZM835 190A32 24 52 1 0 874 241A32 24 52 1 0 835 190ZM967 179A21 15 67 1 0 983 218A21 15 67 1 0 967 179ZM1006 79A18 11 135 1 0 980 105A18 11 135 1 0 1006 79ZM951 17A16 10 154 1 0 923 31A16 10 154 1 0 951 17ZM1158 204A31 23 65 1 0 1183 260A31 23 65 1 0 1158 204ZM973 276A34 26 50 1 0 1018 329A34 26 50 1 0 973 276ZM746 90A37 20 73 1 0 768 160A37 20 73 1 0 746 90ZM1201 297A28 18 104 1 0 1187 352A28 18 104 1 0 1201 297ZM770 125A16 10 154 1 0 741 139A16 10 154 1 0 770 125ZM1164 111A29 16 153 1 0 1112 138A29 16 153 1 0 1164 111ZM759 100A31 16 124 1 0 725 151A31 16 124 1 0 759 100ZM792 181A24 12 78 1 0 802 228A24 12 78 1 0 792 181ZM748 120A23 15 121 1 0 724 160A23 15 121 1 0 748 120ZM1061 208A19 14 83 1 0 1066 246A19 14 83 1 0 1061 208ZM1042 308A37 21 111 1 0 1016 376A37 21 111 1 0 1042 308ZM809 86A34 22 35 1 0 864 124A34 22 35 1 0 809 86ZM1217 225A13 7 83 1 0 1221 252A13 7 83 1 0 1217 225ZM1028 121A34 20 20 1 0 1091 144A34 20 20 1 0 1028 121ZM1076 54A27 20 29 1 0 1122 79A27 20 29 1 0 1076 54ZM1217 267A33 20 22 1 0 1278 291A33 20 22 1 0 1217 267ZM1263 186A26 20 122 1 0 1235 231A26 20 122 1 0 1263 186ZM782 259A28 18 2 1 0 837 260A28 18 2 1 0 782 259ZM1047 217A35 19 48 1 0 1094 269A35 19 48 1 0 1047 217ZM790 241A29 23 143 1 0 744 276A29 23 143 1 0 790 241ZM1025 222A22 13 173 1 0 981 227A22 13 173 1 0 1025 222ZM1061 241A34 18 21 1 0 1124 265A34 18 21 1 0 1061 241ZM643 88A36 23 102 1 0 627 159A36 23 102 1 0 643 88ZM881 37A23 13 66 1 0 899 78A23 13 66 1 0 881 37ZM761 94A15 8 29 1 0 788 109A15 8 29 1 0 761 94ZM1042 47A12 9 38 1 0 1062 63A12 9 38 1 0 1042 47ZM1338 143A18 9 127 1 0 1316 172A18 9 127 1 0 1338 143ZM643 161A12 8 85 1 0 645 184A12 8 85 1 0 643 161ZM792 56A15 10 55 1 0 810 82A15 10 55 1 0 792 56ZM663 207A13 10 171 1 0 638 211A13 10 171 1 0 663 207ZM1035 326A22 17 175 1 0 991 330A22 17 175 1 0 1035 326ZM897 286A25 16 51 1 0 928 324A25 16 51 1 0 897 286ZM824 120A15 11 137 1 0 802 141A15 11 137 1 0 824 120ZM762 186A36 20 11 1 0 833 200A36 20 11 1 0 762 186ZM940 252A33 21 116 1 0 911 311A33 21 116 1 0 940 252ZM1193 247A17 11 45 1 0 1217 271A17 11 45 1 0 1193 247ZM1027 -39A27 20 110 1 0 1009 12A27 20 110 1 0 1027 -39ZM601 179A21 13 66 1 0 618 217A21 13 66 1 0 601 179ZM1071 191A34 24 122 1 0 1036 248A34 24 122 1 0 1071 191ZM886 229A17 10 18 1 0 919 240A17 10 18 1 0 886 229ZM882 117A21 11 26 1 0 920 135A21 11 26 1 0 882 117ZM907 256A18 13 41 1 0 933 279A18 13 41 1 0 907 256ZM997 56A16 9 76 1 0 1004 88A16 9 76 1 0 997 56ZM1079 222A16 11 140 1 0 1053 243A16 11 140 1 0 1079 222ZM1055 273A13 9 109 1 0 1047 297A13 9 109 1 0 1055 273ZM1151 109A24 14 93 1 0 1149 157A24 14 93 1 0 1151 109ZM1231 140A20 15 156 1 0 1194 156A20 15 156 1 0 1231 140ZM1189 297A28 15 118 1 0 1163 346A28 15 118 1 0 1189 297ZM939 271A15 12 104 1 0 931 300A15 12 104 1 0 939 271ZM1035 175A28 18 140 1 0 992 211A28 18 140 1 0 1035 175ZM1034 136A22 14 128 1 0 1007 170A22 14 128 1 0 1034 136ZM948 296A33 17 26 1 0 1007 326A33 17 26 1 0 948 296ZM1285 64A32 17 25 1 0 1343 91A32 17 25 1 0 1285 64ZM845 114A32 19 152 1 0 789 144A32 19 152 1 0 845 114ZM663 181A13 10 12 1 0 688 187A13 10 12 1 0 663 181ZM1023 107A31 17 59 1 0 1055 161A31 17 59 1 0 1023 107ZM766 95A12 8 99 1 0 763 119A12 8 99 1 0 766 95ZM1045 340A26 13 178 1 0 992 342A26 13 178 1 0 1045 340ZM671 93A29 18 127 1 0 637 139A29 18 127 1 0 671 93ZM1061 252A14 8 42 1 0 1081 271A14 8 42 1 0 1061 252ZM1083 1A14 8 43 1 0 1103 21A14 8 43 1 0 1083 1ZM740 201A23 15 67 1 0 759 244A23 15 67 1 0 740 201ZM1189 53A34 27 126 1 0 1149 109A34 27 126 1 0 1189 53ZM903 61A20 10 14 1 0 943 71A20 10 14 1 0 903 61ZM615 157A20 11 40 1 0 646 183A20 11 40 1 0 615 157ZM947 106A27 20 69 1 0 966 155A27 20 69 1 0 947 106ZM860 162A23 16 34 1 0 898 187A23 16 34 1 0 860 162ZM1077 63A23 12 151 1 0 1036 86A23 12 151 1 0 1077 63ZM1137 149A23 17 47 1 0 1168 184A23 17 47 1 0 1137 149ZM1071 -8A37 28 31 1 0 1134 30A37 28 31 1 0 1071 -8ZM834 246A14 8 80 1 0 839 273A14 8 80 1 0 834 246ZM1143 254A35 26 92 1 0 1141 324A35 26 92 1 0 1143 254ZM1161 230A32 20 14 1 0 1224 245A32 20 14 1 0 1161 230ZM639 171A30 18 41 1 0 685 211A30 18 41 1 0 639 171ZM1065 -5A18 10 167 1 0 1030 3A18 10 167 1 0 1065 -5ZM743 216A29 17 88 1 0 744 274A29 17 88 1 0 743 216ZM689 137A11 8 28 1 0 709 147A11 8 28 1 0 689 137ZM770 156A11 8 65 1 0 779 176A11 8 65 1 0 770 156ZM1255 65A22 13 150 1 0 1217 87A22 13 150 1 0 1255 65ZM1095 285A18 11 174 1 0 1059 288A18 11 174 1 0 1095 285ZM861 2A25 17 95 1 0 857 53A25 17 95 1 0 861 2ZM1314 65A25 17 160 1 0 1266 83A25 17 160 1 0 1314 65ZM992 289A36 20 101 1 0 978 360A36 20 101 1 0 992 289ZM941 24A14 9 148 1 0 918 39A14 9 148 1 0 941 24ZM686 165A31 23 140 1 0 640 204A31 23 140 1 0 686 165ZM1163 149A23 18 106 1 0 1150 194A23 18 106 1 0 1163 149ZM942 267A17 10 104 1 0 933 301A17 10 104 1 0 942 267ZM697 106A23 13 121 1 0 674 145A23 13 121 1 0 697 106ZM981 139A25 16 24 1 0 1026 159A25 16 24 1 0 981 139ZM992 163A35 26 41 1 0 1045 209A35 26 41 1 0 992 163ZM760 184A24 17 118 1 0 737 226A24 17 118 1 0 760 184ZM954 203A13 7 132 1 0 936 222A13 7 132 1 0 954 203ZM1219 119A14 7 157 1 0 1193 130A14 7 157 1 0 1219 119ZM774 222A37 26 85 1 0 781 296A37 26 85 1 0 774 222ZM1213 179A18 12 119 1 0 1195 210A18 12 119 1 0 1213 179ZM805 202A18 14 31 1 0 835 220A18 14 31 1 0 805 202ZM1110 59A33 25 148 1 0 1053 94A33 25 148 1 0 1110 59ZM1096 265A36 25 11 1 0 1166 278A36 25 11 1 0 1096 265ZM728 138A24 18 178 1 0 680 139A24 18 178 1 0 728 138ZM1293 51A19 12 11 1 0 1331 58A19 12 11 1 0 1293 51ZM1073 -11A30 18 170 1 0 1014 0A30 18 170 1 0 1073 -11ZM800 70A25 14 1 1 0 851 70A25 14 1 1 0 800 70ZM717 109A14 11 148 1 0 692 125A14 11 148 1 0 717 109ZM1196 278A11 8 110 1 0 1188 299A11 8 110 1 0 1196 278Z"/>
<path fill="#5B972C" d="M975 143A20 10 120 1 0 955 177A20 10 120 1 0 975 143ZM1306 68A12 8 87 1 0 1307 92A12 8 87 1 0 1306 68ZM1095 -7A37 24 3 1 0 1170 -4A37 24 3 1 0 1095 -7ZM1007 279A33 20 11 1 0 1072 292A33 20 11 1 0 1007 279ZM854 158A27 20 139 1 0 814 193A27 20 139 1 0 854 158ZM768 60A21 11 59 1 0 790 97A21 11 59 1 0 768 60ZM1297 216A19 10 158 1 0 1262 230A19 10 158 1 0 1297 216ZM1181 276A14 9 76 1 0 1187 304A14 9 76 1 0 1181 276ZM1209 161A16 10 41 1 0 1233 182A16 10 41 1 0 1209 161ZM1148 11A29 17 154 1 0 1095 37A29 17 154 1 0 1148 11ZM1038 294A12 7 51 1 0 1054 314A12 7 51 1 0 1038 294ZM1043 284A21 12 45 1 0 1073 313A21 12 45 1 0 1043 284ZM1061 -8A32 17 102 1 0 1047 54A32 17 102 1 0 1061 -8ZM1052 293A21 12 174 1 0 1011 298A21 12 174 1 0 1052 293ZM1315 105A13 9 47 1 0 1332 123A13 9 47 1 0 1315 105ZM849 87A22 16 176 1 0 804 90A22 16 176 1 0 849 87ZM840 191A36 20 148 1 0 780 228A36 20 148 1 0 840 191ZM1046 -39A24 15 124 1 0 1020 1A24 15 124 1 0 1046 -39ZM749 103A11 8 11 1 0 770 107A11 8 11 1 0 749 103ZM1112 201A23 13 117 1 0 1091 241A23 13 117 1 0 1112 201ZM1264 -7A14 10 126 1 0 1248 16A14 10 126 1 0 1264 -7ZM866 164A14 9 150 1 0 841 178A14 9 150 1 0 866 164ZM967 148A13 8 37 1 0 988 164A13 8 37 1 0 967 148ZM1206 5A38 27 88 1 0 1209 80A38 27 88 1 0 1206 5ZM1114 241A27 18 172 1 0 1060 248A27 18 172 1 0 1114 241ZM976 180A11 8 29 1 0 996 190A11 8 29 1 0 976 180ZM1203 263A36 21 149 1 0 1141 301A36 21 149 1 0 1203 263ZM768 196A20 14 93 1 0 766 236A20 14 93 1 0 768 196ZM778 91A29 21 131 1 0 740 135A29 21 131 1 0 778 91ZM738 136A24 13 39 1 0 775 166A24 13 39 1 0 738 136ZM1086 216A35 18 53 1 0 1129 273A35 18 53 1 0 1086 216ZM1320 114A34 25 8 1 0 1388 124A34 25 8 1 0 1320 114ZM672 159A17 10 54 1 0 692 186A17 10 54 1 0 672 159ZM868 25A18 13 44 1 0 894 49A18 13 44 1 0 868 25ZM700 72A25 15 43 1 0 737 107A25 15 43 1 0 700 72ZM1379 21A17 9 87 1 0 1381 54A17 9 87 1 0 1379 21ZM1019 200A24 15 155 1 0 974 221A24 15 155 1 0 1019 200ZM959 226A34 25 70 1 0 982 289A34 25 70 1 0 959 226ZM749 153A36 20 1 1 0 821 154A36 20 1 1 0 749 153ZM884 -2A34 25 75 1 0 902 62A34 25 75 1 0 884 -2ZM1229 34A27 18 144 1 0 1186 65A27 18 144 1 0 1229 34ZM1043 297A15 9 5 1 0 1072 300A15 9 5 1 0 1043 297ZM897 65A24 18 150 1 0 856 89A24 18 150 1 0 897 65ZM803 61A23 14 79 1 0 811 106A23 14 79 1 0 803 61ZM937 24A34 26 136 1 0 888 71A34 26 136 1 0 937 24ZM1121 151A37 28 103 1 0 1105 224A37 28 103 1 0 1121 151ZM1048 299A12 8 14 1 0 1072 305A12 8 14 1 0 1048 299ZM666 141A13 8 91 1 0 666 167A13 8 91 1 0 666 141ZM1312 88A27 20 122 1 0 1283 134A27 20 122 1 0 1312 88ZM1080 19A28 15 19 1 0 1134 38A28 15 19 1 0 1080 19ZM1017 -41A26 14 50 1 0 1050 -2A26 14 50 1 0 1017 -41ZM1007 266A28 14 36 1 0 1052 299A28 14 36 1 0 1007 266ZM690 156A14 7 29 1 0 715 170A14 7 29 1 0 690 156ZM762 45A36 20 37 1 0 820 88A36 20 37 1 0 762 45ZM1173 12A33 20 116 1 0 1144 71A33 20 116 1 0 1173 12ZM1228 181A27 21 134 1 0 1189 220A27 21 134 1 0 1228 181ZM1135 102A18 10 134 1 0 1110 128A18 10 134 1 0 1135 102ZM806 36A36 24 46 1 0 857 89A36 24 46 1 0 806 36ZM1248 130A12 8 44 1 0 1265 146A12 8 44 1 0 1248 130ZM1007 94A35 22 34 1 0 1064 133A35 22 34 1 0 1007 94ZM1263 -33A37 25 168 1 0 1190 -18A37 25 168 1 0 1263 -33ZM1042 295A13 9 51 1 0 1059 315A13 9 51 1 0 1042 295ZM720 71A17 9 66 1 0 733 102A17 9 66 1 0 720 71ZM714 157A19 14 148 1 0 683 177A19 14 148 1 0 714 157ZM1215 66A26 15 22 1 0 1262 85A26 15 22 1 0 1215 66ZM1299 35A36 18 71 1 0 1322 103A36 18 71 1 0 1299 35ZM1261 39A27 19 123 1 0 1232 85A27 19 123 1 0 1261 39ZM849 58A16 11 105 1 0 841 88A16 11 105 1 0 849 58ZM1055 251A23 13 91 1 0 1054 298A23 13 91 1 0 1055 251ZM973 230A31 20 175 1 0 912 235A31 20 175 1 0 973 230ZM1057 296A16 10 137 1 0 1033 318A16 10 137 1 0 1057 296ZM1094 211A16 12 177 1 0 1063 213A16 12 177 1 0 1094 211ZM1043 231A15 9 22 1 0 1070 242A15 9 22 1 0 1043 231ZM828 155A27 20 79 1 0 839 209A27 20 79 1 0 828 155ZM1059 198A25 18 101 1 0 1049 248A25 18 101 1 0 1059 198ZM1115 -30A12 8 131 1 0 1100 -12A12 8 131 1 0 1115 -30ZM846 122A19 10 28 1 0 879 139A19 10 28 1 0 846 122ZM952 120A38 20 155 1 0 884 152A38 20 155 1 0 952 120ZM1170 -1A35 18 141 1 0 1115 43A35 18 141 1 0 1170 -1ZM926 74A18 13 110 1 0 913 108A18 13 110 1 0 926 74ZM1062 222A26 16 34 1 0 1105 251A26 16 34 1 0 1062 222ZM1066 274A25 16 165 1 0 1018 287A25 16 165 1 0 1066 274ZM738 115A15 8 79 1 0 744 144A15 8 79 1 0 738 115ZM672 148A23 16 114 1 0 653 191A23 16 114 1 0 672 148ZM885 132A25 15 46 1 0 920 169A25 15 46 1 0 885 132ZM639 128A27 18 69 1 0 659 178A27 18 69 1 0 639 128ZM1278 60A15 11 78 1 0 1284 89A15 11 78 1 0 1278 60ZM791 119A13 10 3 1 0 817 120A13 10 3 1 0 791 119ZM1364 67A37 27 167 1 0 1292 83A37 27 167 1 0 1364 67ZM1003 61A15 8 10 1 0 1033 66A15 8 10 1 0 1003 61ZM807 180A27 19 43 1 0 847 217A27 19 43 1 0 807 180ZM1066 29A17 10 86 1 0 1068 63A17 10 86 1 0 1066 29ZM980 78A17 9 136 1 0 956 101A17 9 136 1 0 980 78ZM1066 255A13 7 34 1 0 1088 270A13 7 34 1 0 1066 255ZM932 239A11 8 47 1 0 947 255A11 8 47 1 0 932 239ZM1204 162A23 15 32 1 0 1243 186A23 15 32 1 0 1204 162ZM1042 -44A34 18 8 1 0 1109 -35A34 18 8 1 0 1042 -44ZM1173 50A31 20 27 1 0 1229 78A31 20 27 1 0 1173 50ZM793 189A25 18 151 1 0 749 214A25 18 151 1 0 793 189ZM949 249A13 7 91 1 0 948 276A13 7 91 1 0 949 249ZM888 93A11 7 166 1 0 867 99A11 7 166 1 0 888 93ZM1309 22A37 21 73 1 0 1331 93A37 21 73 1 0 1309 22ZM844 157A25 15 70 1 0 860 204A25 15 70 1 0 844 157ZM1295 193A25 13 132 1 0 1263 230A25 13 132 1 0 1295 193ZM1149 133A19 12 129 1 0 1125 163A19 12 129 1 0 1149 133ZM762 193A26 14 89 1 0 763 244A26 14 89 1 0 762 193ZM1120 95A27 14 64 1 0 1143 144A27 14 64 1 0 1120 95ZM1167 266A17 9 4 1 0 1200 269A17 9 4 1 0 1167 266ZM806 198A11 8 119 1 0 795 217A11 8 119 1 0 806 198ZM1210 82A23 12 91 1 0 1209 128A23 12 91 1 0 1210 82ZM762 103A26 14 94 1 0 758 155A26 14 94 1 0 762 103ZM781 110A25 17 83 1 0 787 159A25 17 83 1 0 781 110ZM1160 245A23 17 66 1 0 1179 287A23 17 66 1 0 1160 245ZM854 39A32 22 99 1 0 844 101A32 22 99 1 0 854 39ZM739 115A18 13 27 1 0 772 132A18 13 27 1 0 739 115ZM674 129A17 10 125 1 0 654 157A17 10 125 1 0 674 129ZM918 22A23 14 114 1 0 900 64A23 14 114 1 0 918 22ZM1189 -62A30 23 81 1 0 1199 -2A30 23 81 1 0 1189 -62ZM1267 39A16 9 42 1 0 1292 60A16 9 42 1 0 1267 39ZM936 215A33 22 97 1 0 929 280A33 22 97 1 0 936 215ZM972 34A13 9 143 1 0 951 49A13 9 143 1 0 972 34ZM974 15A36 25 148 1 0 912 53A36 25 148 1 0 974 15ZM927 61A31 18 60 1 0 958 115A31 18 60 1 0 927 61ZM985 143A23 16 177 1 0 940 145A23 16 177 1 0 985 143ZM1043 265A22 17 130 1 0 1015 299A22 17 130 1 0 1043 265ZM1135 258A25 18 11 1 0 1184 268A25 18 11 1 0 1135 258ZM1201 180A36 23 37 1 0 1259 224A36 23 37 1 0 1201 180ZM925 202A26 15 85 1 0 930 253A26 15 85 1 0 925 202ZM1357 51A22 16 34 1 0 1393 76A22 16 34 1 0 1357 51ZM760 91A31 19 162 1 0 702 110A31 19 162 1 0 760 91ZM1058 277A29 23 134 1 0 1017 319A29 23 134 1 0 1058 277ZM756 142A22 11 20 1 0 797 156A22 11 20 1 0 756 142ZM947 180A20 12 29 1 0 981 199A20 12 29 1 0 947 180ZM677 73A32 18 32 1 0 732 107A32 18 32 1 0 677 73ZM870 49A33 25 167 1 0 805 64A33 25 167 1 0 870 49ZM687 155A11 8 72 1 0 694 176A11 8 72 1 0 687 155ZM1289 200A13 8 87 1 0 1291 225A13 8 87 1 0 1289 200ZM1255 73A29 16 111 1 0 1234 127A29 16 111 1 0 1255 73ZM672 136A17 11 153 1 0 641 151A17 11 153 1 0 672 136ZM874 200A25 17 169 1 0 825 210A25 17 169 1 0 874 200ZM1120 -52A32 23 128 1 0 1080 -2A32 23 128 1 0 1120 -52ZM1037 -40A21 12 75 1 0 1048 0A21 12 75 1 0 1037 -40ZM983 77A31 24 121 1 0 951 130A31 24 121 1 0 983 77ZM1115 229A24 14 141 1 0 1078 259A24 14 141 1 0 1115 229ZM923 229A18 13 6 1 0 959 233A18 13 6 1 0 923 229Z"/>
<path fill="#9BC940" d="M833 29A22 15 28 1 0 873 50A22 15 28 1 0 833 29ZM1068 -26A18 11 24 1 0 1101 -11A18 11 24 1 0 1068 -26ZM1142 97A15 10 80 1 0 1148 128A15 10 80 1 0 1142 97ZM827 169A14 10 86 1 0 829 197A14 10 86 1 0 827 169ZM1022 126A31 18 84 1 0 1028 188A31 18 84 1 0 1022 126ZM1283 147A37 27 98 1 0 1273 220A37 27 98 1 0 1283 147ZM1270 70A13 8 110 1 0 1261 95A13 8 110 1 0 1270 70ZM748 118A23 16 148 1 0 710 142A23 16 148 1 0 748 118ZM1110 206A12 7 129 1 0 1095 224A12 7 129 1 0 1110 206ZM965 47A31 19 93 1 0 963 110A31 19 93 1 0 965 47ZM973 210A21 15 5 1 0 1016 214A21 15 5 1 0 973 210ZM1346 40A30 16 15 1 0 1404 56A30 16 15 1 0 1346 40ZM1093 232A29 22 111 1 0 1072 286A29 22 111 1 0 1093 232ZM1150 204A35 21 164 1 0 1083 223A35 21 164 1 0 1150 204ZM1126 185A27 20 117 1 0 1101 234A27 20 117 1 0 1126 185ZM897 62A34 19 38 1 0 951 104A34 19 38 1 0 897 62ZM1361 23A15 8 116 1 0 1347 50A15 8 116 1 0 1361 23ZM871 53A22 14 167 1 0 828 63A22 14 167 1 0 871 53ZM778 177A31 18 13 1 0 837 190A31 18 13 1 0 778 177ZM1102 -50A14 10 32 1 0 1125 -36A14 10 32 1 0 1102 -50ZM1097 233A37 26 102 1 0 1082 306A37 26 102 1 0 1097 233ZM1271 77A29 20 46 1 0 1312 119A29 20 46 1 0 1271 77ZM720 49A31 16 31 1 0 773 81A31 16 31 1 0 720 49ZM891 144A31 19 40 1 0 938 184A31 19 40 1 0 891 144ZM1387 22A34 26 164 1 0 1322 41A34 26 164 1 0 1387 22ZM1262 221A31 20 153 1 0 1207 250A31 20 153 1 0 1262 221ZM1325 2A23 14 115 1 0 1306 44A23 14 115 1 0 1325 2ZM896 152A18 14 158 1 0 863 165A18 14 158 1 0 896 152ZM1286 148A23 18 119 1 0 1263 189A23 18 119 1 0 1286 148ZM962 190A29 18 39 1 0 1007 227A29 18 39 1 0 962 190ZM1220 116A18 10 170 1 0 1184 122A18 10 170 1 0 1220 116ZM947 -21A18 12 53 1 0 968 8A18 12 53 1 0 947 -21ZM852 17A22 13 117 1 0 832 57A22 13 117 1 0 852 17ZM1077 245A13 8 94 1 0 1075 270A13 8 94 1 0 1077 245ZM1037 130A26 15 86 1 0 1040 182A26 15 86 1 0 1037 130ZM1195 136A21 16 169 1 0 1154 144A21 16 169 1 0 1195 136ZM1008 201A25 19 178 1 0 958 204A25 19 178 1 0 1008 201ZM866 157A28 15 32 1 0 913 186A28 15 32 1 0 866 157ZM1056 1A31 20 152 1 0 1001 30A31 20 152 1 0 1056 1ZM1122 213A12 6 157 1 0 1100 222A12 6 157 1 0 1122 213ZM993 128A19 12 38 1 0 1023 151A19 12 38 1 0 993 128ZM1130 -20A18 14 178 1 0 1093 -18A18 14 178 1 0 1130 -20ZM1053 26A13 7 142 1 0 1033 42A13 7 142 1 0 1053 26ZM967 210A14 7 39 1 0 989 228A14 7 39 1 0 967 210ZM1106 193A15 8 78 1 0 1112 221A15 8 78 1 0 1106 193ZM999 126A21 11 13 1 0 1041 135A21 11 13 1 0 999 126ZM1120 180A27 18 72 1 0 1136 231A27 18 72 1 0 1120 180ZM1276 128A36 18 86 1 0 1280 200A36 18 86 1 0 1276 128ZM1135 -27A12 8 79 1 0 1139 -3A12 8 79 1 0 1135 -27ZM724 60A25 13 25 1 0 769 80A25 13 25 1 0 724 60ZM972 182A24 17 71 1 0 988 227A24 17 71 1 0 972 182ZM1281 91A15 9 173 1 0 1253 94A15 9 173 1 0 1281 91ZM1326 104A17 10 13 1 0 1358 112A17 10 13 1 0 1326 104ZM1353 27A24 18 46 1 0 1386 62A24 18 46 1 0 1353 27ZM957 -18A16 11 98 1 0 953 13A16 11 98 1 0 957 -18ZM952 -42A34 19 56 1 0 990 14A34 19 56 1 0 952 -42ZM1069 242A18 14 72 1 0 1080 276A18 14 72 1 0 1069 242ZM1147 202A26 14 158 1 0 1098 222A26 14 158 1 0 1147 202ZM1179 119A28 14 69 1 0 1199 170A28 14 69 1 0 1179 119ZM1251 200A33 21 1 1 0 1318 201A33 21 1 1 0 1251 200ZM1077 226A36 27 90 1 0 1077 298A36 27 90 1 0 1077 226ZM1356 21A32 19 133 1 0 1313 67A32 19 133 1 0 1356 21ZM1260 159A22 13 6 1 0 1305 164A22 13 6 1 0 1260 159ZM1114 189A27 20 131 1 0 1079 230A27 20 131 1 0 1114 189ZM1134 164A36 24 119 1 0 1100 227A36 24 119 1 0 1134 164ZM787 178A25 14 11 1 0 836 188A25 14 11 1 0 787 178ZM1200 240A28 14 38 1 0 1244 274A28 14 38 1 0 1200 240ZM1117 248A30 18 168 1 0 1058 261A30 18 168 1 0 1117 248ZM762 43A27 18 110 1 0 743 95A27 18 110 1 0 762 43ZM958 188A29 22 47 1 0 998 230A29 22 47 1 0 958 188ZM1117 185A13 7 42 1 0 1135 202A13 7 42 1 0 1117 185ZM1252 224A24 18 130 1 0 1221 261A24 18 130 1 0 1252 224ZM1212 233A28 14 10 1 0 1267 242A28 14 10 1 0 1212 233ZM957 -18A19 11 163 1 0 922 -7A19 11 163 1 0 957 -18ZM971 77A28 20 172 1 0 916 84A28 20 172 1 0 971 77ZM1161 131A18 13 110 1 0 1148 166A18 13 110 1 0 1161 131ZM1251 176A29 21 22 1 0 1305 198A29 21 22 1 0 1251 176ZM980 211A13 9 16 1 0 1005 218A13 9 16 1 0 980 211ZM842 169A20 13 169 1 0 802 176A20 13 169 1 0 842 169ZM1266 52A36 27 98 1 0 1256 124A36 27 98 1 0 1266 52ZM1381 9A19 12 108 1 0 1370 45A19 12 108 1 0 1381 9ZM1082 -46A13 7 57 1 0 1097 -24A13 7 57 1 0 1082 -46ZM701 114A27 13 12 1 0 753 125A27 13 12 1 0 701 114ZM1113 247A27 16 152 1 0 1064 272A27 16 152 1 0 1113 247ZM1081 244A15 10 41 1 0 1103 264A15 10 41 1 0 1081 244ZM856 34A17 12 64 1 0 871 64A17 12 64 1 0 856 34Z"/>
<path fill="#22491A" d="M658.8 243.2Q657.7 255.9 640.1 263.6Q650.6 249.4 658.8 243.2ZM668.3 236Q681.4 240.3 685.1 260.7Q672.8 246.2 668.3 236ZM886.6 244Q894.3 243.6 900.3 253.5Q891 248.4 886.6 244ZM997.1 150.7Q997.2 160.5 984.4 167.6Q991.3 156.1 997.1 150.7ZM1161 376.1Q1168 377.4 1171.5 387.6Q1164.1 381 1161 376.1ZM727.8 307.8Q741.2 309.3 748.9 328.1Q734.2 316.6 727.8 307.8ZM904.2 155.5Q897.5 159.1 888 153Q898.4 153.5 904.2 155.5ZM822.8 330.7Q827.1 339.3 818.8 351.2Q820 337.9 822.8 330.7ZM740.1 298.6Q745.7 303 744 313.5Q740.5 304.3 740.1 298.6ZM1082.1 290.3Q1087.3 297 1082.2 308.7Q1080.9 297 1082.1 290.3ZM1032.2 359.3Q1045.4 359 1055.4 376.2Q1039.6 367 1032.2 359.3ZM890.1 299.5Q893.2 311.1 880.2 323.4Q884.9 307.6 890.1 299.5ZM1286.7 175.5Q1293.7 172.2 1303 179Q1292.5 177.9 1286.7 175.5ZM729 303.7Q733.5 309.1 729.7 318.9Q728.2 309.3 729 303.7ZM1329.5 284Q1339.9 289 1340.8 306.2Q1332.2 292.9 1329.5 284ZM983.4 288Q994.6 286 1005.4 299.3Q990.7 293.6 983.4 288ZM1200.2 269.8Q1207.8 269.2 1214.2 278.7Q1204.8 274 1200.2 269.8ZM943.9 257.3Q952.3 264.8 948.7 281.2Q944.1 266.4 943.9 257.3ZM597.8 179.4Q593.6 188.4 578.8 189.4Q590.2 181.8 597.8 179.4ZM656.4 196.6Q665.7 202.2 665.2 218.4Q658.2 205.2 656.4 196.6ZM1416.6 155.4Q1426 158.9 1428.3 173.7Q1419.7 162.9 1416.6 155.4ZM1101.9 165.8Q1110.5 157.8 1127.2 163.3Q1111.3 166.6 1101.9 165.8ZM862.9 158.7Q867.1 171 853.8 185.4Q857.8 167.9 862.9 158.7ZM1214.8 234.7Q1225.2 231.6 1236.8 242.9Q1222.3 239.2 1214.8 234.7ZM1185.2 363.1Q1191.9 361.1 1199.4 368.6Q1190 366.1 1185.2 363.1ZM946.1 113.9Q955 112.8 962.8 123.8Q951.6 118.6 946.1 113.9ZM643.1 247.6Q653.4 247.1 661.5 260.2Q649 253.4 643.1 247.6ZM997.7 369.6Q999.9 376.6 992.2 384.6Q994.7 374.7 997.7 369.6ZM820 302.1Q824.4 311.6 815.2 324.3Q816.7 309.9 820 302.1ZM1049.3 289.3Q1035.9 291.9 1022.9 276.2Q1040.5 282.7 1049.3 289.3ZM1223.2 324.1Q1233.1 328.6 1234.4 344.9Q1225.9 332.5 1223.2 324.1ZM988.7 153.8Q1001.3 158.8 1003.9 179Q992.6 164 988.7 153.8ZM924.8 326.5Q938.1 327.6 946.2 345.9Q931.4 335 924.8 326.5ZM1377.3 230.1Q1388.4 233.7 1391.7 250.8Q1381.2 238.7 1377.3 230.1ZM970.3 364.5Q967.3 372.6 954.4 374.4Q963.8 367.1 970.3 364.5ZM764.2 118.9Q760.3 125.8 748.4 125.6Q758 120.3 764.2 118.9ZM656.8 286.1Q651.9 294 638.1 293.3Q649.5 287.5 656.8 286.1ZM822.1 139.9Q827.3 132.5 840.7 134Q829.3 139 822.1 139.9ZM629.3 199.2Q641.2 205.2 641.8 225.1Q632.2 209.5 629.3 199.2ZM788.1 315.3Q795.1 321 792.7 334.4Q788.5 322.6 788.1 315.3ZM792.1 201.4Q799.9 198.3 809.6 206.2Q798.2 204.4 792.1 201.4ZM1013 251.7Q1021.5 242 1040.4 246.1Q1023.4 251.5 1013 251.7ZM930.3 307.5Q925.4 313.6 913.8 311.6Q924 307.9 930.3 307.5ZM1152.2 373.8Q1156.6 380.1 1151.6 390.4Q1150.9 379.9 1152.2 373.8ZM1149.4 373.1Q1151.5 383.2 1139.8 393.2Q1144.5 379.8 1149.4 373.1ZM1202 210.4Q1209.2 214.7 1208.9 227.2Q1203.4 217 1202 210.4ZM1011.9 223.8Q1023.4 231.4 1021.7 252Q1013.6 234.8 1011.9 223.8ZM666.6 232Q675.6 230.8 683.6 241.8Q672.2 236.7 666.6 232ZM587.5 197.4Q584.1 208.1 567.6 211.3Q579.3 201.2 587.5 197.4ZM967.7 291.4Q965.4 299.2 953.5 301.7Q961.8 294.2 967.7 291.4ZM829.1 146.2Q837 141.6 848.9 148.7Q836.2 148.4 829.1 146.2ZM767.7 180.2Q779.2 186 780 205.4Q770.5 190.3 767.7 180.2ZM759.6 180.6Q771.2 186 772.5 205.2Q762.7 190.5 759.6 180.6ZM1232.9 360.8Q1243.9 364.9 1246.5 382.3Q1236.5 369.6 1232.9 360.8ZM1327.3 211.4Q1340 214.8 1344.5 234Q1332.1 220.8 1327.3 211.4ZM842.8 344.1Q842.4 355.8 826.9 363.8Q835.6 350.3 842.8 344.1ZM1240 232.6Q1249.1 238.4 1248.1 254.5Q1241.5 241.2 1240 232.6ZM1366.4 191.5Q1375.6 188.9 1385.6 199.1Q1372.9 195.5 1366.4 191.5Z"/>
<path fill="#2F5E20" d="M1151 305.4Q1162.2 312.1 1161.5 331.7Q1153.1 315.8 1151 305.4ZM930.6 281.7Q931.4 294.1 915.7 304.1Q923.6 288.9 930.6 281.7ZM1012.6 239.8Q1020.6 243.3 1021.8 256.3Q1014.9 246.5 1012.6 239.8ZM1179.6 358.5Q1185.1 364.1 1181.7 375.4Q1179.2 364.8 1179.6 358.5ZM1178 276.5Q1190.1 281.3 1192.6 300.7Q1181.7 286.4 1178 276.5ZM650.8 240.4Q646.8 249.9 631.2 251.5Q642.9 243.2 650.8 240.4ZM1092.2 306Q1101.5 309.2 1103.9 323.8Q1095.3 313.3 1092.2 306ZM748 298.4Q753.2 304.6 748.7 315.9Q747.1 304.9 748 298.4ZM1252.9 332.4Q1259.4 338 1256.8 350.6Q1253.1 339.3 1252.9 332.4ZM880.8 249Q885.1 257.4 877.1 269.2Q878.1 256.1 880.8 249ZM1357.1 244.3Q1365.9 239.3 1378.9 247.3Q1364.9 246.9 1357.1 244.3ZM1335.4 208.3Q1344.2 208.1 1351 219.5Q1340.4 213.5 1335.4 208.3ZM1047.9 353.3Q1043.7 361.8 1029.5 362.5Q1040.6 355.4 1047.9 353.3ZM1074.7 245.4Q1081.6 249.9 1080.8 262.1Q1075.8 251.9 1074.7 245.4ZM937.9 130.7Q930.8 134.1 921.1 127.1Q932 128.2 937.9 130.7ZM743.2 248.2Q750.7 258.9 741.9 276.5Q740.9 258.5 743.2 248.2ZM1028.2 307.1Q1019.3 316.1 1001 311Q1018 306.7 1028.2 307.1ZM654.2 197Q661.5 199 664.1 209.9Q657 202.4 654.2 197ZM938.5 327.5Q934.4 337.9 917.7 340Q930 330.7 938.5 327.5ZM867.5 150.2Q875.6 154.7 875.6 168.5Q869.3 157.4 867.5 150.2ZM1095.7 297.2Q1098.2 308.1 1085.7 319.2Q1090.6 304.6 1095.7 297.2ZM1089.3 277.9Q1097.1 286.9 1090.8 303.7Q1088.1 287.4 1089.3 277.9ZM1256.9 210.9Q1259.4 219.3 1250 228.8Q1253.2 217 1256.9 210.9ZM937.2 128.3Q943.6 123.2 954.8 128Q943.7 129.3 937.2 128.3ZM932 300.6Q941.2 304.6 942.6 319.5Q934.6 308.2 932 300.6ZM748.7 186.4Q752.7 192.6 747.4 202.4Q747.1 192.2 748.7 186.4ZM889.8 236.6Q893.3 244.9 884.9 255.5Q886.7 243.2 889.8 236.6ZM750.5 244.9Q757.6 245.5 761.8 255.3Q754 249.4 750.5 244.9ZM1338.8 118Q1347.5 119.1 1352.3 131.3Q1342.9 123.8 1338.8 118ZM808.2 158.1Q820.8 153 836.7 165.9Q818.1 162.9 808.2 158.1ZM659.5 145.4Q652.7 154.5 635.9 152Q650.4 146.3 659.5 145.4ZM1310.7 114.3Q1319 113.5 1326 123.8Q1315.7 118.8 1310.7 114.3ZM929 307.9Q922 313.4 909.6 308.1Q921.9 306.7 929 307.9ZM967.6 139.8Q968.6 151.8 953.6 161.7Q961 146.9 967.6 139.8ZM1300.8 278.2Q1312 279.3 1318.6 295Q1306.2 285.5 1300.8 278.2ZM785.3 174.8Q791.8 181.8 787.4 195.5Q784.7 182.5 785.3 174.8ZM763.1 242.5Q767.8 251.2 759.7 263.7Q760.4 250.1 763.1 242.5ZM873.4 342.1Q876.9 351.3 867.3 362.4Q869.8 349.1 873.4 342.1ZM934.5 321Q943 315.8 956.1 323.2Q942.3 323.3 934.5 321ZM712.9 278.4Q710.6 290.3 693.3 296Q704.5 283.5 712.9 278.4ZM1021.3 149.5Q1025.8 155 1021.9 164.9Q1020.4 155.2 1021.3 149.5ZM676.1 304.2Q670.8 312.3 656.5 311.1Q668.5 305.4 676.1 304.2ZM735.2 300.7Q738.9 309.3 730.4 320.4Q732.1 307.6 735.2 300.7ZM1087.9 133.3Q1101 129.7 1115.2 144.2Q1097.2 139.1 1087.9 133.3ZM836.5 334.8Q838.8 345.8 825.9 356.7Q831.2 342.1 836.5 334.8ZM1022 310.5Q1027.9 319.9 1020 334.4Q1019.7 319.1 1022 310.5ZM1079.5 339.5Q1088.2 343.1 1089.8 357.3Q1082.1 346.7 1079.5 339.5ZM950.1 242.3Q959.2 247.3 959.2 262.8Q952.1 250.4 950.1 242.3ZM944 200.2Q953.5 198.8 962.2 210.4Q950 205.2 944 200.2ZM693.7 248.1Q704.5 251 708.6 267.2Q697.9 256.1 693.7 248.1ZM995.5 286.6Q1001.8 293.5 997.2 306.7Q994.8 294 995.5 286.6ZM1029.3 357.9Q1031.7 366 1022.7 374.9Q1025.8 363.7 1029.3 357.9ZM1172.2 355.7Q1173.5 364.8 1162.4 372.9Q1167.5 361.3 1172.2 355.7ZM952 265.8Q949.1 275.1 934.8 278Q944.9 269.1 952 265.8Z"/>
<path fill="#3D7026" d="M924.1 328.1Q914.3 334.1 899.2 325.5Q915.2 325.5 924.1 328.1ZM1171.2 202.3Q1172.2 210.5 1162 217.8Q1166.8 207.3 1171.2 202.3ZM681.3 161.5Q678 167.8 667.2 167.9Q675.7 162.9 681.3 161.5ZM581.5 253.6Q583.8 260.4 576.6 268.3Q578.7 258.7 581.5 253.6ZM995.2 233Q1006 235.8 1010.1 252Q999.4 241 995.2 233ZM937.3 114.2Q947.8 110.9 959.7 122.2Q945 118.6 937.3 114.2ZM832.7 345.2Q834.5 357.6 819.5 368.9Q826.3 353 832.7 345.2ZM738.3 309.1Q742.6 316.2 736.4 327.1Q736.4 315.6 738.3 309.1ZM1089.7 286.7Q1094.8 297.3 1084.4 311.7Q1086.1 295.5 1089.7 286.7ZM1285.8 313.3Q1297.3 315.9 1302 332.9Q1290.4 321.5 1285.8 313.3ZM1425.1 133.5Q1431.6 124.2 1448.4 126Q1434.2 132.3 1425.1 133.5ZM1174.9 246.7Q1180.2 255.2 1172.9 268.4Q1172.7 254.5 1174.9 246.7ZM835.6 335.8Q839.7 346.2 829 359.2Q831.6 343.9 835.6 335.8ZM939.1 99.2Q946.1 88.5 965.2 90Q949.3 97.6 939.1 99.2ZM1075.5 380.5Q1079.1 393.6 1064.4 407.8Q1069.6 389.8 1075.5 380.5ZM880.2 108.6Q873.1 119.4 853.7 117.8Q869.9 110.2 880.2 108.6ZM1313.8 285.8Q1324.8 286.4 1331.9 301.4Q1319.4 292.7 1313.8 285.8ZM1188.9 352.5Q1195.8 353.6 1199.3 363.4Q1192 357.2 1188.9 352.5ZM923.6 333Q922.9 341.9 910.7 347.3Q917.9 337.4 923.6 333ZM956.8 193.1Q970.4 192.8 980.7 210.5Q964.4 201.1 956.8 193.1ZM672.1 165.4Q663.7 174.8 645.2 170.5Q661.9 165.5 672.1 165.4ZM813.8 318.9Q812.2 330.6 795.5 336.9Q805.9 324.3 813.8 318.9ZM760.5 296.4Q774 296.9 783.3 315Q767.6 304.8 760.5 296.4ZM1343.8 195.9Q1351.4 202.8 1347.9 217.9Q1343.8 204.3 1343.8 195.9ZM780.9 309.9Q789.3 319.8 782.5 338Q779.6 320.3 780.9 309.9ZM782.2 174.6Q789.6 172.9 797.2 181.4Q787.2 178.1 782.2 174.6ZM757.4 239.4Q769.1 237.6 780 251.6Q764.9 245.4 757.4 239.4ZM1325.4 268.2Q1333.8 268.9 1339 280.4Q1329.6 273.6 1325.4 268.2ZM1031.6 304.8Q1031.9 317.3 1015.7 326.8Q1024.3 311.8 1031.6 304.8ZM1113 381.1Q1117 390.7 1107.2 402.9Q1109.4 388.7 1113 381.1ZM771.6 135.5Q769.6 149.2 750.2 156.4Q762.4 141.7 771.6 135.5ZM1106.2 161.9Q1113 153.3 1129.3 156Q1115 161.3 1106.2 161.9Z"/>
<path fill="#53892C" d="M1169.1 371.4Q1176 374.1 1177.3 385.2Q1171.2 377 1169.1 371.4ZM693.8 162.8Q701.3 158.7 712 165.6Q700.3 165 693.8 162.8ZM1156.1 371.9Q1165.7 378.7 1163.8 396.3Q1157.3 381.4 1156.1 371.9ZM1003.6 354.2Q1011.6 358.6 1011.6 372.3Q1005.3 361.4 1003.6 354.2ZM915.5 122.3Q919.7 133.8 907.6 147.7Q910.9 131 915.5 122.3ZM1199.2 365.7Q1208.9 369.2 1211.3 384.4Q1202.4 373.3 1199.2 365.7ZM1028.2 261.3Q1035.7 252 1053.3 255.1Q1037.8 260.7 1028.2 261.3ZM688.5 306.3Q685.2 318.1 667.2 322.3Q679.6 310.7 688.5 306.3ZM1058.9 367.7Q1051.5 374.2 1037.7 369.2Q1051 366.8 1058.9 367.7ZM813.3 314.4Q803.1 322.7 784.7 315.2Q802.8 312.7 813.3 314.4ZM1192.7 351.8Q1205.1 353.2 1212.2 370.7Q1198.6 360 1192.7 351.8ZM934.7 138.5Q937.9 146.5 929.6 156.4Q931.6 144.7 934.7 138.5ZM1067.5 186.5Q1075.1 180.1 1088.9 185.5Q1075.4 187.5 1067.5 186.5ZM601 182.5Q598.8 191.1 585.8 194.5Q594.6 185.9 601 182.5ZM724.7 219.2Q722.1 231.3 704.4 236.6Q716.1 224.2 724.7 219.2ZM758.2 115.7Q757.4 123.9 746 128.8Q752.9 119.7 758.2 115.7ZM1196.7 294.4Q1199.7 303.3 1190.1 313.6Q1193 301 1196.7 294.4ZM915.4 313.1Q912.1 323.7 895.7 326.9Q907.3 316.9 915.4 313.1ZM960.4 160.1Q962.1 168.1 952.9 176.1Q956.6 165.5 960.4 160.1ZM927 115.9Q935.8 114.4 944.2 124.9Q932.7 120.4 927 115.9ZM742.6 188.3Q751.2 191.1 753.6 204.4Q745.6 194.9 742.6 188.3ZM910.5 345.9Q921.9 349.9 925 367.7Q914.4 354.9 910.5 345.9ZM799.9 142.8Q802.4 150.5 794.2 159.4Q796.7 148.5 799.9 142.8ZM722 179.4Q726.5 187.4 719.3 199.1Q719.7 186.4 722 179.4ZM655.2 193.2Q662.9 195.9 664.8 208Q657.8 199.2 655.2 193.2ZM860.4 231.1Q856.6 242.1 839.5 244.9Q851.8 234.8 860.4 231.1ZM826.2 271.7Q824.5 279.7 812.8 283.2Q820.5 275 826.2 271.7ZM864.1 276.7Q871.8 276 878.2 285.7Q868.7 280.9 864.1 276.7ZM1165.2 354.1Q1170.8 360.7 1166.2 372.9Q1164.3 361.1 1165.2 354.1ZM723.7 280.2Q727 291 715.1 303.1Q719 288 723.7 280.2ZM588.7 255.3Q588.2 268.3 570.6 277.1Q580.6 262.1 588.7 255.3ZM713.6 199.3Q706.9 205.2 694.2 200.6Q706.4 198.5 713.6 199.3ZM1390.6 163.3Q1403.5 160.2 1416.9 174.8Q1399.5 169.3 1390.6 163.3ZM1195.8 357.8Q1203.7 353.6 1214.8 361Q1202.5 360.3 1195.8 357.8ZM1234.1 211.3Q1243.9 218.7 1241.2 236.9Q1235 221.1 1234.1 211.3ZM1147.9 301.1Q1154.8 305.2 1154.3 317.2Q1149.2 307.4 1147.9 301.1ZM866 354.5Q873.8 358 874.7 370.8Q868.1 361 866 354.5ZM1010.6 382.4Q1018.7 389.4 1015.5 405.1Q1010.9 391.1 1010.6 382.4ZM819.9 160.3Q831.5 154.2 847.9 165.1Q829.8 163.9 819.9 160.3ZM1014.3 303.8Q1024 310.9 1021.7 328.9Q1015.3 313.5 1014.3 303.8ZM921.3 315.9Q912.8 326.5 892.8 323Q910.4 316.7 921.3 315.9ZM1014.7 377.5Q1023.5 383.2 1022.3 399Q1016 385.9 1014.7 377.5ZM1346.8 207.8Q1355.9 211.8 1357.3 226.7Q1349.4 215.4 1346.8 207.8ZM1148.1 390.5Q1159.8 395.6 1161.6 414.7Q1151.4 400.3 1148.1 390.5ZM936.4 152.5Q933.7 166 914 172.1Q926.9 158.2 936.4 152.5ZM617.2 194.3Q615.5 207.6 596.8 214.9Q608.3 200.5 617.2 194.3Z"/>
    {/* three leaves that are only waiting to be let go of */}
    <g className="leaffall lf0"><path d="M986 300 q9 -7 25 0 q-16 9 -25 0Z" fill="#6E9E34"/></g>
    <g className="leaffall lf1"><path d="M1054 262 q10 -8 27 0 q-17 10 -27 0Z" fill="#87B23C"/></g>
    <g className="leaffall lf2"><path d="M908 328 q8 -7 23 0 q-15 8 -23 0Z" fill="#5E8E2E"/></g>
  </g>
  {/* the grass the trunk stands in, drawn after it so it overlaps the
       foot — a trunk that meets the lawn on a clean line looks pasted */}
<use href="#pk-tuft8" transform="translate(1155,459) scale(0.089,0.089)"/>
<use href="#pk-tuft2" transform="translate(1267,465) scale(0.057,0.057)"/>
<use href="#pk-tuft3" transform="translate(1137,457) scale(-0.065,0.065)"/>
<use href="#pk-tuft2" transform="translate(1120,460) scale(-0.106,0.106)"/>
<use href="#pk-tuft7" transform="translate(1197,454) scale(-0.067,0.067)"/>
<use href="#pk-tuft10" transform="translate(1227,481) scale(-0.078,0.078)"/>
<use href="#pk-tuft1" transform="translate(1163,488) scale(0.09,0.09)"/>
<use href="#pk-tuft4" transform="translate(1179,477) scale(-0.121,0.121)"/>
<use href="#pk-tuft4" transform="translate(1094,526) scale(0.093,0.093)"/>
<use href="#pk-tuft7" transform="translate(1141,485) scale(-0.08,0.08)"/>
<use href="#pk-tuft8" transform="translate(1093,459) scale(0.068,0.068)"/>
<use href="#pk-tuft11" transform="translate(1126,491) scale(-0.084,0.084)"/>
<use href="#pk-tuft1" transform="translate(1088,473) scale(-0.069,0.069)"/>
<use href="#pk-tuft0" transform="translate(1168,469) scale(-0.078,0.078)"/>
<use href="#pk-tuft0" transform="translate(1235,538) scale(0.145,0.145)"/>
<use href="#pk-tuft12" transform="translate(1221,540) scale(0.097,0.097)"/>
<use href="#pk-tuft12" transform="translate(1242,467) scale(0.103,0.103)"/>
<use href="#pk-tuft10" transform="translate(1118,489) scale(-0.095,0.095)"/>
<use href="#pk-tuft5" transform="translate(1104,458) scale(0.087,0.087)"/>
<use href="#pk-tuft13" transform="translate(1220,493) scale(0.122,0.122)"/>
<use href="#pk-tuft13" transform="translate(1131,536) scale(0.138,0.138)"/>
<use href="#pk-tuft4" transform="translate(1230,527) scale(0.078,0.078)"/>
<use href="#pk-tuft8" transform="translate(1167,453) scale(0.106,0.106)"/>
<use href="#pk-tuft7" transform="translate(1194,462) scale(0.094,0.094)"/>
<use href="#pk-tuft1" transform="translate(1180,492) scale(0.116,0.116)"/>
<use href="#pk-tuft4" transform="translate(1150,481) scale(0.112,0.112)"/>
<use href="#pk-tuft3" transform="translate(1169,496) scale(0.105,0.105)"/>
<use href="#pk-tuft3" transform="translate(1214,461) scale(0.076,0.076)"/>
<use href="#pk-tuft6" transform="translate(1126,510) scale(-0.088,0.088)"/>
<use href="#pk-tuft0" transform="translate(1208,494) scale(0.112,0.112)"/>
<use href="#pk-tuft7" transform="translate(1187,479) scale(-0.103,0.103)"/>
<use href="#pk-tuft5" transform="translate(1262,496) scale(0.131,0.131)"/>
<use href="#pk-tuft12" transform="translate(1251,545) scale(-0.139,0.139)"/>
<use href="#pk-tuft1" transform="translate(1250,454) scale(0.103,0.103)"/>
<use href="#pk-tuft5" transform="translate(1177,547) scale(0.098,0.098)"/>
<use href="#pk-tuft0" transform="translate(1147,483) scale(-0.084,0.084)"/>
<use href="#pk-tuft8" transform="translate(1161,461) scale(0.094,0.094)"/>
<use href="#pk-tuft2" transform="translate(1096,482) scale(0.121,0.121)"/>
<use href="#pk-tuft13" transform="translate(1202,463) scale(-0.084,0.084)"/>
<use href="#pk-tuft8" transform="translate(1205,515) scale(-0.099,0.099)"/>
<use href="#pk-tuft9" transform="translate(1247,506) scale(0.118,0.118)"/>
<use href="#pk-tuft3" transform="translate(1264,460) scale(-0.06,0.06)"/>
<use href="#pk-tuft13" transform="translate(1251,474) scale(-0.069,0.069)"/>
<use href="#pk-tuft3" transform="translate(1147,547) scale(0.128,0.128)"/>
<use href="#pk-tuft6" transform="translate(1153,537) scale(0.092,0.092)"/>
<use href="#pk-tuft10" transform="translate(1172,474) scale(0.103,0.103)"/>
</g>

{/* ══════════════════════════════════════════════════════════════════════
     8. THE BLANKET

     This is the stage everything else stands on, so it is the one thing in
     the picture that is solved rather than drawn.

     The horizon is at y=232, so the vanishing point is (600, 232) and the
     blanket's two side edges run to it. Its far edge is placed so the
     cloth comes out SQUARE on the ground rather than square on the page —
     a picnic blanket is square, and the check is what gives it away if it
     isn't. The rows compress toward the far edge on a 1/depth law, not in
     even steps, which is why row nine and row ten are seventeen pixels
     apart and rows one and two are fifty-seven.

     And it is a WEAVE, not a chequerboard: a pale ground, red bands one
     way, the same red bands the other, and the crossings come out darker
     on their own. That is how gingham actually works, and it is less
     drawing than alternating squares would have been.
     ══════════════════════════════════════════════════════════════════════ */}
<g>
  {/* the cloth sits ON the grass: it stops the light reaching under its
       far edge, and the sun being low and right makes that contact line
       the darkest thing on the lawn */}
  <path d="M60 898.6Q101 898.4 150.8 904.1Q198.1 901.1 241.7 899.4Q285.2 895.6 332.5 890.1Q377.4 894.9 423.3 903.7Q471.7 906.1 514.2 904.5Q557 898.8 605 891.6Q650.7 897.4 695.8 895.7Q743.5 896.9 786.7 902.3Q836.9 898.5 877.5 902.2Q922.1 898.6 968.3 889.8Q1010.3 892.6 1059.2 895.7Q1100 902.7 1150 906.4Q1136.7 876.1 1118 844.3Q1096.2 819.5 1066.9 798.5Q1052.3 776.6 1033.7 752.8Q1018.7 729.5 1002.1 707Q983 688.6 957.1 661.3Q938.9 640.1 921.2 615.6Q899.2 594.7 886 569.8Q885.6 575.2 882.4 570.7Q845.6 568.7 802.4 571Q761.3 574.3 722.5 574.2Q677.7 569.9 642.5 566.2Q599.2 561.6 562.6 564.5Q518.2 569.6 482.7 569.2Q439 568.5 402.7 572.8Q361.6 575.8 322.8 571.4Q301.1 593 287.9 615.6Q268.7 642.3 248.6 661.3Q230.5 687.8 206.1 707Q188.2 729.1 174.6 752.8Q155.1 779.5 138.4 798.5Q118.9 817.9 90.2 844.3Z" fill="#1B3B44" opacity=".34"
        filter="url(#pk-softMd)" transform="translate(-14,9)"/>
  <g className="cloth">
    <g clipPath="url(#pk-clothClip)">
      <rect x="40" y="540" width="1140" height="380" fill="url(#pk-clothLight)"/>
<path d="M60 890L169 890L378.7 569.8L322.8 569.8Z" fill="#B8332A" opacity=".62"/>
<path d="M278 890L387 890L490.6 569.8L434.7 569.8Z" fill="#B8332A" opacity=".62"/>
<path d="M496 890L605 890L602.6 569.8L546.6 569.8Z" fill="#B8332A" opacity=".62"/>
<path d="M714 890L823 890L714.5 569.8L658.5 569.8Z" fill="#B8332A" opacity=".62"/>
<path d="M932 890L1041 890L826.4 569.8L770.4 569.8Z" fill="#B8332A" opacity=".62"/>
<path d="M60 890L1150 890L1102.4 833L106.8 833Z" fill="#B8332A" opacity=".62"/>
<path d="M146.1 785.1L1062.4 785.1L1028.2 744.3L179.6 744.3Z" fill="#B8332A" opacity=".62"/>
<path d="M208.4 709.1L998.8 709.1L973.2 678.4L233.6 678.4Z" fill="#B8332A" opacity=".62"/>
<path d="M255.8 651.5L950.6 651.5L930.6 627.6L275.4 627.6Z" fill="#B8332A" opacity=".62"/>
<path d="M292.9 606.2L912.8 606.2L896.8 587.1L308.6 587.1Z" fill="#B8332A" opacity=".62"/>
<path d="M60 890L275.4 627.6 M87.2 890L291.8 627.6 M114.5 890L308.1 627.6 M141.8 890L324.5 627.6 M169 890L340.9 627.6 M196.2 890L357.3 627.6 M223.5 890L373.7 627.6 M250.8 890L390 627.6 M278 890L406.4 627.6 M305.2 890L422.8 627.6 M332.5 890L439.2 627.6 M359.8 890L455.6 627.6 M387 890L472 627.6 M414.2 890L488.3 627.6 M441.5 890L504.7 627.6 M468.8 890L521.1 627.6 M496 890L537.5 627.6 M523.2 890L553.9 627.6 M550.5 890L570.2 627.6 M577.8 890L586.6 627.6 M605 890L603 627.6 M632.2 890L619.4 627.6 M659.5 890L635.8 627.6 M686.8 890L652.1 627.6 M714 890L668.5 627.6 M741.2 890L684.9 627.6 M768.5 890L701.3 627.6 M795.8 890L717.7 627.6 M823 890L734.1 627.6 M850.2 890L750.4 627.6 M877.5 890L766.8 627.6 M904.8 890L783.2 627.6 M932 890L799.6 627.6 M959.2 890L816 627.6 M986.5 890L832.3 627.6 M1013.8 890L848.7 627.6 M1041 890L865.1 627.6 M1068.2 890L881.5 627.6 M1095.5 890L897.9 627.6 M1122.8 890L914.3 627.6 M1150 890L930.6 627.6" fill="none" stroke="#FFFFFF" strokeOpacity=".13" strokeWidth="1.1"/>
      {/* the light the cloth is wearing, laid over the weave rather than
           under it, because a shadow falls on the pattern */}
      <rect x="40" y="540" width="1140" height="380" fill="url(#pk-clothWarm)"/>
      <rect x="40" y="540" width="1140" height="380" fill="url(#pk-clothShade)"/>
      {/* folds: cloth that has been carried here in a bag. They run with
           the weave, because a crease follows the threads */}
      <g filter="url(#pk-softSm)" opacity=".5">
        <path d="M496 570 L466 890 l26 0 L520 570 Z" fill="#FFFFFF" opacity=".5"/>
        <path d="M520 570 L492 890 l18 0 L536 570 Z" fill="#4A4270" opacity=".35"/>
        <path d="M770 570 L826 890 l24 0 L792 570 Z" fill="#FFFFFF" opacity=".4"/>
        <path d="M792 570 L850 890 l16 0 L808 570 Z" fill="#4A4270" opacity=".3"/>
        <path d="M60 744 L1150 744 l0 16 L60 760 Z" fill="#4A4270" opacity=".22"/>
        <path d="M60 736 L1150 736 l0 9 L60 745 Z" fill="#FFFFFF" opacity=".32"/>
      </g>
    </g>
    {/* hem */}
    <path d="M60 898.6Q101 898.4 150.8 904.1Q198.1 901.1 241.7 899.4Q285.2 895.6 332.5 890.1Q377.4 894.9 423.3 903.7Q471.7 906.1 514.2 904.5Q557 898.8 605 891.6Q650.7 897.4 695.8 895.7Q743.5 896.9 786.7 902.3Q836.9 898.5 877.5 902.2Q922.1 898.6 968.3 889.8Q1010.3 892.6 1059.2 895.7Q1100 902.7 1150 906.4Q1136.7 876.1 1118 844.3Q1096.2 819.5 1066.9 798.5Q1052.3 776.6 1033.7 752.8Q1018.7 729.5 1002.1 707Q983 688.6 957.1 661.3Q938.9 640.1 921.2 615.6Q899.2 594.7 886 569.8Q885.6 575.2 882.4 570.7Q845.6 568.7 802.4 571Q761.3 574.3 722.5 574.2Q677.7 569.9 642.5 566.2Q599.2 561.6 562.6 564.5Q518.2 569.6 482.7 569.2Q439 568.5 402.7 572.8Q361.6 575.8 322.8 571.4Q301.1 593 287.9 615.6Q268.7 642.3 248.6 661.3Q230.5 687.8 206.1 707Q188.2 729.1 174.6 752.8Q155.1 779.5 138.4 798.5Q118.9 817.9 90.2 844.3Z" fill="none" stroke="#9A8C74" strokeOpacity=".55" strokeWidth="2.6"/>
    <path d="M60 898.6Q101 898.4 150.8 904.1Q198.1 901.1 241.7 899.4Q285.2 895.6 332.5 890.1Q377.4 894.9 423.3 903.7Q471.7 906.1 514.2 904.5Q557 898.8 605 891.6Q650.7 897.4 695.8 895.7Q743.5 896.9 786.7 902.3Q836.9 898.5 877.5 902.2Q922.1 898.6 968.3 889.8Q1010.3 892.6 1059.2 895.7Q1100 902.7 1150 906.4Q1136.7 876.1 1118 844.3Q1096.2 819.5 1066.9 798.5Q1052.3 776.6 1033.7 752.8Q1018.7 729.5 1002.1 707Q983 688.6 957.1 661.3Q938.9 640.1 921.2 615.6Q899.2 594.7 886 569.8Q885.6 575.2 882.4 570.7Q845.6 568.7 802.4 571Q761.3 574.3 722.5 574.2Q677.7 569.9 642.5 566.2Q599.2 561.6 562.6 564.5Q518.2 569.6 482.7 569.2Q439 568.5 402.7 572.8Q361.6 575.8 322.8 571.4Q301.1 593 287.9 615.6Q268.7 642.3 248.6 661.3Q230.5 687.8 206.1 707Q188.2 729.1 174.6 752.8Q155.1 779.5 138.4 798.5Q118.9 817.9 90.2 844.3Z" fill="none" stroke="#FFF6DC" strokeOpacity=".5" strokeWidth="1.1"
          transform="translate(1.5,-1.5)"/>
  </g>

  {/* the far-left corner, turned back on itself. The flap is the corner
       REFLECTED in the fold line, so it is a shape this blanket could
       actually make; the pale side is the plain backing. */}
  <g className="cornerFlap" {...prop("The turned-back corner of the blanket. Click to send a gust across it.", sendGust)}>
    <path d="M448.8 570.8Q415.5 610.2 368.2 667.7Q298.1 672.8 243.9 665.9Z" fill="#2E3A52" opacity=".3" filter="url(#pk-softSm)" transform="translate(-9,7)"/>
    <path d="M448.8 570.8Q415.5 610.2 368.2 667.7Q298.1 672.8 243.9 665.9Z" fill="url(#pk-clothBack)"/>
    <path d="M448.8 570.8L243.9 665.9" fill="none" stroke="#B5A78F" strokeOpacity=".7" strokeWidth="2.4"/>
    <path d="M448.8 570.8L243.9 665.9" fill="none" stroke="#FFF8E4" strokeOpacity=".75" strokeWidth="1.2"
          transform="translate(.8,-1.6)"/>
  </g>
</g>


{/* ══════════════════════════════════════════════════════════════════════
     9. WHAT THE PICNIC BROUGHT WITH IT

     None of this is rubbish, and all of it is drawn in millimetres at its
     real size — the hat really is 380mm across and the football really is
     220 — so the only thing deciding how big each one looks is where on
     the lawn it is standing.
     ══════════════════════════════════════════════════════════════════════ */}

{/* ── the basket ─────────────────────────────────────────────────────── */}
<g transform="translate(408,662) scale(0.301)">
  <ellipse cx="-241.8" cy="96.2" rx="440" ry="176" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -241.8 96.2)"/>
  <ellipse cx="0" cy="0" rx="220" ry="46" fill="url(#pk-occl)"/>
  <path d="M-165 0 L165 0 L200 -248 L-200 -248 Z" fill="url(#pk-wicker)"/>
  <g clipPath="url(#pk-basketClip)">
    <path d="M-141 -12 L-172 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-123.4 -12 L-150.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-105.8 -12 L-129 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-88.1 -12 L-107.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-70.5 -12 L-86 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-52.9 -12 L-64.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-35.3 -12 L-43 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-17.6 -12 L-21.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M0 -12 L0 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M17.6 -12 L21.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M35.3 -12 L43 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M52.9 -12 L64.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M70.5 -12 L86 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M88.1 -12 L107.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M105.8 -12 L129 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M123.4 -12 L150.5 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M141 -12 L172 -248" stroke="#8A6430" strokeOpacity=".5" strokeWidth="7" fill="none"/>
    <path d="M-196.3 -26 Q-184.1 -39 -171.8 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-196.3 -29 Q-184.1 -41 -171.8 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-147.2 -26 Q-135 -39 -122.7 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-147.2 -29 Q-135 -41 -122.7 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-98.2 -26 Q-85.9 -39 -73.6 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-98.2 -29 Q-85.9 -41 -73.6 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-49.1 -26 Q-36.8 -39 -24.5 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-49.1 -29 Q-36.8 -41 -24.5 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M0 -26 Q12.3 -39 24.5 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M0 -29 Q12.3 -41 24.5 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M49.1 -26 Q61.4 -39 73.6 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M49.1 -29 Q61.4 -41 73.6 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M98.2 -26 Q110.4 -39 122.7 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M98.2 -29 Q110.4 -41 122.7 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M147.2 -26 Q159.5 -39 171.8 -26" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M147.2 -29 Q159.5 -41 171.8 -29" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-168.1 -56 Q-156.1 -69 -144.1 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-168.1 -59 Q-156.1 -71 -144.1 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-120.1 -56 Q-108.1 -69 -96 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-120.1 -59 Q-108.1 -71 -96 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-72 -56 Q-60 -69 -48 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-72 -59 Q-60 -71 -48 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-24 -56 Q-12 -69 0 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-24 -59 Q-12 -71 0 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M24 -56 Q36 -69 48 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M24 -59 Q36 -71 48 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M72 -56 Q84 -69 96 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M72 -59 Q84 -71 96 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M120.1 -56 Q132.1 -69 144.1 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M120.1 -59 Q132.1 -71 144.1 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M168.1 -56 Q180.1 -69 192.1 -56" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M168.1 -59 Q180.1 -71 192.1 -59" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-187.9 -86 Q-176.1 -99 -164.4 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-187.9 -89 Q-176.1 -101 -164.4 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-140.9 -86 Q-129.2 -99 -117.4 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-140.9 -89 Q-129.2 -101 -117.4 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-93.9 -86 Q-82.2 -99 -70.4 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-93.9 -89 Q-82.2 -101 -70.4 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-47 -86 Q-35.2 -99 -23.5 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-47 -89 Q-35.2 -101 -23.5 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M0 -86 Q11.7 -99 23.5 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M0 -89 Q11.7 -101 23.5 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M47 -86 Q58.7 -99 70.4 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M47 -89 Q58.7 -101 70.4 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M93.9 -86 Q105.7 -99 117.4 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M93.9 -89 Q105.7 -101 117.4 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M140.9 -86 Q152.6 -99 164.4 -86" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M140.9 -89 Q152.6 -101 164.4 -89" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-160.7 -116 Q-149.2 -129 -137.7 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-160.7 -119 Q-149.2 -131 -137.7 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-114.8 -116 Q-103.3 -129 -91.8 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-114.8 -119 Q-103.3 -131 -91.8 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-68.9 -116 Q-57.4 -129 -45.9 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-68.9 -119 Q-57.4 -131 -45.9 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-23 -116 Q-11.5 -129 0 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-23 -119 Q-11.5 -131 0 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M23 -116 Q34.4 -129 45.9 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M23 -119 Q34.4 -131 45.9 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M68.9 -116 Q80.3 -129 91.8 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M68.9 -119 Q80.3 -131 91.8 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M114.8 -116 Q126.2 -129 137.7 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M114.8 -119 Q126.2 -131 137.7 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M160.7 -116 Q172.2 -129 183.6 -116" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M160.7 -119 Q172.2 -131 183.6 -119" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-179.4 -146 Q-168.2 -159 -157 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-179.4 -149 Q-168.2 -161 -157 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-134.5 -146 Q-123.3 -159 -112.1 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-134.5 -149 Q-123.3 -161 -112.1 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-89.7 -146 Q-78.5 -159 -67.3 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-89.7 -149 Q-78.5 -161 -67.3 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-44.8 -146 Q-33.6 -159 -22.4 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-44.8 -149 Q-33.6 -161 -22.4 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M0 -146 Q11.2 -159 22.4 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M0 -149 Q11.2 -161 22.4 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M44.8 -146 Q56.1 -159 67.3 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M44.8 -149 Q56.1 -161 67.3 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M89.7 -146 Q100.9 -159 112.1 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M89.7 -149 Q100.9 -161 112.1 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M134.5 -146 Q145.8 -159 157 -146" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M134.5 -149 Q145.8 -161 157 -149" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-153.3 -176 Q-142.3 -189 -131.4 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-153.3 -179 Q-142.3 -191 -131.4 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-109.5 -176 Q-98.5 -189 -87.6 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-109.5 -179 Q-98.5 -191 -87.6 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-65.7 -176 Q-54.7 -189 -43.8 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-65.7 -179 Q-54.7 -191 -43.8 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-21.9 -176 Q-10.9 -189 0 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-21.9 -179 Q-10.9 -191 0 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M21.9 -176 Q32.8 -189 43.8 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M21.9 -179 Q32.8 -191 43.8 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M65.7 -176 Q76.6 -189 87.6 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M65.7 -179 Q76.6 -191 87.6 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M109.5 -176 Q120.4 -189 131.4 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M109.5 -179 Q120.4 -191 131.4 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M153.3 -176 Q164.2 -189 175.2 -176" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M153.3 -179 Q164.2 -191 175.2 -179" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-170.9 -206 Q-160.2 -219 -149.6 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-170.9 -209 Q-160.2 -221 -149.6 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-128.2 -206 Q-117.5 -219 -106.8 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-128.2 -209 Q-117.5 -221 -106.8 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-85.5 -206 Q-74.8 -219 -64.1 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-85.5 -209 Q-74.8 -221 -64.1 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-42.7 -206 Q-32 -219 -21.4 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-42.7 -209 Q-32 -221 -21.4 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M0 -206 Q10.7 -219 21.4 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M0 -209 Q10.7 -221 21.4 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M42.7 -206 Q53.4 -219 64.1 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M42.7 -209 Q53.4 -221 64.1 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M85.5 -206 Q96.1 -219 106.8 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M85.5 -209 Q96.1 -221 106.8 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M128.2 -206 Q138.9 -219 149.6 -206" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M128.2 -209 Q138.9 -221 149.6 -209" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-145.9 -236 Q-135.4 -249 -125 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-145.9 -239 Q-135.4 -251 -125 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-104.2 -236 Q-93.8 -249 -83.3 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-104.2 -239 Q-93.8 -251 -83.3 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-62.5 -236 Q-52.1 -249 -41.7 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-62.5 -239 Q-52.1 -251 -41.7 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M-20.8 -236 Q-10.4 -249 0 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M-20.8 -239 Q-10.4 -251 0 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M20.8 -236 Q31.3 -249 41.7 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M20.8 -239 Q31.3 -251 41.7 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M62.5 -236 Q72.9 -249 83.3 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M62.5 -239 Q72.9 -251 83.3 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M104.2 -236 Q114.6 -249 125 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M104.2 -239 Q114.6 -251 125 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
    <path d="M145.9 -236 Q156.3 -249 166.7 -236" fill="none" stroke="#E0B66E" strokeWidth="13" strokeLinecap="round"/>
    <path d="M145.9 -239 Q156.3 -251 166.7 -239" fill="none" stroke="#F2D29A" strokeOpacity=".55" strokeWidth="4"/>
  </g>
  <path d="M-165 0 L-118 0 L-150 -248 L-200 -248 Z" fill="#5E4420" opacity=".42"/>
  <path d="M132 0 L165 0 L200 -248 L158 -248 Z" fill="#FFE2A8" opacity=".38"/>
  <ellipse cx="0" cy="-248" rx="200" ry="52" fill="#B98A46"/>
  <ellipse cx="0" cy="-252" rx="200" ry="52" fill="#D8A961"/>
  <ellipse cx="0" cy="-252" rx="200" ry="52" fill="none" stroke="#F6DCA6" strokeOpacity=".8" strokeWidth="7"/>
  <ellipse cx="0" cy="-248" rx="168" ry="40" fill="#5A4322"/>
  {/* the lid, one half tipped back, and a corner of cloth escaping */}
  <path d="M-196 -258 q94 -34 196 -34 q26 0 40 4 l-14 26 q-100 -16 -222 22 Z" fill="#C69A54"/>
  <path d="M-196 -258 q94 -34 196 -34" fill="none" stroke="#F4DAA4" strokeOpacity=".8" strokeWidth="6"/>
  <g transform="rotate(-54 34 -262)">
    <path d="M34 -262 q96 -8 176 6 l-4 30 q-84 -18 -172 -8 Z" fill="#B98A46"/>
    <path d="M34 -262 q96 -8 176 6" fill="none" stroke="#EFD299" strokeOpacity=".7" strokeWidth="6"/>
  </g>
  <path d="M-150 -248 q54 34 128 22 q64 -10 96 -36 q-18 58 -96 70 q-84 12 -128 -56 Z"
        fill="#F2E6CE"/>
  <path d="M-150 -248 q54 34 128 22 q64 -10 96 -36 q-10 30 -44 50 q-70 -6 -180 -36 Z"
        fill="#C0392B" opacity=".42"/>
  <path d="M-114 -212 q56 22 118 12" fill="none" stroke="#C0392B" strokeOpacity=".4" strokeWidth="9"/>
</g>

{/* ── the flask and a cup of tea ─────────────────────────────────────── */}
<g transform="translate(258,708) scale(0.3332)">
  <ellipse cx="-260.4" cy="103.6" rx="321.4" ry="40.5" fill="url(#pk-shadow)" opacity="1" transform="rotate(158.3 -260.4 103.6)"/>
  <ellipse cx="0" cy="0" rx="52.8" ry="16" fill="url(#pk-occl)"/>
  <path d="M-46 0 h92 v-232 h-92 Z" fill="url(#pk-steel)"/>
  <ellipse cx="0" cy="-232" rx="46" ry="11" fill="#C6D0D8"/>
  <path d="M-46 -120 h92 v46 h-92 Z" fill="#2E6B4E"/>
  <path d="M-46 -120 h13 v46 h-13 Z" fill="#6FA98A" opacity=".55"/>
  <path d="M-46 -120 h92" fill="none" stroke="#9AD8B8" strokeOpacity=".6" strokeWidth="3"/>
  <path d="M-40 -240 h80 v-32 q0 -10 -12 -10 h-56 q-12 0 -12 10 Z" fill="#3A4450"/>
  <path d="M-40 -240 h16 v-40 h-10 q-6 2 -6 10 Z" fill="#78848E" opacity=".7"/>
  <ellipse cx="0" cy="-282" rx="40" ry="10" fill="#4E5A66"/>
  <ellipse cx="0" cy="-284" rx="40" ry="10" fill="#5E6A76"/>
  <path d="M30 -232 v232" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="7" fill="none"/>
  <path d="M-34 -232 v232" stroke="#2E3840" strokeOpacity=".35" strokeWidth="10" fill="none"/>
</g>
<g transform="translate(344,748) scale(0.3612)">
  <ellipse cx="-78.1" cy="31.1" rx="127.2" ry="42.2" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -78.1 31.1)"/>
  <ellipse cx="0" cy="0" rx="52.8" ry="16" fill="url(#pk-occl)"/>
  <path d="M-45 0 q-6 -56 2 -76 h86 q8 20 2 76 Z" fill="#F4F6F4"/>
  <path d="M-45 0 q-6 -56 2 -76 h22 q-6 22 -2 76 Z" fill="#FFFFFF"/>
  <path d="M34 -76 q8 20 2 76 h-20 q6 -52 -0 -76 Z" fill="#C2CCC8" opacity=".7"/>
  <ellipse cx="0" cy="-76" rx="45" ry="12" fill="#DCE4E0"/>
  <ellipse cx="0" cy="-76" rx="45" ry="12" fill="none" stroke="#2E5E8E" strokeOpacity=".55" strokeWidth="5"/>
  <ellipse cx="0" cy="-74" rx="35" ry="8.5" fill="#8A5A2E"/>
  <ellipse cx="-9" cy="-76" rx="15" ry="3.6" fill="#C48A50" opacity=".55"/>
  <path d="M44 -58 q34 -4 32 24 q-2 24 -32 22" fill="none" stroke="#F4F6F4" strokeWidth="12"/>
  <g className="steam" style={{ animationDelay: ".4s" }}>
    <path d="M-8 -84 q16 -22 0 -44 q-14 -20 4 -38" fill="none" stroke="#FFF6E2"
          strokeOpacity=".8" strokeWidth="7" strokeLinecap="round"/>
  </g>
  <g className="steam" style={{ animationDelay: "3.1s" }}>
    <path d="M16 -82 q14 -20 2 -40" fill="none" stroke="#FFF6E2"
          strokeOpacity=".7" strokeWidth="6" strokeLinecap="round"/>
  </g>
</g>

{/* ── strawberries ───────────────────────────────────────────────────── */}
<g transform="translate(624,648) scale(0.2912)">
  <ellipse cx="-74.4" cy="29.6" rx="179" ry="96.8" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -74.4 29.6)"/>
  <ellipse cx="0" cy="0" rx="121" ry="26" fill="url(#pk-occl)"/>
  <path d="M-110 -18 q0 -52 110 -52 q110 0 110 52 q-12 20 -110 20 q-98 0 -110 -20 Z" fill="#E4E8EA"/>
  <path d="M-110 -18 q12 20 110 20 q98 0 110 -20 q0 22 -110 22 q-110 0 -110 -22 Z" fill="#A8B2B8"/>
  <ellipse cx="0" cy="-70" rx="110" ry="30" fill="#F4F7F8"/>
  <ellipse cx="0" cy="-70" rx="110" ry="30" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="5"/>
  <ellipse cx="0" cy="-68" rx="92" ry="23" fill="#C8D2D6"/>
  <g>
    <path d="M-52 -84 q22 -16 40 2 q10 22 -20 32 q-30 -6 -20 -34 Z" fill="#D8322A"/>
    <path d="M-52 -84 q22 -16 40 2 q-4 6 -20 6 q-14 0 -20 -8 Z" fill="#F0685C"/>
    <path d="M-40 -92 q14 -10 26 -2 q-12 8 -26 2 Z" fill="#3F7A2E"/>
    <path d="M6 -90 q24 -18 42 2 q10 24 -22 34 q-32 -6 -20 -36 Z" fill="#C0392B"/>
    <path d="M6 -90 q24 -18 42 2 q-6 6 -22 6 q-14 0 -20 -8 Z" fill="#E4564A"/>
    <path d="M20 -98 q14 -10 26 -2 q-12 8 -26 2 Z" fill="#478A32"/>
    <path d="M-18 -74 q24 -16 42 4 q8 22 -22 30 q-30 -8 -20 -34 Z" fill="#E4453A"/>
    <path d="M-18 -74 q24 -16 42 4 q-6 6 -22 5 q-14 -1 -20 -9 Z" fill="#FA8074"/>
    <path d="M56 -76 q20 -14 36 2 q8 20 -18 28 q-28 -6 -18 -30 Z" fill="#D8322A"/>
    <path d="M-86 -72 q18 -12 32 2 q8 18 -16 26 q-26 -6 -16 -28 Z" fill="#C0392B"/>
  </g>
</g>

{/* ── someone's paperback, face down so it keeps its place ────────────── */}
<g transform="translate(820,672) scale(0.308)" >
  <g transform="rotate(-9)">
    <ellipse cx="-35.3" cy="14.1" rx="173" ry="132" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -35.3 14.1)"/>
    <ellipse cx="0" cy="0" rx="165" ry="22" fill="url(#pk-occl)"/>
    <path d="M-150 0 q6 -34 4 -46 l292 -10 q4 14 2 46 Z" fill="#E8E2D2"/>
    <path d="M-146 -46 l292 -10 q-146 -22 -292 10 Z" fill="#FAF6EA"/>
    <g stroke="#C8C0AE" strokeWidth="2.4">
      <path d="M-144 -38 l288 -10 M-144 -30 l288 -10 M-145 -22 l289 -10 M-146 -14 l290 -10"/>
    </g>
    <path d="M-8 -50 q10 -22 8 -34 l14 42 Z" fill="#2E5E8E"/>
    <path d="M-150 0 q6 -34 4 -46 l32 -1 q-4 16 -2 47 Z" fill="#B23A2E"/>
    <path d="M-150 0 q6 -34 4 -46 l10 0 q-4 16 -2 46 Z" fill="#D8584A"/>
  </g>
</g>

{/* ── the hat ────────────────────────────────────────────────────────── */}
<g transform="translate(196,840) scale(0.4256)">
  <ellipse cx="-102.3" cy="40.7" rx="281" ry="167.2" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -102.3 40.7)"/>
  <ellipse cx="0" cy="-8" rx="190" ry="62" fill="#1F2A46" opacity=".26"/>
  <ellipse cx="0" cy="-22" rx="190" ry="62" fill="#D6B26A"/>
  <ellipse cx="0" cy="-26" rx="190" ry="62" fill="#E8C87E"/>
  <g fill="none" stroke="#B08F48" strokeOpacity=".6" strokeWidth="3">
    <ellipse cx="0" cy="-26" rx="160" ry="52"/><ellipse cx="0" cy="-26" rx="128" ry="42"/>
    <ellipse cx="0" cy="-26" rx="96" ry="31"/><ellipse cx="0" cy="-26" rx="64" ry="21"/>
  </g>
  <ellipse cx="0" cy="-26" rx="190" ry="62" fill="none" stroke="#FFF0BE" strokeOpacity=".7" strokeWidth="5"/>
  <path d="M-96 -34 q0 -76 96 -76 q96 0 96 76 q-40 26 -96 26 q-56 0 -96 -26 Z" fill="#E0BC70"/>
  <path d="M-96 -34 q0 -76 96 -76 q22 0 40 5 q-72 18 -70 90 q-42 -4 -66 -19 Z" fill="#C49C50" opacity=".55"/>
  <path d="M36 -110 q60 14 60 76 q-22 14 -54 21 q14 -66 -6 -97 Z" fill="#FFE8AA" opacity=".55"/>
  <path d="M-98 -52 q42 22 98 22 q56 0 98 -22 l2 22 q-42 22 -100 22 q-58 0 -100 -22 Z" fill="#2E5E8E"/>
  <path d="M-98 -52 q42 22 98 22 q56 0 98 -22 l1 10 q-44 22 -99 22 q-55 0 -99 -22 Z" fill="#4C84BA" opacity=".7"/>
</g>

{/* ── a football, out on the grass ───────────────────────────────────── */}
<g transform="translate(1104,606) scale(0.2618)">
  <ellipse cx="-204.6" cy="81.4" rx="319" ry="96.8" fill="url(#pk-shadow)" opacity="1" transform="rotate(158.3 -204.6 81.4)"/>
  <ellipse cx="0" cy="0" rx="110" ry="24" fill="url(#pk-occl)"/>
  <circle cx="0" cy="-110" r="110" fill="#EDEFF0"/>
  <path d="M-110 -110 a110 110 0 0 1 86 -107 a110 110 0 0 0 -60 190 Z" fill="#B9C0C6" opacity=".7"/>
  <path d="M42 -212 a110 110 0 0 1 66 76 a110 110 0 0 0 -52 -88 Z" fill="#FFFFFF"/>
  <circle cx="0" cy="-110" r="110" fill="url(#pk-ballLight)"/>
  <g fill="#2B3138">
    <path d="M0 -158 l40 30 l-15 47 h-50 l-15 -47 Z"/>
    <path d="M-44 -196 l-30 22 l14 30 l42 -30 Z" opacity=".9"/>
    <path d="M60 -180 l26 30 l-22 26 l-32 -32 Z" opacity=".85"/>
    <path d="M-38 -34 l14 -26 h46 l12 25 q-36 12 -72 1 Z" opacity=".8"/>
  </g>
</g>

{/* ── lemonade ───────────────────────────────────────────────────────── */}
<g transform="translate(748,800) scale(0.3976)">
  <ellipse cx="-243.7" cy="96.9" rx="299.8" ry="37" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -243.7 96.9)"/>
  <ellipse cx="0" cy="0" rx="49.5" ry="14" fill="url(#pk-occl)"/>
  <path d="M-42 0 h84 v-150 q0 -34 -16 -52 l-8 -46 h-36 l-8 46 q-16 18 -16 52 Z" fill="#F2C24A" opacity=".88"/>
  <path d="M-42 0 h22 v-150 q0 -34 12 -52 l4 -46 h-18 l-8 46 q-16 18 -16 52 Z" fill="#FFF0A8" opacity=".8"/>
  <path d="M42 0 h-16 v-150 q0 -34 -10 -52 l-4 -46 h14 l8 46 q16 18 16 52 Z" fill="#B8862A" opacity=".55"/>
  <path d="M-26 -248 h52 v-16 h-52 Z" fill="#C8952E"/>
  <path d="M-26 -264 h52 v-18 q0 -6 -8 -6 h-36 q-8 0 -8 6 Z" fill="#E8D8B8"/>
  <path d="M-26 -264 h14 v-24 h-6 q-8 0 -8 6 Z" fill="#FFFAEC"/>
  <path d="M-40 -136 h80 v70 h-80 Z" fill="#FAF2DC"/>
  <path d="M-40 -136 h18 v70 h-18 Z" fill="#FFFFFF" opacity=".8"/>
  <path d="M-30 -122 h60 M-30 -108 h44 M-30 -94 h52" stroke="#C88A2E" strokeWidth="6" strokeLinecap="round"/>
  <path d="M-30 -80 h36" stroke="#2E5E8E" strokeOpacity=".7" strokeWidth="6" strokeLinecap="round"/>
</g>
<g transform="translate(690,818) scale(0.4102)">
  <ellipse cx="-93" cy="37" rx="134.2" ry="33.4" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -93 37)"/>
  <ellipse cx="0" cy="0" rx="40.7" ry="12" fill="url(#pk-occl)"/>
  <path d="M-34 0 q-4 -70 2 -92 h64 q6 22 2 92 Z" fill="#DCE8EE" opacity=".62"/>
  <path d="M-32 -30 q-2 -44 0 -60 h60 q2 16 0 60 Z" fill="#F2C24A" opacity=".8"/>
  <ellipse cx="0" cy="-92" rx="34" ry="9" fill="#EEF6FA" opacity=".8"/>
  <ellipse cx="0" cy="-90" rx="30" ry="7" fill="#F8D96A" opacity=".9"/>
  <path d="M-26 -88 q-4 50 -2 84" fill="none" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="7"/>
</g>

{/* ── the speaker, the one thing here with a switch ───────────────────── */}
<g {...prop("A portable speaker. Click to wake it up.", toggleSpeaker)} transform="translate(930,736) scale(0.3528)">
  <ellipse cx="-96.7" cy="38.5" rx="212" ry="105.6" fill="url(#pk-shadowCloth)" opacity="1" transform="rotate(158.3 -96.7 38.5)"/>
  <ellipse cx="0" cy="0" rx="132" ry="24" fill="url(#pk-occl)"/>
  <g id="pk-speakerGlow">
    <ellipse cx="0" cy="-52" rx="230" ry="120" fill="#4CC8F0" opacity=".2"/>
  </g>
  <path d="M-120 0 q-8 -104 0 -104 h240 q8 0 0 104 Z" fill="#59636F"/>
  <path d="M-120 -104 h240 q6 0 4 26 h-248 q-2 -26 4 -26 Z" fill="#8792A0"/>
  <path d="M-120 -104 h30 q-4 12 -3 104 h-27 q-8 -104 0 -104 Z" fill="#96A2AE" opacity=".55"/>
  <path d="M96 -104 h24 q8 0 0 104 h-22 q3 -92 -2 -104 Z" fill="#232B34" opacity=".7"/>
  <path d="M-104 -90 h208 v72 h-208 Z" fill="#333C46"/>
  <path d="M-104 -90 h208 v10 h-208 Z" fill="#4A545F"/>
  <circle cx="-136" cy="-22" r="7" fill="#7FE8A8"/>
  <circle cx="-136" cy="-52" r="9" fill="#46505C"/>
  <circle cx="-136" cy="-52" r="9" fill="none" stroke="#A2AEBA" strokeOpacity=".7" strokeWidth="2"/>
  <g fill="#5C6874">
    <circle cx="-86" cy="-74" r="5"/><circle cx="-62" cy="-74" r="5"/><circle cx="-38" cy="-74" r="5"/>
    <circle cx="-14" cy="-74" r="5"/><circle cx="10" cy="-74" r="5"/><circle cx="34" cy="-74" r="5"/>
    <circle cx="58" cy="-74" r="5"/><circle cx="82" cy="-74" r="5"/>
    <circle cx="-86" cy="-54" r="5"/><circle cx="-62" cy="-54" r="5"/><circle cx="-38" cy="-54" r="5"/>
    <circle cx="-14" cy="-54" r="5"/><circle cx="10" cy="-54" r="5"/><circle cx="34" cy="-54" r="5"/>
    <circle cx="58" cy="-54" r="5"/><circle cx="82" cy="-54" r="5"/>
    <circle cx="-86" cy="-34" r="5"/><circle cx="-62" cy="-34" r="5"/><circle cx="-38" cy="-34" r="5"/>
    <circle cx="-14" cy="-34" r="5"/><circle cx="10" cy="-34" r="5"/><circle cx="34" cy="-34" r="5"/>
    <circle cx="58" cy="-34" r="5"/><circle cx="82" cy="-34" r="5"/>
  </g>
  <g id="pk-speakerBars" fill="#4CC8F0">
    <rect className="bar" x="-40" y="-84" width="12" height="60" style={{ animationDelay: "0s" }}/>
    <rect className="bar" x="-20" y="-84" width="12" height="60" style={{ animationDelay: ".14s" }}/>
    <rect className="bar" x="0"   y="-84" width="12" height="60" style={{ animationDelay: ".28s" }}/>
    <rect className="bar" x="20"  y="-84" width="12" height="60" style={{ animationDelay: ".09s" }}/>
    <rect className="bar" x="40"  y="-84" width="12" height="60" style={{ animationDelay: ".22s" }}/>
  </g>
  <circle cx="-138" cy="-64" r="0"/>
  <g id="pk-notes" fill="#8FE2FA">
    <g className="note" style={{ animationDelay: "0s" }}>
      <path d="M96 -120 v-52 l30 -8 v52 Z"/><ellipse cx="88" cy="-118" rx="14" ry="10"/>
    </g>
    <g className="note" style={{ animationDelay: "1.1s" }}>
      <path d="M40 -132 v-44 l26 -7 v44 Z"/><ellipse cx="33" cy="-130" rx="12" ry="9"/>
    </g>
    <g className="note" style={{ animationDelay: "2.2s" }}>
      <path d="M130 -110 v-40 l24 -6 v40 Z"/><ellipse cx="124" cy="-108" rx="11" ry="8"/>
    </g>
  </g>
</g>

{/* ══════════════════════════════════════════════════════════════════════
     10. THE LITTER — the five clues

     Same millimetres, same light. Two of these needed thinking about
     rather than drawing, because they have no silhouette of their own:

       · cling film is transparent AND shapeless, which is the worst
         possible pair of properties at this size. So it is drawn around
         the thing it was wrapped around: the sandwich supplies the
         outline, and the film reads off its creases and its highlights —
         which is exactly how you see cling film in life.
       · a chewed wad of gum is likewise a blob. So the wrapper does the
         identifying: a foil strip and a torn paper sleeve are a shape
         everybody knows, and the wad sits at the end of it.

     The other three have shapes of their own and only needed drawing
     honestly. The string and the paper tag are what make a tea bag a tea
     bag. The taper, and the fact that they are still joined at one end,
     are what make disposable chopsticks. And a lid peeled back and left
     standing off the rim is what makes a can look opened and abandoned
     rather than merely placed.
     ══════════════════════════════════════════════════════════════════════ */}

{/* ── p1 · PAPER TEA BAG · organic ─────────────────────────────────────
     Take one was a puffed-up sack. A used tea bag is FLAT — the water has
     gone out of it and taken its shape with it — heavy at the bottom
     where the leaf has settled, and pale and dry along the top fold. The
     string and the paper tag are what actually name it; without them this
     is a wet paper square. */}

{/* p1 is drawn by the screen */}


{/* ── p2 · WOODEN CHOPSTICKS · organic ───────────────────────────────── */}

{/* p2 is drawn by the screen */}


{/* ── p3 · CHEWING GUM · general ──────────────────────────────────────
     Take one: the sleeve was 128mm long, which is nearly twice the length
     of a real stick of gum, and at that proportion it stopped being a
     wrapper and became a pen. A stick of gum is 72 by 22, and drawn at 72
     by 22 it reads as what it is. The wad went the same way — a highlight
     on a round blob made a pearl — so it is flattened, dulled, and given
     the grey-pink of something that has been chewed and then trodden on. */}

{/* p3 is drawn by the screen */}


{/* ── p4 · STEEL SOUP CAN · recyclable ────────────────────────────────── */}

{/* p4 is drawn by the screen */}


{/* ── p5 · CLING WRAP · general ───────────────────────────────────────── */}

{/* p5 is drawn by the screen */}


{/* ══════════ 11. THE TREE'S SHADOW ══════════
     Drawn AFTER the blanket, because the blanket is lying IN it — put
     this down first and the cloth paints straight over the top of it and
     the tree ends up shading the lawn and not the thing in the middle of
     the lawn.

     Built from the crown's own lobes, projected onto the ground and
     stretched along the light, so it is recognisably the shadow of THIS
     tree and not a smudge. Two passes: a soft outer one for the
     penumbra, which is wide because the sun is a disc and the crown is a
     long way up, and a tighter darker core for the parts of it that are
     under the densest leaf. */}
<g pointerEvents="none">
  <g filter="url(#pk-shadeSoft)" fill="#1E3C56" opacity=".27">
<ellipse cx="747.4" cy="664.4" rx="265.7" ry="82" transform="rotate(-21 747.4 664.4)"/>
<ellipse cx="857.8" cy="646.8" rx="243" ry="75" transform="rotate(-21 857.8 646.8)"/>
<ellipse cx="633.6" cy="669.6" rx="168.5" ry="52" transform="rotate(-21 633.6 669.6)"/>
<ellipse cx="587.4" cy="656.4" rx="213.8" ry="66" transform="rotate(-21 587.4 656.4)"/>
<ellipse cx="482.2" cy="665.2" rx="126.4" ry="39" transform="rotate(-21 482.2 665.2)"/>
<ellipse cx="485.4" cy="648.4" rx="155.5" ry="48" transform="rotate(-21 485.4 648.4)"/>
<ellipse cx="390" cy="656" rx="103.7" ry="32" transform="rotate(-21 390 656)"/>
<ellipse cx="358.8" cy="644.8" rx="126.4" ry="39" transform="rotate(-21 358.8 644.8)"/>
<ellipse cx="730" cy="640" rx="191.2" ry="59" transform="rotate(-21 730 640)"/>
<ellipse cx="594.6" cy="635.6" rx="139.3" ry="43" transform="rotate(-21 594.6 635.6)"/>
<ellipse cx="472.6" cy="631.6" rx="100.4" ry="31" transform="rotate(-21 472.6 631.6)"/>
<ellipse cx="853.4" cy="628.4" rx="168.5" ry="52" transform="rotate(-21 853.4 628.4)"/>
<ellipse cx="295.8" cy="650.8" rx="71.3" ry="22" transform="rotate(-21 295.8 650.8)"/>
<ellipse cx="280" cy="640" rx="84.2" ry="26" transform="rotate(-21 280 640)"/>
<ellipse cx="890" cy="660" rx="207.4" ry="64" transform="rotate(-21 890 660)"/>
<ellipse cx="707.8" cy="622.8" rx="119.9" ry="37" transform="rotate(-21 707.8 622.8)"/>
<ellipse cx="575" cy="622" rx="87.5" ry="27" transform="rotate(-21 575 622)"/>
<ellipse cx="401.4" cy="628.4" rx="74.5" ry="23" transform="rotate(-21 401.4 628.4)"/>
<ellipse cx="828.6" cy="615.6" rx="100.4" ry="31" transform="rotate(-21 828.6 615.6)"/>
<ellipse cx="689.4" cy="612.4" rx="71.3" ry="22" transform="rotate(-21 689.4 612.4)"/>
  </g>
  <g filter="url(#pk-shadeCore)" fill="#1B3550" opacity=".21">
<ellipse cx="747.4" cy="664.4" rx="175.3" ry="49.8" transform="rotate(-21 747.4 664.4)"/>
<ellipse cx="857.8" cy="646.8" rx="160.4" ry="45.5" transform="rotate(-21 857.8 646.8)"/>
<ellipse cx="633.6" cy="669.6" rx="111.2" ry="31.6" transform="rotate(-21 633.6 669.6)"/>
<ellipse cx="587.4" cy="656.4" rx="141.1" ry="40.1" transform="rotate(-21 587.4 656.4)"/>
<ellipse cx="482.2" cy="665.2" rx="83.4" ry="23.7" transform="rotate(-21 482.2 665.2)"/>
<ellipse cx="485.4" cy="648.4" rx="102.6" ry="29.1" transform="rotate(-21 485.4 648.4)"/>
<ellipse cx="390" cy="656" rx="68.4" ry="19.4" transform="rotate(-21 390 656)"/>
<ellipse cx="358.8" cy="644.8" rx="83.4" ry="23.7" transform="rotate(-21 358.8 644.8)"/>
<ellipse cx="730" cy="640" rx="126.2" ry="35.8" transform="rotate(-21 730 640)"/>
<ellipse cx="594.6" cy="635.6" rx="92" ry="26.1" transform="rotate(-21 594.6 635.6)"/>
<ellipse cx="472.6" cy="631.6" rx="66.3" ry="18.8" transform="rotate(-21 472.6 631.6)"/>
<ellipse cx="853.4" cy="628.4" rx="111.2" ry="31.6" transform="rotate(-21 853.4 628.4)"/>
<ellipse cx="295.8" cy="650.8" rx="47" ry="13.4" transform="rotate(-21 295.8 650.8)"/>
<ellipse cx="280" cy="640" rx="55.6" ry="15.8" transform="rotate(-21 280 640)"/>
<ellipse cx="890" cy="660" rx="136.9" ry="38.9" transform="rotate(-21 890 660)"/>
<ellipse cx="707.8" cy="622.8" rx="79.1" ry="22.5" transform="rotate(-21 707.8 622.8)"/>
<ellipse cx="575" cy="622" rx="57.7" ry="16.4" transform="rotate(-21 575 622)"/>
<ellipse cx="401.4" cy="628.4" rx="49.2" ry="14" transform="rotate(-21 401.4 628.4)"/>
<ellipse cx="828.6" cy="615.6" rx="66.3" ry="18.8" transform="rotate(-21 828.6 615.6)"/>
<ellipse cx="689.4" cy="612.4" rx="47" ry="13.4" transform="rotate(-21 689.4 612.4)"/>
  </g>
  <path d="M1176 512 L1206 502 L508 644 L448 636 Z" fill="#1B3550" opacity=".24" filter="url(#pk-shadeCore)"/>
</g>

{/* ══════════════════════════════════════════════════════════════════════
     12. DAPPLE

     The gaps in that crown, projected onto the ground. They land down and
     to the LEFT of the leaves that made them, because the sun is up and to
     the right; they are stretched along that same direction because the
     light is raking the lawn at a shallow angle; and their edges are soft
     because the sun is a disc and not a point.

     Each blob is soft because of the gradient inside it, not because of a
     blur filter — a filter on this group would isolate it, and the screen
     blend would quietly stop doing anything at all.
     ══════════════════════════════════════════════════════════════════════ */}
<g className="dapple" pointerEvents="none" style={{ mixBlendMode: "screen" }}>
<ellipse cx="736.3" cy="554.9" rx="16.8" ry="7.7" fill="url(#pk-dappleG)" opacity="0.53" transform="rotate(30.6 736.3 554.9)"/>
<ellipse cx="959.8" cy="578.3" rx="9.1" ry="4.1" fill="url(#pk-dappleG)" opacity="0.55" transform="rotate(20.5 959.8 578.3)"/>
<ellipse cx="1100.6" cy="556.1" rx="21.1" ry="9.6" fill="url(#pk-dappleG)" opacity="0.53" transform="rotate(30.3 1100.6 556.1)"/>
<ellipse cx="729.8" cy="812.4" rx="35.3" ry="16" fill="url(#pk-dappleG)" opacity="0.62" transform="rotate(33.2 729.8 812.4)"/>
<ellipse cx="882.3" cy="773.2" rx="67.7" ry="30.8" fill="url(#pk-dappleG)" opacity="0.5" transform="rotate(35.2 882.3 773.2)"/>
<ellipse cx="503" cy="680" rx="12.5" ry="5.7" fill="url(#pk-dappleG)" opacity="0.35" transform="rotate(29.5 503 680)"/>
<ellipse cx="607.9" cy="806.8" rx="23.8" ry="10.8" fill="url(#pk-dappleG)" opacity="0.55" transform="rotate(32.8 607.9 806.8)"/>
<ellipse cx="953.7" cy="602.4" rx="28.9" ry="13.1" fill="url(#pk-dappleG)" opacity="0.41" transform="rotate(22.3 953.7 602.4)"/>
<ellipse cx="1052.9" cy="562.7" rx="6.2" ry="2.8" fill="url(#pk-dappleG)" opacity="0.45" transform="rotate(31.5 1052.9 562.7)"/>
<ellipse cx="642.6" cy="841.5" rx="14.6" ry="6.6" fill="url(#pk-dappleG)" opacity="0.47" transform="rotate(35.6 642.6 841.5)"/>
<ellipse cx="1046.1" cy="747.6" rx="12.3" ry="5.6" fill="url(#pk-dappleG)" opacity="0.36" transform="rotate(35.7 1046.1 747.6)"/>
<ellipse cx="898.6" cy="803.2" rx="21.8" ry="9.9" fill="url(#pk-dappleG)" opacity="0.81" transform="rotate(31.9 898.6 803.2)"/>
<ellipse cx="565.6" cy="882.5" rx="12.2" ry="5.6" fill="url(#pk-dappleG)" opacity="0.84" transform="rotate(21.1 565.6 882.5)"/>
<ellipse cx="876.2" cy="796.3" rx="71.5" ry="32.6" fill="url(#pk-dappleG)" opacity="0.74" transform="rotate(39 876.2 796.3)"/>
<ellipse cx="810.9" cy="671.2" rx="61.3" ry="27.9" fill="url(#pk-dappleG)" opacity="0.51" transform="rotate(23.9 810.9 671.2)"/>
<ellipse cx="743.5" cy="550.8" rx="39.2" ry="17.9" fill="url(#pk-dappleG)" opacity="0.82" transform="rotate(24.3 743.5 550.8)"/>
<ellipse cx="908.7" cy="565.2" rx="15.3" ry="7" fill="url(#pk-dappleG)" opacity="0.39" transform="rotate(30.9 908.7 565.2)"/>
<ellipse cx="778.7" cy="838.9" rx="50.7" ry="23.1" fill="url(#pk-dappleG)" opacity="0.54" transform="rotate(26.9 778.7 838.9)"/>
<ellipse cx="1099.8" cy="865.2" rx="40.3" ry="18.3" fill="url(#pk-dappleG)" opacity="0.79" transform="rotate(33.8 1099.8 865.2)"/>
<ellipse cx="662.2" cy="697" rx="22.7" ry="10.3" fill="url(#pk-dappleG)" opacity="0.43" transform="rotate(25.9 662.2 697)"/>
<ellipse cx="377.3" cy="695.9" rx="29.7" ry="13.5" fill="url(#pk-dappleG)" opacity="0.61" transform="rotate(31 377.3 695.9)"/>
<ellipse cx="1115.7" cy="843.5" rx="15.8" ry="7.2" fill="url(#pk-dappleG)" opacity="0.61" transform="rotate(36.7 1115.7 843.5)"/>
<ellipse cx="1068.3" cy="631.3" rx="48.9" ry="22.3" fill="url(#pk-dappleG)" opacity="0.34" transform="rotate(31.2 1068.3 631.3)"/>
<ellipse cx="849.5" cy="745" rx="17.8" ry="8.1" fill="url(#pk-dappleG)" opacity="0.55" transform="rotate(34.4 849.5 745)"/>
<ellipse cx="1155.7" cy="504.8" rx="10.6" ry="4.8" fill="url(#pk-dappleG)" opacity="0.73" transform="rotate(22.8 1155.7 504.8)"/>
<ellipse cx="912.1" cy="857" rx="12" ry="5.5" fill="url(#pk-dappleG)" opacity="0.55" transform="rotate(28.5 912.1 857)"/>
<ellipse cx="1194.7" cy="554" rx="20.6" ry="9.4" fill="url(#pk-dappleG)" opacity="0.56" transform="rotate(33.8 1194.7 554)"/>
<ellipse cx="503.5" cy="744" rx="13.2" ry="6" fill="url(#pk-dappleG)" opacity="0.79" transform="rotate(21.7 503.5 744)"/>
<ellipse cx="648.2" cy="860" rx="45.9" ry="20.9" fill="url(#pk-dappleG)" opacity="0.57" transform="rotate(35.5 648.2 860)"/>
<ellipse cx="612.3" cy="791.5" rx="14.5" ry="6.6" fill="url(#pk-dappleG)" opacity="0.49" transform="rotate(26 612.3 791.5)"/>
<ellipse cx="607.4" cy="887.1" rx="16.8" ry="7.6" fill="url(#pk-dappleG)" opacity="0.51" transform="rotate(28.4 607.4 887.1)"/>
<ellipse cx="404.4" cy="840.1" rx="13.7" ry="6.2" fill="url(#pk-dappleG)" opacity="0.45" transform="rotate(21.8 404.4 840.1)"/>
<ellipse cx="901.6" cy="617.9" rx="10.4" ry="4.7" fill="url(#pk-dappleG)" opacity="0.77" transform="rotate(30 901.6 617.9)"/>
<ellipse cx="767.7" cy="568.6" rx="16.4" ry="7.5" fill="url(#pk-dappleG)" opacity="0.54" transform="rotate(37.2 767.7 568.6)"/>
<ellipse cx="882.2" cy="635.9" rx="33.3" ry="15.2" fill="url(#pk-dappleG)" opacity="0.44" transform="rotate(39.7 882.2 635.9)"/>
<ellipse cx="968.2" cy="642.7" rx="12.9" ry="5.9" fill="url(#pk-dappleG)" opacity="0.38" transform="rotate(36.7 968.2 642.7)"/>
<ellipse cx="864" cy="558.5" rx="19.9" ry="9.1" fill="url(#pk-dappleG)" opacity="0.46" transform="rotate(21.6 864 558.5)"/>
<ellipse cx="461.2" cy="872.6" rx="28.9" ry="13.1" fill="url(#pk-dappleG)" opacity="0.39" transform="rotate(39.5 461.2 872.6)"/>
<ellipse cx="798.8" cy="871.5" rx="26.6" ry="12.1" fill="url(#pk-dappleG)" opacity="0.38" transform="rotate(34.6 798.8 871.5)"/>
<ellipse cx="873.3" cy="718.2" rx="26.7" ry="12.2" fill="url(#pk-dappleG)" opacity="0.61" transform="rotate(35.4 873.3 718.2)"/>
<ellipse cx="460.7" cy="841.8" rx="15.6" ry="7.1" fill="url(#pk-dappleG)" opacity="0.37" transform="rotate(21.8 460.7 841.8)"/>
<ellipse cx="533.1" cy="853.5" rx="12.7" ry="5.8" fill="url(#pk-dappleG)" opacity="0.53" transform="rotate(26.3 533.1 853.5)"/>
<ellipse cx="261.6" cy="772.8" rx="17.4" ry="7.9" fill="url(#pk-dappleG)" opacity="0.5" transform="rotate(33 261.6 772.8)"/>
<ellipse cx="671.2" cy="816" rx="54.5" ry="24.8" fill="url(#pk-dappleG)" opacity="0.47" transform="rotate(37.7 671.2 816)"/>
<ellipse cx="932.4" cy="894" rx="18.1" ry="8.2" fill="url(#pk-dappleG)" opacity="0.73" transform="rotate(36.6 932.4 894)"/>
<ellipse cx="877.6" cy="530.2" rx="11.4" ry="5.2" fill="url(#pk-dappleG)" opacity="0.7" transform="rotate(35.2 877.6 530.2)"/>
<ellipse cx="885.9" cy="742.6" rx="8.4" ry="3.8" fill="url(#pk-dappleG)" opacity="0.47" transform="rotate(28.5 885.9 742.6)"/>
<ellipse cx="1083.5" cy="842.3" rx="24.7" ry="11.2" fill="url(#pk-dappleG)" opacity="0.53" transform="rotate(24.9 1083.5 842.3)"/>
<ellipse cx="717.5" cy="658.9" rx="9.4" ry="4.3" fill="url(#pk-dappleG)" opacity="0.75" transform="rotate(31.5 717.5 658.9)"/>
<ellipse cx="465.2" cy="889.6" rx="23.7" ry="10.8" fill="url(#pk-dappleG)" opacity="0.64" transform="rotate(28.6 465.2 889.6)"/>
<ellipse cx="408.3" cy="787.2" rx="17.5" ry="8" fill="url(#pk-dappleG)" opacity="0.33" transform="rotate(36.8 408.3 787.2)"/>
<ellipse cx="770.7" cy="688.9" rx="7.4" ry="3.4" fill="url(#pk-dappleG)" opacity="0.51" transform="rotate(39.5 770.7 688.9)"/>
<ellipse cx="861" cy="814.6" rx="30.1" ry="13.7" fill="url(#pk-dappleG)" opacity="0.67" transform="rotate(25.5 861 814.6)"/>
<ellipse cx="800.9" cy="596.3" rx="17.8" ry="8.1" fill="url(#pk-dappleG)" opacity="0.58" transform="rotate(30.8 800.9 596.3)"/>
<ellipse cx="826.5" cy="574" rx="6.7" ry="3" fill="url(#pk-dappleG)" opacity="0.56" transform="rotate(22.9 826.5 574)"/>
<ellipse cx="660.1" cy="780.4" rx="31.5" ry="14.3" fill="url(#pk-dappleG)" opacity="0.63" transform="rotate(30.6 660.1 780.4)"/>
<ellipse cx="1164.5" cy="609.2" rx="11.9" ry="5.4" fill="url(#pk-dappleG)" opacity="0.84" transform="rotate(25.4 1164.5 609.2)"/>
<ellipse cx="544.1" cy="646.3" rx="29" ry="13.2" fill="url(#pk-dappleG)" opacity="0.46" transform="rotate(39.3 544.1 646.3)"/>
<ellipse cx="904.4" cy="519" rx="23.6" ry="10.8" fill="url(#pk-dappleG)" opacity="0.61" transform="rotate(38 904.4 519)"/>
<ellipse cx="664.7" cy="589.1" rx="20.5" ry="9.3" fill="url(#pk-dappleG)" opacity="0.36" transform="rotate(38.4 664.7 589.1)"/>
<ellipse cx="53.7" cy="890.3" rx="11" ry="5" fill="url(#pk-dappleG)" opacity="0.75" transform="rotate(21.6 53.7 890.3)"/>
<ellipse cx="978.7" cy="553.7" rx="44.9" ry="20.4" fill="url(#pk-dappleG)" opacity="0.65" transform="rotate(30.2 978.7 553.7)"/>
<ellipse cx="480.9" cy="641.2" rx="18.6" ry="8.5" fill="url(#pk-dappleG)" opacity="0.85" transform="rotate(32.9 480.9 641.2)"/>
<ellipse cx="940.4" cy="859.7" rx="33.2" ry="15.1" fill="url(#pk-dappleG)" opacity="0.34" transform="rotate(36.4 940.4 859.7)"/>
<ellipse cx="1220.5" cy="599.7" rx="9.3" ry="4.2" fill="url(#pk-dappleG)" opacity="0.33" transform="rotate(33.3 1220.5 599.7)"/>
<ellipse cx="873.4" cy="584.1" rx="27.6" ry="12.6" fill="url(#pk-dappleG)" opacity="0.72" transform="rotate(31.4 873.4 584.1)"/>
<ellipse cx="812.6" cy="755.8" rx="34.1" ry="15.5" fill="url(#pk-dappleG)" opacity="0.65" transform="rotate(22.8 812.6 755.8)"/>
<ellipse cx="545.3" cy="833.5" rx="21.3" ry="9.7" fill="url(#pk-dappleG)" opacity="0.8" transform="rotate(28.3 545.3 833.5)"/>
<ellipse cx="1101.8" cy="852.4" rx="10" ry="4.5" fill="url(#pk-dappleG)" opacity="0.48" transform="rotate(33.4 1101.8 852.4)"/>
<ellipse cx="903.1" cy="770" rx="35.3" ry="16" fill="url(#pk-dappleG)" opacity="0.74" transform="rotate(22.9 903.1 770)"/>
<ellipse cx="738.4" cy="582.9" rx="17.3" ry="7.9" fill="url(#pk-dappleG)" opacity="0.84" transform="rotate(32.3 738.4 582.9)"/>
<ellipse cx="356.4" cy="702.9" rx="18.5" ry="8.4" fill="url(#pk-dappleG)" opacity="0.6" transform="rotate(31.9 356.4 702.9)"/>
<ellipse cx="746.8" cy="878.1" rx="39.5" ry="18" fill="url(#pk-dappleG)" opacity="0.76" transform="rotate(25.3 746.8 878.1)"/>
<ellipse cx="1007" cy="765.9" rx="58.7" ry="26.7" fill="url(#pk-dappleG)" opacity="0.8" transform="rotate(22.6 1007 765.9)"/>
<ellipse cx="435.9" cy="732.7" rx="14.4" ry="6.6" fill="url(#pk-dappleG)" opacity="0.41" transform="rotate(30 435.9 732.7)"/>
<ellipse cx="782.5" cy="894.7" rx="14.3" ry="6.5" fill="url(#pk-dappleG)" opacity="0.5" transform="rotate(37.7 782.5 894.7)"/>
<ellipse cx="707" cy="714.7" rx="9.9" ry="4.5" fill="url(#pk-dappleG)" opacity="0.6" transform="rotate(24.9 707 714.7)"/>
<ellipse cx="355.5" cy="529.4" rx="23.3" ry="10.6" fill="url(#pk-dappleG)" opacity="0.7" transform="rotate(23.1 355.5 529.4)"/>
<ellipse cx="349.8" cy="752.2" rx="24.3" ry="11" fill="url(#pk-dappleG)" opacity="0.72" transform="rotate(28.9 349.8 752.2)"/>
<ellipse cx="1036.3" cy="538.3" rx="21.8" ry="9.9" fill="url(#pk-dappleG)" opacity="0.56" transform="rotate(35.6 1036.3 538.3)"/>
<ellipse cx="756.6" cy="667.8" rx="8.1" ry="3.7" fill="url(#pk-dappleG)" opacity="0.54" transform="rotate(29.6 756.6 667.8)"/>
<ellipse cx="421.8" cy="832.1" rx="16.8" ry="7.7" fill="url(#pk-dappleG)" opacity="0.7" transform="rotate(23.5 421.8 832.1)"/>
<ellipse cx="1037" cy="861.1" rx="62.9" ry="28.6" fill="url(#pk-dappleG)" opacity="0.31" transform="rotate(37.2 1037 861.1)"/>
<ellipse cx="739.3" cy="827.2" rx="32.1" ry="14.6" fill="url(#pk-dappleG)" opacity="0.72" transform="rotate(32.5 739.3 827.2)"/>
<ellipse cx="627.7" cy="888.3" rx="65.7" ry="29.9" fill="url(#pk-dappleG)" opacity="0.65" transform="rotate(38.5 627.7 888.3)"/>
<ellipse cx="788.4" cy="584.8" rx="15.6" ry="7.1" fill="url(#pk-dappleG)" opacity="0.82" transform="rotate(32.7 788.4 584.8)"/>
<ellipse cx="1137.7" cy="773.3" rx="24.2" ry="11" fill="url(#pk-dappleG)" opacity="0.82" transform="rotate(28 1137.7 773.3)"/>
<ellipse cx="551.8" cy="814.2" rx="15.4" ry="7" fill="url(#pk-dappleG)" opacity="0.38" transform="rotate(20.2 551.8 814.2)"/>
<ellipse cx="693.8" cy="667.2" rx="12" ry="5.4" fill="url(#pk-dappleG)" opacity="0.34" transform="rotate(29.7 693.8 667.2)"/>
<ellipse cx="578.1" cy="788.6" rx="40.3" ry="18.4" fill="url(#pk-dappleG)" opacity="0.45" transform="rotate(22.3 578.1 788.6)"/>
<ellipse cx="923.3" cy="769.2" rx="17" ry="7.7" fill="url(#pk-dappleG)" opacity="0.79" transform="rotate(24.9 923.3 769.2)"/>
<ellipse cx="730.1" cy="775.3" rx="52.3" ry="23.8" fill="url(#pk-dappleG)" opacity="0.84" transform="rotate(33.7 730.1 775.3)"/>
<ellipse cx="824.4" cy="586.8" rx="23.2" ry="10.6" fill="url(#pk-dappleG)" opacity="0.49" transform="rotate(30.9 824.4 586.8)"/>
<ellipse cx="353.6" cy="761.6" rx="39.4" ry="17.9" fill="url(#pk-dappleG)" opacity="0.33" transform="rotate(27.5 353.6 761.6)"/>
<ellipse cx="877.9" cy="658.7" rx="7.5" ry="3.4" fill="url(#pk-dappleG)" opacity="0.36" transform="rotate(22.3 877.9 658.7)"/>
<ellipse cx="704.2" cy="705.6" rx="38.4" ry="17.5" fill="url(#pk-dappleG)" opacity="0.5" transform="rotate(22 704.2 705.6)"/>
<ellipse cx="615.8" cy="790.3" rx="31.7" ry="14.4" fill="url(#pk-dappleG)" opacity="0.55" transform="rotate(34.7 615.8 790.3)"/>
<ellipse cx="1125.6" cy="772.7" rx="40.1" ry="18.3" fill="url(#pk-dappleG)" opacity="0.72" transform="rotate(38 1125.6 772.7)"/>
<ellipse cx="722.1" cy="816.5" rx="34.6" ry="15.7" fill="url(#pk-dappleG)" opacity="0.73" transform="rotate(34.6 722.1 816.5)"/>
<ellipse cx="1135.1" cy="848.9" rx="40.7" ry="18.5" fill="url(#pk-dappleG)" opacity="0.6" transform="rotate(32.8 1135.1 848.9)"/>
<ellipse cx="554.2" cy="532.8" rx="34.9" ry="15.9" fill="url(#pk-dappleG)" opacity="0.77" transform="rotate(28.8 554.2 532.8)"/>
<ellipse cx="912" cy="623.3" rx="36.4" ry="16.6" fill="url(#pk-dappleG)" opacity="0.66" transform="rotate(23.8 912 623.3)"/>
<ellipse cx="1087.3" cy="529" rx="6.8" ry="3.1" fill="url(#pk-dappleG)" opacity="0.84" transform="rotate(31.7 1087.3 529)"/>
<ellipse cx="521.6" cy="820.7" rx="37.6" ry="17.1" fill="url(#pk-dappleG)" opacity="0.44" transform="rotate(30.4 521.6 820.7)"/>
<ellipse cx="680.4" cy="597.9" rx="26.9" ry="12.2" fill="url(#pk-dappleG)" opacity="0.36" transform="rotate(24.1 680.4 597.9)"/>
<ellipse cx="658.8" cy="687.2" rx="6.9" ry="3.1" fill="url(#pk-dappleG)" opacity="0.52" transform="rotate(39.3 658.8 687.2)"/>
<ellipse cx="1025.4" cy="856.4" rx="13.2" ry="6" fill="url(#pk-dappleG)" opacity="0.43" transform="rotate(32.8 1025.4 856.4)"/>
<ellipse cx="987.2" cy="610.9" rx="9.1" ry="4.1" fill="url(#pk-dappleG)" opacity="0.8" transform="rotate(20.8 987.2 610.9)"/>
<ellipse cx="904.3" cy="744.4" rx="11.3" ry="5.1" fill="url(#pk-dappleG)" opacity="0.7" transform="rotate(20.1 904.3 744.4)"/>
<ellipse cx="833.9" cy="681.1" rx="14.8" ry="6.7" fill="url(#pk-dappleG)" opacity="0.48" transform="rotate(29.7 833.9 681.1)"/>
<ellipse cx="741.6" cy="775.9" rx="9.1" ry="4.1" fill="url(#pk-dappleG)" opacity="0.78" transform="rotate(25.4 741.6 775.9)"/>
<ellipse cx="878.1" cy="825.2" rx="12" ry="5.5" fill="url(#pk-dappleG)" opacity="0.35" transform="rotate(25 878.1 825.2)"/>
<ellipse cx="945.9" cy="582.8" rx="7.1" ry="3.2" fill="url(#pk-dappleG)" opacity="0.77" transform="rotate(30.6 945.9 582.8)"/>
<ellipse cx="333.2" cy="728.5" rx="8" ry="3.6" fill="url(#pk-dappleG)" opacity="0.32" transform="rotate(33.3 333.2 728.5)"/>
<ellipse cx="878.3" cy="507.6" rx="13.3" ry="6" fill="url(#pk-dappleG)" opacity="0.64" transform="rotate(37 878.3 507.6)"/>
<ellipse cx="757.9" cy="501.2" rx="15" ry="6.8" fill="url(#pk-dappleG)" opacity="0.32" transform="rotate(35.1 757.9 501.2)"/>
<ellipse cx="926.8" cy="886.2" rx="24.1" ry="11" fill="url(#pk-dappleG)" opacity="0.67" transform="rotate(36.7 926.8 886.2)"/>
<ellipse cx="930" cy="849.2" rx="10.1" ry="4.6" fill="url(#pk-dappleG)" opacity="0.74" transform="rotate(36.9 930 849.2)"/>
<ellipse cx="493.5" cy="801" rx="14.6" ry="6.6" fill="url(#pk-dappleG)" opacity="0.84" transform="rotate(32.5 493.5 801)"/>
<ellipse cx="886" cy="657.7" rx="10.6" ry="4.8" fill="url(#pk-dappleG)" opacity="0.8" transform="rotate(21.1 886 657.7)"/>
<ellipse cx="565" cy="857.8" rx="17.9" ry="8.2" fill="url(#pk-dappleG)" opacity="0.61" transform="rotate(33.8 565 857.8)"/>
<ellipse cx="800.5" cy="868.5" rx="22.2" ry="10.1" fill="url(#pk-dappleG)" opacity="0.42" transform="rotate(28.5 800.5 868.5)"/>
<ellipse cx="972.4" cy="568.5" rx="7" ry="3.2" fill="url(#pk-dappleG)" opacity="0.61" transform="rotate(21 972.4 568.5)"/>
</g>

{/* ══════════ 13. GRASS IN FRONT OF THE CLOTH ══════════
     A second pass of the same field, drawn AFTER the blanket and kept to
     a band straddling its edges. Cloth laid on a lawn does not meet it on
     a clean line — blades stand up in front of the hem, and that fringe
     is most of what stops the blanket reading as a sticker. */}
<g className="nearGrass" pointerEvents="none">
<use href="#pk-tuft8" transform="translate(1003,656) scale(0.117,0.117)"/>
<use href="#pk-tuft9" transform="translate(107,894) scale(0.199,0.199)"/>
<use href="#pk-tuft11" transform="translate(1040,692) scale(0.125,0.125)"/>
<use href="#pk-tuft10" transform="translate(89,813) scale(-0.138,0.138)"/>
<use href="#pk-tuft9" transform="translate(221,679) scale(-0.092,0.092)"/>
<use href="#pk-tuft8" transform="translate(-4,897) scale(-0.146,0.146)"/>
<use href="#pk-tuft5" transform="translate(992,634) scale(-0.145,0.145)"/>
<use href="#pk-tuft13" transform="translate(55,858) scale(-0.185,0.185)"/>
<use href="#pk-tuft0" transform="translate(1070,751) scale(0.123,0.123)"/>
<use href="#pk-tuft0" transform="translate(1236,891) scale(-0.237,0.237)"/>
<use href="#pk-tuft13" transform="translate(197,668) scale(-0.126,0.126)"/>
<use href="#pk-tuft11" transform="translate(1109,883) scale(-0.199,0.199)"/>
<use href="#pk-tuft8" transform="translate(138,720) scale(0.117,0.117)"/>
<use href="#pk-tuft13" transform="translate(231,660) scale(0.134,0.134)"/>
<use href="#pk-tuft11" transform="translate(959,614) scale(0.144,0.144)"/>
<use href="#pk-tuft4" transform="translate(248,618) scale(0.096,0.096)"/>
<use href="#pk-tuft3" transform="translate(164,742) scale(-0.173,0.173)"/>
<use href="#pk-tuft2" transform="translate(15,885) scale(0.192,0.192)"/>
<use href="#pk-tuft10" transform="translate(945,626) scale(0.117,0.117)"/>
<use href="#pk-tuft9" transform="translate(280,597) scale(0.073,0.073)"/>
<use href="#pk-tuft3" transform="translate(98,827) scale(-0.224,0.224)"/>
<use href="#pk-tuft9" transform="translate(241,642) scale(0.137,0.137)"/>
<use href="#pk-tuft11" transform="translate(1160,867) scale(0.228,0.228)"/>
<use href="#pk-tuft9" transform="translate(1105,899) scale(-0.239,0.239)"/>
<use href="#pk-tuft9" transform="translate(938,607) scale(0.07,0.07)"/>
<use href="#pk-tuft2" transform="translate(233,645) scale(-0.094,0.094)"/>
<use href="#pk-tuft9" transform="translate(72,879) scale(0.238,0.238)"/>
<use href="#pk-tuft0" transform="translate(168,692) scale(-0.167,0.167)"/>
<use href="#pk-tuft11" transform="translate(17,895) scale(-0.146,0.146)"/>
<use href="#pk-tuft7" transform="translate(1122,890) scale(0.154,0.154)"/>
<use href="#pk-tuft9" transform="translate(-61,886) scale(-0.252,0.252)"/>
<use href="#pk-tuft2" transform="translate(969,654) scale(-0.098,0.098)"/>
<use href="#pk-tuft12" transform="translate(240,653) scale(-0.094,0.094)"/>
<use href="#pk-tuft13" transform="translate(1139,886) scale(-0.238,0.238)"/>
<use href="#pk-tuft5" transform="translate(70,819) scale(-0.117,0.117)"/>
<use href="#pk-tuft0" transform="translate(136,750) scale(-0.097,0.097)"/>
<use href="#pk-tuft6" transform="translate(251,606) scale(-0.073,0.073)"/>
<use href="#pk-tuft6" transform="translate(907,586) scale(0.073,0.073)"/>
<use href="#pk-tuft10" transform="translate(1117,883) scale(0.124,0.124)"/>
<use href="#pk-tuft2" transform="translate(1040,688) scale(-0.144,0.144)"/>
<use href="#pk-tuft12" transform="translate(215,674) scale(0.146,0.146)"/>
<use href="#pk-tuft13" transform="translate(1239,879) scale(-0.141,0.141)"/>
<use href="#pk-tuft10" transform="translate(28,878) scale(-0.225,0.225)"/>
<use href="#pk-tuft0" transform="translate(1094,739) scale(-0.15,0.15)"/>
<use href="#pk-tuft13" transform="translate(991,653) scale(0.103,0.103)"/>
<use href="#pk-tuft2" transform="translate(285,586) scale(0.083,0.083)"/>
<use href="#pk-tuft12" transform="translate(1268,890) scale(-0.243,0.243)"/>
<use href="#pk-tuft9" transform="translate(161,724) scale(0.167,0.167)"/>
<use href="#pk-tuft3" transform="translate(57,833) scale(-0.219,0.219)"/>
<use href="#pk-tuft5" transform="translate(96,884) scale(0.209,0.209)"/>
<use href="#pk-tuft2" transform="translate(1053,729) scale(-0.155,0.155)"/>
<use href="#pk-tuft6" transform="translate(1026,717) scale(-0.178,0.178)"/>
<use href="#pk-tuft4" transform="translate(1021,711) scale(0.137,0.137)"/>
<use href="#pk-tuft8" transform="translate(192,680) scale(-0.157,0.157)"/>
<use href="#pk-tuft7" transform="translate(210,692) scale(-0.095,0.095)"/>
<use href="#pk-tuft12" transform="translate(20,862) scale(0.159,0.159)"/>
<use href="#pk-tuft3" transform="translate(-2,893) scale(-0.24,0.24)"/>
<use href="#pk-tuft3" transform="translate(1020,710) scale(0.108,0.108)"/>
<use href="#pk-tuft10" transform="translate(180,684) scale(0.13,0.13)"/>
<use href="#pk-tuft12" transform="translate(1138,890) scale(-0.13,0.13)"/>
<use href="#pk-tuft9" transform="translate(1149,897) scale(-0.153,0.153)"/>
<use href="#pk-tuft0" transform="translate(220,671) scale(-0.121,0.121)"/>
<use href="#pk-tuft4" transform="translate(1087,741) scale(-0.095,0.095)"/>
<use href="#pk-tuft7" transform="translate(1031,681) scale(0.151,0.151)"/>
<use href="#pk-tuft0" transform="translate(1130,895) scale(0.194,0.194)"/>
<use href="#pk-tuft10" transform="translate(1138,860) scale(0.133,0.133)"/>
<use href="#pk-tuft3" transform="translate(1099,800) scale(-0.157,0.157)"/>
<use href="#pk-tuft0" transform="translate(1057,738) scale(0.177,0.177)"/>
<use href="#pk-tuft7" transform="translate(919,603) scale(-0.109,0.109)"/>
<use href="#pk-tuft9" transform="translate(-60,900) scale(-0.255,0.255)"/>
<use href="#pk-tuft12" transform="translate(1022,712) scale(-0.152,0.152)"/>
<use href="#pk-tuft12" transform="translate(977,660) scale(0.163,0.163)"/>
<use href="#pk-tuft7" transform="translate(1234,895) scale(0.25,0.25)"/>
<use href="#pk-tuft12" transform="translate(982,645) scale(-0.144,0.144)"/>
<use href="#pk-tuft4" transform="translate(1181,875) scale(-0.225,0.225)"/>
<use href="#pk-tuft11" transform="translate(181,698) scale(0.129,0.129)"/>
<use href="#pk-tuft0" transform="translate(41,833) scale(0.218,0.218)"/>
<use href="#pk-tuft3" transform="translate(1067,775) scale(-0.155,0.155)"/>
<use href="#pk-tuft9" transform="translate(50,884) scale(0.198,0.198)"/>
<use href="#pk-tuft9" transform="translate(-67,889) scale(0.233,0.233)"/>
<use href="#pk-tuft6" transform="translate(247,645) scale(-0.106,0.106)"/>
<use href="#pk-tuft8" transform="translate(913,579) scale(-0.115,0.115)"/>
<use href="#pk-tuft5" transform="translate(1196,895) scale(0.253,0.253)"/>
<use href="#pk-tuft0" transform="translate(214,685) scale(-0.138,0.138)"/>
<use href="#pk-tuft1" transform="translate(100,814) scale(0.123,0.123)"/>
<use href="#pk-tuft8" transform="translate(1132,843) scale(0.172,0.172)"/>
<use href="#pk-tuft0" transform="translate(981,653) scale(-0.084,0.084)"/>
<use href="#pk-tuft3" transform="translate(943,603) scale(-0.1,0.1)"/>
<use href="#pk-tuft4" transform="translate(42,838) scale(0.17,0.17)"/>
<use href="#pk-tuft0" transform="translate(-3,884) scale(0.152,0.152)"/>
<use href="#pk-tuft5" transform="translate(226,665) scale(-0.152,0.152)"/>
<use href="#pk-tuft10" transform="translate(-8,889) scale(0.236,0.236)"/>
<use href="#pk-tuft6" transform="translate(1217,898) scale(-0.214,0.214)"/>
<use href="#pk-tuft1" transform="translate(1006,699) scale(0.088,0.088)"/>
<use href="#pk-tuft2" transform="translate(1129,813) scale(-0.218,0.218)"/>
<use href="#pk-tuft5" transform="translate(-68,900) scale(-0.217,0.217)"/>
<use href="#pk-tuft10" transform="translate(42,892) scale(0.178,0.178)"/>
<use href="#pk-tuft2" transform="translate(1133,887) scale(0.25,0.25)"/>
<use href="#pk-tuft6" transform="translate(944,631) scale(0.126,0.126)"/>
<use href="#pk-tuft7" transform="translate(1049,724) scale(-0.13,0.13)"/>
<use href="#pk-tuft5" transform="translate(1011,696) scale(0.139,0.139)"/>
<use href="#pk-tuft11" transform="translate(1161,892) scale(0.24,0.24)"/>
<use href="#pk-tuft7" transform="translate(1132,832) scale(0.203,0.203)"/>
<use href="#pk-tuft0" transform="translate(984,646) scale(0.128,0.128)"/>
<use href="#pk-tuft3" transform="translate(1090,804) scale(-0.175,0.175)"/>
<use href="#pk-tuft1" transform="translate(44,896) scale(-0.183,0.183)"/>
<use href="#pk-tuft13" transform="translate(985,675) scale(0.088,0.088)"/>
<use href="#pk-tuft7" transform="translate(60,890) scale(0.22,0.22)"/>
<use href="#pk-tuft10" transform="translate(151,715) scale(-0.106,0.106)"/>
<use href="#pk-tuft3" transform="translate(175,693) scale(-0.143,0.143)"/>
<use href="#pk-tuft4" transform="translate(1039,742) scale(-0.101,0.101)"/>
<use href="#pk-tuft0" transform="translate(1029,665) scale(-0.106,0.106)"/>
<use href="#pk-tuft5" transform="translate(1134,892) scale(0.185,0.185)"/>
<use href="#pk-tuft2" transform="translate(1223,887) scale(-0.163,0.163)"/>
<use href="#pk-tuft13" transform="translate(-62,897) scale(0.25,0.25)"/>
<use href="#pk-tuft8" transform="translate(232,618) scale(0.127,0.127)"/>
<use href="#pk-tuft5" transform="translate(1185,898) scale(-0.248,0.248)"/>
<use href="#pk-tuft0" transform="translate(192,717) scale(0.142,0.142)"/>
<use href="#pk-tuft13" transform="translate(92,878) scale(-0.232,0.232)"/>
<use href="#pk-tuft6" transform="translate(61,893) scale(0.197,0.197)"/>
<use href="#pk-tuft1" transform="translate(1166,896) scale(-0.207,0.207)"/>
<use href="#pk-tuft11" transform="translate(228,642) scale(-0.121,0.121)"/>
<use href="#pk-tuft10" transform="translate(-25,890) scale(0.182,0.182)"/>
<use href="#pk-tuft11" transform="translate(1088,791) scale(0.149,0.149)"/>
<use href="#pk-tuft1" transform="translate(93,834) scale(-0.223,0.223)"/>
<use href="#pk-tuft10" transform="translate(132,752) scale(0.145,0.145)"/>
<use href="#pk-tuft0" transform="translate(176,667) scale(0.106,0.106)"/>
<use href="#pk-tuft3" transform="translate(101,880) scale(-0.22,0.22)"/>
<use href="#pk-tuft13" transform="translate(94,879) scale(-0.209,0.209)"/>
<use href="#pk-tuft11" transform="translate(1117,803) scale(0.18,0.18)"/>
<use href="#pk-tuft6" transform="translate(152,758) scale(-0.131,0.131)"/>
<use href="#pk-tuft10" transform="translate(288,579) scale(0.122,0.122)"/>
<use href="#pk-tuft5" transform="translate(1145,890) scale(0.153,0.153)"/>
<use href="#pk-tuft2" transform="translate(172,728) scale(0.161,0.161)"/>
<use href="#pk-tuft5" transform="translate(237,602) scale(-0.084,0.084)"/>
<use href="#pk-tuft7" transform="translate(1132,887) scale(0.171,0.171)"/>
<use href="#pk-tuft1" transform="translate(1231,879) scale(0.223,0.223)"/>
<use href="#pk-tuft6" transform="translate(87,791) scale(0.117,0.117)"/>
<use href="#pk-tuft8" transform="translate(265,586) scale(-0.117,0.117)"/>
<use href="#pk-tuft9" transform="translate(1118,883) scale(0.16,0.16)"/>
<use href="#pk-tuft1" transform="translate(176,723) scale(0.142,0.142)"/>
<use href="#pk-tuft3" transform="translate(973,659) scale(-0.082,0.082)"/>
<use href="#pk-tuft8" transform="translate(203,680) scale(0.157,0.157)"/>
<use href="#pk-tuft6" transform="translate(260,625) scale(0.149,0.149)"/>
<use href="#pk-tuft0" transform="translate(1006,691) scale(-0.15,0.15)"/>
<use href="#pk-tuft3" transform="translate(956,632) scale(0.152,0.152)"/>
<use href="#pk-tuft7" transform="translate(981,635) scale(0.148,0.148)"/>
<use href="#pk-tuft11" transform="translate(1185,898) scale(0.188,0.188)"/>
<use href="#pk-tuft12" transform="translate(229,629) scale(-0.112,0.112)"/>
<use href="#pk-tuft0" transform="translate(293,581) scale(-0.111,0.111)"/>
<use href="#pk-tuft11" transform="translate(1189,887) scale(0.225,0.225)"/>
<use href="#pk-tuft6" transform="translate(958,648) scale(0.138,0.138)"/>
<use href="#pk-tuft1" transform="translate(-43,887) scale(-0.143,0.143)"/>
<use href="#pk-tuft13" transform="translate(170,734) scale(0.15,0.15)"/>
<use href="#pk-tuft9" transform="translate(963,645) scale(-0.113,0.113)"/>
<use href="#pk-tuft4" transform="translate(76,893) scale(-0.201,0.201)"/>
<use href="#pk-tuft1" transform="translate(1021,668) scale(0.126,0.126)"/>
<use href="#pk-tuft11" transform="translate(25,887) scale(-0.126,0.126)"/>
<use href="#pk-tuft6" transform="translate(29,897) scale(-0.231,0.231)"/>
<use href="#pk-tuft6" transform="translate(920,581) scale(-0.091,0.091)"/>
<use href="#pk-tuft9" transform="translate(1101,819) scale(-0.182,0.182)"/>
<use href="#pk-tuft9" transform="translate(1068,710) scale(0.176,0.176)"/>
<use href="#pk-tuft2" transform="translate(83,893) scale(-0.255,0.255)"/>
<use href="#pk-tuft7" transform="translate(1241,880) scale(0.201,0.201)"/>
<use href="#pk-tuft10" transform="translate(200,681) scale(0.155,0.155)"/>
<use href="#pk-tuft0" transform="translate(1027,676) scale(0.135,0.135)"/>
<use href="#pk-tuft7" transform="translate(113,781) scale(-0.199,0.199)"/>
<use href="#pk-tuft1" transform="translate(237,581) scale(-0.08,0.08)"/>
<use href="#pk-tuft2" transform="translate(958,603) scale(-0.131,0.131)"/>
<use href="#pk-tuft8" transform="translate(302,583) scale(-0.135,0.135)"/>
<use href="#pk-tuft11" transform="translate(1227,897) scale(0.161,0.161)"/>
<use href="#pk-tuft8" transform="translate(1063,722) scale(0.13,0.13)"/>
<use href="#pk-tuft6" transform="translate(1145,844) scale(-0.215,0.215)"/>
<use href="#pk-tuft5" transform="translate(-25,899) scale(0.243,0.243)"/>
<use href="#pk-tuft4" transform="translate(1055,749) scale(0.123,0.123)"/>
<use href="#pk-tuft7" transform="translate(296,581) scale(0.115,0.115)"/>
<use href="#pk-tuft1" transform="translate(-35,889) scale(-0.204,0.204)"/>
<use href="#pk-tuft10" transform="translate(66,900) scale(-0.209,0.209)"/>
<use href="#pk-tuft12" transform="translate(-65,885) scale(-0.204,0.204)"/>
<use href="#pk-tuft10" transform="translate(1134,817) scale(-0.162,0.162)"/>
<use href="#pk-tuft4" transform="translate(-30,880) scale(-0.201,0.201)"/>
<use href="#pk-tuft4" transform="translate(246,627) scale(0.145,0.145)"/>
<use href="#pk-tuft7" transform="translate(116,747) scale(-0.107,0.107)"/>
<use href="#pk-tuft10" transform="translate(1225,894) scale(0.256,0.256)"/>
<use href="#pk-tuft1" transform="translate(930,612) scale(0.082,0.082)"/>
<use href="#pk-tuft6" transform="translate(219,676) scale(0.147,0.147)"/>
<use href="#pk-tuft2" transform="translate(957,641) scale(0.148,0.148)"/>
<use href="#pk-tuft8" transform="translate(157,743) scale(0.181,0.181)"/>
<use href="#pk-tuft12" transform="translate(1194,879) scale(-0.167,0.167)"/>
<use href="#pk-tuft7" transform="translate(187,698) scale(0.106,0.106)"/>
<use href="#pk-tuft4" transform="translate(1145,889) scale(0.189,0.189)"/>
<use href="#pk-tuft11" transform="translate(203,692) scale(-0.093,0.093)"/>
<use href="#pk-tuft12" transform="translate(1119,896) scale(-0.143,0.143)"/>
<use href="#pk-tuft2" transform="translate(271,610) scale(-0.101,0.101)"/>
<use href="#pk-tuft7" transform="translate(995,659) scale(-0.095,0.095)"/>
<use href="#pk-tuft9" transform="translate(96,883) scale(-0.155,0.155)"/>
<use href="#pk-tuft4" transform="translate(54,890) scale(-0.246,0.246)"/>
</g>

{/* ══════════ 14. A BUTTERFLY ══════════
     Going away from the camera as well as across it, so it starts big in
     the near grass and arrives small at the far side — and drawn
     three-quarters on rather than spread flat, because a butterfly seen
     square from above is a specimen in a case. */}
<g className="butterfly" pointerEvents="none">
 <g className="bfFade">
  <g transform="rotate(-34)">
    {/* far wing: turned away, so narrower and darker */}
    <g className="wingFar">
      <path d="M0 0 q19 -22 27 -6 q6 15 -10 19 q13 9 3 17 q-12 9 -21 -11 Z" fill="#C9801F"/>
      <path d="M0 0 q19 -22 27 -6 q-10 1 -18 5 Z" fill="#E4A748"/>
      <path d="M18 -11 q5 2 4 7 M10 13 q5 -2 6 -7" stroke="#6E3C12" strokeWidth="1.8" fill="none"/>
    </g>
    {/* near wing: broad, and catching the sun on its upper surface */}
    <g className="wingNear">
      <path d="M0 0 q-27 -29 -38 -7 q-9 20 13 25 q-18 11 -5 22 q16 12 28 -14 Z" fill="#F2A63C"/>
      <path d="M0 0 q-27 -29 -38 -7 q13 2 24 7 Z" fill="#FFD27E"/>
      <path d="M-11 20 q-9 -3 -11 -10 q8 -1 14 2 Z" fill="#8A4E1E" opacity=".45"/>
      <path d="M-24 -13 q-7 2 -6 9 M-14 18 q-7 -2 -9 -9" stroke="#8A4E1E" strokeWidth="2" fill="none"/>
    </g>
    <path d="M2 -13 q4 15 -1 28 q-5 -13 -1 -28 Z" fill="#3A2A1A"/>
    <path d="M1 -13 q-5 -9 -10 -12 M3 -13 q5 -9 10 -12" stroke="#3A2A1A" strokeWidth="1.7" fill="none"/>
  </g>
 </g>
</g>

{/* ══════════ 15. FOREGROUND ══════════
     Too close to the lens to be in focus. Kept to the corners so it never
     sits over anything that has to be clicked. */}
<g filter="url(#pk-fgSoft)" pointerEvents="none">
  <path d="M-30 906 q40 -96 66 -128 q-4 78 10 128 Z" fill="#2A5222" opacity=".8"/>
  <path d="M26 906 q22 -118 70 -160 q-22 104 -22 160 Z" fill="#23481D" opacity=".75"/>
  <path d="M84 906 q10 -74 44 -112 q-14 62 -10 112 Z" fill="#2F5C26" opacity=".6"/>
  <path d="M1230 906 q-46 -104 -78 -142 q10 82 -4 142 Z" fill="#23481D" opacity=".8"/>
  <path d="M1160 906 q-24 -112 -66 -150 q22 96 18 150 Z" fill="#2A5222" opacity=".7"/>
  <path d="M1096 906 q-8 -66 -40 -104 q16 56 10 104 Z" fill="#33632A" opacity=".55"/>
</g>


{/* ══════════ THE DECOYS ══════════
     Invisible hit areas over things that are NOT waste. They are here
     rather than in the screen because the boxes are measured off this
     artwork, and artwork and hit area belong in the same file or they
     drift apart. */}
{onDecoy && (
  <g>
    {DECOYS.map((d) => (
      <rect
        key={d.label}
        x={d.x}
        y={d.y}
        width={d.w}
        height={d.h}
        fill="transparent"
        role="button"
        tabIndex={0}
        aria-label={`Inspect the ${d.label}`}
        style={{ pointerEvents: "auto", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          onDecoy(d.note);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onDecoy(d.note);
          }
        }}
      />
    ))}
  </g>
)}

{/* ══════════ 16. GRADE ══════════ */}
<g pointerEvents="none">
  <rect width="1200" height="900" fill="#FFCE86" opacity=".075" style={{ mixBlendMode: "overlay" }}/>
  <radialGradient id="pk-vig" cx=".7" cy=".22" r=".92">
    <stop offset=".45" stopColor="#14202A" stopOpacity="0"/>
    <stop offset="1"   stopColor="#101C26" stopOpacity=".56"/>
  </radialGradient>
  <rect width="1200" height="900" fill="url(#pk-vig)"/>
  <rect width="1200" height="900" filter="url(#pk-filmGrain)" opacity=".28" style={{ mixBlendMode: "overlay" }}/>
</g>
  </svg>
  );
};
