#!/bin/sh
# Build a deployable copy of web3/ for Vercel in $1 (default: dist/).
# web3/index.html is a head-less fragment (the Claude artifact host wraps it), so it is wrapped into a full document here.
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
OUT=${1:-"$ROOT/dist"}
rm -rf "$OUT" && mkdir -p "$OUT"
rsync -a --exclude '.DS_Store' --exclude '_preview*' "$ROOT/web3/" "$OUT/"
cp "$ROOT/deploy/vercel.json" "$OUT/vercel.json"
F="$ROOT/web3/index.html"
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="robots" content="noindex, nofollow">\n'
  awk '/<a class="skip"/{exit} {print}' "$F"
  printf '</head>\n<body>\n'
  awk 'f{print} /<a class="skip"/{f=1; print}' "$F"
  printf '</body>\n</html>\n'
} > "$OUT/index.html"
grep -q '<a class="skip"' "$OUT/index.html" && echo "dist ready: $OUT"
