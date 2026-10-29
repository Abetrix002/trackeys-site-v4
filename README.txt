Trackeys website — visual overhaul V4 (29 Oct 2026)
V3 (original copy + structure, new visuals) plus the product's own UI language, taken from the
Trackeys dashboard at pav.trackeys.com: Outfit, #465FFF, TailAdmin grays, navy #161950 grid,
status pills, and animated product windows (dashboard, route plans, orders, shops, assign districts).
All data in the product windows is sample data; no client records are used.
Maps: real OpenStreetMap streets (Riyadh, Jeddah districts) rendered by src3/map/render.py
(python3 -I src3/map/render.py, then node src3/build.mjs). Map data © OpenStreetMap contributors (ODbL).

Build:  node src3/build.mjs   (writes web3/, fails if any original copy is missing)
Source: src3/ui.mjs = product UI kit; src3/build.mjs = pages; web3/assets/site.css|js = styles/motion
Design notes: web3/notes.html

Deploy (Vercel, noindex): deploy/make-dist.sh <dir> builds a static copy (wraps the index fragment into a full page,
adds deploy/vercel.json), then run `npx vercel@latest deploy --prod --yes` inside that git-free copy.
