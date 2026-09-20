import React, { useEffect, useState } from "react";
import { playSound } from "../../utils/audio";

/* ==================================================================== *
 *  Beach Cleanup — high-fidelity scene
 *
 *  One SVG on a fixed 1200x900 viewBox, matching the frame's 4:3, so the
 *  art never distorts.
 *
 *  Where the Kitchen is lit from a window at upper-left, this one looks
 *  INTO the sun: it sits low over the water, right of centre. Every form
 *  is rim-lit along its top and right edge, every cast shadow runs
 *  down-LEFT toward the camera and is long, every shadow is violet-blue
 *  because the only thing filling a shadow on a beach is the sky, and
 *  undersides take a warm bounce off the sand.
 *
 *  Depth on flat sand has no perspective lines to lean on, so it is
 *  carried by a texture gradient — the same grain pattern stamped at
 *  three scales, fine at the back and coarse under the camera — plus one
 *  hard edge at the waterline. Nothing else below the horizon is sharp.
 *
 *  The five pieces of litter are NOT in this backdrop — the game has to
 *  be able to tap them, light them and remove them, so they live in
 *  beachClues.tsx and are positioned by the screen.
 * ==================================================================== */

/** Things on this beach that are genuinely confusable with litter but are not
 *  waste. Each carries its own note rather than a template — a line written for
 *  the object is the difference between a game with a voice and a game that
 *  fills in a blank. The voice is the detective's: short, dry, dismissive.
 *
 *  The driftwood is the one that earns its place twice: it teaches that not
 *  everything lying on a beach was dropped there by a person. */
const DECOYS: { label: string; note: string; x: number; y: number; w: number; h: number }[] = [
  { label: "towel",         note: "Claimed. There's a book holding it down.",   x: 80,  y: 706, w: 250, h: 96  },
  { label: "sunglasses",    note: "Those cost more than the parasol.",          x: 206, y: 734, w: 70,  h: 36  },
  { label: "shells",        note: "Shells. They were here first.",              x: 276, y: 850, w: 116, h: 42  },
  { label: "driftwood",     note: "The sea put that there. The sea can keep it.", x: 398, y: 832, w: 184, h: 58 },
  { label: "flip-flops",    note: "Still warm. Someone's in the water.",        x: 612, y: 806, w: 126, h: 66  },
  { label: "cool box",      note: "Lunch. Still cold, still someone's.",        x: 610, y: 636, w: 188, h: 100 },
  { label: "bucket and spade", note: "In use. The architect will be back.",     x: 806, y: 628, w: 118, h: 118 },
  { label: "sandcastle",    note: "Structurally doubtful. Not evidence.",       x: 906, y: 596, w: 178, h: 180 },
];

interface BeachSceneProps {
  /** Called with that object's own note when the player taps something that
   *  turns out not to be litter. */
  onDecoy?: (note: string) => void;
}

