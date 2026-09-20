import React from "react";

/** The five pieces of litter for the Beach case, drawn to the same standard as
 *  the scene: lit into the sun that sits low over the water, so each is rim-lit
 *  on its top-right edge, throws a long violet shadow down-left, and has sand
 *  drifted over an edge somewhere so it sits IN the beach rather than on it.
 *
 *  They live apart from the backdrop because the game has to tap, light and
 *  remove them. Each sits on its own origin inside a 200x200 window of scene
 *  units — the translate below moves it there from where it was authored — so
 *  the screen can drop it at any coordinate and it scales with the frame.
 *
 *  The gradients and filters they reference (bc-occl, bc-foamSoft and the rest)
 *  are defined in BeachScene's defs, which is in the same document whenever
 *  these are on screen.
 */
export const BEACH_CLUE_ART: Record<string, React.ReactNode> = {
  b1: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
      <g transform="translate(-468,-657)">
  {/* ── b1 · PLASTIC BOTTLE · recyclable ────────────────────────────────
       Clear PET, so it does not have a colour so much as a set of edges.
       The sand reads straight through it, and it throws a bright caustic
       instead of a dark shadow. */}
  <g transform="rotate(-6 486 650)">
    {/* a shadow, but a pale one: it is transparent */}
    <path d="M452 662 L396 680 L452 688 L508 670 Z" fill="#3B3E72" opacity=".16" filter="url(#bc-foamSoft)"/>
    {/* the caustic — light focused through the bottle onto the sand */}
    <ellipse cx="470" cy="672" rx="34" ry="7" fill="#FFF6D4" opacity=".5" filter="url(#bc-foamSoft)"/>
    {/* body. Almost no fill; the form is carried entirely by edges. */}
    <path d="M440 640 q-4 -12 10 -13 l54 -2 q12 0 12 11 q0 12 -12 12 l-54 -2 q-12 -1 -10 -6 Z"
          fill="#DFF2F6" opacity=".34"/>
    <path d="M440 640 q-4 -12 10 -13 l54 -2 q12 0 12 11" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2"/>
    <path d="M440 646 q-2 4 10 5 l54 2 q12 0 12 -12" fill="none" stroke="#5F8FA0" strokeOpacity=".55" strokeWidth="1.6"/>
    {/* ribs: the pressure rings round the middle of every water bottle */}
    <g stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="1.6" fill="none">
      <path d="M462 628 q4 10 0 20 M474 627 q4 10 0 21 M486 627 q4 10 0 21"/>
    </g>
    <g stroke="#4E7E90" strokeOpacity=".4" strokeWidth="1.2" fill="none">
      <path d="M465 628 q4 10 0 20 M477 627 q4 10 0 21 M489 627 q4 10 0 21"/>
    </g>
    {/* neck, thread and cap */}
    <path d="M514 630 l10 -1 q6 0 6 6 q0 6 -6 6 l-10 -1 Z" fill="#E6F4F8" opacity=".5"/>
    <path d="M514 630 l10 -1 q6 0 6 6" fill="none" stroke="#FFFFFF" strokeOpacity=".85" strokeWidth="1.6"/>
    <path d="M524 628 l12 -1 q5 0 5 7 q0 7 -5 7 l-12 -1 Z" fill="#2E86C8"/>
    <path d="M524 628 l12 -1 q5 0 5 7" fill="none" stroke="#9BD4F4" strokeOpacity=".85" strokeWidth="1.8"/>
    <g stroke="#1B5C90" strokeOpacity=".6" strokeWidth="1.2">
      <path d="M528 628 v13 M533 628 v13 M538 629 v11"/>
    </g>
    {/* label, sun-bleached and half off */}
    <path d="M458 630 q22 -4 44 0 l0 18 q-22 4 -44 0 Z" fill="#F4F7F2" opacity=".82"/>
    <path d="M458 630 q22 -4 44 0" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="1.6"/>
    <path d="M462 636 q18 -3 36 0 M462 641 q14 -2 28 0" stroke="#7FA8BE" strokeOpacity=".7" strokeWidth="2" fill="none"/>
    <path d="M496 630 q8 6 6 18 q-10 -6 -6 -18 Z" fill="#DCE6E2" opacity=".7"/>
    {/* the specular streak that says "glossy", and the sand it is sunk into */}
    <path d="M448 632 q30 -6 60 -2" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2.6"/>
    <path d="M434 652 q30 10 92 2 q-40 12 -92 -2 Z" fill="#D3AF80"/>
    <path d="M436 651 q30 9 88 2" fill="none" stroke="#FFF2CE" strokeOpacity=".55" strokeWidth="1.8"/>
  </g>
      </g>
    </svg>
  ),
  b2: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
      <g transform="translate(-922,-616)">
  {/* ── b2 · SODA CAN · recyclable ──────────────────────────────────────
       Crushed underfoot. Aluminium at this hour is basically a mirror with
       a dent in it: hard warm highlights, hard cool shadows. */}
  <g transform="rotate(12 940 610)">
    <ellipse cx="940" cy="620" rx="32" ry="6" fill="#3B3E72" opacity=".3" filter="url(#bc-foamSoft)"/>
    <path d="M924 618 L880 632 L926 638 L954 624 Z" fill="#3B3E72" opacity=".22" filter="url(#bc-foamSoft)"/>
    {/* the crushed body: a straight can is a cylinder, a crushed one is a
         set of creased facets, so it is drawn as facets */}
    {/* the fold: the can is bent in the middle, so the two halves point in
         different directions and the crease between them catches the sun */}
    <path d="M910 600 q14 -6 26 -3 l4 12 l-2 10 q-16 2 -26 -4 q-6 -8 -2 -15 Z" fill="#C8CED6"/>
    <path d="M940 597 l22 6 q6 8 -2 14 l-22 2 l2 -10 Z" fill="#DCE3EA"/>
    <path d="M910 600 q14 -6 26 -3 l2 7 q-16 2 -30 0 Z" fill="#E4494A"/>
    <path d="M940 597 l22 6 q2 3 2 5 l-24 1 Z" fill="#C63232"/>
    <path d="M936 594 l6 26 l-4 1 l-4 -26 Z" fill="#FFF6E2" opacity=".9"/>
    <path d="M942 594 l2 26 l-3 0 l-2 -26 Z" fill="#4E5A68" opacity=".55"/>
    <path d="M908 613 q16 6 30 3 l26 -3 q-2 6 -8 7 l-24 4 q-16 2 -26 -4 Z" fill="#5E6B7C" opacity=".75"/>
    {/* the creases */}
    <g stroke="#5E6B7C" strokeOpacity=".6" strokeWidth="1.6" fill="none">
      <path d="M926 596 l-4 20 M944 596 l-2 21 M958 600 l-4 18"/>
    </g>
    <g stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="1.4" fill="none">
      <path d="M928 596 l-4 20 M946 596 l-2 21"/>
    </g>
    {/* the top rim, still round because that end survived */}
    <ellipse cx="910" cy="606" rx="5" ry="10" fill="#9AA6B4"/>
    <ellipse cx="910" cy="606" rx="5" ry="10" fill="none" stroke="#FFF2CE" strokeOpacity=".7" strokeWidth="1.6"/>
    <ellipse cx="911" cy="606" rx="2.6" ry="6" fill="#4E5A68"/>
    {/* hard specular along the top edge: this is the shiniest thing here */}
    <path d="M914 596 q24 -8 48 4" fill="none" stroke="#FFFBEC" strokeOpacity=".95" strokeWidth="2.4"/>
    <path d="M916 618 q22 4 44 -4" fill="none" stroke="#334458" strokeOpacity=".4" strokeWidth="2"/>
    <ellipse cx="940" cy="618" rx="24" ry="4" fill="url(#bc-occl)"/>
  </g>
      </g>
    </svg>
  ),
  b3: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
      <g transform="translate(-581,-571)">
  {/* ── b3 · PAINT CAN · hazardous ──────────────────────────────────────
       Washed up at the tideline, which is exactly how this stuff arrives on
       a beach. Rusted, because it has been in salt water. */}
  <g transform="rotate(-8 586 572)">
    <ellipse cx="586" cy="588" rx="44" ry="8" fill="#3B3E72" opacity=".3" filter="url(#bc-foamSoft)"/>
    <path d="M566 586 L520 602 L570 608 L602 592 Z" fill="#3B3E72" opacity=".22" filter="url(#bc-foamSoft)"/>
    {/* wet sand mirrors it: same shape, flipped, broken up and fading */}
    <path d="M564 588 q22 5 44 0 l-4 14 q-18 4 -36 0 Z" fill="#8E8884" opacity=".2"/>
    <path d="M570 604 q16 4 32 0 l-3 8 q-13 3 -26 0 Z" fill="#8E8884" opacity=".11"/>
    {/* body */}
    <path d="M560 552 q26 -7 52 0 l-4 34 q-22 7 -44 0 Z" fill="#9FA8A4"/>
    <path d="M596 550 q10 1 16 2 l-4 34 q-6 2 -12 3 Z" fill="#D2DAD4" opacity=".8"/>
    <path d="M560 552 q26 -7 52 0" fill="none" stroke="#FFF0CE" strokeOpacity=".7" strokeWidth="2"/>
    {/* rust: blooms from the seams outward, never as an even wash */}
    {/* rust creeps down from the seams in ragged runs; it never sits in
         neat patches, so every edge here is broken */}
    <g fill="#9E4A22">
      <path d="M562 556 q5 6 2 12 q4 6 0 14 q-6 2 -6 -6 q-3 -8 0 -12 q-2 -6 4 -8 Z" opacity=".8"/>
      <path d="M598 560 q6 -1 5 6 q5 5 0 11 q3 7 -4 9 q-6 -4 -4 -11 q-4 -6 -1 -9 q-2 -5 4 -6 Z" opacity=".7"/>
      <path d="M574 578 q7 -3 11 1 q6 -2 8 3 q-9 6 -19 -4 Z" opacity=".6"/>
      <path d="M608 550 q5 1 4 7 q-2 4 -5 1 q-3 -5 1 -8 Z" opacity=".55"/>
    </g>
    <g fill="#5E2A0E" opacity=".5">
      <path d="M563 562 q3 4 1 9 q-4 -3 -3 -9 Z"/>
      <path d="M599 566 q4 3 2 8 q-4 -2 -2 -8 Z"/>
      <path d="M578 580 q6 -2 9 1 q-6 3 -9 -1 Z"/>
    </g>
    {/* and where rust has eaten through, the metal is pitted and dark */}
    <g fill="#3E1C08" opacity=".45">
      <circle cx="566" cy="572" r="1.6"/><circle cx="601" cy="570" r="1.3"/><circle cx="583" cy="582" r="1.2"/>
    </g>
    {/* the rim and the lid, sprung loose */}
    <ellipse cx="586" cy="552" rx="26" ry="7" fill="#7E8885"/>
    <ellipse cx="586" cy="552" rx="26" ry="7" fill="none" stroke="#FFF0CE" strokeOpacity=".6" strokeWidth="1.8"/>
    <ellipse cx="586" cy="553" rx="20" ry="5" fill="#2E3A3C" opacity=".8"/>
    <path d="M572 550 q14 -5 28 0 q-14 4 -28 0 Z" fill="#3E6E3C"/>
    <g transform="rotate(38 622 584)">
      <ellipse cx="622" cy="584" rx="20" ry="6" fill="#8E9894"/>
      <ellipse cx="622" cy="582" rx="20" ry="6" fill="#B4BEB8"/>
      <ellipse cx="622" cy="582" rx="20" ry="6" fill="none" stroke="#FFF0CE" strokeOpacity=".55" strokeWidth="1.6"/>
      <ellipse cx="622" cy="582" rx="11" ry="3" fill="#3E6E3C" opacity=".8"/>
    </g>
    {/* the dribble down the side, dried */}
    <path d="M578 556 q3 12 -1 24 q-5 -12 1 -24 Z" fill="#3E6E3C" opacity=".85"/>
    <path d="M579 557 q2 10 0 18" fill="none" stroke="#7FB864" strokeOpacity=".6" strokeWidth="1.2"/>
    {/* wire handle */}
    <path d="M562 556 q24 -22 48 0" fill="none" stroke="#5E6A68" strokeWidth="2.6"/>
    <path d="M563 554 q23 -20 46 0" fill="none" stroke="#D6E0DC" strokeOpacity=".6" strokeWidth="1.2"/>
    {/* foam has caught around its base */}
    <path d="M556 588 q14 -6 30 -2 q16 -4 30 2 q-14 8 -30 4 q-16 4 -30 -4 Z" fill="#FFFFFF" opacity=".5" filter="url(#bc-foamSoft)"/>
    <ellipse cx="586" cy="586" rx="26" ry="5" fill="url(#bc-occl)"/>
  </g>
      </g>
    </svg>
  ),
  b4: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
      <g transform="translate(-175,-675)">
  {/* ── b4 · FACE MASK · general waste ──────────────────────────────────
       Caught at the foot of the grass, which is where the wind puts them.
       Very light fabric: it drapes over what it lands on rather than lying
       flat, and the sun comes straight through it. */}
  <g transform="rotate(-14 176 668)">
    <ellipse cx="176" cy="682" rx="40" ry="8" fill="#3B3E72" opacity=".26" filter="url(#bc-foamSoft)"/>
    <path d="M158 680 L110 694 L162 700 L196 686 Z" fill="#3B3E72" opacity=".18" filter="url(#bc-foamSoft)"/>
    {/* body, slumped: the lower edge follows the sand, the upper edge lifts */}
    <path d="M142 662 q34 -14 70 -4 q6 10 2 20 q-36 10 -72 0 q-4 -10 0 -16 Z" fill="#6FC3E8"/>
    <path d="M176 656 q20 0 36 2 q6 10 2 20 q-18 5 -38 6 Z" fill="#A8E0F4" opacity=".75"/>
    {/* pleats. Three folds, each a lit crest over a shadowed trough. */}
    <g fill="none" stroke="#2E7FA4" strokeOpacity=".5" strokeWidth="2">
      <path d="M144 666 q34 -10 68 -2 M143 672 q34 -8 70 0 M144 678 q34 -6 68 2"/>
    </g>
    <g fill="none" stroke="#E4F6FF" strokeOpacity=".7" strokeWidth="1.4">
      <path d="M144 664 q34 -10 68 -2 M143 670 q34 -8 70 0 M144 676 q34 -6 68 2"/>
    </g>
    {/* the stiffened edges */}
    <path d="M142 662 q34 -14 70 -4" fill="none" stroke="#FFF4DA" strokeOpacity=".8" strokeWidth="2.4"/>
    <path d="M142 678 q36 10 72 0" fill="none" stroke="#1E6A8C" strokeOpacity=".45" strokeWidth="2.2"/>
    {/* ear loops, one stretched out over the sand, one curled */}
    <path d="M142 664 q-22 2 -26 14 q-2 10 8 12" fill="none" stroke="#DCEEF6" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M142 664 q-22 2 -26 14" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="1"/>
    <path d="M212 660 q20 -4 26 6 q4 8 -6 12" fill="none" stroke="#DCEEF6" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M212 660 q20 -4 26 6" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="1"/>
    {/* the nose wire, the one hard thing in it */}
    <path d="M150 659 q30 -10 58 -3" fill="none" stroke="#9FB4C0" strokeWidth="1.6"/>
    {/* sand has already started to bury the near edge */}
    <path d="M136 680 q40 12 84 -2 q-42 10 -84 2 Z" fill="#D3AF80"/>
    <path d="M138 679 q40 11 80 -2" fill="none" stroke="#FFF2CE" strokeOpacity=".5" strokeWidth="1.6"/>
  </g>
      </g>
    </svg>
  ),
  b5: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" aria-hidden>
      <g transform="translate(-801,-799)">
  {/* ── b5 · POLYSTYRENE CUP · general waste ────────────────────────────
       The chip bag was abandoned after three attempts, and the reason is
       worth writing down: a crumpled foil packet has no canonical
       silhouette. Every one is a different shape, and the things people
       actually recognise a crisp packet by — the branding and the crinkle —
       do not survive at fifty pixels, lying on sand, seen from above.

       Everything in this scene that reads instantly has a fixed, learned
       outline: the bucket, the parasol, the flip-flops. So this is a
       truncated cone, which is about as canonical as a shape gets, and the
       lid lying beside it is a second object that confirms the first — the
       same job the spilled crisps were doing, done by a shape that cannot
       be mistaken for anything else.

       It is also the better lesson. A foam cup is the one piece of litter
       here that most people would put in the recycling. */}

  {/* the drink that went into the sand, which is why the sand is dark */}
  <path d="M796 818 q26 -10 52 -4 q22 6 14 18 q-10 12 -40 10 q-32 -2 -34 -12 q-2 -8 8 -12 Z"
        fill="#8A6636" opacity=".34" filter="url(#bc-foamSoft)"/>
  <path d="M770 832 q16 -6 30 -2 q-14 8 -30 2 Z" fill="#8A6636" opacity=".22" filter="url(#bc-foamSoft)"/>

  <g transform="rotate(-6 830 814)">
    {/* cast shadow: long, violet, running down-left like every other */}
    <path d="M812 812 L742 842 L800 852 L850 822 Z" fill="#3B3E72" opacity=".34" filter="url(#bc-foamSoft)"/>
    <ellipse cx="830" cy="814" rx="30" ry="8" fill="#3B3E72" opacity=".3" filter="url(#bc-foamSoft)"/>

    {/* the wall. The taper is the whole read, so it is generous: the rim
         is half again the width of the base. */}
    <path d="M803 750 L812 810 a18 6 0 0 0 36 0 L857 750 Z" fill="url(#bc-foamCup)"/>
    {/* the sunward third, flat and bright, because foam scatters light */}
    <path d="M841 750 L848 808 a18 6 0 0 0 0 4 L857 750 Z" fill="#FFFEF6" opacity=".85"/>
    {/* and the shaded edge, with the sand bouncing back into it */}
    <path d="M803 750 L812 810 a18 6 0 0 0 6 4 L810 750 Z" fill="#8E948E" opacity=".55"/>
    <path d="M806 790 L813 810 a18 6 0 0 0 5 4 L812 790 Z" fill="#C9B291" opacity=".45"/>

    {/* the mould lines every foam cup has, following the taper */}
    <g fill="none" stroke="#9EA49E" strokeOpacity=".18" strokeWidth="1.1">
      <path d="M807 787 q22 6 44 0"/>
    </g>
    <g fill="none" stroke="#FFFFFF" strokeOpacity=".3" strokeWidth=".9">
      <path d="M807 785 q22 6 44 0"/>
    </g>

    {/* a printed band. Real ones carry one, and it gives the eye a colour
         to catch on a white object standing on pale sand. */}
    <path d="M805 760 q25 8 50 0 l-1.4 11 q-24 8 -47 0 Z" fill="#2F6E9E"/>
    <path d="M843 759 q7 -1 12 -3 l-1.4 11 q-5 2 -11 3 Z" fill="#5FA0CE" opacity=".8"/>
    <path d="M805 760 q25 8 50 0" fill="none" stroke="#9FD0EE" strokeOpacity=".6" strokeWidth="1.2"/>
    <path d="M812 764 q18 5 36 0" fill="none" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="2.2"/>

    {/* foam is pitted, not smooth. A dozen specks is enough to say so. */}
    <g fill="#8E948E" opacity=".22">
      <circle cx="815" cy="776" r="1.1"/><circle cx="827" cy="794" r="1"/><circle cx="840" cy="778" r="1.2"/>
      <circle cx="821" cy="802" r="1"/><circle cx="849" cy="796" r="1.1"/><circle cx="833" cy="770" r="0.9"/>
    </g>
    <g fill="#FFFFFF" opacity=".5">
      <circle cx="818" cy="784" r="1"/><circle cx="836" cy="800" r="1.1"/><circle cx="845" cy="770" r="1"/>
      <circle cx="825" cy="766" r="0.9"/><circle cx="852" cy="786" r="1"/>
    </g>

    {/* ── the rim ──────────────────────────────────────────────────────
         A foam cup's lip is a thick rolled bead, and drawing it is what
         stops the cone reading as a plant pot. */}
    <ellipse cx="830" cy="750" rx="27" ry="9" fill="#E4E6DE"/>
    <ellipse cx="830" cy="752" rx="22.5" ry="7.2" fill="#6E736E"/>
    {/* you look down into it, so the far wall is lit and the near is not */}
    <path d="M807.5 752 a22.5 7.2 0 0 1 45 0 a22.5 7.2 0 0 1 -45 0" fill="#4E534E"/>
    <path d="M810 749 a22.5 7.2 0 0 1 40 -1 a20 6 0 0 0 -40 1 Z" fill="#A8AEA6"/>
    {/* sand has blown into the bottom of it, which is how you know it is
         empty and has been lying here a while */}
    <path d="M810 753 q20 8 40 0 q-4 6 -20 6 q-16 0 -20 -6 Z" fill="#A8845A"/>
    <path d="M812 754 q18 6 36 0" fill="none" stroke="#D9B98C" strokeOpacity=".8" strokeWidth="1.6"/>
    {/* the bead's lit crown, and the shadow it drops inside */}
    <path d="M803.5 750 a27 9 0 0 1 54 0" fill="none" stroke="#FFFEF6" strokeOpacity=".9" strokeWidth="2.6"/>
    <path d="M808 754 a22.5 7.2 0 0 1 44 -2" fill="none" stroke="#3E433E" strokeOpacity=".45" strokeWidth="2"/>

    {/* sand heaped where it has settled into the beach */}
    <path d="M808 812 q22 -7 44 0 q-8 7 -22 7 q-14 0 -22 -7 Z" fill="#C6A070" opacity=".8" filter="url(#bc-foamCrisp)"/>
    <path d="M816 809 q14 -4 28 0" fill="none" stroke="#FFF2CE" strokeOpacity=".4" strokeWidth="1.6"/>
    <path d="M816 817 q14 3 28 0" fill="none" stroke="#8A6636" strokeOpacity=".22" strokeWidth="2.2"/>
    <ellipse cx="830" cy="814" rx="24" ry="5" fill="url(#bc-occl)"/>
  </g>

  {/* ── the lid, face up on the sand where it came off ──────────────────
       The second object that confirms the first. A disc with a sip slot in
       it is not mistakable for anything else on a beach. */}
  <g transform="rotate(14 768 834)">
    <ellipse cx="768" cy="840" rx="27" ry="8" fill="#3B3E72" opacity=".3" filter="url(#bc-foamSoft)"/>
    <path d="M750 836 L714 850 L760 856 L788 842 Z" fill="#3B3E72" opacity=".2" filter="url(#bc-foamSoft)"/>
    {/* the skirt it grips the cup with, seen edge-on */}
    <path d="M743 832 a25 8.5 0 0 0 50 0 v5 a25 8.5 0 0 1 -50 0 Z" fill="#A8ACA6"/>
    <ellipse cx="768" cy="832" rx="25" ry="8.5" fill="url(#bc-foamLid)"/>
    {/* the raised centre, and the ring pressed around it */}
    <ellipse cx="768" cy="831" rx="18" ry="6" fill="none" stroke="#B4B8B2" strokeOpacity=".7" strokeWidth="1.6"/>
    <ellipse cx="768" cy="830" rx="13" ry="4.2" fill="#F4F6EE"/>
    {/* the sip slot: the one detail that names the object */}
    <path d="M776 827 q8 -2 11 1 q-2 4 -11 3 q-4 -2 0 -4 Z" fill="#3E433E"/>
    <path d="M777 826 q7 -1 9 1" fill="none" stroke="#FFFEF6" strokeOpacity=".7" strokeWidth="1"/>
    {/* the sun on its near edge */}
    <path d="M743 832 a25 8.5 0 0 1 50 0" fill="none" stroke="#FFFEF6" strokeOpacity=".85" strokeWidth="2.2"/>
    <path d="M748 836 a25 8.5 0 0 0 40 2" fill="none" stroke="#8E948E" strokeOpacity=".4" strokeWidth="1.6"/>
    {/* sand drifted against it */}
    <path d="M744 838 q24 7 48 -2 q-24 9 -48 2 Z" fill="#C9A273"/>
    <ellipse cx="768" cy="838" rx="22" ry="4" fill="url(#bc-occl)"/>
  </g>
      </g>
    </svg>
  ),
};
