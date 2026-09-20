import React, { useEffect, useState } from "react";
import { playSound } from "../../utils/audio";

/* ==================================================================== *
 *  Office Desk — high-fidelity scene
 *
 *  One SVG on a fixed 1200x900 viewBox, matching the frame's 4:3, so the
 *  art never distorts.
 *
 *  A third camera and a third light, after the Kitchen's mid-room window
 *  and the Beach's low sun: here we look DOWN at a desk in mid-morning
 *  daylight through a tall window at the upper left. Every cast shadow
 *  runs down-right and is soft-edged, because a window is a large source
 *  and not a point; shadows are violet-blue, since sky is the only thing
 *  filling them; and the top face of everything is its brightest face.
 *
 *  Everything lying on the desk shares one vanishing point, solved from
 *  the mat's own side edges — see the keyboard in officeClues.tsx, whose
 *  key columns and key legends all run to it.
 *
 *  The lamp is a second source that starts OFF. That is the point of it:
 *  in a room this bright, switching it on lays a warm pool over daylight
 *  and the scene visibly changes.
 *
 *  The five pieces of litter are NOT in this backdrop — the game has to
 *  tap, light and remove them, so they live in officeClues.tsx and are
 *  positioned by the screen.
 * ==================================================================== */

/** Things on this desk that are genuinely confusable with litter but are not
 *  waste. Each carries its own note rather than a template — a line written for
 *  the object is the difference between a game with a voice and a game that
 *  fills in a blank. The voice is the detective's: short, dry, dismissive.
 *
 *  The apple is the one that teaches: a whole apple is not waste, a core is. */
const DECOYS: { label: string; note: string; x: number; y: number; w: number; h: number }[] = [
  { label: "notebook",     note: "Half a meeting's notes in there.",          x: 150,  y: 548, w: 246, h: 100 },
  { label: "mug of tea",   note: "Full, and still warm. Leave it.",           x: 100,  y: 600, w: 110, h: 110 },
  { label: "apple",        note: "That's lunch. Come back when it's a core.", x: 326,  y: 788, w: 76,  h: 82  },
  { label: "phone",        note: "That's someone's whole life.",              x: 508,  y: 800, w: 116, h: 106 },
  { label: "glasses",      note: "Somebody's going to need those.",           x: 640,  y: 552, w: 172, h: 62  },
  { label: "mouse",        note: "Still plugged in. Still working.",          x: 796,  y: 570, w: 92,  h: 100 },
  { label: "sticky notes", note: "Not rubbish. Not yet.",                     x: 1022, y: 722, w: 110, h: 76  },
];

interface OfficeSceneProps {
  /** Called with that object's own note when the player taps something that
   *  turns out not to be litter. */
  onDecoy?: (note: string) => void;
}

