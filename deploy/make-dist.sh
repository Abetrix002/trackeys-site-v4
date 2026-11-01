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
# The live site is the clean public version: no prototype bar (design-notes link, review-notes toggle),
# no review-note annotations in the markup, and no internal notes page. The Claude artifact keeps all three.
python3 -I - "$OUT" <<'PY'
import pathlib, re, sys
out = pathlib.Path(sys.argv[1])
(out / 'notes.html').unlink(missing_ok=True)
for f in out.rglob('*.html'):
    s = f.read_text()
    s = re.sub(r'<div class="proto">.*?</div></div>\n?', '', s, count=1, flags=re.S)
    s = re.sub(r' data-note="[^"]*"', '', s)
    f.write_text(s)
PY
grep -q '<a class="skip"' "$OUT/index.html" && echo "dist ready: $OUT"
