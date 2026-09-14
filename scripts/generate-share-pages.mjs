import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputRoot = join(process.cwd(), "dist");
const siteUrl = normaliseSiteUrl(
  process.env.SHARE_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:5173",
);

const levels = [
  [1, "Level 1: The Green & Brown Basics", "Learn to sort recyclables from organic compost. A slow, easy start!"],
  [2, "Level 2: Quickening the Pace", "Same bins, but the items are falling slightly faster. Stay alert!"],
  [3, "Level 3: Hazardous Materials", "A red Hazardous bin is unlocked. Watch out for chemical and battery waste!"],
  [4, "Level 4: Spotting the Tricks", "Lookalikes and trickier items appear. Think twice before dropping!"],
  [5, "Level 5: Enter the E-Waste", "Blue E-waste bin unlocked. Properly route cables, phones, and lightbulbs!"],
  [6, "Level 6: Full Operations", "The grey General Waste bin is unlocked. Can you handle all 5 categories?"],
  [7, "Level 7: The Master Recycler", "High speed, more items, and an 85% accuracy requirement. The ultimate test!"],
  [8, "Level 8: E-Waste & Hazard Rush", "Very fast pace, focused on hazardous and electronic items. Keep your focus sharp!"],
  [9, "Level 9: Organic Compost Jam", "Focused on tricky organic/recyclable lookalikes. Sort carefully!"],
  [10, "Level 10: Eco-Champion Marathon", "All categories unlocked, ultra-fast speeds, and a 90% accuracy requirement."],
];

const modes = [
  ["arcade", "Arcade Mode", "Sort falling waste into the right bins, build combos, and earn stars."],
  ["detective", "Trash Detective", "Scan messy scenes, find hidden waste, and learn where every item belongs."],
  ["trivia", "Yes/No Trivia", "Test your recycling knowledge with quick yes-or-no waste trivia."],
  ["contamination", "Imposter Hunt", "Spot the contaminant hiding in each waste stream before it ruins the batch."],
];

for (const [id, title, description] of levels) {
  await writeSharePage({
    directory: join(outputRoot, "share", "level", String(id)),
    pathname: `/share/level/${id}`,
    queryValue: `level-${id}`,
    title: `${title} | EcoSort`,
    description,
    imagePath: `/share-cards/level-${id}.png`,
    imageAlt: `EcoSort ${title} share card`,
  });
}

for (const [id, title, description] of modes) {
  await writeSharePage({
    directory: join(outputRoot, "share", "mode", id),
    pathname: `/share/mode/${id}`,
    queryValue: `mode-${id}`,
    title: `${title} | EcoSort`,
    description,
    imagePath: `/share-cards/mode-${id}.png`,
    imageAlt: `EcoSort ${title} share card`,
  });
}

async function writeSharePage({ directory, pathname, queryValue, title, description, imagePath, imageAlt }) {
  const shareUrl = `${siteUrl}${pathname}`;
  const imageUrl = `${siteUrl}${imagePath}`;
  const redirectUrl = `/?share=${encodeURIComponent(queryValue)}`;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeShareUrl = escapeHtml(shareUrl);
  const safeImageUrl = escapeHtml(imageUrl);
  const safeImageAlt = escapeHtml(imageAlt);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeShareUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safeShareUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeImageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
    <meta name="twitter:image:alt" content="${safeImageAlt}" />
    <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
  </head>
  <body>
    <main>
      <p>Opening EcoSort…</p>
      <p><a href="${escapeHtml(redirectUrl)}">Open the game</a></p>
    </main>
  </body>
</html>
`;

  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), html, "utf8");
}

function normaliseSiteUrl(value) {
  const withProtocol = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, "");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}
