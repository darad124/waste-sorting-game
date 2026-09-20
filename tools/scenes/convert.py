#!/usr/bin/env python3
"""Turns an authored standalone scene into the three pieces the game needs.

The scenes are authored as plain HTML so they can be looked at and argued
about without a build step. Porting them by hand is where the mistakes
get made, so it is done here instead:

  · the backdrop, as JSX, with the litter cut out of it
  · the litter, as one <svg> per clue, each framed on its own artwork
  · the CSS, with every class, keyframe and id namespaced

Everything that can be asserted is asserted. The one that matters most is
the balanced() check on extracted groups: a non-greedy match for </g>
stops at the first INNER closing tag and quietly cuts a clue in half.
"""
import re, sys, json, pathlib

# SVG/HTML attributes that React wants in camelCase. Anything hyphenated
# that is not data-* or aria-* gets converted, which covers the whole
# presentation-attribute set without listing it.
def camel(name):
    if name.startswith(("data-", "aria-")):
        return name
    if name == "tabindex":
        return "tabIndex"
    if name == "class":
        return "className"
    if ":" in name:                       # xlink:href -> xlinkHref
        a, b = name.split(":", 1)
        return a + b[:1].upper() + b[1:]
    if "-" not in name:
        return name
    head, *rest = name.split("-")
    return head + "".join(p[:1].upper() + p[1:] for p in rest)

def style_to_jsx(value):
    out = []
    for decl in value.split(";"):
        if not decl.strip():
            continue
        k, _, v = decl.partition(":")
        out.append(f'{camel(k.strip())}: "{v.strip()}"')
    return "{{ " + ", ".join(out) + " }}"

def match_close(s, start, tag):
    """Index just past the </tag> that closes the <tag> opening at `start`.
    Counts depth; a non-greedy regex gets this wrong every time."""
    depth, i = 0, start
    open_re = re.compile(rf"<{tag}\b", re.I)
    close_re = re.compile(rf"</{tag}\s*>", re.I)
    while i < len(s):
        o = open_re.search(s, i)
        c = close_re.search(s, i)
        if c is None:
            raise ValueError(f"unclosed <{tag}> from {start}")
        if o and o.start() < c.start():
            # a self-closing <g/> would not count, but we do not author them
            depth += 1
            i = o.end()
        else:
            depth -= 1
            i = c.end()
            if depth == 0:
                return i
    raise ValueError(f"unclosed <{tag}> from {start}")

def balanced(frag, tag="g"):
    return len(re.findall(rf"<{tag}\b", frag)) == len(re.findall(rf"</{tag}\s*>", frag))


def prefix_ids(svg, pfx, keep):
    """Namespace every id in the scene, and every reference to one, so two
    scenes can be in the same document without their gradients colliding.
    `keep` is the litter ids, which the screen addresses by name."""
    ids = set(re.findall(r'\sid="([\w-]+)"', svg)) - set(keep)
    for i in sorted(ids, key=len, reverse=True):
        svg = re.sub(rf'(\sid=")({re.escape(i)})(")', rf'\g<1>{pfx}-\g<2>\g<3>', svg)
        svg = svg.replace(f"url(#{i})", f"url(#{pfx}-{i})")
        svg = re.sub(rf'(href="#){re.escape(i)}(")', rf'\g<1>{pfx}-{i}\g<2>', svg)
    return svg, ids


def to_jsx(frag, props=None, pfx=None):
    """HTML -> JSX. Attribute names, style objects, comments, and the
    interactive props' attribute sets swapped for a React spread."""
    props = props or {}
    # interactive props first, while their attributes are still together
    for pid, (label, handler) in props.items():
        pat = re.compile(
            rf'class="([^"]*)\bprop\b([^"]*)"\s+id="(?:{pfx}-)?{pid}"[^>]*?'
            rf'aria-label="[^"]*"', re.S)
        m = pat.search(frag)
        if not m:
            raise ValueError(f"prop {pid} not found")
        rest = (m.group(1) + m.group(2)).split()
        cls = f'className="{" ".join(rest)}" ' if rest else ""
        frag = frag[:m.start()] + cls + f'{{...prop("{label}", {handler})}}' + frag[m.end():]

    def attr(m):
        name, val = m.group(1), m.group(2)
        if name == "style":
            return f"style={style_to_jsx(val)}"
        return f'{camel(name)}="{val}"'

    frag = re.sub(r'\b([A-Za-z_][\w:.-]*)="([^"]*)"', attr, frag)
    # comments: JSX cannot carry a raw HTML comment
    frag = frag.replace("<!--", "{/*").replace("-->", "*/}")
    return frag


def convert(src, pfx, clue_ids, props=None, drop_classes=("stage",)):
    html = pathlib.Path(src).read_text()

    # ── the stylesheet ────────────────────────────────────────────────
    css = re.search(r"<style>(.*?)</style>", html, re.S).group(1)
    names = set(re.findall(r"@keyframes\s+([\w-]+)", css))
    classes = set(re.findall(r"\.([A-Za-z][\w-]*)", css)) - set(drop_classes)
    for n in sorted(names, key=len, reverse=True):
        css = re.sub(rf"(@keyframes\s+){re.escape(n)}\b", rf"\g<1>{pfx}-{n}", css)
        css = re.sub(rf"(animation(?:-name)?\s*:\s*){re.escape(n)}\b", rf"\g<1>{pfx}-{n}", css)
    for c in sorted(classes, key=len, reverse=True):
        css = re.sub(rf"\.{re.escape(c)}\b", f".{pfx}-{c}", css)
    css = re.sub(r"#([A-Za-z][\w-]*)", lambda m: f"#{pfx}-{m.group(1)}"
                 if not re.fullmatch(r"[0-9A-Fa-f]{3,8}", m.group(1)) else m.group(0), css)
    # drop the page chrome: it belongs to the standalone, not to the game
    css = re.sub(r"(?m)^\s*(:root|html\s*,\s*body|svg)\s*\{[^}]*\}\s*$", "", css)
    css = re.sub(rf"(?m)^\s*\.{pfx}-stage\s*\{{[^}}]*\}}\s*$", "", css)

    # ── the scene ─────────────────────────────────────────────────────
    a = html.index('<svg id="scene"')
    a = html.index(">", html.index("aria-label=", a)) + 1
    b = html.rindex("</svg>")
    svg = html[a:b]

    # ── cut the litter out, checking each piece is whole ──────────────
    clues = {}
    for cid in clue_ids:
        m = re.search(rf'<g id="lit-{cid}"', svg)
        assert m, f"no litter group for {cid}"
        end = match_close(svg, m.start(), "g")
        frag = svg[m.start():end]
        assert balanced(frag), f"unbalanced extraction for {cid}"
        clues[cid] = frag
        svg = svg[:m.start()] + f"\n{{/* {cid} is drawn by the screen */}}\n" + svg[end:]

    svg, ids = prefix_ids(svg, pfx, [])
    clues = {k: prefix_ids(v, pfx, [f"lit-{k}"])[0] for k, v in clues.items()}
    return (to_jsx(svg, props, pfx),
            {k: to_jsx(v, pfx=pfx) for k, v in clues.items()}, css.strip(), ids)
