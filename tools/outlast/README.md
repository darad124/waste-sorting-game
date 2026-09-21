# Outlast

Two objects, one question: which one outlasts the other? You commit, then you
watch the race decide it.

## Files

| file | what it is |
|---|---|
| `items.js` | the item library — the source of truth |
| `decay.js` | the five material behaviours |
| `harness.js` | the loop: pair, question, race, verdict |
| `shell.html` | page chrome and CSS |
| `build.mjs` | inlines the above into `index.html` |

```sh
node tools/outlast/build.mjs && open tools/outlast/index.html
```

The libraries are inlined into one file only because the preview pane serves a
local file as a `data:` URL, which cannot fetch a sibling module. They port
straight to `src/components/outlast/` as real modules.

## Drawing an item

Every object is drawn in a 300 x 420 box, base on y=400, centre on x=150.
Objects are **not to scale with each other** on purpose — this mode is about
time, not size, and a cigarette butt drawn to scale beside a bottle is a speck.

An entry declares `material`, `years`, `defs`, `body`, `silhouette` (one path,
which the decay overlays paint inside so they never spill) and `base` for the
contact shadow. `{p}` in `defs`/`body` is replaced with the lane prefix, so two
lanes can share a document without their gradients colliding.

Rules that each cost a rebuild to learn:

* **profile over plan** — the silhouette is what names an object
* **a cylinder is the one shape a bottle never has**
* rigid manufactured things with clean material boundaries draw well; soft wet
  organic things need a canonical silhouette or a host to sit in
* flat solid fills read as paper cutouts. Volume comes from gradients
* shadows are a tight contact patch plus a soft cast thrown away from the key,
  never one flat disc under the middle

## The roster

25 items across six behaviours — 4 paper, 6 organic, 9 plastic, 2 steel,
2 aluminium, 2 glass. `harness.js` builds every pair more than 1.2 decades
apart, which from this roster is a few hundred of them.

The surprises are what carry the mode, and the sharpest are the cigarette butt
(cellulose acetate, so it is plastic and it fragments rather than going), the
takeaway coffee cup (paper with a bonded plastic lining) and the two cans
sitting side by side corroding in completely different ways.

## The six behaviours

`paper` and `organic` go ragged, rots from the base up and tears through. `plastic` does
**not** go — it yellows, embrittles and breaks into chunks that stay on screen
for ever, shedding specks. `steel` rusts orange in patches and is eaten
through. `aluminium` does not rust at all; it grows a dull white oxide that
seals the metal, which is why a drinks can outlasts a steel food tin about four
to one. `glass` does nothing whatsoever.

Two things that took a pass to get right, both the same mistake in different
places: a corrosion mask opened all the way is a flat colour swap rather than
rust, and a plastic hole mask opened as wide as paper's makes the plastic
vanish — which contradicts the only thing that behaviour exists to say.

An item can also set `scale` and `base.cy`. Anything LYING DOWN needs both, or
it sits in the bottom third of an empty frame with its shadow parked at the
standing baseline underneath it.

## Accuracy

`years` values are **placeholders**. Published decomposition figures vary a lot
by source and by conditions. Before this ships it needs one cited set, the
assumed conditions stated on screen, and pairs only where the gap is wide
enough that the ordering is not in dispute — `harness.js` already refuses any
pair closer than 1.2 decades.

## Review hook

`window.__outlast.show(a, b, d)` puts any pair on screen at any point in its
decay, so a still can be judged without waiting for the shuffle to offer it.
