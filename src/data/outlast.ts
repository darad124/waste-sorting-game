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

/** One line per object. */
export const ITEM_FACTS: Record<string, string> = {
  paper_bag:
    "Gone in a month — but it cost more water and energy to make than a plastic bag did. It only wins if you reuse it.",
  newspaper:
    "Paper fibres get shorter every time round. After five or six goes there's nothing left long enough to make anything from.",
  cardboard_box:
    "The most recycled packaging there is. Get it wet or greasy and it's worth precisely nothing.",
  egg_carton:
    "Already made from recycled paper. Those fibres are too short to go again — this is where they stop.",
  banana_peel:
    "Weeks in the open. Sealed in a bin bag with no air, still recognisable years later.",
  apple_core:
    "In a hedge it's compost. In a bin bag it rots without air and makes methane instead.",
  orange_peel:
    "That smell is d-limonene — a solvent strong enough that people sell it as a cleaning product.",
  cotton_shirt:
    "The cotton rots. The polyester it's blended with doesn't, and almost every T-shirt is blended.",
  wool_sock:
    "Wool is basically hair, and soil bacteria treat it exactly that way. It's also why moths bother.",
  wooden_chopsticks:
    "Tens of billions of pairs a year. Plain wood composts. Lacquered ones are coated, and don't.",
  cigarette_butt:
    "That filter isn't cotton. It's plastic — and it's the most littered object on Earth.",
  plastic_bag:
    "It doesn't rot. Sunlight makes it brittle and it shatters into pieces too small to pick up.",
  coffee_cup:
    "It's not a paper cup. It's a plastic cup with paper round it, and almost no mill can separate the two.",
  tin_can:
    "A magnet lifts it straight out of the mix — the easiest thing in the entire stream to sort.",
  battery:
    "As the case corrodes, everything inside it comes out. Never the normal bin, however small it is.",
  plastic_straw:
    "Too light for the sorters to catch, too small for the screens to hold. Barely any get recycled, wherever you put them.",
  aluminium_can:
    "Back on a shelf within weeks, for a fraction of the energy it takes to make a new one from ore.",
  aluminium_foil:
    "Aluminium doesn't rust — it seals itself under its own oxide. Clean foil is worth recycling. Greasy foil isn't.",
  plastic_bottle:
    "One of the few plastics genuinely recycled at scale. Most of it still isn't.",
  face_mask:
    "Three layers of polypropylene, worn for an hour. Billions got thrown away and every one is still here.",
  disposable_nappy:
    "Half plastic by weight, and one child gets through several thousand of them.",
  foam_cup:
    "Almost entirely air, which is the problem — a full lorry of them is worth less than the journey.",
  toothbrush:
    "Every toothbrush you've ever owned is still somewhere on this planet.",
  glass_bottle:
    "Recycles forever with no loss at all. Left alone, it just waits.",
  glass_jar:
    "Sand, soda ash and lime. Nothing rots, nothing leaches, nothing changes.",
};

/** Some pairs are better than either item's own line. Keyed by the two ids
 *  sorted and joined, so which side they land on does not matter. */
const PAIR_NOTES: Record<string, string> = {
  "cigarette_butt|paper_bag":
    "Most people get this one backwards. The bag is paper. The filter is plastic.",
  "coffee_cup|newspaper":
    "Both of these look like paper. Only one of them is.",
  "aluminium_can|tin_can":
    "Two cans, two metals. Steel gets eaten right through. Aluminium seals itself and just sits there.",
  "glass_bottle|plastic_bottle":
    "One of them is still whole. The other is still here too — just in pieces too small to see.",
  "banana_peel|glass_bottle":
    "Weeks against forever.",
  "cigarette_butt|newspaper":
    "The paper's long gone before the filter has even started.",
  "foam_cup|paper_bag":
    "Same drink, same ten minutes, five centuries apart.",
  "apple_core|plastic_straw":
    "Both were in your hand for about a minute. Only one of them leaves.",
  "aluminium_foil|cardboard_box":
    "Both wrapped somebody's lunch. One of them is compost by spring.",
  "battery|banana_peel":
    "These share a bin more than anything else on this list. One of them ruins the other.",
  "toothbrush|newspaper":
    "You replace one every three months. It outlives the paper by five hundred years.",
  "glass_jar|orange_peel":
    "The peel feeds the soil. The jar just sits in it.",
  "disposable_nappy|egg_carton":
    "Both went out with this morning's rubbish. Only one is coming back as anything.",
  "face_mask|apple_core":
    "An hour of use each. One's soil by summer, the other's still here in four centuries.",
};

/** The line to show once a pair has finished racing. `longerId` is whichever
 *  of the two lasts longer — the caller knows, and it matters, because when
 *  there is no bespoke line for the pair we fall back to that item's fact.
 *  The long-lived side is the one people underestimate, so that is where the
 *  surprise lives. */
export function noteFor(a: string, b: string, longerId: string): string {
  const key = [a, b].sort().join("|");
  return PAIR_NOTES[key] ?? ITEM_FACTS[longerId] ?? "";
}

/** What to say when a run ends. The player has just lost; this is the last
 *  thing they read before deciding whether to go again, so it does not
 *  congratulate them for nothing and it never scolds. */
export function runSummary(streak: number): string {
  if (streak === 0) return "Rough start. That first one catches nearly everybody.";
  if (streak === 1) return "One. It's harder than it looks.";
  if (streak < 4) return "Harder than it looks, isn't it.";
  if (streak < 8) return "A decent run.";
  if (streak < 14) return "You clearly know your rubbish.";
  if (streak < 25) return "That's a serious run.";
  return "Genuinely impressive.";
}
