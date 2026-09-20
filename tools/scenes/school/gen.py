#!/usr/bin/env python3
"""Builds school/index.html.

One camera, stated once and then obeyed everywhere.

  · The horizon is at y = -120, just above the top of the frame, so the
    vanishing point is (580, -120). Every depth line in this picture runs
    to it: the table's two ends, the joints in the floor, the benches,
    the rows of tables behind.
  · A thing of fixed real size at image height y is drawn at

        pixels per metre = 0.659 * (y + 120)

    which is what 1/depth means once the horizon is fixed. Everything
    standing on the floor or lying on the table is authored in
    MILLIMETRES at its real size and then placed by that rule, so the
    tray, the jug and the tablet are all in scale with each other and
    with the table they are on.
  · The light comes in through tall windows in the right-hand wall, out
    of frame. It lands as long parallelograms across the floor and the
    table, and those run to their OWN vanishing point on the same
    horizon — off to the left, because that is the direction they are
    travelling.
"""
import math, random

W, H = 1200, 900

# ── ONE CAMERA, SOLVED ONCE ──────────────────────────────────────────────
# Indoors the horizon is EYE LEVEL, and eye level is a real line on the
# back wall — so unlike the outdoor scenes it belongs inside the frame.
# Everything below follows from these five numbers and nothing is guessed:
#
#   the lens              f = 1300px
#   the near edge of the table   1.95m away
#   the camera            1.907m off the floor, so 1.157m above the table
#   the table             1.8m across, 1.1m deep, 0.75m high
#   the back wall         10m away
#
# From which: the vanishing point, where the table's far edge falls, how
# fast the floor tiles compress, how big a clock is at that distance, and
# the two scale rules everything on the table and everything on the floor
# is drawn with.
HORIZON = 120.0
VPX, VPY = 580.0, HORIZON
FOCAL, D0_M, CAM_H = 1300.0, 1.95, 1.907

TN_Y, TN_L, TN_R = 892.0, 0.0, 1200.0     # the table's near edge
_h = TN_Y - HORIZON                        # 772 — apparent height over the TABLE
TABLE_D = 1.1
TF_Y = HORIZON + _h * D0_M / (D0_M + TABLE_D)
_t = (TN_Y - TF_Y) / _h
TF_L = TN_L + _t * (VPX - TN_L)
TF_R = TN_R - _t * (TN_R - VPX)

FLOOR_H = FOCAL * CAM_H / D0_M * D0_M      # apparent height over the FLOOR
FLOOR_H = FOCAL * CAM_H                    # (y-120) = FLOOR_H/D  with D in metres
WALL_D = 10.0
WALL_Y = HORIZON + FLOOR_H / WALL_D
FLOOR_REF_Y = TF_Y                         # first floor joint clear of the table
FLOOR_REF_D = FLOOR_H / (FLOOR_REF_Y - HORIZON)
TILE_M = 0.4

def f(v, n=1):
    s = f"{v:.{n}f}"
    return s.rstrip("0").rstrip(".") if "." in s else s

def pxm_table(y):
    """Pixels per metre for something lying ON THE TABLE at image height y."""
    return FOCAL / D0_M * (y - HORIZON) / _h

def pxm_floor(y):
    """Pixels per metre for something standing ON THE FLOOR at image height y."""
    return (y - HORIZON) * FOCAL / FLOOR_H

def depth_x(x_at, y_at, y):
    """Follow the depth line through (x_at, y_at) to image height y."""
    t = (y_at - y) / (y_at - VPY)
    return x_at + t * (VPX - x_at)

def table_span(y):
    return depth_x(TN_L, TN_Y, y), depth_x(TN_R, TN_Y, y)

def on_table(x, y, pad=0.0):
    if not (TF_Y - pad <= y <= TN_Y + pad):
        return False
    l, r = table_span(y)
    return l - pad <= x <= r + pad

def place(x, y, extra=""):
    """Place an object authored in MILLIMETRES, lying on the table."""
    return f'transform="translate({f(x)},{f(y)}) scale({f(pxm_table(y)/1000,4)}){extra}"'

def fore(y):
    """How much a FLAT thing lying on the table is foreshortened.

    A metre across the table is FOCAL/D pixels wide; a metre of DEPTH is
    (y-120)^2/(772*D0) pixels tall. Divide one by the other and almost
    everything cancels: the squash is just (y - horizon) / focal length.
    So something lying flat at the front of the table is squashed to 0.59
    and the same thing at the back to 0.38 — which is why a dinner tray
    drawn as a plain rectangle looks like it is standing up."""
    return (y - HORIZON) / FOCAL

def place_flat(x, y, extra=""):
    """Place an object drawn in PLAN, in millimetres, lying on the table."""
    k = pxm_table(y) / 1000
    return (f'transform="translate({f(x)},{f(y)}) '
            f'scale({f(k,4)},{f(k*fore(y),4)}){extra}"')

def place_floor(x, y, extra=""):
    return f'transform="translate({f(x)},{f(y)}) scale({f(pxm_floor(y)/1000,4)}){extra}"'

def sh(h, w, grad="shadow", op=1.0):
    """The cast shadow of something h tall and w wide, in the same mm. The
    windows are to the RIGHT with the sun low in them, so shadows run LEFT
    and a little toward the camera, twice the height that threw them."""
    L = 2.0 * h
    cx, cy = -.94 * L / 2, .34 * L / 2
    ang = math.degrees(math.atan2(.34, -.94))
    return (f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(L/2 + w*.45)}" ry="{f(w*.42)}" '
            f'fill="url(#{grad})" opacity="{f(op,2)}" '
            f'transform="rotate({f(ang)} {f(cx)} {f(cy)})"/>')

def occ(w, ry=None):
    return f'<ellipse cx="0" cy="0" rx="{f(w*.55)}" ry="{f((ry or w*.15))}" fill="url(#occl)"/>'

def batch(groups):
    return "\n".join(f'<path fill="{c}" d="{"".join(d)}"/>'
                     for c, d in groups.items() if d)


# ══ THE FLOOR ════════════════════════════════════════════════════════════
# Vinyl tiles, 400mm square. The joints running away from the camera go to
# the vanishing point; the ones running across compress on a 1/depth law,
# so the rows at the back are eight pixels apart and the ones at the front
# are thirty-six. A floor grid with even rows is the fastest way to
# flatten a room.
def floor_y(k):
    return HORIZON + FLOOR_H / (FLOOR_REF_D + k * TILE_M)

def floor_pxm_ref():
    return FOCAL / FLOOR_REF_D

def floor_tiles():
    out, rows = [], []
    k = 0
    while True:
        y = floor_y(k)
        if y < WALL_Y or k > 60:
            break
        rows.append(y)
        k += 1
    # joints running away from the camera
    dep = []
    for i in range(-12, 24):
        x = -520 + i * (floor_pxm_ref() * TILE_M)
        dep.append(f"M{f(x)} {f(FLOOR_REF_Y)}L{f(depth_x(x, FLOOR_REF_Y, rows[-1]))} {f(rows[-1])}")
    cross = []
    for y in rows:
        cross.append(f"M{f(depth_x(-520, FLOOR_REF_Y, y))} {f(y)}"
                     f"L{f(depth_x(1900, FLOOR_REF_Y, y))} {f(y)}")
    out.append(f'<path d="{"".join(dep)}" fill="none" stroke="#5E6E68" '
               f'stroke-opacity=".3" stroke-width="1.3"/>')
    out.append(f'<path d="{"".join(cross)}" fill="none" stroke="#5E6E68" '
               f'stroke-opacity=".26" stroke-width="1.3"/>')
    # every other tile a shade different, the way a laid vinyl floor is
    rng = random.Random(5)
    tone = {"#AFBCB2": [], "#9DAAA1": [], "#BAC6BC": []}
    for r in range(len(rows) - 1):
        y0, y1 = rows[r], rows[r + 1]
        for i in range(-12, 23):
            if (i + r) % 2:
                continue
            x0 = -520 + i * (floor_pxm_ref() * TILE_M)
            x1 = x0 + floor_pxm_ref() * TILE_M
            a0, a1 = depth_x(x0, FLOOR_REF_Y, y0), depth_x(x1, FLOOR_REF_Y, y0)
            b0, b1 = depth_x(x0, FLOOR_REF_Y, y1), depth_x(x1, FLOOR_REF_Y, y1)
            if max(a1, b1) < -80 or min(a0, b0) > 1280:
                continue
            c = rng.choice(list(tone))
            tone[c].append(f"M{f(a0)} {f(y0)}L{f(a1)} {f(y0)}L{f(b1)} {f(y1)}L{f(b0)} {f(y1)}Z")
    return batch(tone) + "\n" + "\n".join(out)


# ══ THE LIGHT FROM THE WINDOWS ═══════════════════════════════════════════
# Tall windows in the right-hand wall, out of frame. What they throw is a
# RECTANGLE of light lying on a horizontal plane, and a rectangle on a
# horizontal plane has two vanishing points on the horizon — one for each
# pair of its edges. Both of them are shared by the floor and the table,
# because parallel horizontal directions vanish at the same point whatever
# height the plane is at. So the patch on the table and the patch on the
# floor are built from the same two families of lines, which is what makes
# them look like one beam of light broken by a table rather than two
# unrelated bright shapes.
VPA = (-1180.0, HORIZON)      # the direction the light is travelling
VPB = (2900.0, HORIZON)       # along the window wall

def _line(p, vp):
    return (p, vp)

def _isect(l1, l2):
    (x1, y1), (x2, y2) = l1
    (x3, y3), (x4, y4) = l2
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    a = x1 * y2 - y1 * x2
    b = x3 * y4 - y3 * x4
    return ((a * (x3 - x4) - (x1 - x2) * b) / d, (a * (y3 - y4) - (y1 - y2) * b) / d)

def patch(pa1, pa2, pb1, pb2):
    """The quad cut out by two lines toward VPA and two toward VPB."""
    A1, A2 = _line(pa1, VPA), _line(pa2, VPA)
    B1, B2 = _line(pb1, VPB), _line(pb2, VPB)
    c = [_isect(A1, B1), _isect(A1, B2), _isect(A2, B2), _isect(A2, B1)]
    return "M" + "L".join(f"{f(x)} {f(y)}" for x, y in c) + "Z"


