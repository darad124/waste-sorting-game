#!/usr/bin/env python3
"""Converts the generated scenes and writes them into src/.

    python3 tools/scenes/park/gen.py
    python3 tools/scenes/port.py

See README.md. Everything that can be asserted is asserted here rather
than discovered later as a hole in a picture.
"""
import json, pathlib, sys

BASE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(BASE))
from convert import convert           # noqa: E402
import assemble                       # noqa: E402

JOBS = [
    ("park", "pk", ["p1", "p2", "p3", "p4", "p5"], {
        "tree": ("The tree. Click it and it lets go of a few leaves.", "shedLeaves"),
        "gustCorner": ("The turned-back corner of the blanket. Click to send a gust across it.",
                       "sendGust"),
        "speaker": ("A portable speaker. Click to wake it up.", "toggleSpeaker"),
    }),
    ("school", "sc", ["s1", "s2", "s3", "s4", "s5"], {
        "bell": ("The hall bell. Click it.", "ringBell"),
        "plane": ("A paper plane. Click to launch it.", "launchPlane"),
        "waterjug": ("The water jug. Click to slosh it.", "sloshWater"),
    }),
]

for name, pfx, clues, props in JOBS:
    src = BASE / name / "index.html"
    if not src.exists():
        print(f"skip {name}: run {name}/gen.py first")
        continue
    svg, art, css, ids = convert(src, pfx, clues, props)
    (BASE / name / "_scene.jsx").write_text(svg)
    (BASE / name / "_litter.json").write_text(json.dumps(art))
    (BASE / name / "_css.css").write_text(css)
    for k, v in art.items():
        assert v.count("<g") == v.count("</g>"), f"{name}/{k}: unbalanced extraction"
    assert "<!--" not in svg and "class=" not in svg, name
    assert svg.count("{...prop(") == len(props), f"{name}: props not wired"
    for bad in ("stroke-width=", "stop-color=", "fill-rule=", "clip-path=", "stroke-opacity="):
        assert bad not in svg, (name, bad)
    print(f"{name}: scene {len(svg) // 1024} KB, {len(ids)} ids namespaced")

assemble.main()
print("\nCSS is NOT written automatically — the scoped reduced-motion block")
print("is hand-written per scene. Diff tools/scenes/*/_css.css against the")
print("`pk-`/`sc-` sections of src/index.css if a keyframe changed.")
