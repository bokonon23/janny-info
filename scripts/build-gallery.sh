#!/usr/bin/env bash
# Generate assets/img/gallery/manifest.json from the files in that folder.
# Run this whenever you add/remove meme images.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/assets/img/gallery"
OUT="$DIR/manifest.json"

mkdir -p "$DIR"

{
  printf '['
  first=1
  # natural-sort filenames so meme-2 < meme-10 < meme-100
  ls "$DIR" | grep -iE '\.(jpe?g|png|gif|webp)$' | grep -v '^manifest\.json$' | sort -V | while IFS= read -r name; do
    if [ $first -eq 1 ]; then first=0; else printf ','; fi
    printf '"%s"' "$name"
  done
  printf ']\n'
} > "$OUT"

echo "Wrote $OUT"
cat "$OUT"