export const BeachScene: React.FC<BeachSceneProps> = ({ onDecoy }) => {
  // Three props the player can poke at. They reward looking closely, which is
  // the habit a hidden-object scene wants to build.
  const [furled, setFurled] = useState(false);
  const [surging, setSurging] = useState(false);
  const [crabHidden, setCrabHidden] = useState(false);

  // Both timers are owned by the state they reset rather than by a ref, so
  // they clean themselves up if the scene unmounts mid-cycle.
  useEffect(() => {
    if (!surging) return;
    const t = window.setTimeout(() => setSurging(false), 2200);
    return () => window.clearTimeout(t);
  }, [surging]);

  useEffect(() => {
    if (!crabHidden) return;
    const t = window.setTimeout(() => setCrabHidden(false), 2600);
    return () => window.clearTimeout(t);
  }, [crabHidden]);

  const toggleParasol = () => {
    setFurled((f) => !f);
    playSound.detectiveScan();
  };
  const sendWave = () => {
    if (surging) return;
    setSurging(true);
    playSound.detectiveScan();
  };
  const scareCrab = () => {
    if (crabHidden) return;
    setCrabHidden(true);
    playSound.detectiveFound();
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
    className={`absolute inset-0 w-full h-full${furled ? " bc-furled" : ""}${
      surging ? " bc-surging" : ""}${crabHidden ? " bc-hidden-crab" : ""}`}
    viewBox="0 0 1200 900"
    preserveAspectRatio="xMidYMid slice"
    // the backdrop is inert; only the three props and the decoys opt back in
    style={{ pointerEvents: "none" }}
  >
<defs>

  {/* ══ LIGHT MODEL ══
       Late afternoon, looking INTO the sun: it sits low over the water,
       right of centre. Consequences, applied without exception below:
         · every form is rim-lit along its top and right edge
         · every cast shadow runs down-LEFT, toward the camera, and is long
         · shadows are violet-blue (sky light fills them), never grey
         · fill light on the undersides is warm, bounced up off the sand
         · distance desaturates toward the sky's colour, not toward white */}

  {/* ── sky ─────────────────────────────────────────────────────────── */}
  <linearGradient id="bc-sky" x1="0" y1="0" x2=".18" y2="1">
    <stop offset="0"   stopColor="#1D4E80"/>
    <stop offset=".26" stopColor="#3D7FAC"/>
    <stop offset=".55" stopColor="#7EB4CB"/>
    <stop offset=".78" stopColor="#C8D9D2"/>
    <stop offset=".93" stopColor="#F2D3A4"/>
    <stop offset="1"   stopColor="#F8DFB4"/>
  </linearGradient>

  <radialGradient id="bc-sunGlow" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#FFF7E0" stopOpacity=".95"/>
    <stop offset=".18" stopColor="#FFEBB8" stopOpacity=".55"/>
    <stop offset=".52" stopColor="#FFD99A" stopOpacity=".20"/>
    <stop offset="1"   stopColor="#FFD08A" stopOpacity="0"/>
  </radialGradient>

  <radialGradient id="bc-sunDisc" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#FFFDF4"/>
    <stop offset=".62" stopColor="#FFF3D0"/>
    <stop offset="1"   stopColor="#FFE3A8" stopOpacity=".55"/>
  </radialGradient>

  {/* ── sea ─────────────────────────────────────────────────────────
       Reads as four receding bands, not one gradient: deep water at the
       horizon, the swell, the shallows, then the bar where it breaks. */}
  <linearGradient id="bc-seaDeep" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#1B4A63"/>
    <stop offset=".34" stopColor="#1F6377"/>
    <stop offset=".72" stopColor="#27818A"/>
    <stop offset="1"   stopColor="#39A099"/>
  </linearGradient>
  <linearGradient id="bc-seaShallow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#2FB09B"/>
    <stop offset=".48" stopColor="#57CBAE"/>
    <stop offset="1"   stopColor="#8CDCBC"/>
  </linearGradient>
  {/* the warm half of the water, where the sun is */}
  <linearGradient id="bc-seaWarm" x1=".18" y1="0" x2="1" y2=".3">
    <stop offset="0"   stopColor="#FFE2AE" stopOpacity="0"/>
    <stop offset=".55" stopColor="#FFDCA0" stopOpacity=".16"/>
    <stop offset="1"   stopColor="#FFE9C4" stopOpacity=".42"/>
  </linearGradient>

  {/* ── sand ────────────────────────────────────────────────────────
       Two surfaces, and the difference between them is the whole tideline:
       dry sand scatters light and goes pale; wet sand is a mirror and
       takes its colour from the sky above it. */}
  <linearGradient id="bc-sandDry" x1=".1" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#E2BC82"/>
    <stop offset=".20" stopColor="#F0CE92"/>
    <stop offset=".54" stopColor="#DCB273"/>
    <stop offset=".82" stopColor="#BE9257"/>
    <stop offset="1"   stopColor="#966C39"/>
  </linearGradient>
  <linearGradient id="bc-sandWet" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#8FA2A4"/>
    <stop offset=".30" stopColor="#A89B86"/>
    <stop offset=".70" stopColor="#B99C74"/>
    <stop offset="1"   stopColor="#C7A87E"/>
  </linearGradient>
  {/* the sheen: wet sand mirrors the warm sky back at the camera */}
  <linearGradient id="bc-wetSheen" x1=".2" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#CFE3E8" stopOpacity=".40"/>
    <stop offset=".46" stopColor="#FFE7BE" stopOpacity=".30"/>
    <stop offset="1"   stopColor="#FFD9A0" stopOpacity=".52"/>
  </linearGradient>

  {/* ── shadow language ─────────────────────────────────────────────
       One colour for every shadow in the scene. Violet-blue, because the
       only thing filling a shadow on a beach is the sky. */}
  <linearGradient id="bc-castShadow" x1="1" y1="0" x2="0" y2=".55">
    <stop offset="0"   stopColor="#3B3E72" stopOpacity=".46"/>
    <stop offset=".55" stopColor="#3B3E72" stopOpacity=".24"/>
    <stop offset="1"   stopColor="#3B3E72" stopOpacity="0"/>
  </linearGradient>
  <radialGradient id="bc-occl" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#4A3A52" stopOpacity=".58"/>
    <stop offset=".54" stopColor="#4A3A52" stopOpacity=".22"/>
    <stop offset="1"   stopColor="#4A3A52" stopOpacity="0"/>
  </radialGradient>

  {/* ── objects ─────────────────────────────────────────────────────── */}
  <linearGradient id="bc-canopyRed" x1=".1" y1="0" x2=".95" y2=".7">
    <stop offset="0"   stopColor="#F2F5F7"/>
    <stop offset=".34" stopColor="#E4E9ED"/>
    <stop offset="1"   stopColor="#A9B6C2"/>
  </linearGradient>
  <linearGradient id="bc-canopyStripe" x1=".1" y1="0" x2=".95" y2=".7">
    <stop offset="0"   stopColor="#F4796A"/>
    <stop offset=".38" stopColor="#DE5747"/>
    <stop offset="1"   stopColor="#9E3227"/>
  </linearGradient>
  {/* sun through fabric: the underside glows instead of going dark */}
  <linearGradient id="bc-canopyUnder" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#E9A187"/>
    <stop offset=".5"  stopColor="#C87862"/>
    <stop offset="1"   stopColor="#8E4A3C"/>
  </linearGradient>

  <linearGradient id="bc-towelG" x1=".08" y1="0" x2=".92" y2=".9">
    <stop offset="0"   stopColor="#6FD0E0"/>
    <stop offset=".42" stopColor="#3FA9C4"/>
    <stop offset="1"   stopColor="#22697F"/>
  </linearGradient>
  <linearGradient id="bc-towelStripe" x1=".08" y1="0" x2=".92" y2=".9">
    <stop offset="0"   stopColor="#FFF4DC"/>
    <stop offset=".5"  stopColor="#F6E2BE"/>
    <stop offset="1"   stopColor="#C9AC85"/>
  </linearGradient>

  <linearGradient id="bc-coolerBody" x1=".1" y1="0" x2=".9" y2=".8">
    <stop offset="0"   stopColor="#8FD6E8"/>
    <stop offset=".3"  stopColor="#4FA9C6"/>
    <stop offset="1"   stopColor="#215A75"/>
  </linearGradient>
  <linearGradient id="bc-coolerLid" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#FBFDFE"/>
    <stop offset=".45" stopColor="#DCE8EE"/>
    <stop offset="1"   stopColor="#A2B6C2"/>
  </linearGradient>

  <linearGradient id="bc-bucketG" x1=".12" y1="0" x2=".9" y2=".85">
    <stop offset="0"   stopColor="#FFD873"/>
    <stop offset=".34" stopColor="#F2B23C"/>
    <stop offset="1"   stopColor="#A56A15"/>
  </linearGradient>

  {/* Expanded polystyrene. Never pure white — it is faintly green-grey,
       and its shaded side picks up a warm bounce off the sand. */}
  <linearGradient id="bc-foamCup" x1="1" y1="0" x2="0" y2=".28">
    <stop offset="0"   stopColor="#FFFEF8"/>
    <stop offset=".16" stopColor="#F6F4EC"/>
    <stop offset=".46" stopColor="#DCDED6"/>
    <stop offset=".74" stopColor="#B0B4AE"/>
    <stop offset=".92" stopColor="#9AA09A"/>
    <stop offset="1"   stopColor="#C2B096"/>
  </linearGradient>
  <linearGradient id="bc-foamLid" x1=".85" y1="0" x2=".1" y2="1">
    <stop offset="0"   stopColor="#FFFEF8"/>
    <stop offset=".34" stopColor="#EDEFE8"/>
    <stop offset=".78" stopColor="#BDC1BA"/>
    <stop offset="1"   stopColor="#C6B294"/>
  </linearGradient>

  <linearGradient id="bc-driftwood" x1=".1" y1="0" x2=".9" y2=".8">
    <stop offset="0"   stopColor="#D8CBBA"/>
    <stop offset=".34" stopColor="#B0A08D"/>
    <stop offset="1"   stopColor="#6E6053"/>
  </linearGradient>

  <linearGradient id="bc-rockG" x1=".2" y1="0" x2=".85" y2="1">
    <stop offset="0"   stopColor="#B9B3B6"/>
    <stop offset=".26" stopColor="#8E888F"/>
    <stop offset=".70" stopColor="#5E5966"/>
    <stop offset="1"   stopColor="#3D3A4C"/>
  </linearGradient>

  <linearGradient id="bc-headland" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#8CA6BE"/>
    <stop offset=".55" stopColor="#7A96B2"/>
    <stop offset="1"   stopColor="#6F8CAA"/>
  </linearGradient>

  {/* ── textures ───────────────────────────────────────────────────── */}
  {/* Sand grain. Drawn once, then stamped at three different scales so the
       grain gets coarser as it comes toward the camera — the texture
       gradient is the strongest depth cue a flat beach has. */}
  <pattern id="bc-sandGrain" width="60" height="60" patternUnits="userSpaceOnUse">
    <g fill="#6B4E2C" fillOpacity=".16">
      <circle cx="7"  cy="11" r="1.5"/><circle cx="31" cy="5"  r="1.1"/>
      <circle cx="49" cy="17" r="1.6"/><circle cx="18" cy="27" r="1.2"/>
      <circle cx="41" cy="35" r="1.4"/><circle cx="55" cy="46" r="1.1"/>
      <circle cx="11" cy="45" r="1.5"/><circle cx="27" cy="53" r="1.3"/>
      <circle cx="37" cy="21" r="0.9"/><circle cx="3"  cy="33" r="1.0"/>
    </g>
    <g fill="#FFF3DA" fillOpacity=".26">
      <circle cx="13" cy="7"  r="1.1"/><circle cx="44" cy="12" r="1.3"/>
      <circle cx="24" cy="38" r="1.2"/><circle cx="52" cy="29" r="1.0"/>
      <circle cx="33" cy="49" r="1.4"/><circle cx="6"  cy="24" r="1.2"/>
    </g>
  </pattern>

  {/* the ripple the outgoing tide leaves pressed into the wet sand */}
  <pattern id="bc-tideRipple" width="140" height="26" patternUnits="userSpaceOnUse">
    <path d="M0 8 Q36 2 72 8 T140 7" fill="none" stroke="#6E6650" strokeOpacity=".22" strokeWidth="2.4"/>
    <path d="M0 11 Q36 5 72 11 T140 10" fill="none" stroke="#FFF0D4" strokeOpacity=".24" strokeWidth="1.6"/>
    <path d="M0 21 Q44 15 88 22 T140 19" fill="none" stroke="#6E6650" strokeOpacity=".16" strokeWidth="2"/>
  </pattern>

  {/* ══ FILTERS ══ */}
  {/* Film grain over the whole frame — the single thing that stops vector
       art from looking like plastic. */}
  <filter id="bc-filmGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="7" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.62" intercept="-0.2"/>
    </feComponentTransfer>
  </filter>

  <filter id="bc-bgSoft"  x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="bc-farSoft" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="bc-fgSoft"  x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="bc-foamSoft"  x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.4"/></filter>
  <filter id="bc-foamCrisp" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.5"/></filter>
  <filter id="bc-glowSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="bc-shadowSoft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="bc-hazeSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>

  <filter id="bc-drop"   x="-35%" y="-35%" width="180%" height="190%">
    <feDropShadow dx="-9" dy="11" stdDeviation="9" floodColor="#332A52" floodOpacity=".42"/>
  </filter>
  <filter id="bc-dropSm" x="-35%" y="-35%" width="180%" height="190%">
    <feDropShadow dx="-6" dy="7" stdDeviation="5" floodColor="#332A52" floodOpacity=".44"/>
  </filter>

  <clipPath id="bc-seaClip">
    <path d="M0 322 H1200 V506 Q1040 516 880 505 Q700 493 520 507 Q340 520 180 508 Q84 501 0 509 Z"/>
  </clipPath>
  <clipPath id="bc-wetClip"><path d="M0 500 H1200 V596 H0 Z"/></clipPath>
  <clipPath id="bc-stageClip"><rect x="0" y="0" width="1200" height="900"/></clipPath>
</defs>

{/* ══════════ 1. SKY ══════════ */}
<rect x="0" y="0" width="1200" height="340" fill="url(#bc-sky)"/>

{/* the sun, and the bloom it throws across everything near it.
     Kept deliberately small and hot: a big soft disc reads as fog. */}
<circle cx="952" cy="198" r="250" fill="url(#bc-sunGlow)"/>
<circle cx="952" cy="198" r="44"  fill="url(#bc-sunDisc)"/>
<circle cx="952" cy="198" r="54"  fill="#FFF6DC" opacity=".16" filter="url(#bc-glowSoft)"/>

{/* Stratus, lit from beneath. Cloud bottoms nearest the sun catch the
     warm light; the ones further left stay in the blue. */}
<g className="bc-cloud-a" opacity=".85">
  <path d="M556 120 q64 -22 138 -8 q56 -30 126 -8 q48 -14 78 10 q-54 26 -152 22 q-96 4 -190 -16 Z"
        fill="#FFFFFF" opacity=".62" filter="url(#bc-bgSoft)"/>
  <path d="M600 132 q92 16 208 6 q-84 20 -208 -6 Z" fill="#FFD9A2" opacity=".5" filter="url(#bc-bgSoft)"/>
</g>
<g className="bc-cloud-b" opacity=".7">
  <path d="M96 184 q78 -20 152 -4 q62 -18 116 6 q-74 22 -166 16 q-72 0 -102 -18 Z"
        fill="#EAF2F6" opacity=".5" filter="url(#bc-bgSoft)"/>
  <path d="M760 246 q86 -14 168 2 q-70 18 -168 -2 Z" fill="#FFE6BE" opacity=".46" filter="url(#bc-bgSoft)"/>
</g>
<path d="M300 268 q140 -14 268 4 q-132 14 -268 -4 Z" fill="#FFFFFF" opacity=".3" filter="url(#bc-bgSoft)"/>

{/* Haze sitting on the horizon. Distance never goes to white here, it
     goes to the sky's own colour — that is what makes it read as air. */}
<rect x="0" y="286" width="1200" height="52" fill="#EBD8BC" opacity=".18" filter="url(#bc-hazeSoft)"/>

{/* ══════════ 2. HEADLAND — the far shore ══════════
     Two ridges, the further one paler, so the eye reads depth before it
     reaches the water. Both are blurred: nothing that far away is sharp. */}
<g filter="url(#bc-bgSoft)">
  <path d="M-20 332 L-20 300 Q60 266 128 282 Q188 256 252 276 Q306 262 352 288 Q392 306 424 332 Z"
        fill="url(#bc-headland)" opacity=".55"/>
  <path d="M-20 332 L-20 314 Q46 292 108 306 Q162 288 214 306 Q256 316 286 332 Z"
        fill="#5E7C9C" opacity=".62"/>
  {/* the one warm edge, where the sun clips the ridge */}
  <path d="M-20 300 Q60 266 128 282 Q188 256 252 276" fill="none"
        stroke="#FFE2B4" strokeOpacity=".5" strokeWidth="2.6"/>
</g>

{/* ══════════ 3. SEA ══════════
     Four receding bands rather than one gradient, because water does not
     fade evenly — it changes colour where the bottom comes up.

     The swell is drawn as soft blurred streaks, never as lines: a stroke
     running the width of the frame reads as a ruled line no matter how
     faint it is, and there is no ruler anywhere in nature. */}
<g clipPath="url(#bc-seaClip)">
  <rect x="0" y="322" width="1200" height="130" fill="url(#bc-seaDeep)"/>
  <rect x="0" y="430" width="1200" height="90"  fill="url(#bc-seaShallow)"/>
  <rect x="0" y="322" width="1200" height="196" fill="url(#bc-seaWarm)"/>
  {/* horizon: the hardest edge in the frame, and the only one up here */}
  <rect x="0" y="330" width="1200" height="2.6" fill="#123B52" opacity=".5"/>
  <rect x="0" y="332" width="1200" height="4" fill="#FFE9C0" opacity=".3"/>

  {/* light catching the near face of each swell */}
  <g filter="url(#bc-foamCrisp)">
    <ellipse className="bc-swell-b" cx="138" cy="340" rx="14" ry="0.7" fill="#E4F8F4" opacity="0.18"/>
    <ellipse className="bc-swell-a" cx="846" cy="341" rx="15" ry="0.8" fill="#E4F8F4" opacity="0.35"/>
    <ellipse className="bc-swell-b" cx="523" cy="343" rx="19" ry="0.8" fill="#E4F8F4" opacity="0.23"/>
    <ellipse className="bc-swell-a" cx="54" cy="345" rx="18" ry="1.0" fill="#E4F8F4" opacity="0.37"/>
    <ellipse className="bc-swell-b" cx="-14" cy="346" rx="22" ry="1.0" fill="#E4F8F4" opacity="0.20"/>
    <ellipse className="bc-swell-a" cx="1217" cy="349" rx="26" ry="1.0" fill="#E4F8F4" opacity="0.45"/>
    <ellipse className="bc-swell-b" cx="363" cy="351" rx="27" ry="1.0" fill="#E4F8F4" opacity="0.35"/>
    <ellipse className="bc-swell-a" cx="188" cy="353" rx="34" ry="1.0" fill="#E4F8F4" opacity="0.41"/>
    <ellipse className="bc-swell-b" cx="571" cy="357" rx="33" ry="1.3" fill="#E4F8F4" opacity="0.29"/>
    <ellipse className="bc-swell-a" cx="1189" cy="359" rx="42" ry="1.5" fill="#E4F8F4" opacity="0.37"/>
    <ellipse className="bc-swell-b" cx="816" cy="363" rx="38" ry="1.5" fill="#E4F8F4" opacity="0.21"/>
    <ellipse className="bc-swell-a" cx="984" cy="366" rx="41" ry="1.4" fill="#E4F8F4" opacity="0.32"/>
    <ellipse className="bc-swell-b" cx="623" cy="369" rx="58" ry="1.5" fill="#E4F8F4" opacity="0.24"/>
    <ellipse className="bc-swell-a" cx="114" cy="373" rx="48" ry="1.7" fill="#E4F8F4" opacity="0.33"/>
    <ellipse className="bc-swell-b" cx="333" cy="376" rx="63" ry="1.4" fill="#E4F8F4" opacity="0.28"/>
    <ellipse className="bc-swell-a" cx="240" cy="381" rx="41" ry="1.7" fill="#E4F8F4" opacity="0.26"/>
    <ellipse className="bc-swell-b" cx="1124" cy="385" rx="85" ry="1.8" fill="#E4F8F4" opacity="0.23"/>
    <ellipse className="bc-swell-a" cx="897" cy="390" rx="62" ry="1.7" fill="#E4F8F4" opacity="0.44"/>
    <ellipse className="bc-swell-b" cx="410" cy="392" rx="59" ry="2.1" fill="#E4F8F4" opacity="0.25"/>
    <ellipse className="bc-swell-a" cx="1191" cy="396" rx="49" ry="2.1" fill="#E4F8F4" opacity="0.46"/>
    <ellipse className="bc-swell-b" cx="950" cy="401" rx="52" ry="1.9" fill="#E4F8F4" opacity="0.41"/>
    <ellipse className="bc-swell-a" cx="573" cy="406" rx="68" ry="2.1" fill="#E4F8F4" opacity="0.36"/>
    <ellipse className="bc-swell-b" cx="235" cy="410" rx="120" ry="2.5" fill="#E4F8F4" opacity="0.26"/>
    <ellipse className="bc-swell-a" cx="618" cy="416" rx="78" ry="2.7" fill="#E4F8F4" opacity="0.37"/>
    <ellipse className="bc-swell-b" cx="314" cy="420" rx="77" ry="2.1" fill="#E4F8F4" opacity="0.37"/>
    <ellipse className="bc-swell-a" cx="506" cy="425" rx="73" ry="2.8" fill="#E4F8F4" opacity="0.25"/>
    <ellipse className="bc-swell-b" cx="728" cy="429" rx="148" ry="2.5" fill="#E4F8F4" opacity="0.44"/>
    <ellipse className="bc-swell-a" cx="692" cy="436" rx="137" ry="2.4" fill="#E4F8F4" opacity="0.43"/>
    <ellipse className="bc-swell-b" cx="459" cy="440" rx="125" ry="2.4" fill="#E4F8F4" opacity="0.39"/>
    <ellipse className="bc-swell-a" cx="1073" cy="445" rx="74" ry="2.9" fill="#E4F8F4" opacity="0.40"/>
  </g>
  {/* and the troughs behind them. Without these the sea is a sheet. */}
  <g filter="url(#bc-foamCrisp)">
    <ellipse className="bc-swell-b" cx="973" cy="345" rx="16" ry="0.8" fill="#0E4550" opacity="0.16"/>
    <ellipse className="bc-swell-a" cx="1159" cy="346" rx="16" ry="0.8" fill="#0E4550" opacity="0.21"/>
    <ellipse className="bc-swell-b" cx="644" cy="349" rx="23" ry="0.9" fill="#0E4550" opacity="0.21"/>
    <ellipse className="bc-swell-a" cx="375" cy="352" rx="23" ry="1.0" fill="#0E4550" opacity="0.21"/>
    <ellipse className="bc-swell-b" cx="849" cy="356" rx="24" ry="1.1" fill="#0E4550" opacity="0.22"/>
    <ellipse className="bc-swell-a" cx="23" cy="362" rx="46" ry="1.3" fill="#0E4550" opacity="0.18"/>
    <ellipse className="bc-swell-b" cx="401" cy="366" rx="34" ry="1.5" fill="#0E4550" opacity="0.14"/>
    <ellipse className="bc-swell-a" cx="433" cy="371" rx="61" ry="1.3" fill="#0E4550" opacity="0.14"/>
    <ellipse className="bc-swell-b" cx="1110" cy="376" rx="51" ry="1.5" fill="#0E4550" opacity="0.18"/>
    <ellipse className="bc-swell-a" cx="731" cy="384" rx="47" ry="1.7" fill="#0E4550" opacity="0.23"/>
    <ellipse className="bc-swell-b" cx="995" cy="388" rx="65" ry="2.1" fill="#0E4550" opacity="0.14"/>
    <ellipse className="bc-swell-a" cx="798" cy="396" rx="89" ry="1.9" fill="#0E4550" opacity="0.21"/>
    <ellipse className="bc-swell-b" cx="428" cy="405" rx="87" ry="2.2" fill="#0E4550" opacity="0.22"/>
    <ellipse className="bc-swell-a" cx="379" cy="409" rx="88" ry="2.0" fill="#0E4550" opacity="0.12"/>
    <ellipse className="bc-swell-b" cx="90" cy="416" rx="98" ry="2.0" fill="#0E4550" opacity="0.23"/>
    <ellipse className="bc-swell-a" cx="484" cy="424" rx="138" ry="2.5" fill="#0E4550" opacity="0.24"/>
    <ellipse className="bc-swell-b" cx="759" cy="434" rx="97" ry="2.1" fill="#0E4550" opacity="0.23"/>
    <ellipse className="bc-swell-a" cx="721" cy="441" rx="148" ry="2.5" fill="#0E4550" opacity="0.14"/>
  </g>

  {/* ── the sun path ────────────────────────────────────────────────
       A glitter path is not a beam: it is thousands of separate facets,
       and it widens toward the camera because the water in front of you
       is tilted through more angles. */}
  <path d="M938 332 L968 332 L1046 518 L862 518 Z" fill="#FFF0CC" opacity=".22" filter="url(#bc-foamSoft)"/>
  <g fill="#FFFBEC">
    <ellipse className="bc-glint" cx="950" cy="342" rx="7"  ry="1.1" style={{ animationDuration: "2.9s" }}/>
    <ellipse className="bc-glint" cx="926" cy="352" rx="9"  ry="1.2" style={{ animationDuration: "3.7s", animationDelay: "-1.1s" }}/>
    <ellipse className="bc-glint" cx="978" cy="358" rx="8"  ry="1.2" style={{ animationDuration: "4.3s", animationDelay: "-2.4s" }}/>
    <ellipse className="bc-glint" cx="944" cy="372" rx="12" ry="1.5" style={{ animationDuration: "3.1s", animationDelay: "-.6s" }}/>
    <ellipse className="bc-glint" cx="996" cy="384" rx="11" ry="1.4" style={{ animationDuration: "5.2s", animationDelay: "-3.1s" }}/>
    <ellipse className="bc-glint" cx="904" cy="390" rx="13" ry="1.5" style={{ animationDuration: "4.7s", animationDelay: "-1.8s" }}/>
    <ellipse className="bc-glint" cx="962" cy="404" rx="16" ry="1.8" style={{ animationDuration: "3.4s", animationDelay: "-2.9s" }}/>
    <ellipse className="bc-glint" cx="1022" cy="418" rx="14" ry="1.7" style={{ animationDuration: "4.1s", animationDelay: "-.3s" }}/>
    <ellipse className="bc-glint" cx="892" cy="424" rx="18" ry="1.9" style={{ animationDuration: "5.8s", animationDelay: "-4.2s" }}/>
    <ellipse className="bc-glint" cx="952" cy="442" rx="22" ry="2.2" style={{ animationDuration: "3.9s", animationDelay: "-1.4s" }}/>
    <ellipse className="bc-glint" cx="1040" cy="456" rx="19" ry="2.1" style={{ animationDuration: "4.9s", animationDelay: "-3.6s" }}/>
    <ellipse className="bc-glint" cx="874" cy="462" rx="24" ry="2.4" style={{ animationDuration: "3.3s", animationDelay: "-2.1s" }}/>
    <ellipse className="bc-glint" cx="960" cy="482" rx="30" ry="2.8" style={{ animationDuration: "4.5s", animationDelay: "-.9s" }}/>
    <ellipse className="bc-glint" cx="1058" cy="496" rx="26" ry="2.6" style={{ animationDuration: "5.4s", animationDelay: "-3.3s" }}/>
    <ellipse className="bc-glint" cx="856" cy="500" rx="28" ry="2.7" style={{ animationDuration: "3.6s", animationDelay: "-1.7s" }}/>
  </g>

  {/* ── the bar, where the swell trips and breaks ─────────────────────
       A breaker is a dark face with a white lip on top of it. Drawing
       only the white gives you fog; the dark face is what gives it a
       front, and therefore a direction. */}
  <path d="M-40 458 Q140 450 260 460 Q400 471 540 458 Q680 446 820 459 Q960 472 1090 458 Q1160 451 1240 457
           L1240 484 Q1120 492 1000 482 Q860 470 720 484 Q580 497 440 484 Q300 472 160 484 Q40 493 -40 485 Z"
        fill="#1C6E76" opacity=".38"/>
  <g filter="url(#bc-foamCrisp)">
    <path d="M-40 452 Q120 444 250 452 Q380 460 520 450 Q660 441 800 452 Q940 462 1080 451 Q1180 444 1240 450
             L1240 468 Q1120 476 1000 468 Q860 460 720 470 Q580 479 440 469 Q300 460 160 470 Q40 478 -40 470 Z"
          fill="#F4FEFB" opacity=".88"/>
    <path d="M-40 472 Q160 464 340 474 Q520 484 700 472 Q880 461 1060 473 Q1160 479 1240 472
             L1240 488 Q1080 496 920 486 Q740 475 560 488 Q380 500 200 488 Q60 479 -40 486 Z"
          fill="#FFFFFF" opacity=".5"/>
  </g>
  {/* spray, only on the sun's side of the frame */}
  <g fill="#FFFFFF" opacity=".42" filter="url(#bc-foamSoft)">
    <ellipse cx="900" cy="450" rx="58" ry="8"/>
    <ellipse cx="1046" cy="456" rx="44" ry="6"/>
    <ellipse cx="744" cy="458" rx="38" ry="5"/>
  </g>
</g>

{/* ══════════ 4. THE TIDELINE ══════════
     The reason a beach reads as a beach: a hard change of surface, not a
     change of colour. Wet sand is a mirror; dry sand is not. */}
<rect x="0" y="498" width="1200" height="104" fill="url(#bc-sandWet)"/>
<g clipPath="url(#bc-wetClip)">
  <rect x="0" y="498" width="1200" height="104" fill="url(#bc-wetSheen)"/>
  <rect x="0" y="498" width="1200" height="40" fill="url(#bc-tideRipple)"
        opacity=".26" style={{ transform: "scaleY(.4)", transformOrigin: "0 498px" }}/>
  <rect x="0" y="536" width="1200" height="66" fill="url(#bc-tideRipple)" opacity=".38"/>
  {/* the sun's path carries on across it, because it is a mirror */}
  <path d="M872 498 L1046 498 L1112 602 L806 602 Z" fill="#FFE7BC" opacity=".22" filter="url(#bc-foamSoft)"/>
</g>

{/* The edge of the water: the only hard edge below the horizon. A dark
     seam under a bright lip, because the sheet of water is thin there
     and casts its own shadow onto the sand. */}
<path d="M0 512 Q84 504 180 511 Q340 523 520 510 Q700 496 880 508 Q1040 519 1200 509"
      fill="none" stroke="#4E5B54" strokeOpacity=".42" strokeWidth="3.4"/>
<path d="M0 508 Q84 500 180 507 Q340 519 520 506 Q700 492 880 504 Q1040 515 1200 505"
      fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.6"/>
<path d="M0 514 Q60 506 128 514 Q196 522 266 513 Q340 504 412 514 Q486 524 556 512
         Q628 500 700 511 Q774 522 846 511 Q920 500 990 510 Q1062 520 1132 510 Q1168 505 1200 509
         L1200 522 Q1100 532 1000 522 Q880 510 780 524 Q660 540 540 524 Q420 508 300 524
         Q180 540 80 526 Q36 520 0 524 Z"
      fill="#FFFFFF" opacity=".78" filter="url(#bc-foamCrisp)"/>

{/* the wash: one sheet running up the sand and draining back. One, not
     three — a pile of soft white layers just makes fog. */}
<g className="bc-wash" filter="url(#bc-foamCrisp)">
  <path d="M-40 516 Q120 508 260 518 Q400 528 540 516 Q680 505 820 517 Q960 528 1100 516 Q1180 510 1240 515
           L1240 546 Q1100 556 960 546 Q820 535 680 548 Q540 560 400 548 Q260 537 120 549 Q20 557 -40 550 Z"
        fill="#FFFFFF" opacity=".82"/>
  {/* its trailing edge, thin enough to see the sand through */}
  <path d="M-40 544 Q160 536 340 548 Q520 560 700 546 Q880 533 1060 547 Q1160 555 1240 546
           L1240 560 Q1080 570 900 558 Q720 546 540 562 Q360 576 180 562 Q60 553 -40 562 Z"
        fill="#DFF4F0" opacity=".42"/>
</g>

{/* a wave the player can send up the beach (the sea is clickable) */}
<g id="bc-bigWave" filter="url(#bc-foamCrisp)">
  <path d="M-40 528 Q160 512 360 530 Q560 548 760 526 Q960 506 1160 528 Q1210 533 1240 528
           L1240 572 Q1060 588 860 570 Q660 552 460 576 Q260 598 60 578 Q10 573 -40 578 Z"
        fill="#FFFFFF" opacity=".82"/>
  <path d="M-40 556 Q200 542 440 562 Q680 582 920 558 Q1090 541 1240 556 L1240 580
           Q1040 596 820 580 Q600 564 380 586 Q180 606 -40 590 Z"
        fill="#CFEFE8" opacity=".5"/>
</g>

{/* The sea is clickable: a wave comes in. It sits here, directly above
     the water and below everything standing on the beach, so that the
     parasol and the crab win the hit test where they overlap it. */}
<rect x="0" y="330" width="1200" height="196" fill="transparent"
      {...prop("The sea", sendWave)} />

{/* ══════════ 5. DRY SAND ══════════ */}
{/* The berm — the low step the tide builds. It is the only horizontal
     edge between here and the bottom of the frame, so it does a lot of
     work holding the lower half of the picture together. */}
<path d="M0 596 Q180 588 380 598 Q600 609 820 597 Q1000 588 1200 598 L1200 900 L0 900 Z" fill="url(#bc-sandDry)"/>
{/* broken into runs, because a tideline is never one continuous edge */}
<g filter="url(#bc-foamCrisp)">
  <path d="M0 595 Q120 589 244 596 M330 599 Q470 606 604 601 M700 596 Q880 589 1010 595 M1080 596 Q1150 598 1200 597"
        fill="none" stroke="#FFF2D8" strokeOpacity=".26" strokeWidth="2.2"/>
  <path d="M40 603 Q180 597 322 605 M420 608 Q560 613 690 605 M790 600 Q960 593 1130 601"
        fill="none" stroke="#8A6636" strokeOpacity=".10" strokeWidth="5"/>
</g>

{/* Grain, stamped at three scales. Far sand is fine and even; the sand
     under the camera is coarse enough to see individual grains. */}
<rect x="0" y="596" width="1200" height="100" fill="url(#bc-sandGrain)" opacity=".34"
      style={{ transform: "scale(1,.40)", transformOrigin: "0 596px" }}/>
<rect x="0" y="686" width="1200" height="120" fill="url(#bc-sandGrain)" opacity=".44"
      style={{ transform: "scale(1.25,.72)", transformOrigin: "0 686px" }}/>
<rect x="0" y="790" width="1200" height="120" fill="url(#bc-sandGrain)" opacity=".5"
      style={{ transform: "scale(1.6,1.1)", transformOrigin: "0 790px" }}/>

{/* Dips and drifts. Sand is never flat; these are the soft shadows in
     the hollows, warm-rimmed on the side facing the sun. */}
<g opacity=".5" filter="url(#bc-shadowSoft)">
  <ellipse cx="240" cy="664" rx="190" ry="20" fill="#9C7443" opacity=".34"/>
  <ellipse cx="760" cy="648" rx="230" ry="18" fill="#9C7443" opacity=".28"/>
  <ellipse cx="520" cy="754" rx="260" ry="28" fill="#9C7443" opacity=".30"/>
  <ellipse cx="1020" cy="796" rx="210" ry="30" fill="#9C7443" opacity=".26"/>
  <ellipse cx="160" cy="836" rx="220" ry="34" fill="#8A6636" opacity=".30"/>
</g>
<g opacity=".42">
  <path d="M60 660 Q240 650 420 662" fill="none" stroke="#FFF0D2" strokeOpacity=".6" strokeWidth="2.4"/>
  <path d="M560 644 Q760 634 980 646" fill="none" stroke="#FFF0D2" strokeOpacity=".5" strokeWidth="2.6"/>
  <path d="M300 748 Q540 736 780 752" fill="none" stroke="#FFF0D2" strokeOpacity=".45" strokeWidth="3.2"/>
</g>

{/* Footprints leading out of frame toward the water. They give the sand
     a scale and they tell you somebody walked off a minute ago. */}
{/* Footprints leaving toward the water: a sole and a heel each, the
     pair swapping sides down the trail, growing as they come forward. */}
<g fill="#7E5C30">
  <g opacity="0.20" transform="rotate(-43.7 593 609)"><ellipse cx="593" cy="609" rx="7.1" ry="2.9"/><ellipse cx="587" cy="615" rx="2.9" ry="2.3"/></g>
  <g opacity="0.22" transform="rotate(-43.7 573 633)"><ellipse cx="573" cy="633" rx="8.1" ry="3.2"/><ellipse cx="566" cy="640" rx="3.2" ry="2.6"/></g>
  <g opacity="0.24" transform="rotate(-43.7 544 646)"><ellipse cx="544" cy="646" rx="9.1" ry="3.7"/><ellipse cx="537" cy="654" rx="3.7" ry="3.0"/></g>
  <g opacity="0.25" transform="rotate(-43.7 522 678)"><ellipse cx="522" cy="678" rx="10.4" ry="4.2"/><ellipse cx="513" cy="687" rx="4.2" ry="3.4"/></g>
  <g opacity="0.27" transform="rotate(-43.7 485 699)"><ellipse cx="485" cy="699" rx="11.8" ry="4.7"/><ellipse cx="475" cy="709" rx="4.7" ry="3.8"/></g>
  <g opacity="0.29" transform="rotate(-43.7 455 746)"><ellipse cx="455" cy="746" rx="13.3" ry="5.3"/><ellipse cx="444" cy="756" rx="5.3" ry="4.3"/></g>
  <g opacity="0.31" transform="rotate(-43.7 408 778)"><ellipse cx="408" cy="778" rx="15.2" ry="6.1"/><ellipse cx="395" cy="790" rx="6.1" ry="4.9"/></g>
  <g opacity="0.33" transform="rotate(-43.7 369 843)"><ellipse cx="369" cy="843" rx="17.4" ry="6.9"/><ellipse cx="354" cy="857" rx="6.9" ry="5.6"/></g>
</g>
{/* each print is a hollow, so its far wall catches the light */}
<g>
  <g opacity="0.18" transform="rotate(-43.7 593 609)"><path d="M586 609 a7.1 2.9 0 0 0 14.3 0" fill="none" stroke="#FFF2D8" strokeWidth="1.0"/></g>
  <g opacity="0.20" transform="rotate(-43.7 573 633)"><path d="M565 633 a8.1 3.2 0 0 0 16.1 0" fill="none" stroke="#FFF2D8" strokeWidth="1.1"/></g>
  <g opacity="0.21" transform="rotate(-43.7 544 646)"><path d="M535 646 a9.1 3.7 0 0 0 18.3 0" fill="none" stroke="#FFF2D8" strokeWidth="1.3"/></g>
  <g opacity="0.23" transform="rotate(-43.7 522 678)"><path d="M512 678 a10.4 4.2 0 0 0 20.8 0" fill="none" stroke="#FFF2D8" strokeWidth="1.5"/></g>
  <g opacity="0.24" transform="rotate(-43.7 485 699)"><path d="M473 699 a11.8 4.7 0 0 0 23.6 0" fill="none" stroke="#FFF2D8" strokeWidth="1.7"/></g>
  <g opacity="0.26" transform="rotate(-43.7 455 746)"><path d="M442 746 a13.3 5.3 0 0 0 26.7 0" fill="none" stroke="#FFF2D8" strokeWidth="1.9"/></g>
  <g opacity="0.28" transform="rotate(-43.7 408 778)"><path d="M393 778 a15.2 6.1 0 0 0 30.4 0" fill="none" stroke="#FFF2D8" strokeWidth="2.2"/></g>
  <g opacity="0.29" transform="rotate(-43.7 369 843)"><path d="M352 843 a17.4 6.9 0 0 0 34.7 0" fill="none" stroke="#FFF2D8" strokeWidth="2.5"/></g>
</g>

{/* ══════════ 6. (was a far-rock silhouette) ══════════
     Removed. Blurred blue-grey shapes sitting on the horizon read as
     cloud on the water rather than as land, and the right-hand side of
     the frame is stronger with clean horizon under the sun path. */}

{/* ══════════ 7. GULLS, WORKING THE UPDRAFT ══════════
     High in the sky and out over the water, where gulls actually are.
     The position sits on an outer group because the glide animation is a
     CSS transform, and a CSS transform replaces the transform attribute
     rather than composing with it. */}
<g transform="translate(840 -74)">
  <g className="bc-gull">
    <g className="bc-gull-wing" fill="none" stroke="#F4F8FA" strokeOpacity=".82" strokeWidth="3" strokeLinecap="round">
      <path d="M-17 236 q11 -10 18 0 q11 -10 18 0"/>
    </g>
  </g>
</g>
<g transform="translate(1010 -122)">
  <g className="bc-gull" style={{ animationDuration: "113s", animationDelay: "-31s" }}>
    <g className="bc-gull-wing" style={{ animationDuration: "5.8s" }} fill="none" stroke="#E8EFF3" strokeOpacity=".6"
       strokeWidth="2.2" strokeLinecap="round">
      <path d="M-12 274 q8 -7 13 0 q8 -7 13 0"/>
    </g>
  </g>
</g>

{/* ══════════ 8. A GULL ON THE WET SAND ══════════
     Standing in its own reflection, which is what tells you the sand is
     still wet there. */}
<g>
  <ellipse cx="742" cy="576" rx="17" ry="4" fill="#4A4270" opacity=".22"/>
  <path d="M736 576 q6 14 -2 20 q10 2 16 -20 Z" fill="#8FA2A4" opacity=".28"/> {/* reflection */}
  {/* body: a teardrop leaning forward, not a circle */}
  <path d="M726 570 q-2 -14 10 -20 q10 -6 18 0 q8 5 8 14 q0 8 -8 11 q-14 4 -28 -5 Z" fill="#FBFDFE"/>
  <path d="M746 550 q10 0 14 10 q2 8 -2 14 q-8 4 -18 4 q10 -14 6 -28 Z" fill="#DCE6EC"/>
  {/* the folded wing, grey, with the black tip that says gull */}
  <path d="M736 558 q16 -4 26 4 q4 6 -2 10 q-14 4 -26 -4 q-2 -6 2 -10 Z" fill="#AFBEC8"/>
  <path d="M758 562 q8 2 8 8 q-6 3 -10 0 Z" fill="#33414C"/>
  <path d="M736 557 q15 -4 25 4" fill="none" stroke="#FFF6E2" strokeOpacity=".8" strokeWidth="1.4"/>
  <path d="M762 552 l10 -1" stroke="#E8A13C" strokeWidth="2.6" strokeLinecap="round"/>
  <circle cx="757" cy="550" r="1.5" fill="#22303A"/>
  <path d="M738 574 v5 l-3 2 M746 574 v5 l3 2" stroke="#E8A13C" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
  <path d="M727 564 q3 -13 15 -17" fill="none" stroke="#FFF3D6" strokeOpacity=".85" strokeWidth="1.6"/>
</g>

{/* ══════════ 9. THE PARASOL ══════════
     The tallest thing in the frame and the anchor of the composition.
     Its shadow is a 200px ellipse, which is what actually sells the
     height — a tall object with a small shadow reads as a sticker. */}

{/* shade first, so everything laid on the sand sits inside it */}
<g id="bc-parasolShadow" filter="url(#bc-shadowSoft)">
  <ellipse cx="236" cy="742" rx="200" ry="48" fill="#3B3E72" opacity=".30" transform="rotate(-6 236 742)"/>
  <ellipse cx="256" cy="736" rx="150" ry="34" fill="#3B3E72" opacity=".16" transform="rotate(-6 256 736)"/>
</g>

{/* ══════════ 10. THE TOWEL — laid out inside the shade ══════════ */}
<g>
  {/* the sand dents under it */}
  <path d="M70 812 Q240 826 412 800 Q250 840 70 812 Z" fill="#4A3A52" opacity=".16" filter="url(#bc-foamSoft)"/>
  <path d="M118 714 L352 706 L402 796 L76 806 Z" fill="url(#bc-towelG)"/>
  {/* stripes, converging with the towel's own perspective */}
  <g opacity=".92">
    <path d="M154 712 L196 802 L172 803 L132 713 Z" fill="url(#bc-towelStripe)"/>
    <path d="M222 710 L266 800 L242 801 L200 711 Z" fill="url(#bc-towelStripe)"/>
    <path d="M292 708 L338 798 L314 799 L270 709 Z" fill="url(#bc-towelStripe)"/>
  </g>
  {/* weave: fine cross-hatching so it reads as cloth, not painted card */}
  <g stroke="#0E3D4E" strokeOpacity=".12" strokeWidth="1.2">
    <path d="M112 736 L386 728 M110 758 L392 750 M108 780 L397 772"/>
  </g>
  {/* rumples: a lit crest and a shadowed trough for each fold */}
  <path d="M118 714 Q206 736 402 796" fill="none" stroke="#0A2E3C" strokeOpacity=".12" strokeWidth="3.4"/>
  <path d="M120 711 Q208 733 404 793" fill="none" stroke="#B8ECF4" strokeOpacity=".22" strokeWidth="2.2"/>
  <path d="M232 708 Q248 756 290 798" fill="none" stroke="#0A2E3C" strokeOpacity=".16" strokeWidth="4"/>
  {/* the corner the breeze keeps picking up */}
  <g className="bc-towel-corner">
    <path d="M382 780 L402 796 L416 774 Q400 770 382 780 Z" fill="#2F8FA8"/>
    <path d="M382 780 Q400 770 416 774" fill="none" stroke="#C6F0F8" strokeOpacity=".55" strokeWidth="2"/>
  </g>
  {/* rim light along the sunward edge */}
  <path d="M352 706 L402 796" fill="none" stroke="#FFE9BE" strokeOpacity=".5" strokeWidth="2.2"/>
</g>

{/* sunglasses, folded, dropped on the towel */}
<g transform="rotate(-11 240 752)">
  <ellipse cx="240" cy="758" rx="34" ry="7" fill="#4A3A52" opacity=".26" filter="url(#bc-foamSoft)"/>
  <path d="M214 748 q12 -7 22 0 q6 4 0 9 q-12 6 -22 0 Z" fill="#1C2733"/>
  <path d="M240 748 q12 -7 22 0 q6 4 0 9 q-12 6 -22 0 Z" fill="#1C2733"/>
  <path d="M236 748 h8" stroke="#2E3B49" strokeWidth="3"/>
  <path d="M216 746 q11 -5 19 0" fill="none" stroke="#9FD8F0" strokeOpacity=".7" strokeWidth="1.6"/>
  <path d="M242 746 q11 -5 19 0" fill="none" stroke="#9FD8F0" strokeOpacity=".7" strokeWidth="1.6"/>
  <path d="M262 750 q14 3 18 10" fill="none" stroke="#22303E" strokeWidth="3" strokeLinecap="round"/>
</g>

{/* the parasol itself */}
<g id="bc-parasol" {...prop("Parasol", toggleParasol)}>
  {/* pole. Aluminium: a dark core with a hot line down the sunward side. */}
  <path d="M327 300 h7 v392 h-7 Z" fill="#6E7A88"/>
  <path d="M333 300 h3 v392 h-3 Z" fill="#FFF0CE" opacity=".8"/>
  <path d="M325 300 h3 v392 h-3 Z" fill="#3A4652" opacity=".7"/>
  <ellipse cx="330" cy="692" rx="13" ry="4" fill="#4A3A52" opacity=".5"/>
  {/* sand heaped round the foot; nothing stands in sand without it */}
  <path d="M300 692 q30 -16 60 0 q-10 10 -30 10 q-20 0 -30 -10 Z" fill="#C7A470"/>
  <path d="M302 690 q28 -13 56 0" fill="none" stroke="#FFF0D2" strokeOpacity=".6" strokeWidth="2"/>
  <path d="M312 700 q18 5 36 0" fill="none" stroke="#8A6636" strokeOpacity=".3" strokeWidth="2.6"/>

  <g id="bc-canopy">
    {/* eight panels. Each has a scalloped lower edge that bulges away
         from the apex — a straight-edged parasol looks like a road cone. */}
    <path d="M330 296 L498 368 Q502.4 378.2 485.2 378 Z"   fill="url(#bc-canopyStripe)"/>
    <path d="M330 296 L485.2 378 Q477.2 388.6 448.8 386.4 Z" fill="url(#bc-canopyRed)"/>
    <path d="M330 296 L448.8 386.4 Q430 397.8 394.3 392 Z"  fill="url(#bc-canopyStripe)"/>
    <path d="M330 296 L394.3 392 Q366 404.4 330 394 Z"      fill="url(#bc-canopyRed)"/>
    <path d="M330 296 L330 394 Q294.1 404.4 265.7 392 Z"    fill="url(#bc-canopyStripe)"/>
    <path d="M330 296 L265.7 392 Q230.1 397.8 211.2 386.4 Z" fill="url(#bc-canopyRed)"/>
    <path d="M330 296 L211.2 386.4 Q182.8 388.6 174.8 378 Z" fill="url(#bc-canopyStripe)"/>
    <path d="M330 296 L174.8 378 Q157.6 378.2 162 368 Z"    fill="url(#bc-canopyRed)"/>

    {/* seams */}
    <g stroke="#7A4238" strokeOpacity=".3" strokeWidth="1.4" fill="none">
      <path d="M330 296 L485.2 378 M330 296 L448.8 386.4 M330 296 L394.3 392 M330 296 L330 394
               M330 296 L265.7 392 M330 296 L211.2 386.4 M330 296 L174.8 378"/>
    </g>

    {/* Backlit fabric: the sunward half glows, the shaded half cools.
         This is the single change that stops it reading as flat plastic. */}
    <path d="M330 296 L498 368 Q470 400 330 394 Z" fill="#FFE3A6" opacity=".34"/>
    <path d="M330 296 L162 368 Q200 400 330 394 Z" fill="#3B3E72" opacity=".16"/>

    {/* the crescent of underside you can see past the near rim */}
    <path d="M394.3 392 Q366 404.4 330 394 Q294.1 404.4 265.7 392 Q330 384 394.3 392 Z"
          fill="url(#bc-canopyUnder)" opacity=".9"/>
    {/* and the ribs inside it */}
    <g stroke="#6E3529" strokeOpacity=".45" strokeWidth="1.6" fill="none">
      <path d="M330 392 v10 M300 390 l-6 10 M360 390 l6 10"/>
    </g>

    {/* fringe */}
    <g className="bc-fringe" fill="url(#bc-canopyUnder)" opacity=".92">
      <path d="M162 368 q9 12 18 2 q9 14 18 4 q9 12 18 2 q9 14 18 4 q9 12 18 2 q9 14 18 4
               q9 12 18 2 q9 14 18 4 q9 12 18 2 q9 14 18 4 q9 12 18 2 q9 14 18 4 q9 12 18 2
               q9 14 18 4 q9 12 18 2 L498 368 Q430 404 330 396 Q230 404 162 368 Z"
            opacity=".0"/>
      <path d="M176 378 q8 11 16 1 M208 386 q8 11 16 1 M244 391 q8 11 16 1 M282 393 q8 12 16 2
               M320 394 q8 12 16 2 M358 392 q8 11 16 0 M396 390 q8 11 16 -1 M434 384 q8 10 16 -2
               M468 375 q8 10 16 -3"
            fill="none" stroke="#B4614C" strokeWidth="4" strokeLinecap="round"/>
    </g>

    {/* finial, and the hot spot where the sun hits the apex */}
    <path d="M330 288 q5 0 5 5 q0 5 -5 5 q-5 0 -5 -5 q0 -5 5 -5 Z" fill="#C9CFD6"/>
    <path d="M330 282 v8" stroke="#8C959E" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="336" cy="300" r="9" fill="#FFF6DC" opacity=".5" filter="url(#bc-foamSoft)"/>
  </g>
</g>

{/* ══════════ 11. THE COOL BOX ══════════
     A real box: top and right faces catch the sun, the front sits in
     half-shade, and the shadow runs down-left like everything else. */}
<g>
  <ellipse cx="662" cy="734" rx="96" ry="18" fill="#3B3E72" opacity=".30" filter="url(#bc-shadowSoft)"/>
  <path d="M618 730 L560 754 L636 766 L700 738 Z" fill="#3B3E72" opacity=".26" filter="url(#bc-foamSoft)"/>
  {/* body */}
  <path d="M618 668 L744 668 L748 734 L614 734 Z" fill="url(#bc-coolerBody)"/>
  <path d="M744 668 L792 646 L794 706 L748 734 Z" fill="#1C5670"/>
  <path d="M744 668 L792 646 L794 706 L748 734 Z" fill="url(#bc-coolerBody)" opacity=".45"/>
  {/* lid, sitting slightly proud and slightly ajar */}
  <path d="M612 660 L740 660 L790 638 L660 638 Z" fill="url(#bc-coolerLid)"/>
  <path d="M612 660 L740 660 L744 674 L614 674 Z" fill="#C3D2DB"/>
  <path d="M740 660 L790 638 L792 652 L744 674 Z" fill="#9EB0BC"/>
  <path d="M660 638 L790 638" stroke="#FFF6E2" strokeOpacity=".5" strokeWidth="2"/>
  {/* latch and handle */}
  <path d="M672 674 h24 v10 h-24 Z" fill="#CFDCE4"/>
  <path d="M672 674 h24 v3 h-24 Z" fill="#FFFFFF" opacity=".55"/>
  <path d="M628 690 q-10 10 0 20" fill="none" stroke="#153F55" strokeWidth="5" strokeLinecap="round"/>
  {/* moulding lines, and the rim light on the sunward corner */}
  <path d="M622 700 L742 700 M622 714 L744 714" stroke="#12455C" strokeOpacity=".25" strokeWidth="2.4"/>
  <path d="M744 668 L748 734" stroke="#FFEFC6" strokeOpacity=".7" strokeWidth="2.6"/>
  <path d="M792 646 L794 706" stroke="#FFEFC6" strokeOpacity=".5" strokeWidth="2.2"/>
  <ellipse cx="662" cy="734" rx="70" ry="9" fill="url(#bc-occl)"/>
</g>

{/* ══════════ 12. BUCKET AND SPADE ══════════ */}
<g>
  <ellipse cx="880" cy="722" rx="56" ry="13" fill="#3B3E72" opacity=".28" filter="url(#bc-shadowSoft)"/>
  <path d="M852 720 L800 738 L856 744 L898 726 Z" fill="#3B3E72" opacity=".22" filter="url(#bc-foamSoft)"/>
  {/* bucket: a truncated cone, so the rim is an ellipse and the wall
       narrows toward the base */}
  {/* a real taper: the base is two thirds of the rim, which is what
       separates a bucket from a mug */}
  <path d="M842 670 L856 716 q24 8 48 0 L918 670 Z" fill="url(#bc-bucketG)"/>
  <path d="M894 676 L904 714 q6 -2 10 -4 L918 670 Z" fill="#FFE9A8" opacity=".7"/>
  <path d="M842 670 L856 716 q8 3 13 4 L856 670 Z" fill="#8A5610" opacity=".6"/>
  <path d="M849 696 q31 10 62 0" fill="none" stroke="#A56A15" strokeOpacity=".3" strokeWidth="2.2"/>
  <path d="M849 693 q31 10 62 0" fill="none" stroke="#FFE9A8" strokeOpacity=".38" strokeWidth="1.4"/>
  {/* rim, then the dark inside, then the sand it is packed with */}
  <ellipse cx="880" cy="670" rx="38" ry="12" fill="#C98A20"/>
  <ellipse cx="880" cy="670" rx="38" ry="12" fill="none" stroke="#FFE49C" strokeWidth="2.8"/>
  <ellipse cx="880" cy="671" rx="31" ry="9.4" fill="#5E3E0E"/>
  <path d="M849 671 a31 9.4 0 0 0 62 0" fill="#8A5A12"/>
  <path d="M856 674 q24 -9 48 -1 q-22 9 -48 1 Z" fill="#D9B98C"/>
  <path d="M857 673 q23 -8 46 -1" fill="none" stroke="#FFF2CE" strokeOpacity=".8" strokeWidth="1.6"/>
  {/* handle */}
  <path d="M844 666 q36 -44 72 0" fill="none" stroke="#9E2420" strokeWidth="4.6" strokeLinecap="round"/>
  <path d="M845 663 q35 -41 70 0" fill="none" stroke="#FF8A72" strokeOpacity=".7" strokeWidth="1.8"/>
  <circle cx="844" cy="666" r="3.4" fill="#C0322A"/><circle cx="916" cy="666" r="3.4" fill="#E2584A"/>
  <ellipse cx="880" cy="720" rx="34" ry="7" fill="url(#bc-occl)"/>

  {/* the spade, in front of the bucket and leaning on it, blade planted */}
  <g transform="rotate(-15 838 732)">
    <path d="M820 726 L788 742 L834 748 L852 734 Z" fill="#3B3E72" opacity=".22" filter="url(#bc-foamSoft)"/>
    <path d="M831 636 h13 v70 h-13 Z" fill="#C63A2C"/>
    <path d="M841 636 h3 v70 h-3 Z" fill="#FF9A82" opacity=".8"/>
    <path d="M831 636 h3 v70 h-3 Z" fill="#8E2018" opacity=".55"/>
    <path d="M828 628 q10 -11 19 0 q-3 9 -19 0 Z" fill="#E24B3C"/>
    <path d="M840 626 q6 1 7 4 q-4 4 -7 1 Z" fill="#FF9A82" opacity=".7"/>
    {/* blade: wider than the shaft, dished, and its edge catches the sun */}
    <path d="M826 704 q12 -6 24 0 l-3 22 q-4 8 -9 8 q-5 0 -9 -8 Z" fill="#E2A428"/>
    <path d="M843 706 q5 1 6 3 l-3 20 q-3 6 -6 6 Z" fill="#FFE49C"/>
    <path d="M826 704 q12 -6 24 0" fill="none" stroke="#FFF2CE" strokeOpacity=".85" strokeWidth="1.8"/>
    <path d="M838 710 v22" stroke="#A56A15" strokeOpacity=".45" strokeWidth="1.6"/>
    <ellipse cx="838" cy="732" rx="13" ry="4" fill="url(#bc-occl)"/>
  </g>
</g>

{/* ══════════ 13. THE SANDCASTLE ══════════
     Sand on sand, so it cannot rely on colour to read — it has to be
     carried entirely by form: three tapering tiers, each with a lit face,
     a shaded face and a bright rim, and battlements cut deep enough to
     hold their own shadows. */}
<g>
  <ellipse cx="1000" cy="772" rx="116" ry="24" fill="#3B3E72" opacity=".26" filter="url(#bc-shadowSoft)"/>
  <path d="M962 770 L872 798 L972 808 L1042 780 Z" fill="#3B3E72" opacity=".22" filter="url(#bc-foamSoft)"/>

  {/* moat: a trench, so it is dark inside and its far bank catches sun */}
  <path d="M892 764 Q912 744 964 742 Q1028 738 1074 748 Q1112 758 1106 776
           Q1092 796 1018 800 Q944 804 906 790 Q882 780 892 764 Z" fill="#A07B4C" opacity=".5"/>
  <path d="M892 764 Q912 744 964 742 Q1028 738 1074 748 Q1112 758 1106 776"
        fill="none" stroke="#FFF0D2" strokeOpacity=".42" strokeWidth="2.4"/>
  <path d="M902 774 Q944 792 1016 790 Q1078 788 1102 772"
        fill="none" stroke="#6E5433" strokeOpacity=".3" strokeWidth="3"/>
  {/* damp sand collected at the bottom of the trench */}
  <path d="M906 766 Q940 748 1000 746 Q1058 744 1092 760 Q1060 780 996 782 Q932 784 906 766 Z"
        fill="#7E6340" opacity=".3"/>

  {/* base tier */}
  <path d="M938 726 L946 764 q54 14 108 0 L1062 726 Z" fill="#C9A672"/>
  <path d="M1012 727 L1044 762 q6 -2 10 -4 L1062 726 Z" fill="#F2D6A6"/>
  <path d="M938 726 L946 764 q16 5 26 6 L958 726 Z" fill="#8E6E45"/>
  <ellipse cx="1000" cy="726" rx="62" ry="10" fill="#BE9D6E"/>
  <path d="M938 726 a62 10 0 0 1 124 0" fill="none" stroke="#FFF6DE" strokeOpacity=".38" strokeWidth="1.8"/>

  {/* middle tier */}
  <path d="M960 690 L966 722 q36 10 72 0 L1044 690 Z" fill="#D2AF7A"/>
  <path d="M1006 691 L1030 720 q5 -2 8 -3 L1044 690 Z" fill="#F6DDAE"/>
  <path d="M960 690 L966 722 q12 4 20 5 L976 690 Z" fill="#96754A"/>
  <ellipse cx="1002" cy="690" rx="42" ry="8" fill="#C7A87A"/>
  <path d="M960 690 a42 8 0 0 1 84 0" fill="none" stroke="#FFF6DE" strokeOpacity=".4" strokeWidth="1.6"/>

  {/* keep, with battlements. Far merlons first, then the top, then the
       near ones, so the ring reads as a ring. */}
  <g fill="#B8945F">
    <path d="M983 634 h13 v13 h-13 Z"/><path d="M1014 634 h13 v13 h-13 Z"/>
  </g>
  <path d="M978 646 L984 686 q28 8 56 0 L1046 646 Z" fill="#D8B583"/>
  <path d="M1016 647 L1036 684 q5 -1 8 -3 L1046 646 Z" fill="#F8E2B6"/>
  <path d="M978 646 L984 686 q10 3 17 4 L992 646 Z" fill="#9A7A4E"/>
  <ellipse cx="1012" cy="646" rx="34" ry="7" fill="#CFB07E"/>
  <ellipse cx="1012" cy="647" rx="24" ry="5" fill="#6E5433" opacity=".45"/>
  <path d="M978 646 a34 7 0 0 1 68 0" fill="none" stroke="#FFF6DE" strokeOpacity=".45" strokeWidth="1.6"/>
  {/* near merlons: lit right cheek, shaded left cheek, dark gap between */}
  <g>
    <path d="M980 645 h13 v14 h-13 Z" fill="#C2A06B"/><path d="M989 645 h4 v14 h-4 Z" fill="#F4DCB0"/>
    <path d="M1006 652 h13 v14 h-13 Z" fill="#C2A06B"/><path d="M1015 652 h4 v14 h-4 Z" fill="#F4DCB0"/>
    <path d="M1032 645 h13 v14 h-13 Z" fill="#C2A06B"/><path d="M1041 645 h4 v14 h-4 Z" fill="#F4DCB0"/>
  </g>
  <g fill="none" stroke="#FFF6DE" strokeOpacity=".6" strokeWidth="1.4">
    <path d="M980 645 h13 M1006 652 h13 M1032 645 h13"/>
  </g>

  {/* side turret, lower and nearer, so the cluster has depth of its own */}
  <g fill="#B8945F">
    <path d="M916 700 h10 v11 h-10 Z"/>
  </g>
  <path d="M912 710 L918 750 q18 6 36 0 L960 710 Z" fill="#CDA972"/>
  <path d="M938 711 L950 748 q4 -1 6 -2 L960 710 Z" fill="#F0D7A8"/>
  <path d="M912 710 L918 750 q7 2 11 3 L923 710 Z" fill="#8E7047"/>
  <ellipse cx="936" cy="710" rx="24" ry="5" fill="#C4A374"/>
  <ellipse cx="936" cy="711" rx="16" ry="3" fill="#6E5433" opacity=".4"/>
  <path d="M912 710 a24 5 0 0 1 48 0" fill="none" stroke="#FFF6DE" strokeOpacity=".42" strokeWidth="1.4"/>
  <g>
    <path d="M914 709 h10 v11 h-10 Z" fill="#C2A06B"/><path d="M921 709 h3 v11 h-3 Z" fill="#F4DCB0"/>
    <path d="M934 713 h10 v11 h-10 Z" fill="#C2A06B"/><path d="M941 713 h3 v11 h-3 Z" fill="#F4DCB0"/>
    <path d="M950 709 h10 v11 h-10 Z" fill="#C2A06B"/><path d="M957 709 h3 v11 h-3 Z" fill="#F4DCB0"/>
  </g>

  {/* the bucket ridges left in the sand, and a doorway scooped out */}
  <g fill="none" stroke="#8A6B42" strokeOpacity=".3" strokeWidth="2">
    <path d="M982 664 q30 8 60 0 M966 706 q36 10 70 0 M948 744 q52 14 102 0"/>
  </g>
  <g fill="none" stroke="#FFF2D6" strokeOpacity=".4" strokeWidth="1.4">
    <path d="M982 661 q30 8 60 0 M966 703 q36 10 70 0 M948 741 q52 14 102 0"/>
  </g>
  <path d="M992 764 q0 -22 12 -22 q12 0 12 22 Z" fill="#6E5433" opacity=".65"/>
  <path d="M1004 742 q12 0 12 22 l-5 0 q0 -20 -7 -22 Z" fill="#8E7047" opacity=".6"/>

  {/* shells pressed into the base, and a flag */}
  <path d="M966 748 q8 -9 16 0 q-8 6 -16 0 Z" fill="#F6E4D2"/>
  <path d="M968 747 l6 -6 M974 748 l4 -7" stroke="#C9A98E" strokeWidth="1"/>
  <path d="M1044 754 q7 -8 14 0 q-7 5 -14 0 Z" fill="#EFDCC8"/>
  <path d="M1012 632 v-34" stroke="#7E6340" strokeWidth="2.2" strokeLinecap="round"/>
  <path d="M1012 598 q18 5 20 13 q-16 3 -20 -5 Z" fill="#E8574A"/>
  <path d="M1012 598 q18 5 20 13" fill="none" stroke="#FFB4A4" strokeOpacity=".7" strokeWidth="1.4"/>
  <ellipse cx="1000" cy="764" rx="64" ry="11" fill="url(#bc-occl)"/>
</g>

{/* ══════════ 14. FOREGROUND ROCKS ══════════ */}
<g>
  <ellipse cx="1108" cy="812" rx="118" ry="26" fill="#3B3E72" opacity=".32" filter="url(#bc-shadowSoft)"/>
  <path d="M1076 806 L960 846 L1070 862 L1148 822 Z" fill="#3B3E72" opacity=".26" filter="url(#bc-foamSoft)"/>
  <path d="M1040 812 q10 -52 46 -60 q34 -26 62 4 q30 10 30 46 q4 22 -22 26 q-60 10 -108 -2 q-12 -4 -8 -14 Z"
        fill="url(#bc-rockG)"/>
  <path d="M1086 752 q34 -26 62 4 q30 10 30 46 q4 22 -22 26 q-14 -46 -70 -76 Z" fill="#7C7684" opacity=".5"/>
  <path d="M1086 752 q34 -26 62 4 q30 10 30 46" fill="none" stroke="#FFE7B8" strokeOpacity=".75" strokeWidth="3"/>
  {/* bedding planes: rock is layered, and layers catch light on their tops */}
  <g fill="none" stroke="#2E2B3C" strokeOpacity=".4" strokeWidth="2.4">
    <path d="M1046 796 q54 -14 112 6 M1054 812 q52 -12 108 4"/>
  </g>
  <g fill="none" stroke="#D8D2DC" strokeOpacity=".35" strokeWidth="1.6">
    <path d="M1046 792 q54 -14 112 6 M1054 808 q52 -12 108 4"/>
  </g>
  {/* a smaller boulder in front, so the cluster has depth of its own */}
  <path d="M996 826 q8 -30 34 -30 q26 -2 30 24 q2 16 -18 18 q-34 4 -46 -4 q-4 -4 0 -8 Z" fill="#6A6474"/>
  <path d="M1030 796 q26 -2 30 24 q2 16 -18 18 q-2 -28 -12 -42 Z" fill="#8A8492" opacity=".7"/>
  <path d="M1030 796 q26 -2 30 24" fill="none" stroke="#FFE7B8" strokeOpacity=".55" strokeWidth="2.4"/>
  <ellipse cx="1028" cy="838" rx="42" ry="8" fill="url(#bc-occl)"/>
  {/* damp sand collects in the lee of a rock */}
  <ellipse cx="1096" cy="828" rx="86" ry="12" fill="#9A7A52" opacity=".3"/>
</g>

{/* ══════════ 15. THE CRAB ══════════
     Click and it bolts for the rocks. */}
<g id="bc-crab" {...prop("Crab", scareCrab)}>
  <ellipse cx="960" cy="828" rx="28" ry="7" fill="#3B3E72" opacity=".34" filter="url(#bc-foamSoft)"/>
  {/* legs, four a side, splayed and jointed */}
  <g stroke="#B8442E" strokeWidth="3.2" fill="none" strokeLinecap="round">
    <path d="M944 820 l-14 6 l-8 -4 M946 824 l-16 10 l-10 -2
             M974 820 l14 6 l8 -4 M972 824 l16 10 l10 -2"/>
  </g>
  <g stroke="#C9503A" strokeWidth="3" fill="none" strokeLinecap="round">
    <path d="M942 816 l-18 0 l-8 -6 M976 816 l18 0 l8 -6"/>
  </g>
  {/* shell */}
  <path d="M938 818 q4 -18 22 -18 q18 0 22 18 q-4 10 -22 10 q-18 0 -22 -10 Z" fill="#A8392A"/>
  <path d="M942 814 q4 -14 18 -14 q14 0 18 14 q-4 8 -18 8 q-14 0 -18 -8 Z" fill="#D4553C"/>
  <path d="M960 800 q15 0 19 15 q-6 6 -19 7 Z" fill="#F49A72"/>
  <path d="M968 802 q10 3 12 12 q-6 3 -12 4 Z" fill="#FFC4A2" opacity=".8"/>
  <path d="M940 812 q20 -10 40 0" fill="none" stroke="#8E2E1E" strokeOpacity=".5" strokeWidth="1.8"/>
  <path d="M941 807 q19 -11 38 0" fill="none" stroke="#FFD3B4" strokeOpacity=".65" strokeWidth="1.6"/>
  {/* claws, one raised */}
  <path d="M936 814 q-14 -4 -18 -14 q8 -6 14 2 q6 6 6 12 Z" fill="#C9503A"/>
  <path d="M920 802 q-6 -8 2 -10 q6 4 4 10 Z" fill="#E8735A"/>
  <path d="M984 816 q14 -2 18 6 q-8 8 -14 0 q-6 -2 -4 -6 Z" fill="#C9503A"/>
  <path d="M1000 820 q8 -2 8 4 q-6 4 -10 -1 Z" fill="#E8735A"/>
  {/* eye stalks */}
  <path d="M952 801 v-8 M968 801 v-8" stroke="#B8442E" strokeWidth="2.4" strokeLinecap="round"/>
  <circle cx="952" cy="791" r="3" fill="#2A1A14"/><circle cx="968" cy="791" r="3" fill="#2A1A14"/>
  <circle cx="951" cy="790" r="1" fill="#FFF3DC"/><circle cx="967" cy="790" r="1" fill="#FFF3DC"/>
</g>

{/* ══════════ 16. DRIFTWOOD ══════════
     Sea-bleached, so it is the palest thing on the sand and it anchors
     the bottom-left corner. */}
<g transform="rotate(-7 470 862)">
  <ellipse cx="470" cy="874" rx="120" ry="14" fill="#3B3E72" opacity=".3" filter="url(#bc-shadowSoft)"/>
  <path d="M360 866 q60 -18 118 -14 q60 4 100 -10 q14 12 -4 22 q-52 16 -106 12 q-56 -2 -104 4 q-10 -8 -4 -14 Z"
        fill="url(#bc-driftwood)"/>
  <path d="M362 860 q58 -16 116 -12 q58 4 96 -10" fill="none" stroke="#FFF4DE" strokeOpacity=".7" strokeWidth="3"/>
  {/* split grain: driftwood is always cracked along its length */}
  <g fill="none" stroke="#5E5245" strokeOpacity=".45">
    <path d="M374 868 q60 -12 112 -8 q52 4 88 -8" strokeWidth="2"/>
    <path d="M382 876 q58 -10 106 -6 q48 4 82 -8" strokeWidth="1.6"/>
    <path d="M400 862 q40 -8 76 -6" strokeWidth="1.2"/>
  </g>
  {/* a broken stub and a knot */}
  <path d="M446 856 q10 -22 26 -24 q4 8 -4 14 q-10 8 -12 14 Z" fill="#C4B4A0"/>
  <path d="M460 834 q8 -2 10 4 q-6 4 -10 -4 Z" fill="#8A7A66"/>
  <ellipse cx="520" cy="856" rx="9" ry="5" fill="#6E6053" opacity=".6"/>
  <ellipse cx="520" cy="855" rx="6" ry="3" fill="#4A4038" opacity=".6"/>
  <ellipse cx="470" cy="876" rx="96" ry="7" fill="url(#bc-occl)"/>
</g>

{/* ══════════ 17. FLIP-FLOPS ══════════
     Kicked off, one half on top of the other. */}
<g>
  <ellipse cx="672" cy="838" rx="72" ry="14" fill="#3B3E72" opacity=".28" filter="url(#bc-shadowSoft)"/>
  <g transform="rotate(-24 648 834)">
    <path d="M620 820 q26 -10 52 0 q8 14 0 28 q-26 10 -52 0 q-8 -14 0 -28 Z" fill="#2C7F9E"/>
    <path d="M646 816 q26 0 26 4 q8 14 0 28 q-4 4 -26 4 Z" fill="#49A6C4" opacity=".7"/>
    <path d="M620 820 q26 -10 52 0" fill="none" stroke="#B4E6F4" strokeOpacity=".6" strokeWidth="2"/>
    <path d="M646 824 q-14 4 -18 12 M646 824 q14 4 18 12" fill="none" stroke="#F4D64E" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="646" cy="824" r="3.4" fill="#C9A81E"/>
  </g>
  <g transform="rotate(14 700 848)">
    <path d="M672 834 q26 -10 52 0 q8 14 0 28 q-26 10 -52 0 q-8 -14 0 -28 Z" fill="#256F8A"/>
    <path d="M698 830 q26 0 26 4 q8 14 0 28 q-4 4 -26 4 Z" fill="#3E94B0" opacity=".7"/>
    <path d="M672 834 q26 -10 52 0" fill="none" stroke="#B4E6F4" strokeOpacity=".5" strokeWidth="2"/>
    <path d="M698 838 q-14 4 -18 12 M698 838 q14 4 18 12" fill="none" stroke="#E6C63E" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="698" cy="838" r="3.4" fill="#B8981A"/>
  </g>
</g>

{/* ══════════ 18. SHELLS AND PEBBLES ══════════
     Scattered small stuff. Half the job of a hidden-object scene is
     giving the eye plenty of innocent things to reject. */}
<g id="bc-shells">
  {/* scallop */}
  <g transform="rotate(-12 304 878)">
    <ellipse cx="304" cy="884" rx="26" ry="6" fill="#3B3E72" opacity=".26" filter="url(#bc-foamSoft)"/>
    <path d="M282 882 q6 -26 22 -26 q16 0 22 26 q-22 8 -44 0 Z" fill="#F7E7D6"/>
    <path d="M304 856 q16 0 22 26 q-10 4 -22 5 Z" fill="#FFF8EE" opacity=".8"/>
    <g stroke="#CDA98E" strokeOpacity=".7" strokeWidth="1.2" fill="none">
      <path d="M304 857 v25 M296 859 l-6 22 M312 859 l6 22 M289 864 l-6 16 M319 864 l6 16"/>
    </g>
    <path d="M282 882 q22 8 44 0" fill="none" stroke="#B89478" strokeOpacity=".5" strokeWidth="1.4"/>
  </g>
  {/* spiral */}
  <g transform="rotate(22 370 850)">
    <ellipse cx="370" cy="856" rx="16" ry="5" fill="#3B3E72" opacity=".24" filter="url(#bc-foamSoft)"/>
    <path d="M358 852 q-2 -18 14 -18 q16 0 14 14 q-2 10 -12 10 q-8 0 -8 -6 q0 -5 5 -5 Z" fill="#EBD3B4"/>
    <path d="M372 834 q16 0 14 14 q-2 10 -12 10 Z" fill="#FBEBD2" opacity=".85"/>
    <path d="M358 852 q14 8 28 -4" fill="none" stroke="#BFA080" strokeOpacity=".6" strokeWidth="1.2"/>
  </g>
  {/* pebbles, warm and cool mixed */}
  <g>
    <ellipse cx="200" cy="864" rx="13" ry="8" fill="#9E9098"/>
    <path d="M190 861 q10 -8 20 0" fill="none" stroke="#FFF0D6" strokeOpacity=".6" strokeWidth="2"/>
    <ellipse cx="228" cy="876" rx="9" ry="5.6" fill="#7E7684"/>
    <path d="M221 874 q7 -5 14 0" fill="none" stroke="#FFF0D6" strokeOpacity=".5" strokeWidth="1.6"/>
    <ellipse cx="560" cy="702" rx="8" ry="4.4" fill="#A2949C"/>
    <path d="M554 700 q6 -4 12 0" fill="none" stroke="#FFF0D6" strokeOpacity=".5" strokeWidth="1.4"/>
    <ellipse cx="760" cy="668" rx="7" ry="4" fill="#8E868E"/>
    <ellipse cx="146" cy="700" rx="7" ry="4" fill="#9A9296"/>
    <ellipse cx="892" cy="864" rx="15" ry="9" fill="#8E8690"/>
    <path d="M880 861 q12 -8 24 0" fill="none" stroke="#FFF0D6" strokeOpacity=".55" strokeWidth="2.2"/>
  </g>
</g>

{/* ══════════ 19. MARRAM GRASS ══════════ */}
<g className="bc-grass" style={{ transformOrigin: "64px 700px" }}>
  <g stroke="#7E9450" strokeLinecap="round" fill="none">
    <path d="M60 700 q-14 -46 -30 -70" strokeWidth="4"/>
    <path d="M66 700 q-2 -52 6 -78"   strokeWidth="3.6"/>
    <path d="M72 700 q14 -44 36 -62"  strokeWidth="3.2"/>
    <path d="M56 700 q-22 -34 -46 -44" strokeWidth="3"/>
    <path d="M78 700 q22 -30 48 -38"  strokeWidth="2.6"/>
  </g>
  <g stroke="#C6D48A" strokeOpacity=".7" strokeLinecap="round" fill="none">
    <path d="M67 698 q-2 -50 6 -74" strokeWidth="1.4"/>
    <path d="M73 698 q14 -42 34 -58" strokeWidth="1.2"/>
  </g>
  <ellipse cx="66" cy="702" rx="40" ry="7" fill="#3B3E72" opacity=".28" filter="url(#bc-foamSoft)"/>
</g>

{/* The five clues are NOT here: the game has to tap, light and remove
     them, so they live in beachClues.tsx and the screen positions them. */}

{/* ══════════ 21. FOREGROUND ══════════
     The near plane: things too close to the lens to be in focus. The eye
     needs something it cannot focus on in order to believe in the
     distance to everything else.

     It is kept to the two bottom corners on purpose — anything across the
     middle would sit on top of the driftwood and the flip-flops, and
     those are things the player has to be able to see and click. */}
<g filter="url(#bc-fgSoft)" pointerEvents="none">
  {/* marram grass at the very edge of the lens */}
  <g className="bc-grass-fg" style={{ transformOrigin: "46px 900px" }}>
    <g stroke="#38442A" strokeLinecap="round" fill="none" opacity=".92">
      <path d="M34 916 q-12 -92 -48 -136" strokeWidth="13"/>
      <path d="M62 916 q6 -108 -12 -152"  strokeWidth="12"/>
      <path d="M92 916 q28 -88 72 -126"   strokeWidth="10"/>
      <path d="M10 916 q-32 -70 -80 -96"  strokeWidth="12"/>
      <path d="M122 916 q44 -58 104 -80"  strokeWidth="8"/>
      <path d="M150 916 q30 -44 44 -98"   strokeWidth="7"/>
    </g>
    <g stroke="#66794A" strokeOpacity=".5" strokeLinecap="round" fill="none">
      <path d="M60 910 q6 -102 -10 -142" strokeWidth="3.4"/>
      <path d="M90 910 q26 -82 66 -118"  strokeWidth="3"/>
    </g>
  </g>
  {/* a dune shoulder cutting the far corner */}
  <path d="M1240 900 v-140 q-116 22 -176 140 Z" fill="#33283E" opacity=".8"/>
  <path d="M1240 800 q-92 24 -142 100" fill="none" stroke="#7E6E52" strokeOpacity=".3" strokeWidth="10"/>
  {/* one stone close enough to the lens to be pure shape */}
  <ellipse cx="214" cy="898" rx="54" ry="22" fill="#54402C" opacity=".6"/>
</g>

{/* and the ground falling away under the camera, which is simply darker */}
<linearGradient id="bc-nearFall" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0"   stopColor="#5E4224" stopOpacity="0"/>
  <stop offset="1"   stopColor="#5E4224" stopOpacity=".42"/>
</linearGradient>
<rect x="0" y="832" width="1200" height="68" fill="url(#bc-nearFall)" pointerEvents="none"/>


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

{/* ══════════ 22. GRADE ══════════ */}
{/* the whole frame warms toward the sun */}
<radialGradient id="bc-sunWash" cx=".79" cy=".22" r=".85">
  <stop offset="0"   stopColor="#FFD98A" stopOpacity=".15"/>
  <stop offset=".5"  stopColor="#FFC978" stopOpacity=".05"/>
  <stop offset="1"   stopColor="#FFC978" stopOpacity="0"/>
</radialGradient>
<g pointerEvents="none">
<rect width="1200" height="900" fill="url(#bc-sunWash)"/>
<rect width="1200" height="900" fill="#FFD08A" opacity=".04" style={{ mixBlendMode: "overlay" }}/>
<radialGradient id="bc-vig" cx=".62" cy=".3" r=".82">
  <stop offset=".54" stopColor="#0B1120" stopOpacity="0"/>
  <stop offset="1"   stopColor="#131024" stopOpacity=".46"/>
</radialGradient>
<rect width="1200" height="900" fill="url(#bc-vig)"/>
<rect width="1200" height="900" filter="url(#bc-filmGrain)" opacity=".32" style={{ mixBlendMode: "overlay" }}/>
</g>

  </svg>
  );
};
