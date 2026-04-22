#!/usr/bin/env bash
# Re-download source assets from the Wayback Machine snapshot.
# Idempotent — will overwrite existing files.
set -euo pipefail

WB="https://web.archive.org/web/20250108060438id_/https://janny.biz"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p "$ROOT/assets/img" "$ROOT/assets/video"

echo "Fetching images..."
curl -fsSL -o "$ROOT/assets/img/logo.jpg"           "$WB/wp-content/uploads/2024/11/cropped-JannyNewLOGO-1.jpg"
curl -fsSL -o "$ROOT/assets/img/og-image.jpg"       "$WB/wp-content/uploads/2024/11/JannyNewLOGOShirt-1024x1024.jpg"
curl -fsSL -o "$ROOT/assets/img/janny-portrait.jpg" "$WB/wp-content/uploads/2024/06/photo_2024-06-24_13-50-02.jpg"
curl -fsSL -o "$ROOT/assets/img/characters.jpg"     "$WB/wp-content/uploads/2024/05/photo_2024-05-24_20-52-02-300x99.jpg"
curl -fsSL -o "$ROOT/assets/img/characters.gif"     "$WB/wp-content/uploads/2024/05/WhatsApp-Video-2024-05-15-at-09.gif"

echo "Fetching videos..."
curl -fsSL -o "$ROOT/assets/video/hero.mp4"             "$WB/wp-content/uploads/2024/06/Janny.mp4"
curl -fsSL -o "$ROOT/assets/video/janny-hotpockets.mp4" "$WB/wp-content/uploads/2024/05/WhatsApp-Video-2024-05-13-at-19.49.20.mp4"

echo "Done."
