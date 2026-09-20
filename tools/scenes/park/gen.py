#!/usr/bin/env python3
"""Builds park/index.html.

The whole scene is derived from one camera, not from guesses:

  · the horizon sits at y=232, so EVERY depth line in the picture — the
    blanket's sides, the path, the fence — converges at the vanishing
    point (600, 232)
  · a thing of fixed real size at image height y is drawn at a scale
    proportional to (y - 232), because that is what 1/depth means once
    the horizon is fixed; this is what makes the grass read as a plane
    receding rather than as wallpaper
  · the ground's screen density therefore falls off as (y-232)^-3, which
    is how the blades are sampled

Anything generated here is generated because doing it by hand would get
it subtly wrong: 4,000 grass blades, a gingham weave in perspective, a
canopy of leaves, and the dapple those leaves cast.
"""
import math, random

W, H = 1200, 900
HORIZON = 232.0
VPX, VPY = 600.0, HORIZON

# ── the blanket, solved rather than drawn ────────────────────────────────
# Near edge on the ground line, far edge chosen so the blanket is SQUARE in
# ground units — a picnic blanket is square, and if the drawing isn't, the
# gingham gives it away immediately.
BN_Y   = 890.0                       # near edge
BN_L, BN_R = 60.0, 1150.0
FOCAL  = 1150.0                      # px; a normal lens on a 1200px frame
_h     = BN_Y - HORIZON              # 658 — apparent height of the camera
_ratio = (VPX - BN_L + BN_R - VPX) / FOCAL   # blanket ground width / depth
BF_Y   = HORIZON + _h / (1.0 + _ratio)
_t     = (BN_Y - BF_Y) / _h
BF_L   = BN_L + _t * (VPX - BN_L)
BF_R   = BN_R - _t * (BN_R - VPX)
NCHECK = 10                          # gingham squares per side

def f(v, n=1):
    s = f"{v:.{n}f}"
    return s.rstrip("0").rstrip(".") if "." in s else s

def blanket_span(y):
    """The blanket's left and right edge at image height y."""
    t = (BN_Y - y) / _h
    return BN_L + t * (VPX - BN_L), BN_R - t * (BN_R - VPX)

def on_blanket(x, y, pad=0.0):
    if not (BF_Y - pad <= y <= BN_Y + pad):
        return False
    l, r = blanket_span(y)
    return l - pad <= x <= r + pad

def row_y(k):
    """Image height of gingham row k, k=0 at the near edge."""
    return HORIZON + _h / (1.0 + _ratio * k / NCHECK)

def col_x(k, y):
    """Image x where gingham column line k crosses image height y."""
    xn = BN_L + (BN_R - BN_L) * k / NCHECK
    t = (BN_Y - y) / _h
    return xn + t * (VPX - xn)


# ══ BATCHING ════════════════════════════════════════════════════════════
# Four thousand blades of grass as four thousand <path> elements is a
# megabyte of markup and four thousand things for the browser to style.
# Every blade of one colour is instead concatenated into ONE path's d
# attribute — SVG has no trouble with a path made of four hundred
# subpaths, and it cuts the file by more than half before a single blade
# is given up. Opacity is therefore baked into the colours rather than set
# per element, which is why the tone lists below are final values.
def batch(groups):
    return "\n".join(f'<path fill="{c}" d="{"".join(d)}"/>'
                     for c, d in groups.items() if d)

def ell(cx, cy, rx, ry, rot):
    """An ellipse as path data, rotation and all — the arc command carries
    an x-axis-rotation, so this is exact rather than an approximation."""
    a = math.radians(rot)
    dx, dy = math.cos(a) * rx, math.sin(a) * rx
    return (f"M{f(cx-dx,0)} {f(cy-dy,0)}A{f(rx,0)} {f(ry,0)} {f(rot,0)} 1 0 "
            f"{f(cx+dx,0)} {f(cy+dy,0)}A{f(rx,0)} {f(ry,0)} {f(rot,0)} 1 0 "
            f"{f(cx-dx,0)} {f(cy-dy,0)}Z")


# ══ GRASS ════════════════════════════════════════════════════════════════
# A blade of fixed real height is drawn at scale proportional to (y-232).
# Ground area per unit of screen area goes as (y-232)^3, so to keep the
# field even on the ground the screen density must fall off as (y-232)^-3.
# That is sampled exactly, by inverting the CDF, rather than eyeballed —
# an evenly-scattered field is the single clearest tell of a flat drawing.
GRASS_TONES = ["#B3C766", "#9FBC55", "#8CB04A", "#77A140", "#628F37",
               "#4E7B2F", "#3E6828", "#325622"]

# ── TUFTS ────────────────────────────────────────────────────────────────
# Writing every blade out individually cost 140 KB for a lawn nobody looks
# at and a fringe along one hem. A dozen CLUMPS are authored once at a unit
# size and then placed with <use>: one 60-byte reference stands in for nine
# blades, and the clumps are mirrored and scaled on placement so the repeat
# never shows at this size.
#
# The open lawn has no blades on it at all any more. Its gradient, the mown
# stripes, the tree's shadow, the dapple and the flowers were carrying it;
# four thousand blades underneath were 93 KB of nothing you could see.
TUFT_SYMBOLS = 14
TUFT_BLADES = 9

def tuft_symbols(seed=77):
    """Each clump is drawn in a 100-unit box with its base on y=0, so a
    <use> scaled by k puts down a tuft k*100 units tall."""
    rng = random.Random(seed)
    out = []
    for i in range(TUFT_SYMBOLS):
        groups = {c: [] for c in GRASS_TONES}
        lo = rng.randrange(0, 3)
        for _ in range(TUFT_BLADES):
            x = rng.uniform(-42, 42)
            h = rng.uniform(46, 100)
            j = min(len(GRASS_TONES) - 1, lo + rng.randrange(0, 5))
            groups[GRASS_TONES[j]].append(_blade(x, 0, h, rng))
        out.append(f'<g id="tuft{i}">{batch(groups)}</g>')
    return "\n".join(out)

def _blade(x, y, hpx, rng):
    """One blade: a tapered curve, not a line. Grass bends.

    Coordinates are rounded to the pixel. A blade is four pixels across at
    the front of the lawn and one at the back, so a tenth of a pixel of
    precision is fifteen per cent of the file in exchange for nothing
    anybody can see."""
    lean = rng.uniform(-.62, .62)
    tipx, tipy = x + lean * hpx * .85, y - hpx
    cx, cy = x + lean * hpx * .18, y - hpx * .62
    w = max(.9, hpx * .085)
    return (f"M{f(x-w,0)} {f(y,0)}Q{f(cx-w*.4,0)} {f(cy,0)} {f(tipx,0)} {f(tipy,0)}"
            f"Q{f(cx+w*.4,0)} {f(cy,0)} {f(x+w,0)} {f(y,0)}Z")

def tuft_field(seed, n, y0, y1, keep, near_px=26.0):
    """Same sampling as before — density falling off as (y-232)^-3, which
    is what keeps a scattered field reading as a plane — but each sample
    places a clump instead of a blade."""
    rng = random.Random(seed)
    a, b = y0 - HORIZON, y1 - HORIZON
    ia, ib = a ** -2, b ** -2
    out = []
    for _ in range(n):
        u = rng.random()
        yh = (ia - u * (ia - ib)) ** -0.5          # inverse CDF of y^-3
        y = HORIZON + yh
        x = rng.uniform(-70, W + 70)
        if not keep(x, y):
            continue
        k = near_px * (yh / (H - HORIZON)) * rng.uniform(.62, 1.3) / 100.0
        if k < .03:
            continue
        sx = -k if rng.random() < .5 else k        # mirrored half the time
        out.append(f'<use href="#tuft{rng.randrange(TUFT_SYMBOLS)}" '
                   f'transform="translate({f(x,0)},{f(y,0)}) scale({f(sx,3)},{f(k,3)})"/>')
    return "\n".join(out)


# ══ WILDFLOWERS ══════════════════════════════════════════════════════════
def flowers(seed, n, y0, y1, keep):
    rng = random.Random(seed)
    a, b = y0 - HORIZON, y1 - HORIZON
    ia, ib = a ** -2, b ** -2
    stems, petal, eye, cup, cuplit = [], [], [], [], []
    for _ in range(n):
        u = rng.random()
        yh = (ia - u * (ia - ib)) ** -0.5
        y = HORIZON + yh
        x = rng.uniform(-40, W + 40)
        if not keep(x, y):
            continue
        s = 15.0 * (yh / (H - HORIZON)) * rng.uniform(.7, 1.3)
        if s < 1.8:
            continue
        stem = s * rng.uniform(1.6, 2.8)
        top, bend = y - stem, rng.uniform(-.3, .3) * stem
        cx = x + bend
        sw = max(.6, s * .13)
        stems.append(f"M{f(x-sw)} {f(y)}Q{f(x+bend*.3)} {f(y-stem*.6)} {f(cx)} {f(top)}"
                     f"Q{f(x+bend*.3+sw)} {f(y-stem*.6)} {f(x+sw)} {f(y)}Z")
        if rng.random() < .58:                       # daisy
            if s >= 7.0:
                for k in range(7):
                    ang = k * math.pi * 2 / 7 + rng.uniform(-.2, .2)
                    petal.append(ell(cx + math.cos(ang) * s * .52, top + math.sin(ang) * s * .34,
                                     s * .36, s * .21, math.degrees(ang)))
                eye.append(ell(cx, top, s * .28, s * .28, 0))
            else:
                # below seven pixels a daisy is a white smudge with a warm
                # middle, and drawing seven petals to say so is waste
                petal.append(ell(cx, top, s * .8, s * .62, 0))
                eye.append(ell(cx, top, s * .3, s * .26, 0))
        else:                                        # buttercup
            cup.append(ell(cx, top, s * .5, s * .5, 0))
            cuplit.append(ell(cx - s * .14, top - s * .14, s * .24, s * .24, 0))
    return batch({"#4F8730": stems, "#FFFDF4": petal, "#FFCD3C": eye,
                  "#FFC730": cup, "#FFE98A": cuplit})



# ══ THE GINGHAM ══════════════════════════════════════════════════════════
# Real gingham is a weave, not a chequerboard: a light ground, coloured
# bands one way, the same bands the other way, and the crossings come out
# darker on their own. Drawing it that way is both truer and less work
# than alternating squares — and every band here is a trapezoid running to
# the vanishing point, so the weave recedes with the cloth.
def gingham():
    out = []
    for k in range(0, NCHECK, 2):          # warp — bands running away
        x0n, x1n = col_x(k, BN_Y), col_x(k + 1, BN_Y)
        x0f, x1f = col_x(k, BF_Y), col_x(k + 1, BF_Y)
        out.append(f'<path d="M{f(x0n)} {f(BN_Y)}L{f(x1n)} {f(BN_Y)}L{f(x1f)} {f(BF_Y)}'
                   f'L{f(x0f)} {f(BF_Y)}Z" fill="#B8332A" opacity=".62"/>')
    for k in range(0, NCHECK, 2):          # weft — bands running across
        y0, y1 = row_y(k), row_y(k + 1)
        l0, r0 = blanket_span(y0)
        l1, r1 = blanket_span(y1)
        out.append(f'<path d="M{f(l0)} {f(y0)}L{f(r0)} {f(y0)}L{f(r1)} {f(y1)}'
                   f'L{f(l1)} {f(y1)}Z" fill="#B8332A" opacity=".62"/>')
    # the weave itself: fine warp threads, stopped where they stop resolving
    th = []
    for k in range(NCHECK * 4 + 1):
        xn = BN_L + (BN_R - BN_L) * k / (NCHECK * 4)
        ymid = row_y(NCHECK - 3)
        th.append(f'M{f(xn)} {f(BN_Y)}L{f(xn + (BN_Y-ymid)/_h*(VPX-xn))} {f(ymid)}')
    out.append(f'<path d="{" ".join(th)}" fill="none" stroke="#FFFFFF" '
               f'stroke-opacity=".13" stroke-width="1.1"/>')
    return "\n".join(out)


def blanket_outline(seed=7):
    """The cloth's edge — cloth laid on grass never lies straight."""
    rng = random.Random(seed)
    pts, N = [], 13
    for i in range(N):                      # near edge, left→right
        x = BN_L + (BN_R - BN_L) * i / (N - 1)
        pts.append((x, BN_Y + 10 + math.sin(i * 1.7) * 7 + rng.uniform(-4, 4)))
    for i in range(1, 8):                   # right edge, near→far
        t = i / 7
        y = BN_Y + (BF_Y - BN_Y) * t
        _, r = blanket_span(y)
        pts.append((r + math.sin(i * 2.1) * 5 + rng.uniform(-3, 3), y))
    for i in range(7, -1, -1):              # far edge, right→left
        t = i / 7
        x = BF_L + (BF_R - BF_L) * t
        pts.append((x, BF_Y + math.sin(i * 1.4) * 4 + rng.uniform(-2.5, 2.5)))
    for i in range(6, 0, -1):               # left edge, far→near
        t = i / 7
        y = BN_Y + (BF_Y - BN_Y) * t
        l, _ = blanket_span(y)
        pts.append((l - math.sin(i * 1.9) * 5 + rng.uniform(-3, 3), y))
    d = f"M{f(pts[0][0])} {f(pts[0][1])}"
    for i in range(1, len(pts)):
        x0, y0 = pts[i - 1]; x1, y1 = pts[i]
        d += (f"Q{f((x0+x1)/2 + rng.uniform(-5,5))} {f((y0+y1)/2 + rng.uniform(-5,5))} "
              f"{f(x1)} {f(y1)}")
    return d + "Z"


