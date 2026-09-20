import React, { useEffect, useState } from "react";
import { playSound } from "../../utils/audio";

/* ==================================================================== *
 *  School Lunch — high-fidelity scene
 *
 *  One SVG on a fixed 1200x900 viewBox, matching the frame's 4:3, so the
 *  art never distorts.
 *
 *  The fifth camera, and the only interior of the five. Indoors the
 *  horizon is EYE LEVEL, and eye level is a real line on the back wall —
 *  so unlike the outdoor scenes it belongs inside the frame, at y=120.
 *  Everything else falls out of five numbers: a 1300px lens, the near edge
 *  of the table 1.95m away, the camera 1.907m off the floor, the table
 *  1.8m by 1.1m at 0.75m high, and the back wall at 10m. From those come
 *  the vanishing point, where the table's far edge lands, how fast the
 *  floor tiles compress, how big a clock is at that distance, and the two
 *  scale rules everything in the room is drawn with.
 *
 *  Light: tall windows in the right-hand wall, out of frame. A window
 *  throws its own SHAPE, not a glow, so it lands as rectangles — and a
 *  rectangle on a horizontal plane has two vanishing points on the
 *  horizon, both shared by the floor and the table, because parallel
 *  horizontal directions vanish at the same point whatever height the
 *  plane is at. That is what makes the light on the table and the light
 *  on the floor read as one beam broken by a table.
 *
 *  The five pieces of litter are NOT in this backdrop — the game has to
 *  tap, light and remove them, so they live in schoolClues.tsx and are
 *  positioned by the screen.
 * ==================================================================== */

/** Things on this table that are genuinely confusable with litter but are
 *  not waste. Each carries its own note rather than a template.
 *
 *  The bin is the one that teaches, and it teaches by being across the hall
 *  from all of this. */
const DECOYS: { label: string; note: string; x: number; y: number; w: number; h: number }[] = [
  { label: "lunch tray",    note: "That goes back on the rack, not in a bin.",       x: 292,  y: 719, w: 256, h: 92  },
  { label: "stack of trays", note: "Somebody already cleared those.",                x: 768,  y: 524, w: 216, h: 140 },
  { label: "exercise book", note: "Half a term's homework in there.",                x: 500,  y: 810, w: 260, h: 84  },
  { label: "beaker",        note: "Water. Still someone's.",                         x: 338,  y: 674, w: 44,  h: 54  },
  { label: "banana",        note: "That's a banana. Come back when it's a peel.",    x: 639,  y: 766, w: 134, h: 40  },
  { label: "pencil case",   note: "Not rubbish. Somebody will cry.",                 x: 988,  y: 844, w: 140, h: 40  },
  { label: "lanyard",       note: "Somebody's name is on that.",                     x: 490,  y: 678, w: 140, h: 44  },
  { label: "rucksack",      note: "That is a whole school day in a bag.",            x: 263,  y: 526, w: 134, h: 112 },
  { label: "bin",           note: "A bin. Across the hall. Remember that.",          x: 502,  y: 318, w: 92,  h: 128 },
];

interface SchoolSceneProps {
  /** Called with that object's own note when the player taps something that
   *  turns out not to be litter. */
  onDecoy?: (note: string) => void;
}