HEAD = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>School Lunch</title>
<style>
  :root { color-scheme: dark; }
  html,body { margin:0; height:100%; background:#0B1116; display:grid; place-items:center;
              font-family: ui-sans-serif, system-ui, sans-serif; }
  .stage { width:min(96vw, 1180px); aspect-ratio:4/3; position:relative;
           border-radius:26px; overflow:hidden;
           box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 40px 90px -30px #000; }
  svg { position:absolute; inset:0; width:100%; height:100%; display:block; }

  /* ── ambient life ──────────────────────────────────────────────────
     The hall after the second sitting. Dust turning over in the window
     light, a clock nobody is watching, one strip light on the blink. */

  @keyframes mote { 0%   {opacity:0; transform:translate(0,0)}
                    14%  {opacity:.85}
                    82%  {opacity:.5}
                    100% {opacity:0; transform:translate(-118px,96px)} }
  .mote { animation: mote linear infinite; }

  @keyframes beam { 0%,100%{opacity:.5} 50%{opacity:.68} }
  .beams { animation: beam 13.4s ease-in-out infinite; }

  @keyframes tick { 0%,92%{transform:rotate(0)} 100%{transform:rotate(6deg)} }
  .second { transform-origin: 1043px 232px; animation: tick 1s steps(1,end) infinite; }

  /* water does not stop dead — it swings past level and settles */
  @keyframes slosh { 0%,100%{transform:rotate(0)}
                     18%{transform:rotate(3.4deg)} 44%{transform:rotate(-2.4deg)}
                     68%{transform:rotate(1.3deg)} 86%{transform:rotate(-.5deg)} }
  .water { transform-box: fill-box; transform-origin: 50% 100%; }
  .sloshing .water { animation: slosh 1.5s cubic-bezier(.36,.07,.19,.97); }

  @keyframes strip { 0%,88%{opacity:.5} 90%{opacity:.1} 92%{opacity:.6}
                     94%{opacity:.15} 96%,100%{opacity:.5} }
  .strip2 { animation: strip 7.7s linear infinite; }

  /* ── the three toys ────────────────────────────────────────────────
     The tablet still has one flicker left in it. The bell is the bell.
     And somebody folded a paper plane during registration and never got
     to throw it — click it and it goes. */
  .prop { cursor: pointer; }
  .prop:focus { outline: none; }
  .prop:focus-visible { outline: 2px dashed #FFE9B0; outline-offset: -6px; }

  #screenLive { opacity: 0; }
  @keyframes wake { 0%{opacity:0} 6%{opacity:.9} 10%{opacity:.2} 16%{opacity:1}
                    62%{opacity:.85} 70%{opacity:.15} 74%{opacity:.6}
                    88%{opacity:.05} 100%{opacity:0} }
  .waking #screenLive { animation: wake 2.6s linear; }

  @keyframes fly { 0%   {transform:translate(0,0) rotate(0) scale(1)}
                   18%  {transform:translate(-150px,-96px) rotate(-11deg) scale(.86)}
                   48%  {transform:translate(-430px,-176px) rotate(5deg) scale(.6)}
                   78%  {transform:translate(-700px,-206px) rotate(-6deg) scale(.42)}
                   100% {transform:translate(-880px,-176px) rotate(3deg) scale(.34)} }
  .launched .plane { animation: fly 3.4s cubic-bezier(.22,.6,.4,1) forwards; }

  @keyframes clang { 0%,100%{transform:rotate(0)} 12%{transform:rotate(9deg)}
                     34%{transform:rotate(-7deg)} 58%{transform:rotate(4deg)}
                     80%{transform:rotate(-2deg)} }
  .ringing .bellBody { transform-box: fill-box; transform-origin: 50% 8%;
                       animation: clang .9s ease-out; }
  .ring { opacity: 0; }
  @keyframes ripple { 0%{opacity:0; transform:scale(.3)} 20%{opacity:.8}
                      100%{opacity:0; transform:scale(1.9)} }
  .ringing .ring { transform-box: fill-box; transform-origin: 0% 50%;
                   animation: ripple 1.2s ease-out; }

  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
</head>
<body>
<div class="stage">
<svg id="scene" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"
     aria-label="A school hall table after lunch, with waste left among the trays">
<defs>

  <!-- ══ LIGHT MODEL ══
       Early afternoon in a school hall. Two sources that do not agree,
       which is the whole look of the room:

         · TALL WINDOWS in the right-hand wall, out of frame, with the
           sun low enough in them to reach across the floor. This is the
           strong one: warm, hard-edged, and it lands as RECTANGLES —
           a window throws its own shape, and the glazing bars cut it
           into strips. Everything it touches gets a hot edge on its
           RIGHT side, and throws a shadow LEFT and slightly toward the
           camera, twice its own height long.
         · the room's own fill: strip lights and the sky through the
           same windows, cool and directionless. It is what is in the
           shadows, which is why nothing here is grey — the shadows are
           blue-green, and the further from the windows a thing is the
           more of that it is wearing.

       Distance in a room this size does little to colour, so depth is
       carried by the floor grid and by contrast dropping off toward the
       back wall, not by haze. -->

  <!-- ── the room ────────────────────────────────────────────────────── -->
  <linearGradient id="wallUp" x1="1" y1="0" x2="0" y2=".7">
    <stop offset="0"   stop-color="#F4EFDC"/>
    <stop offset=".35" stop-color="#DCD9C6"/>
    <stop offset=".75" stop-color="#B6BCAE"/>
    <stop offset="1"   stop-color="#9AA396"/>
  </linearGradient>
  <linearGradient id="wallDado" x1="1" y1="0" x2="0" y2=".6">
    <stop offset="0"   stop-color="#7E9084"/>
    <stop offset=".45" stop-color="#65786E"/>
    <stop offset="1"   stop-color="#4E6259"/>
  </linearGradient>
  <linearGradient id="floorBase" x1=".9" y1="0" x2=".1" y2="1">
    <stop offset="0"   stop-color="#C2CEC4"/>
    <stop offset=".4"  stop-color="#A2B0A8"/>
    <stop offset="1"   stop-color="#6E7E7A"/>
  </linearGradient>

  <!-- ── the table: warm beech laminate against a cool room ───────────── -->
  <linearGradient id="tableTop" x1=".92" y1=".05" x2=".1" y2=".95">
    <stop offset="0"   stop-color="#EBD6AC"/>
    <stop offset=".28" stop-color="#DCC49A"/>
    <stop offset=".62" stop-color="#C2A97C"/>
    <stop offset="1"   stop-color="#9E8556"/>
  </linearGradient>

  <!-- ── shadow. The fill light is a blue-green room, so that is what is
         in every shadow in it. ─────────────────────────────────────── -->
  <radialGradient id="shadow" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stop-color="#22423E" stop-opacity=".46"/>
    <stop offset=".62" stop-color="#274943" stop-opacity=".28"/>
    <stop offset="1"   stop-color="#2C4F49" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="occl" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stop-color="#17302E" stop-opacity=".6"/>
    <stop offset="1"   stop-color="#17302E" stop-opacity="0"/>
  </radialGradient>

  <!-- ── materials ───────────────────────────────────────────────────── -->
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stop-color="#6E7A80"/>
    <stop offset=".14" stop-color="#C6D0D4"/>
    <stop offset=".3"  stop-color="#F2F6F8"/>
    <stop offset=".46" stop-color="#96A2A8"/>
    <stop offset=".68" stop-color="#D6DEE2"/>
    <stop offset=".86" stop-color="#78848A"/>
    <stop offset="1"   stop-color="#4E5A60"/>
  </linearGradient>
  <linearGradient id="foil" x1="0" y1="0" x2="1" y2=".3">
    <stop offset="0"   stop-color="#8E98A4"/>
    <stop offset=".22" stop-color="#EEF4F8"/>
    <stop offset=".44" stop-color="#A2AEB8"/>
    <stop offset=".66" stop-color="#F6FAFC"/>
    <stop offset=".84" stop-color="#8E9AA6"/>
    <stop offset="1"   stop-color="#C4CED6"/>
  </linearGradient>
  <linearGradient id="hdpe" x1=".9" y1="0" x2=".1" y2=".9">
    <stop offset="0"   stop-color="#FFFFFF"/>
    <stop offset=".34" stop-color="#F8FBFA"/>
    <stop offset=".74" stop-color="#DCE8E6"/>
    <stop offset="1"   stop-color="#B6C6C4"/>
  </linearGradient>
  <linearGradient id="sunWarm" x1="1" y1="0" x2="0" y2=".6">
    <stop offset="0"   stop-color="#FFF0C6" stop-opacity=".95"/>
    <stop offset=".55" stop-color="#FFE9B4" stop-opacity=".72"/>
    <stop offset="1"   stop-color="#FFE2A2" stop-opacity=".4"/>
  </linearGradient>

  <linearGradient id="wallSun" x1="1" y1=".1" x2="0" y2=".9">
    <stop offset="0"   stop-color="#FFE9B4" stop-opacity=".5"/>
    <stop offset=".4"  stop-color="#FFE4AC" stop-opacity=".14"/>
    <stop offset="1"   stop-color="#2E4A52" stop-opacity=".16"/>
  </linearGradient>
  <linearGradient id="hatchSun" x1="1" y1="0" x2="0" y2=".5">
    <stop offset="0"   stop-color="#FFF0C6" stop-opacity=".55"/>
    <stop offset="1"   stop-color="#FFF0C6" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="glassSun" cx=".74" cy=".24" r=".7">
    <stop offset="0"   stop-color="#FFFFFF" stop-opacity=".72"/>
    <stop offset=".5"  stop-color="#FFFFFF" stop-opacity=".1"/>
    <stop offset="1"   stop-color="#FFFFFF" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="tableSun" x1="1" y1="0" x2=".1" y2=".8">
    <stop offset="0"   stop-color="#FFEBB8" stop-opacity=".3"/>
    <stop offset=".4"  stop-color="#FFE6B0" stop-opacity=".05"/>
    <stop offset=".62" stop-color="#3E5E80" stop-opacity=".07"/>
    <stop offset="1"   stop-color="#42628A" stop-opacity=".15"/>
  </linearGradient>
  <linearGradient id="beamG" x1="1" y1="0" x2="0" y2=".8">
    <stop offset="0"   stop-color="#FFF2CE" stop-opacity=".4"/>
    <stop offset=".5"  stop-color="#FFEDBE" stop-opacity=".16"/>
    <stop offset="1"   stop-color="#FFE8B0" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="card" x1=".9" y1="0" x2=".1" y2="1">
    <stop offset="0"   stop-color="#E8D6B2"/>
    <stop offset=".5"  stop-color="#D2BC92"/>
    <stop offset="1"   stop-color="#A98E64"/>
  </linearGradient>

  <filter id="softSm" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="4"/></filter>
  <filter id="softMd" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="10"/></filter>
  <filter id="softLg" x="-40%" y="-80%" width="180%" height="260%">
    <feGaussianBlur stdDeviation="22"/></filter>
  <filter id="edgeSoft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="fgSoft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="9"/></filter>
  <filter id="filmGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope=".5" intercept="-.19"/></feComponentTransfer>
  </filter>
</defs>
"""


def bars(pa1, pa2, pb_list, w):
    """The glazing bars' shadows: narrow strips in the VPB family, cutting
    across a patch of light. They are what stop a bright quad on the floor
    reading as spilt paint and make it read as a window."""
    out = []
    for x in pb_list:
        out.append(patch(pa1, pa2, (x, TN_Y), (x + w, TN_Y)))
    return " ".join(out)



# ══ CHAIRS ═══════════════════════════════════════════════════════════════
# A school chair, in millimetres, standing on the floor with its origin
# between its feet: a polypropylene seat and back on a bent steel tube
# frame, 450 wide, seat at 450 up, back to 850. Drawn once and placed by
# the horizon rule like everything else, so the ones tucked under the far
# side of the table and the ones out on the floor come out at the right
# sizes relative to each other without anybody deciding.
CHAIR_COLS = {
    "blue": ("#2E5E9E", "#5A8CC8", "#1E4272"),
    "red":  ("#B03A32", "#DC6A5E", "#7E241E"),
    "grey": ("#5E6A72", "#8E9AA4", "#3E4A52"),
    "teal": ("#2E7A70", "#5AA89C", "#1E574F"),
}

def chair(col="blue", seat=True, lean=0.0, legs=True):
    c, lit, dark = CHAIR_COLS[col]
    out = []
    if legs:
        out.append(
            '<g stroke="#6E7A84" stroke-width="34" fill="none" stroke-linecap="round">'
            '<path d="M-192 0 L-160 -430 M192 0 L160 -430 M-150 -30 L-128 -420 M150 -30 L128 -420"/></g>'
            '<g stroke="#DCE6EA" stroke-width="11" fill="none" stroke-linecap="round" opacity=".85">'
            '<path d="M186 -12 L156 -422 M144 -40 L124 -412"/></g>')
    if seat:
        out.append(
            '<path d="M-206 -430 h412 q22 0 22 22 v34 q0 22 -22 22 h-412 q-22 0 -22 -22 '
            'v-34 q0 -22 22 -22 Z" fill="' + c + '"/>'
            '<path d="M-206 -430 h412 q22 0 22 22 v11 h-456 v-11 q0 -22 22 -22 Z" fill="' + lit + '"/>'
            '<path d="M170 -430 h36 q22 0 22 22 v34 q0 22 -22 22 h-36 Z" fill="' + dark + '" opacity=".7"/>')
    out.append(
        '<g transform="rotate(' + f(lean) + ' 0 -430)">'
        '<g stroke="#6E7A84" stroke-width="32" fill="none" stroke-linecap="round">'
        '<path d="M-176 -420 L-168 -790 M176 -420 L168 -790"/></g>'
        '<g stroke="#DCE6EA" stroke-width="11" fill="none" stroke-linecap="round" opacity=".8">'
        '<path d="M182 -424 L174 -786"/></g>'
        '<path d="M-192 -800 h384 q26 0 26 26 v148 q0 26 -26 26 h-384 q-26 0 -26 -26 '
        'v-148 q0 -26 26 -26 Z" fill="' + c + '"/>'
        '<path d="M-192 -800 h384 q26 0 26 26 v15 h-436 v-15 q0 -26 26 -26 Z" fill="' + lit + '"/>'
        '<path d="M156 -800 h36 q26 0 26 26 v148 q0 26 -26 26 h-36 Z" fill="' + dark + '" opacity=".65"/>'
        '<path d="M-150 -744 h300 q10 0 10 10 v12 q0 10 -10 10 h-300 q-10 0 -10 -10 '
        'v-12 q0 -10 10 -10 Z" fill="' + dark + '" opacity=".45"/>'
        '</g>')
    return "".join(out)


BODY = r"""
<!-- ══════════ 1. THE HALL ══════════
     The back wall is ten metres away, so a metre of it is 130 pixels and
     everything on it is sized off that: the clock is half a metre across
     and lands 65 pixels wide, the dado rail is a metre up and lands 130
     pixels above the skirting. Eye level — the horizon — is the line at
     y=120, and it is a real line on this wall, which is the thing that
     makes an interior an interior. -->
<rect width="1200" height="368" fill="url(#wallUp)"/>
<rect y="238" width="1200" height="130" fill="url(#wallDado)"/>
<rect y="234" width="1200" height="7" fill="#8E9C90"/>
<rect y="234" width="1200" height="2.5" fill="#C4CEBE"/>
<rect y="355" width="1200" height="13" fill="#3E504A"/>
<rect y="355" width="1200" height="3" fill="#6E8076"/>
<!-- the sun comes in from the right and rakes along this wall -->
<rect width="1200" height="368" fill="url(#wallSun)"/>

<!-- noticeboard: a metre and a bit up, so 1.2m to 2.0m, so y 212 to 108 -->
<g>
  <rect x="176" y="104" width="316" height="112" fill="#6E5A3E"/>
  <rect x="182" y="110" width="304" height="100" fill="#9E8A66"/>
  <rect x="182" y="110" width="304" height="100" fill="#000000" opacity=".1"/>
  <g>
    <rect x="194" y="120" width="56" height="40" fill="#F2EEE0" transform="rotate(-2 222 140)"/>
    <rect x="258" y="124" width="48" height="36" fill="#E4EEF4" transform="rotate(1.5 282 142)"/>
    <rect x="316" y="118" width="60" height="44" fill="#F6F2E6" transform="rotate(-1 346 140)"/>
    <rect x="386" y="126" width="52" height="34" fill="#FFF0D0" transform="rotate(2 412 143)"/>
    <rect x="206" y="168" width="64" height="32" fill="#EDE8D8" transform="rotate(1 238 184)"/>
    <rect x="284" y="166" width="46" height="36" fill="#DCE8EE" transform="rotate(-2 307 184)"/>
    <rect x="344" y="170" width="72" height="30" fill="#F4EFE0" transform="rotate(.8 380 185)"/>
  </g>
  <g fill="#3E4A52" opacity=".35">
    <rect x="200" y="122" width="44" height="3"/><rect x="200" y="130" width="34" height="3"/>
    <rect x="322" y="124" width="48" height="3"/><rect x="322" y="132" width="36" height="3"/>
    <rect x="212" y="174" width="52" height="3"/><rect x="350" y="176" width="58" height="3"/>
  </g>
</g>

<!-- the serving hatch, shut -->
<g>
  <rect x="604" y="96" width="304" height="150" fill="#4A5A54"/>
  <rect x="612" y="104" width="288" height="128" fill="#8E9A94"/>
  <g stroke="#6E7A76" stroke-width="1.6">
    <path d="M612 112h288M612 122h288M612 132h288M612 142h288M612 152h288M612 162h288
             M612 172h288M612 182h288M612 192h288M612 202h288M612 212h288M612 222h288"/>
  </g>
  <rect x="612" y="104" width="288" height="128" fill="url(#hatchSun)"/>
  <rect x="604" y="238" width="304" height="14" fill="#C6CEC6"/>
  <rect x="604" y="238" width="304" height="4" fill="#EEF2EC"/>
</g>

<!-- the clock, and the bell nobody argues with -->
<g>
  <circle cx="1046" cy="86" r="34" fill="#37413E"/>
  <circle cx="1046" cy="86" r="30" fill="#F6F4EA"/>
  <circle cx="1046" cy="86" r="30" fill="url(#glassSun)"/>
  <g stroke="#37413E" stroke-width="2.2">
    <path d="M1046 60v5M1046 107v5M1020 86h5M1067 86h5"/>
  </g>
  <path d="M1046 86v-19" stroke="#2A332F" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M1046 86l14 9" stroke="#2A332F" stroke-width="2.6" stroke-linecap="round"/>
  <g class="second"><path d="M1046 86l-9 -17" stroke="#B23A2E" stroke-width="1.6" stroke-linecap="round"/></g>
  <circle cx="1046" cy="86" r="2.6" fill="#2A332F"/>
</g>
<g class="prop" id="bell" tabindex="0" role="button" aria-label="The hall bell. Click it.">
  <g class="bellBody">
    <rect x="1128" y="58" width="6" height="16" fill="#6E7A76"/>
    <path d="M1108 74 q23 -8 46 0 q7 24 -3 32 h-40 q-10 -8 -3 -32 Z" fill="#B08A3A"/>
    <path d="M1108 74 q23 -8 46 0 q-6 5 -23 5 q-17 0 -23 -5 Z" fill="#E4C070"/>
    <path d="M1140 76 q12 3 14 -2 q7 24 -3 32 h-12 q6 -16 1 -30 Z" fill="#8A6A26" opacity=".7"/>
    <rect x="1104" y="104" width="54" height="8" rx="3" fill="#C69A44"/>
    <circle cx="1131" cy="117" r="5" fill="#8A6A26"/>
  </g>
  <g class="ring" fill="none" stroke="#FFE9B0" stroke-width="2.6">
    <path d="M1166 68 q16 20 0 42"/><path d="M1178 58 q26 32 0 62"/>
    <path d="M1096 68 q-16 20 0 42"/><path d="M1084 58 q-26 32 0 62"/>
  </g>
</g>

<!-- ══════════ 1b. WHERE THE LIGHT IS COMING FROM ══════════
     The windows are in the right-hand wall, out of frame, so the only way
     to say where they are is to let them throw their own shape onto the
     back wall: two tall slants of light, leaning because the wall is
     being lit from the side and from low down. -->
<g style="mix-blend-mode:screen" pointer-events="none">
  <path d="M986 368 L1096 0 L1190 0 L1086 368 Z" fill="url(#sunWarm)" opacity=".42"/>
  <path d="M768 368 L878 0 L930 0 L830 368 Z" fill="url(#sunWarm)" opacity=".28"/>
</g>

<!-- ══════════ 2. THE FLOOR ══════════ -->
<rect y="368" width="1200" height="532" fill="url(#floorBase)"/>
<g>
%%TILES%%
</g>

<!-- ══════════════════════════════════════════════════════════════════════
     2b. THE LIGHT ON THE FLOOR

     A window does not throw a glow, it throws its own SHAPE. These are
     rectangles lying on a horizontal plane, and a rectangle on a
     horizontal plane has two vanishing points on the horizon — one for
     each pair of its edges. Both are shared by the floor and the table,
     because parallel horizontal directions vanish at the same point
     whatever height the plane is at, which is what makes the light on the
     table and the light on the floor read as one beam broken by a table
     rather than as two unrelated bright shapes.

     The bars across them are the glazing. Without those a bright quad on
     a floor reads as spilt paint.
     ══════════════════════════════════════════════════════════════════════ -->
<g style="mix-blend-mode:screen" pointer-events="none">
  <path d="%%FLOORLIGHT%%" fill="url(#sunWarm)" opacity=".78" filter="url(#edgeSoft)"/>
</g>
<g pointer-events="none" opacity=".42">
  <path d="%%FLOORBARS%%" fill="#2E4A52" filter="url(#edgeSoft)"/>
</g>

<!-- ══════════ 2c. CHAIRS ══════════
     The three at the far side of the table are standing at 3.3 metres,
     which the horizon turns into 394 pixels per metre — so a 850mm back
     comes out 335 tall and only its top 80 pixels clear the table's far
     edge. The rest is behind the table, which is exactly what you see in
     a hall. The two out on the floor are at six metres and land half the
     size. Nothing here was scaled by eye. -->
<g>
  <g %%CH1%%><ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#shadow)"/>%%CHAIR1%%</g>
  <g %%CH2%%><ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#shadow)"/>%%CHAIR2%%</g>
  <g %%CH3%%><ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#shadow)"/>%%CHAIR3%%</g>
</g>

<!-- ══════════ 3. THE REST OF THE HALL ══════════
     Two more tables, at seven and eight and a half metres. At that
     distance a metre is 186 and 153 pixels, so they come out 335 and 275
     wide — smaller than the near table by exactly as much as the floor
     grid says they should be. -->
<g opacity=".97">
  <g transform="translate(228,474)">
    <ellipse cx="-56" cy="6" rx="210" ry="20" fill="url(#shadow)" filter="url(#softMd)"/>
    <rect x="-168" y="-146" width="336" height="13" rx="2" fill="#D8C29A"/>
    <rect x="-168" y="-146" width="336" height="4" fill="#F2E2BE"/>
    <rect x="-168" y="-133" width="336" height="6" fill="#9E8556"/>
    <rect x="-150" y="-127" width="9" height="127" fill="#8E9A9E"/>
    <rect x="142" y="-127" width="9" height="127" fill="#8E9A9E"/>
    <rect x="-156" y="-4" width="24" height="7" rx="2" fill="#6E7A80"/>
    <rect x="136" y="-4" width="24" height="7" rx="2" fill="#6E7A80"/>
    <rect x="-190" y="-88" width="380" height="11" rx="2" fill="#CDB893"/>
    <rect x="-190" y="-88" width="380" height="3.5" fill="#EADCBB"/>
  </g>
  <g transform="translate(922,412)">
    <ellipse cx="-44" cy="5" rx="170" ry="16" fill="url(#shadow)" filter="url(#softMd)"/>
    <rect x="-138" y="-120" width="276" height="11" rx="2" fill="#D2BB92"/>
    <rect x="-138" y="-120" width="276" height="3.4" fill="#EDDDB8"/>
    <rect x="-138" y="-109" width="276" height="5" fill="#967E50"/>
    <rect x="-122" y="-104" width="7" height="104" fill="#8E9A9E"/>
    <rect x="116" y="-104" width="7" height="104" fill="#8E9A9E"/>
    <rect x="-156" y="-72" width="312" height="9" rx="2" fill="#C6B189"/>
    <rect x="-156" y="-72" width="312" height="3" fill="#E4D5B0"/>
  </g>
  <!-- a radiator, on the wall by the hatch -->
  <g>
    <rect x="952" y="262" width="214" height="86" rx="4" fill="#C8D0C8"/>
    <rect x="952" y="262" width="214" height="9" rx="4" fill="#E8EEE6"/>
    <g fill="#A8B4AC">
      <rect x="962" y="272" width="11" height="68" rx="4"/><rect x="982" y="272" width="11" height="68" rx="4"/>
      <rect x="1002" y="272" width="11" height="68" rx="4"/><rect x="1022" y="272" width="11" height="68" rx="4"/>
      <rect x="1042" y="272" width="11" height="68" rx="4"/><rect x="1062" y="272" width="11" height="68" rx="4"/>
      <rect x="1082" y="272" width="11" height="68" rx="4"/><rect x="1102" y="272" width="11" height="68" rx="4"/>
      <rect x="1122" y="272" width="11" height="68" rx="4"/><rect x="1142" y="272" width="11" height="68" rx="4"/>
    </g>
    <rect x="952" y="262" width="214" height="86" rx="4" fill="url(#hatchSun)"/>
    <rect x="1160" y="336" width="8" height="20" fill="#8E9A94"/>
  </g>
  <!-- two chairs out on the floor: one pushed back from the table, one
       with somebody's jumper still over the back of it -->
  <g %%CH4%%>
    <ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#shadow)"/>
    %%CHAIR4%%
  </g>
  <g %%CH5%%>
    <ellipse cx="-150" cy="10" rx="330" ry="46" fill="url(#shadow)"/>
    %%CHAIR5%%
    <path d="M-160 -792 q80 -26 156 -4 q36 64 18 154 q-20 42 -56 46
             q-42 -72 -118 -50 q-16 -76 0 -146 Z" fill="#7E2C46"/>
    <path d="M-160 -792 q80 -26 156 -4 q-76 6 -152 32 Z" fill="#A85068" opacity=".8"/>
    <path d="M-20 -798 q36 64 18 154 q-20 42 -56 46 q42 -82 38 -200 Z" fill="#5A1C30" opacity=".6"/>
    <path d="M-158 -720 q84 -22 164 -2" fill="none" stroke="#5A1C30" stroke-opacity=".45" stroke-width="10"/>
  </g>

  <!-- and the rest of them stacked against the wall, where they spend
       lunchtime -->
  <g %%CH6%%>
    <ellipse cx="-130" cy="10" rx="300" ry="38" fill="url(#shadow)"/>
    <g transform="translate(0,-30)">%%STACK1%%</g>
    <g transform="translate(-22,-150)">%%STACK2%%</g>
    <g transform="translate(8,-270)">%%STACK3%%</g>
    <g transform="translate(-14,-390)">%%STACK4%%</g>
  </g>

  <g transform="translate(548,444)">
    <ellipse cx="-30" cy="5" rx="66" ry="12" fill="url(#shadow)" filter="url(#softMd)"/>
    <path d="M-42 0 l7 -108 h70 l7 108 Z" fill="#3E5A4E"/>
    <path d="M-42 0 l7 -108 h20 l-5 108 Z" fill="#587A68" opacity=".8"/>
    <path d="M-36 -108 h72 v-9 h-72 Z" fill="#2E4A3E"/>
    <path d="M-30 -117 h60 v-6 q0 -4 -6 -4 h-48 q-6 0 -6 4 Z" fill="#264236"/>
  </g>
</g>
"""


BODY2 = r"""
<!-- ══════════════════════════════════════════════════════════════════════
     4. THE TABLE

     Its two ends run to the vanishing point and its far edge sits where a
     1.1m-deep table 1.95m from the lens actually falls: y=614, not
     wherever looked about right. Everything laid on it from here down is
     drawn in millimetres at its real size, and the scale comes from the
     horizon — 0.864 pixels per millimetre for every unit of (y-120).
     ══════════════════════════════════════════════════════════════════════ -->
<g>
  <path d="%%TABLE%%" fill="#6E5A3A" opacity=".5" filter="url(#softMd)" transform="translate(-16,7)"/>
  <path d="%%TABLE%%" fill="url(#tableTop)"/>
  <!-- laminate grain, running with the length of the board, so to the VP -->
  <g clip-path="url(#tableClip)">
    <path d="%%GRAIN%%" fill="none" stroke="#8E7444" stroke-opacity=".14" stroke-width="1.2"/>
    <path d="%%SCUFF%%" fill="none" stroke="#F6EBCE" stroke-opacity=".3" stroke-width="2.2"/>
    <rect x="-20" y="600" width="1240" height="320" fill="url(#tableSun)"/>
  </g>
  <!-- the light, cut to the table it is lying on. Its clip and its blend
       are both on the path itself: put the clip on a parent GROUP and
       that group becomes a stacking context, and a stacking context
       isolates the blending of everything inside it. -->
  <path d="%%TABLELIGHT%%" clip-path="url(#tableClip)" fill="url(#sunWarm)"
        opacity=".92" filter="url(#edgeSoft)" style="mix-blend-mode:screen"/>
  <g clip-path="url(#tableClip)" opacity=".34">
    <path d="%%TABLEBARS%%" fill="#25454E" filter="url(#edgeSoft)"/>
  </g>
  <!-- the far edge, and the shadow the table drops into the floor behind -->
  <path d="M%%TFL%% %%TFY%% L%%TFR%% %%TFY%%" stroke="#8E7444" stroke-opacity=".5" stroke-width="2"/>
  <path d="M%%TFL%% %%TFY%% L%%TFR%% %%TFY%%" stroke="#FFF2D4" stroke-opacity=".5" stroke-width="1.4"
        transform="translate(0,-1.6)"/>
</g>
"""


def props():
    return f"""
<!-- ══════════════════════════════════════════════════════════════════════
     6. WHAT LUNCH LEFT BEHIND THAT ISN'T RUBBISH

     All of it drawn in millimetres at real size. Anything lying FLAT is
     also squashed by (y-120)/1300 — the foreshortening of the table plane
     at that height — because a 420mm tray drawn as a 420x320 rectangle
     looks like it is standing on its edge.
     ══════════════════════════════════════════════════════════════════════ -->

<!-- ── the tray. Still someone's, until it goes back on the rack. ─────── -->
<g {place_flat(420, 768)}>
  <ellipse cx="-90" cy="26" rx="290" ry="180" fill="url(#shadow)" opacity=".8"/>
  <path d="M-210 -160 h420 q18 0 18 18 v284 q0 18 -18 18 h-420 q-18 0 -18 -18
           v-284 q0 -18 18 -18 Z" fill="#3A8072"/>
  <path d="M-210 -160 h420 q18 0 18 18 v20 h-456 v-20 q0 -18 18 -18 Z" fill="#5C9E90"/>
  <path d="M192 -160 h18 q18 0 18 18 v284 q0 18 -18 18 h-18 Z" fill="#2A5A50" opacity=".8"/>
  <path d="M228 -142 v284" stroke="#FFF4D2" stroke-width="7" fill="none" opacity=".75"/>
  <path d="M-210 -160 h420" stroke="#8FD8C6" stroke-opacity=".45" stroke-width="5" fill="none"/>
  <path d="M-196 -146 h392 v266 h-392 Z" fill="#337063"/>
  <g fill="#2C5A51">
    <rect x="-186" y="-136" width="176" height="120" rx="10"/>
    <rect x="4" y="-136" width="180" height="120" rx="10"/>
    <rect x="-186" y="-4" width="120" height="116" rx="10"/>
    <rect x="-56" y="-4" width="110" height="116" rx="10"/>
    <rect x="66" y="-4" width="118" height="116" rx="10"/>
  </g>
  <!-- what is left of it: a roll torn in half, peas, beans, and a pot
       of something pink with a spoon still standing in it -->
  <path d="M-158 -104 q52 -30 104 -2 q22 40 -20 58 q-62 14 -90 -14 q-14 -30 6 -42 Z" fill="#C89A52"/>
  <path d="M-158 -104 q52 -30 104 -2 q-42 6 -62 0 q-24 -8 -42 2 Z" fill="#E8C078"/>
  <path d="M-146 -74 q48 12 88 2" fill="none" stroke="#F4E2BC" stroke-width="9" stroke-linecap="round"/>
  <path d="M-52 -98 q12 -4 16 4 q2 8 -8 10 Z" fill="#A87C36" opacity=".7"/>
  <g fill="#7FA83E">
    <circle cx="46" cy="-96" r="15"/><circle cx="78" cy="-102" r="14"/><circle cx="110" cy="-92" r="15"/>
    <circle cx="62" cy="-70" r="14"/><circle cx="96" cy="-66" r="15"/><circle cx="130" cy="-74" r="13"/>
    <circle cx="44" cy="-64" r="12"/><circle cx="114" cy="-108" r="12"/>
  </g>
  <g fill="#9CC85A">
    <circle cx="42" cy="-101" r="6"/><circle cx="74" cy="-107" r="5.5"/><circle cx="106" cy="-97" r="6"/>
    <circle cx="58" cy="-75" r="5.5"/><circle cx="92" cy="-71" r="6"/>
  </g>
  <path d="M-150 26 q46 -16 90 4 q12 44 -32 60 q-52 8 -66 -22 q-6 -32 8 -42 Z" fill="#C8562E"/>
  <path d="M-150 26 q46 -16 90 4 q-30 8 -50 4 q-20 -6 -40 -8 Z" fill="#E4784C" opacity=".85"/>
  <g fill="#E8B23A">
    <ellipse cx="-124" cy="40" rx="10" ry="7" transform="rotate(-20 -124 40)"/>
    <ellipse cx="-96" cy="58" rx="10" ry="7" transform="rotate(14 -96 58)"/>
    <ellipse cx="-66" cy="44" rx="10" ry="7" transform="rotate(-8 -66 44)"/>
    <ellipse cx="-104" cy="24" rx="9" ry="6" transform="rotate(30 -104 24)"/>
  </g>
  <g transform="translate(92,52)">
    <path d="M-40 -6 q40 10 80 0 l-8 46 q-32 8 -64 0 Z" fill="#E8E4DA"/>
    <path d="M-40 -6 q40 10 80 0 l-2 12 q-38 10 -76 0 Z" fill="#F6F4EE"/>
    <ellipse cx="0" cy="-4" rx="40" ry="11" fill="#E486A0"/>
    <ellipse cx="-8" cy="-6" rx="20" ry="5" fill="#F4AEC0" opacity=".8"/>
    <path d="M22 -10 l14 -44 l7 2 l-13 44 Z" fill="#DCE2E6"/>
    <path d="M22 -10 l6 -20 l6 2 l-5 19 Z" fill="#FFFFFF" opacity=".7"/>
  </g>
  <!-- a fork left in the tray -->
  <g transform="rotate(-24 96 60)">
    <rect x="56" y="48" width="112" height="9" rx="4" fill="url(#steel)"/>
    <path d="M40 44 h20 v18 h-20 Z" fill="url(#steel)"/>
    <path d="M28 42 h6 v22 h-6 Z M38 42 h6 v22 h-6 Z M48 42 h6 v22 h-6 Z" fill="#C6D0D4"/>
  </g>
</g>

<!-- ── a stack of trays, waiting to go back ───────────────────────────── -->
<g {place(876, 662)}>
  {sh(96, 430)}
  <g transform="scale(1,{f(fore(662),3)})"><ellipse cx="0" cy="0" rx="230" ry="176" fill="url(#occl)"/></g>
  <g transform="translate(0,-14)">
    <path d="M-216 0 h432 v-16 h-432 Z" fill="#2A5A50"/>
    <path d="M-216 -16 h432 v-5 h-432 Z" fill="#7FBAAC"/>
  </g>
  <g transform="translate(-8,-40)">
    <path d="M-216 0 h432 v-16 h-432 Z" fill="#2E6258"/>
    <path d="M-216 -16 h432 v-5 h-432 Z" fill="#86C2B2"/>
  </g>
  <g transform="translate(6,-66)">
    <path d="M-216 0 h432 v-16 h-432 Z" fill="#2A5A50"/>
    <path d="M-216 -16 h432 v-5 h-432 Z" fill="#7FBAAC"/>
  </g>
  <g transform="translate(-2,-92)">
    <path d="M-216 0 h432 v-18 h-432 Z" fill="#3E7A6E"/>
    <path d="M-216 -18 h432 v-6 h-432 Z" fill="#9BD2C2"/>
    <g transform="translate(0,-24) scale(1,{f(fore(662),3)})">
      <path d="M-216 -134 h432 q16 0 16 16 v236 q0 16 -16 16 h-432 q-16 0 -16 -16
               v-236 q0 -16 16 -16 Z" fill="#54948A"/>
      <path d="M-200 -120 h400 v220 h-400 Z" fill="#3E7A6E"/>
    </g>
  </g>
</g>

<!-- ── someone's book, left open, and the pencil that was in it ───────── -->
<g {place_flat(630, 852, ' rotate(-7)')}>
  <ellipse cx="-70" cy="20" rx="230" ry="130" fill="url(#shadow)" opacity=".7"/>
  <path d="M-200 -110 h196 v220 h-196 Z" fill="#F2EEDE"/>
  <path d="M4 -110 h196 v220 h-196 Z" fill="#FAF6E8"/>
  <path d="M-6 -110 h12 v220 h-12 Z" fill="#D8D0B8"/>
  <path d="M-200 -110 h400 v10 h-400 Z" fill="#FFFDF4"/>
  <g stroke="#7E9EC4" stroke-width="4" stroke-opacity=".55">
    <path d="M-182 -80 h160M-182 -54 h160M-182 -28 h160M-182 -2 h160M-182 24 h160
             M-182 50 h160M-182 76 h160"/>
    <path d="M22 -80 h160M22 -54 h160M22 -28 h160M22 -2 h160M22 24 h160"/>
  </g>
  <g stroke="#2E4658" stroke-width="5" stroke-linecap="round" stroke-opacity=".75">
    <path d="M-176 -84 h104M-176 -58 h132M-176 -32 h88M-176 -6 h124M-176 20 h70"/>
    <path d="M28 -84 h118M28 -58 h86M28 -32 h132"/>
  </g>
  <path d="M-200 -110 h400 v220 h-400 Z" fill="none" stroke="#C4BCA0" stroke-width="3"/>
  <g transform="rotate(16 250 40)">
    <rect x="150" y="30" width="230" height="20" rx="3" fill="#E8B23A"/>
    <rect x="150" y="30" width="230" height="7" rx="3" fill="#FFD778"/>
    <path d="M380 30 l34 10 l-34 10 Z" fill="#E2C89E"/>
    <path d="M404 36 l10 4 l-10 4 Z" fill="#2E3238"/>
    <rect x="130" y="30" width="22" height="20" fill="#C6CAD0"/>
    <rect x="112" y="31" width="20" height="18" rx="4" fill="#E88A8A"/>
  </g>
</g>

<!-- ── the water jug, and a beaker somebody poured and forgot ─────────
     Take one was a translucent box. What makes a jug a jug is the three
     things sticking off it: a handle, a spout pulled out of the rim, and
     a lid sitting proud of it. -->
<g class="prop" id="waterjug" tabindex="0" role="button"
   aria-label="The water jug. Click to slosh it." {place(236, 690)}>
  {sh(250, 170)}
  <g transform="scale(1,{f(fore(690),3)})"><ellipse cx="0" cy="0" rx="94" ry="84" fill="url(#occl)"/></g>
  <path d="M-74 0 q-8 -200 2 -222 h144 q10 22 2 222 Z" fill="#E2EEF0" opacity=".55"/>
  <!-- the water, and the line where it stops -->
  <g class="water">
    <path d="M-68 -14 q68 12 136 0 l0 -128 q-68 14 -136 0 Z" fill="#8FC4DA" opacity=".62"/>
    <path d="M-68 -142 q68 14 136 0 l0 10 q-68 14 -136 0 Z" fill="#C4E4F0" opacity=".8"/>
    <path d="M-60 -136 q34 8 68 4" fill="none" stroke="#EAF6FC" stroke-opacity=".8" stroke-width="6"/>
  </g>
  <!-- the far wall of it showing through the near one -->
  <path d="M-54 -16 q54 9 108 0 l0 -192 h-108 Z" fill="#7EA8B8" opacity=".16"/>
  <!-- spout, pulled out of the rim on the far side -->
  <path d="M-74 -222 h148 q6 0 6 8 h-160 q0 -8 6 -8 Z" fill="#EEF6F8"/>
  <path d="M28 -230 q34 -4 44 -18 q6 12 -6 20 q-16 8 -38 6 Z" fill="#DCEAEE"/>
  <!-- the lid, sitting proud -->
  <path d="M-66 -232 h132 q8 0 8 10 q0 8 -8 8 h-132 q-8 0 -8 -8 q0 -10 8 -10 Z" fill="#2E6E8E"/>
  <path d="M-66 -232 h132 q8 0 8 10 q-74 -8 -148 1 q0 -11 8 -11 Z" fill="#5A9EBE" opacity=".85"/>
  <path d="M-18 -244 h36 q6 0 6 6 v6 h-48 v-6 q0 -6 6 -6 Z" fill="#256078"/>
  <!-- the handle, with a hole in it like the milk jug's -->
  <path fill-rule="evenodd" fill="#DCEAEE" opacity=".85"
        d="M70 -206 Q126 -196 126 -124 Q126 -52 70 -42 L70 -66 Q102 -76 102 -124
           Q102 -172 70 -182 Z"/>
  <path d="M70 -206 Q126 -196 126 -124" fill="none" stroke="#FFFFFF" stroke-width="7"/>
  <path d="M-66 -216 q-6 104 0 208" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="9"/>
  <path d="M70 -214 q8 104 0 210" fill="none" stroke="#FFFBEC" stroke-width="8"/>
</g>
<g {place(360, 726)}>
  {sh(95, 70)}
  <g transform="scale(1,{f(fore(726),3)})"><ellipse cx="0" cy="0" rx="40" ry="35" fill="url(#occl)"/></g>
  <path d="M-34 0 q-3 -74 2 -88 h64 q5 14 2 88 Z" fill="#E4EEF0" opacity=".6"/>
  <path d="M-32 -16 q32 6 64 0 l0 -44 q-32 7 -64 0 Z" fill="#8FC4DA" opacity=".62"/>
  <path d="M-32 -60 q32 7 64 0 l0 6 q-32 7 -64 0 Z" fill="#C4E4F0" opacity=".85"/>
  <path d="M-34 -88 q34 -8 68 0 q-34 9 -68 0 Z" fill="#F2FAFC" opacity=".9"/>
  <path d="M-26 -84 q-2 42 0 80" fill="none" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="7"/>
  <path d="M30 -84 q3 42 0 80" fill="none" stroke="#FFFBEC" stroke-width="6"/>
</g>

<!-- ── a banana that is still a banana ────────────────────────────────── -->
<g {place_flat(706, 786, ' rotate(-16)')}>
  <ellipse cx="-40" cy="24" rx="140" ry="76" fill="url(#shadow)" opacity=".75"/>
  <path d="M-108 26 q-16 -58 34 -84 q52 -28 122 -12 q34 8 44 22 q-14 26 -60 40
           q-62 18 -110 42 q-22 6 -30 -8 Z" fill="#E8C63E"/>
  <path d="M-108 26 q-16 -58 34 -84 q52 -28 122 -12 q-70 -4 -114 26 q-40 28 -42 70 Z" fill="#F6E278"/>
  <path d="M60 -68 q34 8 44 22 q-14 26 -60 40 q28 -22 30 -40 q2 -14 -14 -22 Z" fill="#B99A24" opacity=".7"/>
  <path d="M-108 26 q10 12 30 8 q6 10 -8 14 q-20 2 -22 -22 Z" fill="#4E3E1E"/>
  <path d="M96 -56 q22 -4 26 6 q4 10 -12 12 Z" fill="#8E7420"/>
  <path d="M-58 -46 q60 -28 122 -20" fill="none" stroke="#C6A82C" stroke-opacity=".55" stroke-width="5"/>
</g>

<!-- ── a pencil case, and a paper plane somebody never got to throw ───── -->
<g {place_flat(1058, 864, ' rotate(9) scale(.62)')}>
  <ellipse cx="-70" cy="22" rx="180" ry="86" fill="url(#shadow)" opacity=".75"/>
  <path d="M-150 -60 h300 q20 0 20 20 v70 q0 20 -20 20 h-300 q-20 0 -20 -20
           v-70 q0 -20 20 -20 Z" fill="#3E5A8E"/>
  <path d="M168 -34 v56" stroke="#FFF4D2" stroke-width="9" fill="none" opacity=".7"/>
  <path d="M-150 -60 h300 q20 0 20 20 v12 h-340 v-12 q0 -20 20 -20 Z" fill="#5E7EB4"/>
  <path d="M-160 -4 h320 v12 h-320 Z" fill="#D6B23A"/>
  <g fill="#E8C86A"><circle cx="-120" cy="2" r="5"/><circle cx="-96" cy="2" r="5"/>
    <circle cx="-72" cy="2" r="5"/><circle cx="-48" cy="2" r="5"/><circle cx="-24" cy="2" r="5"/>
    <circle cx="0" cy="2" r="5"/><circle cx="24" cy="2" r="5"/><circle cx="48" cy="2" r="5"/>
    <circle cx="72" cy="2" r="5"/><circle cx="96" cy="2" r="5"/><circle cx="120" cy="2" r="5"/></g>
  <path d="M150 -10 q22 2 22 14 q0 12 -22 14 Z" fill="#C6A02E"/>
</g>
<g class="prop" id="plane" tabindex="0" role="button"
   aria-label="A paper plane. Click to launch it." {place_flat(668, 650, ' rotate(-14)')}>
  <g class="plane">
    <ellipse cx="-56" cy="26" rx="150" ry="76" fill="url(#shadow)" opacity=".7"/>
    <path d="M-150 34 L156 -22 L-92 -34 Z" fill="#F4F2E8"/>
    <path d="M-150 34 L156 -22 L4 4 Z" fill="#FDFCF6"/>
    <path d="M-92 -34 L156 -22 L-4 -6 Z" fill="#DAD6C8"/>
    <path d="M-92 -34 L156 -22" fill="none" stroke="#B8B2A0" stroke-width="2.4"/>
    <path d="M-150 34 L156 -22" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="2.4"/>
    <path d="M-150 34 L-92 -34" fill="none" stroke="#C6C0B0" stroke-width="2"/>
  </g>
</g>

<!-- ── a lanyard, dropped ─────────────────────────────────────────────── -->
<g {place_flat(560, 700, ' rotate(4)')}>
  <ellipse cx="-40" cy="16" rx="140" ry="70" fill="url(#shadow)" opacity=".6"/>
  <path d="M-134 -30 q46 -36 96 -6 q48 30 96 -4" fill="none" stroke="#2E5E8E" stroke-width="16"/>
  <path d="M-134 -30 q46 -36 96 -6 q48 30 96 -4" fill="none" stroke="#5E8EBE" stroke-width="6"/>
  <path d="M46 -14 h84 v66 h-84 Z" fill="#F6F4EC"/>
  <path d="M46 -14 h84 v18 h-84 Z" fill="#2E5E8E"/>
  <circle cx="64" cy="18" r="11" fill="#C6CEDA"/>
  <path d="M82 10 h38 M82 22 h30 M82 34 h34" stroke="#9EA8B4" stroke-width="4" stroke-linecap="round"/>
  <path d="M46 -14 h84 v66 h-84 Z" fill="none" stroke="#C2BCA8" stroke-width="2.4"/>
</g>

<!-- ── a rucksack, dumped on the table ────────────────────────────────── -->
<g {place(330, 638)}>
  {sh(250, 300)}
  <g transform="scale(1,{f(fore(638),3)})"><ellipse cx="0" cy="0" rx="170" ry="130" fill="url(#occl)"/></g>
  <path d="M-140 0 q-18 -170 20 -206 q56 -34 124 -6 q46 22 30 212 Z" fill="#2E4A6E"/>
  <path d="M-140 0 q-18 -170 20 -206 q22 -14 44 -16 q-46 60 -30 222 Z" fill="#4A6E9A" opacity=".75"/>
  <path d="M66 -196 q46 22 30 196 h-34 q16 -136 4 -196 Z" fill="#1E3450" opacity=".7"/>
  <path d="M92 -168 q26 76 4 168" fill="none" stroke="#FFF4D2" stroke-width="8" opacity=".7"/>
  <path d="M-128 -76 q66 22 132 0 q4 40 0 76 h-132 q-6 -40 0 -76 Z" fill="#26405E"/>
  <path d="M-128 -76 q66 22 132 0" fill="none" stroke="#7E9EC4" stroke-opacity=".5" stroke-width="5"/>
  <path d="M-72 -196 q56 -20 108 6" fill="none" stroke="#D8A83A" stroke-width="11"/>
  <path d="M-72 -196 q56 -20 108 6" fill="none" stroke="#F4CE72" stroke-width="4"/>
  <circle cx="40" cy="-186" r="13" fill="#C6CEDA"/>
  <circle cx="40" cy="-186" r="6" fill="#6E7A88"/>
  <path d="M-96 -160 q40 -24 86 -8" fill="none" stroke="#1E3450" stroke-opacity=".6" stroke-width="7"/>
</g>
"""


def litter():
    return f"""
<!-- ══════════════════════════════════════════════════════════════════════
     7. THE LITTER — the five clues

     Drawn to the same rules as everything else on this table: real
     millimetres, the window on the right so the hot edge is on the right
     and the shadow goes left, and anything lying flat squashed by the
     foreshortening of the plane it is lying on.

     The gum needed thinking about rather than drawing, because a chewed
     wad has no shape of its own. In the park it was a stick wrapper; here
     it is the BLISTER STRIP — a row of domes in foil is one of the most
     recognisable small objects there is, and it is a different image of
     the same rubbish, which is what the second telling of a lesson wants.
     ══════════════════════════════════════════════════════════════════════ -->

<!-- ── s1 · PLASTIC MILK JUG · recyclable ──────────────────────────────
     The three things that actually make one of these look real, none of
     which a bottle shape gets you:

       · a HOLE. The handle is a recess moulded into the side, so you see
         the table straight through it. It is drawn as a second subpath
         on the body with fill-rule evenodd, which makes it a genuine
         hole rather than a grey patch pretending to be one — and that
         one detail does more than everything else here put together.
       · HDPE is translucent, not transparent and not opaque. The body is
         carried at 0.9 so the table dims through it, the far wall of the
         jug shows as a darker band inside the near one, and the milk
         left in the bottom reads through the plastic rather than sitting
         on top of it.
       · light goes THROUGH it. The sun is off to the right, so the jug
         throws a shadow that is warm and bright near the glass rather
         than simply dark — a translucent object does not cast the same
         shadow as a brick.
     -->
<g id="lit-s1" {place(168, 828)}>
  {sh(300, 165)}
  <!-- the shadow a translucent thing casts: light comes through the milk
       and warms the middle of it -->
  <ellipse cx="-190" cy="26" rx="150" ry="52" fill="#FFE8B4" opacity=".3"
           transform="rotate(-20 -190 26)"/>
  <g transform="scale(1,{f(fore(828),3)})"><ellipse cx="0" cy="0" rx="92" ry="80" fill="url(#occl)"/></g>

  <!-- what is left in the bottom of it, drawn BE{f(fore(828),3)} the body so it reads
       through the plastic instead of on top of it -->
  <path d="M-70 -6 q70 13 140 0 l0 -84 q-70 15 -140 0 Z" fill="#FFFFFF"/>
  <path d="M-70 -90 q70 15 140 0 l0 12 q-70 15 -140 0 Z" fill="#F2F8F6"/>
  <path d="M-70 -90 q70 15 140 0" fill="none" stroke="#DCE8E4" stroke-width="4"/>
  <path d="M-62 -80 q34 8 68 5" fill="none" stroke="#FFFFFF" stroke-width="6"/>
  <path d="M40 -84 q22 -2 30 -6 l0 78 q-14 5 -30 7 Z" fill="#E4EEEC" opacity=".7"/>

  <!-- the body, with the handle punched through it -->
  <path fill-rule="evenodd" opacity=".9" fill="url(#hdpe)"
        d="M-72 0 Q-80 0 -80 -14 L-80 -196 Q-80 -206 -74 -214 L-50 -256
           Q-44 -264 -44 -274 L-44 -300 L44 -300 L44 -274 Q44 -264 50 -256
           L74 -214 Q80 -206 80 -196 L80 -14 Q80 0 72 0 Z
           M34 -206 Q34 -222 48 -222 L54 -222 Q68 -222 68 -206 L68 -130
           Q68 -114 54 -114 L48 -114 Q34 -114 34 -130 Z"/>
  <!-- the far wall of the jug, seen through the near one -->
  <path d="M-58 -14 L-58 -192 Q-58 -200 -54 -206 L-34 -244 L34 -244
           L54 -206 Q58 -200 58 -192 L58 -14 Z" fill="#B8C8C6" opacity=".2"/>
  <!-- the two corners the window finds, which is where the shape reads -->
  <path d="M-80 -14 L-80 -196 Q-80 -206 -74 -214 L-50 -256" fill="none"
        stroke="#FFFFFF" stroke-opacity=".75" stroke-width="9"/>
  <path d="M80 -14 L80 -196 Q80 -206 74 -214 L50 -256" fill="none"
        stroke="#FFFBEC" stroke-width="13"/>
  <path d="M78 -20 L78 -194" fill="none" stroke="#FFFFFF" stroke-width="5"/>
  <path d="M68 -206 Q68 -222 54 -222" fill="none"
        stroke="#FFFFFF" stroke-opacity=".8" stroke-width="6"/>
  <path d="M-80 -30 L-80 -196" fill="none" stroke="#7E9290" stroke-opacity=".3" stroke-width="4"/>
  <!-- the ribs round the bottom, which is where the plastic is stiffened -->
  <g stroke="#9EB2B0" stroke-opacity=".38" stroke-width="4" fill="none">
    <path d="M-76 -24 q76 12 152 0 M-77 -44 q77 12 154 0 M-78 -64 q78 12 156 0"/>
  </g>
  <g stroke="#FFFFFF" stroke-opacity=".5" stroke-width="2.4" fill="none">
    <path d="M-76 -28 q76 12 152 0 M-77 -48 q77 12 154 0"/>
  </g>
  <!-- the recessed panel, and the date stamped into it -->
  <path d="M-58 -178 h84 v54 h-84 Z" fill="#DCE8E6" opacity=".45"/>
  <path d="M-58 -178 h84 v54 h-84 Z" fill="none" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="2.4"/>
  <path d="M-48 -160 h60 M-48 -146 h44" stroke="#8EA2A0" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>
  <!-- the label -->
  <path d="M-78 -120 h124 v-3 q0 0 0 0 h-124 Z" fill="none"/>
  <path d="M-76 -112 q76 12 150 0 l0 44 q-74 12 -150 0 Z" fill="#F8FCFA" opacity=".95"/>
  <path d="M-76 -112 q76 12 150 0 l0 13 q-74 12 -150 0 Z" fill="#2E86C4"/>
  <path d="M-64 -86 q56 8 110 0 M-64 -74 q42 6 82 2" stroke="#6E8E9E" stroke-width="5"
        stroke-linecap="round" fill="none"/>
  <!-- neck, tamper ring and a ribbed cap -->
  <path d="M-44 -300 h88 v-18 h-88 Z" fill="#EEF4F2" opacity=".92"/>
  <path d="M-44 -318 h88 v-8 h-88 Z" fill="#C6D4D2" opacity=".9"/>
  <path d="M-50 -326 h100 v34 q0 6 -8 6 h-84 q-8 0 -8 -6 Z" fill="#2E86C4"
        transform="translate(0,-26)"/>
  <path d="M-50 -352 h24 v40 h-16 q-8 0 -8 -6 Z" fill="#7EC0EE" opacity=".85"/>
  <path d="M-50 -352 h100 v6 h-100 Z" fill="#A6DCFA" opacity=".85"/>
  <path d="M26 -352 h24 v34 q0 6 -8 6 h-16 Z" fill="#1E5E92" opacity=".55"/>
  <g stroke="#1E5E92" stroke-opacity=".45" stroke-width="2.6">
    <path d="M-38 -350 v32M-24 -350 v32M-10 -350 v32M4 -350 v32M18 -350 v32M32 -350 v32"/>
  </g>
</g>

<!-- ── s2 · CRACKED TABLET · e-waste ───────────────────────────────────── -->
<g id="lit-s2" {place_flat(700, 716, ' rotate(-5)')}>
  <ellipse cx="-80" cy="26" rx="230" ry="140" fill="url(#shadow)" opacity=".85"/>
  <path d="M-128 -92 h256 q14 0 14 14 v156 q0 14 -14 14 h-256 q-14 0 -14 -14
           v-156 q0 -14 14 -14 Z" fill="#2A3038"/>
  <path d="M-128 -92 h256 q14 0 14 14 v6 h-284 v-6 q0 -14 14 -14 Z" fill="#59626C"/>
  <path d="M-114 -78 h228 v164 h-228 Z" fill="#12161C"/>
  <g id="screenLive">
    <path d="M-114 -78 h228 v164 h-228 Z" fill="#1E4A7E"/>
    <g fill="#4A7EBE" opacity=".85">
      <rect x="-96" y="-58" width="44" height="44" rx="9"/><rect x="-42" y="-58" width="44" height="44" rx="9"/>
      <rect x="12" y="-58" width="44" height="44" rx="9"/><rect x="66" y="-58" width="44" height="44" rx="9"/>
      <rect x="-96" y="-4" width="44" height="44" rx="9"/><rect x="-42" y="-4" width="44" height="44" rx="9"/>
      <rect x="12" y="-4" width="44" height="44" rx="9"/>
    </g>
  </g>
  <!-- the crack. It starts at ONE impact point and radiates from it, with
       concentric rings crossing the radials — glass that is cracked all
       over evenly has not been dropped, it has been scribbled on. -->
  <g stroke="#E4EEF6" fill="none" stroke-opacity=".85">
    <path d="M-52 -18 L-114 -66 M-52 -18 L-70 -78 M-52 -18 L-8 -78 M-52 -18 L52 -60
             M-52 -18 L114 -6 M-52 -18 L86 60 M-52 -18 L18 86 M-52 -18 L-50 86
             M-52 -18 L-114 42 M-52 -18 L-114 -14" stroke-width="2.2"/>
    <path d="M-76 -44 L-62 -52 L-40 -50 L-22 -40 L-18 -22 L-24 -2 L-40 8 L-64 4
             L-78 -12 L-80 -32 Z" stroke-width="1.8" stroke-opacity=".7"/>
    <path d="M-104 -62 L-70 -70 L-26 -62 L14 -42 L24 -18 L16 14 L-14 40 L-56 44
             L-90 28 L-104 -6 Z" stroke-width="1.6" stroke-opacity=".5"/>
  </g>
  <circle cx="-52" cy="-18" r="7" fill="#D8E4EE" opacity=".8"/>
  <circle cx="-52" cy="-18" r="16" fill="#9EB4C6" opacity=".25"/>
  <!-- the glare the window puts on it, which is why the crack shows -->
  <path d="M28 -78 L114 -78 L114 -40 L-12 86 L-88 86 Z" fill="#FFF2CE" opacity=".16"/>
  <path d="M60 -78 L92 -78 L-28 86 L-60 86 Z" fill="#FFF6DC" opacity=".2"/>
  <circle cx="0" cy="-86" r="4" fill="#3E4650"/>
</g>

<!-- ── s3 · CHEWING GUM · general ──────────────────────────────────────── -->
<g id="lit-s3" {place_flat(432, 858, ' rotate(-8)')}>
  <ellipse cx="-44" cy="14" rx="130" ry="64" fill="url(#shadow)" opacity=".8"/>
  <!-- the blister strip, three domes empty, one still full -->
  <path d="M-96 -24 h176 q10 0 10 10 v34 q0 10 -10 10 h-176 q-10 0 -10 -10
           v-34 q0 -10 10 -10 Z" fill="url(#foil)"/>
  <path d="M-96 -24 h176 q10 0 10 10 v8 h-196 v-8 q0 -10 10 -10 Z" fill="#FFFFFF" opacity=".7"/>
  <g fill="#B8C2CC">
    <ellipse cx="-62" cy="-6" rx="20" ry="16"/><ellipse cx="-16" cy="-6" rx="20" ry="16"/>
    <ellipse cx="30" cy="-6" rx="20" ry="16"/>
  </g>
  <g fill="#8E98A4" opacity=".8">
    <path d="M-80 -14 q18 -10 36 0 q-18 8 -36 0 Z"/>
    <path d="M-34 -14 q18 -10 36 0 q-18 8 -36 0 Z"/>
    <path d="M12 -14 q18 -10 36 0 q-18 8 -36 0 Z"/>
  </g>
  <ellipse cx="66" cy="-6" rx="21" ry="17" fill="#E8EEF4"/>
  <ellipse cx="62" cy="-11" rx="12" ry="8" fill="#FFFFFF"/>
  <path d="M-96 -24 h176 q10 0 10 10 v34 q0 10 -10 10 h-176 q-10 0 -10 -10
           v-34 q0 -10 10 -10 Z" fill="none" stroke="#6E7A86" stroke-opacity=".45" stroke-width="2"/>
  <path d="M-106 4 h196" stroke="#6E7A86" stroke-opacity=".3" stroke-width="1.6"/>
  <!-- and the one that was in it, on the table, going grey -->
  <g transform="translate(-140,4)">
    <ellipse cx="2" cy="4" rx="26" ry="12" fill="#17302E" opacity=".4"/>
    <path d="M-24 2 q-8 -14 8 -18 q13 -3 21 1 q12 -5 17 2 q4 7 -6 9
             q8 4 1 9 q-11 5 -25 3 q-12 -1 -16 -6 Z" fill="#A79A9C"/>
    <path d="M-24 2 q-8 -14 8 -18 q8 -2 14 0 q-11 6 -11 18 Z" fill="#BEB2B4"/>
    <path d="M5 -15 q12 -5 17 2 q4 7 -6 9 q-8 -7 -11 -11 Z" fill="#908486"/>
    <path d="M-14 -11 q8 -3 14 0" fill="none" stroke="#D2C8C9" stroke-opacity=".6" stroke-width="2"/>
  </g>
</g>

<!-- ── s4 · APPLE CORE · organic ───────────────────────────────────────
     Take one was lying on its side and came out as two red discs with a
     twig. What says 'apple core' is the HOURGLASS: skin at the top, skin
     at the bottom, and a waist between them eaten down to the pips. Lay
     that on its side and the silhouette is gone, so this one stands. -->
<g id="lit-s4" {place(822, 832, ' rotate(-9)')}>
  {sh(96, 62)}
  <g transform="scale(1,{f(fore(818),3)})"><ellipse cx="0" cy="0" rx="40" ry="34" fill="url(#occl)"/></g>
  <!-- the waist: what is left between two bites, and it is not white any
       more — cut apple goes brown in about ten minutes -->
  <path d="M-24 -6 q-6 -18 4 -30 q-8 -14 -2 -28 q10 6 22 6 q12 0 22 -6
           q6 14 -2 28 q10 12 4 30 q-12 -6 -24 -6 q-12 0 -24 6 Z" fill="#E0CCA0"/>
  <path d="M-24 -6 q-6 -18 4 -30 q-8 -14 -2 -28 q6 4 12 5 q-10 26 -4 46
           q2 6 4 10 q-8 -4 -14 -3 Z" fill="#EFE0BC"/>
  <path d="M24 -64 q6 14 -2 28 q10 12 4 30 q-6 -2 -13 -3 q8 -22 2 -40
           q-2 -8 -5 -12 q8 -1 14 -3 Z" fill="#B49A6A" opacity=".8"/>
  <path d="M-20 -36 q20 -8 40 0" fill="none" stroke="#9E7C46" stroke-opacity=".55" stroke-width="3"/>
  <path d="M-18 -52 q18 -7 36 0" fill="none" stroke="#9E7C46" stroke-opacity=".4" stroke-width="2.6"/>
  <!-- a pip showing through, because a core is a core -->
  <path d="M-2 -40 q7 -3 9 4 q-2 7 -9 4 Z" fill="#4E3A1E"/>
  <!-- the skin still on, top and bottom -->
  <path d="M-30 -70 q30 -16 60 -2 q4 12 -6 14 q-24 -10 -48 0 q-10 -4 -6 -12 Z" fill="#C0392B"/>
  <path d="M-30 -70 q30 -16 60 -2 q-30 -4 -60 6 Z" fill="#E4685C"/>
  <path d="M16 -84 q14 2 14 12 q-6 -6 -14 -8 Z" fill="#8E2418" opacity=".55"/>
  <path d="M-28 4 q28 12 56 0 q-4 12 -14 15 q-16 5 -28 0 q-10 -3 -14 -15 Z" fill="#B3352A"/>
  <path d="M-28 4 q28 12 56 0 q-2 5 -4 8 q-26 8 -48 0 q-3 -4 -4 -8 Z" fill="#D8584A"/>
  <!-- stalk and one leaf -->
  <path d="M0 -80 q-5 -22 8 -34" fill="none" stroke="#6E5230" stroke-width="6" stroke-linecap="round"/>
  <path d="M0 -80 q-5 -22 8 -34" fill="none" stroke="#A0804E" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M6 -106 q18 -12 28 0 q-16 12 -28 0 Z" fill="#6E8E3A"/>
  <path d="M6 -106 q18 -12 28 0 q-14 -3 -28 0 Z" fill="#8FB050"/>
</g>

<!-- ── s5 · CHARGING CABLE · e-waste ───────────────────────────────────
     Take one had a run as thick as the loop it was making and came out
     as a magnifying glass. A cable is identified by two things and only
     two: that it crosses OVER ITSELF, and that it has ends. So the run
     is thin against the size of its loops, the crossings are drawn as
     crossings, and both plugs are at free ends. -->
<g id="lit-s5" {place_flat(1010, 800, ' rotate(4)')}>
  <ellipse cx="-80" cy="34" rx="230" ry="120" fill="url(#shadow)" opacity=".8"/>
  <g fill="none" stroke-linecap="round">
    <!-- the far loop, laid down first so the near one crosses over it -->
    <path d="M-196 40 C -250 -40, -150 -104, -46 -86 C 60 -68, 122 -6, 78 44"
          stroke="#1A1E24" stroke-width="20"/>
    <path d="M-196 40 C -250 -40, -150 -104, -46 -86 C 60 -68, 122 -6, 78 44"
          stroke="#EFF2F5" stroke-width="13"/>
    <path d="M-46 -86 C 60 -68, 122 -6, 78 44"
          stroke="#FFFFFF" stroke-width="4"/>
    <!-- the near loop, crossing it twice -->
    <path d="M78 44 C 10 78, -90 54, -110 -6 C -128 -60, -40 -78, 10 -40"
          stroke="#1A1E24" stroke-width="20"/>
    <path d="M78 44 C 10 78, -90 54, -110 -6 C -128 -60, -40 -78, 10 -40"
          stroke="#F4F6F8" stroke-width="13"/>
    <path d="M78 44 C 10 78, -90 54, -110 -6"
          stroke="#FFFFFF" stroke-opacity=".8" stroke-width="4"/>
    <!-- the tail that runs out of the tangle to the second plug -->
    <path d="M10 -40 C 56 -14, 118 -30, 152 -72"
          stroke="#1A1E24" stroke-width="20"/>
    <path d="M10 -40 C 56 -14, 118 -30, 152 -72"
          stroke="#EFF2F5" stroke-width="13"/>
  </g>
  <!-- end one: a USB-A plug, which is a shape people know -->
  <g transform="rotate(-38 -206 44)">
    <rect x="-246" y="28" width="58" height="34" rx="4" fill="#F2F5F8"/>
    <rect x="-246" y="28" width="58" height="11" rx="4" fill="#FFFFFF"/>
    <rect x="-292" y="33" width="50" height="24" rx="2.5" fill="#C6D0D8"/>
    <rect x="-292" y="33" width="50" height="7" rx="2.5" fill="#F4F8FA"/>
    <rect x="-286" y="42" width="36" height="9" rx="1.5" fill="#2E3840"/>
    <rect x="-190" y="36" width="10" height="18" rx="3" fill="#A6B0BA" opacity=".8"/>
  </g>
  <!-- end two: the device connector -->
  <g transform="rotate(-26 162 -78)">
    <rect x="148" y="-96" width="46" height="32" rx="9" fill="#F2F5F8"/>
    <rect x="148" y="-96" width="46" height="10" rx="5" fill="#FFFFFF"/>
    <rect x="188" y="-89" width="17" height="18" rx="3" fill="#AAB4C0"/>
    <rect x="190" y="-85" width="11" height="10" rx="1.5" fill="#6E7A86"/>
  </g>
</g>
"""


TAIL = r"""
<!-- ══════════ 8. THE AIR ══════════
     The beams themselves, and the dust turning over in them. Dust is the
     only reason a beam of light is visible at all — without something in
     the air to scatter off, sunlight through a window is invisible until
     it lands. -->
<g class="beams" style="mix-blend-mode:screen" pointer-events="none">
  <path d="M1240 60 L1330 250 L640 620 L470 560 Z" fill="url(#beamG)"/>
  <path d="M1240 300 L1310 470 L700 790 L560 730 Z" fill="url(#beamG)"/>
</g>
<g pointer-events="none">
%%MOTES%%
</g>

<!-- ══════════ 9. FOREGROUND ══════════
     The near edge of the table, too close to the lens to be in focus, and
     kept to the corners so it never covers anything clickable. -->
<g filter="url(#fgSoft)" pointer-events="none">
  <path d="M-40 906 v-60 q110 6 180 54 Z" fill="#8E7444" opacity=".3"/>
  <path d="M1240 906 v-80 q-124 12 -176 80 Z" fill="#7E6438" opacity=".34"/>
</g>

<!-- ══════════ 10. GRADE ══════════ -->
<g pointer-events="none">
  <rect width="1200" height="900" fill="#FFD9A0" opacity=".035" style="mix-blend-mode:overlay"/>
  <radialGradient id="vig" cx=".76" cy=".26" r=".9">
    <stop offset=".46" stop-color="#12242A" stop-opacity="0"/>
    <stop offset="1"   stop-color="#0E2027" stop-opacity=".38"/>
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
  on(document.getElementById('lit-s2'), () => pulse('waking', 2700));
  on(document.getElementById('waterjug'), () => pulse('sloshing', 1600));
  on(document.getElementById('bell'),   () => pulse('ringing', 1300));
  on(document.getElementById('plane'),  () => {
    scene.classList.remove('launched'); void scene.getBoundingClientRect();
    scene.classList.add('launched');
    clearTimeout(window._pl);
    window._pl = setTimeout(() => scene.classList.remove('launched'), 4200);
  });
</script>
</body>
</html>
"""


def motes(seed=3, n=46):
    rng = random.Random(seed)
    out = []
    for _ in range(n):
        t = rng.random()
        x = 1250 - t * 640 + rng.gauss(0, 60)
        y = 120 + t * 620 + rng.gauss(0, 80)
        r = rng.uniform(1.1, 3.1)
        out.append(f'<circle class="mote" cx="{f(x)}" cy="{f(y)}" r="{f(r,2)}" fill="#FFF6DC" '
                   f'style="animation-duration:{f(rng.uniform(9,21),1)}s;'
                   f'animation-delay:-{f(rng.uniform(0,20),1)}s"/>')
    return "\n".join(out)


def grain_and_scuff():
    grain, scuff = [], []
    rng = random.Random(11)
    for i in range(86):
        x = -300 + i * 20
        grain.append(f"M{f(x)} {f(TN_Y)}L{f(depth_x(x, TN_Y, TF_Y))} {f(TF_Y)}")
    for _ in range(26):
        y = rng.uniform(TF_Y + 10, TN_Y - 6)
        x = rng.uniform(-20, 1220)
        L = rng.uniform(18, 90) * (y - HORIZON) / 772
        scuff.append(f"M{f(x)} {f(y)}L{f(x+L)} {f(y+rng.uniform(-4,4))}")
    return "".join(grain), "".join(scuff)


def build():
    table = (f"M{f(TN_L)} {f(TN_Y)}L{f(TN_R)} {f(TN_Y)}"
             f"L{f(TF_R)} {f(TF_Y)}L{f(TF_L)} {f(TF_Y)}Z")
    grain, scuff = grain_and_scuff()
    html = HEAD + BODY + BODY2 + props() + litter() + TAIL
    html = html.replace('<defs>\n', '<defs>\n  <clipPath id="tableClip">'
                        f'<path d="{table}"/></clipPath>\n', 1)
    html = html.replace("%%TILES%%", floor_tiles())
    # chairs, placed off the horizon like everything else
    for tok, (cx, cy) in {"CH1": (306, 592), "CH2": (596, 586), "CH3": (872, 578),
                          "CH4": (146, 556), "CH5": (712, 530), "CH6": (1124, 498)}.items():
        html = html.replace("%%" + tok + "%%", place_floor(cx, cy))
    for tok, kw in {"CHAIR1": dict(col="blue", lean=-3), "CHAIR2": dict(col="red", lean=2),
                    "CHAIR3": dict(col="blue", lean=-4),
                    "CHAIR4": dict(col="grey", lean=3), "CHAIR5": dict(col="teal", lean=-2)}.items():
        html = html.replace("%%" + tok + "%%", chair(**kw))
    for i in range(1, 5):
        html = html.replace(f"%%STACK{i}%%", chair(col=["blue", "red", "blue", "teal"][i - 1],
                                                   legs=(i == 1), lean=-11))
    html = html.replace("%%TABLE%%", table)
    html = html.replace("%%GRAIN%%", grain).replace("%%SCUFF%%", scuff)
    html = html.replace("%%TFL%%", f(TF_L)).replace("%%TFR%%", f(TF_R)).replace("%%TFY%%", f(TF_Y))
    # the light: two windows' worth, on the table and continuing on the floor
    tl = [patch((1290, 706), (1290, 800), (-700, TN_Y), (980, TN_Y)),
          patch((1290, 830), (1290, 906), (-700, TN_Y), (980, TN_Y))]
    fl = [patch((1290, 452), (1290, 498), (-5200, TN_Y), (-560, TN_Y)),
          patch((1290, 520), (1290, 578), (-5200, TN_Y), (-560, TN_Y))]
    tb, fb = [], []
    for x in (-540, -180, 190, 540, 860):
        tb.append(patch((1290, 706), (1290, 800), (x, TN_Y), (x + 26, TN_Y)))
        tb.append(patch((1290, 830), (1290, 906), (x, TN_Y), (x + 26, TN_Y)))
    for x in (-4400, -3300, -2400, -1700, -1100):
        fb.append(patch((1290, 452), (1290, 498), (x, TN_Y), (x + 90, TN_Y)))
        fb.append(patch((1290, 520), (1290, 578), (x, TN_Y), (x + 90, TN_Y)))
    html = html.replace("%%TABLELIGHT%%", " ".join(tl))
    html = html.replace("%%TABLEBARS%%", " ".join(tb))
    html = html.replace("%%FLOORLIGHT%%", " ".join(fl))
    html = html.replace("%%FLOORBARS%%", " ".join(fb))
    html = html.replace("%%MOTES%%", motes())
    return html


if __name__ == "__main__":
    import pathlib
    out = pathlib.Path(__file__).with_name("index.html")
    out.write_text(build())
    print(f"wrote {out}  {out.stat().st_size/1024:.0f} KB")
