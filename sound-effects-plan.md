# Waste Sorting Game Sound Effects Plan

## Goal

Improve the game feel by replacing most synthetic beeps with short, polished sound effects generated locally, then shipped as normal game assets.

The sound should make the game feel:

- Tactile
- Clean
- Playful
- Fast
- Encouraging
- Not noisy or annoying after repeated play

Music is handled separately. This plan is only for sound effects.

## Generation Setup

Use the downloaded local model:

```text
/Users/dara/Documents/projects/audio-models/MOSS-SoundEffect-MLX-4bit
```

Generated files should be exported as short `.wav` files, reviewed, trimmed if needed, then added to:

```text
public/audio/sfx/
```

The app should play these files locally. It should not generate sound effects during gameplay.

## Sound Style

Overall direction:

```text
Playful mobile game sound effects for a recycling sorting game. Clean, short, tactile, bright but not childish, satisfying but not loud, suitable for repeated gameplay.
```

Avoid:

- Harsh alarms
- Long sounds
- Heavy cinematic impacts
- Annoying cartoon boings
- Realistic gross trash sounds
- Loud negative feedback

## Required SFX Pack

### 1. Item Spawn

When a new waste item appears.

File:

```text
item-spawn.wav
```

Prompt:

```text
Short soft pop sound for a mobile recycling game item appearing on screen, clean, light, playful, 0.3 seconds, no music, no voice.
```

### 2. Drag Pickup

When player starts dragging an item.

File:

```text
drag-pickup.wav
```

Prompt:

```text
Tiny tactile pickup sound for grabbing a small object in a mobile game, soft click with light air movement, clean and playful, 0.2 seconds, no music, no voice.
```

### 3. Neutral Drop

When item is released outside a bin.

File:

```text
neutral-drop.wav
```

Prompt:

```text
Small soft object drop sound for a mobile game, gentle tap, neutral feedback, not negative, clean and short, 0.25 seconds, no music, no voice.
```

### 4. Correct Sort

When item goes into the right bin.

File:

```text
correct-sort.wav
```

Prompt:

```text
Satisfying correct answer sound for a recycling mobile game, soft pop with bright tiny chime, positive and clean, 0.5 seconds, no music, no voice.
```

### 5. Wrong Sort

When item goes into the wrong bin.

File:

```text
wrong-sort.wav
```

Prompt:

```text
Gentle wrong answer sound for a mobile game, muted soft thud with tiny dull tap, non-punishing, friendly, 0.4 seconds, no alarm, no voice, no music.
```

### 6. Missed Item

When item falls past the bins.

File:

```text
missed-item.wav
```

Prompt:

```text
Soft missed item sound for a recycling mobile game, light downward whoosh ending in a muted tap, friendly and non-punishing, 0.5 seconds, no voice, no music.
```

### 7. Streak

When player reaches a sorting streak.

File:

```text
streak.wav
```

Prompt:

```text
Short streak bonus sound for a mobile arcade game, bright rising sparkle, satisfying but subtle, 0.6 seconds, no music loop, no voice.
```

### 8. Level Pass

When level is completed successfully.

File:

```text
level-pass.wav
```

Prompt:

```text
Short cheerful level complete sound for a recycling mobile game, clean playful flourish, bright and rewarding, 1 second, no voice, no background music.
```

### 9. Level Fail

When level fails.

File:

```text
level-fail.wav
```

Prompt:

```text
Calm encouraging level failed sound for a mobile educational game, soft descending tone, not sad, not harsh, retry-friendly, 1 second, no voice, no music.
```

### 10. Bin Unlock

When a new bin category unlocks.

File:

```text
bin-unlock.wav
```

Prompt:

```text
Pleasant discovery sound for unlocking a new recycling bin in a mobile game, small sparkle and clean pop, friendly and bright, 0.8 seconds, no voice, no music.
```

### 11. Button Tap

For major UI buttons.

File:

```text
button-tap.wav
```

Prompt:

```text
Clean soft button tap sound for a polished mobile game UI, subtle click, light and modern, 0.15 seconds, no music, no voice.
```

## Category Drop Variants

These should be optional. Use them only if they improve feel without making the game noisy.

### Recyclable Drop

File:

```text
drop-recyclable.wav
```

Prompt:

```text
Short recycling bin drop sound, light plastic and paper object landing in a clean bin, satisfying mobile game style, 0.4 seconds, no voice, no music.
```

### Organic Drop

File:

```text
drop-organic.wav
```

Prompt:

```text
Soft organic waste drop sound, gentle earthy plop, clean and playful mobile game style, not gross, 0.4 seconds, no voice, no music.
```

### Hazardous Drop

File:

```text
drop-hazardous.wav
```

Prompt:

```text
Short careful hazardous waste drop sound, muted container tap with tiny caution pulse, safe and serious but still game-friendly, 0.5 seconds, no alarm, no voice, no music.
```

### E-Waste Drop

File:

```text
drop-ewaste.wav
```

Prompt:

```text
Short electronic waste drop sound, tiny digital beep mixed with soft plastic tap, clean mobile game style, 0.4 seconds, no voice, no music.
```

### General Waste Drop

File:

```text
drop-general.wav
```

Prompt:

```text
Neutral general waste drop sound, soft dry tap into a bin, understated mobile game feedback, 0.35 seconds, no voice, no music.
```

## Integration Plan

1. Generate 2-3 variations for each required sound.
2. Pick the best version of each.
3. Normalize volume so no sound is too loud.
4. Trim silence from the start and end.
5. Export final files as `.wav`.
6. Add files to `public/audio/sfx/`.
7. Replace synthetic Web Audio sounds in `src/utils/audio.ts` with local audio playback.
8. Keep Web Audio fallback only if a file fails to load.
9. Test with music on and off.
10. Test repeated gameplay for fatigue.

## Priority Order

Build the sounds in this order:

1. Correct sort
2. Wrong sort
3. Missed item
4. Drag pickup
5. Neutral drop
6. Level pass
7. Level fail
8. Item spawn
9. Streak
10. Bin unlock
11. Button tap
12. Category drop variants

## Quality Checklist

Each final sound should pass this checklist:

- Starts immediately.
- Ends cleanly.
- Under 1 second unless level pass/fail.
- Works at low phone volume.
- Does not clash with background music.
- Does not sound harsh through laptop speakers.
- Still feels good after 10 repeated plays.
- Wrong/missed sounds do not feel punishing.

## Recommended First Test Pack

Start with only five sounds:

```text
correct-sort.wav
wrong-sort.wav
missed-item.wav
drag-pickup.wav
level-pass.wav
```

Once those feel good, generate the rest.
