#!/usr/bin/env python3
"""Resize originals/*.jpg → large/ + thumbs/ for every roll under public/photos.

Usage:
    pip install -r requirements.txt
    python scripts/resize_photos.py
    python scripts/resize_photos.py --roll 2026-04-30-sydney-city
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps

LARGE_LONG_EDGE = 1600   # px on the longest side, used by the on-page Viewer
THUMB_LONG_EDGE = 600    # px on the longest side, used by the thumbnail strip

JPEG_QUALITY = 88


def resize_one(src: Path, dst: Path, long_edge: int) -> None:
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)  # respect camera orientation
    w, h = img.size
    scale = long_edge / max(w, h)
    if scale < 1:
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    img.convert("RGB").save(dst, "JPEG", quality=JPEG_QUALITY, optimize=True)


def process_roll(roll_dir: Path) -> None:
    originals = roll_dir / "originals"
    if not originals.is_dir():
        return
    large = roll_dir / "large"
    thumbs = roll_dir / "thumbs"
    large.mkdir(exist_ok=True)
    thumbs.mkdir(exist_ok=True)

    print(f"\n[{roll_dir.name}]")
    for src in sorted(originals.glob("*.jpg")):
        print(f"  → {src.name}")
        resize_one(src, large / src.name, LARGE_LONG_EDGE)
        resize_one(src, thumbs / src.name, THUMB_LONG_EDGE)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--roll", help="Process a single roll dir name only")
    args = parser.parse_args()

    photos_root = Path(__file__).resolve().parents[1] / "public" / "photos"
    if not photos_root.is_dir():
        raise SystemExit(f"photos root not found: {photos_root}")

    if args.roll:
        process_roll(photos_root / args.roll)
    else:
        for roll_dir in sorted(photos_root.iterdir()):
            if roll_dir.is_dir():
                process_roll(roll_dir)


if __name__ == "__main__":
    main()
