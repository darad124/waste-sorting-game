import React, { useEffect, useState } from "react";
import { playSound } from "../../utils/audio";

/* ==================================================================== *
 *  Kitchen Mess — high-fidelity scene
 *
 *  One SVG on a fixed 1200x900 viewBox, matching the frame's 4:3, so the
 *  art never distorts. Lit by the window at upper-left: every gradient is
 *  oriented to it, every cast shadow falls down-right, every shadow is
 *  tinted cool against the warm wood, and circles on the worktop are drawn
 *  as ellipses whose openness matches how far they sit below eye level.
 *
 *  The five pieces of litter are NOT in this backdrop — the game has to be
 *  able to tap them, light them and remove them, so they live in
 *  KITCHEN_CLUE_ART below and are positioned by the screen.
 * ==================================================================== */

/** Things in the kitchen that are genuinely confusable with litter but are not
 *  waste. Tapping one is a real mistake — that judgement is the game. */
const DECOYS: { label: string; x: number; y: number; w: number; h: number }[] = [
  { label: "sponge",      x: 238, y: 582, w: 68,  h: 44 },
  { label: "mug",         x: 248, y: 726, w: 88,  h: 92 },
  { label: "loaf",        x: 606, y: 716, w: 190, h: 98 },
  { label: "clean plates", x: 648, y: 600, w: 138, h: 74 },
  { label: "fruit bowl",  x: 982, y: 596, w: 200, h: 118 },
  { label: "tea towels",  x: 1016, y: 726, w: 150, h: 98 },
  { label: "kettle",      x: 298, y: 528, w: 146, h: 158 },
];

interface KitchenSceneProps {
  /** Called when the player taps something that is not litter. */
  onDecoy?: (label: string) => void;
}

