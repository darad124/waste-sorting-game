# Waste Sorting Game

An interactive recycling and waste-management game built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Zustand.

Players sort falling waste items into the right bins, unlock harder levels, review mistakes, and learn how to identify recyclable, organic, hazardous, e-waste, and general waste.

## Features

- 10 progressive sorting levels with increasing speed, item count, and accuracy targets
- Five waste categories: recyclable, organic, hazardous, e-waste, and general waste
- Educational review screens after failed attempts
- Encyclopedia for learning about unlocked waste items
- Extra game modes including trivia, trash detective, and contamination hunt
- Local progress persistence for unlocked levels, high scores, encyclopedia items, and sound settings
- Music and sound effects with in-game toggles
- Responsive animated UI powered by Framer Motion

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/    Reusable game UI and gameplay components
  data/          Level definitions and waste item data
  screens/       Main app screens and mini-game modes
  state/         Zustand game store and persistence
  utils/         Audio helpers
public/
  audio/         Background music and sound effects
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Framer Motion
- Lucide React

## Notes

Game progress is stored in the browser with `localStorage`, so progress is device- and browser-specific.

## Sharing

Result screens include a cross-platform share menu for the arcade levels, Trash Detective, Yes/No Trivia, and Imposter Hunt. Each share link has a route-specific 1200×630 PNG card plus Open Graph and Twitter metadata, so social platforms can show the correct game image.

The share pages are generated during the production build. Set the public deployment URL before building so the metadata contains absolute image URLs:

```bash
SHARE_SITE_URL=https://your-domain.example npm run build
```

Vercel's `VERCEL_URL` is used as a fallback when `SHARE_SITE_URL` is not set. The checked-in cards are gameplay screenshots. With the local Vite server running, you can recapture them after changing the gameplay layout by running:

```bash
npm run capture:share-cards
```
