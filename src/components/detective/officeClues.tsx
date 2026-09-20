import React from "react";

/** The five pieces of litter for the Office case, drawn to the same standard
 *  as the scene: mid-morning daylight from a tall window at the upper left, so
 *  every cast shadow runs down-RIGHT and is soft-edged (a window is a large
 *  source, not a point), shadows are violet-blue because sky is the only thing
 *  filling them, and the top face of everything is its brightest face.
 *
 *  Unlike the other two cases these do not all fit a 200x200 window — the
 *  keyboard alone is 543 scene units wide — so each declares its own box in
 *  OFFICE_CLUE_BOX and the screen sizes the slot from it.
 *
 *  The gradients and filters they reference are defined in OfficeScene's defs,
 *  which is in the same document whenever these are on screen.
 */
export const OFFICE_CLUE_ART: Record<string, React.ReactNode> = {
  o1: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-140 -65 280 130" aria-hidden>
      <g transform="translate(-250,-789)">
  {/* ── o1 · CHARGING CABLE · e-waste ───────────────────────────────────
       A tangle, drawn as one run that crosses back over itself — the
       overlaps are the only thing that makes a cable read as a cable
       rather than as a squiggle. */}

  <g>
    <path d="M296 790 L378 816 L302 838 L240 818 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
    <g fill="none" strokeLinecap="round">
      <path d="M174 772 C 208 726, 296 732, 318 774 C 338 812, 266 830, 238 800" stroke="#151B24" strokeWidth="14"/>
      <path d="M174 772 C 208 726, 296 732, 318 774 C 338 812, 266 830, 238 800" stroke="#EEF2F6" strokeWidth="10"/>
      <path d="M174 772 C 208 726, 296 732, 318 774" stroke="#FFFFFF" strokeWidth="3.4"/>
      <path d="M238 800 C 206 780, 226 744, 266 754 C 308 764, 322 800, 296 818" stroke="#151B24" strokeWidth="14"/>
      <path d="M238 800 C 206 780, 226 744, 266 754 C 308 764, 322 800, 296 818" stroke="#E2E8EE" strokeWidth="10"/>
      <path d="M266 754 C 308 764, 322 800, 296 818" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="3"/>
    </g>
    <g transform="rotate(-20 168 770)">
      <rect x="124" y="760" width="36" height="22" rx="3" fill="url(#of-alu)"/>
      <rect x="124" y="760" width="36" height="7" rx="3" fill="#FFFFFF" opacity=".8"/>
      <rect x="129" y="768" width="26" height="8" rx="1" fill="#26303C"/>
      <rect x="158" y="756" width="24" height="30" rx="5" fill="#F4F7FA"/>
      <rect x="158" y="756" width="24" height="9" rx="4" fill="#FFFFFF"/>
      <rect x="177" y="758" width="5" height="26" rx="2" fill="#9EAAB8" opacity=".6"/>
    </g>
    <g transform="rotate(28 302 822)">
      <rect x="290" y="810" width="28" height="18" rx="5" fill="#F4F7FA"/>
      <rect x="290" y="810" width="28" height="6" rx="3" fill="#FFFFFF"/>
      <rect x="314" y="814" width="10" height="10" rx="2" fill="#AEB8C4"/>
    </g>
    <ellipse cx="250" cy="806" rx="90" ry="10" fill="url(#of-occl)"/>
  </g>

      </g>
    </svg>
  ),
  o2: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-285 -105 570 210" aria-hidden>
      <g transform="translate(-580,-699)">
  {/* ── o2 · BROKEN KEYBOARD · e-waste ──────────────────────────────────
       Built to the scene's own perspective rather than to a guess.

       The mat's two side edges are depth lines on the desk plane, so where
       they meet is where EVERY depth line in this picture meets — that
       works out at (598, -449), well above the frame. The keyboard's sides run
       to it, and so does every gap between key columns and every letter on
       every cap. There is no rotation on it at all, because a keyboard
       sitting square on a desk is square to the desk.

       Each key is a quad, not a rect, and each legend is mapped onto its
       cap's own corners — a rectangle or a level letter inside a converging
       case is exactly what reads as wrong. */}

  <g>
    <path d="M699 736 L835 770 L705 792 L663 758 Z"
          fill="url(#of-shadow)" filter="url(#of-softSm)"/>
    <path d="M342.0 613.0 L722.9 613.0 L739.0 749.0 L309.0 749.0 Z" fill="#8E96A2"/>
    <path d="M342.0 606.0 L722.9 606.0 L739.0 742.0 L309.0 742.0 Z"  fill="#C6CDD6"/>
    <path d="M342.0 606.0 L722.9 606.0 L723.5 611.0 L340.7 611.0 Z" fill="#EDF1F6"/>
    <path d="M345.9 612.0 L718.2 612.0 L732.3 736.0 L316.4 736.0 Z" fill="#9AA2AE"/>
    <path d="M582 606 l9 17 l-13 11 l16 13 l-6 16 l18 9"
          fill="none" stroke="#5E6672" strokeWidth="2.6" strokeLinejoin="round"/>
    <path d="M584 606 l9 17 l-13 11 l16 13 l-6 16 l18 9"
          fill="none" stroke="#E8EDF4" strokeOpacity=".8" strokeWidth="1.1" strokeLinejoin="round"/>
    <path d="M348.2 615.0 L368.9 615.0 L364.8 634.0 L343.8 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M348.2 615.0 L368.9 615.0 L365.6 630.2 L344.7 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M349.1 616.1 L367.5 616.1 L366.3 621.5 L347.9 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0445 0.1900 348.2 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">`</text>
    <path d="M374.5 615.0 L395.1 615.0 L391.5 634.0 L370.5 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M374.5 615.0 L395.1 615.0 L392.2 630.2 L371.3 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M375.4 616.1 L393.8 616.1 L392.7 621.5 L374.3 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0399 0.1900 374.5 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">1</text>
    <path d="M400.7 615.0 L421.4 615.0 L418.2 634.0 L397.2 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M400.7 615.0 L421.4 615.0 L418.8 630.2 L397.9 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M401.6 616.1 L420.0 616.1 L419.1 621.5 L400.7 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0352 0.1900 400.7 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">2</text>
    <path d="M426.9 615.0 L447.6 615.0 L444.9 634.0 L423.9 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M426.9 615.0 L447.6 615.0 L445.4 630.2 L424.5 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M427.9 616.1 L446.3 616.1 L445.5 621.5 L427.0 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0305 0.1900 426.9 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">3</text>
    <path d="M453.2 615.0 L473.8 615.0 L471.6 634.0 L450.6 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M453.2 615.0 L473.8 615.0 L472.1 630.2 L451.1 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M454.2 616.1 L472.5 616.1 L471.9 621.5 L453.4 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0258 0.1900 453.2 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">4</text>
    <path d="M479.4 615.0 L500.1 615.0 L498.3 634.0 L477.3 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M479.4 615.0 L500.1 615.0 L498.7 630.2 L477.7 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M480.4 616.1 L498.8 616.1 L498.3 621.5 L479.8 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0211 0.1900 479.4 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">5</text>
    <path d="M505.6 615.0 L526.3 615.0 L525.0 634.0 L504.0 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M505.6 615.0 L526.3 615.0 L525.3 630.2 L504.3 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M506.7 616.1 L525.1 616.1 L524.7 621.5 L506.2 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0164 0.1900 505.6 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">6</text>
    <path d="M531.9 615.0 L552.5 615.0 L551.7 634.0 L530.7 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M531.9 615.0 L552.5 615.0 L551.9 630.2 L530.9 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M532.9 616.1 L551.3 616.1 L551.1 621.5 L532.6 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0117 0.1900 531.9 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">7</text>
    <path d="M558.1 615.0 L578.7 615.0 L578.4 634.0 L557.4 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M558.1 615.0 L578.7 615.0 L578.5 630.2 L557.5 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M559.2 616.1 L577.6 616.1 L577.5 621.5 L559.0 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 -0.0071 0.1900 558.1 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">8</text>
    <path d="M610.5 615.0 L631.2 615.0 L631.8 634.0 L610.8 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M610.5 615.0 L631.2 615.0 L631.7 630.2 L610.7 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M611.7 616.1 L630.1 616.1 L630.3 621.5 L611.8 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 0.0023 0.1900 610.5 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">0</text>
    <path d="M636.8 615.0 L657.4 615.0 L658.5 634.0 L637.5 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M636.8 615.0 L657.4 615.0 L658.3 630.2 L637.3 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M638.0 616.1 L656.3 616.1 L656.6 621.5 L638.2 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 0.0070 0.1900 636.8 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">-</text>
    <path d="M663.0 615.0 L683.7 615.0 L685.2 634.0 L664.2 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M663.0 615.0 L683.7 615.0 L684.9 630.2 L663.9 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M664.2 616.1 L682.6 616.1 L683.0 621.5 L664.6 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2066 0.0000 0.0117 0.1900 663.0 615.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">=</text>
    <path d="M689.2 615.0 L709.9 615.0 L711.9 634.0 L690.9 634.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M689.2 615.0 L709.9 615.0 L711.5 630.2 L690.6 630.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M690.5 616.1 L708.9 616.1 L709.4 621.5 L691.0 621.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M342.5 639.5 L365.7 639.5 L361.6 658.5 L338.0 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M342.5 639.5 L365.7 639.5 L362.5 654.7 L338.9 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M343.4 640.6 L364.3 640.6 L363.1 646.0 L342.2 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0445 0.1900 342.5 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">Q</text>
    <path d="M371.4 639.5 L394.6 639.5 L391.0 658.5 L367.4 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M371.4 639.5 L394.6 639.5 L391.8 654.7 L368.2 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M372.3 640.6 L393.2 640.6 L392.2 646.0 L371.2 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0395 0.1900 371.4 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">W</text>
    <path d="M400.3 639.5 L423.5 639.5 L420.4 658.5 L396.8 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M400.3 639.5 L423.5 639.5 L421.1 654.7 L397.5 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M401.3 640.6 L422.1 640.6 L421.3 646.0 L400.3 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0344 0.1900 400.3 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">E</text>
    <path d="M429.2 639.5 L452.4 639.5 L449.9 658.5 L426.2 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M429.2 639.5 L452.4 639.5 L450.4 654.7 L426.8 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M430.2 640.6 L451.1 640.6 L450.3 646.0 L429.4 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0294 0.1900 429.2 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">R</text>
    <path d="M487.0 639.5 L510.2 639.5 L508.7 658.5 L485.1 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M487.0 639.5 L510.2 639.5 L509.0 654.7 L485.4 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M488.1 640.6 L508.9 640.6 L508.5 646.0 L487.5 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0193 0.1900 487.0 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">Y</text>
    <path d="M515.9 639.5 L539.1 639.5 L538.1 658.5 L514.5 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M515.9 639.5 L539.1 639.5 L538.3 654.7 L514.7 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M517.0 640.6 L537.9 640.6 L537.6 646.0 L516.6 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0143 0.1900 515.9 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">U</text>
    <path d="M544.8 639.5 L568.0 639.5 L567.5 658.5 L543.9 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M544.8 639.5 L568.0 639.5 L567.6 654.7 L544.0 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M545.9 640.6 L566.8 640.6 L566.6 646.0 L545.7 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0092 0.1900 544.8 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">I</text>
    <path d="M573.7 639.5 L596.9 639.5 L596.9 658.5 L573.3 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M573.7 639.5 L596.9 639.5 L596.9 654.7 L573.4 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M574.8 640.6 L595.7 640.6 L595.7 646.0 L574.7 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 -0.0042 0.1900 573.7 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">O</text>
    <path d="M602.6 639.5 L625.8 639.5 L626.3 658.5 L602.7 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M602.6 639.5 L625.8 639.5 L626.2 654.7 L602.7 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M603.8 640.6 L624.6 640.6 L624.8 646.0 L603.8 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 0.0009 0.1900 602.6 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">P</text>
    <path d="M631.5 639.5 L654.7 639.5 L655.7 658.5 L632.1 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M631.5 639.5 L654.7 639.5 L655.5 654.7 L632.0 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M632.7 640.6 L653.6 640.6 L653.8 646.0 L632.9 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 0.0059 0.1900 631.5 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">[</text>
    <path d="M660.4 639.5 L683.6 639.5 L685.1 658.5 L661.5 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M660.4 639.5 L683.6 639.5 L684.8 654.7 L661.3 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M661.6 640.6 L682.5 640.6 L682.9 646.0 L661.9 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2320 0.0000 0.0110 0.1900 660.4 639.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">]</text>
    <path d="M689.3 639.5 L712.5 639.5 L714.5 658.5 L690.9 658.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M689.3 639.5 L712.5 639.5 L714.1 654.7 L690.6 654.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M690.6 640.6 L711.4 640.6 L712.0 646.0 L691.0 646.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M336.7 664.0 L362.9 664.0 L358.9 683.0 L332.3 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M336.7 664.0 L362.9 664.0 L359.7 679.2 L333.2 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M337.7 665.1 L361.5 665.1 L360.4 670.5 L336.4 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0445 0.1900 336.7 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">A</text>
    <path d="M368.8 664.0 L394.9 664.0 L391.5 683.0 L364.9 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M368.8 664.0 L394.9 664.0 L392.2 679.2 L365.6 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M369.7 665.1 L393.5 665.1 L392.6 670.5 L368.6 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0391 0.1900 368.8 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">S</text>
    <path d="M400.8 664.0 L427.0 664.0 L424.0 683.0 L397.4 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M400.8 664.0 L427.0 664.0 L424.6 679.2 L398.1 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M401.8 665.1 L425.6 665.1 L424.8 670.5 L400.8 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0336 0.1900 400.8 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">D</text>
    <path d="M432.8 664.0 L459.0 664.0 L456.6 683.0 L430.0 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M432.8 664.0 L459.0 664.0 L457.1 679.2 L430.5 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M433.8 665.1 L457.6 665.1 L457.0 670.5 L433.0 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0281 0.1900 432.8 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">F</text>
    <path d="M464.8 664.0 L491.0 664.0 L489.2 683.0 L462.5 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M464.8 664.0 L491.0 664.0 L489.5 679.2 L463.0 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M465.9 665.1 L489.7 665.1 L489.2 670.5 L465.2 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0227 0.1900 464.8 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">G</text>
    <path d="M496.8 664.0 L523.0 664.0 L521.7 683.0 L495.1 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M496.8 664.0 L523.0 664.0 L522.0 679.2 L495.4 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M497.9 665.1 L521.7 665.1 L521.4 670.5 L497.4 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0172 0.1900 496.8 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">H</text>
    <path d="M528.8 664.0 L555.0 664.0 L554.3 683.0 L527.6 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M528.8 664.0 L555.0 664.0 L554.4 679.2 L527.9 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M530.0 665.1 L553.8 665.1 L553.5 670.5 L529.6 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0117 0.1900 528.8 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">J</text>
    <path d="M560.8 664.0 L587.0 664.0 L586.8 683.0 L560.2 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M560.8 664.0 L587.0 664.0 L586.9 679.2 L560.3 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M562.0 665.1 L585.8 665.1 L585.7 670.5 L561.8 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 -0.0063 0.1900 560.8 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">K</text>
    <path d="M624.9 664.0 L651.0 664.0 L652.0 683.0 L625.3 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M624.9 664.0 L651.0 664.0 L651.8 679.2 L625.2 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M626.1 665.1 L649.9 665.1 L650.1 670.5 L626.2 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 0.0046 0.1900 624.9 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">;</text>
    <path d="M656.9 664.0 L683.1 664.0 L684.5 683.0 L657.9 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M656.9 664.0 L683.1 664.0 L684.2 679.2 L657.7 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M658.1 665.1 L681.9 665.1 L682.3 670.5 L658.4 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2619 0.0000 0.0101 0.1900 656.9 664.0)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">'</text>
    <path d="M688.9 664.0 L715.1 664.0 L717.1 683.0 L690.4 683.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M688.9 664.0 L715.1 664.0 L716.7 679.2 L690.1 679.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M690.2 665.1 L714.0 665.1 L714.5 670.5 L690.6 670.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M331.0 688.5 L360.7 688.5 L356.8 707.5 L326.5 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M331.0 688.5 L360.7 688.5 L357.6 703.7 L327.4 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M332.0 689.6 L359.3 689.6 L358.2 695.0 L330.7 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0445 0.1900 331.0 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">Z</text>
    <path d="M366.7 688.5 L396.4 688.5 L393.1 707.5 L362.8 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M366.7 688.5 L396.4 688.5 L393.7 703.7 L363.6 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M367.7 689.6 L395.0 689.6 L394.0 695.0 L366.6 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0386 0.1900 366.7 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">X</text>
    <path d="M402.4 688.5 L432.1 688.5 L429.4 707.5 L399.1 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M402.4 688.5 L432.1 688.5 L429.9 703.7 L399.8 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M403.4 689.6 L430.7 689.6 L429.9 695.0 L402.5 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0326 0.1900 402.4 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">C</text>
    <path d="M438.1 688.5 L467.8 688.5 L465.6 707.5 L435.4 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M438.1 688.5 L467.8 688.5 L466.1 703.7 L435.9 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M439.2 689.6 L466.5 689.6 L465.8 695.0 L438.4 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0267 0.1900 438.1 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">V</text>
    <path d="M473.8 688.5 L503.5 688.5 L501.9 707.5 L471.7 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M473.8 688.5 L503.5 688.5 L502.2 703.7 L472.1 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M474.9 689.6 L502.2 689.6 L501.7 695.0 L474.3 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0207 0.1900 473.8 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">B</text>
    <path d="M509.5 688.5 L539.2 688.5 L538.2 707.5 L508.0 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M509.5 688.5 L539.2 688.5 L538.4 703.7 L508.3 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M510.6 689.6 L537.9 689.6 L537.6 695.0 L510.2 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0147 0.1900 509.5 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">N</text>
    <path d="M545.2 688.5 L574.9 688.5 L574.5 707.5 L544.3 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M545.2 688.5 L574.9 688.5 L574.6 703.7 L544.5 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M546.3 689.6 L573.6 689.6 L573.5 695.0 L546.1 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0088 0.1900 545.2 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">M</text>
    <path d="M580.8 688.5 L610.6 688.5 L610.8 707.5 L580.6 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M580.8 688.5 L610.6 688.5 L610.8 703.7 L580.6 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M582.1 689.6 L609.4 689.6 L609.4 695.0 L582.0 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 -0.0028 0.1900 580.8 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">,</text>
    <path d="M616.5 688.5 L646.3 688.5 L647.1 707.5 L616.9 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M616.5 688.5 L646.3 688.5 L646.9 703.7 L616.8 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M617.8 689.6 L645.1 689.6 L645.3 695.0 L617.9 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 0.0032 0.1900 616.5 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">.</text>
    <path d="M652.2 688.5 L682.0 688.5 L683.4 707.5 L653.1 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M652.2 688.5 L682.0 688.5 L683.1 703.7 L653.0 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M653.5 689.6 L680.8 689.6 L681.2 695.0 L653.8 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <text transform="matrix(0.2974 0.0000 0.0091 0.1900 652.2 688.5)" x="50" y="68" fontSize="44" textAnchor="middle" fill="#7E8794" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">/</text>
    <path d="M687.9 688.5 L717.7 688.5 L719.7 707.5 L689.4 707.5 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M687.9 688.5 L717.7 688.5 L719.3 703.7 L689.1 703.7 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M689.2 689.6 L716.5 689.6 L717.1 695.0 L689.7 695.0 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M325.3 713.0 L370.2 713.0 L366.5 732.0 L320.8 732.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M325.3 713.0 L370.2 713.0 L367.2 728.2 L321.7 728.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M326.3 714.1 L368.7 714.1 L367.6 719.5 L325.0 719.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M376.3 713.0 L421.2 713.0 L418.3 732.0 L372.6 732.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M376.3 713.0 L421.2 713.0 L418.9 728.2 L373.4 728.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M377.3 714.1 L419.8 714.1 L418.9 719.5 L376.3 719.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M427.3 713.0 L472.2 713.0 L470.1 732.0 L424.5 732.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M427.3 713.0 L472.2 713.0 L470.5 728.2 L425.0 728.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M428.4 714.1 L470.8 714.1 L470.2 719.5 L427.6 719.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M478.3 713.0 L573.3 713.0 L572.9 732.0 L476.3 732.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M478.3 713.0 L573.3 713.0 L573.0 728.2 L476.7 728.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M479.4 714.1 L572.0 714.1 L571.9 719.5 L478.9 719.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M579.4 713.0 L624.3 713.0 L624.8 732.0 L579.1 732.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M579.4 713.0 L624.3 713.0 L624.7 728.2 L579.2 728.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M580.6 714.1 L623.1 714.1 L623.2 719.5 L580.6 719.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M630.4 713.0 L675.3 713.0 L676.6 732.0 L630.9 732.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M630.4 713.0 L675.3 713.0 L676.3 728.2 L630.8 728.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M631.7 714.1 L674.1 714.1 L674.5 719.5 L631.9 719.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="M681.4 713.0 L726.3 713.0 L728.4 732.0 L682.8 732.0 Z" fill="#CDD4DD" stroke="#CDD4DD" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M681.4 713.0 L726.3 713.0 L728.0 728.2 L682.5 728.2 Z" fill="#F2F5F9" stroke="#F2F5F9" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M682.7 714.1 L725.2 714.1 L725.8 719.5 L683.1 719.5 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    {/* keys that have popped out, and the sockets they left */}
    <path d="M584.3 615.0 L605.0 615.0 L605.1 634.0 L584.1 634.0 Z" fill="#6E7884" stroke="#6E7884" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M585.8 617.0 L603.5 617.0 L603.5 632.0 L585.7 632.0 Z" fill="#3E4650" stroke="#3E4650" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M585.8 617.0 L603.5 617.0 L603.5 621.5 L585.8 621.5 Z" fill="#2A313A" stroke="#2A313A" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M458.1 639.5 L481.3 639.5 L479.3 658.5 L455.7 658.5 Z" fill="#6E7884" stroke="#6E7884" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M459.4 641.5 L479.5 641.5 L477.9 656.5 L457.5 656.5 Z" fill="#3E4650" stroke="#3E4650" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M459.4 641.5 L479.5 641.5 L479.0 646.0 L458.8 646.0 Z" fill="#2A313A" stroke="#2A313A" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M592.8 664.0 L619.0 664.0 L619.4 683.0 L592.8 683.0 Z" fill="#6E7884" stroke="#6E7884" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M594.5 666.0 L617.5 666.0 L617.7 681.0 L594.4 681.0 Z" fill="#3E4650" stroke="#3E4650" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M594.5 666.0 L617.5 666.0 L617.5 670.5 L594.4 670.5 Z" fill="#2A313A" stroke="#2A313A" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M342.0 606.0 L309.0 742.0" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="2.6"/>
    <path d="M309.0 742.0 L739.0 742.0" stroke="#5E6672" strokeOpacity=".5" strokeWidth="2.4"/>
    <path d="M315.0 749.0 L733.0 749.0" stroke="#3E4650" strokeOpacity=".35" strokeWidth="3"/>
  </g>

  {/* Two keycaps that came off, lying on the mat. They say "broken" more
       plainly than any amount of damage drawn on the keyboard itself, and
       the one lying on its back shows the hollow underside. */}
  <g transform="rotate(24 762 626)">
    <path d="M772 634 L802 644 L776 654 L750 646 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
    <rect x="746" y="614" width="30" height="24" rx="4" fill="#C6CDD6"/>
    <rect x="746" y="614" width="30" height="19" rx="4" fill="#F2F5F9"/>
    <rect x="748" y="616" width="26" height="8" rx="3" fill="#FFFFFF" opacity=".9"/>
    <ellipse cx="761" cy="640" rx="19" ry="4" fill="url(#of-occl)"/>
  </g>
  <g transform="rotate(-14 806 656)">
    <path d="M818 666 L846 676 L820 684 L796 676 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
    <rect x="792" y="646" width="28" height="22" rx="4" fill="#AEB6C0"/>
    <rect x="795" y="649" width="22" height="16" rx="3" fill="#6E7884"/>
    <rect x="802" y="652" width="8" height="10" rx="2" fill="#4A525C"/>
    <path d="M792 646 h28" stroke="#E4E9F0" strokeOpacity=".8" strokeWidth="1.6"/>
    <ellipse cx="806" cy="670" rx="17" ry="4" fill="url(#of-occl)"/>
  </g>

      </g>
    </svg>
  ),
  o3: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-105 -95 210 190" aria-hidden>
      <g transform="translate(-827,-736)">
  {/* ── o3 · BROKEN CERAMIC MUG · general waste ─────────────────────────
       Rebuilt from proportion outward.

       A mug is about as tall as it is wide — roughly 95mm by 80mm — so
       lying on its side its barrel is barely longer than its own diameter.
       Every earlier attempt was nearly twice as long as it was thick, and
       that one number is why it read as a carton and then as a can. Here
       the barrel is 80 long by 68 across.

       The ends read as ellipses because the camera looks down at the desk
       and the mug's axis is turned a little toward it; square to the view
       they would collapse to straight lines and there would be no opening
       to see into. The mouth faces down-left, toward the grounds that came
       out of it.

       Breaks in ceramic are conchoidal — angular, not torn — and the
       fracture face is matte, warm and paler than the glaze, because the
       glaze is a skin over a different material. That contrast is what
       says broken; a dark outline just says drawn. */}

  <g transform="translate(812 722) rotate(-20)">
    {/* cast shadow down-right, and the tight dark line where it touches */}
    <path d="M-30 32 L64 60 L4 82 L-62 54 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
    <ellipse cx="0" cy="33" rx="46" ry="8" fill="#2E2440" opacity=".34" filter="url(#of-softSm)"/>

    {/* handle: a flat strap, so it is wider than it is thick, rooted at two
         points on the barrel and cut off by the barrel's own silhouette */}
    <path d="M2 -30 q1 -22 18 -22 q18 0 17 22" fill="none" stroke="#9EAAB8" strokeWidth="13" strokeLinecap="round"/>
    <path d="M2 -30 q1 -22 18 -22 q18 0 17 22" fill="none" stroke="#EAEFF5" strokeWidth="8" strokeLinecap="round"/>
    <path d="M3 -32 q1 -19 16 -19" fill="none" stroke="#FFFFFF" strokeOpacity=".95" strokeWidth="3"/>

    {/* the closed base, then the barrel over it */}
    <ellipse cx="40" cy="0" rx="15" ry="34" fill="url(#of-mugCyl)"/>
    <path d="M40 -34 a15 34 0 0 1 0 68" fill="#93A0AE" opacity=".5"/>
    <ellipse cx="37" cy="0" rx="9" ry="26" fill="#C2CBD6" opacity=".45"/>
    <rect x="-40" y="-34" width="80" height="68" fill="url(#of-mugCyl)"/>

    {/* glaze band. Both seams are circles round the same tube, so both bow
         the same way — toward the camera, which here is toward the mouth. */}
    <path d="M-16 -34 A15 34 0 0 0 -16 34 L8 34 A15 34 0 0 1 8 -34 Z" fill="#2E6E9E"/>
    <path d="M-16 -34 A15 34 0 0 0 -16 34 L-8 34 A15 34 0 0 1 -8 -34 Z" fill="#7FBEE2" opacity=".32"/>
    <rect x="-40" y="-34" width="80" height="9" fill="#FFFFFF" opacity=".45"/>
    <rect x="-40" y="26" width="80" height="8" fill="#6E5A44" opacity=".2"/>

    {/* THE MOUTH. A rim has thickness — four or five millimetres of it —
         and that pale ring is most of what tells you this is crockery. */}
    <ellipse cx="-40" cy="0" rx="15" ry="34" fill="#E8EDF3"/>
    <ellipse cx="-37" cy="0" rx="11" ry="28" fill="#39434F"/>
    {/* the far inner wall, which faces the window and so is the lit part
         of an otherwise dark interior */}
    <path d="M-37 -28 a11 28 0 0 1 0 56 a6 21 0 0 0 0 -42 Z" fill="#7E8A99"/>
    <path d="M-40 -34 a15 34 0 0 0 0 68" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.6"/>

    {/* THE BREAK. A chunk gone from the rim and on into the wall. Through
         the gap you see the inside of the far wall, which is lighter than
         the interior seen through the mouth. */}
    <path d="M-40 -34 L-2 -34 L-11 -15 L-24 -23 L-31 -7 L-40 -13 Z" fill="#8E9AAA"/>
    <path d="M-40 -34 L-2 -34 L-11 -15 L-24 -23 L-31 -7 L-40 -13 Z" fill="#39434F" opacity=".2"/>
    {/* the shadowed foot of that inner wall, where it curves away */}
    <path d="M-24 -23 L-31 -7 L-40 -13 L-40 -22 Z" fill="#4A5462" opacity=".7"/>
    {/* the fracture face itself: matte, warm, and the brightest edge here */}
    <path d="M-2 -34 L-11 -15 L-24 -23 L-31 -7 L-40 -13" fill="none"
          stroke="url(#of-mugFrac)" strokeWidth="6" strokeLinejoin="round"/>
    {/* the glaze showing as a thin line along the outside of that edge */}
    <path d="M-2 -34 L-11 -15 L-24 -23 L-31 -7 L-40 -13" fill="none"
          stroke="#B6C0CC" strokeOpacity=".75" strokeWidth="1.4" strokeLinejoin="round"/>
    {/* and a crack running on from the corner of it */}
    <path d="M-2 -34 l10 10 l-6 11 l12 8" fill="none" stroke="#9AA4B2" strokeOpacity=".85" strokeWidth="1.7"/>
  </g>

  {/* The two pieces that came out of it. Each shows both materials: a
       glazed face and a matte fractured edge. */}
  <g transform="rotate(26 884 776)">
    <path d="M866 780 l20 10 l30 -8 l-14 -11 Z" fill="#3E3A6E" opacity=".3" filter="url(#of-softSm)"/>
    <path d="M866 776 l28 -11 l12 15 l-26 10 Z" fill="#EDF2F7"/>
    <path d="M866 776 l28 -11 l3 4 l-28 11 Z" fill="#FFFFFF"/>
    <path d="M894 765 l12 15 l-5 2 l-12 -15 Z" fill="url(#of-mugFrac)"/>
  </g>
  <g transform="rotate(-11 786 806)">
    <path d="M774 810 l16 8 l24 -6 l-11 -9 Z" fill="#3E3A6E" opacity=".26" filter="url(#of-softSm)"/>
    <path d="M774 806 l22 -12 l9 13 l-20 11 Z" fill="#E4EAF2"/>
    <path d="M774 806 l22 -12 l2 3 l-22 12 Z" fill="#FFFFFF" opacity=".9"/>
    <path d="M796 794 l9 13 l-4 2 l-9 -13 Z" fill="url(#of-mugFrac)"/>
  </g>

      </g>
    </svg>
  ),
  o4: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-105 -55 210 110" aria-hidden>
      <g transform="translate(-726,-788)">
  {/* ── o4 · COFFEE GROUNDS · organic ───────────────────────────────────
       What came out of the mug. The only piece of litter here that is not a
       manufactured object, which is exactly its lesson — and it is wet, so
       unlike everything else on this desk it has a sheen. */}

  <g>
    <path d="M652 764 q54 -28 122 -10 q58 14 46 42 q-14 30 -90 30 q-74 0 -88 -24 q-10 -20 10 -38 Z"
          fill="#4A3A26" opacity=".4" filter="url(#of-softSm)"/>
    <path d="M668 772 q46 -22 102 -6 q46 12 36 34 q-14 20 -76 20 q-60 0 -72 -18 q-8 -18 10 -30 Z" fill="#5E4227"/>
    <path d="M732 766 q24 4 38 10 q32 10 24 30 q-14 14 -48 17 q14 -32 -14 -57 Z" fill="#7E5A32"/>
    <path d="M668 772 q46 -22 102 -6" fill="none" stroke="#C09660" strokeOpacity=".55" strokeWidth="2.6"/>
    <g fill="#8E6438">
      <circle cx="690" cy="778" r="2.7"/><circle cx="716" cy="770" r="2.3"/><circle cx="746" cy="776" r="2.9"/>
      <circle cx="702" cy="792" r="2.5"/><circle cx="732" cy="788" r="2.1"/><circle cx="762" cy="786" r="2.6"/>
      <circle cx="682" cy="796" r="2.2"/><circle cx="720" cy="804" r="2.8"/><circle cx="754" cy="800" r="2.4"/>
      <circle cx="774" cy="792" r="2.1"/><circle cx="698" cy="808" r="2.3"/><circle cx="736" cy="814" r="2.5"/>
    </g>
    <g fill="#3A2818">
      <circle cx="696" cy="784" r="2.1"/><circle cx="728" cy="778" r="1.9"/><circle cx="758" cy="792" r="2.3"/>
      <circle cx="710" cy="798" r="2"/><circle cx="742" cy="806" r="2.2"/><circle cx="686" cy="788" r="1.8"/>
    </g>
    <ellipse cx="712" cy="776" rx="22" ry="7" fill="#FFF0CC" opacity=".26" transform="rotate(-16 712 776)"/>
    <ellipse cx="748" cy="784" rx="12" ry="4" fill="#FFF6DE" opacity=".18"/>
    <g fill="#5E4227">
      <circle cx="796" cy="812" r="2.5"/><circle cx="808" cy="802" r="1.9"/><circle cx="644" cy="800" r="2.3"/>
      <circle cx="632" cy="786" r="1.8"/><circle cx="782" cy="826" r="2.1"/>
    </g>
  </g>

      </g>
    </svg>
  ),
  o5: (
    <svg className="absolute inset-0 w-full h-full" viewBox="-90 -135 180 270" aria-hidden>
      <g transform="translate(-1122,-623)">
  {/* ── o5 · COMPRESSED AIR DUSTER · hazardous ──────────────────────────
       The aerosol that actually lives on a desk. Pressurised steel: hard
       specular banding down the cylinder, rolled seams top and bottom, and
       the red straw that names it instantly. */}

  <g transform="rotate(3 1086 618)">
    <path d="M1122 690 L1196 716 L1128 740 L1076 718 Z" fill="url(#of-shadow)" filter="url(#of-softSm)"/>
    <path d="M1052 576 h70 v118 q-35 10 -70 0 Z" fill="url(#of-alu)"/>
    <path d="M1052 576 h13 v122 q-7 -2 -13 -4 Z" fill="#FFFFFF" opacity=".6"/>
    <path d="M1108 576 h14 v118 q-7 3 -14 4 Z" fill="#7E8A9A" opacity=".45"/>
    <path d="M1070 576 h7 v120 h-7 Z" fill="#FFFFFF" opacity=".65"/>
    <path d="M1096 576 h5 v119 h-5 Z" fill="#3E4A58" opacity=".3"/>
    <ellipse cx="1087" cy="576" rx="35" ry="10" fill="#C6D0DC"/>
    <ellipse cx="1087" cy="576" rx="35" ry="10" fill="none" stroke="#FFFFFF" strokeOpacity=".85" strokeWidth="2.2"/>
    <ellipse cx="1087" cy="577" rx="27" ry="7" fill="#8E9AA8"/>
    <path d="M1052 694 q35 10 70 0" fill="none" stroke="#4E5A68" strokeOpacity=".55" strokeWidth="3"/>
    <path d="M1052 612 h70 v48 q-35 8 -70 0 Z" fill="#1E5E9E"/>
    <path d="M1052 612 h13 v50 q-7 -1 -13 -2 Z" fill="#5E9ECE" opacity=".6"/>
    <path d="M1052 612 h70" fill="none" stroke="#9FD4F4" strokeOpacity=".7" strokeWidth="2"/>
    <path d="M1087 620 l14 14 l-14 14 l-14 -14 Z" fill="#F6F9FC"/>
    <path d="M1087 626 v10 M1087 640 v3.5" stroke="#C0392B" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M1060 652 h54" stroke="#CFE4F4" strokeOpacity=".75" strokeWidth="3"/>
    <path d="M1070 560 h34 v16 h-34 Z" fill="#6E7A8A"/>
    <path d="M1070 560 h9 v16 h-9 Z" fill="#AEB8C4"/>
    <path d="M1068 548 q19 -9 38 0 q4 8 -2 12 h-34 q-6 -4 -2 -12 Z" fill="#C0392B"/>
    <path d="M1068 548 q19 -9 38 0" fill="none" stroke="#FFA894" strokeOpacity=".8" strokeWidth="2.2"/>
    <path d="M1094 546 q10 2 12 4 q4 8 -2 12 h-10 Z" fill="#8E2418" opacity=".5"/>
    <path d="M1098 546 q14 -32 32 -44" fill="none" stroke="#C0392B" strokeWidth="6.5" strokeLinecap="round"/>
    <path d="M1097 545 q13 -30 30 -42" fill="none" stroke="#FF8A72" strokeOpacity=".65" strokeWidth="2.2"/>
    <ellipse cx="1087" cy="696" rx="38" ry="8" fill="url(#of-occl)"/>
  </g>

      </g>
    </svg>
  ),
};

/** Each clue's slot, in scene units out of the 1200x900 frame. */
export const OFFICE_CLUE_BOX: Record<string, { w: number; h: number }> = {
  o1: { w: 280, h: 130 },
  o2: { w: 570, h: 210 },
  o3: { w: 210, h: 190 },
  o4: { w: 210, h: 110 },
  o5: { w: 180, h: 270 },
};
