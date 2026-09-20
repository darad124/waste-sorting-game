import { spawn } from "node:child_process";
import { mkdir, unlink } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const chromePath = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const baseUrl = process.env.GAME_URL || "http://127.0.0.1:5173";
const outputDirectory = join(process.cwd(), "public", "share-cards");
const browserTempRoot = join(tmpdir(), "ecosort-share-card-captures");

const targets = [
  ...Array.from({ length: 10 }, (_, index) => `level-${index + 1}`),
  "mode-arcade",
  "mode-detective",
  "mode-trivia",
  "mode-contamination",
];

// Targets with a purpose-made poster in src/components/ShareCard.tsx. The
// rest are captured from live gameplay, which is the right card for a mode
// whose screen IS the picture — but Trash Detective's screen is a menu, and
// a photograph of a menu tells a stranger nothing about the game.
const posterTargets = new Set(["mode-detective"]);
const urlFor = (target) =>
  posterTargets.has(target) ? `${baseUrl}/?card=${target}` : `${baseUrl}/?share=${target}`;

await mkdir(outputDirectory, { recursive: true });

for (const target of targets) {
  const outputPath = join(outputDirectory, `${target}.png`);
  const profilePath = join(browserTempRoot, target);
  await removeExistingScreenshot(outputPath);
  const browser = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-sync",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profilePath}`,
      "--window-size=1200,630",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=6000",
      `--screenshot=${outputPath}`,
      urlFor(target),
    ],
    { stdio: "ignore" },
  );

  await waitForScreenshot(outputPath, 10000);
  browser.kill("SIGTERM");
  console.log(`Captured ${target}`);
}

async function waitForScreenshot(path, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (existsSync(path) && statSync(path).size > 0) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Chrome did not create ${path} within ${timeoutMs}ms`);
}

async function removeExistingScreenshot(path) {
  try {
    await unlink(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
