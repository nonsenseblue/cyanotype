#!/usr/bin/env python3
"""Generate public/og-image.jpg — the social-share image (1200x630)."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
# Deep cyanotype blue background, paper-white type — the original
# cyanotype process produces deep cyan-blue prints, so this reads as
# the brand more clearly than paper-on-ink does.
PAPER = (10, 28, 56)        # deep cyanotype blue (canvas)
INK = (250, 248, 243)        # paper-white wordmark
INK_SOFT = (210, 218, 230)   # softer paper for the tagline
INK_FAINT = (140, 158, 188)  # faint paper for the separator
BLUE = (240, 235, 215)       # warm paper for the ornaments
PAPER_BORDER = (250, 248, 243)  # paper-white border bands at top/bottom
BORDER_H = 14

FONT_BRAND = "/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf"
FONT_INTRO = "/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf"


def text_centered(draw, text, font, y, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2 - bbox[0], y), text, font=font, fill=fill)


def hand_wave(draw, cx, cy, width, color, stroke=2):
    """Draw a soft wavy line centered on (cx, cy)."""
    pts = []
    samples = 80
    for i in range(samples + 1):
        t = i / samples
        x = cx - width / 2 + width * t
        y = cy + math.sin(t * math.pi * 3) * 4
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=color, width=stroke)


def hand_star(draw, cx, cy, r, color, stroke=2):
    """Approximate a hand-drawn 5-point star (closed irregular curve)."""
    # 10 control points alternating outer / inner
    pts = []
    for i in range(10):
        angle = -math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.45
        pts.append((cx + math.cos(angle) * rad, cy + math.sin(angle) * rad))
    pts.append(pts[0])
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=color, width=stroke)


def hand_moon(draw, cx, cy, r, color, stroke=2):
    """Crescent moon outline using two arcs."""
    bbox_outer = (cx - r, cy - r, cx + r, cy + r)
    bbox_inner = (cx - r + r * 0.45, cy - r * 0.95,
                  cx + r + r * 0.45, cy + r * 0.95)
    # outer left arc
    draw.arc(bbox_outer, start=40, end=320, fill=color, width=stroke)
    # inner right arc (subtract)
    draw.arc(bbox_inner, start=130, end=230, fill=color, width=stroke)


def hand_camera(parent_img, cx, cy, w, h, color, stroke=2, angle=0):
    """Camera drawn on a transparent layer, optionally rotated, then pasted."""
    pad = 24
    layer_w = int(w + pad * 2)
    layer_h = int(h * 1.7 + pad * 2)
    layer = Image.new("RGBA", (layer_w, layer_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    lcx = layer_w / 2
    lcy = layer_h / 2 + h * 0.12  # body center, leaving room for viewfinder

    bx0, by0 = lcx - w / 2, lcy - h / 2
    bx1, by1 = lcx + w / 2, lcy + h / 2

    # viewfinder hump on the top edge
    vf_w = w * 0.3
    vf_h = h * 0.22
    vfx0, vfy0 = lcx - vf_w / 2, by0 - vf_h
    vfx1 = lcx + vf_w / 2

    d.line([(bx0, by0), (vfx0, by0)], fill=color, width=stroke)
    d.line([(vfx1, by0), (bx1, by0)], fill=color, width=stroke)
    d.line([(vfx0, by0), (vfx0, vfy0)], fill=color, width=stroke)
    d.line([(vfx0, vfy0), (vfx1, vfy0)], fill=color, width=stroke)
    d.line([(vfx1, vfy0), (vfx1, by0)], fill=color, width=stroke)

    d.line([(bx0, by0), (bx0, by1)], fill=color, width=stroke)
    d.line([(bx1, by0), (bx1, by1)], fill=color, width=stroke)
    d.line([(bx0, by1), (bx1, by1)], fill=color, width=stroke)

    lens_r = h * 0.32
    d.ellipse(
        (lcx - lens_r, lcy + h * 0.05 - lens_r,
         lcx + lens_r, lcy + h * 0.05 + lens_r),
        outline=color, width=stroke,
    )
    inner_r = lens_r * 0.42
    d.ellipse(
        (lcx - inner_r, lcy + h * 0.05 - inner_r,
         lcx + inner_r, lcy + h * 0.05 + inner_r),
        outline=color, width=max(1, stroke - 1),
    )
    btn_x = bx1 - w * 0.13
    btn_y = by0 + h * 0.22
    d.ellipse((btn_x - 3, btn_y - 3, btn_x + 3, btn_y + 3), fill=color)

    if angle:
        layer = layer.rotate(angle, resample=Image.BICUBIC, expand=False)

    parent_img.paste(
        layer,
        (int(cx - layer_w / 2), int(cy - layer_h / 2)),
        layer,
    )


def main():
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    # ---- corner ornaments ----
    # top-left: small camera (slightly tilted, like a doodle)
    hand_camera(img, W * 0.16, H * 0.22, 60, 42, BLUE, stroke=2, angle=-12)
    hand_star(draw, W * 0.84, H * 0.22, 14, BLUE, stroke=2)
    hand_moon(draw, W * 0.16, H * 0.78, 24, BLUE, stroke=2)
    hand_star(draw, W * 0.86, H * 0.76, 11, BLUE, stroke=2)
    hand_star(draw, W * 0.78, H * 0.86, 7, BLUE, stroke=2)

    # ---- brand: cyanotype ----
    font_brand = ImageFont.truetype(FONT_BRAND, 200)
    text_centered(draw, "cyanotype", font_brand, H * 0.22, INK)

    # ---- hand-drawn wavy separator ----
    sep_y = int(H * 0.58)
    hand_wave(draw, W / 2, sep_y, 110, INK_FAINT, stroke=1)

    # ---- intro line ----
    font_intro = ImageFont.truetype(FONT_INTRO, 38)
    text_centered(
        draw,
        "We live in a handful of moments.",
        font_intro,
        H * 0.65,
        INK_SOFT,
    )

    # ---- paper-white border bands (top & bottom) ----
    draw.rectangle((0, 0, W, BORDER_H), fill=PAPER_BORDER)
    draw.rectangle((0, H - BORDER_H, W, H), fill=PAPER_BORDER)

    out = Path(__file__).resolve().parents[1] / "public" / "og-image.jpg"
    img.save(out, "JPEG", quality=92, optimize=True)
    print(f"saved → {out} ({W}x{H})")


if __name__ == "__main__":
    main()
