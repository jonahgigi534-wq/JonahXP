#!/usr/bin/env python3
"""Cut a portrait out of a plain background for the animated user tile.

The login avatar is layered: a sky gradient, drifting clouds, then the
person on top. That needs the person on a transparent background. This
script removes a plain backdrop -- a wall in a photo, or flat sky in an
illustration -- by growing a region inward from the top, left and right
edges through pixels that match the edge colours. The bottom edge is never
seeded, because shoulders run off it.

    python scripts/make_avatar.py portrait.jpg
    python scripts/make_avatar.py portrait.png --tol 38 --scale 0.9

Writes assets/avatar-figure.png (256x256, transparent).
"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

WORK = 512        # processing size; plenty for a 70px tile
OUT = 256


def border_palette(a, floor, step=8):
    """Colours along the top edge and the sides above row `floor`.

    The sides below `floor` are clothing; sampling them would teach the
    script that the shirt is background."""
    h, w, _ = a.shape
    samples = np.concatenate([
        a[0:3, ::step].reshape(-1, 3),
        a[:floor:step, 0:3].reshape(-1, 3),
        a[:floor:step, w - 3:w].reshape(-1, 3),
    ])
    return samples.astype(np.float32)


def background_candidates(a, palette, tol):
    """Pixels that could be backdrop: close to an edge colour, or bright and
    nearly grey. The second rule catches patches of wall lit brighter than
    anything on the image border -- common beside a face."""
    px = a.reshape(-1, 1, 3).astype(np.float32)
    best = np.full(px.shape[0], np.inf, dtype=np.float32)
    # Chunk the palette to keep memory flat.
    for i in range(0, len(palette), 64):
        d = np.sqrt(((px - palette[None, i:i + 64]) ** 2).sum(-1)).min(1)
        best = np.minimum(best, d)
    near_edge = (best < tol).reshape(a.shape[:2])

    f = a.astype(np.float32)
    hi, lo = f.max(-1), f.min(-1)
    sat = (hi - lo) / np.maximum(hi, 1)
    bright_grey = (hi > 185) & (sat < 0.2)
    return near_edge | bright_grey


def grow_from_edges(cand, floor):
    """Flood fill through candidate pixels, seeded from the top edge and from
    the side edges above row `floor`.

    Below `floor` the sides are clothing, which often has stripes or
    highlights the colour of the wall; seeding there would eat into it. The
    fill can still reach down beside the neck from above."""
    region = np.zeros_like(cand)
    region[0, :] = cand[0, :]
    region[:floor, 0] = cand[:floor, 0]
    region[:floor, -1] = cand[:floor, -1]
    while True:
        grown = region.copy()
        grown[1:, :] |= region[:-1, :]
        grown[:-1, :] |= region[1:, :]
        grown[:, 1:] |= region[:, :-1]
        grown[:, :-1] |= region[:, 1:]
        grown &= cand
        if np.array_equal(grown, region):
            return region
        region = grown


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", default="assets/avatar-figure.png")
    ap.add_argument("--tol", type=float, default=34,
                    help="colour distance still counted as background")
    ap.add_argument("--scale", type=float, default=0.92,
                    help="figure size within the tile; <1 leaves sky above")
    ap.add_argument("--floor", type=float, default=0.74,
                    help="fraction of height below which the side edges are not seeded")
    args = ap.parse_args()

    im = Image.open(args.src).convert("RGB")
    side = min(im.size)
    left = (im.width - side) // 2
    top = (im.height - side) // 2
    im = im.crop((left, top, left + side, top + side)).resize((WORK, WORK), Image.LANCZOS)

    a = np.asarray(im)
    floor = round(WORK * args.floor)
    bg = grow_from_edges(background_candidates(a, border_palette(a, floor), args.tol),
                         floor=floor)

    # Close pinholes inside the figure, then soften the edge by a pixel so
    # it sits on the sky without a hard cut-out halo.
    alpha = Image.fromarray(((~bg) * 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))

    fig = im.convert("RGBA")
    fig.putalpha(alpha)

    # Shrink into a transparent tile, anchored to the bottom edge, so there
    # is sky above the head for the clouds to cross -- as in the original.
    size = round(OUT * args.scale)
    fig = fig.resize((size, size), Image.LANCZOS)
    tile = Image.new("RGBA", (OUT, OUT), (0, 0, 0, 0))
    tile.paste(fig, ((OUT - size) // 2, OUT - size), fig)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    tile.save(out, optimize=True)
    kept = float((~bg).mean())
    print(f"{out}  {out.stat().st_size // 1024} KB  figure covers {kept:.0%} of source")


if __name__ == "__main__":
    main()
