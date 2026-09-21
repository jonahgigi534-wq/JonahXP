#!/usr/bin/env python3
"""Generate the desktop wallpaper: a Bliss-style hillside with the owner's
name carved into the grass.

Detail is spent where the eye actually reads it. The far field is procedural
texture (individual blades would be sub-pixel there), while the middle and
foreground are tens of thousands of real blades. Blades are quantised into
shared colour/width groups so the file stays a few hundred KB rather than
several MB.

Everything is seeded, so re-running produces identical output.

    python scripts/make_wallpaper.py            # writes assets/wallpaper.svg
    python scripts/make_wallpaper.py --name ZOE
"""

import argparse
import math
import random
from collections import defaultdict
from pathlib import Path

W, H = 1600, 1000
SEED = 20260920

# Horizon sits high so the hill fills most of the frame, as in Bliss.
HORIZON = 300

# Baseline the carved lettering sits on.
TEXT_BASE = 585


# ---------------------------------------------------------------- hill shape
def hill_y(x):
    """Height of the main hill crest at a given x, in user units.

    Bliss is a broad shoulder, not a cone: a wide crest left of centre that
    falls away in a long tail to the right.
    """
    t = x / W
    crest = 250 * math.exp(-((t - 0.30) ** 2) / 0.20)
    tail = 70 * math.exp(-((t - 0.02) ** 2) / 0.35)
    roll = 16 * math.sin(t * 2.4 + 0.9)
    return HORIZON + 165 - crest - tail - roll


def hill_path():
    pts = [f"M0,{hill_y(0):.0f}"]
    for x in range(20, W + 20, 20):
        pts.append(f"L{x},{hill_y(x):.0f}")
    pts.append(f"L{W},{H} L0,{H} Z")
    return " ".join(pts)


def far_hill_path():
    """A softer, hazier ridge on the right for depth."""
    pts = []
    for i, x in enumerate(range(0, W + 25, 25)):
        t = x / W
        y = HORIZON + 130 - 150 * math.exp(-((t - 0.88) ** 2) / 0.05) \
                          - 60 * math.exp(-((t - 0.62) ** 2) / 0.03)
        pts.append(f"{'M' if i == 0 else 'L'}{x},{y:.0f}")
    pts.append(f"L{W},{H} L0,{H} Z")
    return " ".join(pts)


