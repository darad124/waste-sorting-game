/* Every mode hands ids to unlockEncyclopediaItem(). Nothing validates them:
 * an id that does not match a Fact Book entry is stored happily and simply
 * never unlocks a card, and it still counts towards the "Fact Book %" on the
 * home screen. That failure is completely silent, which is how Trivia shipped
 * carrying a correct itemId on all twenty questions and never calling unlock,
 * and how Outlast shipped with seventeen of twenty-five ids unknown here.
 *
 * Run: npm run check:factbook
 */
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const uniq = (a) => [...new Set(a)];
const all = (src, re) => [...src.matchAll(re)].map((m) => m[1]);

const factBook = all(read("src/data/wasteItems.ts"), /^    id: "([^"]+)"/gm);
const known = new Set(factBook);

const aliasSrc = read("src/data/outlast.ts").split("const FACT_BOOK_ALIAS")[1].split("};")[0];
const alias = Object.fromEntries(
  [...aliasSrc.matchAll(/(\w+):\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]),
);

const sources = {
  Arcade: factBook, // draws from WASTE_ITEMS itself, so it is correct by construction
  Trivia: uniq(all(read("src/screens/TriviaScreen.tsx"), /itemId: "([^"]+)"/g)),
  Detective: uniq(all(read("src/components/detective/cases.tsx"), /itemId: "([^"]+)"/g)),
  Outlast: uniq(
    all(read("src/components/outlast/items.ts"), /^  ([a-z_]+): \{$/gm).map((id) => alias[id] ?? id),
  ),
};

let failed = false;
console.log(`Fact Book: ${factBook.length} entries\n`);

for (const [mode, ids] of Object.entries(sources)) {
  const bad = ids.filter((id) => !known.has(id));
  const pct = Math.round((ids.length / factBook.length) * 100);
  console.log(`${mode.padEnd(10)} ${String(ids.length).padStart(2)} ids  (${pct}% of the book)`);
  if (bad.length) {
    failed = true;
    console.log(`  ✗ not in the Fact Book: ${bad.join(", ")}`);
  }
}

const reachable = new Set(Object.values(sources).flat());
const orphans = factBook.filter((id) => !reachable.has(id));
console.log(`\nEntries reachable from at least one mode: ${factBook.length - orphans.length}/${factBook.length}`);
if (orphans.length) console.log(`Arcade-only: ${orphans.join(", ")}`);

// Duplicate ids in the Fact Book would make the percentage lie.
const dupes = factBook.filter((id, i) => factBook.indexOf(id) !== i);
if (dupes.length) {
  failed = true;
  console.log(`\n✗ duplicate Fact Book ids: ${uniq(dupes).join(", ")}`);
}

if (failed) {
  console.error("\ncheck:factbook FAILED");
  process.exit(1);
}
console.log("\ncheck:factbook OK");