export const KitchenScene: React.FC<KitchenSceneProps> = ({ onDecoy }) => {
  // Three props the player can poke at. They reward looking closely, which is
  // the habit a hidden-object scene wants to build.
  const [waterOn, setWaterOn] = useState(false);
  const [toasting, setToasting] = useState(false);
  const [windowOpen, setWindowOpen] = useState(false);
  // The pop-down is owned by the toasting state rather than a ref, so it
  // cleans itself up if the scene unmounts mid-cycle.
  useEffect(() => {
    if (!toasting) return;
    const t = window.setTimeout(() => {
      setToasting(false);
      playSound.detectiveFound();
    }, 2600);
    return () => window.clearTimeout(t);
  }, [toasting]);

  const toast = () => {
    if (toasting) return;
    setToasting(true);
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
    className={`absolute inset-0 w-full h-full ${windowOpen ? "kt-open" : ""}`}
    viewBox="0 0 1200 900"
    preserveAspectRatio="xMidYMid slice"
    // the backdrop is inert; only the three props below opt back in
    style={{ pointerEvents: "none" }}
  >
<defs>

  {/* ══ LIGHT MODEL ══
       Sun enters upper-left through the window. Every gradient below is
       oriented to it, every cast shadow falls down-right, every shadow is
       tinted cool violet against the warm wood. Nothing is grey. */}

  <linearGradient id="kt-wall" x1=".05" y1="0" x2=".95" y2="1">
    <stop offset="0"   stopColor="#F6F9FC"/>
    <stop offset=".40" stopColor="#E3EAF2"/>
    <stop offset="1"   stopColor="#AFBCD0"/>
  </linearGradient>

  <radialGradient id="kt-sunPool" cx=".20" cy=".26" r=".66">
    <stop offset="0"   stopColor="#FFF4D2" stopOpacity=".72"/>
    <stop offset=".45" stopColor="#FFE9B2" stopOpacity=".26"/>
    <stop offset="1"   stopColor="#FFE9B2" stopOpacity="0"/>
  </radialGradient>

  <linearGradient id="kt-counter" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#5E3D23"/>
    <stop offset=".10" stopColor="#7E5331"/>
    <stop offset=".42" stopColor="#A97448"/>
    <stop offset=".72" stopColor="#B9844F"/>
    <stop offset="1"   stopColor="#8A5B34"/>
  </linearGradient>
  <linearGradient id="kt-counterFront" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#794C2C"/>
    <stop offset=".28" stopColor="#5A3720"/>
    <stop offset="1"   stopColor="#33200F"/>
  </linearGradient>

  <linearGradient id="kt-outside" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#FFFEF6"/>
    <stop offset=".52" stopColor="#ECF5E4"/>
    <stop offset="1"   stopColor="#CBE2C2"/>
  </linearGradient>

  <linearGradient id="kt-kettle" x1=".18" y1="0" x2=".95" y2=".85">
    <stop offset="0"   stopColor="#96D8D2"/>
    <stop offset=".20" stopColor="#4FA8A3"/>
    <stop offset=".60" stopColor="#2C6F70"/>
    <stop offset=".86" stopColor="#1B4A50"/>
    <stop offset="1"   stopColor="#5A8A78"/>
  </linearGradient>

  <linearGradient id="kt-bowl" x1=".2" y1="0" x2=".85" y2="1">
    <stop offset="0"   stopColor="#FFFFFF"/>
    <stop offset=".38" stopColor="#E9EFF5"/>
    <stop offset=".78" stopColor="#AFBDCE"/>
    <stop offset="1"   stopColor="#D8C6AC"/>
  </linearGradient>

  <linearGradient id="kt-board" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#DCAE6E"/>
    <stop offset=".5"  stopColor="#BE8B4E"/>
    <stop offset="1"   stopColor="#835C30"/>
  </linearGradient>

  <linearGradient id="kt-chrome" x1=".15" y1="0" x2=".9" y2=".9">
    <stop offset="0"   stopColor="#FDFEFF"/>
    <stop offset=".16" stopColor="#DCE5EE"/>
    <stop offset=".46" stopColor="#93A4B7"/>
    <stop offset=".74" stopColor="#63748A"/>
    <stop offset=".92" stopColor="#8F9FB2"/>
    <stop offset="1"   stopColor="#A78F73"/>
  </linearGradient>

  <linearGradient id="kt-terracotta" x1=".2" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#E5A166"/>
    <stop offset=".35" stopColor="#C87A45"/>
    <stop offset="1"   stopColor="#834526"/>
  </linearGradient>

  <linearGradient id="kt-jar" x1=".15" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#F8FCFF" stopOpacity=".95"/>
    <stop offset=".35" stopColor="#D5E4EE" stopOpacity=".78"/>
    <stop offset="1"   stopColor="#93A9BD" stopOpacity=".85"/>
  </linearGradient>

  <linearGradient id="kt-towelG" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#F0D9C2"/>
    <stop offset=".45" stopColor="#DCBB9C"/>
    <stop offset="1"   stopColor="#A9846A"/>
  </linearGradient>

  <linearGradient id="kt-bread" x1=".2" y1="0" x2=".8" y2="1">
    <stop offset="0"   stopColor="#E0AE6C"/>
    <stop offset=".5"  stopColor="#C78A48"/>
    <stop offset="1"   stopColor="#96602C"/>
  </linearGradient>

  {/* Contact occlusion. The cheapest possible trick for making an object
       stop floating: darkness intensifies where two forms meet. */}
  <radialGradient id="kt-occl" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#2A1B10" stopOpacity=".6"/>
    <stop offset=".55" stopColor="#2A1B10" stopOpacity=".24"/>
    <stop offset="1"   stopColor="#2A1B10" stopOpacity="0"/>
  </radialGradient>

  <linearGradient id="kt-castShadow" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stopColor="#2E2A4A" stopOpacity=".42"/>
    <stop offset="1"   stopColor="#2E2A4A" stopOpacity="0"/>
  </linearGradient>

  <linearGradient id="kt-shaftGrad" x1=".1" y1="0" x2=".7" y2="1">
    <stop offset="0"   stopColor="#FFF3CC" stopOpacity=".30"/>
    <stop offset=".55" stopColor="#FFEDBA" stopOpacity=".10"/>
    <stop offset="1"   stopColor="#FFEDBA" stopOpacity="0"/>
  </linearGradient>

  <linearGradient id="kt-sinkG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#5A6A7C"/>
    <stop offset=".35" stopColor="#8FA0B2"/>
    <stop offset="1"   stopColor="#B9C7D6"/>
  </linearGradient>

  <pattern id="kt-tile" width="88" height="46" patternUnits="userSpaceOnUse">
    <rect width="88" height="46" fill="none"/>
    <path d="M0 45.4 H88 M44 0 V45.4" stroke="#9FAEC0" strokeOpacity=".5" strokeWidth="2.2"/>
    <path d="M0 22.6 H88" stroke="#FFFFFF" strokeOpacity=".32" strokeWidth="1"/>
  </pattern>

  <pattern id="kt-grain" width="300" height="120" patternUnits="userSpaceOnUse">
    <path d="M0 14 Q90 6 180 16 T300 12" fill="none" stroke="#3C2412" strokeOpacity=".15" strokeWidth="2.4"/>
    <path d="M0 42 Q120 34 210 46 T300 40" fill="none" stroke="#3C2412" strokeOpacity=".10" strokeWidth="1.8"/>
    <path d="M0 74 Q70 66 170 78 T300 70" fill="none" stroke="#3C2412" strokeOpacity=".13" strokeWidth="2.1"/>
    <path d="M0 102 Q140 94 220 104 T300 99" fill="none" stroke="#3C2412" strokeOpacity=".08" strokeWidth="1.6"/>
    <ellipse cx="238" cy="58" rx="16" ry="7" fill="none" stroke="#3C2412" strokeOpacity=".17" strokeWidth="2"/>
  </pattern>

  {/* ══ FILTERS ══ */}

  {/* Film grain over the whole frame. This is the single thing that stops
       vector art looking like plastic. */}
  <filter id="kt-filmGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="11" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.62" intercept="-0.2"/>
    </feComponentTransfer>
  </filter>

  <filter id="kt-bgSoft" x="-12%" y="-12%" width="124%" height="124%">
    <feGaussianBlur stdDeviation="5"/>
  </filter>
  <filter id="kt-fgSoft" x="-14%" y="-14%" width="128%" height="128%">
    <feGaussianBlur stdDeviation="15"/>
  </filter>
  <filter id="kt-shaftSoft" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="26"/>
  </filter>
  <filter id="kt-glowSoft" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="34"/>
  </filter>
  <filter id="kt-steamSoft" x="-70%" y="-70%" width="240%" height="240%">
    <feGaussianBlur stdDeviation="11"/>
  </filter>
  <filter id="kt-patchSoft" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="7"/>
  </filter>

  <filter id="kt-drop" x="-35%" y="-35%" width="180%" height="190%">
    <feDropShadow dx="8" dy="12" stdDeviation="10" floodColor="#2A2244" floodOpacity=".40"/>
  </filter>
  <filter id="kt-dropSm" x="-35%" y="-35%" width="180%" height="190%">
    <feDropShadow dx="5" dy="7" stdDeviation="5.5" floodColor="#2A2244" floodOpacity=".42"/>
  </filter>

  <clipPath id="kt-windowClip"><rect x="96" y="92" width="300" height="300" rx="6"/></clipPath>
  <clipPath id="kt-sinkClip"><path d="M44 600 h188 q12 0 12 12 v76 q0 16 -18 16 h-176 q-18 0 -18 -16 v-76 q0 -12 12 -12 Z"/></clipPath>
</defs>

{/* ══════════ 1. WALL ══════════ */}
<rect x="0" y="0" width="1200" height="580" fill="url(#kt-wall)"/>
<rect x="0" y="0" width="1200" height="580" fill="url(#kt-tile)" opacity=".5"/>
<g transform="rotate(-.5 600 400)" opacity=".45">
  <path d="M0 400 H1200" stroke="#9FAEC0" strokeOpacity=".5" strokeWidth="2.2"/>
</g>
<rect x="0" y="0" width="1200" height="580" fill="url(#kt-sunPool)"/>
<rect x="0" y="0" width="1200" height="580" fill="url(#kt-occl)" opacity=".4"/>
{/* wall darkens into the right side, away from the window */}
<rect x="760" y="0" width="440" height="580" fill="#3A4A66" opacity=".16"/>
{/* ambient occlusion where the wall meets the worktop */}
<rect x="0" y="524" width="1200" height="56" fill="#2A1B10" opacity=".22"/>

{/* ══════════ 2. WINDOW — the light source. Click to open. ══════════ */}
<g {...prop(windowOpen ? "Close the window" : "Open the window", () => {
  setWindowOpen((o) => !o);
  playSound.detectiveScan();
})}>
  <rect x="76" y="72" width="340" height="346" fill="transparent" />
  <rect x="80" y="76" width="332" height="332" rx="10" fill="#BCC7D6"/>
  <rect x="88" y="84" width="316" height="316" rx="8" fill="#EEF3F8"/>
  <g clipPath="url(#kt-windowClip)">
    <rect x="96" y="92" width="300" height="300" fill="url(#kt-outside)"/>
    <g filter="url(#kt-bgSoft)" opacity=".82">
      <circle cx="146" cy="332" r="64" fill="#9DC08B"/>
      <circle cx="232" cy="358" r="76" fill="#84AE74"/>
      <circle cx="334" cy="328" r="60" fill="#A8CB97"/>
      <rect x="96" y="362" width="300" height="40" fill="#7BA56C"/>
      <circle cx="306" cy="146" r="42" fill="#FFFFFF" opacity=".8"/>
      <circle cx="196" cy="126" r="28" fill="#FFFFFF" opacity=".5"/>
    </g>
  </g>
  {/* opening revealed once the sash is up: unglazed, so brighter and softer */}
  {windowOpen && (
    <g clipPath="url(#kt-windowClip)">
      <rect x="96" y="250" width="300" height="142" fill="#FBFFF4" opacity=".5"/>
      <rect x="96" y="250" width="300" height="12" fill="#5C6B54" opacity=".28"/>
    </g>
  )}

  {/* upper sash — fixed */}
  <path d="M246 92 V242" stroke="#F8FBFD" strokeWidth="13"/>
  <path d="M246 92 V242" stroke="#B4C2D2" strokeWidth="3" opacity=".65"/>
  <path d="M104 100 L180 100 L124 230 L96 230 Z" fill="#FFFFFF" opacity=".28"/>

  {/* lower sash — slides up when opened */}
  <g
    style={{
      transform: windowOpen ? "translateY(-104px)" : "translateY(0px)",
      transition: "transform .6s cubic-bezier(.22,1,.36,1)",
    }}
  >
    <g clipPath="url(#kt-windowClip)">
      <rect x="96" y="248" width="300" height="146" fill="#DCEAF4" opacity=".42"/>
      <path d="M112 262 L188 262 L130 388 L100 388 Z" fill="#FFFFFF" opacity=".3"/>
    </g>
    <path d="M246 242 V392 M96 242 H396" stroke="#F8FBFD" strokeWidth="13"/>
    <path d="M246 242 V392 M96 242 H396" stroke="#B4C2D2" strokeWidth="3" opacity=".65"/>
    <rect x="92" y="232" width="308" height="9" rx="4" fill="#E8EFF6"/>
    {/* the sash throws a shadow down into the opening */}
    <rect x="96" y="392" width="300" height="10" fill="#2E3A2A" opacity=".2"/>
  </g>

  <rect x="80" y="396" width="332" height="18" rx="4" fill="#D2DBE7"/>
  <rect x="80" y="396" width="332" height="5" rx="2.5" fill="#FFFFFF" opacity=".85"/>
  <rect x="56" y="52" width="380" height="380" rx="22" fill="#FFF6DA" opacity=".26" filter="url(#kt-glowSoft)"/>
</g>

{/* ══════════ 3. OPEN SHELF ══════════ */}
<g filter="url(#kt-drop)">
  <rect x="700" y="230" width="470" height="17" rx="3" fill="#9A6B40"/>
  <rect x="700" y="230" width="470" height="5" rx="2.5" fill="#D8A672" opacity=".9"/>
  <rect x="700" y="247" width="470" height="8" fill="#5C3820"/>
</g>
<rect x="700" y="255" width="470" height="56" fill="url(#kt-occl)" opacity=".5"/>

<g filter="url(#kt-dropSm)">
  <rect x="726" y="154" width="58" height="76" rx="7" fill="url(#kt-jar)"/>
  <rect x="722" y="146" width="66" height="14" rx="5" fill="#B6845A"/>
  <rect x="734" y="190" width="42" height="40" rx="4" fill="#CBA36C" opacity=".85"/>
  <rect x="733" y="160" width="11" height="60" rx="5" fill="#FFFFFF" opacity=".5"/>

  <rect x="800" y="170" width="48" height="60" rx="6" fill="url(#kt-jar)"/>
  <rect x="796" y="163" width="56" height="12" rx="4" fill="#8FA5B5"/>
  <rect x="808" y="196" width="32" height="34" rx="3" fill="#7BA05B" opacity=".8"/>
  <rect x="806" y="176" width="9" height="46" rx="4" fill="#FFFFFF" opacity=".5"/>

  <rect x="872" y="160" width="20" height="70" rx="2" fill="#B4523F"/>
  <rect x="894" y="152" width="16" height="78" rx="2" fill="#3E6B6E"/>
  <g transform="rotate(8 922 196)"><rect x="914" y="166" width="18" height="64" rx="2" fill="#C98A3C"/></g>

  <g className="leaf">
    <path d="M966 230 h56 l-7 -46 h-42 Z" fill="url(#kt-terracotta)"/>
    <path d="M959 178 h70 v11 h-70 Z" fill="#B4693A"/>
    <path d="M994 180 C972 144 942 154 962 180 Z" fill="#4E8C50"/>
    <path d="M994 180 C1018 142 1046 156 1024 180 Z" fill="#3F7644"/>
    <path d="M994 180 C994 136 978 134 994 180 Z" fill="#5C9B5A"/>
    <path d="M1020 226 C1048 262 1032 296 1052 328" fill="none" stroke="#4E8C50" strokeWidth="4"/>
    <ellipse cx="1043" cy="266" rx="12" ry="8" fill="#5C9B5A" transform="rotate(24 1043 266)"/>
    <ellipse cx="1038" cy="300" rx="11" ry="7" fill="#4E8C50" transform="rotate(-14 1038 300)"/>
    <ellipse cx="1056" cy="330" rx="10" ry="7" fill="#5C9B5A" transform="rotate(30 1056 330)"/>
  </g>
</g>

{/* ══════════ 4. UTENSIL RAIL ══════════ */}
<g filter="url(#kt-dropSm)">
  <rect x="470" y="190" width="196" height="7" rx="3.5" fill="#94A3B4"/>
  <rect x="470" y="190" width="196" height="2.5" rx="1.2" fill="#E8EEF4"/>
  <circle cx="474" cy="193" r="7" fill="#7C8B9C"/>
  <circle cx="662" cy="193" r="7" fill="#7C8B9C"/>
  <g stroke="#AEBBC9" strokeWidth="5" strokeLinecap="round">
    <path d="M512 196 V238"/><path d="M566 196 V244"/><path d="M620 196 V234"/>
  </g>
  <path d="M498 238 a16 16 0 0 0 28 0 a14 9 0 0 0 -28 0 Z" fill="#C7D2DE"/>
  <path d="M502 240 a12 12 0 0 0 20 0 Z" fill="#EEF3F8" opacity=".6"/>
  <path d="M552 244 q-8 22 0 44 M566 244 q0 24 0 44 M580 244 q8 22 0 44" fill="none" stroke="#C7D2DE" strokeWidth="3.4"/>
  <path d="M606 234 h28 v26 a14 14 0 0 1 -28 0 Z" fill="#D46A52"/>
  <path d="M609 237 h8 v22" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity=".35"/>
</g>

{/* ══════════ 5. COUNTER ══════════
     Raised so the worktop is a deep plane rather than a thin strip — that
     is what lets props sit at different distances instead of in a row. */}
<rect x="0" y="500" width="1200" height="80" fill="#C98A50" opacity=".15"/>
<rect x="0" y="548" width="1200" height="32" fill="#8A5C36" opacity=".18"/>

<rect x="0" y="574" width="1200" height="286" fill="url(#kt-counter)"/>
<rect x="0" y="574" width="1200" height="286" fill="url(#kt-grain)" opacity=".85"/>
<rect x="0" y="574" width="1200" height="8" fill="#3F2814" opacity=".5"/>

{/* The shaft lands here: a window-pane-shaped patch of sun on the worktop.
     This one detail does more for "sunlight" than any amount of glow. */}
<g filter="url(#kt-patchSoft)" opacity=".34">
  <path d="M182 582 L470 582 L560 858 L214 858 Z" fill="#FFE4A0"/>
</g>
<g filter="url(#kt-patchSoft)" opacity=".38">
  <path d="M330 582 L352 582 L410 858 L378 858 Z" fill="#B99A5E"/>
  <path d="M182 690 L500 690 L512 726 L192 726 Z" fill="#B99A5E"/>
</g>

{/* crumbs, scattered unevenly */}
<g fill="#4E3218" opacity=".45">
  <circle cx="396" cy="742" r="3"/><circle cx="414" cy="758" r="2"/><circle cx="378" cy="772" r="2.4"/>
  <circle cx="648" cy="716" r="2.6"/><circle cx="668" cy="734" r="1.8"/><circle cx="628" cy="748" r="2.1"/>
  <circle cx="872" cy="792" r="2.2"/><circle cx="894" cy="774" r="3"/><circle cx="914" cy="800" r="1.9"/>
  <circle cx="256" cy="820" r="2.4"/><circle cx="1058" cy="760" r="2.6"/><circle cx="1090" cy="806" r="2"/>
  <circle cx="534" cy="820" r="2.2"/><circle cx="742" cy="836" r="1.8"/>
</g>
{/* a coffee ring, because real counters have them */}
<circle cx="322" cy="796" r="26" fill="none" stroke="#5A3A1E" strokeWidth="4" opacity=".18"/>

<rect x="0" y="852" width="1200" height="48" fill="url(#kt-counterFront)"/>
<rect x="0" y="854" width="1200" height="4" fill="#EEBE80" opacity=".6"/>

{/* ══════════ 6. SINK ══════════
     Cut into the worktop in perspective: the far rim is shorter and higher
     than the near rim, the basin walls are visible, and the tap rises from
     behind the basin and arcs forward over the drain. */}
<g transform="translate(0,30)">
  {/* basin opening, darkest thing in the scene: a hole */}
  <path d="M84 606 H226 q14 0 16 12 L258 700 q2 14 -14 14 H60 q-16 0 -14 -14 L62 618 q2 -12 22 -12 Z" fill="#26313E"/>

  {/* interior: far wall catches the window, side walls fall away */}
  <path d="M84 606 H226 q14 0 16 12 L236 646 H68 L62 618 q2 -12 22 -12 Z" fill="#8DA0B4"/>
  <path d="M84 606 H226 q14 0 16 12 L238 628 H66 L62 618 q2 -12 22 -12 Z" fill="#C3D2E0"/>
  <path d="M68 646 H236 L246 690 H58 Z" fill="#6E7F92"/>
  <path d="M68 646 L58 690 H86 L80 646 Z" fill="#5C6C7E"/>
  <path d="M236 646 L246 690 H220 L224 646 Z" fill="#7E90A4"/>
  {/* basin floor, wet */}
  <path d="M86 690 H218 q6 0 6 8 H80 q0 -8 6 -8 Z" fill="#4E5E70"/>
  <path d="M92 676 q60 -10 120 0 q-58 12 -120 0 Z" fill="#B9D6E6" opacity=".35"/>
  <ellipse cx="152" cy="688" rx="22" ry="8.4" fill="#3A4756"/>
  <ellipse cx="152" cy="687" rx="13" ry="5" fill="#26313E"/>
  <path d="M144 686 h16 M152 682 v9" stroke="#8DA0B4" strokeWidth="2" opacity=".7"/>
  <ellipse className="ripple" cx="152" cy="686" rx="20" ry="7" fill="none" stroke="#CFE6F2" strokeWidth="2.5"/>

  {/* steel rim, catching light on the far edge and the near lip */}
  <path d="M74 596 H236 q18 0 20 14 L270 704 q2 16 -16 16 H50 q-18 0 -16 -16 L48 610 q2 -14 26 -14 Z
           M84 606 H226 q14 0 16 12 L258 700 q2 14 -14 14 H60 q-16 0 -14 -14 L62 618 q2 -12 22 -12 Z"
        fill="url(#kt-sinkG)" fillRule="evenodd"/>
  <path d="M74 596 H236 q18 0 20 14 l1 5 H47 l1 -5 q2 -14 26 -14 Z" fill="#EAF1F7" opacity=".75"/>
  <path d="M34 706 q2 14 16 14 h204 q18 0 16 -16 l-2 -4 q-4 12 -18 12 H50 q-14 0 -16 -6 Z" fill="#FFFFFF" opacity=".35"/>

  {/* sponge on the rim, because an empty sink reads as a prop */}
  <ellipse cx="270" cy="586" rx="32" ry="6" fill="url(#kt-occl)"/>
  <g filter="url(#kt-dropSm)">
    <path d="M246 562 h44 q6 0 6 6 v14 q0 6 -6 6 h-44 q-6 0 -6 -6 v-14 q0 -6 6 -6 Z" fill="#E4C85A"/>
    <path d="M246 562 h44 q6 0 6 6 v5 h-56 v-5 q0 -6 6 -6 Z" fill="#7FA85C"/>
    <g fill="#C9A93E" opacity=".6">
      <circle cx="256" cy="578" r="2"/><circle cx="268" cy="575" r="1.6"/><circle cx="281" cy="579" r="2.2"/>
    </g>
  </g>

  {/* Mixer tap, front view, centred on the bowl.
       The bend arcs TOWARDS the camera, so the descending spout comes down
       directly IN FRONT OF the column and overlaps it — the two tubes are
       only 10 apart against a 14-wide tube, so they intersect rather than
       standing side by side like two pipes. The column peeks out on the
       right of the spout; a dark seam down that edge is what separates them.
       Whole silhouette is centred on x=152, the drain axis.
       Column is the long run; spout below the bend is about 0.7 of it. */}

  {/* contact shadow + occlusion at the deck */}
  <ellipse cx="170" cy="596" rx="32" ry="9" fill="#2E2A4A" opacity=".22"/>
  <ellipse cx="158" cy="594" rx="21" ry="6.4" fill="#2A1B10" opacity=".34"/>

  <g filter="url(#kt-dropSm)" {...prop(waterOn ? "Turn the tap off" : "Turn the tap on", () => {
    setWaterOn((w) => !w);
    playSound.detectiveScan();
  })}>
    {/* invisible touch target — the tube itself is only a few pixels wide */}
    <rect x="112" y="436" width="108" height="176" fill="transparent" />
    {/* collar */}
    <ellipse cx="158" cy="592" rx="19" ry="5.8" fill="#5E6D82"/>
    <ellipse cx="158" cy="588" rx="19" ry="5.8" fill="#AFC0D0"/>
    <ellipse cx="158" cy="586.5" rx="12" ry="3.8" fill="#DCE7F1"/>
    <ellipse cx="158" cy="586" rx="7" ry="2.2" fill="#7E8EA0"/>

    {/* COLUMN (far): the long run, straight up, hooking over at the top */}
    <path d="M158 588 V476 C158 452, 148 452, 148 476"
          fill="none" stroke="#3E4C60" strokeWidth="14" strokeLinecap="round"/>
    <path d="M158 588 V476 C158 452, 148 452, 148 476"
          fill="none" stroke="#8496AB" strokeWidth="10.5" strokeLinecap="round"/>
    {/* the sliver of column that stays visible to the right of the spout */}
    <path d="M163 580 V478" fill="none" stroke="#B0C0D1" strokeWidth="3.4" strokeLinecap="round" opacity=".9"/>

    {/* SPOUT (near): wider, brighter, drawn over the column so it occludes it */}
    <path d="M148 462 V532" fill="none" stroke="#3E4C60" strokeWidth="16" strokeLinecap="round"/>
    <path d="M148 462 V532" fill="none" stroke="#B7C6D6" strokeWidth="12.5" strokeLinecap="round"/>
    {/* seam: the spout's own right-hand edge, cutting across the column */}
    <path d="M154.5 466 V528" fill="none" stroke="#2A3542" strokeWidth="2.2" strokeLinecap="round" opacity=".5"/>
    {/* window reflected down the near tube */}
    <path d="M144 468 V526" fill="none" stroke="#F4F8FC" strokeWidth="3.8" strokeLinecap="round" opacity=".95"/>
    {/* window reflected down the far tube, dimmer because it is further off */}
    <path d="M154 578 V480 C154 462, 145 462, 144.5 476"
          fill="none" stroke="#E4ECF4" strokeWidth="2.6" strokeLinecap="round" opacity=".6"/>
    {/* crown of the hook */}
    <ellipse cx="153" cy="456" rx="11" ry="5" fill="#D7E3EE"/>
    <ellipse cx="151" cy="454" rx="7" ry="3.4" fill="#F6FAFD" opacity=".9"/>

    {/* cross-contours */}
    <path d="M142 502 a6.2 2.5 0 0 0 12.4 0" fill="none" stroke="#7E8EA0" strokeWidth="1.5" opacity=".45"/>
    <path d="M153 500 a5.4 2 0 0 0 10.6 0" fill="none" stroke="#7E8EA0" strokeWidth="1.4" opacity=".35"/>

    {/* outlet housing: nearer than the column, so wider, and it casts
         a shadow back onto the tube behind it */}
    <path d="M156 530 q8 8 6 18 q-6 6 -12 2 Z" fill="#26313E" opacity=".45"/>
    <path d="M135 526 h26 v15 q0 6 -13 6 q-13 0 -13 -6 Z" fill="#4A5970"/>
    <ellipse cx="148" cy="526" rx="13" ry="5" fill="#C3D1DF"/>
    <path d="M137 524 a11 3.8 0 0 1 22 0" fill="none" stroke="#F4F8FC" strokeWidth="2" opacity=".9"/>
    <ellipse cx="148" cy="546" rx="13" ry="5.4" fill="#9DB0C3"/>
    <ellipse cx="148" cy="547.2" rx="13" ry="5.4" fill="#3E4C60"/>
    <ellipse cx="148" cy="546.4" rx="8.4" ry="3.4" fill="#242C36"/>
    <path d="M139 544 a10 3.6 0 0 1 19 0" fill="none" stroke="#DCE7F1" strokeWidth="1.6" opacity=".8"/>

    {/* lever, off the side of the body, low */}
    <ellipse cx="168" cy="566" rx="7.4" ry="6.6" fill="#93A5B8"/>
    <g
      style={{
        transformOrigin: "168px 566px",
        transform: waterOn ? "rotate(-34deg)" : "rotate(0deg)",
        transition: "transform .38s cubic-bezier(.34,1.5,.64,1)",
      }}
    >
      <path d="M170 562 L192 551" stroke="#AFC0D0" strokeWidth="8" strokeLinecap="round"/>
      <path d="M171 560 L190 551" stroke="#DEE8F1" strokeWidth="2.2" strokeLinecap="round" opacity=".8"/>
      <ellipse cx="193" cy="550" rx="5.2" ry="4.4" fill="#5C6C7E"/>
    </g>
  </g>

  {/* shadow the hovering spout casts on the water */}
  <ellipse cx="149" cy="656" rx="14" ry="5.5" fill="#0F1820" opacity=".3"/>

  {!waterOn && (
    <circle className="drip" cx="148" cy="554" r="4.4" fill="#C2E3F2" opacity=".9"/>
  )}

  {/* running water: column, inner glints, and the splash where it lands */}
  {waterOn && (
    <g className="kt-water">
      <path d="M139 548 C137 600, 140 646, 143 684 L158 684 C161 646, 164 600, 162 548 Z"
            fill="#BCE3F4" opacity=".62"/>
      <path d="M143 550 C141 600, 144 644, 146 682" fill="none"
            stroke="#FFFFFF" strokeWidth="3" opacity=".7" className="kt-glint"/>
      <path d="M156 552 C157 600, 155 644, 153 680" fill="none"
            stroke="#7FC4E4" strokeWidth="2.2" opacity=".55" className="kt-glint kt-glint--b"/>
      <ellipse cx="150" cy="686" rx="26" ry="9" fill="#DCF1FA" opacity=".5"/>
      <ellipse className="kt-splash" cx="150" cy="686" rx="20" ry="7"
               fill="none" stroke="#EAF7FD" strokeWidth="3"/>
      <ellipse className="kt-splash kt-splash--b" cx="150" cy="686" rx="20" ry="7"
               fill="none" stroke="#EAF7FD" strokeWidth="2.4"/>
    </g>
  )}
</g>

{/* ══════════ 7. CLUTTER — a hidden-object scene needs things to hide among ══════════ */}

{/* Electric kettle */}
<ellipse cx="404" cy="686" rx="128" ry="17" fill="url(#kt-castShadow)" transform="rotate(-2 404 686)"/>
<ellipse cx="368" cy="682" rx="86" ry="14" fill="url(#kt-occl)"/>
<g filter="url(#kt-drop)">
  {/* cord, running off behind the chopping board */}
  <path d="M424 664 C 470 662, 486 640, 520 634" fill="none" stroke="#2F3742" strokeWidth="5" strokeLinecap="round"/>

  {/* power base */}
  <ellipse cx="368" cy="668" rx="66" ry="22" fill="#39424E"/>
  <path d="M302 660 a66 22 0 0 0 132 0 v-9 a66 22 0 0 1 -132 0 Z" fill="#2A323C"/>
  <ellipse cx="368" cy="659" rx="66" ry="22" fill="#4A5462"/>
  <ellipse cx="368" cy="657" rx="52" ry="17" fill="#39424E"/>

  {/* body: tapered, wider at the base, with a soft shoulder */}
  <path d="M322 556 C 318 596, 312 630, 310 644 q-2 16 20 16 h76 q22 0 20 -16 C 424 630, 418 596, 414 556 Z"
        fill="url(#kt-kettle)"/>
  {/* pouring lip at the front-left */}
  <path d="M322 556 q-24 -2 -32 12 q18 8 34 0 Z" fill="#2F7B7A"/>
  <path d="M322 556 q-22 -2 -29 10 q16 5 29 -1 Z" fill="#54AFA9" opacity=".75"/>
  {/* hinged lid with a lift tab */}
  <ellipse cx="368" cy="556" rx="46" ry="13" fill="#3E8A88"/>
  <path d="M322 556 q46 -20 92 0 q-46 12 -92 0 Z" fill="#59B4AC"/>
  <rect x="356" y="536" width="24" height="10" rx="5" fill="#21383F"/>
  {/* water window, with a level line */}
  <path d="M332 578 h16 q3 0 3 4 v52 q0 4 -3 4 h-16 q-3 0 -3 -4 v-52 q0 -4 3 -4 Z" fill="#0E3035" opacity=".45"/>
  <path d="M332 604 h16 q3 0 3 4 v26 q0 4 -3 4 h-16 q-3 0 -3 -4 v-26 q0 -4 3 -4 Z" fill="#BEE9E4" opacity=".7"/>
  <path d="M330 604 q11 -4 22 0" fill="none" stroke="#EAFBF8" strokeWidth="2.5" opacity=".85"/>
  {/* D-handle on the right */}
  <path d="M414 570 q44 10 44 46 q0 36 -44 46" fill="none" stroke="#21383F" strokeWidth="15" strokeLinecap="round"/>
  <path d="M418 576 q36 10 36 40 q0 30 -36 40" fill="none" stroke="#4E747C" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
  {/* switch at the foot of the handle, lit */}
  <path d="M414 636 h22 q5 0 5 5 v14 q0 5 -5 5 h-22 Z" fill="#21383F"/>
  <circle cx="427" cy="648" r="4" fill="#F2A03C"/>
  <circle cx="427" cy="648" r="7" fill="#F2A03C" opacity=".35"/>
  {/* specular: one hard vertical highlight, one soft core shadow */}
  <path d="M336 566 q-6 46 -2 82" fill="none" stroke="#E3F8F5" strokeWidth="11" strokeLinecap="round" opacity=".5"/>
  <ellipse cx="404" cy="606" rx="14" ry="44" fill="#0E3035" opacity=".3"/>
  {/* warm bounce off the worktop */}
  <path d="M316 648 q52 22 104 0" fill="none" stroke="#E5AE70" strokeWidth="7" opacity=".38"/>
</g>
<g filter="url(#kt-steamSoft)" fill="#FFFFFF">
  <ellipse className="steam-a" cx="300" cy="536" rx="13" ry="20"/>
  <ellipse className="steam-b" cx="312" cy="544" rx="10" ry="16"/>
</g>

{/* Chopping board leaning on the backsplash, with a proper handle hole */}
<ellipse cx="572" cy="678" rx="58" ry="12" fill="url(#kt-occl)"/>
<g filter="url(#kt-drop)" transform="rotate(-4 572 600)">
  <path d="M524 470 h96 q12 0 12 12 v186 q0 10 -10 10 h-100 q-10 0 -10 -10 v-186 q0 -12 12 -12 Z" fill="url(#kt-board)"/>
  <circle cx="572" cy="494" r="11" fill="none" stroke="#7A5227" strokeWidth="6"/>
  <path d="M528 526 h88 M528 556 h88 M528 586 h88 M528 616 h88" stroke="#A3743F" strokeWidth="3" opacity=".5"/>
  <path d="M524 470 h22 v198 h-22 Z" fill="#FFFFFF" opacity=".17"/>
  <path d="M614 470 h18 v198 h-18 Z" fill="#4F3315" opacity=".22"/>
</g>

{/* Bread on a small board, foreground-left of the toaster */}
<ellipse cx="700" cy="812" rx="106" ry="14" fill="url(#kt-castShadow)"/>
<g filter="url(#kt-dropSm)">
  <path d="M606 772 h176 q10 0 10 10 v18 q0 10 -10 10 h-176 q-10 0 -10 -10 v-18 q0 -10 10 -10 Z" fill="#B8874C"/>
  <path d="M606 772 h176 q10 0 10 10 v4 h-196 v-4 q0 -10 10 -10 Z" fill="#D6A268"/>
  <path d="M626 772 q0 -48 46 -48 q46 0 46 48 Z" fill="url(#kt-bread)"/>
  <path d="M626 772 q0 -48 46 -48 q10 0 18 5 q-34 10 -34 43 Z" fill="#E8BE82" opacity=".55"/>
  <path d="M640 742 q14 -10 28 0 M652 730 q12 -7 22 0" fill="none" stroke="#8A5726" strokeWidth="3" opacity=".5"/>
  <g transform="rotate(-8 736 760)">
    <path d="M718 752 h36 v20 h-36 Z" fill="#EFD9AE"/>
    <path d="M718 752 h36 v5 h-36 Z" fill="#C89A5C"/>
  </g>
</g>

{/* Toaster */}
<ellipse cx="900" cy="700" rx="110" ry="15" fill="url(#kt-castShadow)"/>
<ellipse cx="876" cy="698" rx="80" ry="12" fill="url(#kt-occl)"/>
<g filter="url(#kt-drop)" {...prop("Pop the toast", toast)}>
  <rect x="794" y="512" width="200" height="190" fill="transparent" />
  {/* slices sit BEHIND the body, so they are hidden until they rise */}
  <g
    style={{
      transform: toasting ? "translateY(-56px)" : "translateY(0px)",
      transition: "transform .52s cubic-bezier(.34,1.56,.64,1)",
    }}
  >
    <path d="M832 592 v-34 a19 17 0 0 1 38 0 v34 Z" fill="url(#kt-bread)"/>
    <path d="M832 592 v-34 a19 17 0 0 1 38 0 q-14 4 -18 14 q-4 10 -4 20 Z" fill="#E8BE82" opacity=".5"/>
    <path d="M840 566 q10 -7 22 0" fill="none" stroke="#8A5726" strokeWidth="3" opacity=".45"/>
    <path d="M910 592 v-34 a19 17 0 0 1 38 0 v34 Z" fill="#B87A38"/>
    <path d="M910 592 v-34 a19 17 0 0 1 38 0 q-14 4 -18 14 q-4 10 -4 20 Z" fill="#D69A55" opacity=".5"/>
  </g>
  <path d="M800 548 q0 -16 18 -16 h150 q18 0 18 16 v124 q0 22 -22 22 h-142 q-22 0 -22 -22 Z" fill="url(#kt-chrome)"/>
  <rect x="828" y="524" width="46" height="10" rx="5" fill="#33415A"/>
  <rect x="906" y="524" width="46" height="10" rx="5" fill="#33415A"/>
  <rect
    x="978" y="574" width="16" height="36" rx="8" fill="#48586F"
    style={{
      transform: toasting ? "translateY(26px)" : "translateY(0px)",
      transition: "transform .3s cubic-bezier(.22,1,.36,1)",
    }}
  />
  <circle cx="828" cy="650" r="10" fill="#33415A"/>
  <circle cx="828" cy="650" r="4.5" fill={toasting ? "#F2A03C" : "#E07A5F"} />
  {toasting && <circle cx="828" cy="650" r="9" fill="#F2A03C" opacity=".35"/>}
  {/* the elements glow through the slots while it runs */}
  {toasting && <rect x="830" y="526" width="42" height="6" rx="3" fill="#F2703C" opacity=".8"/>}
  {toasting && <rect x="908" y="526" width="42" height="6" rx="3" fill="#F2703C" opacity=".8"/>}
  {/* the window, reflected in the chrome — this is what sells metal */}
  <path d="M818 552 h38 v112 h-38 Z" fill="#FFFFFF" opacity=".44"/>
  <path d="M825 556 h10 v104 h-10 Z" fill="#FFFFFF" opacity=".72"/>
  <path d="M800 660 q94 26 186 0" fill="none" stroke="#E5AE70" strokeWidth="9" opacity=".33"/>
</g>

{/* Stack of plates, clear of the bowl so it can actually sit down */}
<ellipse cx="742" cy="668" rx="86" ry="13" fill="url(#kt-castShadow)"/>
<ellipse cx="722" cy="664" rx="70" ry="11" fill="url(#kt-occl)"/>
<g filter="url(#kt-dropSm)">
  <ellipse cx="716" cy="656" rx="66" ry="19" fill="#AEBCCC"/>
  <ellipse cx="716" cy="648" rx="66" ry="19" fill="#E7EEF5"/>
  <ellipse cx="716" cy="640" rx="64" ry="18" fill="#C3D0DE"/>
  <ellipse cx="716" cy="632" rx="64" ry="18" fill="#F1F6FA"/>
  <ellipse cx="716" cy="626" rx="62" ry="17" fill="#CFDAE6"/>
  <ellipse cx="716" cy="620" rx="62" ry="17" fill="#FBFDFE"/>
  <ellipse cx="716" cy="618" rx="42" ry="11" fill="#D8E2EC"/>
  <path d="M654 620 q18 -10 44 -11" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity=".8"/>
</g>

{/* Mug, near the front, catching the light */}
<g transform="translate(46,10)">
<ellipse cx="248" cy="806" rx="52" ry="10" fill="url(#kt-castShadow)"/>
<ellipse cx="238" cy="804" rx="38" ry="8" fill="url(#kt-occl)"/>
<g filter="url(#kt-dropSm)">
  <path d="M206 730 h64 v52 q0 22 -32 22 q-32 0 -32 -22 Z" fill="#E8EEF4"/>
  <path d="M206 730 h20 v70 q-20 -6 -20 -18 Z" fill="#FFFFFF" opacity=".6"/>
  <path d="M258 730 h12 v70 q14 -8 14 -22 Z" fill="#9FB0C2" opacity=".5"/>
  <path d="M270 744 a20 20 0 0 1 0 34" fill="none" stroke="#E8EEF4" strokeWidth="10"/>
  <ellipse cx="238" cy="730" rx="32" ry="8" fill="#6B4A2E"/>
  <ellipse cx="232" cy="728" rx="14" ry="3.5" fill="#B08A5E" opacity=".6"/>
  {/* a chip in the rim, because nothing real is perfect */}
  <path d="M262 727 l7 3 l-7 3 Z" fill="#B9C6D3"/>
</g>
</g>

{/* Fruit bowl */}
<ellipse cx="1096" cy="740" rx="130" ry="18" fill="url(#kt-castShadow)"/>
<ellipse cx="1078" cy="736" rx="102" ry="14" fill="url(#kt-occl)"/>
<g filter="url(#kt-drop)">
  <circle cx="1042" cy="634" r="37" fill="#BE4C46"/>
  <circle cx="1030" cy="622" r="13" fill="#E98374" opacity=".7"/>
  <path d="M1042 600 q6 -16 18 -18" fill="none" stroke="#5E7A3A" strokeWidth="5" strokeLinecap="round"/>
  <circle cx="1114" cy="640" r="33" fill="#D9A23C"/>
  <circle cx="1104" cy="630" r="11" fill="#F2C66D" opacity=".65"/>
  <circle cx="1076" cy="654" r="31" fill="#7FA23F"/>
  <circle cx="1068" cy="646" r="10" fill="#A6C566" opacity=".6"/>
  <path d="M986 666 q110 -34 194 0 l-17 42 q-82 26 -160 0 Z" fill="url(#kt-bowl)"/>
  <path d="M986 666 q110 -34 194 0 q-98 30 -194 0 Z" fill="#C2CFDC"/>
  <path d="M996 676 q90 22 176 0" fill="none" stroke="#FFFFFF" strokeWidth="5" opacity=".55"/>
  <path d="M1008 700 q78 22 152 0" fill="none" stroke="#E5AE70" strokeWidth="6" opacity=".32"/>
</g>

{/* Folded tea towels — soft note against all the hard props */}
<ellipse cx="1102" cy="812" rx="92" ry="14" fill="url(#kt-castShadow)"/>
<ellipse cx="1090" cy="806" rx="74" ry="11" fill="url(#kt-occl)"/>
<g className="towel" filter="url(#kt-dropSm)">
  {/* bottom fold */}
  <path d="M1020 782 q66 -16 130 0 q10 2 10 10 v12 q0 8 -10 10 q-64 14 -130 0 q-10 -2 -10 -10 v-12 q0 -8 10 -10 Z" fill="#B78E6E"/>
  <path d="M1020 782 q66 -16 130 0 q10 2 10 10 q-10 6 -20 7 q-60 12 -120 0 q-10 -1 -10 -7 q0 -8 10 -10 Z" fill="#DCBB9C"/>
  {/* middle fold */}
  <path d="M1028 758 q60 -15 118 0 q9 2 9 9 v11 q0 7 -9 9 q-58 13 -118 0 q-9 -2 -9 -9 v-11 q0 -7 9 -9 Z" fill="#C79E7C"/>
  <path d="M1028 758 q60 -15 118 0 q9 2 9 9 q-9 5 -18 6 q-54 11 -109 0 q-9 -1 -9 -6 q0 -7 9 -9 Z" fill="#EAD0B6"/>
  {/* top fold, with a rolled edge */}
  <path d="M1036 736 q54 -14 106 0 q8 2 8 8 v10 q0 6 -8 8 q-52 12 -106 0 q-8 -2 -8 -8 v-10 q0 -6 8 -8 Z" fill="#DCBB9C"/>
  <path d="M1036 736 q54 -14 106 0 q8 2 8 8 q-8 5 -16 6 q-48 10 -98 0 q-8 -1 -8 -6 q0 -6 8 -8 Z" fill="#F4E0CB"/>
  <path d="M1044 738 q48 -10 92 0" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity=".55"/>
  {/* woven stripe running across all three */}
  <path d="M1072 734 v76 M1108 732 v78" fill="none" stroke="#A9846A" strokeWidth="6" opacity=".35"/>
</g>

{/* ══════════ 9. LIGHT SHAFT + DUST ══════════ */}
<g className="shaft" filter="url(#kt-shaftSoft)">
  <path d="M100 96 L392 96 L620 900 L214 900 Z" fill="url(#kt-shaftGrad)"/>
</g>
<g fill="#FFF8E2">
  <circle className="mote" cx="330" cy="290" r="2.8" opacity=".85" style={{ animationDuration: "13s" }}/>
  <circle className="mote" cx="424" cy="404" r="2"   opacity=".7"  style={{ animationDuration: "17s", animationDelay: "-4s" }}/>
  <circle className="mote" cx="266" cy="458" r="3.2" opacity=".65" style={{ animationDuration: "15s", animationDelay: "-8s" }}/>
  <circle className="mote" cx="498" cy="348" r="1.9" opacity=".8"  style={{ animationDuration: "19s", animationDelay: "-2s" }}/>
  <circle className="mote" cx="372" cy="540" r="2.4" opacity=".6"  style={{ animationDuration: "23s", animationDelay: "-11s" }}/>
  <circle className="mote" cx="548" cy="486" r="2.1" opacity=".55" style={{ animationDuration: "16s", animationDelay: "-6s" }}/>
  <circle className="mote" cx="212" cy="360" r="2.3" opacity=".7"  style={{ animationDuration: "21s", animationDelay: "-14s" }}/>
</g>

{/* ══════════ 10. FOREGROUND — gives the frame a camera ══════════ */}
<g filter="url(#kt-fgSoft)" opacity=".94">
  <path d="M-40 900 v-210 q0 -44 48 -44 h54 q30 0 30 36 v218 Z" fill="#2A1A0E" opacity=".82"/>
  <path d="M1200 44 q-96 6 -138 74 q-22 36 12 42 q56 8 96 -46 Z" fill="#1D3220" opacity=".78"/>
  <path d="M1240 900 v-120 q-70 10 -96 120 Z" fill="#241408" opacity=".7"/>
</g>

{/* Decoy hit areas: invisible, above the props, below the grade. */}
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
          onDecoy(d.label);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onDecoy(d.label);
          }
        }}
      />
    ))}
  </g>
)}

{/* ══════════ 11. GRADE ══════════ */}
<rect width="1200" height="900" fill="#FFD98A" opacity=".07" style={{ mixBlendMode: "overlay" }}/>
<radialGradient id="kt-vig" cx=".38" cy=".34" r=".8">
  <stop offset=".40" stopColor="#0B1120" stopOpacity="0"/>
  <stop offset="1"   stopColor="#100C1E" stopOpacity=".68"/>
</radialGradient>
<rect width="1200" height="900" fill="url(#kt-vig)"/>
<rect width="1200" height="900" filter="url(#kt-filmGrain)" opacity=".34" style={{ mixBlendMode: "overlay" }}/>
  </svg>
  );
};
