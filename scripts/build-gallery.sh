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
  # portable: avoid `shopt -s nullglob`
  for f in "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.png "$DIR"/*.gif "$DIR"/*.webp; do
    [ -e "$f" ] || continue
    name="$(basename "$f")"
    [ "$name" = "manifest.json" ] && continue
    if [ $first -eq 1 ]; then first=0; else printf ','; fi
    printf '"%s"' "$name"
  done
  printf ']\n'
} > "$OUT"

echo "Wrote $OUT"
cat "$OUT"
