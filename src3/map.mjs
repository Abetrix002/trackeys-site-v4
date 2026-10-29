// Real street maps (OpenStreetMap, rendered by map/render.py): themed base image + inline overlay (labels, districts).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const MAP = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'map', 'scenes.json'), 'utf8'));
export const mapBase = (pre, k) => {
  const m = MAP[k];
  return `<g class="osm${m.cls ? ' ' + m.cls : ''}"><image class="mlight" href="${pre}assets/map/${k}-light.svg" width="${m.w}" height="${m.h}"/><image class="mdark" href="${pre}assets/map/${k}-dark.svg" width="${m.w}" height="${m.h}"/>${m.over}</g>`;
};
// map data credit (ODbL), pinned to a visible corner of the map container
export const mattr = (k) => `<span class="mattr ${MAP[k].attr}" aria-hidden="true">© OpenStreetMap</span>`;
