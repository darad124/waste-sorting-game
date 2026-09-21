/* ====================================================================== *
 *  Outlast — the words.
 *
 *  House rules for anything written here:
 *
 *    Short. Two sentences at most, and the second one is the sting.
 *    Never restate the number the clock has just shown. It got there first.
 *    Dry, not cute. No exclamation marks, no "Wow!", no lecturing.
 *    Contractions. "It is not a paper cup" is a manual; "It's not a paper
 *      cup" is a person. This is the single thing that made the first draft
 *      read like documentation.
 *    Say the surprising thing FIRST and explain it after, not the reverse.
 *    STATE THE CONDITION. "Back on a shelf within weeks" is not a fact about
 *      an aluminium can, it is a fact about a RECYCLED aluminium can, and
 *      leaving the "if you recycle it" out turns the whole line into a
 *      claim that a can magically renews itself. Anything that only holds
 *      under a condition has to carry it.
 *
 *  The test for a line is whether somebody would repeat it to another person
 *  an hour later. If it would not survive that, it is not finished.
 * ====================================================================== */

/** Shown once, under the clock, on the very first pair of a run. */
export const OUTLAST_CONDITIONS =
  "Times are for open ground. Sealed in landfill with no air, most of this lasts far longer.";

/** The smallest gap, in powers of ten, a pair is allowed to have.
 *
 *  Published decomposition figures disagree with each other — sometimes
 *  wildly, because conditions change everything. The ranking of two things an
 *  order of magnitude apart does not. No round here turns on a number anybody
 *  argues about. */
export const OUTLAST_MIN_GAP = 1.2;

/** Pairs allowed through regardless of the gap, because their ordering is
 *  materials science rather than a decomposition estimate.
 *
 *  Steel against aluminium is 0.6 of a decade and the gap rule throws it out,
 *  but nobody disputes the direction: steel rusts through and aluminium
 *  passivates under its own oxide. It is also one of the best things the mode
 *  can teach, and the two objects look almost identical on the shelf. */
export const OUTLAST_ALWAYS_PAIR: [string, string][] = [
  ["aluminium_can", "tin_can"],
];

/** One line per object. */
export const ITEM_FACTS: Record<string, string> = {
  paper_bag:
    "Paper is wood fibre, and water both holds it together and takes it apart. One wet night in a gutter and it's already going.",
  newspaper:
    "Paper fibres get shorter every time round. After five or six goes there's nothing left long enough to make anything from.",
  cardboard_box:
    "It's mostly air between two sheets, so water gets straight in and the whole thing collapses. Grease is worse: oil never comes back out of paper fibre.",
  egg_carton:
    "Already made from recycled paper. Those fibres are too short to go again — this is where they stop.",
  banana_peel:
    "People drop these because they're natural. On a cold verge a peel can sit there, whole and yellow, for most of a year.",
  apple_core:
    "In a hedge it's compost. In a bin bag it rots without air and makes methane instead.",
  orange_peel:
    "The oil in the rind is antimicrobial — it's fighting off the very things that would rot it. That's why peel outlasts almost anything else from a fruit bowl.",
  cotton_shirt:
    "The cotton rots. The polyester it's blended with doesn't, and the label is the only way to know which you've got.",
  wool_sock:
    "Wool is keratin, the same protein as your hair, and soil bacteria digest it the same way. Blend it with nylon for durability, as most socks are, and that half stays.",
  wooden_chopsticks:
    "Bare wood composts like a twig. Lacquered ones are sealed under varnish, and the wood can't start rotting until that's worn through.",
  cigarette_butt:
    "That filter isn't cotton. It's plastic, and everything it caught on the way in washes back out of it in the rain.",
  plastic_bag:
    "Put one in the recycling bin and it wraps itself round the sorting machinery. Most plants have to stop the line and cut them out by hand.",
  coffee_cup:
    "It's not a paper cup. It's a plastic cup with paper round it, and only a handful of mills anywhere can split the two apart.",
  tin_can:
    "Steel is the one thing in the recycling bin that sorts itself. A magnet lifts it straight out of the stream, so almost none of it gets missed.",
  battery:
    "As the case corrodes, everything inside it comes out into the ground. Which is why it never goes in the normal bin, however small it is.",
  plastic_straw:
    "Almost none get recycled, wherever you put them. They're too light for the sorting machines to grab and small enough to fall straight through the screens.",
  aluminium_can:
    "Recycle it and it's back on a shelf within weeks, on about a twentieth of the energy it takes to make one from ore. Nothing else here comes back that fast.",
  aluminium_foil:
    "Scrunch it. If it holds the ball it's foil and it's recyclable; if it springs back it's a plastic-coated wrapper and it isn't.",
  plastic_bottle:
    "PET is one of the few plastics genuinely recycled at scale — into new bottles, not just park benches. The catch is that the bottle has to reach a bin first.",
  face_mask:
    "The middle layer is melt-blown plastic thread, finer than a hair. It doesn't have to break down into microplastic — it was made that way.",
  disposable_nappy:
    "About half of each one is plastic, bonded to the pulp and gel so tightly that nothing separates them again. That's why almost nowhere will take them.",
  foam_cup:
    "These are one of the few things that essentially never get recycled. They're about 95% air, so a lorry-load weighs almost nothing and isn't worth the diesel to move it.",
  toothbrush:
    "Every toothbrush you've ever owned is still somewhere on this planet.",
  glass_bottle:
    "Recycle it and it comes back as glass, as many times as you like. Leave it and it just waits.",
  glass_jar:
    "Sand, soda ash and lime. Nothing rots, nothing leaches, nothing changes.",
};