export const OfficeScene: React.FC<OfficeSceneProps> = ({ onDecoy }) => {
  // Three props the player can poke at. Two of them are the scene's own light
  // sources, so they do not merely animate — they relight the desk.
  const [monitorOff, setMonitorOff] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [nudged, setNudged] = useState(false);

  // The nudge is owned by the state that ends it rather than by a ref, so it
  // cleans itself up if the scene unmounts mid-cycle.
  useEffect(() => {
    if (!nudged) return;
    const t = window.setTimeout(() => setNudged(false), 1100);
    return () => window.clearTimeout(t);
  }, [nudged]);

  const toggleMonitor = () => {
    setMonitorOff((v) => !v);
    playSound.detectiveScan();
  };
  const toggleLamp = () => {
    setLampOn((v) => !v);
    playSound.detectiveScan();
  };
  const nudgePlant = () => {
    if (nudged) return;
    setNudged(true);
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
    className={`absolute inset-0 w-full h-full${monitorOff ? " of-monitor-off" : ""}${
      lampOn ? " of-lamp-on" : ""}`}
    viewBox="0 0 1200 900"
    preserveAspectRatio="xMidYMid slice"
    // the backdrop is inert; only the three props and the decoys opt back in
    style={{ pointerEvents: "none" }}
  >
<defs>

  {/* ══ LIGHT MODEL ══
       Mid-morning. One dominant source: a tall window at the upper LEFT,
       well above the desk. Consequences, applied without exception:

         · every cast shadow runs down-RIGHT, and they are soft-edged
           because a window is a large source, not a point
         · shadows are violet-blue — the only thing filling them is sky —
           and never grey, on warm wood least of all
         · the top face of everything is the brightest face, because the
           camera is looking DOWN and the light is coming from above
         · things furthest from the window sit in a gentle falloff, so the
           right-hand side of the desk is a step cooler and darker

       The desk lamp is a second source that is OFF until the player
       switches it on. That is the whole point of it: in a room this
       bright it adds a warm pool that argues with the daylight, and the
       scene visibly changes. */}

  {/* ── room ────────────────────────────────────────────────────────── */}
  <linearGradient id="of-wall" x1=".05" y1="0" x2=".95" y2=".8">
    <stop offset="0"   stopColor="#F2F6FA"/>
    <stop offset=".3"  stopColor="#DDE5EE"/>
    <stop offset=".72" stopColor="#B4C0D0"/>
    <stop offset="1"   stopColor="#94A2B6"/>
  </linearGradient>

  <linearGradient id="of-wallFall" x1=".35" y1="0" x2="1" y2=".3">
    <stop offset="0"   stopColor="#4A5E7E" stopOpacity="0"/>
    <stop offset=".55" stopColor="#4A5E7E" stopOpacity=".09"/>
    <stop offset="1"   stopColor="#42567A" stopOpacity=".22"/>
  </linearGradient>

  <radialGradient id="of-dayPool" cx=".16" cy=".1" r=".8">
    <stop offset="0"   stopColor="#FFFAE8" stopOpacity=".46"/>
    <stop offset=".42" stopColor="#FFF3D2" stopOpacity=".14"/>
    <stop offset="1"   stopColor="#FFF0C8" stopOpacity="0"/>
  </radialGradient>

  {/* ── the desk: a big plane seen from above, so its gradient runs with
         the light rather than with the picture ────────────────────────── */}
  <linearGradient id="of-deskTop" x1=".1" y1="0" x2=".92" y2=".55">
    <stop offset="0"   stopColor="#E0B87E"/>
    <stop offset=".22" stopColor="#CFA76E"/>
    <stop offset=".55" stopColor="#B98F58"/>
    <stop offset=".82" stopColor="#9C7343"/>
    <stop offset="1"   stopColor="#7E5A34"/>
  </linearGradient>
  <linearGradient id="of-deskLip" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stopColor="#F0D3A2"/>
    <stop offset=".35" stopColor="#B88C55"/>
    <stop offset="1"   stopColor="#6E4F2C"/>
  </linearGradient>

  <linearGradient id="of-mat" x1=".12" y1="0" x2=".9" y2=".7">
    <stop offset="0"   stopColor="#5E7488"/>
    <stop offset=".38" stopColor="#4A5E72"/>
    <stop offset=".78" stopColor="#37485A"/>
    <stop offset="1"   stopColor="#2A3846"/>
  </linearGradient>

  {/* ── shadow language: one colour for every shadow in the picture ─── */}
  <linearGradient id="of-shadow" x1="0" y1="0" x2=".85" y2=".55">
    <stop offset="0"   stopColor="#3E3A6E" stopOpacity=".46"/>
    <stop offset=".5"  stopColor="#3E3A6E" stopOpacity=".24"/>
    <stop offset="1"   stopColor="#3E3A6E" stopOpacity="0"/>
  </linearGradient>
  <radialGradient id="of-occl" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stopColor="#2E2440" stopOpacity=".6"/>
    <stop offset=".55" stopColor="#2E2440" stopOpacity=".24"/>
    <stop offset="1"   stopColor="#2E2440" stopOpacity="0"/>
  </radialGradient>

  {/* ── the two light sources ───────────────────────────────────────── */}
  <linearGradient id="of-outside" x1="0" y1="0" x2=".3" y2="1">
    <stop offset="0"   stopColor="#FFFFFF"/>
    <stop offset=".34" stopColor="#E8F4FA"/>
    <stop offset=".72" stopColor="#C6E2EC"/>
    <stop offset="1"   stopColor="#AFD0C6"/>
  </linearGradient>
  <linearGradient id="of-shaftG" x1=".1" y1="0" x2=".8" y2="1">
    <stop offset="0"   stopColor="#FFF8DC" stopOpacity=".44"/>
    <stop offset=".5"  stopColor="#FFF3CC" stopOpacity=".16"/>
    <stop offset="1"   stopColor="#FFF0C4" stopOpacity="0"/>
  </linearGradient>
  <radialGradient id="of-poolG" cx=".5" cy=".4" r=".55">
    <stop offset="0"   stopColor="#FFE2A4" stopOpacity=".9"/>
    <stop offset=".36" stopColor="#FFD289" stopOpacity=".52"/>
    <stop offset="1"   stopColor="#E8A65E" stopOpacity="0"/>
  </radialGradient>
  <linearGradient id="of-screenG" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#2E4E6E"/>
    <stop offset=".4"  stopColor="#24405C"/>
    <stop offset="1"   stopColor="#182C42"/>
  </linearGradient>

  {/* ── materials ───────────────────────────────────────────────────── */}
  <linearGradient id="of-plastic" x1=".12" y1="0" x2=".9" y2=".85">
    <stop offset="0"   stopColor="#6E7A8A"/>
    <stop offset=".3"  stopColor="#4A5462"/>
    <stop offset="1"   stopColor="#262E3A"/>
  </linearGradient>
  <linearGradient id="of-alu" x1=".08" y1="0" x2=".95" y2=".8">
    <stop offset="0"   stopColor="#FFFFFF"/>
    <stop offset=".18" stopColor="#DCE4EC"/>
    <stop offset=".5"  stopColor="#A2AEBC"/>
    <stop offset=".78" stopColor="#6E7A8A"/>
    <stop offset="1"   stopColor="#B49878"/>
  </linearGradient>
  <linearGradient id="of-ceramic" x1=".1" y1="0" x2=".9" y2=".9">
    <stop offset="0"   stopColor="#FFFFFF"/>
    <stop offset=".24" stopColor="#EEF3F8"/>
    <stop offset=".62" stopColor="#C2CDDA"/>
    <stop offset=".86" stopColor="#94A0B0"/>
    <stop offset="1"   stopColor="#C6A87E"/>
  </linearGradient>
  <linearGradient id="of-lampShade" x1=".08" y1="0" x2=".95" y2=".85">
    <stop offset="0"   stopColor="#8ED0B4"/>
    <stop offset=".26" stopColor="#4E9E80"/>
    <stop offset=".7"  stopColor="#2E6E5A"/>
    <stop offset="1"   stopColor="#8A7A4A"/>
  </linearGradient>
  <linearGradient id="of-potG" x1=".06" y1="0" x2=".96" y2=".35">
    <stop offset="0"   stopColor="#F0C49E"/>
    <stop offset=".22" stopColor="#D9A075"/>
    <stop offset=".58" stopColor="#B57A52"/>
    <stop offset=".86" stopColor="#8A583C"/>
    <stop offset="1"   stopColor="#B07A54"/>
  </linearGradient>
  <linearGradient id="of-potRim" x1=".06" y1="0" x2=".96" y2=".5">
    <stop offset="0"   stopColor="#FBD9B8"/>
    <stop offset=".3"  stopColor="#E4AE84"/>
    <stop offset=".78" stopColor="#A8704C"/>
    <stop offset="1"   stopColor="#C08A62"/>
  </linearGradient>

  <linearGradient id="of-leafG" x1=".08" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#8ECB72"/>
    <stop offset=".45" stopColor="#5E9E52"/>
    <stop offset="1"   stopColor="#33683E"/>
  </linearGradient>
  {/* Fractured ceramic. The glaze is only a skin; the body underneath is
       matte and WARMER than the glossy surface, which is the single thing
       that makes a break read as ceramic rather than as a painted line. */}
  <radialGradient id="of-appleG" cx=".34" cy=".24" r=".8">
    <stop offset="0"   stopColor="#F4785E"/>
    <stop offset=".26" stopColor="#DC4232"/>
    <stop offset=".64" stopColor="#B02220"/>
    <stop offset=".9"  stopColor="#7E1418"/>
    <stop offset="1"   stopColor="#5E3428"/>
  </radialGradient>

  <linearGradient id="of-mugFrac" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#FDFAF1"/>
    <stop offset=".5"  stopColor="#EFE7D6"/>
    <stop offset="1"   stopColor="#CFC3AC"/>
  </linearGradient>
  <linearGradient id="of-mugCyl" x1="0" y1="0" x2=".12" y2="1">
    <stop offset="0"   stopColor="#FFFFFF"/>
    <stop offset=".2"  stopColor="#F4F7FA"/>
    <stop offset=".55" stopColor="#D2DAE4"/>
    <stop offset=".84" stopColor="#9AA6B4"/>
    <stop offset="1"   stopColor="#C2A88A"/>
  </linearGradient>

  <linearGradient id="of-paper" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0"   stopColor="#FFFEF8"/>
    <stop offset=".45" stopColor="#F0EADA"/>
    <stop offset="1"   stopColor="#C8BFA8"/>
  </linearGradient>

  {/* ── textures ────────────────────────────────────────────────────── */}
  <pattern id="of-woodGrain" width="340" height="140" patternUnits="userSpaceOnUse">
    <path d="M0 18 Q100 8 200 20 T340 15" fill="none" stroke="#6E4A22" strokeOpacity=".17" strokeWidth="2.6"/>
    <path d="M0 50 Q136 40 236 54 T340 47" fill="none" stroke="#6E4A22" strokeOpacity=".11" strokeWidth="1.9"/>
    <path d="M0 86 Q80 74 190 90 T340 82" fill="none" stroke="#6E4A22" strokeOpacity=".14" strokeWidth="2.2"/>
    <path d="M0 118 Q160 106 250 120 T340 114" fill="none" stroke="#6E4A22" strokeOpacity=".09" strokeWidth="1.7"/>
    <ellipse cx="268" cy="66" rx="19" ry="8" fill="none" stroke="#6E4A22" strokeOpacity=".15" strokeWidth="2"/>
  </pattern>
  <pattern id="of-matWeave" width="9" height="9" patternUnits="userSpaceOnUse">
    <path d="M0 4.5 H9 M4.5 0 V9" stroke="#8FA4B8" strokeOpacity=".16" strokeWidth="1"/>
  </pattern>

  {/* ══ FILTERS ══ */}
  <filter id="of-filmGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="23" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.6" intercept="-0.2"/></feComponentTransfer>
  </filter>
  <filter id="of-bgSoft"     x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="of-softSm"     x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.6"/></filter>
  <filter id="of-fgSoft"     x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="of-shadowSoft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="of-shaftSoft"  x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="of-glowSoft"   x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>
  <filter id="of-steamSoft"  x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="of-dropSm" x="-40%" y="-40%" width="190%" height="190%">
    <feDropShadow dx="7" dy="8" stdDeviation="5" floodColor="#332A54" floodOpacity=".4"/>
  </filter>

  <clipPath id="of-screenClip"><rect x="540" y="176" width="332" height="200" rx="4"/></clipPath>
  <clipPath id="of-windowClip"><rect x="72" y="52" width="300" height="248" rx="5"/></clipPath>
</defs>

{/* ══════════ 1. THE ROOM ══════════ */}
<rect x="0" y="0" width="1200" height="372" fill="url(#of-wall)"/>
<rect x="0" y="0" width="1200" height="372" fill="url(#of-dayPool)"/>
{/* the wall cools and darkens away from the window */}
<rect x="0" y="0" width="1200" height="372" fill="url(#of-wallFall)"/>
{/* ambient occlusion where the wall meets the desk */}
<rect x="0" y="322" width="1200" height="50" fill="#4A3A5E" opacity=".16"/>

{/* ══════════ 2. THE WINDOW — the source ══════════ */}
<g>
  <rect x="56" y="36" width="332" height="280" rx="7" fill="#D6DEE8"/>
  <rect x="64" y="44" width="316" height="264" rx="5" fill="#F4F8FC"/>
  <g clipPath="url(#of-windowClip)">
    <rect x="72" y="52" width="300" height="248" fill="url(#of-outside)"/>
    {/* a city too far away and too bright to be in focus */}
    <g filter="url(#of-bgSoft)" opacity=".7">
      <rect x="72" y="186" width="62" height="114" fill="#A8C2C6"/>
      <rect x="146" y="150" width="48" height="150" fill="#B8CED0"/>
      <rect x="206" y="204" width="70" height="96" fill="#9FB8BE"/>
      <rect x="288" y="164" width="52" height="136" fill="#AFC6CA"/>
      <circle cx="300" cy="96" r="44" fill="#FFFFFF" opacity=".85"/>
      <circle cx="196" cy="80" r="30" fill="#FFFFFF" opacity=".6"/>
      <rect x="72" y="286" width="300" height="20" fill="#8EAAA4"/>
    </g>
  </g>
  <path d="M220 52 V300 M72 176 H372" stroke="#FBFDFF" strokeWidth="12"/>
  <path d="M220 52 V300 M72 176 H372" stroke="#B8C4D2" strokeOpacity=".6" strokeWidth="3"/>
  <rect x="56" y="304" width="332" height="16" rx="4" fill="#E2E8F0"/>
  <rect x="56" y="304" width="332" height="4" rx="2" fill="#FFFFFF" opacity=".9"/>
</g>

{/* ══════════ 3. A SHELF, to give the right-hand wall something ══════════ */}
<g>
  <path d="M720 158 L1136 158 L1136 168 L720 168 Z" fill="#B58A56"/>
  <path d="M720 158 L1136 158 L1136 161 L720 161 Z" fill="#E8C692"/>
  <path d="M720 168 L1136 168 L1136 176 L720 176 Z" fill="#7E5A32"/>
  <path d="M726 176 L1130 176 L1130 200 L726 200 Z" fill="#3E4A5E" opacity=".16" filter="url(#of-softSm)"/>
  {/* books, leaning, each with a lit spine edge */}
  <g>
    <path d="M748 100 h26 v58 h-26 Z" fill="#3E6E8E"/><path d="M770 100 h4 v58 h-4 Z" fill="#7EB4D2" opacity=".7"/>
    <path d="M778 92 h22 v66 h-22 Z" fill="#B85C4A"/><path d="M796 92 h4 v66 h-4 Z" fill="#E8927E" opacity=".7"/>
    <path d="M804 106 h30 v52 h-30 Z" fill="#5E8A5E"/><path d="M830 106 h4 v52 h-4 Z" fill="#9FCE94" opacity=".7"/>
    <path d="M840 96 l26 6 l-14 56 l-24 -6 Z" fill="#C4A04E"/>
    <path d="M862 101 l4 1 l-14 56 l-4 -1 Z" fill="#F0D58E" opacity=".7"/>
  </g>
  {/* a small pot, and a framed something */}
  <g>
    <path d="M1030 126 h58 v32 h-58 Z" fill="#E4E9F0"/>
    <path d="M1036 132 h46 v20 h-46 Z" fill="#8FB4C8"/>
    <path d="M1030 126 h58 v3 h-58 Z" fill="#FFFFFF" opacity=".85"/>
  </g>
  <g>
    <path d="M926 132 q-18 -26 -4 -38 q12 20 14 38 Z" fill="#5E9E52"/>
    <path d="M930 132 q16 -24 32 -24 q-8 20 -26 26 Z" fill="#7EBE68"/>
    <path d="M918 132 h34 l-4 26 h-26 Z" fill="#C08662"/>
    <path d="M944 132 h8 l-4 26 h-6 Z" fill="#E0A87E" opacity=".8"/>
  </g>
</g>

{/* ══════════ 4. THE DESK ══════════
     A single plane taking the lower two thirds. Its gradient runs with
     the light — bright at the window end, falling away to the right —
     rather than with the picture. */}
<rect x="0" y="360" width="1200" height="540" fill="url(#of-deskTop)"/>
<rect x="0" y="360" width="1200" height="540" fill="url(#of-woodGrain)" opacity=".6"/>
{/* grain coarsens toward the camera: the same texture gradient the beach
     uses on sand, and the only depth cue a flat plane has */}
<rect x="0" y="700" width="1200" height="200" fill="url(#of-woodGrain)" opacity=".45"
      style={{ transform: "scale(1.45,1.3)", transformOrigin: "0 700px" }}/>
<rect x="0" y="360" width="1200" height="12" fill="url(#of-deskLip)"/>
<rect x="0" y="360" width="1200" height="3" fill="#FFE7BE" opacity=".7"/>
{/* the wall drops a soft shadow onto the back of the desk */}
<rect x="0" y="372" width="1200" height="46" fill="#3E3A6E" opacity=".2"/>
<rect x="0" y="372" width="1200" height="16" fill="#3E3A6E" opacity=".16"/>

{/* ══════════ 5. THE DESK MAT ══════════ */}
<g>
  <path d="M258 536 L892 536 L996 884 L138 884 Z" fill="url(#of-mat)"/>
  <path d="M258 536 L892 536 L996 884 L138 884 Z" fill="url(#of-matWeave)" opacity=".6"/>
  <path d="M258 536 L892 536" fill="none" stroke="#A8BECE" strokeOpacity=".5" strokeWidth="2.4"/>
  <path d="M258 536 L138 884" fill="none" stroke="#8EA6BC" strokeOpacity=".4" strokeWidth="2.2"/>
  <path d="M892 536 L996 884" fill="none" stroke="#1E2A38" strokeOpacity=".45" strokeWidth="2.6"/>
  <path d="M138 884 L996 884" fill="none" stroke="#141C28" strokeOpacity=".5" strokeWidth="3"/>
  {/* it lifts a millimetre off the desk, so it casts down-right */}
  <path d="M892 536 L996 884 L1030 878 L924 534 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
</g>

{/* the patch of daylight the window lays across the desk. Skewed,
     because a rectangle of light falling on a plane at an angle is not a
     rectangle any more — and this is what tells you where the sun is. */}
{/* The breathing class sits on the paths, not on a wrapper: an opacity
     below 1 on a parent creates a stacking context, and a stacking context
     ISOLATES blending — the children would screen against nothing instead
     of against the desk. */}
<g>
  <path className="of-shaft" d="M96 404 L470 404 L690 872 L214 872 Z" fill="url(#of-shaftG)"
        filter="url(#of-shaftSoft)" style={{ mixBlendMode: "screen" }}/>
  <path d="M176 420 L406 420 L560 806 L280 806 Z" fill="#FFF6DC" opacity=".22"
        filter="url(#of-shaftSoft)" style={{ mixBlendMode: "screen" }}/>
  {/* the shadow of the window bar falling across the patch. This one is a
       shadow, so unlike the light it stays an ordinary tint. */}
  <path d="M286 404 L318 404 L474 872 L430 872 Z" fill="#4A4478" opacity=".16" filter="url(#of-shaftSoft)"/>
</g>
<g fill="#FFFBEC">
  <circle className="of-mote" cx="240" cy="430" r="2.8" opacity=".8" style={{ animationDuration: "15s" }}/>
  <circle className="of-mote" cx="334" cy="500" r="2.1" opacity=".6" style={{ animationDuration: "19s", animationDelay: "-6s" }}/>
  <circle className="of-mote" cx="180" cy="560" r="2.5" opacity=".55" style={{ animationDuration: "23s", animationDelay: "-11s" }}/>
  <circle className="of-mote" cx="420" cy="460" r="1.9" opacity=".7" style={{ animationDuration: "17s", animationDelay: "-3s" }}/>
  <circle className="of-mote" cx="300" cy="620" r="2.3" opacity=".5" style={{ animationDuration: "21s", animationDelay: "-14s" }}/>
</g>

{/* ══════════ 6. THE MONITOR ══════════ */}
<g id="of-monitor" {...prop("Monitor", toggleMonitor)}>
  {/* shadow on the wall and on the desk, both down-right */}
  <path d="M884 176 L946 196 L946 404 L884 396 Z" fill="#3E3A6E" opacity=".16" filter="url(#of-shadowSoft)"/>
  <ellipse cx="740" cy="476" rx="120" ry="22" fill="#3E3A6E" opacity=".26" filter="url(#of-shadowSoft)"/>
  <path d="M760 466 L900 496 L820 508 L706 482 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  {/* base and neck */}
  <path d="M636 466 q72 -14 144 0 q-18 15 -72 15 q-54 0 -72 -15 Z" fill="#C6CDD6"/>
  <path d="M708 452 q72 0 72 14 q-18 15 -72 15 Z" fill="#EEF2F6"/>
  <path d="M638 464 q70 -12 140 0" fill="none" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="2"/>
  <path d="M690 386 h36 v76 h-36 Z" fill="#B4BCC6"/>
  <path d="M714 386 h12 v76 h-12 Z" fill="#8A939E"/>
  <path d="M690 386 h9 v76 h-9 Z" fill="#F2F5F8"/>
  {/* bezel */}
  <rect x="524" y="160" width="364" height="232" rx="10" fill="#D8DEE6"/>
  <rect x="524" y="160" width="364" height="232" rx="10" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2"/>
  <rect x="524" y="160" width="364" height="6" rx="3" fill="#FFFFFF" opacity=".85"/>
  <rect x="872" y="166" width="16" height="220" fill="#9AA3AE" opacity=".55"/>
  <rect x="534" y="170" width="344" height="212" rx="6" fill="#141C28"/>
  <g clipPath="url(#of-screenClip)">
    <rect x="540" y="176" width="332" height="200" fill="#1A2430"/>
    {/* off, the panel is a dark mirror of the bright room */}
    <path d="M540 176 L672 176 L540 306 Z" fill="#8FA8C0" opacity=".2"/>
    <path d="M760 176 L872 176 L872 250 Z" fill="#8FA8C0" opacity=".1"/>
    <g id="of-screenOn">
      <rect x="540" y="176" width="332" height="200" fill="url(#of-screenG)"/>
      <rect x="540" y="176" width="332" height="18" fill="#152638"/>
      <g fill="#5E86A8"><rect x="548" y="181" width="36" height="8" rx="2"/><rect x="590" y="181" width="28" height="8" rx="2"/></g>
      <rect x="540" y="194" width="48" height="182" fill="#1B3048"/>
      <g fill="#46698A" opacity=".85">
        <rect x="547" y="204" width="32" height="5"/><rect x="547" y="218" width="26" height="5"/>
        <rect x="547" y="232" width="30" height="5"/><rect x="547" y="246" width="22" height="5"/>
      </g>
      <g>
        <rect x="600" y="208" width="88" height="6" fill="#8FE0F0"/>
        <rect x="616" y="224" width="126" height="6" fill="#BCD4E8" opacity=".85"/>
        <rect x="616" y="240" width="76" height="6" fill="#F0D48E" opacity=".9"/>
        <rect x="632" y="256" width="144" height="6" fill="#BCD4E8" opacity=".75"/>
        <rect x="632" y="272" width="98" height="6" fill="#9FE8B4" opacity=".85"/>
        <rect x="616" y="288" width="60" height="6" fill="#BCD4E8" opacity=".65"/>
        <rect x="600" y="304" width="112" height="6" fill="#8FE0F0" opacity=".8"/>
        <rect x="616" y="320" width="134" height="6" fill="#BCD4E8" opacity=".6"/>
        <rect className="of-caret" x="752" y="320" width="7" height="8" fill="#E8F8FF"/>
      </g>
      <path d="M540 176 L640 176 L540 276 Z" fill="#BFE4F8" opacity=".09"/>
    </g>
  </g>
  <ellipse id="of-screenBloom" cx="706" cy="276" rx="214" ry="146" fill="#7FC4EC" opacity=".12"
           filter="url(#of-glowSoft)" style={{ mixBlendMode: "screen" }}/>
  <circle className="of-led" cx="706" cy="386" r="3" fill="#7FE8B0"/>
</g>

{/* ══════════ 7. THE DESK LAMP — the second source, off by default ══════════ */}
<g id="of-lamp" {...prop("Desk lamp", toggleLamp)}>
  <ellipse cx="1078" cy="486" rx="74" ry="17" fill="#3E3A6E" opacity=".28" filter="url(#of-shadowSoft)"/>
  <path d="M1090 478 L1180 504 L1120 514 L1044 492 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  <path d="M1020 478 q58 -15 116 0 q-16 14 -58 14 q-42 0 -58 -14 Z" fill="#3E7E68"/>
  <path d="M1078 464 q58 0 58 14 q-16 14 -58 14 Z" fill="#6EB496"/>
  <path d="M1022 476 q56 -12 112 0" fill="none" stroke="#B4E8D2" strokeOpacity=".7" strokeWidth="2"/>
  <rect x="1070" y="322" width="16" height="150" rx="5" fill="#3E7E68"/>
  <rect x="1070" y="322" width="6" height="150" rx="3" fill="#8ED0B4" opacity=".8"/>
  <rect x="1082" y="322" width="4" height="150" rx="2" fill="#1E4A3C" opacity=".6"/>
  <path d="M1078 328 L964 268" stroke="#3E7E68" strokeWidth="14" strokeLinecap="round"/>
  <path d="M1078 328 L964 268" stroke="#8ED0B4" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round"/>
  <circle cx="1078" cy="328" r="11" fill="#2E6E5A"/>
  <circle cx="1075" cy="325" r="4" fill="#B4E8D2" opacity=".7"/>
  {/* The shade hangs from the arm's joint with its mouth DOWN, tilted
       14 degrees toward the middle of the desk. Its top is the narrow end
       and its opening is the wide end, which is the way round a cone has
       to be for the thing to be a lamp rather than a funnel. */}
  <g transform="translate(964 268) rotate(14)">
    <circle cx="0" cy="-10" r="10" fill="#2E6E5A"/>
    <circle cx="-3" cy="-13" r="4" fill="#B4E8D2" opacity=".7"/>
    <path d="M-23 -4 L23 -4 L66 56 L-66 56 Z" fill="url(#of-lampShade)"/>
    <path d="M9 -4 L23 -4 L66 56 L38 56 Z" fill="#2E6E5A" opacity=".45"/>
    <path d="M-23 -4 L23 -4" fill="none" stroke="#CFF4E2" strokeOpacity=".85" strokeWidth="2.6"/>
    <path d="M-23 -4 L-66 56" fill="none" stroke="#B4E8D2" strokeOpacity=".6" strokeWidth="2.6"/>
    {/* the mouth: a dark rim, and inside it the bulb that lights when on */}
    <ellipse cx="0" cy="56" rx="66" ry="13" fill="#1E4A3C"/>
    <ellipse id="of-lampBulb" cx="0" cy="55" rx="57" ry="10.5" fill="#FFECC4"/>
    <ellipse id="of-lampShadeLit" cx="0" cy="55" rx="28" ry="6" fill="#FFFBEE"/>
  </g>
  <ellipse id="of-lampBloom" cx="948" cy="352" rx="96" ry="74" fill="#FFD9A0" opacity=".26"
           filter="url(#of-glowSoft)" style={{ mixBlendMode: "screen" }}/>
</g>

{/* what the lamp does to the desk when it is on. Painted here, before
     the clutter, so the clutter sits IN it rather than on top of it. */}
<ellipse id="of-lampPool" cx="916" cy="664" rx="268" ry="150" fill="url(#of-poolG)"
         filter="url(#of-shaftSoft)" style={{ mixBlendMode: "screen" }}/>

{/* ══════════ 8. THE PLANT ══════════
     Nearest the window, so it is the greenest thing in the picture and
     it throws the longest shadow. */}
<g id="of-plantRoot" {...prop("Desk plant", nudgePlant)}>
  <ellipse cx="159" cy="504" rx="54" ry="13" fill="#3E3A6E" opacity=".3" filter="url(#of-shadowSoft)"/>
  <path d="M197 496 L330 534 L238 548 L142 512 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  <g className={`of-plant${nudged ? " of-plant-nudged" : ""}`}>
    {/* Pot and plant are built as ONE piece, in the order the eye needs
         to believe it: the pot's wall, then the dark inside of it, then
         the soil, then the blades rooted INTO that soil, and finally the
         near half of the rim painted over the lot.

         Drawing all the foliage first and the soil after it — which is
         what this was doing — buries every stem, so you never see a leaf
         touch the earth and the plant reads as standing behind the pot
         and peering over the lip. */}

    {/* 1. the wall: a cone of revolution, so no facets and no corners */}
    <path d="M119 452 L131 500 A28 8 0 0 0 187 500 L199 452 A41 12 0 0 1 119 452 Z" fill="url(#of-potG)"/>
    <path d="M119 452 A41 12 0 0 0 199 452 L197 461 A39 11 0 0 1 121 461 Z" fill="#6E4630" opacity=".3"/>
    <path d="M131 500 A28 8 0 0 0 187 500 A28 8 0 0 1 131 500 Z" fill="#E8B48E" opacity=".3"/>
    <path d="M131 500 A28 8 0 0 0 187 500" fill="none" stroke="#2E1C12" strokeOpacity=".4" strokeWidth="2"/>

    {/* 2. the flared rim, whole */}
    <path d="M113 434 L117 452 A41 12 0 0 0 201 452 L205 434 A46 13 0 0 1 113 434 Z" fill="url(#of-potRim)"/>
    <ellipse cx="159" cy="434" rx="46" ry="13" fill="#DCA277"/>
    <ellipse cx="159" cy="434" rx="46" ry="13" fill="none" stroke="#FFE4C6" strokeOpacity=".7" strokeWidth="2"/>

    {/* 3. the inside of the pot, seen down through the mouth */}
    <ellipse cx="159" cy="434" rx="39" ry="11" fill="#4E3222"/>
    <path d="M120 434 A39 11 0 0 1 198 434 A39 11 0 0 0 120 434 Z" fill="#33200F"/>

    {/* 4. soil, sunk below the rim */}
    <ellipse cx="159" cy="438" rx="37" ry="10" fill="#4A3122"/>
    <path d="M122 438 A37 10 0 0 0 196 438 A37 10 0 0 1 122 438 Z" fill="#6E4A32"/>
    <g fill="#7E5838" opacity=".8">
      <ellipse cx="139" cy="439" rx="7" ry="2.6"/><ellipse cx="177" cy="441" rx="6" ry="2.2"/>
      <ellipse cx="160" cy="444" rx="5" ry="2"/>
    </g>

    {/* 5. the blades, rooted in that soil. Their feet are visible ON the
            earth, which is the whole thing that says planted. */}
    <g>
      <ellipse cx="159" cy="440" rx="20" ry="6" fill="#241206" opacity=".55"/>
      <path d="M150 438 Q119 389 112 332 Q143 381 150 438 Z" fill="#4A8450"/>
      <path d="M150 438 Q119 389 112 332 Q130 385 150 438 Z" fill="#7CBE66"/>
      <path d="M150 438 Q130 385 112 332" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M150 438 Q119 389 112 332" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <path d="M157 437 Q150 375 170 316 Q177 378 157 437 Z" fill="#4A8450"/>
      <path d="M157 437 Q150 375 170 316 Q163 376 157 437 Z" fill="#7CBE66"/>
      <path d="M157 437 Q162 376 170 316" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M157 437 Q150 375 170 316" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <path d="M166 438 Q180 383 216 340 Q202 395 166 438 Z" fill="#4A8450"/>
      <path d="M166 438 Q180 383 216 340 Q190 389 166 438 Z" fill="#7CBE66"/>
      <path d="M166 438 Q190 388 216 340" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M166 438 Q180 383 216 340" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <path d="M147 440 Q118 420 104 388 Q133 408 147 440 Z" fill="#4A8450"/>
      <path d="M147 440 Q118 420 104 388 Q125 414 147 440 Z" fill="#7CBE66"/>
      <path d="M147 440 Q125 415 104 388" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M147 440 Q118 420 104 388" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <path d="M170 440 Q194 409 230 394 Q206 425 170 440 Z" fill="#4A8450"/>
      <path d="M170 440 Q194 409 230 394 Q200 417 170 440 Z" fill="#7CBE66"/>
      <path d="M170 440 Q199 416 230 394" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M170 440 Q194 409 230 394" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <path d="M154 437 Q142 395 146 352 Q158 394 154 437 Z" fill="#3E7248"/>
      <path d="M154 437 Q142 395 146 352 Q149 395 154 437 Z" fill="#5EA058"/>
      <path d="M154 437 Q149 395 146 352" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M154 437 Q142 395 146 352" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <path d="M163 441 Q181 423 206 420 Q188 438 163 441 Z" fill="#3E7248"/>
      <path d="M163 441 Q181 423 206 420 Q184 430 163 441 Z" fill="#68AC5E"/>
      <path d="M163 441 Q184 430 206 420" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M163 441 Q181 423 206 420" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <path d="M151 441 Q134 425 110 424 Q127 440 151 441 Z" fill="#3E7248"/>
      <path d="M151 441 Q134 425 110 424 Q131 432 151 441 Z" fill="#68AC5E"/>
      <path d="M151 441 Q131 432 110 424" fill="none" stroke="#2E5E3C" strokeOpacity=".5" strokeWidth="1.6"/>
      <path d="M151 441 Q134 425 110 424" fill="none" stroke="#B8E49A" strokeOpacity=".45" strokeWidth="1.3"/>
      <g stroke="#3E7248" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M152 440 L150 430 M159 440 L160 428 M166 440 L169 431"/>
      </g>
    </g>

    {/* 6. and the NEAR half of the rim again, over everything, so the
            lip of the pot passes in front of the plant standing in it */}
    <path d="M113 434 A46 13 0 0 0 205 434 L201 452 A41 12 0 0 1 117 452 Z" fill="url(#of-potRim)"/>
    <path d="M113 434 A46 13 0 0 0 205 434" fill="none" stroke="#C98E66" strokeOpacity=".5" strokeWidth="1.6"/>
    <path d="M117 452 A41 12 0 0 0 201 452" fill="none" stroke="#7E4E32" strokeOpacity=".4" strokeWidth="2"/>
    <ellipse cx="159" cy="502" rx="30" ry="6.5" fill="url(#of-occl)"/>
  </g>
</g>

{/* ══════════ 9. THE CLUTTER ══════════
     A hidden-object scene needs innocent things to reject. Every one of
     these has a silhouette people already know — which, after three
     failed attempts at a crisp packet on the beach, is the whole reason
     they read at this size. */}

{/* notebook, closed, elastic round it, pen on top.
     A closed notebook is a block, not a rectangle: what makes it read is
     the stack of pages showing along the two edges you can see, slightly
     proud of the cover. */}
<g transform="rotate(-7 300 592)">
  <path d="M378 570 L446 590 L392 636 L328 620 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  {/* the page block, drawn first so the cover sits on top of it */}
  <path d="M226 566 L378 560 L385 630 L232 636 Z" fill="#E8E2D2"/>
  <path d="M378 560 L385 630 L377 631 L370 561 Z" fill="#C4BCA8"/>
  <g stroke="#B0A894" strokeOpacity=".8" strokeWidth=".9">
    <path d="M231 628 L384 622 M231 631 L384 625 M231 634 L384 628"/>
  </g>
  <path d="M370 561 L377 631" stroke="#FFFDF4" strokeOpacity=".7" strokeWidth="1.6"/>
  {/* cover */}
  <path d="M224 562 L376 556 L382 622 L228 628 Z" fill="#2E4E6E"/>
  <path d="M224 562 L376 556 L377 565 L225 571 Z" fill="#5E8EB6"/>
  <path d="M376 556 L382 622 L373 623 L367 557 Z" fill="#1E3852"/>
  <path d="M224 562 L376 556" fill="none" stroke="#9FC8E4" strokeOpacity=".7" strokeWidth="2"/>
  {/* the elastic, and the dent it presses into the cover */}
  <path d="M348 556 L354 630" stroke="#141E2C" strokeWidth="7"/>
  <path d="M350 556 L356 630" stroke="#E8C87E" strokeOpacity=".5" strokeWidth="1.6"/>
  <path d="M344 556 L350 630" stroke="#1A2E44" strokeOpacity=".6" strokeWidth="2.4"/>
  <g transform="rotate(14 300 588)">
    <path d="M238 584 L346 580 L347 590 L239 594 Z" fill="#24303E"/>
    <path d="M238 584 L346 580 L346 583.5 L238 587.5 Z" fill="#8E9CB2" opacity=".85"/>
    <path d="M346 580 l22 4 l-21 6 Z" fill="#C6D0DC"/>
    <path d="M232 584 l7 0 l1 10 l-7 0 Z" fill="#C4A24E"/>
    <path d="M238 596 L346 592 L347 598 L239 602 Z" fill="#3E3A6E" opacity=".28" filter="url(#of-softSm)"/>
  </g>
  <ellipse cx="302" cy="634" rx="84" ry="8" fill="url(#of-occl)"/>
</g>

{/* a mug that is still full, sitting beside the one that is not */}
<g>
  <ellipse cx="150" cy="700" rx="46" ry="12" fill="#3E3A6E" opacity=".26" filter="url(#of-shadowSoft)"/>
  <path d="M182 692 L266 720 L200 730 L134 708 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  <path d="M186 636 q34 -4 36 22 q2 26 -32 26" fill="none" stroke="#E4EAF2" strokeWidth="12"/>
  <path d="M186 636 q34 -4 36 22" fill="none" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="4"/>
  <path d="M112 622 q38 -9 76 0 l-6 78 q-32 8 -64 0 Z" fill="url(#of-ceramic)"/>
  <path d="M160 624 q16 -1 28 -2 l-6 78 q-10 3 -20 4 Z" fill="#94A0B0" opacity=".5"/>
  <ellipse cx="150" cy="622" rx="38" ry="11" fill="#EEF3F8"/>
  <ellipse cx="150" cy="622" rx="38" ry="11" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.2"/>
  <ellipse cx="150" cy="623" rx="30" ry="8" fill="#5E4632"/>
  <ellipse cx="150" cy="623" rx="30" ry="8" fill="#3E2A1C" opacity=".6"/>
  <ellipse cx="142" cy="620" rx="12" ry="3" fill="#A88056" opacity=".45"/>
  <path d="M112 654 q38 8 76 0 l-1 12 q-37 8 -74 0 Z" fill="#2E6E9E"/>
  <path d="M160 660 q16 -1 27 -3 l-1 12 q-11 2 -25 3 Z" fill="#5E9EC8" opacity=".6"/>
  <g className="of-steam" filter="url(#of-steamSoft)" fill="#FFFFFF">
    <ellipse cx="146" cy="606" rx="10" ry="15" opacity=".5"/>
  </g>
  <g className="of-steam" style={{ animationDuration: "8.3s", animationDelay: "-2.6s" }} filter="url(#of-steamSoft)" fill="#FFFFFF">
    <ellipse cx="158" cy="600" rx="8" ry="13" opacity=".4"/>
  </g>
  <ellipse cx="150" cy="698" rx="34" ry="7" fill="url(#of-occl)"/>
</g>

{/* An apple, somebody's lunch.
     This slot held headphones, then three goes at a stapler, and both
     failed the same test: their identity lives in something subtle — a
     thin band and two lumps in one case, a tapered wedge profile in the
     other — and subtlety is exactly what does not survive at the size
     these objects are actually seen.

     An apple cannot fail that way. It is a sphere with a dimple, a stalk
     and a leaf, it is the only saturated warm mass on a blue-grey mat, so
     it separates on colour as well as shape, and nothing else in the
     scene is remotely like it.

     It also earns its keep as a decoy: a whole apple is not waste. A core
     is. That is a distinction this game is actually about. */}
<g transform="translate(362 828) rotate(-4)">
  <path d="M18 22 L86 42 L26 58 L-30 40 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  <ellipse cx="2" cy="26" rx="27" ry="7" fill="#2E2440" opacity=".4" filter="url(#of-softSm)"/>

  {/* stalk, set into the dimple and leaning out of it */}
  <path d="M1 -16 q3 -14 8 -22" fill="none" stroke="#5E3F24" strokeWidth="5" strokeLinecap="round"/>
  <path d="M1 -16 q3 -14 8 -22" fill="none" stroke="#8A6236" strokeOpacity=".8" strokeWidth="2"/>
  {/* one leaf, which is most of why an apple is unmistakable */}
  <path d="M7 -32 q16 -12 30 -6 q-10 15 -27 11 Z" fill="#5E9E52"/>
  <path d="M7 -32 q16 -12 30 -6 q-6 3 -12 4 q-11 1 -18 2 Z" fill="#84C06E"/>
  <path d="M8 -31 q14 -8 27 -6" fill="none" stroke="#33683E" strokeOpacity=".6" strokeWidth="1.4"/>

  {/* the fruit: shoulders high, a dimple at the top, a lobe underneath */}
  <path d="M0 -17 C 7 -27, 17 -27, 24 -18 C 32 -9, 31 8, 20 19
           C 12 27, 3 29, 0 24 C -3 29, -12 27, -20 19
           C -31 8, -32 -9, -24 -18 C -17 -27, -7 -27, 0 -17 Z" fill="url(#of-appleG)"/>
  {/* the blush of unripe yellow-green that every red apple carries */}
  <path d="M-19 -13 C -12 -22, -2 -22, 2 -15 C 4 -6, -4 4, -14 6 C -22 5, -25 -5, -19 -13 Z"
        fill="#E8C44E" opacity=".32"/>
  {/* skin striations, following the form rather than cutting across it */}
  <g fill="none" stroke="#7E1418" strokeOpacity=".3" strokeWidth="1.6">
    <path d="M-8 -22 q-8 20 -2 44 M8 -22 q9 20 3 44 M-20 -14 q-8 16 -4 30 M19 -13 q8 16 3 30"/>
  </g>
  {/* glossy: one hard specular and one soft one */}
  <ellipse cx="-11" cy="-7" rx="8" ry="11" fill="#FFFFFF" opacity=".5" transform="rotate(-24 -11 -7)"/>
  <ellipse cx="-13" cy="-10" rx="3.4" ry="5" fill="#FFFFFF" opacity=".9" transform="rotate(-24 -13 -10)"/>
  <ellipse cx="14" cy="12" rx="9" ry="6" fill="#FFD6B4" opacity=".14" transform="rotate(28 14 12)"/>
  {/* the dimple it is stalked in */}
  <path d="M-9 -20 q9 6 19 -1" fill="none" stroke="#6E1018" strokeOpacity=".5" strokeWidth="2.6"/>
  <ellipse cx="0" cy="25" rx="21" ry="5" fill="url(#of-occl)"/>
</g>

{/* phone, face up, screen off and reflecting the window */}
<g transform="rotate(-13 566 856)">
  <path d="M616 820 L676 842 L624 894 L570 878 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  <rect x="518" y="810" width="96" height="92" rx="12" fill="#2A3340"/>
  <rect x="521" y="813" width="90" height="86" rx="10" fill="#121A24"/>
  <path d="M521 813 L578 813 L521 870 Z" fill="#9FC4E0" opacity=".38"/>
  <path d="M594 813 L611 813 L611 832 Z" fill="#9FC4E0" opacity=".2"/>
  <rect x="518" y="810" width="96" height="92" rx="12" fill="none" stroke="#8E9AA8" strokeOpacity=".7" strokeWidth="1.8"/>
  <path d="M518 822 L518 856" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2.4"/>
  <ellipse cx="566" cy="900" rx="52" ry="7" fill="url(#of-occl)"/>
</g>

{/* Reading glasses.
     These and the headphones were the same silhouette at this size — two
     rounded shapes joined by an arc — so each now carries something the
     other cannot. The glasses get GLASS: the mat reads straight through
     the lenses, and the frame is a thin wire, not a moulded ring. */}
<g transform="rotate(7 700 578)">
  <path d="M736 590 L792 606 L742 620 L706 606 Z" fill="url(#of-shadow)" filter="url(#of-softSm)" opacity=".5"/>
  {/* the lenses: almost nothing, because that is what glass is */}
  <ellipse cx="676" cy="580" rx="22" ry="14" fill="#DCEAF4" opacity=".28"/>
  <ellipse cx="728" cy="580" rx="22" ry="14" fill="#DCEAF4" opacity=".22"/>
  {/* the reflection that tells you they are glazed and not empty rings */}
  <path d="M662 574 q14 -8 28 -3 q-6 6 -14 7 q-9 1 -14 -4 Z" fill="#FFFFFF" opacity=".75"/>
  <path d="M714 574 q14 -8 28 -3 q-6 6 -14 7 q-9 1 -14 -4 Z" fill="#FFFFFF" opacity=".6"/>
  {/* wire frame, thin */}
  <g fill="none" stroke="#3E4A58" strokeWidth="2.8">
    <ellipse cx="676" cy="580" rx="22" ry="14"/>
    <ellipse cx="728" cy="580" rx="22" ry="14"/>
    <path d="M698 578 q4 -5 8 0"/>
  </g>
  <path d="M750 578 q26 5 34 20" fill="none" stroke="#3E4A58" strokeWidth="2.8" strokeLinecap="round"/>
  <path d="M654 578 q-26 5 -32 20" fill="none" stroke="#3E4A58" strokeWidth="2.8" strokeLinecap="round"/>
  {/* and the two bright points where the wire catches the window */}
  <path d="M660 572 q12 -7 26 -3" fill="none" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="1.4"/>
  <path d="M712 572 q12 -7 26 -3" fill="none" stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="1.4"/>
</g>

{/* mouse, still plugged in.
     Seen from above it is an egg, not an oval: narrow at the far end
     where the cable leaves, widest under the heel of the hand, and split
     down the front by the seam between its two buttons. */}
<g transform="rotate(-6 838 618)">
  <path d="M868 646 L944 668 L884 692 L836 672 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  <path d="M836 580 q-46 -22 -104 -10 q-58 12 -108 2" fill="none" stroke="#2A3340" strokeWidth="6" strokeLinecap="round"/>
  <path d="M836 580 q-46 -22 -104 -10" fill="none" stroke="#9EAAB8" strokeOpacity=".55" strokeWidth="2"/>
  {/* body */}
  <path d="M838 580 C 862 582, 872 600, 871 622 C 870 648, 858 664, 838 664
           C 818 664, 806 648, 805 622 C 804 600, 814 582, 838 580 Z" fill="url(#of-plastic)"/>
  {/* the top face, brightest because the window is above and left */}
  <path d="M838 580 C 862 582, 872 600, 871 620 C 856 610, 820 610, 805 620
           C 804 600, 814 582, 838 580 Z" fill="#8894A4"/>
  <path d="M838 580 C 852 581, 861 588, 866 598 C 850 592, 826 592, 810 598
           C 815 588, 824 581, 838 580 Z" fill="#B4C0CE" opacity=".8"/>
  {/* the seam between the buttons, and the wheel sitting in it */}
  <path d="M838 582 L838 618" stroke="#151C26" strokeWidth="2.6"/>
  <path d="M840 582 L840 618" stroke="#A2AEBC" strokeOpacity=".45" strokeWidth="1"/>
  <rect x="833" y="590" width="10" height="15" rx="5" fill="#141C28"/>
  <rect x="834.5" y="592" width="4" height="11" rx="2" fill="#9EAAB8" opacity=".75"/>
  {/* the waist where the hand grips, and the lit window-side edge */}
  <path d="M806 626 C 818 632, 858 632, 870 626" fill="none" stroke="#151C26" strokeOpacity=".45" strokeWidth="2.4"/>
  <path d="M838 580 C 818 582, 807 600, 806 622" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2.4"/>
  <ellipse cx="838" cy="658" rx="40" ry="7" fill="url(#of-occl)"/>
</g>

{/* a fanned stack of sticky notes */}
<g transform="rotate(6 1074 762)">
  <path d="M1116 776 L1178 798 L1120 818 L1080 800 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
  <path d="M1030 742 l86 -8 l8 48 l-88 8 Z" fill="#C9A43E" transform="rotate(-5 1074 762)"/>
  <path d="M1032 738 l86 -8 l8 48 l-88 8 Z" fill="#E8C457" transform="rotate(-2 1074 760)"/>
  <path d="M1034 734 l86 -8 l8 48 l-88 8 Z" fill="#FFDE73"/>
  <path d="M1034 734 l86 -8" fill="none" stroke="#FFF8DC" strokeOpacity=".9" strokeWidth="2"/>
  <g stroke="#9A7A22" strokeOpacity=".5" strokeWidth="2"><path d="M1044 750 l58 -6 M1046 762 l40 -4"/></g>
  <ellipse cx="1074" cy="784" rx="50" ry="7" fill="url(#of-occl)"/>
</g>

{/* The five clues live in officeClues.tsx — the game has to tap,
     light and remove them.
     10. THE LITTER — the five clues

     Rules all five obey, because this is what separates an object in a
     scene from a sticker on a photo:
       · a cast shadow running down-RIGHT, soft-edged because a window is
         a large source, and violet-blue because sky is what fills it
       · contact occlusion directly underneath, darkest where it touches
       · the top face brightest, since the camera looks down and the light
         comes from above
       · a lit rim on the window side, upper-left
     ══════════════════════════════════════════════════════════════════════ -->











{/* ══════════ 11. FOREGROUND ══════════
     The near edge of the desk, too close to the lens to be in focus, kept
     to the corners so it never covers anything clickable. */}
<g filter="url(#of-fgSoft)" pointerEvents="none">
  <path d="M-40 900 v-44 q140 -20 286 20 q-56 32 -286 24 Z" fill="#6E4A24" opacity=".5"/>
  <path d="M1240 900 v-76 q-124 8 -180 76 Z" fill="#5E3E1E" opacity=".55"/>
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

{/* ══════════ 12. GRADE ══════════ */}
<g pointerEvents="none">
  <rect width="1200" height="900" fill="#FFD89A" opacity=".03" style={{ mixBlendMode: "overlay" }}/>
  <radialGradient id="of-vig" cx=".34" cy=".3" r=".84">
    <stop offset=".5"  stopColor="#1A1430" stopOpacity="0"/>
    <stop offset="1"   stopColor="#181228" stopOpacity=".46"/>
  </radialGradient>
  <rect width="1200" height="900" fill="url(#of-vig)"/>
  <rect width="1200" height="900" filter="url(#of-filmGrain)" opacity=".3" style={{ mixBlendMode: "overlay" }}/>
</g>
  </svg>
  );
};
