// Simple, friendly illustrations. Two-tone, theme-aware via CSS variables. No dense data.
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const P = (d) => `<path d="${d}"/>`;
export const ICONS = {
  route: P('M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z') + P('M8 17h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8'),
  pin: P('M12 21s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11z') + '<circle cx="12" cy="10" r="2.5"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/>' + P('M11 18.5h2'),
  shelf: P('M4 4v16M20 4v16M4 9h16M4 15h16') + P('M7 6.5v1M10 6.5v1M14 12v1M17 12v1M8 17.5v1'),
  box: P('M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z') + P('M3 7.5 12 12l9-4.5M12 12v9'),
  dash: '<rect x="3" y="4" width="18" height="16" rx="2.5"/>' + P('M7 16v-4M11 16V9M15 16v-6M19 16v-2'),
  ai: P('M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z') + P('M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z'),
  users: '<circle cx="9" cy="8" r="3.5"/>' + P('M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 7M21 20c0-2.6-1.6-4.8-4-5.6'),
  truck: P('M3 6h11v10H3zM14 9h4l3 3v4h-7') + '<circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  warehouse: P('M3 10 12 4l9 6v10H3z') + P('M7 20v-6h10v6M7 17h10'),
  chart: P('M4 20V4M4 20h16M7 15l4-4 3 3 5-6'),
  clock: '<circle cx="12" cy="12" r="8.5"/>' + P('M12 7.5V12l3 2'),
  check: P('M5 12.5l4.2 4.2L19 7'),
  plug: P('M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5'),
  shield: P('M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z') + P('M8.5 12l2.5 2.5L16 9.5'),
  headset: P('M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z'),
  eye: P('M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z') + '<circle cx="12" cy="12" r="3"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.8"/>',
  temp: P('M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z'),
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/>' + P('M3.5 10h17M8 3v4M16 3v4'),
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  layers: P('M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5'),
  sparkle: P('M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6'),
  play: P('M8 5.5v13l11-6.5z'),
  sun: '<circle cx="12" cy="12" r="4"/>' + P('M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4'),
  moon: P('M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z'),
  menu: P('M4 7h16M4 12h16M4 17h16'),
  file: P('M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6'),
  flag: P('M5 21V4M5 4h11l-2 4 2 4H5'),
  bolt: P('M13 2 4 14h7l-1 8 9-12h-7z')
};
export const icon = (k, cls = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${ICONS[k] || ICONS.sparkle}</svg>`;

export function thumb(kind) {
  const W = (inner) => `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;
  switch (kind) {
    case 'grid': return W([...Array(3)].map((_, r) => [...Array(8)].map((_, c) => `<rect class="t-cell${(r * 8 + c) % 7 === 3 ? ' r' : ''}" x="${24 + c * 35}" y="${30 + r * 50}" width="28" height="40" rx="6"/>`).join('')).join(''));
    case 'shelves': return W(`<path d="M20 90h280M20 160h280" class="t-line"/>${[...Array(8)].map((_, i) => `<rect class="${[1, 4].includes(i) ? 't-cell r' : 't-cell b'}" x="${30 + i * 34}" y="48" width="26" height="40" rx="5"/><rect class="${[2, 6].includes(i) ? 't-cell b' : 't-cell'}" x="${30 + i * 34}" y="118" width="26" height="40" rx="5"/>`).join('')}`);
    case 'forecast': return W(`<path class="t-ar" d="M180 80 L 300 40 L 300 110 Z"/><path class="t-ln" d="M20 150 L 60 130 L 100 140 L 140 100 L 180 80"/><path class="t-ln" style="stroke-dasharray:6 8" d="M180 80 L 300 70"/><path d="M180 20v170" class="t-line" style="stroke-dasharray:4 6"/>`);
    case 'quote': return W(`<rect class="t-s" x="60" y="40" width="200" height="120" rx="20"/><text x="96" y="122" style="font:700 96px/1 Georgia,serif;fill:var(--brand)">“</text><path d="M150 82h80M150 104h60M150 126h70" class="t-line" style="stroke-width:7;stroke-linecap:round"/>`);
    case 'phone': return W(`<rect class="t-s" x="120" y="20" width="80" height="170" rx="18" style="stroke:var(--brand);stroke-width:3"/>${[0, 1, 2, 3].map(i => `<rect class="t-bs" x="132" y="${46 + i * 30}" width="56" height="20" rx="6"/>`).join('')}<path class="t-ln" style="stroke:var(--warn)" d="M60 150 q 20 -40 40 -20"/>`);
    case 'network': return W(`${[[60, 50], [60, 150], [260, 40], [270, 100], [255, 160]].map(([x, y]) => `<path d="M160 100 L ${x} ${y}" class="t-line" style="stroke:var(--brand);opacity:.5;stroke-width:3"/><circle class="t-s" cx="${x}" cy="${y}" r="14" style="stroke:var(--brand);stroke-width:3"/>`).join('')}<circle class="t-b" cx="160" cy="100" r="26"/>`);
    case 'bars': return W(`${[60, 100, 80, 130, 110, 150, 120].map((h, i) => `<rect class="${i === 5 ? 't-g' : 't-b'}" x="${30 + i * 38}" y="${180 - h}" width="24" height="${h}" rx="6" opacity="${.5 + i * .07}"/>`).join('')}`);
    case 'chart2': return W(`<path class="t-ar" d="M20 180 L 90 140 L 160 120 L 230 70 L 300 30 L 300 200 L 20 200Z"/><path class="t-ln" d="M20 180 L 90 140 L 160 120 L 230 70 L 300 30"/>${[[90, 140], [160, 120], [230, 70]].map(([x, y], i) => `<circle class="t-s" cx="${x}" cy="${y}" r="11" style="stroke:var(--brand);stroke-width:3"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="font:700 11px/1 var(--mono);fill:var(--brand)">${i + 2}</text>`).join('')}`);
    default: return W(`<path class="t-ar" d="M20 170 L 80 130 L 130 145 L 190 95 L 240 110 L 300 50 L 300 200 L 20 200Z"/><path class="t-ln" d="M20 170 L 80 130 L 130 145 L 190 95 L 240 110 L 300 50"/><circle class="t-b" cx="300" cy="50" r="7"/>`);
  }
}