# ---------------------------------------------------------------- grass tone
GRASS_LIT = (156, 214, 88)
GRASS_MID = (96, 176, 50)
GRASS_DEEP = (38, 106, 26)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def blade_colour(depth, rng):
    """depth 0 = far/top of hill, 1 = foreground bottom. Quantised to keep
    the number of distinct groups small."""
    if depth < 0.55:
        base = lerp(GRASS_LIT, GRASS_MID, depth / 0.55)
    else:
        base = lerp(GRASS_MID, GRASS_DEEP, (depth - 0.55) / 0.45)
    jitter = rng.choice((-0.14, -0.07, 0.0, 0.07, 0.15))
    base = tuple(max(0, min(255, round(c * (1 + jitter)))) for c in base)
    # Snap to a 12-level cube so blades share fills.
    base = tuple((c // 12) * 12 for c in base)
    return "#%02x%02x%02x" % base


def turf(rng, y_from, y_to, count, h_range, w_range, lean_range):
    """A band of blades, returned grouped by (colour, stroke width).

    Blades are strokes rather than filled outlines: half the path data for
    the same silhouette once stroke-linecap rounds the tip.
    """
    groups = defaultdict(list)
    for _ in range(count):
        x = rng.uniform(-30, W + 30)
        y = rng.uniform(y_from, y_to)
        # Skip anything above the hill silhouette.
        if y < hill_y(max(0, min(W, x))) - 4:
            continue
        depth = max(0.0, min(1.0, (y - HORIZON) / (H - HORIZON)))
        scale = 0.4 + depth * 1.8
        h = rng.uniform(*h_range) * scale
        lean = rng.uniform(*lean_range) * scale
        w = max(1, round(rng.uniform(*w_range) * scale))

        cx = x + lean * 0.3
        cy = y - h * 0.62
        d = f"M{x:.0f},{y:.0f}Q{cx:.0f},{cy:.0f} {x + lean:.0f},{y - h:.0f}"
        groups[(blade_colour(depth, rng), w)].append(d)
    return groups


def emit(groups, opacity):
    out = []
    for (colour, width), paths in sorted(groups.items()):
        bodies = "".join(f'<path d="{d}"/>' for d in paths)
        out.append(
            f'<g stroke="{colour}" stroke-width="{width}" fill="none" '
            f'stroke-linecap="round" opacity="{opacity}">{bodies}</g>'
        )
    return "".join(out)


# ---------------------------------------------------------------- clouds
def clouds(rng):
    out = []
    for cx, cy, scale, op in [
        (250, 120, 1.0, .85), (430, 78, .68, .6), (760, 150, 1.25, .7),
        (1020, 96, .85, .55), (1290, 140, 1.1, .75), (1480, 90, .7, .5),
        (120, 205, .8, .4), (900, 215, .7, .35), (1180, 240, .6, .3),
    ]:
        puffs = []
        n = rng.randint(5, 8)
        for i in range(n):
            px = cx + (i - n / 2) * 42 * scale + rng.uniform(-14, 14)
            py = cy + rng.uniform(-10, 12) * scale
            rx = rng.uniform(40, 82) * scale
            ry = rng.uniform(13, 24) * scale
            puffs.append(f'<ellipse cx="{px:.0f}" cy="{py:.0f}" '
                         f'rx="{rx:.0f}" ry="{ry:.0f}"/>')
        out.append(f'<g fill="#ffffff" opacity="{op:.2f}">{"".join(puffs)}</g>')
    return out


# ---------------------------------------------------------------- document
DEFS = '''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1c5fc9"/>
  <stop offset="28%" stop-color="#2f7ede"/>
  <stop offset="58%" stop-color="#63a6ea"/>
  <stop offset="82%" stop-color="#a8d0f2"/>
  <stop offset="100%" stop-color="#d8ebf9"/>
</linearGradient>
<linearGradient id="hillFill" x1="0.15" y1="0" x2="0.7" y2="1">
  <stop offset="0" stop-color="#a2d95d"/>
  <stop offset="30%" stop-color="#72bf3a"/>
  <stop offset="65%" stop-color="#3f9a22"/>
  <stop offset="100%" stop-color="#22680f"/>
</linearGradient>
<linearGradient id="farFill" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#8fc95a"/>
  <stop offset="100%" stop-color="#4f9c2c"/>
</linearGradient>
<radialGradient id="sunGlow" cx="28%" cy="18%" r="62%">
  <stop offset="0" stop-color="#ffffff" stop-opacity=".38"/>
  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
</radialGradient>
<linearGradient id="carve" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1b5010"/>
  <stop offset="55%" stop-color="#2c7019"/>
  <stop offset="100%" stop-color="#14400d"/>
</linearGradient>
<radialGradient id="vig" cx="50%" cy="46%" r="76%">
  <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
  <stop offset="100%" stop-color="#062a04" stop-opacity=".3"/>
</radialGradient>
<filter id="soft" x="-30%" y="-60%" width="160%" height="260%">
  <feGaussianBlur stdDeviation="9"/>
</filter>
<filter id="haze" x="-10%" y="-30%" width="120%" height="180%">
  <feGaussianBlur stdDeviation="3.5"/>
</filter>
<!-- Inner shadow: makes the lettering read as cut into the turf. -->
<filter id="cut" x="-20%" y="-40%" width="140%" height="200%">
  <feOffset dx="0" dy="7" in="SourceAlpha" result="off"/>
  <feGaussianBlur stdDeviation="6" in="off" result="bl"/>
  <feComposite operator="out" in="bl" in2="SourceAlpha" result="ring"/>
  <feFlood flood-color="#0b2e08" flood-opacity=".85" result="fl"/>
  <feComposite operator="in" in="fl" in2="ring" result="shade"/>
  <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shade"/></feMerge>
</filter>
<!-- Far-field turf: turbulence stands in for blades too small to draw. -->
<filter id="fineGrass">
  <feTurbulence type="fractalNoise" baseFrequency="0.05 0.3" numOctaves="5" seed="11"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope=".26"/></feComponentTransfer>
</filter>
<filter id="mottle">
  <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="4" seed="3"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope=".2"/></feComponentTransfer>
</filter>
</defs>'''


def build(name):
    rng = random.Random(SEED)
    p = []
    p.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'width="{W}" height="{H}" preserveAspectRatio="xMidYMid slice">'
    )
    p.append(DEFS)

    # --- sky --------------------------------------------------------------
    p.append(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
    p.append(f'<g filter="url(#soft)">{"".join(clouds(rng))}</g>')
    p.append(f'<rect width="{W}" height="{H}" fill="url(#sunGlow)"/>')

    # --- distant ridge ----------------------------------------------------
    p.append(f'<path d="{far_hill_path()}" fill="url(#farFill)" '
             f'opacity=".9" filter="url(#haze)"/>')

    # --- main hill --------------------------------------------------------
    hp = hill_path()
    p.append(f'<path d="{hp}" fill="url(#hillFill)"/>')
    # Two noise passes: broad patchiness, then vertical blade-like streaking.
    p.append(f'<g clip-path="url(#hillClip)"></g>')
    p.append(f'<clipPath id="hillClip"><path d="{hp}"/></clipPath>')
    p.append(f'<g clip-path="url(#hillClip)">'
             f'<rect width="{W}" height="{H}" fill="#1d5c12" opacity=".55" '
             f'filter="url(#mottle)"/>'
             f'<rect width="{W}" height="{H}" fill="#2e7a1a" opacity=".5" '
             f'filter="url(#fineGrass)"/></g>')
    # Light wraps over the crest.
    p.append(f'<path d="{hp}" fill="none" stroke="#cdee98" stroke-width="3" '
             f'opacity=".55" filter="url(#haze)"/>')

    # --- mid-field turf, laid down before the lettering -------------------
    # Bands overlap generously so no horizontal seam shows where one ends.
    p.append(emit(turf(rng, HORIZON - 20, TEXT_BASE + 60, 17000,
                       h_range=(7, 18), w_range=(.6, 1.3),
                       lean_range=(-4, 4)), opacity=".85"))

    # --- carved name ------------------------------------------------------
    font = 'Tahoma, Verdana, DejaVu Sans, sans-serif'
    tf = f'translate({W // 2},{TEXT_BASE}) skewY(-7) scale(1,0.84)'
    p.append(
        f'<g transform="{tf}" filter="url(#cut)"><text x="0" y="0" '
        f'text-anchor="middle" fill="url(#carve)" font-family="{font}" '
        f'font-weight="700" font-size="260" letter-spacing="-6">{name}</text></g>'
    )
    # Lit turf catching on the lower lip of each letter.
    p.append(
        f'<g transform="{tf}" opacity=".3"><text x="0" y="10" '
        f'text-anchor="middle" fill="none" stroke="#a9de7c" stroke-width="2.5" '
        f'font-family="{font}" font-weight="700" font-size="260" '
        f'letter-spacing="-6">{name}</text></g>'
    )

    # --- turf growing over the lettering ---------------------------------
    # Drawn last so blades break the letter edges and the name sits *in* the
    # grass rather than on top of it.
    p.append(emit(turf(rng, TEXT_BASE - 150, 900, 15000,
                       h_range=(9, 24), w_range=(.8, 1.7),
                       lean_range=(-7, 7)), opacity=".9"))

    # --- foreground blades ------------------------------------------------
    p.append(emit(turf(rng, 780, H + 70, 15000,
                       h_range=(26, 78), w_range=(1.1, 2.6),
                       lean_range=(-15, 15)), opacity="1"))

    p.append(f'<rect width="{W}" height="{H}" fill="url(#vig)"/>')
    p.append('</svg>')
    return "".join(p)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", default="JONAH")
    ap.add_argument("--out", default="assets/wallpaper.svg")
    args = ap.parse_args()

    svg = build(args.name)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(svg, encoding="utf-8")
    print(f"{out}  {len(svg) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
