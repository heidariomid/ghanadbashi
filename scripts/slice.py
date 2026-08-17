"""Slice a tall full-page screenshot into review-sized strips.

Usage: python3 scripts/slice.py <input.png> <slice-height> <out-prefix>
Blank strips (a single flat colour) are skipped so trailing padding is dropped.
"""

import sys

from PIL import Image


def main() -> None:
    src, height, prefix = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    image = Image.open(src)
    width, total = image.size

    index = 0
    for top in range(0, total, height):
        strip = image.crop((0, top, width, min(top + height, total)))
        if len(strip.convert('RGB').getcolors(maxcolors=8) or []) == 1:
            continue
        index += 1
        out = f'{prefix}-{index}.png'
        strip.save(out)
        print(f'{out} y={top}')


if __name__ == '__main__':
    main()