# ══ THE CANOPY ═══════════════════════════════════════════════════════════
# Leaf masses, not a green cloud. Four tones: the mass in its own shade,
# the body, the sunlit crowns, and loose leaves breaking the silhouette —
# a canopy with a smooth outline is the thing that looks like broccoli.
CANOPY_LOBES = [
    (1112, 88, 164), (1196, 176, 150), (1006, 62, 104), (940, 128, 132),
    (848, 84, 78),   (826, 168, 96),   (742, 130, 64),  (694, 186, 78),
    (1058, 210, 118),(916, 232, 86),   (788, 252, 62),  (1164, 268, 104),
    (640, 156, 44),  (608, 210, 52),   (1248, 110, 128),(1010, 296, 74),
    (876, 300, 54),  (712, 268, 46),   (1120, 332, 62), (976, 348, 44),
]

def canopy(seed=11, part="all"):
    """part='dark' is the mass in its own shade, 'light' is the sunlit
    foliage. The branches and the holes of sky go BETWEEN them."""
    rng = random.Random(seed)
    layers = [("#122B0C", 1.05, 200), ("#1E4416", .96, 215),
              ("#33661F", .78, 195), ("#5B972C", .52, 145), ("#9BC940", .28, 86)]
    if part == "dark":
        layers = layers[:2]
    elif part == "light":
        for col, shrink, n in layers[:2]:      # burn the same draws, so the
            for _ in range(n):                 # lit tones keep sitting on
                rng.choice(CANOPY_LOBES); rng.uniform(0, math.tau)   # the
                rng.random(); rng.uniform(11, 42); rng.uniform(.5, .78)
                rng.uniform(0, 180)
        layers = layers[2:]
    groups = {}
    for col, shrink, n in layers:
        # the sunlit tones are pulled up and to the RIGHT, toward the sun
        dx = 0 if shrink > .9 else (1 - shrink) * 150
        dy = 0 if shrink > .9 else -(1 - shrink) * 120
        d = groups.setdefault(col, [])
        for _ in range(n):
            cx, cy, r = rng.choice(CANOPY_LOBES)
            ang, rad = rng.uniform(0, math.tau), math.sqrt(rng.random()) * r * shrink
            x = cx + math.cos(ang) * rad * 1.15 + dx
            y = cy + math.sin(ang) * rad * .82 + dy
            sx = rng.uniform(13, 46) * (1 if shrink > .9 else .82)
            d.append(ell(x, y, sx, sx * rng.uniform(.5, .78), rng.uniform(0, 180)))
    return batch(groups)

def canopy_leaves(seed=13, n=190):
    """Individual leaves along the underside, where the eye checks."""
    rng = random.Random(seed)
    keys = ["#22491A", "#2F5E20", "#3D7026", "#53892C"]
    groups = {c: [] for c in keys}
    for _ in range(n):
        cx, cy, r = rng.choice(CANOPY_LOBES)
        ang = rng.uniform(.15, math.pi - .15)          # lower half only
        x = cx + math.cos(ang) * r * rng.uniform(.95, 1.25) * 1.15
        y = cy + math.sin(ang) * r * rng.uniform(.95, 1.25) * .82
        if y > 430 or x < 540:
            continue
        s = rng.uniform(10, 20)
        a = math.radians(math.degrees(ang) + rng.uniform(-40, 40))
        ca, sa = math.cos(a), math.sin(a)
        def P(u, v):
            return f"{f(x + u*ca - v*sa)} {f(y + u*sa + v*ca)}"
        groups[rng.choice(keys)].append(
            f"M{P(0,0)}Q{P(s*.55,-s*.42)} {P(s*1.5,0)}Q{P(s*.55,s*.1)} {P(0,0)}Z")
    return batch(groups)


# ══ DAPPLE ═══════════════════════════════════════════════════════════════
# Gaps in that canopy, projected onto the ground. The sun is low and to the
# upper right, so the gaps land down and to the LEFT of the leaves that made
# them, they are elongated along that same direction because the ground is
# being raked at a shallow angle, and they are soft-edged because the sun is
# a disc rather than a point.
# ══ WHAT THE TREE DOES TO THE GROUND ═════════════════════════════════════
# There was dapple in this scene before there was any SHADE for it to be
# holes in, and that is why it read as snow. A tree does two things to the
# lawn under it, in this order: it lays down a large soft shadow shaped
# like its own crown, flattened and thrown down-sun; and it lets light
# through the gaps in itself, which lands as pools INSIDE that shadow.
#
# The shade is built from the same lobes the crown is, squashed onto the
# ground plane and offset down and to the LEFT, because the sun is up and
# to the right. It is the crown's own shape, which is what makes it read
# as this tree's shadow rather than as a smudge.
def _shade_lobes(grow=1.0, squash=1.0):
    out = []
    for cx, cy, r in CANOPY_LOBES:
        # the higher up the crown a lobe is, the further down-sun its
        # shadow lands, because the light is coming in at an angle
        gx = cx - 262 - (430 - cy) * .30
        gy = 596 + (430 - cy) * .20
        rx, ry = r * 1.62 * grow, r * .5 * grow * squash
        out.append(f'<ellipse cx="{f(gx)}" cy="{f(gy)}" rx="{f(rx)}" ry="{f(ry)}" '
                   f'transform="rotate(-21 {f(gx)} {f(gy)})"/>')
    return "\n".join(out)

def canopy_shade():
    return _shade_lobes(1.0, 1.0)

def canopy_shade_core():
    return _shade_lobes(.66, .92)

def trunk_shade():
    """The trunk throws a shadow too, and it is the one piece of this that
    is a hard straight line — a long tapering band leaving the foot of the
    tree and running down-sun with everything else."""
    return ("M1176 512 L1206 502 L508 644 L448 636 Z")


# ══ DAPPLE ═══════════════════════════════════════════════════════════════
# Pools of sun in the gaps of that shade — a few dozen, of genuinely
# different sizes, overlapping, and only where the shade is. Two hundred
# even specks is snowfall; this is what light through leaves looks like.
def dapple(seed=23, n=132):
    rng = random.Random(seed)
    out = []
    for _ in range(n):
        u = rng.random() ** .8
        y = 500 + u * 400
        cx = 900 - (y - 500) * .34
        x = cx + rng.gauss(0, 200 + (y - 500) * .30)
        if x < -40 or x > 1230:
            continue
        # a long tail of sizes: mostly small, a few that are pools
        s0 = (4.5 + rng.expovariate(.1)) * (.4 + (y - HORIZON) / 700.0)
        if s0 > 58:
            continue
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(s0*1.45)}" ry="{f(s0*.66)}" '
                   f'fill="url(#dappleG)" opacity="{f(rng.uniform(.3,.85),2)}" '
                   f'transform="rotate({f(rng.uniform(20,40))} {f(x)} {f(y)})"/>')
    return "\n".join(out)


# ══ MOWN STRIPES ═════════════════════════════════════════════════════════
# A park lawn is mown in stripes, and those stripes are depth lines, so all
# of them run to the same point on the horizon. They alternate because the
# roller lays the blades toward you on one pass and away on the next, and
# grass leaning away from the sun looks darker than grass leaning into it.
def mown(n=13, base_y=1090.0, vp2x=1780.0):
    """vp2x is where these stripes converge: a point on the horizon well
    off the right of the frame, because the mower ran ACROSS the picture
    rather than away from it. Stripes that run straight away converge in
    the middle of the frame and come out as a starburst however faint you
    make them; run across, they sweep."""
    out, span = [], 5200.0
    for k in range(n):
        x0 = 520 - span / 2 + span * k / n
        x1 = 520 - span / 2 + span * (k + 1) / n
        fy = HORIZON + 44.0          # they stop resolving before the horizon
        t = (base_y - fy) / (base_y - VPY)
        fx0 = x0 + t * (vp2x - x0)
        fx1 = x1 + t * (vp2x - x1)
        light = k % 2 == 0
        col = "#D2E69E" if light else "#1D4430"
        op = ".07" if light else ".08"
        out.append(f'<path d="M{f(x0)} {f(base_y)}L{f(x1)} {f(base_y)}L{f(fx1)} {f(fy)}'
                   f'L{f(fx0)} {f(fy)}Z" fill="{col}" opacity="{op}"/>')
    return "\n".join(out)



