/* Inline items.js + decay.js into a self-contained index.html.
 *
 * The libraries are the source of truth and port straight to
 * src/components/outlast/ later. This exists only because the preview pane
 * serves a local file as a data: URL, which cannot fetch a sibling module.
 *
 *   node tools/outlast/build.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const strip = (s) => s.replace(/^export /gm, "");

const items = strip(await readFile(join(here, "items.js"), "utf8"));
const decay = strip(await readFile(join(here, "decay.js"), "utf8"));
const shell = await readFile(join(here, "shell.html"), "utf8");
const harness = await readFile(join(here, "harness.js"), "utf8");

const out = shell.replace(
  "/*__LIB__*/",
  [items, decay, harness].join("\n\n/* ---------------------------------- */\n\n"),
);
await writeFile(join(here, "index.html"), out);
console.log(`wrote index.html  (${(out.length / 1024).toFixed(1)} KB)`);