/** Some pairs are better than either item's own line. Keyed by the two ids
 *  sorted and joined, so which side they land on does not matter. */
const PAIR_NOTES: Record<string, string> = {
  "cigarette_butt|paper_bag":
    "The bag is exactly what it looks like. The filter isn't — it's plastic, not cotton.",
  "coffee_cup|newspaper":
    "Both of these look like paper. Only one of them is.",
  "aluminium_can|tin_can":
    "Two cans, two metals. Steel rusts right through; aluminium seals itself under its own oxide and just sits there.",
  "glass_bottle|plastic_bottle":
    "One of these is made from sand, the other from oil. That's the whole difference in what happens next.",
  "banana_peel|glass_bottle":
    "Both were made from things dug out of the ground. Only one of them is going back.",
  "cigarette_butt|newspaper":
    "Both are mostly fibre. One is wood pulp, the other is plastic thread spun to look like cotton wool.",
  "foam_cup|paper_bag":
    "One started as a tree, the other as crude oil. Only one of those has a way of going back.",
  "apple_core|plastic_straw":
    "Both were in your hand for about a minute. Only one of them leaves.",
  "aluminium_foil|cardboard_box":
    "Both wrapped somebody's lunch. One of them is compost by spring.",
  "battery|banana_peel":
    "The peel has three or four right answers. The battery has one, and in most places it isn't a bin at your house at all.",
  "toothbrush|newspaper":
    "Both are designed to be thrown away within months. Only one of them is built like it.",
  "glass_jar|orange_peel":
    "The peel feeds the soil. The jar just sits in it.",
  "disposable_nappy|egg_carton":
    "Both went out with this morning's rubbish. Only one of them turns back into soil.",
  "face_mask|apple_core":
    "An hour of use each. One came off a tree and goes back into the ground; the other came out of a barrel of oil and doesn't.",
};

export interface OutlastNote {
  text: string;
  /** Which object the line is about, or null when it is about the pair.
   *
   *  This is not decoration. The lines are written like headlines — "Back on
   *  a shelf within weeks, for a fraction of the energy" — and a headline
   *  with no subject is just a floating claim. The card has to say WHICH
   *  thing, and stuffing the name into every sentence would flatten all of
   *  them. So the subject sits in the kicker and the line keeps its punch. */
  subjectId: string | null;
}

/** The line to show once a pair has finished racing. `longerId` is whichever
 *  of the two lasts longer — the caller knows, and it matters, because with no
 *  bespoke line for the pair we fall back to that item's fact. The long-lived
 *  side is the one people underestimate, so that is where the surprise is. */
export function noteFor(a: string, b: string, longerId: string): OutlastNote {
  const key = [a, b].sort().join("|");
  const pair = PAIR_NOTES[key];
  if (pair) return { text: pair, subjectId: null };

  // Falling back to the longer-lived item every time looked right and was
  // quietly broken: a valid pair needs a 1.2-decade gap, so nothing under
  // about 1.3 years can EVER be the longer side. Eight of the twenty-five
  // facts — every paper and most organics — could never be shown to anybody.
  // Still biased towards the long side, because that is the one people
  // underestimate, but the short side now gets a turn.
  const shorter = longerId === a ? b : a;
  const pick = Math.random() < 0.62 ? longerId : shorter;
  return { text: ITEM_FACTS[pick] ?? "", subjectId: pick };
}

/** What to say when a run ends. The player has just lost; this is the last
 *  thing they read before deciding whether to go again, so it does not
 *  congratulate them for nothing and it never scolds. */
export function runSummary(streak: number): string {
  if (streak === 0) return "Rough start. That first one catches nearly everybody.";
  if (streak === 1) return "One. They're not as obvious as they look.";
  if (streak < 4) return "Harder than it looks, isn't it.";
  if (streak < 8) return "A decent run.";
  if (streak < 14) return "You clearly know your rubbish.";
  if (streak < 25) return "That's a serious run.";
  return "That's a proper run.";
}