HEAD = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Park Picnic</title>
<style>
  :root { color-scheme: dark; }
  html,body { margin:0; height:100%; background:#0A1410; display:grid; place-items:center;
              font-family: ui-sans-serif, system-ui, sans-serif; }
  .stage { width:min(96vw, 1180px); aspect-ratio:4/3; position:relative;
           border-radius:26px; overflow:hidden;
           box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 40px 90px -30px #000; }
  svg { position:absolute; inset:0; width:100%; height:100%; display:block; }

  /* ── ambient life ──────────────────────────────────────────────────
     Late afternoon, and nothing here is in a hurry: the canopy turns
     over in the breeze, the light it drops shifts with it, a butterfly
     crosses, and someone's kite is up over the far side of the park. */

  @keyframes canopySway { 0%,100%{transform:rotate(-.55deg)} 50%{transform:rotate(.62deg)} }
  .canopy { transform-origin: 1150px 430px; animation: canopySway 11.2s ease-in-out infinite; }

  /* The dapple drifts with the leaves that cast it. Only TRANSFORM is
     animated here — an opacity animation on this group would make it a
     stacking context, and the screen blend inside would stop working. */
  @keyframes dappleDrift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(17px,-7px)} }
  .dapple { animation: dappleDrift 11.2s ease-in-out infinite; }

  @keyframes nearSway { 0%,100%{transform:skewX(0deg)} 50%{transform:skewX(-1.4deg)} }
  .nearGrass { transform-origin: 600px 900px; animation: nearSway 8.6s ease-in-out infinite; }

  @keyframes flit {
    0%   {transform:translate(212px,806px) scale(1)    rotate(-7deg)}
    21%  {transform:translate(402px,718px) scale(.85)  rotate(5deg)}
    44%  {transform:translate(596px,648px) scale(.69)  rotate(-6deg)}
    68%  {transform:translate(788px,556px) scale(.52)  rotate(4deg)}
    100% {transform:translate(1014px,462px) scale(.35) rotate(-3deg)} }
  .butterfly { animation: flit 17s cubic-bezier(.4,0,.6,1) infinite; }
  @keyframes bfFade { 0%{opacity:0} 9%{opacity:1} 84%{opacity:1} 100%{opacity:0} }
  .bfFade { animation: bfFade 17s linear infinite; }
  /* the near wing beats through a full arc; the far one is turned away
     from us, so the same beat covers less ground on screen */
  @keyframes flapNear { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(.18)} }
  @keyframes flapFar  { 0%,100%{transform:scaleX(.62)} 50%{transform:scaleX(.1)} }
  .wingNear { transform-box: fill-box; transform-origin: 100% 40%;
              animation: flapNear .19s ease-in-out infinite; }
  .wingFar  { transform-box: fill-box; transform-origin: 0% 40%;
              animation: flapFar .19s ease-in-out infinite; }

  @keyframes kiteBob { 0%,100%{transform:translate(386px,122px) rotate(-4deg)}
                       50%   {transform:translate(360px,105px) rotate(5deg)} }
  .kite { animation: kiteBob 8.1s ease-in-out infinite; }

  @keyframes steam { 0%  {opacity:0; transform:translate(0,0) scale(.5)}
                     24% {opacity:.42}
                     100%{opacity:0; transform:translate(-13px,-74px) scale(1.8)} }
  .steam { animation: steam 7.3s ease-out infinite; }

  /* ── the three toys ────────────────────────────────────────────────
     Click the tree and it lets go of a few leaves. Click the speaker and
     it wakes up. Click the turned-back corner of the blanket and a gust
     runs across the cloth — and the dapple slides with it, because the
     same wind is in the tree that is casting it. */
  .prop { cursor: pointer; }
  .prop:focus { outline: none; }
  .prop:focus-visible { outline: 2px dashed #FFF3C4; outline-offset: -6px; }

  @keyframes fall0 { 0%{opacity:0; transform:translate(0,0) rotate(0)} 8%{opacity:1}
                     100%{opacity:0; transform:translate(-180px,470px) rotate(-420deg)} }
  @keyframes fall1 { 0%{opacity:0; transform:translate(0,0) rotate(0)} 8%{opacity:1}
                     100%{opacity:0; transform:translate(-268px,520px) rotate(380deg)} }
  @keyframes fall2 { 0%{opacity:0; transform:translate(0,0) rotate(0)} 8%{opacity:1}
                     100%{opacity:0; transform:translate(-92px,500px) rotate(-300deg)} }
  .leaffall { opacity:0; }
  .shedding .leaffall { animation-duration: 4.2s; animation-timing-function: cubic-bezier(.3,.05,.5,1); }
  .shedding .lf0 { animation-name: fall0 } .shedding .lf1 { animation-name: fall1 }
  .shedding .lf2 { animation-name: fall2 }

  #speakerGlow, #speakerBars, #notes { opacity: 0; transition: opacity .3s ease; }
  .playing #speakerGlow, .playing #speakerBars, .playing #notes { opacity: 1; }
  @keyframes bar { 0%,100%{transform:scaleY(.25)} 50%{transform:scaleY(1)} }
  .playing .bar { animation: bar .58s ease-in-out infinite;
                  transform-box: fill-box; transform-origin: 50% 100%; }
  @keyframes noteUp { 0%{opacity:0; transform:translate(0,0) scale(.6)}
                      20%{opacity:.9} 100%{opacity:0; transform:translate(26px,-88px) scale(1.25)} }
  .playing .note { animation: noteUp 3.1s ease-out infinite; }

  @keyframes gustCorner { 0%,100%{transform:translate(0,0) rotate(0)}
                          30%{transform:translate(-13px,-24px) rotate(-7deg)}
                          62%{transform:translate(5px,-7px) rotate(2.5deg)} }
  @keyframes gustCloth  { 0%,100%{transform:translate(0,0)}
                          34%{transform:translate(-5px,-3.5px)} 68%{transform:translate(2px,1px)} }
  @keyframes gustLight  { 0%,100%{transform:translate(0,0)} 40%{transform:translate(-34px,11px)} }
  .gust .cornerFlap { animation: gustCorner 1.5s cubic-bezier(.36,.07,.19,.97); }
  .gust .cloth      { animation: gustCloth  1.5s cubic-bezier(.36,.07,.19,.97); }
  .gust .dapple     { animation: gustLight  1.5s cubic-bezier(.36,.07,.19,.97); }

  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
</head>
<body>
<div class="stage">
<svg id="scene" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"
     aria-label="A picnic blanket on park grass in late afternoon, with waste left among the things">
<defs>

  <!-- ══ LIGHT MODEL ══
       Late afternoon, an hour or so before sunset. One source: the sun,
       low and to the upper RIGHT, sitting just behind the crown of the
       tree on that side. Everything in this picture follows from it:

         · cast shadows run down and to the LEFT, and they are LONG —
           twice the height of the thing that threw them, which is a sun
           about twenty-seven degrees up. A short shadow would put the
           sun overhead and make this midday.
         · shadows on grass are blue-GREEN, because what fills them is
           sky plus light bouncing back off the surrounding grass;
           shadows on the cloth are violet-blue, from sky alone
         · the upper-RIGHT edge of every object carries a hot rim
         · the gaps in that crown drop dapple on the ground below and to
           the LEFT of themselves, stretched along the light because the
           ground is raked at a shallow angle
         · distance drains contrast and pushes colour toward the blue of
           the air in between, so the far side of the park is nearly a
           flat wash and the near grass is the only place with real
           darkness in it -->

  <!-- ── sky. No clouds: the sun is a low disc just off the top-right
         corner, and everything the sky does here is that glow and the
         haze it lights along the horizon. ──────────────────────────── -->
  <linearGradient id="sky" x1=".92" y1="0" x2=".08" y2="1">
    <stop offset="0"   stop-color="#FFE9B8"/>
    <stop offset=".22" stop-color="#D8DCC8"/>
    <stop offset=".5"  stop-color="#A9C3DA"/>
    <stop offset="1"   stop-color="#6E9CC6"/>
  </linearGradient>
  <radialGradient id="sunGlow" cx=".93" cy="-.06" r=".72">
    <stop offset="0"   stop-color="#FFF6D6" stop-opacity=".95"/>
    <stop offset=".35" stop-color="#FFE7A8" stop-opacity=".5"/>
    <stop offset="1"   stop-color="#FFDE90" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="skyHaze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#EFE3C4" stop-opacity="0"/>
    <stop offset="1"   stop-color="#F6E6C0" stop-opacity=".85"/>
  </linearGradient>

  <!-- ── the meadow: one plane, so its gradient runs with DEPTH and not
         with the picture — pale and blue-drained at the horizon, deep and
         saturated at the camera ─────────────────────────────────────── -->
  <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#BCCF92"/>
    <stop offset=".1"   stop-color="#A8C471"/>
    <stop offset=".26"  stop-color="#8CB553"/>
    <stop offset=".47"  stop-color="#6EA141"/>
    <stop offset=".72"  stop-color="#4E8033"/>
    <stop offset="1"    stop-color="#33612A"/>
  </linearGradient>
  <linearGradient id="meadowSun" x1="1" y1="0" x2=".15" y2=".85">
    <stop offset="0"   stop-color="#FFEDA8" stop-opacity=".44"/>
    <stop offset=".45" stop-color="#FFE79C" stop-opacity=".14"/>
    <stop offset="1"   stop-color="#FFE79C" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="meadowCool" x1=".1" y1="1" x2=".8" y2=".1">
    <stop offset="0"   stop-color="#1E3F52" stop-opacity=".4"/>
    <stop offset=".4"  stop-color="#24485A" stop-opacity=".14"/>
    <stop offset="1"   stop-color="#24485A" stop-opacity="0"/>
  </linearGradient>

  <!-- ── shadow. Not grey, ever. ─────────────────────────────────────── -->
  <radialGradient id="shadow" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stop-color="#1B3B44" stop-opacity=".5"/>
    <stop offset=".62" stop-color="#20414A" stop-opacity=".3"/>
    <stop offset="1"   stop-color="#25454E" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="shadowCloth" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stop-color="#3A3160" stop-opacity=".46"/>
    <stop offset=".6"  stop-color="#413A66" stop-opacity=".26"/>
    <stop offset="1"   stop-color="#484270" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="occl" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stop-color="#16262C" stop-opacity=".62"/>
    <stop offset="1"   stop-color="#16262C" stop-opacity="0"/>
  </radialGradient>

  <!-- ── the cloth ───────────────────────────────────────────────────── -->
  <linearGradient id="clothLight" x1=".95" y1=".05" x2=".1" y2=".95">
    <stop offset="0"   stop-color="#FFF6DC"/>
    <stop offset=".34" stop-color="#F6E9CC"/>
    <stop offset=".68" stop-color="#DCCDB4"/>
    <stop offset="1"   stop-color="#B3A894"/>
  </linearGradient>
  <linearGradient id="clothWarm" x1="1" y1="0" x2=".18" y2=".9">
    <stop offset="0"   stop-color="#FFE9A0" stop-opacity=".34"/>
    <stop offset=".38" stop-color="#FFE4A0" stop-opacity=".12"/>
    <stop offset="1"   stop-color="#FFE4A0" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="clothShade" x1=".05" y1="1" x2=".85" y2=".05">
    <stop offset="0"   stop-color="#39325E" stop-opacity=".4"/>
    <stop offset=".34" stop-color="#3F3866" stop-opacity=".16"/>
    <stop offset="1"   stop-color="#3F3866" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="clothBack" x1=".9" y1="0" x2=".1" y2="1">
    <stop offset="0"   stop-color="#F6EAD2"/>
    <stop offset=".55" stop-color="#E2D2B6"/>
    <stop offset="1"   stop-color="#BCAE97"/>
  </linearGradient>

  <!-- ── materials the props and the litter share ────────────────────── -->
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stop-color="#6E7A84"/>
    <stop offset=".12"  stop-color="#C6D0D8"/>
    <stop offset=".26"  stop-color="#F2F6F8"/>
    <stop offset=".42"  stop-color="#9EAAB4"/>
    <stop offset=".62"  stop-color="#D6DEE4"/>
    <stop offset=".8"   stop-color="#7E8A94"/>
    <stop offset="1"    stop-color="#56626C"/>
  </linearGradient>
  <linearGradient id="foil" x1="0" y1="0" x2="1" y2=".3">
    <stop offset="0"   stop-color="#8E98A4"/>
    <stop offset=".2"  stop-color="#E8EEF4"/>
    <stop offset=".38" stop-color="#AAB6C0"/>
    <stop offset=".58" stop-color="#F4F8FC"/>
    <stop offset=".78" stop-color="#96A2AE"/>
    <stop offset="1"   stop-color="#C8D2DA"/>
  </linearGradient>
  <linearGradient id="wicker" x1=".85" y1="0" x2=".15" y2=".9">
    <stop offset="0"   stop-color="#E0B66E"/>
    <stop offset=".45" stop-color="#C2934E"/>
    <stop offset="1"   stop-color="#8A6430"/>
  </linearGradient>
  <linearGradient id="bark" x1="1" y1="0" x2="0" y2="0">
    <stop offset="0"   stop-color="#9A7A54"/>
    <stop offset=".2"  stop-color="#6E5438"/>
    <stop offset=".55" stop-color="#4A3726"/>
    <stop offset="1"   stop-color="#33261A"/>
  </linearGradient>

  <!-- a sphere lit from the upper right, with the sky bouncing back into
       its lower left — that second term is what stops a ball reading as a
       flat disc with a dot on it -->
  <radialGradient id="ballLight" cx=".72" cy=".24" r=".92">
    <stop offset="0"   stop-color="#FFFBE8" stop-opacity=".85"/>
    <stop offset=".3"  stop-color="#FFF4D0" stop-opacity=".2"/>
    <stop offset=".62" stop-color="#2A3A52" stop-opacity=".1"/>
    <stop offset=".88" stop-color="#22324A" stop-opacity=".42"/>
    <stop offset="1"   stop-color="#6E90B4" stop-opacity=".3"/>
  </radialGradient>

  <!-- sky, seen through a gap in the leaves. It is brighter than the
       sky at the horizon because you are looking up through it. -->
  <radialGradient id="skyHole" cx=".4" cy=".35" r=".75">
    <stop offset="0"   stop-color="#FFF8E0"/>
    <stop offset=".55" stop-color="#E8EEDC"/>
    <stop offset="1"   stop-color="#C6D6DC"/>
  </radialGradient>

  <!-- one blob of dapple: soft because of what is inside it -->
  <radialGradient id="dappleG" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stop-color="#FFF6D2"/>
    <stop offset=".46" stop-color="#FFEFB8" stop-opacity=".7"/>
    <stop offset="1"   stop-color="#FFE9A4" stop-opacity="0"/>
  </radialGradient>

  <!-- ── blur is depth, not decoration ───────────────────────────────── -->
  <filter id="softSm" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="5"/></filter>
  <filter id="softMd" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="11"/></filter>
  <filter id="shadeSoft" x="-30%" y="-140%" width="160%" height="380%">
    <feGaussianBlur stdDeviation="21"/></filter>
  <filter id="shadeCore" x="-30%" y="-140%" width="160%" height="380%">
    <feGaussianBlur stdDeviation="9"/></filter>
  <filter id="fgSoft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="9"/></filter>
  <filter id="hazeSoft" x="-20%" y="-30%" width="140%" height="160%">
    <feGaussianBlur stdDeviation="7"/></filter>
  <filter id="filmGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope=".5" intercept="-.19"/></feComponentTransfer>
  </filter>

  <!-- in millimetres, because that is the space the basket is drawn in -->
  <linearGradient id="mownFadeG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#000000"/>
    <stop offset=".12"  stop-color="#4A4A4A"/>
    <stop offset=".42"  stop-color="#FFFFFF"/>
    <stop offset="1"    stop-color="#FFFFFF"/>
  </linearGradient>
  <mask id="mownFade">
    <rect y="232" width="1200" height="668" fill="url(#mownFadeG)"/>
  </mask>

  <clipPath id="basketClip"><path d="M-165 0 L165 0 L200 -248 L-200 -248 Z"/></clipPath>
  <clipPath id="clothClip"><path d="%%CLOTH_OUTLINE%%"/></clipPath>
</defs>
"""

BODY_A = r"""
<!-- ══════════ 1. SKY ══════════
     No clouds. The sun is a low disc just off the top-right corner and
     everything the sky does here is that one glow and the haze it lights
     along the horizon. -->
<rect width="1200" height="900" fill="url(#sky)"/>
<rect width="1200" height="420" fill="url(#sunGlow)"/>
<rect y="60" width="1200" height="200" fill="url(#skyHaze)"/>

<!-- ══════════ 2. A KITE ══════════
     There are people in this park. Drawing them at this distance would
     make two ambiguous smudges; the kite says it instead, and the string
     running off toward the far side says who is holding it. -->
<g class="kite" transform="translate(386,122)">
  <path d="M0 -30 L21 0 L0 34 L-21 0 Z" fill="#E45B4A"/>
  <path d="M0 -30 L21 0 L0 34 Z" fill="#C6392B"/>
  <path d="M0 -30 L0 34 M-21 0 L21 0" stroke="#F8D8A0" stroke-opacity=".8" stroke-width="1.4"/>
  <path d="M0 34 q10 18 -4 30 q-14 12 -4 28" fill="none" stroke="#E8B34A" stroke-width="2.2"/>
  <path d="M-6 47 l12 4 M-9 66 l12 4" stroke="#7FC2E8" stroke-width="3" stroke-linecap="round"/>
</g>
<path d="M377 165 C 411 197, 447 220, 473 245" fill="none"
      stroke="#F4EBD4" stroke-opacity=".42" stroke-width="1.2"/>

<!-- ══════════ 3. THE FAR SIDE OF THE PARK ══════════
     Three depths of treeline. Distance takes contrast out and pushes
     colour toward the blue of the air in between, so the furthest band is
     nearly a flat wash and only the nearest one has any modelling. -->
<g filter="url(#hazeSoft)" opacity=".95">
  <path d="M-20 244 q60 -40 118 -8 q54 -46 128 -14 q46 -34 104 -6 q70 -44 150 -8
           q52 -38 126 -10 q66 -40 140 -4 q58 -32 128 -6 q54 -30 146 2 v66 H-20 Z"
        fill="#7E9EA6"/>
</g>
<g filter="url(#hazeSoft)" opacity=".92">
  <path d="M-20 258 q74 -48 142 -12 q62 -40 132 -10 q54 -34 118 -4 q78 -42 152 -6
           q60 -34 132 -8 q70 -36 156 0 q54 -24 120 -4 q40 -14 90 0 v58 H-20 Z"
        fill="#5C8270"/>
</g>
<g>
  <path d="M-20 278 q82 -42 156 -10 q70 -36 144 -8 q58 -28 128 -2 q84 -38 164 -4
           q66 -28 140 -6 q76 -30 168 4 q58 -18 130 -2 q44 -8 96 4 v46 H-20 Z"
        fill="#4C7550"/>
  <path d="M-20 292 q96 -26 178 -4 q80 -22 158 -4 q64 -16 138 2 q92 -20 176 4
           q72 -14 152 2 q84 -12 178 10 v30 H-20 Z" fill="#3E6642" opacity=".8"/>
</g>

<!-- ══════════ 3b. TREES ON THE FAR SIDE ══════════
     Sized off the horizon like everything else: at y=300 a metre is 48
     pixels, so a four-and-a-half metre tree comes out 210 tall. They are
     drained toward the blue of the air in between and given almost no
     internal contrast, because that is what four hundred metres does. -->
<g opacity=".92">
  <g transform="translate(78,302)">
    <ellipse cx="-34" cy="3" rx="72" ry="9" fill="#1E3F52" opacity=".22"/>
    <path d="M-7 0 q-4 -64 2 -96 h10 q6 32 2 96 Z" fill="#5E6E5A"/>
    <g fill="#6E8E6E">
      <ellipse cx="0" cy="-128" rx="62" ry="50"/><ellipse cx="-36" cy="-104" rx="44" ry="34"/>
      <ellipse cx="38" cy="-108" rx="46" ry="36"/><ellipse cx="6" cy="-168" rx="44" ry="34"/>
    </g>
    <g fill="#88A67E">
      <ellipse cx="18" cy="-142" rx="40" ry="30"/><ellipse cx="34" cy="-112" rx="30" ry="23"/>
      <ellipse cx="-4" cy="-176" rx="28" ry="21"/>
    </g>
    <g fill="#A8C08E" opacity=".8">
      <ellipse cx="30" cy="-150" rx="22" ry="16"/><ellipse cx="6" cy="-182" rx="16" ry="12"/>
    </g>
  </g>
  <g transform="translate(192,298)">
    <ellipse cx="-28" cy="3" rx="56" ry="8" fill="#1E3F52" opacity=".2"/>
    <path d="M-5 0 q-3 -52 1 -76 h8 q4 24 1 76 Z" fill="#5E6E5A"/>
    <g fill="#728E6E">
      <ellipse cx="0" cy="-104" rx="48" ry="38"/><ellipse cx="-28" cy="-84" rx="34" ry="26"/>
      <ellipse cx="30" cy="-88" rx="34" ry="27"/>
    </g>
    <g fill="#90AC80"><ellipse cx="16" cy="-118" rx="30" ry="22"/><ellipse cx="26" cy="-92" rx="22" ry="16"/></g>
    <g fill="#AEC492" opacity=".75"><ellipse cx="24" cy="-124" rx="16" ry="11"/></g>
  </g>
</g>

<!-- ══════════ 4. THE LAWN ══════════
     A mown park lawn, striped by the roller. Those stripes are depth
     lines, so every one of them runs to the same point on the horizon —
     they are the scene stating its own perspective before anything is
     put on top of it. -->
<rect y="232" width="1200" height="668" fill="url(#meadow)"/>
<g mask="url(#mownFade)">
%%MOWN%%
</g>
<rect y="232" width="1200" height="668" fill="url(#meadowSun)"/>
<rect y="232" width="1200" height="668" fill="url(#meadowCool)"/>

<!-- ══════════ 4b. THE PATH ══════════
     A tarmac path across the middle distance. It is here to do two jobs:
     break four hundred pixels of one green, and put a second warm colour
     into a picture that otherwise only has warmth in the sky. It runs
     ACROSS rather than away, so it does not fight the blanket for the
     vanishing point. -->
<g>
  <path d="M-40 516 C 300 486, 700 446, 1240 386 L1240 356 C 700 410, 300 442, -40 470 Z"
        fill="#B5A886"/>
  <path d="M-40 470 C 300 442, 700 410, 1240 356 l0 7 C 700 417, 300 449, -40 477 Z"
        fill="#D4C8A4"/>
  <path d="M-40 516 C 300 486, 700 446, 1240 386 l0 -8 C 700 438, 300 478, -40 508 Z"
        fill="#8E8264" opacity=".55"/>
  <path d="M-40 500 C 300 470, 700 432, 1240 372" fill="none"
        stroke="#D8CEAC" stroke-opacity=".5" stroke-width="5"/>
  <path d="M-40 492 C 300 462, 700 424, 1240 366" fill="none"
        stroke="#A99D7C" stroke-opacity=".35" stroke-width="3"/>
</g>

<!-- ══════════ 4c. A BIN ══════════
     Thirty metres from the picnic, which is the joke. -->
<g transform="translate(296,456)">
  <ellipse cx="-60" cy="4" rx="82" ry="11" fill="url(#shadow)" filter="url(#softSm)"/>
  <path d="M-32 0 q-5 -92 2 -108 h60 q7 16 2 108 Z" fill="#2E5E4A"/>
  <path d="M-32 0 q-5 -92 2 -108 h17 q-6 20 -3 108 Z" fill="#4A8068" opacity=".85"/>
  <path d="M20 -108 h8 q7 16 2 108 h-16 q5 -90 6 -108 Z" fill="#1E4434" opacity=".7"/>
  <path d="M-36 -108 h72 q4 0 4 7 h-80 q0 -7 4 -7 Z" fill="#234E3C"/>
  <path d="M-36 -118 h72 q6 0 6 8 q0 4 -6 4 h-72 q-6 0 -6 -4 q0 -8 6 -8 Z" fill="#37705A"/>
  <path d="M-36 -118 h72 q6 0 6 8 q-42 -6 -84 1 q0 -9 6 -9 Z" fill="#5E9A82" opacity=".8"/>
  <path d="M-20 -116 h40 v5 h-40 Z" fill="#12261E"/>
  <path d="M-30 -74 h56 v5 h-56 Z M-30 -52 h56 v5 h-56 Z" fill="#12281F" opacity=".35"/>
</g>

<!-- ══════════ 4d. WHOEVER THE KITE BELONGS TO ══════════
     At this distance a person is eighty-two pixels, so their head comes
     out ABOVE the horizon — which is correct, and is the thing that
     proves where the camera is standing: the lens is 1.43m up and they
     are 1.7m tall. Backlit, because the sun is behind them. -->
<g>
  <g transform="translate(452,306)">
    <ellipse cx="-42" cy="3" rx="44" ry="6" fill="#1E3F52" opacity=".3"/>
    <path d="M-7 0 l-3 -30 l7 -1 l4 31 Z M7 0 l4 -31 l7 1 l-4 30 Z" fill="#2E4038"/>
    <path d="M-11 -30 q11 -4 22 0 l-2 -32 q-9 3 -18 0 Z" fill="#3A5246"/>
    <path d="M-9 -62 q9 3 18 0 l-1 -14 q-8 3 -16 0 Z" fill="#B23A2E"/>
    <path d="M-10 -62 q9 3 18 0 l0 -6 q-9 3 -18 0 Z" fill="#E4685C" opacity=".6"/>
    <path d="M8 -74 q10 4 16 14" fill="none" stroke="#3A5246" stroke-width="5" stroke-linecap="round"/>
    <path d="M-9 -74 q-8 6 -10 16" fill="none" stroke="#3A5246" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-81" r="7.5" fill="#4E3A2A"/>
    <path d="M4 -86 q6 2 6 7 q-1 5 -5 6 Z" fill="#8E6A46" opacity=".7"/>
  </g>
  <g transform="translate(496,302)">
    <ellipse cx="-38" cy="3" rx="40" ry="6" fill="#1E3F52" opacity=".28"/>
    <path d="M-6 0 l-4 -28 l6 -1 l5 29 Z M8 0 l3 -29 l6 1 l-3 28 Z" fill="#2E4038"/>
    <path d="M-10 -28 q11 -4 21 0 l-3 -30 q-8 3 -16 0 Z" fill="#2E5E8E"/>
    <path d="M-10 -28 q6 -2 11 -2 l-2 -30 q-4 1 -7 0 Z" fill="#4C84BA" opacity=".7"/>
    <path d="M-8 -58 q8 3 16 0 l-1 -13 q-7 3 -14 0 Z" fill="#E8D2A8"/>
    <path d="M9 -70 q9 8 9 18" fill="none" stroke="#2E5E8E" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-77" r="7" fill="#2E2018"/>
  </g>
  <g transform="translate(556,314)">
    <ellipse cx="-26" cy="2" rx="30" ry="5" fill="#1E3F52" opacity=".26"/>
    <path d="M-16 0 l-1 -12 l5 0 l1 12 Z M-4 0 l-1 -12 l5 0 l1 12 Z
             M10 0 l-1 -13 l5 0 l1 13 Z M19 0 l-1 -13 l5 0 l1 13 Z" fill="#4E3A26"/>
    <path d="M-19 -12 q20 -9 40 -1 q4 9 -2 13 q-20 6 -38 0 q-5 -5 0 -12 Z" fill="#6E5236"/>
    <path d="M-19 -12 q20 -9 40 -1 q-20 0 -40 5 Z" fill="#8E6E48" opacity=".8"/>
    <path d="M21 -13 q10 -3 13 -10 q4 -8 -2 -10 q-7 -1 -10 6 Z" fill="#6E5236"/>
    <circle cx="30" cy="-26" r="6.5" fill="#6E5236"/>
    <path d="M34 -31 q6 1 6 6 q-1 4 -5 4 Z" fill="#8E6E48" opacity=".8"/>
    <path d="M-19 -10 q-12 -4 -14 -14" fill="none" stroke="#6E5236" stroke-width="4" stroke-linecap="round"/>
  </g>
</g>

<!-- ══════════ 5. A BENCH, MIDDLE DISTANCE ══════════
     Sized off the horizon like everything else: at this height on the
     lawn the scale is (y-232)/668 of full size, which makes a park bench
     about forty pixels tall. Guessing that number is how a scene ends up
     with furniture the wrong size for its own ground. -->
<g opacity=".95">
  <ellipse cx="150" cy="352" rx="62" ry="8" fill="url(#shadow)" filter="url(#softSm)"/>
  <path d="M122 318 h84 v5 h-84 Z" fill="#7E5C3A"/>
  <path d="M122 326 h84 v5 h-84 Z" fill="#8A6742"/>
  <path d="M124 334 h80 v5 h-80 Z" fill="#6E4F32"/>
  <path d="M126 342 h76 v4 h-76 Z" fill="#5E432A"/>
  <path d="M128 312 h74 v4 h-74 Z" fill="#956E46"/>
  <path d="M124 302 h78 v4 h-78 Z" fill="#8A6742"/>
  <path d="M122 300 h5 v48 h-5 Z M247 300 h5 v48 h-5 Z" fill="#3E4A44"/>
  <path d="M120 344 h12 v6 h-12 Z M242 344 h12 v6 h-12 Z" fill="#33403A"/>
</g>
"""

BODY_B = r"""
<!-- ══════════ 6. THE SWARD ══════════
     A dozen clumps of grass, authored once here at a unit size and then
     placed with <use>. Nothing is drawn on the open lawn: its gradient,
     the mown stripes, the tree's shadow, the dapple and the flowers were
     already carrying it, and the four thousand blades that used to sit
     underneath were 93 KB of texture nobody could see.

     What survives is the fringe along the hem of the blanket, which is
     most of what stops the cloth reading as a sticker, and a tuft at the
     foot of the tree. Those are still SAMPLED rather than placed — a
     clump of fixed real height is scaled by (y-232), which is what
     1/depth means once the horizon is fixed, and the number of them per
     unit of SCREEN falls off as (y-232)^-3, because that is how much
     ground a pixel covers up there. Scatter grass evenly instead and the
     lawn stops being a plane and becomes wallpaper. -->
<defs>
%%GRASS_FAR%%
</defs>
<g>
%%FLOWERS%%
</g>

<!-- ══════════ 7. THE TREE ══════════
     It is here to do a job: it stands between the sun and the blanket, so
     the gaps in it are what put the dapple on the cloth. Its crown is
     built in four tones — the mass in its own shade, the body, the
     sunlit crowns pulled up and to the RIGHT toward the sun, and loose
     leaves along the underside breaking the outline. A canopy with a
     smooth edge reads as broccoli. -->
<g class="prop" id="tree" tabindex="0" role="button"
   aria-label="The tree. Click it and it lets go of a few leaves.">
  <ellipse cx="1040" cy="498" rx="180" ry="26" fill="url(#shadow)" filter="url(#softMd)"/>
  <path d="M1196 496 q-8 -120 -22 -196 q-6 -34 4 -96 l72 -4 q-10 64 -6 100
           q10 84 16 196 Z" fill="url(#bark)"/>
  <path d="M1174 300 q-14 -40 -46 -66 q-30 -22 -48 -26 l10 -28 q34 10 62 34
           q30 26 42 62 Z" fill="url(#bark)"/>
  <path d="M1180 250 q28 -36 64 -52 l12 22 q-32 16 -54 48 Z" fill="#5E4630"/>
  <g stroke="#2A1F15" stroke-opacity=".5" stroke-width="2" fill="none">
    <path d="M1186 480 q6 -100 -4 -168 M1206 484 q4 -96 -6 -170 M1224 470 q0 -80 -6 -150"/>
  </g>
  <g stroke="#B08A5E" stroke-opacity=".45" stroke-width="2.4" fill="none">
    <path d="M1240 486 q2 -96 -6 -178 M1252 300 q-4 -60 -2 -96"/>
  </g>
  <g class="canopy">
%%CANOPY_DARK%%
    <!-- limbs showing through the gaps, and three holes of sky -->
    <g fill="none" stroke="#2A2014" stroke-linecap="round" opacity=".85">
      <path d="M1196 330 q-52 -46 -96 -62 q-46 -16 -84 -14" stroke-width="11"/>
      <path d="M1186 268 q-64 -30 -122 -30 q-52 0 -92 16" stroke-width="12"/>
      <path d="M1176 214 q-58 -26 -110 -22 q-44 4 -78 22" stroke-width="10"/>
      <path d="M1100 268 q-30 -40 -74 -56 q-38 -14 -70 -12" stroke-width="8"/>
      <path d="M1064 238 q-44 6 -80 30" stroke-width="7"/>
      <path d="M1016 254 q-36 -26 -78 -30" stroke-width="6.5"/>
      <path d="M978 224 q-40 4 -70 26" stroke-width="5.5"/>
    </g>
    <g fill="none" stroke="#7E6440" stroke-opacity=".5" stroke-linecap="round">
      <path d="M1196 326 q-50 -44 -94 -60" stroke-width="5"/>
      <path d="M1186 264 q-62 -28 -118 -28" stroke-width="4"/>
      <path d="M1100 264 q-28 -36 -70 -52" stroke-width="3"/>
    </g>
    <g fill="url(#skyHole)">
      <ellipse cx="1004" cy="180" rx="34" ry="22" transform="rotate(-18 1004 180)"/>
      <ellipse cx="864" cy="214" rx="26" ry="17" transform="rotate(12 864 214)"/>
      <ellipse cx="1136" cy="226" rx="22" ry="15" transform="rotate(-8 1136 226)"/>
      <ellipse cx="946" cy="128" rx="20" ry="13" transform="rotate(24 946 128)"/>
    </g>
    <!-- and the sunlit foliage in front of all of it, which is what turns
         the limbs into glimpses rather than a branch lying on the tree -->
%%CANOPY_LIGHT%%
%%CANOPY_LEAVES%%
    <!-- three leaves that are only waiting to be let go of -->
    <g class="leaffall lf0"><path d="M986 300 q9 -7 25 0 q-16 9 -25 0Z" fill="#6E9E34"/></g>
    <g class="leaffall lf1"><path d="M1054 262 q10 -8 27 0 q-17 10 -27 0Z" fill="#87B23C"/></g>
    <g class="leaffall lf2"><path d="M908 328 q8 -7 23 0 q-15 8 -23 0Z" fill="#5E8E2E"/></g>
  </g>
  <!-- the grass the trunk stands in, drawn after it so it overlaps the
       foot — a trunk that meets the lawn on a clean line looks pasted -->
%%TRUNK_TUFT%%
</g>
"""


# ══ THE TURNED-BACK CORNER ═══════════════════════════════════════════════
# The far-left corner is folded over onto the cloth. A fold is a REFLECTION
# in the fold line, so the corner is reflected rather than drawn where it
# looks about right — get this wrong and the flap is a triangle that could
# not have come from this blanket.
def corner_flap():
    cx, cy = BF_L, BF_Y                                   # the corner itself
    p1 = (BF_L + 126.0, BF_Y + 1.0)                       # hinge, on the far edge
    t = .30                                               # hinge, down the left edge
    p2 = (BF_L + t * (BN_L - BF_L), BF_Y + t * (BN_Y - BF_Y))
    ax, ay = p2[0] - p1[0], p2[1] - p1[1]
    L2 = ax * ax + ay * ay
    dx, dy = cx - p1[0], cy - p1[1]
    k = (dx * ax + dy * ay) / L2
    fx, fy = p1[0] + k * ax, p1[1] + k * ay               # foot of perpendicular
    rx, ry = 2 * fx - cx, 2 * fy - cy                     # the reflected corner
    mid = ((p1[0] + rx) / 2, (p1[1] + ry) / 2)
    mid2 = ((rx + p2[0]) / 2, (ry + p2[1]) / 2)
    # a real fold bellies slightly rather than lying dead flat
    face = (f'M{f(p1[0])} {f(p1[1])}'
            f'Q{f(mid[0]+7)} {f(mid[1]-9)} {f(rx)} {f(ry)}'
            f'Q{f(mid2[0]-8)} {f(mid2[1]+6)} {f(p2[0])} {f(p2[1])}Z')
    hinge = f'M{f(p1[0])} {f(p1[1])}L{f(p2[0])} {f(p2[1])}'
    return face, hinge, (rx, ry), p1, p2


BODY_C = r"""
<!-- ══════════════════════════════════════════════════════════════════════
     8. THE BLANKET

     This is the stage everything else stands on, so it is the one thing in
     the picture that is solved rather than drawn.

     The horizon is at y=232, so the vanishing point is (600, 232) and the
     blanket's two side edges run to it. Its far edge is placed so the
     cloth comes out SQUARE on the ground rather than square on the page —
     a picnic blanket is square, and the check is what gives it away if it
     isn't. The rows compress toward the far edge on a 1/depth law, not in
     even steps, which is why row nine and row ten are seventeen pixels
     apart and rows one and two are fifty-seven.

     And it is a WEAVE, not a chequerboard: a pale ground, red bands one
     way, the same red bands the other, and the crossings come out darker
     on their own. That is how gingham actually works, and it is less
     drawing than alternating squares would have been.
     ══════════════════════════════════════════════════════════════════════ -->
<g>
  <!-- the cloth sits ON the grass: it stops the light reaching under its
       far edge, and the sun being low and right makes that contact line
       the darkest thing on the lawn -->
  <path d="%%CLOTH_OUTLINE%%" fill="#1B3B44" opacity=".34"
        filter="url(#softMd)" transform="translate(-14,9)"/>
  <g class="cloth">
    <g clip-path="url(#clothClip)">
      <rect x="40" y="540" width="1140" height="380" fill="url(#clothLight)"/>
%%GINGHAM%%
      <!-- the light the cloth is wearing, laid over the weave rather than
           under it, because a shadow falls on the pattern -->
      <rect x="40" y="540" width="1140" height="380" fill="url(#clothWarm)"/>
      <rect x="40" y="540" width="1140" height="380" fill="url(#clothShade)"/>
      <!-- folds: cloth that has been carried here in a bag. They run with
           the weave, because a crease follows the threads -->
      <g filter="url(#softSm)" opacity=".5">
        <path d="M496 570 L466 890 l26 0 L520 570 Z" fill="#FFFFFF" opacity=".5"/>
        <path d="M520 570 L492 890 l18 0 L536 570 Z" fill="#4A4270" opacity=".35"/>
        <path d="M770 570 L826 890 l24 0 L792 570 Z" fill="#FFFFFF" opacity=".4"/>
        <path d="M792 570 L850 890 l16 0 L808 570 Z" fill="#4A4270" opacity=".3"/>
        <path d="M60 744 L1150 744 l0 16 L60 760 Z" fill="#4A4270" opacity=".22"/>
        <path d="M60 736 L1150 736 l0 9 L60 745 Z" fill="#FFFFFF" opacity=".32"/>
      </g>
    </g>
    <!-- hem -->
    <path d="%%CLOTH_OUTLINE%%" fill="none" stroke="#9A8C74" stroke-opacity=".55" stroke-width="2.6"/>
    <path d="%%CLOTH_OUTLINE%%" fill="none" stroke="#FFF6DC" stroke-opacity=".5" stroke-width="1.1"
          transform="translate(1.5,-1.5)"/>
  </g>

  <!-- the far-left corner, turned back on itself. The flap is the corner
       REFLECTED in the fold line, so it is a shape this blanket could
       actually make; the pale side is the plain backing. -->
  <g class="cornerFlap prop" id="gustCorner" tabindex="0" role="button"
     aria-label="The turned-back corner of the blanket. Click to send a gust across it.">
    <path d="%%FLAP%%" fill="#2E3A52" opacity=".3" filter="url(#softSm)" transform="translate(-9,7)"/>
    <path d="%%FLAP%%" fill="url(#clothBack)"/>
    <path d="%%HINGE%%" fill="none" stroke="#B5A78F" stroke-opacity=".7" stroke-width="2.4"/>
    <path d="%%HINGE%%" fill="none" stroke="#FFF8E4" stroke-opacity=".75" stroke-width="1.2"
          transform="translate(.8,-1.6)"/>
  </g>
</g>

"""


# ══ PLACING REAL OBJECTS ═════════════════════════════════════════════════
# Everything on the ground from here down is drawn in MILLIMETRES, at its
# real size, with its origin where it touches the ground — and then placed
# by a transform that works out the scale from the horizon:
#
#     pixels per metre  =  0.7 * (y - 232)
#
# which comes out of the camera the blanket was solved with (f=1150px, the
# near edge 2.5m away, the lens 1.43m off the grass). So a 400mm basket is
# literally 400 units wide in the drawing, and the picture decides how big
# that is. Nothing in this scene is sized by eye, which is why the hat, the
# football and the soup can are all in scale with each other and with the
# check of the cloth they are sitting on.
def place(x, y):
    k = 0.7 * (y - HORIZON) / 1000.0
    return f'transform="translate({f(x)},{f(y)}) scale({f(k,4)})"'

def sh(h, w, grad="shadow", op=1.0):
    """The cast shadow of something h tall and w wide, in the same mm.
    The sun is about 27 degrees up, so the shadow is twice the height of
    the thing that threw it, and it runs down and to the LEFT."""
    L = 2.0 * h
    cx, cy = -.93 * L / 2, .37 * L / 2
    ang = math.degrees(math.atan2(.37, -.93))
    return (f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(L/2 + w*.45)}" ry="{f(w*.44)}" '
            f'fill="url(#{grad})" opacity="{f(op,2)}" '
            f'transform="rotate({f(ang)} {f(cx)} {f(cy)})"/>')

def occ(w, ry=None):
    """Contact occlusion — the dark right where a thing meets the ground."""
    return f'<ellipse cx="0" cy="0" rx="{f(w*.55)}" ry="{f((ry or w*.16))}" fill="url(#occl)"/>'


def basket_weave():
    """A wicker basket is a weave too: uprights crossed by rows, and the
    rows step over and under alternate uprights. Drawn as plain bands it
    reads as a painted bucket."""
    out = []
    for i in range(-8, 9):                       # uprights
        x0 = i * 21.5
        out.append(f'<path d="M{f(x0*.82)} -12 L{f(x0)} -248" stroke="#8A6430" '
                   f'stroke-opacity=".5" stroke-width="7" fill="none"/>')
    for r in range(8):                           # rows
        y = -26 - r * 30
        t = (248 + y) / 248
        hw = 165 + 35 * (1 - (y / -248))
        for i in range(-8, 8):
            if (i + r) % 2:
                continue
            xa, xb = i * 21.5, (i + 1) * 21.5
            k = hw / 172.0
            out.append(f'<path d="M{f(xa*k)} {f(y)} Q{f((xa+xb)/2*k)} {f(y-13)} {f(xb*k)} {f(y)}" '
                       f'fill="none" stroke="#E0B66E" stroke-width="13" stroke-linecap="round"/>')
                       
            out.append(f'<path d="M{f(xa*k)} {f(y-3)} Q{f((xa+xb)/2*k)} {f(y-15)} {f(xb*k)} {f(y-3)}" '
                       f'fill="none" stroke="#F2D29A" stroke-opacity=".55" stroke-width="4"/>')
    return "\n    ".join(out)


def props():
    return f"""
<!-- ══════════════════════════════════════════════════════════════════════
     9. WHAT THE PICNIC BROUGHT WITH IT

     None of this is rubbish, and all of it is drawn in millimetres at its
     real size — the hat really is 380mm across and the football really is
     220 — so the only thing deciding how big each one looks is where on
     the lawn it is standing.
     ══════════════════════════════════════════════════════════════════════ -->

<!-- ── the basket ─────────────────────────────────────────────────────── -->
<g {place(408, 662)}>
  {sh(260, 400, 'shadowCloth')}
  {occ(400, 46)}
  <path d="M-165 0 L165 0 L200 -248 L-200 -248 Z" fill="url(#wicker)"/>
  <g clip-path="url(#basketClip)">
    {basket_weave()}
  </g>
  <path d="M-165 0 L-118 0 L-150 -248 L-200 -248 Z" fill="#5E4420" opacity=".42"/>
  <path d="M132 0 L165 0 L200 -248 L158 -248 Z" fill="#FFE2A8" opacity=".38"/>
  <ellipse cx="0" cy="-248" rx="200" ry="52" fill="#B98A46"/>
  <ellipse cx="0" cy="-252" rx="200" ry="52" fill="#D8A961"/>
  <ellipse cx="0" cy="-252" rx="200" ry="52" fill="none" stroke="#F6DCA6" stroke-opacity=".8" stroke-width="7"/>
  <ellipse cx="0" cy="-248" rx="168" ry="40" fill="#5A4322"/>
  <!-- the lid, one half tipped back, and a corner of cloth escaping -->
  <path d="M-196 -258 q94 -34 196 -34 q26 0 40 4 l-14 26 q-100 -16 -222 22 Z" fill="#C69A54"/>
  <path d="M-196 -258 q94 -34 196 -34" fill="none" stroke="#F4DAA4" stroke-opacity=".8" stroke-width="6"/>
  <g transform="rotate(-54 34 -262)">
    <path d="M34 -262 q96 -8 176 6 l-4 30 q-84 -18 -172 -8 Z" fill="#B98A46"/>
    <path d="M34 -262 q96 -8 176 6" fill="none" stroke="#EFD299" stroke-opacity=".7" stroke-width="6"/>
  </g>
  <path d="M-150 -248 q54 34 128 22 q64 -10 96 -36 q-18 58 -96 70 q-84 12 -128 -56 Z"
        fill="#F2E6CE"/>
  <path d="M-150 -248 q54 34 128 22 q64 -10 96 -36 q-10 30 -44 50 q-70 -6 -180 -36 Z"
        fill="#C0392B" opacity=".42"/>
  <path d="M-114 -212 q56 22 118 12" fill="none" stroke="#C0392B" stroke-opacity=".4" stroke-width="9"/>
</g>

<!-- ── the flask and a cup of tea ─────────────────────────────────────── -->
<g {place(258, 708)}>
  {sh(280, 92)}
  {occ(96, 16)}
  <path d="M-46 0 h92 v-232 h-92 Z" fill="url(#steel)"/>
  <ellipse cx="0" cy="-232" rx="46" ry="11" fill="#C6D0D8"/>
  <path d="M-46 -120 h92 v46 h-92 Z" fill="#2E6B4E"/>
  <path d="M-46 -120 h13 v46 h-13 Z" fill="#6FA98A" opacity=".55"/>
  <path d="M-46 -120 h92" fill="none" stroke="#9AD8B8" stroke-opacity=".6" stroke-width="3"/>
  <path d="M-40 -240 h80 v-32 q0 -10 -12 -10 h-56 q-12 0 -12 10 Z" fill="#3A4450"/>
  <path d="M-40 -240 h16 v-40 h-10 q-6 2 -6 10 Z" fill="#78848E" opacity=".7"/>
  <ellipse cx="0" cy="-282" rx="40" ry="10" fill="#4E5A66"/>
  <ellipse cx="0" cy="-284" rx="40" ry="10" fill="#5E6A76"/>
  <path d="M30 -232 v232" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="7" fill="none"/>
  <path d="M-34 -232 v232" stroke="#2E3840" stroke-opacity=".35" stroke-width="10" fill="none"/>
</g>
<g {place(344, 748)}>
  {sh(84, 96, 'shadowCloth')}
  {occ(96, 16)}
  <path d="M-45 0 q-6 -56 2 -76 h86 q8 20 2 76 Z" fill="#F4F6F4"/>
  <path d="M-45 0 q-6 -56 2 -76 h22 q-6 22 -2 76 Z" fill="#FFFFFF"/>
  <path d="M34 -76 q8 20 2 76 h-20 q6 -52 -0 -76 Z" fill="#C2CCC8" opacity=".7"/>
  <ellipse cx="0" cy="-76" rx="45" ry="12" fill="#DCE4E0"/>
  <ellipse cx="0" cy="-76" rx="45" ry="12" fill="none" stroke="#2E5E8E" stroke-opacity=".55" stroke-width="5"/>
  <ellipse cx="0" cy="-74" rx="35" ry="8.5" fill="#8A5A2E"/>
  <ellipse cx="-9" cy="-76" rx="15" ry="3.6" fill="#C48A50" opacity=".55"/>
  <path d="M44 -58 q34 -4 32 24 q-2 24 -32 22" fill="none" stroke="#F4F6F4" stroke-width="12"/>
  <g class="steam" style="animation-delay:.4s">
    <path d="M-8 -84 q16 -22 0 -44 q-14 -20 4 -38" fill="none" stroke="#FFF6E2"
          stroke-opacity=".8" stroke-width="7" stroke-linecap="round"/>
  </g>
  <g class="steam" style="animation-delay:3.1s">
    <path d="M16 -82 q14 -20 2 -40" fill="none" stroke="#FFF6E2"
          stroke-opacity=".7" stroke-width="6" stroke-linecap="round"/>
  </g>
</g>

<!-- ── strawberries ───────────────────────────────────────────────────── -->
<g {place(624, 648)}>
  {sh(80, 220, 'shadowCloth')}
  {occ(220, 26)}
  <path d="M-110 -18 q0 -52 110 -52 q110 0 110 52 q-12 20 -110 20 q-98 0 -110 -20 Z" fill="#E4E8EA"/>
  <path d="M-110 -18 q12 20 110 20 q98 0 110 -20 q0 22 -110 22 q-110 0 -110 -22 Z" fill="#A8B2B8"/>
  <ellipse cx="0" cy="-70" rx="110" ry="30" fill="#F4F7F8"/>
  <ellipse cx="0" cy="-70" rx="110" ry="30" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="5"/>
  <ellipse cx="0" cy="-68" rx="92" ry="23" fill="#C8D2D6"/>
  <g>
    <path d="M-52 -84 q22 -16 40 2 q10 22 -20 32 q-30 -6 -20 -34 Z" fill="#D8322A"/>
    <path d="M-52 -84 q22 -16 40 2 q-4 6 -20 6 q-14 0 -20 -8 Z" fill="#F0685C"/>
    <path d="M-40 -92 q14 -10 26 -2 q-12 8 -26 2 Z" fill="#3F7A2E"/>
    <path d="M6 -90 q24 -18 42 2 q10 24 -22 34 q-32 -6 -20 -36 Z" fill="#C0392B"/>
    <path d="M6 -90 q24 -18 42 2 q-6 6 -22 6 q-14 0 -20 -8 Z" fill="#E4564A"/>
    <path d="M20 -98 q14 -10 26 -2 q-12 8 -26 2 Z" fill="#478A32"/>
    <path d="M-18 -74 q24 -16 42 4 q8 22 -22 30 q-30 -8 -20 -34 Z" fill="#E4453A"/>
    <path d="M-18 -74 q24 -16 42 4 q-6 6 -22 5 q-14 -1 -20 -9 Z" fill="#FA8074"/>
    <path d="M56 -76 q20 -14 36 2 q8 20 -18 28 q-28 -6 -18 -30 Z" fill="#D8322A"/>
    <path d="M-86 -72 q18 -12 32 2 q8 18 -16 26 q-26 -6 -16 -28 Z" fill="#C0392B"/>
  </g>
</g>

<!-- ── someone's paperback, face down so it keeps its place ────────────── -->
<g {place(820, 672)} >
  <g transform="rotate(-9)">
    {sh(38, 300, 'shadowCloth')}
    {occ(300, 22)}
    <path d="M-150 0 q6 -34 4 -46 l292 -10 q4 14 2 46 Z" fill="#E8E2D2"/>
    <path d="M-146 -46 l292 -10 q-146 -22 -292 10 Z" fill="#FAF6EA"/>
    <g stroke="#C8C0AE" stroke-width="2.4">
      <path d="M-144 -38 l288 -10 M-144 -30 l288 -10 M-145 -22 l289 -10 M-146 -14 l290 -10"/>
    </g>
    <path d="M-8 -50 q10 -22 8 -34 l14 42 Z" fill="#2E5E8E"/>
    <path d="M-150 0 q6 -34 4 -46 l32 -1 q-4 16 -2 47 Z" fill="#B23A2E"/>
    <path d="M-150 0 q6 -34 4 -46 l10 0 q-4 16 -2 46 Z" fill="#D8584A"/>
  </g>
</g>

<!-- ── the hat ────────────────────────────────────────────────────────── -->
<g {place(196, 840)}>
  {sh(110, 380, 'shadowCloth')}
  <ellipse cx="0" cy="-8" rx="190" ry="62" fill="#1F2A46" opacity=".26"/>
  <ellipse cx="0" cy="-22" rx="190" ry="62" fill="#D6B26A"/>
  <ellipse cx="0" cy="-26" rx="190" ry="62" fill="#E8C87E"/>
  <g fill="none" stroke="#B08F48" stroke-opacity=".6" stroke-width="3">
    <ellipse cx="0" cy="-26" rx="160" ry="52"/><ellipse cx="0" cy="-26" rx="128" ry="42"/>
    <ellipse cx="0" cy="-26" rx="96" ry="31"/><ellipse cx="0" cy="-26" rx="64" ry="21"/>
  </g>
  <ellipse cx="0" cy="-26" rx="190" ry="62" fill="none" stroke="#FFF0BE" stroke-opacity=".7" stroke-width="5"/>
  <path d="M-96 -34 q0 -76 96 -76 q96 0 96 76 q-40 26 -96 26 q-56 0 -96 -26 Z" fill="#E0BC70"/>
  <path d="M-96 -34 q0 -76 96 -76 q22 0 40 5 q-72 18 -70 90 q-42 -4 -66 -19 Z" fill="#C49C50" opacity=".55"/>
  <path d="M36 -110 q60 14 60 76 q-22 14 -54 21 q14 -66 -6 -97 Z" fill="#FFE8AA" opacity=".55"/>
  <path d="M-98 -52 q42 22 98 22 q56 0 98 -22 l2 22 q-42 22 -100 22 q-58 0 -100 -22 Z" fill="#2E5E8E"/>
  <path d="M-98 -52 q42 22 98 22 q56 0 98 -22 l1 10 q-44 22 -99 22 q-55 0 -99 -22 Z" fill="#4C84BA" opacity=".7"/>
</g>

<!-- ── a football, out on the grass ───────────────────────────────────── -->
<g {place(1104, 606)}>
  {sh(220, 220)}
  {occ(200, 24)}
  <circle cx="0" cy="-110" r="110" fill="#EDEFF0"/>
  <path d="M-110 -110 a110 110 0 0 1 86 -107 a110 110 0 0 0 -60 190 Z" fill="#B9C0C6" opacity=".7"/>
  <path d="M42 -212 a110 110 0 0 1 66 76 a110 110 0 0 0 -52 -88 Z" fill="#FFFFFF"/>
  <circle cx="0" cy="-110" r="110" fill="url(#ballLight)"/>
  <g fill="#2B3138">
    <path d="M0 -158 l40 30 l-15 47 h-50 l-15 -47 Z"/>
    <path d="M-44 -196 l-30 22 l14 30 l42 -30 Z" opacity=".9"/>
    <path d="M60 -180 l26 30 l-22 26 l-32 -32 Z" opacity=".85"/>
    <path d="M-38 -34 l14 -26 h46 l12 25 q-36 12 -72 1 Z" opacity=".8"/>
  </g>
</g>

<!-- ── lemonade ───────────────────────────────────────────────────────── -->
<g {place(748, 800)}>
  {sh(262, 84, 'shadowCloth')}
  {occ(90, 14)}
  <path d="M-42 0 h84 v-150 q0 -34 -16 -52 l-8 -46 h-36 l-8 46 q-16 18 -16 52 Z" fill="#F2C24A" opacity=".88"/>
  <path d="M-42 0 h22 v-150 q0 -34 12 -52 l4 -46 h-18 l-8 46 q-16 18 -16 52 Z" fill="#FFF0A8" opacity=".8"/>
  <path d="M42 0 h-16 v-150 q0 -34 -10 -52 l-4 -46 h14 l8 46 q16 18 16 52 Z" fill="#B8862A" opacity=".55"/>
  <path d="M-26 -248 h52 v-16 h-52 Z" fill="#C8952E"/>
  <path d="M-26 -264 h52 v-18 q0 -6 -8 -6 h-36 q-8 0 -8 6 Z" fill="#E8D8B8"/>
  <path d="M-26 -264 h14 v-24 h-6 q-8 0 -8 6 Z" fill="#FFFAEC"/>
  <path d="M-40 -136 h80 v70 h-80 Z" fill="#FAF2DC"/>
  <path d="M-40 -136 h18 v70 h-18 Z" fill="#FFFFFF" opacity=".8"/>
  <path d="M-30 -122 h60 M-30 -108 h44 M-30 -94 h52" stroke="#C88A2E" stroke-width="6" stroke-linecap="round"/>
  <path d="M-30 -80 h36" stroke="#2E5E8E" stroke-opacity=".7" stroke-width="6" stroke-linecap="round"/>
</g>
<g {place(690, 818)}>
  {sh(100, 76, 'shadowCloth')}
  {occ(74, 12)}
  <path d="M-34 0 q-4 -70 2 -92 h64 q6 22 2 92 Z" fill="#DCE8EE" opacity=".62"/>
  <path d="M-32 -30 q-2 -44 0 -60 h60 q2 16 0 60 Z" fill="#F2C24A" opacity=".8"/>
  <ellipse cx="0" cy="-92" rx="34" ry="9" fill="#EEF6FA" opacity=".8"/>
  <ellipse cx="0" cy="-90" rx="30" ry="7" fill="#F8D96A" opacity=".9"/>
  <path d="M-26 -88 q-4 50 -2 84" fill="none" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="7"/>
</g>

<!-- ── the speaker, the one thing here with a switch ───────────────────── -->
<g class="prop" id="speaker" tabindex="0" role="button"
   aria-label="A portable speaker. Click to wake it up." {place(930, 736)}>
  {sh(104, 240, 'shadowCloth')}
  {occ(240, 24)}
  <g id="speakerGlow">
    <ellipse cx="0" cy="-52" rx="230" ry="120" fill="#4CC8F0" opacity=".2"/>
  </g>
  <path d="M-120 0 q-8 -104 0 -104 h240 q8 0 0 104 Z" fill="#59636F"/>
  <path d="M-120 -104 h240 q6 0 4 26 h-248 q-2 -26 4 -26 Z" fill="#8792A0"/>
  <path d="M-120 -104 h30 q-4 12 -3 104 h-27 q-8 -104 0 -104 Z" fill="#96A2AE" opacity=".55"/>
  <path d="M96 -104 h24 q8 0 0 104 h-22 q3 -92 -2 -104 Z" fill="#232B34" opacity=".7"/>
  <path d="M-104 -90 h208 v72 h-208 Z" fill="#333C46"/>
  <path d="M-104 -90 h208 v10 h-208 Z" fill="#4A545F"/>
  <circle cx="-136" cy="-22" r="7" fill="#7FE8A8"/>
  <circle cx="-136" cy="-52" r="9" fill="#46505C"/>
  <circle cx="-136" cy="-52" r="9" fill="none" stroke="#A2AEBA" stroke-opacity=".7" stroke-width="2"/>
  <g fill="#5C6874">
    <circle cx="-86" cy="-74" r="5"/><circle cx="-62" cy="-74" r="5"/><circle cx="-38" cy="-74" r="5"/>
    <circle cx="-14" cy="-74" r="5"/><circle cx="10" cy="-74" r="5"/><circle cx="34" cy="-74" r="5"/>
    <circle cx="58" cy="-74" r="5"/><circle cx="82" cy="-74" r="5"/>
    <circle cx="-86" cy="-54" r="5"/><circle cx="-62" cy="-54" r="5"/><circle cx="-38" cy="-54" r="5"/>
    <circle cx="-14" cy="-54" r="5"/><circle cx="10" cy="-54" r="5"/><circle cx="34" cy="-54" r="5"/>
    <circle cx="58" cy="-54" r="5"/><circle cx="82" cy="-54" r="5"/>
    <circle cx="-86" cy="-34" r="5"/><circle cx="-62" cy="-34" r="5"/><circle cx="-38" cy="-34" r="5"/>
    <circle cx="-14" cy="-34" r="5"/><circle cx="10" cy="-34" r="5"/><circle cx="34" cy="-34" r="5"/>
    <circle cx="58" cy="-34" r="5"/><circle cx="82" cy="-34" r="5"/>
  </g>
  <g id="speakerBars" fill="#4CC8F0">
    <rect class="bar" x="-40" y="-84" width="12" height="60" style="animation-delay:0s"/>
    <rect class="bar" x="-20" y="-84" width="12" height="60" style="animation-delay:.14s"/>
    <rect class="bar" x="0"   y="-84" width="12" height="60" style="animation-delay:.28s"/>
    <rect class="bar" x="20"  y="-84" width="12" height="60" style="animation-delay:.09s"/>
    <rect class="bar" x="40"  y="-84" width="12" height="60" style="animation-delay:.22s"/>
  </g>
  <circle cx="-138" cy="-64" r="0"/>
  <g id="notes" fill="#8FE2FA">
    <g class="note" style="animation-delay:0s">
      <path d="M96 -120 v-52 l30 -8 v52 Z"/><ellipse cx="88" cy="-118" rx="14" ry="10"/>
    </g>
    <g class="note" style="animation-delay:1.1s">
      <path d="M40 -132 v-44 l26 -7 v44 Z"/><ellipse cx="33" cy="-130" rx="12" ry="9"/>
    </g>
    <g class="note" style="animation-delay:2.2s">
      <path d="M130 -110 v-40 l24 -6 v40 Z"/><ellipse cx="124" cy="-108" rx="11" ry="8"/>
    </g>
  </g>
</g>
"""


def litter():
    return f"""
<!-- ══════════════════════════════════════════════════════════════════════
     10. THE LITTER — the five clues

     Same millimetres, same light. Two of these needed thinking about
     rather than drawing, because they have no silhouette of their own:

       · cling film is transparent AND shapeless, which is the worst
         possible pair of properties at this size. So it is drawn around
         the thing it was wrapped around: the sandwich supplies the
         outline, and the film reads off its creases and its highlights —
         which is exactly how you see cling film in life.
       · a chewed wad of gum is likewise a blob. So the wrapper does the
         identifying: a foil strip and a torn paper sleeve are a shape
         everybody knows, and the wad sits at the end of it.

     The other three have shapes of their own and only needed drawing
     honestly. The string and the paper tag are what make a tea bag a tea
     bag. The taper, and the fact that they are still joined at one end,
     are what make disposable chopsticks. And a lid peeled back and left
     standing off the rim is what makes a can look opened and abandoned
     rather than merely placed.
     ══════════════════════════════════════════════════════════════════════ -->

<!-- ── p1 · PAPER TEA BAG · organic ─────────────────────────────────────
     Take one was a puffed-up sack. A used tea bag is FLAT — the water has
     gone out of it and taken its shape with it — heavy at the bottom
     where the leaf has settled, and pale and dry along the top fold. The
     string and the paper tag are what actually name it; without them this
     is a wet paper square. -->
<g id="lit-p1" {place(440, 806)}>
  <!-- it has been lying here long enough to mark the cloth -->
  <path d="M-92 -6 q-8 -26 26 -32 q40 -8 78 -2 q34 6 28 26 q-6 20 -50 22
           q-48 2 -82 -14 Z" fill="#8A5A2E" opacity=".14"/>
  <path d="M-52 -2 q-10 -18 16 -21 q30 -4 46 2 q16 6 8 16 q-12 10 -40 9
           q-24 -1 -30 -6 Z" fill="#6E4520" opacity=".16"/>
  {sh(16, 150, 'shadowCloth', .8)}
  <g transform="rotate(-8)">
    <path d="M-58 2 q-6 -30 0 -44 q42 -12 84 -2 q8 18 2 44 q-44 12 -86 2 Z" fill="#C0A075"/>
    <!-- the wet half, where the leaf is, and it is nearly black -->
    <path d="M-56 2 q-4 -18 -1 -26 q40 10 82 2 q4 12 0 24 q-42 12 -81 0 Z" fill="#7E5730"/>
    <path d="M-50 0 q32 8 66 -1 q1 4 0 6 q-34 8 -66 -1 Z" fill="#4E3316" opacity=".75"/>
    <!-- the dry top fold, still paper coloured -->
    <path d="M-58 -42 q42 -12 84 -2 q-42 14 -84 2 Z" fill="#E4CFA8"/>
    <path d="M-58 -40 q42 -12 84 -2" fill="none" stroke="#FFF6E2" stroke-opacity=".7" stroke-width="2.5"/>
    <path d="M-16 -44 q6 24 3 46" fill="none" stroke="#9A7A50" stroke-opacity=".5" stroke-width="2.5"/>
    <path d="M20 -45 q4 22 2 44" fill="none" stroke="#9A7A50" stroke-opacity=".4" stroke-width="2"/>
    <!-- the staple: the reason this one is not compostable as it stands -->
    <path d="M-8 -48 h16 v5 h-16 Z" fill="url(#steel)"/>
  </g>
  <!-- string and tag -->
  <path d="M42 -38 C 88 -62, 126 -38, 148 -58" fill="none" stroke="#F4EBD8" stroke-width="4"/>
  <path d="M42 -38 C 88 -62, 126 -38, 148 -58" fill="none" stroke="#B9A98C" stroke-width="1.5"/>
  <g transform="rotate(13 166 -62)">
    <path d="M148 -76 h44 v34 h-44 Z" fill="#F6EEDC"/>
    <path d="M148 -76 h44 v10 h-44 Z" fill="#FFFAF0"/>
    <path d="M154 -66 h30 M154 -58 h22" stroke="#B9A98C" stroke-width="3" stroke-linecap="round"/>
    <path d="M148 -76 h44 v34 h-44 Z" fill="none" stroke="#C6B69A" stroke-width="2"/>
  </g>
  {occ(150, 11)}
</g>

<!-- ── p2 · WOODEN CHOPSTICKS · organic ───────────────────────────────── -->
<g id="lit-p2" {place(556, 770)}>
  {sh(14, 250, 'shadowCloth', .9)}
  <g transform="rotate(-14)">
    <path d="M-124 -6 l248 -16 l0 13 l-248 16 Z" fill="#A9864E"/>
    <path d="M-124 -6 l248 -16 l0 5 l-248 16 Z" fill="#DFC593"/>
    <path d="M-124 1 l248 -16 l0 4 l-248 16 Z" fill="#8E6E3E" opacity=".6"/>
    <path d="M110 -22 l14 -1 l0 13 l-14 1 Z" fill="#A98A56"/>
  </g>
  <g transform="rotate(4) translate(0,14)">
    <path d="M-124 -6 l248 -10 l0 13 l-248 10 Z" fill="#A4824B"/>
    <path d="M-124 -6 l248 -10 l0 5 l-248 10 Z" fill="#D9BF8C"/>
    <path d="M-124 1 l248 -10 l0 4 l-248 10 Z" fill="#87683A" opacity=".6"/>
    <path d="M110 -16 l14 0 l0 13 l-14 0 Z" fill="#A4854F"/>
  </g>
  <!-- still joined at the thick end: a pair, split only part way -->
  <path d="M104 -28 q26 -2 26 20 q0 20 -26 20 q6 -20 0 -40 Z" fill="#C0A263"/>
  <path d="M104 -28 q26 -2 26 20 q-14 2 -20 -2 q4 -12 -6 -18 Z" fill="#F2E2B8"/>
  <!-- and used: the tips are stained -->
  <path d="M-124 -7 l-8 1 l0 14 l8 -1 Z" fill="#6E4A22" opacity=".75"/>
  <path d="M-124 8 l-8 0 l0 13 l8 -1 Z" fill="#7A5228" opacity=".7"/>
  {occ(240, 10)}
</g>

<!-- ── p3 · CHEWING GUM · general ──────────────────────────────────────
     Take one: the sleeve was 128mm long, which is nearly twice the length
     of a real stick of gum, and at that proportion it stopped being a
     wrapper and became a pen. A stick of gum is 72 by 22, and drawn at 72
     by 22 it reads as what it is. The wad went the same way — a highlight
     on a round blob made a pearl — so it is flattened, dulled, and given
     the grey-pink of something that has been chewed and then trodden on. -->
<g id="lit-p3" {place(386, 852)}>
  {sh(14, 150, 'shadowCloth', .85)}
  <!-- the paper sleeve, torn open at one end -->
  <g transform="rotate(-11)">
    <path d="M-40 6 l72 -8 l-2 -24 l-72 8 Z" fill="#F6F4EE"/>
    <path d="M-40 6 l72 -8 l-1 -7 l-72 8 Z" fill="#CBC8C0" opacity=".7"/>
    <path d="M-41 -8 l72 -8 l-1 -8 l-72 8 Z" fill="#2E7A62"/>
    <path d="M-41 -16 l72 -8" fill="none" stroke="#86DDB8" stroke-opacity=".7" stroke-width="2"/>
    <path d="M-42 -18 l72 -8 l0 3 l-72 8 Z" fill="#FFFFFF" opacity=".85"/>
    <path d="M32 -2 l-2 -24 l7 -1 l-1 6 l6 -1 l-1 7 l6 -1 l-2 7 l5 1 l-3 5 Z" fill="#EDEAE2"/>
  </g>
  <!-- the foil liner, half pulled out and crumpled. Foil is not a
       gradient — it is FACETS, each plane catching a different amount of
       sky, white hard up against near-black with nothing in between.
       That hard cut is the whole of what the eye reads as metal. -->
  <g transform="rotate(19 52 -12)">
    <path d="M30 -2 l19 -6 l4 21 l-20 6 Z" fill="#B4C0CC"/>
    <path d="M49 -8 l12 -4 l5 20 l-13 5 Z" fill="#FDFEFF"/>
    <path d="M61 -12 l10 -3 l4 19 l-10 4 Z" fill="#6E7A88"/>
    <path d="M71 -15 q13 -6 18 3 q-6 12 -18 8 Z" fill="#F4F8FC"/>
    <path d="M71 -15 q13 -6 18 3 q-4 2 -9 2 q-6 0 -9 -5 Z" fill="#FFFFFF"/>
    <path d="M75 -1 q7 3 14 -4 q-6 12 -18 8 Z" fill="#8894A2"/>
    <path d="M49 -8 l4 21 M61 -12 l4 20" stroke="#5A6672" stroke-opacity=".45" stroke-width="1.2"/>
    <path d="M30 -2 l41 -13" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="1.6"/>
  </g>
  <!-- the wad: flattened, pulled out of shape, and dull. Gum that has
       been chewed has no shine left in it at all. -->
  <g transform="translate(-72,-2)">
    <ellipse cx="1" cy="3" rx="18" ry="6" fill="#16262C" opacity=".4"/>
    <path d="M-17 1 q-6 -10 6 -13 q9 -2 15 1 q9 -4 12 1 q3 5 -4 7
             q6 3 1 6 q-8 4 -18 2 q-9 -1 -12 -4 Z" fill="#9E9092"/>
    <path d="M-17 1 q-6 -10 6 -13 q6 -1 10 0 q-8 4 -8 13 Z" fill="#B3A6A8"/>
    <path d="M4 -8 q9 -4 12 1 q3 5 -4 7 q-6 -5 -8 -8 Z" fill="#8A7C7E"/>
    <path d="M-10 -9 q6 -2 10 0" fill="none" stroke="#C6BABB" stroke-opacity=".65" stroke-width="1.4"/>
    <!-- the stringy bit it left behind on the way down -->
    <path d="M14 -4 q9 2 13 -3" fill="none" stroke="#9E9092" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  {occ(150, 9)}
</g>

<!-- ── p4 · STEEL SOUP CAN · recyclable ────────────────────────────────── -->
<g id="lit-p4" {place(1000, 800)}>
  {sh(112, 78, 'shadowCloth')}
  {occ(78, 13)}
  <path d="M-38 0 h76 v-108 h-76 Z" fill="url(#steel)"/>
  <ellipse cx="0" cy="-108" rx="38" ry="10" fill="#8E9AA4"/>
  <ellipse cx="0" cy="-110" rx="38" ry="10" fill="#C2CCD4"/>
  <ellipse cx="0" cy="-110" rx="38" ry="10" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="3.5"/>
  <ellipse cx="0" cy="-108" rx="30" ry="7" fill="#4E5A64"/>
  <!-- the paper band, and the strip of bare steel where it has torn -->
  <path d="M-38 -14 h76 v-80 h-76 Z" fill="#C0392B"/>
  <path d="M-38 -14 h13 v-80 h-13 Z" fill="#E4685C" opacity=".6"/>
  <path d="M28 -14 h10 v-80 h-10 Z" fill="#7E2018" opacity=".55"/>
  <path d="M-38 -70 h76 v16 h-76 Z" fill="#F4E8CE"/>
  <path d="M-26 -62 h52" stroke="#C0392B" stroke-width="5" stroke-linecap="round"/>
  <path d="M-30 -44 h60 M-30 -34 h44" stroke="#F4E8CE" stroke-opacity=".7" stroke-width="4" stroke-linecap="round"/>
  <path d="M-38 -94 h76" fill="none" stroke="#FFD8CE" stroke-opacity=".55" stroke-width="2.5"/>
  <path d="M14 -94 l5 12 l-4 10 l6 11 l-5 12 l4 11 l-5 13 l4 10 l-3 11
           l8 0 l0 -90 Z" fill="url(#steel)"/>
  <path d="M14 -94 l5 12 l-4 10 l6 11 l-5 12 l4 11 l-5 13 l4 10 l-3 11"
        fill="none" stroke="#7E2018" stroke-opacity=".5" stroke-width="2"/>
  <!-- the lid, peeled off and standing up. It is bent, and the cut edge
       is the brightest line on the object — that is what a fresh cut in
       steel does with a low sun. -->
  <g transform="rotate(-24 -30 -112)">
    <ellipse cx="-58" cy="-134" rx="37" ry="12" fill="#8E9AA4"/>
    <ellipse cx="-58" cy="-137" rx="37" ry="12" fill="url(#steel)"/>
    <ellipse cx="-58" cy="-137" rx="37" ry="12" fill="none" stroke="#FFFFFF" stroke-opacity=".95" stroke-width="3"/>
    <ellipse cx="-58" cy="-137" rx="26" ry="7" fill="none" stroke="#7E8A94" stroke-opacity=".6" stroke-width="2.5"/>
    <path d="M-95 -137 q14 16 37 16 q23 0 37 -16 l0 9 q-14 16 -37 16 q-23 0 -37 -16 Z" fill="#6E7A84"/>
  </g>
</g>

<!-- ── p5 · CLING WRAP · general ───────────────────────────────────────── -->
<g id="lit-p5" {place(700, 732)}>
  {sh(40, 240, 'shadowCloth', .85)}
  {occ(230, 20)}
  <!-- the half sandwich that gives the film something to be -->
  <g transform="rotate(-6)">
    <path d="M-52 -4 l104 -6 l-6 -44 l-96 4 Z" fill="#E8D2A6"/>
    <path d="M-52 -4 l104 -6 l-2 -13 l-102 6 Z" fill="#C9A86E"/>
    <path d="M-54 -50 l96 -4 q-48 -12 -96 4 Z" fill="#F4E4BE"/>
    <path d="M-50 -30 l100 -6" stroke="#9EC060" stroke-width="7" stroke-linecap="round"/>
    <path d="M-48 -22 l98 -6" stroke="#D8703E" stroke-width="6" stroke-linecap="round"/>
    <path d="M-46 -38 l96 -5" stroke="#F2E0B4" stroke-width="5" stroke-linecap="round"/>
    <!-- bitten, not simply left -->
    <path d="M26 -52 q18 6 20 20 q-18 -4 -20 -20 Z" fill="#B3A894" opacity=".5"/>
  </g>
  <!-- the film. Take one had a single smooth arc for an outline and came
       out as a glass dome. Cling film has no smooth edges anywhere on it:
       it is a CREASED sheet, so the outline is a run of short straight
       facets meeting at angles, it sits close in around what it was
       wrapped around instead of ballooning off it, and the slack is
       gathered and twisted to one side. Almost none of it is opaque —
       it is made of the light along its creases, and it only exists at
       all because the sandwich is showing through it. -->
  <g>
    <path d="M-96 4 L-118 -14 L-101 -39 L-88 -54 L-55 -71 L-27 -86 L9 -83
             L48 -84 L88 -66 L101 -55 L117 -28 L100 -9 L87 9 L36 11 L-11 18
             L-48 11 Z" fill="#DCE8F0" opacity=".17"/>
    <path d="M-96 4 L-118 -14 L-101 -39 L-88 -54 L-55 -71 L-27 -86 L9 -83
             L48 -84 L88 -66 L101 -55 L117 -28 L100 -9 L87 9 L36 11 L-11 18
             L-48 11 Z" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="2.6"/>
    <path d="M-96 4 L-118 -14 L-101 -39 L-88 -54 L-55 -71 L-27 -86 L9 -83"
          fill="none" stroke="#FFFFFF" stroke-opacity=".95" stroke-width="3.2"/>
    <!-- creases. Every one of them is a straight segment or a hard corner,
         because a crease in film is a fold and folds are not curves. -->
    <g fill="none" stroke="#FFFFFF" stroke-linejoin="miter">
      <path d="M-84 -50 L-60 -62 L-30 -70" stroke-opacity=".8" stroke-width="2.4"/>
      <path d="M-92 -22 L-70 -40 L-48 -46" stroke-opacity=".5" stroke-width="2"/>
      <path d="M-76 6 L-60 -14 L-50 -34" stroke-opacity=".45" stroke-width="1.8"/>
      <path d="M50 -76 L78 -62 L96 -44" stroke-opacity=".8" stroke-width="2.4"/>
      <path d="M78 -34 L92 -22 L86 -4" stroke-opacity=".5" stroke-width="2"/>
      <path d="M-18 -84 L16 -78 L44 -70" stroke-opacity=".85" stroke-width="2.6"/>
      <path d="M-30 14 L14 12 L56 6" stroke-opacity=".4" stroke-width="1.8"/>
      <path d="M-46 -60 L-38 -30 L-44 -2" stroke-opacity=".35" stroke-width="1.6"/>
      <path d="M62 -72 L58 -40 L66 -10" stroke-opacity=".35" stroke-width="1.6"/>
    </g>
    <!-- the slack, gathered and twisted shut at one corner -->
    <g transform="rotate(-20 -120 -30)">
      <path d="M-166 -42 L-146 -50 L-128 -44 L-124 -26 L-136 -16 L-158 -20 Z"
            fill="#E4EEF4" opacity=".34"/>
      <path d="M-166 -42 L-146 -50 L-128 -44" fill="none"
            stroke="#FFFFFF" stroke-opacity=".9" stroke-width="2.6"/>
      <path d="M-160 -32 L-144 -38 L-130 -33" fill="none"
            stroke="#FFFFFF" stroke-opacity=".6" stroke-width="2"/>
      <path d="M-152 -22 L-140 -27 L-128 -23" fill="none"
            stroke="#FFFFFF" stroke-opacity=".45" stroke-width="1.8"/>
      <path d="M-146 -50 L-142 -18 M-128 -44 L-132 -18" fill="none"
            stroke="#FFFFFF" stroke-opacity=".35" stroke-width="1.5"/>
    </g>
    <!-- two hard speculars, where the sun comes off a flat piece of it -->
    <path d="M22 -80 L58 -72 L54 -64 L18 -72 Z" fill="#FFFFFF" opacity=".8"/>
    <path d="M-84 -56 L-64 -66 L-60 -60 L-80 -50 Z" fill="#FFFFFF" opacity=".55"/>
  </g>
</g>
"""


BODY_E = r"""
<!-- ══════════ 11. THE TREE'S SHADOW ══════════
     Drawn AFTER the blanket, because the blanket is lying IN it — put
     this down first and the cloth paints straight over the top of it and
     the tree ends up shading the lawn and not the thing in the middle of
     the lawn.

     Built from the crown's own lobes, projected onto the ground and
     stretched along the light, so it is recognisably the shadow of THIS
     tree and not a smudge. Two passes: a soft outer one for the
     penumbra, which is wide because the sun is a disc and the crown is a
     long way up, and a tighter darker core for the parts of it that are
     under the densest leaf. -->
<g pointer-events="none">
  <g filter="url(#shadeSoft)" fill="#1E3C56" opacity=".27">
%%SHADE%%
  </g>
  <g filter="url(#shadeCore)" fill="#1B3550" opacity=".21">
%%SHADECORE%%
  </g>
  <path d="%%TRUNKSHADE%%" fill="#1B3550" opacity=".24" filter="url(#shadeCore)"/>
</g>

<!-- ══════════════════════════════════════════════════════════════════════
     12. DAPPLE

     The gaps in that crown, projected onto the ground. They land down and
     to the LEFT of the leaves that made them, because the sun is up and to
     the right; they are stretched along that same direction because the
     light is raking the lawn at a shallow angle; and their edges are soft
     because the sun is a disc and not a point.

     Each blob is soft because of the gradient inside it, not because of a
     blur filter — a filter on this group would isolate it, and the screen
     blend would quietly stop doing anything at all.
     ══════════════════════════════════════════════════════════════════════ -->
<g class="dapple" pointer-events="none" style="mix-blend-mode:screen">
%%DAPPLE%%
</g>

<!-- ══════════ 13. GRASS IN FRONT OF THE CLOTH ══════════
     A second pass of the same field, drawn AFTER the blanket and kept to
     a band straddling its edges. Cloth laid on a lawn does not meet it on
     a clean line — blades stand up in front of the hem, and that fringe
     is most of what stops the blanket reading as a sticker. -->
<g class="nearGrass" pointer-events="none">
%%GRASS_NEAR%%
</g>

<!-- ══════════ 14. A BUTTERFLY ══════════
     Going away from the camera as well as across it, so it starts big in
     the near grass and arrives small at the far side — and drawn
     three-quarters on rather than spread flat, because a butterfly seen
     square from above is a specimen in a case. -->
<g class="butterfly" pointer-events="none">
 <g class="bfFade">
  <g transform="rotate(-34)">
    <!-- far wing: turned away, so narrower and darker -->
    <g class="wingFar">
      <path d="M0 0 q19 -22 27 -6 q6 15 -10 19 q13 9 3 17 q-12 9 -21 -11 Z" fill="#C9801F"/>
      <path d="M0 0 q19 -22 27 -6 q-10 1 -18 5 Z" fill="#E4A748"/>
      <path d="M18 -11 q5 2 4 7 M10 13 q5 -2 6 -7" stroke="#6E3C12" stroke-width="1.8" fill="none"/>
    </g>
    <!-- near wing: broad, and catching the sun on its upper surface -->
    <g class="wingNear">
      <path d="M0 0 q-27 -29 -38 -7 q-9 20 13 25 q-18 11 -5 22 q16 12 28 -14 Z" fill="#F2A63C"/>
      <path d="M0 0 q-27 -29 -38 -7 q13 2 24 7 Z" fill="#FFD27E"/>
      <path d="M-11 20 q-9 -3 -11 -10 q8 -1 14 2 Z" fill="#8A4E1E" opacity=".45"/>
      <path d="M-24 -13 q-7 2 -6 9 M-14 18 q-7 -2 -9 -9" stroke="#8A4E1E" stroke-width="2" fill="none"/>
    </g>
    <path d="M2 -13 q4 15 -1 28 q-5 -13 -1 -28 Z" fill="#3A2A1A"/>
    <path d="M1 -13 q-5 -9 -10 -12 M3 -13 q5 -9 10 -12" stroke="#3A2A1A" stroke-width="1.7" fill="none"/>
  </g>
 </g>
</g>

<!-- ══════════ 15. FOREGROUND ══════════
     Too close to the lens to be in focus. Kept to the corners so it never
     sits over anything that has to be clicked. -->
<g filter="url(#fgSoft)" pointer-events="none">
  <path d="M-30 906 q40 -96 66 -128 q-4 78 10 128 Z" fill="#2A5222" opacity=".8"/>
  <path d="M26 906 q22 -118 70 -160 q-22 104 -22 160 Z" fill="#23481D" opacity=".75"/>
  <path d="M84 906 q10 -74 44 -112 q-14 62 -10 112 Z" fill="#2F5C26" opacity=".6"/>
  <path d="M1230 906 q-46 -104 -78 -142 q10 82 -4 142 Z" fill="#23481D" opacity=".8"/>
  <path d="M1160 906 q-24 -112 -66 -150 q22 96 18 150 Z" fill="#2A5222" opacity=".7"/>
  <path d="M1096 906 q-8 -66 -40 -104 q16 56 10 104 Z" fill="#33632A" opacity=".55"/>
</g>

<!-- ══════════ 16. GRADE ══════════ -->
<g pointer-events="none">
  <rect width="1200" height="900" fill="#FFCE86" opacity=".075" style="mix-blend-mode:overlay"/>
  <radialGradient id="vig" cx=".7" cy=".22" r=".92">
    <stop offset=".45" stop-color="#14202A" stop-opacity="0"/>
    <stop offset="1"   stop-color="#101C26" stop-opacity=".56"/>
  </radialGradient>
  <rect width="1200" height="900" fill="url(#vig)"/>
  <rect width="1200" height="900" filter="url(#filmGrain)" opacity=".28" style="mix-blend-mode:overlay"/>
</g>
</svg>
</div>

<script>
  const scene = document.getElementById('scene');
  const on = (el, fn) => {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  };
  const pulse = (cls, ms) => {
    scene.classList.remove(cls); void scene.getBoundingClientRect(); scene.classList.add(cls);
    clearTimeout(pulse[cls]); pulse[cls] = setTimeout(() => scene.classList.remove(cls), ms);
  };
  on(document.getElementById('tree'),       () => pulse('shedding', 4400));
  on(document.getElementById('gustCorner'), () => pulse('gust', 1600));
  on(document.getElementById('speaker'),    () => scene.classList.toggle('playing'));
</script>
</body>
</html>
"""


_NK = random.Random(97)

def near_keep(x, y):
    """The band that straddles the cloth's edge, plus the two bottom
    corners the blanket does not reach. Grass at a hem is a scatter, not
    a hedge: the band is wide, its density falls off away from the edge,
    and it thins out with distance like everything else here."""
    if y < 578:
        return False
    if y > 878 and (x < 110 or x > 1098):
        return True
    l, r = blanket_span(y)
    # OUTSIDE the hem only. Blades whose base sits on the cloth read as
    # grass growing out of the mat, which is worse than no fringe at all;
    # the hem gets a small clearance as well, because the cloth's edge is
    # drawn wavy and the straight span is only its average.
    if x < l:
        d = l - x
    elif x > r:
        d = x - r
    else:
        return False
    if d < 9 or d > 84:
        return False
    p = (1.0 - (d - 9) / 75.0) ** 1.4 * (.35 + .65 * (y - 578) / 322.0)
    return _NK.random() < p * .52


def build():
    cloth = blanket_outline()
    flap, hinge, _, _, _ = corner_flap()

    def far_keep(x, y):
        if on_blanket(x, y, pad=-10):
            return False
        if y < 430 and x > 560:          # where the canopy is
            return False
        return True

    html = (HEAD + BODY_A + BODY_B + BODY_C + props() + litter() + BODY_E)
    html = html.replace("%%CLOTH_OUTLINE%%", cloth)
    html = html.replace("%%FLAP%%", flap).replace("%%HINGE%%", hinge)
    html = html.replace("%%GINGHAM%%", gingham())
    html = html.replace("%%MOWN%%", mown())
    html = html.replace("%%GRASS_FAR%%", tuft_symbols())
    html = html.replace("%%GRASS_NEAR%%", tuft_field(31, 9000, 578, 900, near_keep, near_px=20))
    html = html.replace("%%FLOWERS%%", flowers(5, 900, 262, 900, far_keep))
    html = html.replace("%%CANOPY_DARK%%", canopy(part="dark"))
    html = html.replace("%%CANOPY_LIGHT%%", canopy(part="light"))
    html = html.replace("%%CANOPY_LEAVES%%", canopy_leaves())
    html = html.replace("%%TRUNK_TUFT%%", tuft_field(
        41, 260, 448, 556, lambda x, y: 1086 < x < 1290, near_px=26))
    html = html.replace("%%SHADE%%", canopy_shade())
    html = html.replace("%%SHADECORE%%", canopy_shade_core())
    html = html.replace("%%TRUNKSHADE%%", trunk_shade())
    html = html.replace("%%DAPPLE%%", dapple())
    return html


if __name__ == "__main__":
    import sys, pathlib
    out = pathlib.Path(__file__).with_name("index.html")
    out.write_text(build())
    print(f"wrote {out}  {out.stat().st_size/1024:.0f} KB")