export const SchoolScene: React.FC<SchoolSceneProps> = ({ onDecoy }) => {
  // Three things the player can poke at. The cracked tablet is deliberately
  // NOT one of them: it is a clue, and tapping a clue has to open the
  // sorting picker, so the third toy is the water jug instead.
  const [ringing, setRinging] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [sloshing, setSloshing] = useState(false);

  // Each one-shot is owned by the state that ends it rather than by a ref,
  // so it cleans itself up if the scene unmounts mid-cycle.
  useEffect(() => {
    if (!ringing) return;
    const t = window.setTimeout(() => setRinging(false), 1300);
    return () => window.clearTimeout(t);
  }, [ringing]);

  useEffect(() => {
    if (!launched) return;
    const t = window.setTimeout(() => setLaunched(false), 4200);
    return () => window.clearTimeout(t);
  }, [launched]);

  useEffect(() => {
    if (!sloshing) return;
    const t = window.setTimeout(() => setSloshing(false), 1600);
    return () => window.clearTimeout(t);
  }, [sloshing]);

  const ringBell = () => {
    if (ringing) return;
    setRinging(true);
    playSound.detectiveScan();
  };
  const launchPlane = () => {
    if (launched) return;
    setLaunched(true);
    playSound.detectiveScan();
  };
  const sloshWater = () => {
    if (sloshing) return;
    setSloshing(true);
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
    className={`absolute inset-0 w-full h-full${ringing ? " sc-ringing" : ""}${
      launched ? " sc-launched" : ""}${sloshing ? " sc-sloshing" : ""}`}
    viewBox="0 0 1200 900"
    preserveAspectRatio="xMidYMid slice"
    // the backdrop is inert; only the three props and the decoys opt back in
    style={{ pointerEvents: "none" }}
  >

<defs>
  <clipPath id="sc-tableClip"><path d="M0 892L1200 892L976.4 613.6L209.2 613.6Z"/></clipPath>

  {/* ══ LIGHT MODEL ══
       Early afternoon in a school hall. Two sources that do not agree,
       which is the whole look of the room:

         · TALL WINDOWS in the right-hand wall, out of frame, with the
           sun low enough in them to reach across the floor. This is the
           strong one: warm, hard-edged, and it lands as RECTANGLES —
           a window throws its own shape, and the glazing bars cut it
           into strips. Everything it touches gets a hot edge on its
           RIGHT side, and throws a shadow LEFT and slightly toward the
           camera, twice its own height long.
         · the room's own fill: strip lights and the sky through the
           same windows, cool and directionless. It is what is in the
           shadows, which is why nothing here is grey — the shadows are
           blue-green, and the further from the windows a thing is the
           more of that it is wearing.

       Distance in a room this size does little to colour, so depth is
       carried by the floor grid and by contrast dropping off toward the
       back wall, not by haze. */}

  {/* ── the room ────────────────────────────────────────────────────── */}
  <linearGradient id="sc-wallUp" x1="1" y1="0" x2="0" y2=".7">
    <stop offset="0"   stopColor="#F4EFDC"/>
    <stop offset=".35" stopColor="#DCD9C6"/>
    <stop offset=".75" stopColor="#B6BCAE"/>
    <stop offset="1"   stopColor="#9AA396"/>
  </linearGradient>
  <linearGradient id="sc-wallDado" x1="1" y1="0" x2="0" y2=".6">
    <stop offset="0"   stopColor="#7E9084"/>
    <stop offset=".45" stopColor="#65786E"/>
    <stop offset="1"   stopColor="#4E6259"/>
  </linearGradient>
  <linearGradient id="sc-floorBase" x1=".9" y1="0" x2=".1" y2="1">
    <stop offset="0"   stopColor="#C2CEC4"/>
    <stop offset=".4"  stopColor="#A2B0A8"/>
    <stop offset="1"   stopColor="#6E7E7A"/>
  </linearGradient>

  {/* ── the table: warm beech laminate against a cool room ───────────── */}
  <linearGradient id="sc-tableTop" x1=".92" y1=".05" x2=".1" y2=".95">
    <stop offset="0"   stopColor="#EBD6AC"/>
    <stop offset=".28" stopColor="#DCC49A"/>
    <stop offset=".62" stopColor="#C2A97C"/>
    <stop offset="1"   stopColor="#9E8556"/>
  </linearGradient>

  {/* ── shadow. The fill light is a blue-green room, so that is what is
         in every shadow in it. ─────────────────────────────────────── */}
  <radialGradient id="sc-shadow" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#22423E" stopOpacity=".46"/>
    <stop offset=".62" stopColor="#274943" stopOpacity=".28"/>
    <stop offset="1"   stopColor="#2C4F49" stopOpacity="0"/>
  </radialGradient>
  <radialGradient id="sc-occl" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#17302E" stopOpacity=".6"/>
    <stop offset="1"   stopColor="#17302E" stopOpacity="0"/>
  </radialGradient>

  {/* ── materials ───────────────────────────────────────────────────── */}
  <linearGradient id="sc-steel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stopColor="#6E7A80"/>
    <stop offset=".14" stopColor="#C6D0D4"/>
    <stop offset=".3"  stopColor="#F2F6F8"/>
    <stop offset=".46" stopColor="#96A2A8"/>
    <stop offset=".68" stopColor="#D6DEE2"/>
    <stop offset=".86" stopColor="#78848A"/>
    <stop offset="1"   stopColor="#4E5A60"/>
  </linearGradient>
  <linearGradient id="sc-foil" x1="0" y1="0" x2="1" y2=".3">
    <stop offset="0"   stopColor="#8E98A4"/>
    <stop offset=".22" stopColor="#EEF4F8"/>
    <stop offset=".44" stopColor="#A2AEB8"/>
    <stop offset=".66" stopColor="#F6FAFC"/>
    <stop offset=".84" stopColor="#8E9AA6"/>
    <stop offset="1"   stopColor="#C4CED6"/>
  </linearGradient>
  <linearGradient id="sc-hdpe" x1=".9" y1="0" x2=".1" y2=".9">
    <stop offset="0"   stopColor="#FFFFFF"/>
    <stop offset=".34" stopColor="#F8FBFA"/>
    <stop offset=".74" stopColor="#DCE8E6"/>
    <stop offset="1"   stopColor="#B6C6C4"/>
  </linearGradient>
  <linearGradient id="sc-sunWarm" x1="1" y1="0" x2="0" y2=".6">
    <stop offset="0"   stopColor="#FFF0C6" stopOpacity=".95"/>
    <stop offset=".55" stopColor="#FFE9B4" stopOpacity=".72"/>
    <stop offset="1"   stopColor="#FFE2A2" stopOpacity=".4"/>
  </linearGradient>

  <linearGradient id="sc-wallSun" x1="1" y1=".1" x2="0" y2=".9">
    <stop offset="0"   stopColor="#FFE9B4" stopOpacity=".5"/>
    <stop offset=".4"  stopColor="#FFE4AC" stopOpacity=".14"/>
    <stop offset="1"   stopColor="#2E4A52" stopOpacity=".16"/>
  </linearGradient>
  <linearGradient id="sc-hatchSun" x1="1" y1="0" x2="0" y2=".5">
    <stop offset="0"   stopColor="#FFF0C6" stopOpacity=".55"/>
    <stop offset="1"   stopColor="#FFF0C6" stopOpacity="0"/>
  </linearGradient>
  <radialGradient id="sc-glassSun" cx=".74" cy=".24" r=".7">
    <stop offset="0"   stopColor="#FFFFFF" stopOpacity=".72"/>
    <stop offset=".5"  stopColor="#FFFFFF" stopOpacity=".1"/>
    <stop offset="1"   stopColor="#FFFFFF" stopOpacity="0"/>
  </radialGradient>
  <linearGradient id="sc-tableSun" x1="1" y1="0" x2=".1" y2=".8">
    <stop offset="0"   stopColor="#FFEBB8" stopOpacity=".3"/>
    <stop offset=".4"  stopColor="#FFE6B0" stopOpacity=".05"/>
    <stop offset=".62" stopColor="#3E5E80" stopOpacity=".07"/>
    <stop offset="1"   stopColor="#42628A" stopOpacity=".15"/>
  </linearGradient>
  <linearGradient id="sc-beamG" x1="1" y1="0" x2="0" y2=".8">
    <stop offset="0"   stopColor="#FFF2CE" stopOpacity=".4"/>
    <stop offset=".5"  stopColor="#FFEDBE" stopOpacity=".16"/>
    <stop offset="1"   stopColor="#FFE8B0" stopOpacity="0"/>
  </linearGradient>
  <linearGradient id="sc-card" x1=".9" y1="0" x2=".1" y2="1">
    <stop offset="0"   stopColor="#E8D6B2"/>
    <stop offset=".5"  stopColor="#D2BC92"/>
    <stop offset="1"   stopColor="#A98E64"/>
  </linearGradient>

  <filter id="sc-softSm" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="4"/></filter>
  <filter id="sc-softMd" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="10"/></filter>
  <filter id="sc-softLg" x="-40%" y="-80%" width="180%" height="260%">
    <feGaussianBlur stdDeviation="22"/></filter>
  <filter id="sc-edgeSoft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="sc-fgSoft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="9"/></filter>
  <filter id="sc-filmGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope=".5" intercept="-.19"/></feComponentTransfer>
  </filter>
</defs>

{/* ══════════ 1. THE HALL ══════════
     The back wall is ten metres away, so a metre of it is 130 pixels and
     everything on it is sized off that: the clock is half a metre across
     and lands 65 pixels wide, the dado rail is a metre up and lands 130
     pixels above the skirting. Eye level — the horizon — is the line at
     y=120, and it is a real line on this wall, which is the thing that
     makes an interior an interior. */}
<rect width="1200" height="368" fill="url(#sc-wallUp)"/>
<rect y="238" width="1200" height="130" fill="url(#sc-wallDado)"/>
<rect y="234" width="1200" height="7" fill="#8E9C90"/>
<rect y="234" width="1200" height="2.5" fill="#C4CEBE"/>
<rect y="355" width="1200" height="13" fill="#3E504A"/>
<rect y="355" width="1200" height="3" fill="#6E8076"/>
{/* the sun comes in from the right and rakes along this wall */}
<rect width="1200" height="368" fill="url(#sc-wallSun)"/>

{/* noticeboard: a metre and a bit up, so 1.2m to 2.0m, so y 212 to 108 */}
<g>
  <rect x="176" y="104" width="316" height="112" fill="#6E5A3E"/>
  <rect x="182" y="110" width="304" height="100" fill="#9E8A66"/>
  <rect x="182" y="110" width="304" height="100" fill="#000000" opacity=".1"/>
  <g>
    <rect x="194" y="120" width="56" height="40" fill="#F2EEE0" transform="rotate(-2 222 140)"/>
    <rect x="258" y="124" width="48" height="36" fill="#E4EEF4" transform="rotate(1.5 282 142)"/>
    <rect x="316" y="118" width="60" height="44" fill="#F6F2E6" transform="rotate(-1 346 140)"/>
    <rect x="386" y="126" width="52" height="34" fill="#FFF0D0" transform="rotate(2 412 143)"/>
    <rect x="206" y="168" width="64" height="32" fill="#EDE8D8" transform="rotate(1 238 184)"/>
    <rect x="284" y="166" width="46" height="36" fill="#DCE8EE" transform="rotate(-2 307 184)"/>
    <rect x="344" y="170" width="72" height="30" fill="#F4EFE0" transform="rotate(.8 380 185)"/>
  </g>
  <g fill="#3E4A52" opacity=".35">
    <rect x="200" y="122" width="44" height="3"/><rect x="200" y="130" width="34" height="3"/>
    <rect x="322" y="124" width="48" height="3"/><rect x="322" y="132" width="36" height="3"/>
    <rect x="212" y="174" width="52" height="3"/><rect x="350" y="176" width="58" height="3"/>
  </g>
</g>

{/* the serving hatch, shut */}
<g>
  <rect x="604" y="96" width="304" height="150" fill="#4A5A54"/>
  <rect x="612" y="104" width="288" height="128" fill="#8E9A94"/>
  <g stroke="#6E7A76" strokeWidth="1.6">
    <path d="M612 112h288M612 122h288M612 132h288M612 142h288M612 152h288M612 162h288
             M612 172h288M612 182h288M612 192h288M612 202h288M612 212h288M612 222h288"/>
  </g>
  <rect x="612" y="104" width="288" height="128" fill="url(#sc-hatchSun)"/>
  <rect x="604" y="238" width="304" height="14" fill="#C6CEC6"/>
  <rect x="604" y="238" width="304" height="4" fill="#EEF2EC"/>
</g>

{/* the clock, and the bell nobody argues with */}
<g>
  <circle cx="1046" cy="86" r="34" fill="#37413E"/>
  <circle cx="1046" cy="86" r="30" fill="#F6F4EA"/>
  <circle cx="1046" cy="86" r="30" fill="url(#sc-glassSun)"/>
  <g stroke="#37413E" strokeWidth="2.2">
    <path d="M1046 60v5M1046 107v5M1020 86h5M1067 86h5"/>
  </g>
  <path d="M1046 86v-19" stroke="#2A332F" strokeWidth="3.2" strokeLinecap="round"/>
  <path d="M1046 86l14 9" stroke="#2A332F" strokeWidth="2.6" strokeLinecap="round"/>
  <g className="second"><path d="M1046 86l-9 -17" stroke="#B23A2E" strokeWidth="1.6" strokeLinecap="round"/></g>
  <circle cx="1046" cy="86" r="2.6" fill="#2A332F"/>
</g>
<g {...prop("The hall bell. Click it.", ringBell)}>
  <g className="bellBody">
    <rect x="1128" y="58" width="6" height="16" fill="#6E7A76"/>
    <path d="M1108 74 q23 -8 46 0 q7 24 -3 32 h-40 q-10 -8 -3 -32 Z" fill="#B08A3A"/>
    <path d="M1108 74 q23 -8 46 0 q-6 5 -23 5 q-17 0 -23 -5 Z" fill="#E4C070"/>
    <path d="M1140 76 q12 3 14 -2 q7 24 -3 32 h-12 q6 -16 1 -30 Z" fill="#8A6A26" opacity=".7"/>
    <rect x="1104" y="104" width="54" height="8" rx="3" fill="#C69A44"/>
    <circle cx="1131" cy="117" r="5" fill="#8A6A26"/>
  </g>
  <g className="ring" fill="none" stroke="#FFE9B0" strokeWidth="2.6">
    <path d="M1166 68 q16 20 0 42"/><path d="M1178 58 q26 32 0 62"/>
    <path d="M1096 68 q-16 20 0 42"/><path d="M1084 58 q-26 32 0 62"/>
  </g>
</g>

{/* ══════════ 1b. WHERE THE LIGHT IS COMING FROM ══════════
     The windows are in the right-hand wall, out of frame, so the only way
     to say where they are is to let them throw their own shape onto the
     back wall: two tall slants of light, leaning because the wall is
     being lit from the side and from low down. */}
<g style={{ mixBlendMode: "screen" }} pointerEvents="none">
  <path d="M986 368 L1096 0 L1190 0 L1086 368 Z" fill="url(#sc-sunWarm)" opacity=".42"/>
  <path d="M768 368 L878 0 L930 0 L830 368 Z" fill="url(#sc-sunWarm)" opacity=".28"/>
</g>

{/* ══════════ 2. THE FLOOR ══════════ */}
<rect y="368" width="1200" height="532" fill="url(#sc-floorBase)"/>
<g>
<path fill="#AFBCB2" d="M40.6 577.2L136.5 577.2L167 545.8L77.7 545.8ZM424.2 577.2L520.1 577.2L524.2 545.8L434.9 545.8ZM807.7 577.2L903.6 577.2L881.4 545.8L792.1 545.8ZM999.5 577.2L1095.4 577.2L1060 545.8L970.7 545.8ZM1191.3 577.2L1287.2 577.2L1238.6 545.8L1149.3 545.8ZM167 545.8L256.3 545.8L277.1 518.4L193.5 518.4ZM702.8 545.8L792.1 545.8L778.5 518.4L694.9 518.4ZM1060 545.8L1149.3 545.8L1112.7 518.4L1029.2 518.4ZM1238.6 545.8L1327.9 545.8L1279.8 518.4L1196.3 518.4ZM109.9 518.4L193.5 518.4L216.9 494.3L138.3 494.3ZM611.3 518.4L694.9 518.4L688 494.3L609.4 494.3ZM945.6 518.4L1029.2 518.4L1002 494.3L923.5 494.3ZM1112.7 518.4L1196.3 518.4L1159.1 494.3L1080.5 494.3ZM1279.8 518.4L1363.4 518.4L1316.1 494.3L1237.6 494.3ZM373.9 494.3L452.4 494.3L459.7 473L385.6 473ZM530.9 494.3L609.4 494.3L607.8 473L533.7 473ZM688 494.3L766.5 494.3L755.9 473L681.8 473ZM845 494.3L923.5 494.3L903.9 473L829.9 473ZM1002 494.3L1080.5 494.3L1052 473L978 473ZM1159.1 494.3L1237.6 494.3L1200.1 473L1126.1 473ZM1316.1 494.3L1394.6 494.3L1348.2 473L1274.2 473ZM-132.7 473L-58.6 473L-24.2 454L-94.3 454ZM311.6 473L385.6 473L396.1 454L326 454ZM903.9 473L978 473L956.5 454L886.5 454ZM1052 473L1126.1 473L1096.7 454L1026.6 454ZM-164.3 454L-94.3 454L-59.8 436.9L-126.3 436.9ZM256 454L326 454L339 436.9L272.6 436.9ZM676.3 454L746.4 454L737.9 436.9L671.4 436.9ZM816.4 454L886.5 454L870.8 436.9L804.3 436.9ZM1096.7 454L1166.7 454L1136.7 436.9L1070.2 436.9ZM339 436.9L405.5 436.9L414 421.5L350.8 421.5ZM1003.8 436.9L1070.2 436.9L1046.4 421.5L983.1 421.5ZM414 421.5L477.2 421.5L482 407.5L421.7 407.5ZM919.9 421.5L983.1 421.5L964.4 407.5L904.1 407.5ZM1046.4 421.5L1109.6 421.5L1085.1 407.5L1024.7 407.5ZM1299.3 421.5L1362.6 421.5L1326.3 407.5L1266 407.5ZM240.8 407.5L301.1 407.5L313.4 394.8L255.8 394.8ZM964.4 407.5L1024.7 407.5L1005 394.8L947.4 394.8ZM1205.7 407.5L1266 407.5L1235.6 394.8L1177.9 394.8ZM-32.3 394.8L25.3 394.8L48.8 383.1L-6.3 383.1ZM198.2 394.8L255.8 394.8L269.6 383.1L214.4 383.1ZM313.4 394.8L371.1 394.8L379.9 383.1L324.8 383.1ZM428.7 394.8L486.3 394.8L490.3 383.1L435.1 383.1ZM-61.5 383.1L-6.3 383.1L17.5 372.4L-35.4 372.4ZM490.3 383.1L545.5 383.1L546.9 372.4L494 372.4ZM711.1 383.1L766.2 383.1L758.7 372.4L705.7 372.4ZM821.4 383.1L876.6 383.1L864.5 372.4L811.6 372.4Z"/>
<path fill="#9DAAA1" d="M101.2 613.6L204.7 613.6L232.4 577.2L136.5 577.2ZM515.3 613.6L618.8 613.6L616 577.2L520.1 577.2ZM232.4 577.2L328.3 577.2L345.6 545.8L256.3 545.8ZM-190.3 545.8L-101 545.8L-57.2 518.4L-140.7 518.4ZM-11.6 545.8L77.7 545.8L109.9 518.4L26.4 518.4ZM345.6 545.8L434.9 545.8L444.2 518.4L360.6 518.4ZM277.1 518.4L360.6 518.4L373.9 494.3L295.4 494.3ZM444.2 518.4L527.8 518.4L530.9 494.3L452.4 494.3ZM778.5 518.4L862 518.4L845 494.3L766.5 494.3ZM216.9 494.3L295.4 494.3L311.6 473L237.5 473ZM15.4 473L89.4 473L115.9 454L45.8 454ZM163.5 473L237.5 473L256 454L185.9 454ZM-24.2 454L45.8 454L73.1 436.9L6.7 436.9ZM115.9 454L185.9 454L206.1 436.9L139.6 436.9ZM396.1 454L466.2 454L472 436.9L405.5 436.9ZM536.2 454L606.3 454L604.9 436.9L538.5 436.9ZM956.5 454L1026.6 454L1003.8 436.9L937.3 436.9ZM1236.8 454L1306.8 454L1269.7 436.9L1203.2 436.9ZM-59.8 436.9L6.7 436.9L34.6 421.5L-28.7 421.5ZM870.8 436.9L937.3 436.9L919.9 421.5L856.7 421.5ZM1136.7 436.9L1203.2 436.9L1172.9 421.5L1109.6 421.5ZM1269.7 436.9L1336.1 436.9L1299.3 421.5L1236.1 421.5ZM-91.9 421.5L-28.7 421.5L-0.4 407.5L-60.8 407.5ZM34.6 421.5L97.8 421.5L120.2 407.5L59.9 407.5ZM287.5 421.5L350.8 421.5L361.4 407.5L301.1 407.5ZM540.5 421.5L603.7 421.5L602.6 407.5L542.3 407.5ZM667 421.5L730.2 421.5L723.2 407.5L662.9 407.5ZM1172.9 421.5L1236.1 421.5L1205.7 407.5L1145.4 407.5ZM-0.4 407.5L59.9 407.5L82.9 394.8L25.3 394.8ZM120.2 407.5L180.5 407.5L198.2 394.8L140.6 394.8ZM482 407.5L542.3 407.5L544 394.8L486.3 394.8ZM602.6 407.5L662.9 407.5L659.2 394.8L601.6 394.8ZM723.2 407.5L783.5 407.5L774.5 394.8L716.9 394.8ZM1085.1 407.5L1145.4 407.5L1120.3 394.8L1062.7 394.8ZM544 394.8L601.6 394.8L600.7 383.1L545.5 383.1ZM659.2 394.8L716.9 394.8L711.1 383.1L655.9 383.1ZM889.8 394.8L947.4 394.8L931.8 383.1L876.6 383.1ZM1120.3 394.8L1177.9 394.8L1152.5 383.1L1097.4 383.1ZM1235.6 394.8L1293.2 394.8L1262.9 383.1L1207.7 383.1ZM269.6 383.1L324.8 383.1L335.2 372.4L282.2 372.4ZM379.9 383.1L435.1 383.1L441 372.4L388.1 372.4ZM600.7 383.1L655.9 383.1L652.8 372.4L599.8 372.4ZM931.8 383.1L987 383.1L970.4 372.4L917.5 372.4Z"/>
<path fill="#BAC6BC" d="M-105.9 613.6L-2.4 613.6L40.6 577.2L-55.3 577.2ZM308.2 613.6L411.8 613.6L424.2 577.2L328.3 577.2ZM722.3 613.6L825.9 613.6L807.7 577.2L711.8 577.2ZM929.4 613.6L1032.9 613.6L999.5 577.2L903.6 577.2ZM1136.5 613.6L1240 613.6L1191.3 577.2L1095.4 577.2ZM-151.2 577.2L-55.3 577.2L-11.6 545.8L-101 545.8ZM616 577.2L711.8 577.2L702.8 545.8L613.5 545.8ZM524.2 545.8L613.5 545.8L611.3 518.4L527.8 518.4ZM881.4 545.8L970.7 545.8L945.6 518.4L862 518.4ZM-57.2 518.4L26.4 518.4L59.8 494.3L-18.7 494.3ZM-97.2 494.3L-18.7 494.3L15.4 473L-58.6 473ZM59.8 494.3L138.3 494.3L163.5 473L89.4 473ZM459.7 473L533.7 473L536.2 454L466.2 454ZM607.8 473L681.8 473L676.3 454L606.3 454ZM755.9 473L829.9 473L816.4 454L746.4 454ZM1200.1 473L1274.2 473L1236.8 454L1166.7 454ZM73.1 436.9L139.6 436.9L161 421.5L97.8 421.5ZM206.1 436.9L272.6 436.9L287.5 421.5L224.3 421.5ZM472 436.9L538.5 436.9L540.5 421.5L477.2 421.5ZM604.9 436.9L671.4 436.9L667 421.5L603.7 421.5ZM737.9 436.9L804.3 436.9L793.4 421.5L730.2 421.5ZM161 421.5L224.3 421.5L240.8 407.5L180.5 407.5ZM793.4 421.5L856.7 421.5L843.8 407.5L783.5 407.5ZM-121.1 407.5L-60.8 407.5L-32.3 394.8L-90 394.8ZM361.4 407.5L421.7 407.5L428.7 394.8L371.1 394.8ZM843.8 407.5L904.1 407.5L889.8 394.8L832.1 394.8ZM-147.6 394.8L-90 394.8L-61.5 383.1L-116.7 383.1ZM82.9 394.8L140.6 394.8L159.2 383.1L104 383.1ZM774.5 394.8L832.1 394.8L821.4 383.1L766.2 383.1ZM1005 394.8L1062.7 394.8L1042.2 383.1L987 383.1ZM48.8 383.1L104 383.1L123.4 372.4L70.5 372.4ZM159.2 383.1L214.4 383.1L229.3 372.4L176.3 372.4ZM1042.2 383.1L1097.4 383.1L1076.3 372.4L1023.4 372.4ZM1152.5 383.1L1207.7 383.1L1182.2 372.4L1129.2 372.4Z"/>
<path d="M-1762.3 613.6L-617.7 372.4M-1658.8 613.6L-564.8 372.4M-1555.3 613.6L-511.9 372.4M-1451.8 613.6L-458.9 372.4M-1348.2 613.6L-406 372.4M-1244.7 613.6L-353 372.4M-1141.2 613.6L-300.1 372.4M-1037.6 613.6L-247.2 372.4M-934.1 613.6L-194.2 372.4M-830.6 613.6L-141.3 372.4M-727.1 613.6L-88.3 372.4M-623.5 613.6L-35.4 372.4M-520 613.6L17.5 372.4M-416.5 613.6L70.5 372.4M-312.9 613.6L123.4 372.4M-209.4 613.6L176.3 372.4M-105.9 613.6L229.3 372.4M-2.4 613.6L282.2 372.4M101.2 613.6L335.2 372.4M204.7 613.6L388.1 372.4M308.2 613.6L441 372.4M411.8 613.6L494 372.4M515.3 613.6L546.9 372.4M618.8 613.6L599.8 372.4M722.3 613.6L652.8 372.4M825.9 613.6L705.7 372.4M929.4 613.6L758.7 372.4M1032.9 613.6L811.6 372.4M1136.5 613.6L864.5 372.4M1240 613.6L917.5 372.4M1343.5 613.6L970.4 372.4M1447 613.6L1023.4 372.4M1550.6 613.6L1076.3 372.4M1654.1 613.6L1129.2 372.4M1757.6 613.6L1182.2 372.4M1861.2 613.6L1235.1 372.4" fill="none" stroke="#5E6E68" strokeOpacity=".3" strokeWidth="1.3"/>
<path d="M-520 613.6L1900 613.6M-438.9 577.2L1802.6 577.2M-368.9 545.8L1718.6 545.8M-307.9 518.4L1645.5 518.4M-254.2 494.3L1581.1 494.3M-206.7 473L1524.1 473M-164.3 454L1473.2 454M-126.3 436.9L1427.5 436.9M-91.9 421.5L1386.3 421.5M-60.8 407.5L1348.9 407.5M-32.3 394.8L1314.8 394.8M-6.3 383.1L1283.6 383.1M17.5 372.4L1255 372.4" fill="none" stroke="#5E6E68" strokeOpacity=".26" strokeWidth="1.3"/>
</g>

{/* ══════════════════════════════════════════════════════════════════════
     2b. THE LIGHT ON THE FLOOR

     A window does not throw a glow, it throws its own SHAPE. These are
     rectangles lying on a horizontal plane, and a rectangle on a
     horizontal plane has two vanishing points on the horizon — one for
     each pair of its edges. Both are shared by the floor and the table,
     because parallel horizontal directions vanish at the same point
     whatever height the plane is at, which is what makes the light on the
     table and the light on the floor read as one beam broken by a table
     rather than as two unrelated bright shapes.

     The bars across them are the glazing. Without those a bright quad on
     a floor reads as spilt paint.
     ══════════════════════════════════════════════════════════════════════ */}
<g style={{ mixBlendMode: "screen" }} pointerEvents="none">
  <path d="M512.7 347.5L1366.1 462.2L1240.1 490.4L385.8 359.6Z M331.6 364.8L1184.1 502.9L1048.2 533.2L205.2 376.8Z" fill="url(#sc-sunWarm)" opacity=".78" filter="url(#sc-edgeSoft)"/>
</g>
<g pointerEvents="none" opacity=".42">
  <path d="M616.6 361.5L629 363.2L499.5 377L487.3 375.2Z M431.8 381L443.9 383L313.5 396.9L301.8 394.8Z M782 383.7L796.9 385.7L665.1 402.4L650.4 400.1Z M593.5 407.2L608.1 409.6L473.5 426.6L459.1 423.9Z M941.9 405.2L959.4 407.6L827.1 427.2L809.6 424.5Z M752 432.9L769.4 435.7L632.2 456L615 452.8Z M1085.5 424.5L1105.4 427.2L974.1 449.7L954 446.6Z M896.4 456.3L916.5 459.5L778.5 483.2L758.4 479.4Z M1225 443.3L1247.5 446.3L1118.5 471.7L1095.6 468.2Z M1038.5 479.3L1061.5 483L924 510.1L900.8 505.8Z" fill="#2E4A52" filter="url(#sc-edgeSoft)"/>
</g>

{/* ══════════ 2c. CHAIRS ══════════
     The three at the far side of the table are standing at 3.3 metres,
     which the horizon turns into 394 pixels per metre — so a 850mm back
     comes out 335 tall and only its top 80 pixels clear the table's far
     edge. The rest is behind the table, which is exactly what you see in
     a hall. The two out on the floor are at six metres and land half the
     size. Nothing here was scaled by eye. */}
<g>
  <g transform="translate(306,592) scale(0.2475)"><ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#sc-shadow)"/><g stroke="#6E7A84" strokeWidth="34" fill="none" strokeLinecap="round"><path d="M-192 0 L-160 -430 M192 0 L160 -430 M-150 -30 L-128 -420 M150 -30 L128 -420"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".85"><path d="M186 -12 L156 -422 M144 -40 L124 -412"/></g><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#2E5E9E"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#5A8CC8"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#1E4272" opacity=".7"/><g transform="rotate(-3 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#2E5E9E"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#5A8CC8"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#1E4272" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#1E4272" opacity=".45"/></g></g>
  <g transform="translate(596,586) scale(0.2444)"><ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#sc-shadow)"/><g stroke="#6E7A84" strokeWidth="34" fill="none" strokeLinecap="round"><path d="M-192 0 L-160 -430 M192 0 L160 -430 M-150 -30 L-128 -420 M150 -30 L128 -420"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".85"><path d="M186 -12 L156 -422 M144 -40 L124 -412"/></g><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#B03A32"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#DC6A5E"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#7E241E" opacity=".7"/><g transform="rotate(2 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#B03A32"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#DC6A5E"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#7E241E" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#7E241E" opacity=".45"/></g></g>
  <g transform="translate(872,578) scale(0.2402)"><ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#sc-shadow)"/><g stroke="#6E7A84" strokeWidth="34" fill="none" strokeLinecap="round"><path d="M-192 0 L-160 -430 M192 0 L160 -430 M-150 -30 L-128 -420 M150 -30 L128 -420"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".85"><path d="M186 -12 L156 -422 M144 -40 L124 -412"/></g><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#2E5E9E"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#5A8CC8"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#1E4272" opacity=".7"/><g transform="rotate(-4 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#2E5E9E"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#5A8CC8"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#1E4272" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#1E4272" opacity=".45"/></g></g>
</g>

{/* ══════════ 3. THE REST OF THE HALL ══════════
     Two more tables, at seven and eight and a half metres. At that
     distance a metre is 186 and 153 pixels, so they come out 335 and 275
     wide — smaller than the near table by exactly as much as the floor
     grid says they should be. */}
<g opacity=".97">
  <g transform="translate(228,474)">
    <ellipse cx="-56" cy="6" rx="210" ry="20" fill="url(#sc-shadow)" filter="url(#sc-softMd)"/>
    <rect x="-168" y="-146" width="336" height="13" rx="2" fill="#D8C29A"/>
    <rect x="-168" y="-146" width="336" height="4" fill="#F2E2BE"/>
    <rect x="-168" y="-133" width="336" height="6" fill="#9E8556"/>
    <rect x="-150" y="-127" width="9" height="127" fill="#8E9A9E"/>
    <rect x="142" y="-127" width="9" height="127" fill="#8E9A9E"/>
    <rect x="-156" y="-4" width="24" height="7" rx="2" fill="#6E7A80"/>
    <rect x="136" y="-4" width="24" height="7" rx="2" fill="#6E7A80"/>
    <rect x="-190" y="-88" width="380" height="11" rx="2" fill="#CDB893"/>
    <rect x="-190" y="-88" width="380" height="3.5" fill="#EADCBB"/>
  </g>
  <g transform="translate(922,412)">
    <ellipse cx="-44" cy="5" rx="170" ry="16" fill="url(#sc-shadow)" filter="url(#sc-softMd)"/>
    <rect x="-138" y="-120" width="276" height="11" rx="2" fill="#D2BB92"/>
    <rect x="-138" y="-120" width="276" height="3.4" fill="#EDDDB8"/>
    <rect x="-138" y="-109" width="276" height="5" fill="#967E50"/>
    <rect x="-122" y="-104" width="7" height="104" fill="#8E9A9E"/>
    <rect x="116" y="-104" width="7" height="104" fill="#8E9A9E"/>
    <rect x="-156" y="-72" width="312" height="9" rx="2" fill="#C6B189"/>
    <rect x="-156" y="-72" width="312" height="3" fill="#E4D5B0"/>
  </g>
  {/* a radiator, on the wall by the hatch */}
  <g>
    <rect x="952" y="262" width="214" height="86" rx="4" fill="#C8D0C8"/>
    <rect x="952" y="262" width="214" height="9" rx="4" fill="#E8EEE6"/>
    <g fill="#A8B4AC">
      <rect x="962" y="272" width="11" height="68" rx="4"/><rect x="982" y="272" width="11" height="68" rx="4"/>
      <rect x="1002" y="272" width="11" height="68" rx="4"/><rect x="1022" y="272" width="11" height="68" rx="4"/>
      <rect x="1042" y="272" width="11" height="68" rx="4"/><rect x="1062" y="272" width="11" height="68" rx="4"/>
      <rect x="1082" y="272" width="11" height="68" rx="4"/><rect x="1102" y="272" width="11" height="68" rx="4"/>
      <rect x="1122" y="272" width="11" height="68" rx="4"/><rect x="1142" y="272" width="11" height="68" rx="4"/>
    </g>
    <rect x="952" y="262" width="214" height="86" rx="4" fill="url(#sc-hatchSun)"/>
    <rect x="1160" y="336" width="8" height="20" fill="#8E9A94"/>
  </g>
  {/* two chairs out on the floor: one pushed back from the table, one
       with somebody's jumper still over the back of it */}
  <g transform="translate(146,556) scale(0.2286)">
    <ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#sc-shadow)"/>
    <g stroke="#6E7A84" strokeWidth="34" fill="none" strokeLinecap="round"><path d="M-192 0 L-160 -430 M192 0 L160 -430 M-150 -30 L-128 -420 M150 -30 L128 -420"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".85"><path d="M186 -12 L156 -422 M144 -40 L124 -412"/></g><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#5E6A72"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#8E9AA4"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#3E4A52" opacity=".7"/><g transform="rotate(3 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#5E6A72"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#8E9AA4"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#3E4A52" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#3E4A52" opacity=".45"/></g>
  </g>
  <g transform="translate(712,530) scale(0.215)">
    <ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#sc-shadow)"/>
    <g stroke="#6E7A84" strokeWidth="34" fill="none" strokeLinecap="round"><path d="M-192 0 L-160 -430 M192 0 L160 -430 M-150 -30 L-128 -420 M150 -30 L128 -420"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".85"><path d="M186 -12 L156 -422 M144 -40 L124 -412"/></g><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#2E7A70"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#5AA89C"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#1E574F" opacity=".7"/><g transform="rotate(-2 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#2E7A70"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#5AA89C"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#1E574F" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#1E574F" opacity=".45"/></g>
    <path d="M-160 -792 q80 -26 156 -4 q36 64 18 154 q-20 42 -56 46
             q-42 -72 -118 -50 q-16 -76 0 -146 Z" fill="#7E2C46"/>
    <path d="M-160 -792 q80 -26 156 -4 q-76 6 -152 32 Z" fill="#A85068" opacity=".8"/>
    <path d="M-20 -798 q36 64 18 154 q-20 42 -56 46 q42 -82 38 -200 Z" fill="#5A1C30" opacity=".6"/>
    <path d="M-158 -720 q84 -22 164 -2" fill="none" stroke="#5A1C30" strokeOpacity=".45" strokeWidth="10"/>
  </g>

  {/* and the rest of them stacked against the wall, where they spend
       lunchtime */}
  <g transform="translate(1124,498) scale(0.1982)">
    <ellipse cx="-130" cy="10" rx="300" ry="38" fill="url(#sc-shadow)"/>
    <g transform="translate(0,-30)"><g stroke="#6E7A84" strokeWidth="34" fill="none" strokeLinecap="round"><path d="M-192 0 L-160 -430 M192 0 L160 -430 M-150 -30 L-128 -420 M150 -30 L128 -420"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".85"><path d="M186 -12 L156 -422 M144 -40 L124 -412"/></g><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#2E5E9E"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#5A8CC8"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#1E4272" opacity=".7"/><g transform="rotate(-11 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#2E5E9E"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#5A8CC8"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#1E4272" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#1E4272" opacity=".45"/></g></g>
    <g transform="translate(-22,-150)"><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#B03A32"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#DC6A5E"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#7E241E" opacity=".7"/><g transform="rotate(-11 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#B03A32"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#DC6A5E"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#7E241E" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#7E241E" opacity=".45"/></g></g>
    <g transform="translate(8,-270)"><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#2E5E9E"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#5A8CC8"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#1E4272" opacity=".7"/><g transform="rotate(-11 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#2E5E9E"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#5A8CC8"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#1E4272" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#1E4272" opacity=".45"/></g></g>
    <g transform="translate(-14,-390)"><path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 v-34 q0 -22 22 -22 Z" fill="#2E7A70"/><path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="#5AA89C"/><path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="#1E574F" opacity=".7"/><g transform="rotate(-11 0 -430)"><g stroke="#6E7A84" strokeWidth="32" fill="none" strokeLinecap="round"><path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g><g stroke="#DCE6EA" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".8"><path d="M182 -424 L174 -786"/></g><path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 v-148 q0 -26 26 -26 Z" fill="#2E7A70"/><path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="#5AA89C"/><path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="#1E574F" opacity=".65"/><path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 v-12 q0 -10 10 -10 Z" fill="#1E574F" opacity=".45"/></g></g>
  </g>

  <g transform="translate(548,444)">
    <ellipse cx="-30" cy="5" rx="66" ry="12" fill="url(#sc-shadow)" filter="url(#sc-softMd)"/>
    <path d="M-42 0 l7 -108 h70 l7 108 Z" fill="#3E5A4E"/>
    <path d="M-42 0 l7 -108 h20 l-5 108 Z" fill="#587A68" opacity=".8"/>
    <path d="M-36 -108 h72 v-9 h-72 Z" fill="#2E4A3E"/>
    <path d="M-30 -117 h60 v-6 q0 -4 -6 -4 h-48 q-6 0 -6 4 Z" fill="#264236"/>
  </g>
</g>

{/* ══════════════════════════════════════════════════════════════════════
     4. THE TABLE

     Its two ends run to the vanishing point and its far edge sits where a
     1.1m-deep table 1.95m from the lens actually falls: y=614, not
     wherever looked about right. Everything laid on it from here down is
     drawn in millimetres at its real size, and the scale comes from the
     horizon — 0.864 pixels per millimetre for every unit of (y-120).
     ══════════════════════════════════════════════════════════════════════ */}
<g>
  <path d="M0 892L1200 892L976.4 613.6L209.2 613.6Z" fill="#6E5A3A" opacity=".5" filter="url(#sc-softMd)" transform="translate(-16,7)"/>
  <path d="M0 892L1200 892L976.4 613.6L209.2 613.6Z" fill="url(#sc-tableTop)"/>
  {/* laminate grain, running with the length of the board, so to the VP */}
  <g clipPath="url(#sc-tableClip)">
    <path d="M-300 892L17.4 613.6M-280 892L30.2 613.6M-260 892L43 613.6M-240 892L55.7 613.6M-220 892L68.5 613.6M-200 892L81.3 613.6M-180 892L94.1 613.6M-160 892L106.9 613.6M-140 892L119.7 613.6M-120 892L132.5 613.6M-100 892L145.2 613.6M-80 892L158 613.6M-60 892L170.8 613.6M-40 892L183.6 613.6M-20 892L196.4 613.6M0 892L209.2 613.6M20 892L222 613.6M40 892L234.8 613.6M60 892L247.5 613.6M80 892L260.3 613.6M100 892L273.1 613.6M120 892L285.9 613.6M140 892L298.7 613.6M160 892L311.5 613.6M180 892L324.3 613.6M200 892L337 613.6M220 892L349.8 613.6M240 892L362.6 613.6M260 892L375.4 613.6M280 892L388.2 613.6M300 892L401 613.6M320 892L413.8 613.6M340 892L426.6 613.6M360 892L439.3 613.6M380 892L452.1 613.6M400 892L464.9 613.6M420 892L477.7 613.6M440 892L490.5 613.6M460 892L503.3 613.6M480 892L516.1 613.6M500 892L528.9 613.6M520 892L541.6 613.6M540 892L554.4 613.6M560 892L567.2 613.6M580 892L580 613.6M600 892L592.8 613.6M620 892L605.6 613.6M640 892L618.4 613.6M660 892L631.1 613.6M680 892L643.9 613.6M700 892L656.7 613.6M720 892L669.5 613.6M740 892L682.3 613.6M760 892L695.1 613.6M780 892L707.9 613.6M800 892L720.7 613.6M820 892L733.4 613.6M840 892L746.2 613.6M860 892L759 613.6M880 892L771.8 613.6M900 892L784.6 613.6M920 892L797.4 613.6M940 892L810.2 613.6M960 892L823 613.6M980 892L835.7 613.6M1000 892L848.5 613.6M1020 892L861.3 613.6M1040 892L874.1 613.6M1060 892L886.9 613.6M1080 892L899.7 613.6M1100 892L912.5 613.6M1120 892L925.2 613.6M1140 892L938 613.6M1160 892L950.8 613.6M1180 892L963.6 613.6M1200 892L976.4 613.6M1220 892L989.2 613.6M1240 892L1002 613.6M1260 892L1014.8 613.6M1280 892L1027.5 613.6M1300 892L1040.3 613.6M1320 892L1053.1 613.6M1340 892L1065.9 613.6M1360 892L1078.7 613.6M1380 892L1091.5 613.6M1400 892L1104.3 613.6" fill="none" stroke="#8E7444" strokeOpacity=".14" strokeWidth="1.2"/>
    <path d="M674.1 742.3L742.3 742M708.4 756.8L734.2 756.9M963.3 788.9L984.8 787.3M984 647.4L1030.4 643.7M1176.3 881.3L1240.5 882.3M-1.4 664.9L38.2 661.4M280 673.5L294.5 673.2M1024.6 739.2L1069 740.3M801.4 754.7L843.3 753M1214.7 885.4L1292.5 887M264.8 706.3L294.3 702.9M476.5 824.7L548.6 823.8M1030.7 875L1048.3 872.7M562.8 862.5L648 861.6M760.5 642.7L810.7 640.9M392.4 646.4L452 648.5M285.5 654.5L303 651M200.3 832.7L254.1 832.3M887.5 673.6L907.2 674.8M501.7 654.1L524.8 652.3M976.2 878.4L1015.4 881.4M468.9 678.9L526.5 680M1206.7 649.9L1229.6 648M387.9 826.3L423.9 822.9M702.6 647.2L726.8 648M542 721.1L609.8 721" fill="none" stroke="#F6EBCE" strokeOpacity=".3" strokeWidth="2.2"/>
    <rect x="-20" y="600" width="1240" height="320" fill="url(#sc-tableSun)"/>
  </g>
  {/* the light, cut to the table it is lying on. Its clip and its blend
       are both on the path itself: put the clip on a parent GROUP and
       that group becomes a stacking context, and a stacking context
       isolates the blending of everything inside it. */}
  <path d="M757 579.6L1386 728.8L1241.8 786.7L606.5 611.8Z M563.3 621.1L1199.1 803.9L1097.5 844.7L462.6 642.7Z" clipPath="url(#sc-tableClip)" fill="url(#sc-sunWarm)"
        opacity=".92" filter="url(#sc-edgeSoft)" style={{ mixBlendMode: "screen" }}/>
  <g clipPath="url(#sc-tableClip)" opacity=".34">
    <path d="M803.3 590.5L811 592.4L659.9 626.5L652.3 624.4Z M608.8 634.2L616.4 636.4L514.9 659.3L507.4 657Z M916 617.3L924.7 619.3L773 657.7L764.4 655.3Z M720.5 666.3L729.1 668.8L626.2 694.8L617.7 692.1Z M1046.1 648.1L1055.8 650.4L904.7 693.9L894.8 691.2Z M850.8 703.8L860.6 706.6L757 736.4L747.2 733.3Z M1184.9 681.1L1195.9 683.7L1046.7 733L1035.5 729.9Z M991.7 744.2L1002.9 747.5L899.4 781.7L888.1 778.1Z M1327.8 715L1340.2 717.9L1194.6 773.7L1181.8 770.2Z M1138.7 786.5L1151.6 790.2L1049.3 829.4L1036.3 825.3Z" fill="#25454E" filter="url(#sc-edgeSoft)"/>
  </g>
  {/* the far edge, and the shadow the table drops into the floor behind */}
  <path d="M209.2 613.6 L976.4 613.6" stroke="#8E7444" strokeOpacity=".5" strokeWidth="2"/>
  <path d="M209.2 613.6 L976.4 613.6" stroke="#FFF2D4" strokeOpacity=".5" strokeWidth="1.4"
        transform="translate(0,-1.6)"/>
</g>

{/* ══════════════════════════════════════════════════════════════════════
     6. WHAT LUNCH LEFT BEHIND THAT ISN'T RUBBISH

     All of it drawn in millimetres at real size. Anything lying FLAT is
     also squashed by (y-120)/1300 — the foreshortening of the table plane
     at that height — because a 420mm tray drawn as a 420x320 rectangle
     looks like it is standing on its edge.
     ══════════════════════════════════════════════════════════════════════ */}

{/* ── the tray. Still someone's, until it goes back on the rack. ─────── */}
<g transform="translate(420,768) scale(0.5596,0.2789)">
  <ellipse cx="-90" cy="26" rx="290" ry="180" fill="url(#sc-shadow)" opacity=".8"/>
  <path d="M-210 -160 h420 q18 0 18 18 v284 q0 18 -18 18 h-420 q-18 0 -18 -18
           v-284 q0 -18 18 -18 Z" fill="#3A8072"/>
  <path d="M-210 -160 h420 q18 0 18 18 v20 h-456 v-20 q0 -18 18 -18 Z" fill="#5C9E90"/>
  <path d="M192 -160 h18 q18 0 18 18 v284 q0 18 -18 18 h-18 Z" fill="#2A5A50" opacity=".8"/>
  <path d="M228 -142 v284" stroke="#FFF4D2" strokeWidth="7" fill="none" opacity=".75"/>
  <path d="M-210 -160 h420" stroke="#8FD8C6" strokeOpacity=".45" strokeWidth="5" fill="none"/>
  <path d="M-196 -146 h392 v266 h-392 Z" fill="#337063"/>
  <g fill="#2C5A51">
    <rect x="-186" y="-136" width="176" height="120" rx="10"/>
    <rect x="4" y="-136" width="180" height="120" rx="10"/>
    <rect x="-186" y="-4" width="120" height="116" rx="10"/>
    <rect x="-56" y="-4" width="110" height="116" rx="10"/>
    <rect x="66" y="-4" width="118" height="116" rx="10"/>
  </g>
  {/* what is left of it: a roll torn in half, peas, beans, and a pot
       of something pink with a spoon still standing in it */}
  <path d="M-158 -104 q52 -30 104 -2 q22 40 -20 58 q-62 14 -90 -14 q-14 -30 6 -42 Z" fill="#C89A52"/>
  <path d="M-158 -104 q52 -30 104 -2 q-42 6 -62 0 q-24 -8 -42 2 Z" fill="#E8C078"/>
  <path d="M-146 -74 q48 12 88 2" fill="none" stroke="#F4E2BC" strokeWidth="9" strokeLinecap="round"/>
  <path d="M-52 -98 q12 -4 16 4 q2 8 -8 10 Z" fill="#A87C36" opacity=".7"/>
  <g fill="#7FA83E">
    <circle cx="46" cy="-96" r="15"/><circle cx="78" cy="-102" r="14"/><circle cx="110" cy="-92" r="15"/>
    <circle cx="62" cy="-70" r="14"/><circle cx="96" cy="-66" r="15"/><circle cx="130" cy="-74" r="13"/>
    <circle cx="44" cy="-64" r="12"/><circle cx="114" cy="-108" r="12"/>
  </g>
  <g fill="#9CC85A">
    <circle cx="42" cy="-101" r="6"/><circle cx="74" cy="-107" r="5.5"/><circle cx="106" cy="-97" r="6"/>
    <circle cx="58" cy="-75" r="5.5"/><circle cx="92" cy="-71" r="6"/>
  </g>
  <path d="M-150 26 q46 -16 90 4 q12 44 -32 60 q-52 8 -66 -22 q-6 -32 8 -42 Z" fill="#C8562E"/>
  <path d="M-150 26 q46 -16 90 4 q-30 8 -50 4 q-20 -6 -40 -8 Z" fill="#E4784C" opacity=".85"/>
  <g fill="#E8B23A">
    <ellipse cx="-124" cy="40" rx="10" ry="7" transform="rotate(-20 -124 40)"/>
    <ellipse cx="-96" cy="58" rx="10" ry="7" transform="rotate(14 -96 58)"/>
    <ellipse cx="-66" cy="44" rx="10" ry="7" transform="rotate(-8 -66 44)"/>
    <ellipse cx="-104" cy="24" rx="9" ry="6" transform="rotate(30 -104 24)"/>
  </g>
  <g transform="translate(92,52)">
    <path d="M-40 -6 q40 10 80 0 l-8 46 q-32 8 -64 0 Z" fill="#E8E4DA"/>
    <path d="M-40 -6 q40 10 80 0 l-2 12 q-38 10 -76 0 Z" fill="#F6F4EE"/>
    <ellipse cx="0" cy="-4" rx="40" ry="11" fill="#E486A0"/>
    <ellipse cx="-8" cy="-6" rx="20" ry="5" fill="#F4AEC0" opacity=".8"/>
    <path d="M22 -10 l14 -44 l7 2 l-13 44 Z" fill="#DCE2E6"/>
    <path d="M22 -10 l6 -20 l6 2 l-5 19 Z" fill="#FFFFFF" opacity=".7"/>
  </g>
  {/* a fork left in the tray */}
  <g transform="rotate(-24 96 60)">
    <rect x="56" y="48" width="112" height="9" rx="4" fill="url(#sc-steel)"/>
    <path d="M40 44 h20 v18 h-20 Z" fill="url(#sc-steel)"/>
    <path d="M28 42 h6 v22 h-6 Z M38 42 h6 v22 h-6 Z M48 42 h6 v22 h-6 Z" fill="#C6D0D4"/>
  </g>
</g>

{/* ── a stack of trays, waiting to go back ───────────────────────────── */}
<g transform="translate(876,662) scale(0.468)">
  <ellipse cx="-90.2" cy="32.6" rx="289.5" ry="180.6" fill="url(#sc-shadow)" opacity="1" transform="rotate(160.1 -90.2 32.6)"/>
  <g transform="scale(1,0.417)"><ellipse cx="0" cy="0" rx="230" ry="176" fill="url(#sc-occl)"/></g>
  <g transform="translate(0,-14)">
    <path d="M-216 0 h432 v-16 h-432 Z" fill="#2A5A50"/>
    <path d="M-216 -16 h432 v-5 h-432 Z" fill="#7FBAAC"/>
  </g>
  <g transform="translate(-8,-40)">
    <path d="M-216 0 h432 v-16 h-432 Z" fill="#2E6258"/>
    <path d="M-216 -16 h432 v-5 h-432 Z" fill="#86C2B2"/>
  </g>
  <g transform="translate(6,-66)">
    <path d="M-216 0 h432 v-16 h-432 Z" fill="#2A5A50"/>
    <path d="M-216 -16 h432 v-5 h-432 Z" fill="#7FBAAC"/>
  </g>
  <g transform="translate(-2,-92)">
    <path d="M-216 0 h432 v-18 h-432 Z" fill="#3E7A6E"/>
    <path d="M-216 -18 h432 v-6 h-432 Z" fill="#9BD2C2"/>
    <g transform="translate(0,-24) scale(1,0.417)">
      <path d="M-216 -134 h432 q16 0 16 16 v236 q0 16 -16 16 h-432 q-16 0 -16 -16
               v-236 q0 -16 16 -16 Z" fill="#54948A"/>
      <path d="M-200 -120 h400 v220 h-400 Z" fill="#3E7A6E"/>
    </g>
  </g>
</g>

{/* ── someone's book, left open, and the pencil that was in it ───────── */}
<g transform="translate(630,852) scale(0.6321,0.3559) rotate(-7)">
  <ellipse cx="-70" cy="20" rx="230" ry="130" fill="url(#sc-shadow)" opacity=".7"/>
  <path d="M-200 -110 h196 v220 h-196 Z" fill="#F2EEDE"/>
  <path d="M4 -110 h196 v220 h-196 Z" fill="#FAF6E8"/>
  <path d="M-6 -110 h12 v220 h-12 Z" fill="#D8D0B8"/>
  <path d="M-200 -110 h400 v10 h-400 Z" fill="#FFFDF4"/>
  <g stroke="#7E9EC4" strokeWidth="4" strokeOpacity=".55">
    <path d="M-182 -80 h160M-182 -54 h160M-182 -28 h160M-182 -2 h160M-182 24 h160
             M-182 50 h160M-182 76 h160"/>
    <path d="M22 -80 h160M22 -54 h160M22 -28 h160M22 -2 h160M22 24 h160"/>
  </g>
  <g stroke="#2E4658" strokeWidth="5" strokeLinecap="round" strokeOpacity=".75">
    <path d="M-176 -84 h104M-176 -58 h132M-176 -32 h88M-176 -6 h124M-176 20 h70"/>
    <path d="M28 -84 h118M28 -58 h86M28 -32 h132"/>
  </g>
  <path d="M-200 -110 h400 v220 h-400 Z" fill="none" stroke="#C4BCA0" strokeWidth="3"/>
  <g transform="rotate(16 250 40)">
    <rect x="150" y="30" width="230" height="20" rx="3" fill="#E8B23A"/>
    <rect x="150" y="30" width="230" height="7" rx="3" fill="#FFD778"/>
    <path d="M380 30 l34 10 l-34 10 Z" fill="#E2C89E"/>
    <path d="M404 36 l10 4 l-10 4 Z" fill="#2E3238"/>
    <rect x="130" y="30" width="22" height="20" fill="#C6CAD0"/>
    <rect x="112" y="31" width="20" height="18" rx="4" fill="#E88A8A"/>
  </g>
</g>

{/* ── the water jug, and a beaker somebody poured and forgot ─────────
     Take one was a translucent box. What makes a jug a jug is the three
     things sticking off it: a handle, a spout pulled out of the rim, and
     a lid sitting proud of it. */}
<g {...prop("The water jug. Click to slosh it.", sloshWater)} transform="translate(236,690) scale(0.4922)">
  <ellipse cx="-235" cy="85" rx="326.5" ry="71.4" fill="url(#sc-shadow)" opacity="1" transform="rotate(160.1 -235 85)"/>
  <g transform="scale(1,0.438)"><ellipse cx="0" cy="0" rx="94" ry="84" fill="url(#sc-occl)"/></g>
  <path d="M-74 0 q-8 -200 2 -222 h144 q10 22 2 222 Z" fill="#E2EEF0" opacity=".55"/>
  {/* the water, and the line where it stops */}
  <g className="water">
    <path d="M-68 -14 q68 12 136 0 l0 -128 q-68 14 -136 0 Z" fill="#8FC4DA" opacity=".62"/>
    <path d="M-68 -142 q68 14 136 0 l0 10 q-68 14 -136 0 Z" fill="#C4E4F0" opacity=".8"/>
    <path d="M-60 -136 q34 8 68 4" fill="none" stroke="#EAF6FC" strokeOpacity=".8" strokeWidth="6"/>
  </g>
  {/* the far wall of it showing through the near one */}
  <path d="M-54 -16 q54 9 108 0 l0 -192 h-108 Z" fill="#7EA8B8" opacity=".16"/>
  {/* spout, pulled out of the rim on the far side */}
  <path d="M-74 -222 h148 q6 0 6 8 h-160 q0 -8 6 -8 Z" fill="#EEF6F8"/>
  <path d="M28 -230 q34 -4 44 -18 q6 12 -6 20 q-16 8 -38 6 Z" fill="#DCEAEE"/>
  {/* the lid, sitting proud */}
  <path d="M-66 -232 h132 q8 0 8 10 q0 8 -8 8 h-132 q-8 0 -8 -8 q0 -10 8 -10 Z" fill="#2E6E8E"/>
  <path d="M-66 -232 h132 q8 0 8 10 q-74 -8 -148 1 q0 -11 8 -11 Z" fill="#5A9EBE" opacity=".85"/>
  <path d="M-18 -244 h36 q6 0 6 6 v6 h-48 v-6 q0 -6 6 -6 Z" fill="#256078"/>
  {/* the handle, with a hole in it like the milk jug's */}
  <path fillRule="evenodd" fill="#DCEAEE" opacity=".85"
        d="M70 -206 Q126 -196 126 -124 Q126 -52 70 -42 L70 -66 Q102 -76 102 -124
           Q102 -172 70 -182 Z"/>
  <path d="M70 -206 Q126 -196 126 -124" fill="none" stroke="#FFFFFF" strokeWidth="7"/>
  <path d="M-66 -216 q-6 104 0 208" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="9"/>
  <path d="M70 -214 q8 104 0 210" fill="none" stroke="#FFFBEC" strokeWidth="8"/>
</g>
<g transform="translate(360,726) scale(0.5233)">
  <ellipse cx="-89.3" cy="32.3" rx="126.5" ry="29.4" fill="url(#sc-shadow)" opacity="1" transform="rotate(160.1 -89.3 32.3)"/>
  <g transform="scale(1,0.466)"><ellipse cx="0" cy="0" rx="40" ry="35" fill="url(#sc-occl)"/></g>
  <path d="M-34 0 q-3 -74 2 -88 h64 q5 14 2 88 Z" fill="#E4EEF0" opacity=".6"/>
  <path d="M-32 -16 q32 6 64 0 l0 -44 q-32 7 -64 0 Z" fill="#8FC4DA" opacity=".62"/>
  <path d="M-32 -60 q32 7 64 0 l0 6 q-32 7 -64 0 Z" fill="#C4E4F0" opacity=".85"/>
  <path d="M-34 -88 q34 -8 68 0 q-34 9 -68 0 Z" fill="#F2FAFC" opacity=".9"/>
  <path d="M-26 -84 q-2 42 0 80" fill="none" stroke="#FFFFFF" strokeOpacity=".85" strokeWidth="7"/>
  <path d="M30 -84 q3 42 0 80" fill="none" stroke="#FFFBEC" strokeWidth="6"/>
</g>

{/* ── a banana that is still a banana ────────────────────────────────── */}
<g transform="translate(706,786) scale(0.5751,0.2946) rotate(-16)">
  <ellipse cx="-40" cy="24" rx="140" ry="76" fill="url(#sc-shadow)" opacity=".75"/>
  <path d="M-108 26 q-16 -58 34 -84 q52 -28 122 -12 q34 8 44 22 q-14 26 -60 40
           q-62 18 -110 42 q-22 6 -30 -8 Z" fill="#E8C63E"/>
  <path d="M-108 26 q-16 -58 34 -84 q52 -28 122 -12 q-70 -4 -114 26 q-40 28 -42 70 Z" fill="#F6E278"/>
  <path d="M60 -68 q34 8 44 22 q-14 26 -60 40 q28 -22 30 -40 q2 -14 -14 -22 Z" fill="#B99A24" opacity=".7"/>
  <path d="M-108 26 q10 12 30 8 q6 10 -8 14 q-20 2 -22 -22 Z" fill="#4E3E1E"/>
  <path d="M96 -56 q22 -4 26 6 q4 10 -12 12 Z" fill="#8E7420"/>
  <path d="M-58 -46 q60 -28 122 -20" fill="none" stroke="#C6A82C" strokeOpacity=".55" strokeWidth="5"/>
</g>

{/* ── a pencil case, and a paper plane somebody never got to throw ───── */}
<g transform="translate(1058,864) scale(0.6425,0.3677) rotate(9) scale(.62)">
  <ellipse cx="-70" cy="22" rx="180" ry="86" fill="url(#sc-shadow)" opacity=".75"/>
  <path d="M-150 -60 h300 q20 0 20 20 v70 q0 20 -20 20 h-300 q-20 0 -20 -20
           v-70 q0 -20 20 -20 Z" fill="#3E5A8E"/>
  <path d="M168 -34 v56" stroke="#FFF4D2" strokeWidth="9" fill="none" opacity=".7"/>
  <path d="M-150 -60 h300 q20 0 20 20 v12 h-340 v-12 q0 -20 20 -20 Z" fill="#5E7EB4"/>
  <path d="M-160 -4 h320 v12 h-320 Z" fill="#D6B23A"/>
  <g fill="#E8C86A"><circle cx="-120" cy="2" r="5"/><circle cx="-96" cy="2" r="5"/>
    <circle cx="-72" cy="2" r="5"/><circle cx="-48" cy="2" r="5"/><circle cx="-24" cy="2" r="5"/>
    <circle cx="0" cy="2" r="5"/><circle cx="24" cy="2" r="5"/><circle cx="48" cy="2" r="5"/>
    <circle cx="72" cy="2" r="5"/><circle cx="96" cy="2" r="5"/><circle cx="120" cy="2" r="5"/></g>
  <path d="M150 -10 q22 2 22 14 q0 12 -22 14 Z" fill="#C6A02E"/>
</g>
<g {...prop("A paper plane. Click to launch it.", launchPlane)} transform="translate(668,650) scale(0.4577,0.1866) rotate(-14)">
  <g className="plane">
    <ellipse cx="-56" cy="26" rx="150" ry="76" fill="url(#sc-shadow)" opacity=".7"/>
    <path d="M-150 34 L156 -22 L-92 -34 Z" fill="#F4F2E8"/>
    <path d="M-150 34 L156 -22 L4 4 Z" fill="#FDFCF6"/>
    <path d="M-92 -34 L156 -22 L-4 -6 Z" fill="#DAD6C8"/>
    <path d="M-92 -34 L156 -22" fill="none" stroke="#B8B2A0" strokeWidth="2.4"/>
    <path d="M-150 34 L156 -22" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.4"/>
    <path d="M-150 34 L-92 -34" fill="none" stroke="#C6C0B0" strokeWidth="2"/>
  </g>
</g>

{/* ── a lanyard, dropped ─────────────────────────────────────────────── */}
<g transform="translate(560,700) scale(0.5009,0.2235) rotate(4)">
  <ellipse cx="-40" cy="16" rx="140" ry="70" fill="url(#sc-shadow)" opacity=".6"/>
  <path d="M-134 -30 q46 -36 96 -6 q48 30 96 -4" fill="none" stroke="#2E5E8E" strokeWidth="16"/>
  <path d="M-134 -30 q46 -36 96 -6 q48 30 96 -4" fill="none" stroke="#5E8EBE" strokeWidth="6"/>
  <path d="M46 -14 h84 v66 h-84 Z" fill="#F6F4EC"/>
  <path d="M46 -14 h84 v18 h-84 Z" fill="#2E5E8E"/>
  <circle cx="64" cy="18" r="11" fill="#C6CEDA"/>
  <path d="M82 10 h38 M82 22 h30 M82 34 h34" stroke="#9EA8B4" strokeWidth="4" strokeLinecap="round"/>
  <path d="M46 -14 h84 v66 h-84 Z" fill="none" stroke="#C2BCA8" strokeWidth="2.4"/>
</g>

{/* ── a rucksack, dumped on the table ────────────────────────────────── */}
<g transform="translate(330,638) scale(0.4473)">
  <ellipse cx="-235" cy="85" rx="385" ry="126" fill="url(#sc-shadow)" opacity="1" transform="rotate(160.1 -235 85)"/>
  <g transform="scale(1,0.398)"><ellipse cx="0" cy="0" rx="170" ry="130" fill="url(#sc-occl)"/></g>
  <path d="M-140 0 q-18 -170 20 -206 q56 -34 124 -6 q46 22 30 212 Z" fill="#2E4A6E"/>
  <path d="M-140 0 q-18 -170 20 -206 q22 -14 44 -16 q-46 60 -30 222 Z" fill="#4A6E9A" opacity=".75"/>
  <path d="M66 -196 q46 22 30 196 h-34 q16 -136 4 -196 Z" fill="#1E3450" opacity=".7"/>
  <path d="M92 -168 q26 76 4 168" fill="none" stroke="#FFF4D2" strokeWidth="8" opacity=".7"/>
  <path d="M-128 -76 q66 22 132 0 q4 40 0 76 h-132 q-6 -40 0 -76 Z" fill="#26405E"/>
  <path d="M-128 -76 q66 22 132 0" fill="none" stroke="#7E9EC4" strokeOpacity=".5" strokeWidth="5"/>
  <path d="M-72 -196 q56 -20 108 6" fill="none" stroke="#D8A83A" strokeWidth="11"/>
  <path d="M-72 -196 q56 -20 108 6" fill="none" stroke="#F4CE72" strokeWidth="4"/>
  <circle cx="40" cy="-186" r="13" fill="#C6CEDA"/>
  <circle cx="40" cy="-186" r="6" fill="#6E7A88"/>
  <path d="M-96 -160 q40 -24 86 -8" fill="none" stroke="#1E3450" strokeOpacity=".6" strokeWidth="7"/>
</g>

{/* ══════════════════════════════════════════════════════════════════════
     7. THE LITTER — the five clues

     Drawn to the same rules as everything else on this table: real
     millimetres, the window on the right so the hot edge is on the right
     and the shadow goes left, and anything lying flat squashed by the
     foreshortening of the plane it is lying on.

     The gum needed thinking about rather than drawing, because a chewed
     wad has no shape of its own. In the park it was a stick wrapper; here
     it is the BLISTER STRIP — a row of domes in foil is one of the most
     recognisable small objects there is, and it is a different image of
     the same rubbish, which is what the second telling of a lesson wants.
     ══════════════════════════════════════════════════════════════════════ */}

{/* ── s1 · PLASTIC MILK JUG · recyclable ──────────────────────────────
     The three things that actually make one of these look real, none of
     which a bottle shape gets you:

       · a HOLE. The handle is a recess moulded into the side, so you see
         the table straight through it. It is drawn as a second subpath
         on the body with fill-rule evenodd, which makes it a genuine
         hole rather than a grey patch pretending to be one — and that
         one detail does more than everything else here put together.
       · HDPE is translucent, not transparent and not opaque. The body is
         carried at 0.9 so the table dims through it, the far wall of the
         jug shows as a darker band inside the near one, and the milk
         left in the bottom reads through the plastic rather than sitting
         on top of it.
       · light goes THROUGH it. The sun is off to the right, so the jug
         throws a shadow that is warm and bright near the glass rather
         than simply dark — a translucent object does not cast the same
         shadow as a brick.
     */}

{/* s1 is drawn by the screen */}


{/* ── s2 · CRACKED TABLET · e-waste ───────────────────────────────────── */}

{/* s2 is drawn by the screen */}


{/* ── s3 · CHEWING GUM · general ──────────────────────────────────────── */}

{/* s3 is drawn by the screen */}


{/* ── s4 · APPLE CORE · organic ───────────────────────────────────────
     Take one was lying on its side and came out as two red discs with a
     twig. What says 'apple core' is the HOURGLASS: skin at the top, skin
     at the bottom, and a waist between them eaten down to the pips. Lay
     that on its side and the silhouette is gone, so this one stands. */}

{/* s4 is drawn by the screen */}


{/* ── s5 · CHARGING CABLE · e-waste ───────────────────────────────────
     Take one had a run as thick as the loop it was making and came out
     as a magnifying glass. A cable is identified by two things and only
     two: that it crosses OVER ITSELF, and that it has ends. So the run
     is thin against the size of its loops, the crossings are drawn as
     crossings, and both plugs are at free ends. */}

{/* s5 is drawn by the screen */}


{/* ══════════ 8. THE AIR ══════════
     The beams themselves, and the dust turning over in them. Dust is the
     only reason a beam of light is visible at all — without something in
     the air to scatter off, sunlight through a window is invisible until
     it lands. */}
<g className="beams" style={{ mixBlendMode: "screen" }} pointerEvents="none">
  <path d="M1240 60 L1330 250 L640 620 L470 560 Z" fill="url(#sc-beamG)"/>
  <path d="M1240 300 L1310 470 L700 790 L560 730 Z" fill="url(#sc-beamG)"/>
</g>
<g pointerEvents="none">
<circle className="mote" cx="1042.2" cy="246.4" r="2.31" fill="#FFF6DC" style={{ animationDuration: "16.5s", animationDelay: "-1.3s" }}/>
<circle className="mote" cx="1265.9" cy="75.3" r="1.57" fill="#FFF6DC" style={{ animationDuration: "20.9s", animationDelay: "-9.4s" }}/>
<circle className="mote" cx="630" cy="655.5" r="1.4" fill="#FFF6DC" style={{ animationDuration: "16.6s", animationDelay: "-17.4s" }}/>
<circle className="mote" cx="910.2" cy="325.2" r="1.23" fill="#FFF6DC" style={{ animationDuration: "18.1s", animationDelay: "-11.8s" }}/>
<circle className="mote" cx="1175.1" cy="337.8" r="2.05" fill="#FFF6DC" style={{ animationDuration: "17.6s", animationDelay: "-17.6s" }}/>
<circle className="mote" cx="845.9" cy="524.6" r="2.7" fill="#FFF6DC" style={{ animationDuration: "14.3s", animationDelay: "-18.7s" }}/>
<circle className="mote" cx="714.1" cy="689.8" r="1.53" fill="#FFF6DC" style={{ animationDuration: "20.6s", animationDelay: "-8.7s" }}/>
<circle className="mote" cx="826.4" cy="598.9" r="1.87" fill="#FFF6DC" style={{ animationDuration: "13.2s", animationDelay: "-11.7s" }}/>
<circle className="mote" cx="950.9" cy="413.7" r="2.96" fill="#FFF6DC" style={{ animationDuration: "19.3s", animationDelay: "-19.8s" }}/>
<circle className="mote" cx="882.2" cy="671.9" r="3.03" fill="#FFF6DC" style={{ animationDuration: "19.9s", animationDelay: "-11.4s" }}/>
<circle className="mote" cx="820.5" cy="709.1" r="2.25" fill="#FFF6DC" style={{ animationDuration: "12.4s", animationDelay: "-1.3s" }}/>
<circle className="mote" cx="729.3" cy="647.2" r="2.7" fill="#FFF6DC" style={{ animationDuration: "13.9s", animationDelay: "-3s" }}/>
<circle className="mote" cx="1076.3" cy="140.9" r="1.19" fill="#FFF6DC" style={{ animationDuration: "16.4s", animationDelay: "-0.9s" }}/>
<circle className="mote" cx="729.9" cy="709.6" r="3.06" fill="#FFF6DC" style={{ animationDuration: "15.1s", animationDelay: "-20s" }}/>
<circle className="mote" cx="1123.7" cy="362.3" r="1.16" fill="#FFF6DC" style={{ animationDuration: "11.4s", animationDelay: "-8.2s" }}/>
<circle className="mote" cx="869.1" cy="518.1" r="2.84" fill="#FFF6DC" style={{ animationDuration: "12.8s", animationDelay: "-19.2s" }}/>
<circle className="mote" cx="628.2" cy="737.7" r="2.14" fill="#FFF6DC" style={{ animationDuration: "16.7s", animationDelay: "-11.9s" }}/>
<circle className="mote" cx="788.2" cy="336.5" r="2.11" fill="#FFF6DC" style={{ animationDuration: "14.2s", animationDelay: "-14.4s" }}/>
<circle className="mote" cx="1045.7" cy="476.8" r="2.14" fill="#FFF6DC" style={{ animationDuration: "15.6s", animationDelay: "-0.2s" }}/>
<circle className="mote" cx="973.7" cy="369.7" r="2.33" fill="#FFF6DC" style={{ animationDuration: "16.6s", animationDelay: "-1.2s" }}/>
<circle className="mote" cx="760" cy="534.3" r="1.81" fill="#FFF6DC" style={{ animationDuration: "17.5s", animationDelay: "-14.8s" }}/>
<circle className="mote" cx="1319.4" cy="178.4" r="3.03" fill="#FFF6DC" style={{ animationDuration: "12s", animationDelay: "-9.1s" }}/>
<circle className="mote" cx="846.4" cy="556.3" r="1.73" fill="#FFF6DC" style={{ animationDuration: "13.4s", animationDelay: "-11.9s" }}/>
<circle className="mote" cx="983.8" cy="402.2" r="1.15" fill="#FFF6DC" style={{ animationDuration: "15.8s", animationDelay: "-14.7s" }}/>
<circle className="mote" cx="1070.2" cy="454.5" r="1.58" fill="#FFF6DC" style={{ animationDuration: "11.2s", animationDelay: "-8.7s" }}/>
<circle className="mote" cx="845.7" cy="594.9" r="1.77" fill="#FFF6DC" style={{ animationDuration: "19s", animationDelay: "-8.8s" }}/>
<circle className="mote" cx="728.9" cy="713.8" r="2.4" fill="#FFF6DC" style={{ animationDuration: "19.6s", animationDelay: "-9s" }}/>
<circle className="mote" cx="1159.4" cy="327.2" r="1.48" fill="#FFF6DC" style={{ animationDuration: "18.7s", animationDelay: "-16.8s" }}/>
<circle className="mote" cx="1113.1" cy="376.6" r="2.38" fill="#FFF6DC" style={{ animationDuration: "18.7s", animationDelay: "-6.9s" }}/>
<circle className="mote" cx="1139.2" cy="337.7" r="1.64" fill="#FFF6DC" style={{ animationDuration: "13.2s", animationDelay: "-8.3s" }}/>
<circle className="mote" cx="867.5" cy="477.2" r="1.41" fill="#FFF6DC" style={{ animationDuration: "9.1s", animationDelay: "-18.9s" }}/>
<circle className="mote" cx="750.6" cy="658.6" r="3" fill="#FFF6DC" style={{ animationDuration: "20.1s", animationDelay: "-4.4s" }}/>
<circle className="mote" cx="818.7" cy="481.3" r="2.14" fill="#FFF6DC" style={{ animationDuration: "12.5s", animationDelay: "-6.8s" }}/>
<circle className="mote" cx="1177.2" cy="305.3" r="1.67" fill="#FFF6DC" style={{ animationDuration: "18.7s", animationDelay: "-0.9s" }}/>
<circle className="mote" cx="624.5" cy="509.9" r="2.89" fill="#FFF6DC" style={{ animationDuration: "19.8s", animationDelay: "-11.5s" }}/>
<circle className="mote" cx="1240.5" cy="79" r="1.7" fill="#FFF6DC" style={{ animationDuration: "17s", animationDelay: "-10.5s" }}/>
<circle className="mote" cx="1061.8" cy="335.4" r="1.78" fill="#FFF6DC" style={{ animationDuration: "12s", animationDelay: "-17.2s" }}/>
<circle className="mote" cx="955.9" cy="342.9" r="1.49" fill="#FFF6DC" style={{ animationDuration: "15.4s", animationDelay: "-16.3s" }}/>
<circle className="mote" cx="1175.4" cy="51.8" r="2.71" fill="#FFF6DC" style={{ animationDuration: "18.9s", animationDelay: "-0.2s" }}/>
<circle className="mote" cx="860.2" cy="490.3" r="1.64" fill="#FFF6DC" style={{ animationDuration: "12.2s", animationDelay: "-10.5s" }}/>
<circle className="mote" cx="876.9" cy="405.7" r="1.1" fill="#FFF6DC" style={{ animationDuration: "9.7s", animationDelay: "-2.5s" }}/>
<circle className="mote" cx="1318.1" cy="287.7" r="2.81" fill="#FFF6DC" style={{ animationDuration: "10s", animationDelay: "-10s" }}/>
<circle className="mote" cx="1025.8" cy="384.2" r="2.39" fill="#FFF6DC" style={{ animationDuration: "16s", animationDelay: "-7.2s" }}/>
<circle className="mote" cx="1113.1" cy="274.7" r="2.21" fill="#FFF6DC" style={{ animationDuration: "17.6s", animationDelay: "-7.6s" }}/>
<circle className="mote" cx="1224" cy="239.2" r="2.31" fill="#FFF6DC" style={{ animationDuration: "18.4s", animationDelay: "-7.6s" }}/>
<circle className="mote" cx="691.6" cy="557.4" r="1.84" fill="#FFF6DC" style={{ animationDuration: "15s", animationDelay: "-14.1s" }}/>
</g>

{/* ══════════ 9. FOREGROUND ══════════
     The near edge of the table, too close to the lens to be in focus, and
     kept to the corners so it never covers anything clickable. */}
<g filter="url(#sc-fgSoft)" pointerEvents="none">
  <path d="M-40 906 v-60 q110 6 180 54 Z" fill="#8E7444" opacity=".3"/>
  <path d="M1240 906 v-80 q-124 12 -176 80 Z" fill="#7E6438" opacity=".34"/>
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

{/* ══════════ 10. GRADE ══════════ */}
<g pointerEvents="none">
  <rect width="1200" height="900" fill="#FFD9A0" opacity=".035" style={{ mixBlendMode: "overlay" }}/>
  <radialGradient id="sc-vig" cx=".76" cy=".26" r=".9">
    <stop offset=".46" stopColor="#12242A" stopOpacity="0"/>
    <stop offset="1"   stopColor="#0E2027" stopOpacity=".38"/>
  </radialGradient>
  <rect width="1200" height="900" fill="url(#sc-vig)"/>
  <rect width="1200" height="900" filter="url(#sc-filmGrain)" opacity=".28" style={{ mixBlendMode: "overlay" }}/>
</g>
  </svg>
  );
};
