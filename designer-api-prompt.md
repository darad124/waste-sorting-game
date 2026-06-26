# Designer API Prompt: Upgrade Secondary Game Modes

You are redesigning the secondary game modes for a mobile-first recycling education game called EcoSort. The main arcade sorting mode already has the strongest identity, but the other game modes currently feel bland, flat, and low-effort. Your task is to make them feel like crafted mini-games with real scenes, richer environmental storytelling, and stronger moment-to-moment feedback while keeping implementation realistic for a React + Vite + Tailwind CSS mobile web app.

## Product Goal

Make the non-arcade modes feel intentionally designed, visually memorable, and worth tapping into. These modes should not look like generic quiz/cards screens. Each one should feel like a small interactive scene from the world of waste sorting.

## Modes To Improve

1. Trash Detective
   - Current concept: player searches a scene and taps hidden trash items, then assigns each item to the right waste category.
   - Current problem: scene cards and item placement feel basic.
   - Desired direction: turn each round into a detailed scene diorama.
   - Create scene ideas for kitchen cleanup, beach cleanup, office desk, park picnic, bathroom shelf, dorm room, school lunch table, or street corner.
   - Each scene should include environmental props, depth layers, hidden objects, visual clutter, and a clear investigation mood.
   - Items should feel embedded in the scene, not pasted randomly on top.
   - Add discovery feedback: magnifier pulse, item outline after tap, category tray sliding up, small evidence tag, and a satisfying solved-state cleanup.

2. Yes/No Trivia
   - Current concept: three true/false recycling questions.
   - Current problem: it feels like a plain quiz card.
   - Desired direction: make each question feel like a fast visual judgment challenge.
   - Show a large illustrated item or mini scenario behind every question.
   - Use a split “Yes” and “No” decision interface that feels tactile and game-like.
   - Add small animated reactions: stamp marks, flip-card reveal, correct bin highlight, incorrect contamination warning.
   - Keep the flow fast: three questions per round, but make each question visually distinct.
   - Avoid lecture-heavy layouts. Explanation appears after answer as a short fact tag or inspector note.

3. Contamination Hunt
   - Current concept: player finds the one wrong item inside a bin.
   - Current problem: it lacks visual drama and scene context.
   - Desired direction: make it feel like inspecting a real bin, conveyor tray, or sorting station.
   - Each round should have a category-specific container: blue e-waste crate, green recycling bin, brown compost caddy, red hazardous tray, gray general waste bag.
   - Use a top-down or slight isometric layout with items partially overlapping, shadows, and depth.
   - The imposter should be findable but not too obvious.
   - Add feedback: valid items wobble gently when tapped wrong, imposter pops forward, bin glows, contamination meter clears, and the next round slides in.

## Visual Direction

- Mobile-first, portrait orientation.
- Keep the existing bright, playful EcoSort tone, but add more craft and specificity.
- Use rich illustrated scenes, layered props, tactile shadows, and clear touch targets.
- Avoid generic floating cards as the main visual solution.
- Avoid empty gradients, random blobs, and bland icon grids.
- Cards are allowed for results, explanations, and compact repeated options, but the active game area should feel like a scene or tool surface.
- Use category colors consistently:
  - Recyclable: green
  - Organic: brown/compost amber
  - Hazardous: red/rose
  - E-waste: blue
  - General waste: gray
- Keep all text short enough for mobile. No long paragraphs in the play state.

## Interaction And Feel

- Every tap should have feedback: scale, pulse, sound cue suggestion, tiny particle, shake, or outline.
- The user should always understand what changed after a tap.
- Use motion sparingly but meaningfully: sliding trays, stamp reveals, cleanup sweep, item pop, bin glow.
- The game should feel playful and polished, not childish or noisy.
- Keep the cognitive load simple: one clear task per screen.

## Deliverables

Produce a practical design plan for implementation, including:

1. A redesigned flow for each mode.
2. Scene concepts for each mode, including props, backgrounds, item placement, and feedback states.
3. A mobile screen layout plan for:
   - Start/select state
   - Active play state
   - Correct feedback
   - Wrong feedback
   - Results state
4. A prioritized implementation list: what to build first for the biggest quality lift.
5. Sound-effect notes for each interaction, but no music direction.

## Constraints

- Must be feasible in React + Vite + Tailwind CSS.
- Can use SVG/HTML/CSS illustration layers and existing waste item SVG components.
- Should not require complex 3D or heavy assets.
- Should preserve the existing game modes:
  - Trash Detective
  - Yes/No Trivia
  - Contamination Hunt
- Keep rounds short:
  - Trivia: 3 questions.
  - Contamination Hunt: 5 rounds.
  - Trash Detective: one scene at a time with a focused set of hidden items.

## Quality Bar

Do not simply make the current screens prettier. Reimagine the play space so each mode has a clear visual fantasy:

- Trash Detective should feel like scanning a messy real-world scene.
- Yes/No Trivia should feel like a fast recycling judgment game, not a classroom quiz.
- Contamination Hunt should feel like inspecting a real contaminated bin or sorting station.

The final recommendation should make the product designer confident about which flow and scene direction to choose before implementation.
