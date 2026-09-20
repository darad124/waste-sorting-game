# Detective scenes

The Park and School scenes are **generated**, not hand-written. Each one is
a Python program that emits a standalone `index.html` you can open in a
browser and argue about, and a two-step pipeline turns that into the four
files the game imports.

Doing it this way is not decoration. The scenes are solved from one camera
rather than drawn by eye:

* a horizon is fixed, which fixes the vanishing point, which every depth
  line in the picture runs to
* a scale rule falls out of that horizon — Park: `px per metre = 0.7 *
  (y - 232)`; School: `0.864 * (y - 120)` on the table — and every object
  is authored in **millimetres at its real size** and placed by it
* so a hat, a football and a soup can are in scale with each other and with
  the check of the cloth they are lying on without anybody deciding

Change a number in `gen.py` and the whole picture stays consistent. Edit
180 KB of JSX by hand and it does not.

## Regenerating

```sh
python3 tools/scenes/park/gen.py          # writes tools/scenes/park/index.html
open tools/scenes/park/index.html         # look at it
python3 tools/scenes/port.py              # converts + writes into src/
```

`convert.py` does the fiddly half:

* namespaces every id, class and keyframe (`pk-`, `sc-`) so two scenes can
  share a document without their gradients colliding
* converts attributes and inline styles to JSX
* swaps each interactive prop's attribute set for a React spread
* **cuts the litter out of the backdrop by counting tag depth.** A
  non-greedy match for `</g>` stops at the first INNER closing tag and
  quietly cuts a clue in half; it did exactly that once.

`assemble.py` wraps the fragments in the component shells (`_head.tsx` /
`_tail.tsx`) and writes `<name>Clues.tsx` with each clue framed on its own
measured bounding box.

## The other three

Kitchen, Beach and Office predate this pipeline and are maintained as JSX
directly. If one of them needs real work, it is worth writing its `gen.py`
first.

## Measuring a clue's box

The numbers in `assemble.py`'s `BOX` are read out of the browser, not
guessed — open the standalone and run:

```js
const s = document.getElementById('scene'), r = s.getBoundingClientRect();
const sx = 1200 / r.width, sy = 900 / r.height;
['p1','p2','p3','p4','p5'].map(id => {
  const b = document.getElementById('lit-' + id).getBoundingClientRect();
  return [id, (b.x - r.x) * sx, (b.y - r.y) * sy, b.width * sx, b.height * sy];
});
```

Clamp the result to the frame: a shadow that runs off the left edge of the
picture is clipped there anyway, and an un-clamped box seats the clue half
off-screen.
