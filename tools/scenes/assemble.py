#!/usr/bin/env python3
"""Wraps the converted fragments into the four files the game imports."""
import json, pathlib, textwrap

BASE = pathlib.Path(__file__).resolve().parent
OUT = BASE.parent.parent / "src" / "components" / "detective"

# measured in the browser off the authored artwork, then clamped to the
# frame — a shadow that runs off the left edge of the picture is clipped
# there anyway, and an un-clamped box would seat the clue half off-screen
BOX = {
    "p1": (455.6, 808.4, 125.1, 74.1),
    "p2": (551.1, 772.0, 119.2, 112.2),
    "p3": (380.7, 854.3, 87.6, 79.4),
    "p4": (958.6, 795.7, 118.8, 110.2),
    "p5": (687.0, 737.2, 123.6, 107.0),
    "s1": (112.6, 756.4, 225.1, 287.2),
    "s2": (660.1, 723.8, 248.4, 75.3),
    "s3": (406.7, 865.1, 178.0, 59.2),
    "s4": (768.0, 829.5, 175.7, 141.1),
    "s5": (978.9, 805.2, 313.7, 92.9),
}

def clue_file(name, pfx, const, header, ids):
    art = json.loads((BASE / name / "_litter.json").read_text())
    parts = [header, f"export const {const}_CLUE_ART: Record<string, React.ReactNode> = {{"]
    for cid in ids:
        cx, cy, w, h = BOX[cid]
        frag = textwrap.indent(art[cid].strip(), "  ")
        parts.append(f'  {cid}: (\n'
                     f'    <svg className="absolute inset-0 w-full h-full" '
                     f'viewBox="{-w/2:.1f} {-h/2:.1f} {w:.1f} {h:.1f}" aria-hidden>\n'
                     f'      <g transform="translate({-cx:.1f},{-cy:.1f})">\n'
                     f'{frag}\n'
                     f'      </g>\n'
                     f'    </svg>\n'
                     f'  ),')
    parts.append("};\n")
    parts.append(f"/** These are not square — the cable is 314 units wide and the milk jug\n"
                 f" *  is 287 tall — so each one declares the slot it needs and the screen\n"
                 f" *  sizes the wrapper from it. */\n"
                 f"export const {const}_CLUE_BOX: Record<string, {{ w: number; h: number }}> = {{")
    for cid in ids:
        _, _, w, h = BOX[cid]
        parts.append(f"  {cid}: {{ w: {w:g}, h: {h:g} }},")
    parts.append("};")
    (OUT / f"{name}Clues.tsx").write_text("\n".join(parts) + "\n")
    return {cid: (BOX[cid][0] / 1200 * 100, BOX[cid][1] / 900 * 100) for cid in ids}

def scene_file(name, comp, head, tail):
    svg = (BASE / name / "_scene.jsx").read_text().strip()
    (OUT / f"{comp}.tsx").write_text(head + "\n" + svg + "\n" + tail)


DECOY_BLOCK = """
{/* ══════════ THE DECOYS ══════════
     Invisible hit areas over things that are NOT waste. They are here
     rather than in the screen because the boxes are measured off this
     artwork, and artwork and hit area belong in the same file or they
     drift apart. */}
{onDecoy && (
  <g>
    {DECOYS.map((d) => (
      <rect
        key={d.label}
        x={d.x}
        y={d.y}
        width={d.w}
        height={d.h}
        fill="transparent"
        role="button"
        tabIndex={0}
        aria-label={`Inspect the ${d.label}`}
        style={{ pointerEvents: "auto", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          onDecoy(d.note);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onDecoy(d.note);
          }
        }}
      />
    ))}
  </g>
)}
"""

def build(name, comp, grade_marker):
    head = (BASE / name / "_head.tsx").read_text()
    tail = (BASE / name / "_tail.tsx").read_text()
    svg = (BASE / name / "_scene.jsx").read_text().strip()
    assert grade_marker in svg, f"{name}: no grade marker"
    i = svg.index(grade_marker)
    svg = svg[:i] + DECOY_BLOCK + "\n" + svg[i:]
    (OUT / f"{comp}.tsx").write_text(head + "\n" + svg + "\n" + tail)
    return len(head) + len(svg) + len(tail)


def main():
    PARK_HDR = '''import React from "react";

/** The five pieces of litter for the Park case, drawn to the same standard
 *  as the scene: late afternoon, sun low and to the upper RIGHT, so every
 *  cast shadow runs down-LEFT at twice the height of the thing that threw
 *  it, and shadows on the cloth are violet-blue because sky is the only
 *  thing filling them.
 *
 *  Two of these had no silhouette of their own and needed solving rather
 *  than drawing: the cling film is wrapped round a sandwich, which gives
 *  it an outline it can read off, and the gum is identified by its
 *  wrapper, with the chewed wad beside it.
 *
 *  The gradients and filters they reference are defined in ParkScene's
 *  defs, which is in the same document whenever these are on screen.
 */
'''
    SCHOOL_HDR = '''import React from "react";

/** The five pieces of litter for the School case, drawn to the same
 *  standard as the scene: tall windows out of frame to the RIGHT, so the
 *  hot edge of everything is on its right and its shadow runs left, and
 *  anything lying flat is squashed by that plane's own foreshortening.
 *
 *  The milk jug's handle is a real HOLE — a second subpath with fill-rule
 *  evenodd — so the table shows through it, which is most of what makes
 *  one of these look like a milk jug rather than a bottle.
 *
 *  The gradients and filters they reference are defined in SchoolScene's
 *  defs, which is in the same document whenever these are on screen.
 */
'''
    seats = {}
    seats.update(clue_file("park", "pk", "PARK", PARK_HDR, ["p1","p2","p3","p4","p5"]))
    seats.update(clue_file("school", "sc", "SCHOOL", SCHOOL_HDR, ["s1","s2","s3","s4","s5"]))
    a = build("park", "ParkScene", "{/* ══════════ 16. GRADE ══════════ */}")
    b = build("school", "SchoolScene", "{/* ══════════ 10. GRADE ══════════ */}")
    print(f"ParkScene {a//1024}KB  SchoolScene {b//1024}KB")
    for k, (l, t) in seats.items():
        print(f'  {k}: left "{l:.1f}%", top "{t:.1f}%"')


if __name__ == "__main__":
    main()
