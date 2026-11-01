// Trackeys visual overhaul. Copy and section order come from the live site (src3/content.json); only the presentation is new.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, icon, thumb } from './art.mjs';
import { MAP, mapBase, mattr } from './map.mjs';
import notes from './notes.mjs';
import { screen } from './ui.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../web3');
const C = JSON.parse(fs.readFileSync(path.join(HERE, 'content.json'), 'utf8'));
const note = (s) => s ? ` data-note="${esc(s)}"` : '';
const arrow = '<span class="arrow" aria-hidden="true">→</span>';
const DEAD = 'No destination on the live site';
const NOACT = 'No action on the live site';

/* links: original paths → prototype files */
const L = (href, pre) => {
  if (!href || href === '#') return '#';
  const m = { '/': 'index.html', '/pricing': 'pricing.html', '/book-a-demo': 'book-a-demo.html', '/resources': 'resources.html', '/blog': 'blog.html', '/case-studies': 'case-studies.html', '/privacy-policy': 'privacy-policy.html', '/signin': 'signin.html' }[href];
  return pre + (m || href.replace(/^\//, '') + '.html');
};
const NAV = {
  Product: [['Sales Force Automation', '/product/sales-force-automation', 'phone'], ['Delivery & Routing', '/product/delivery-routing', 'route'], ['Merchandising AI', '/product/merchandising-ai', 'shelf'], ['Distribution', '/product/distribution', 'layers']],
  Solutions: [['FMCG', '/solutions/fmcg', 'box'], ['Logistics & Supply Chain', '/solutions/logistics', 'warehouse'], ['Fleet Management', '/solutions/fleet', 'truck'], ['Distribution', '/solutions/distribution', 'layers']],
  Resources: [['All resources', '/resources', 'file'], ['Blog', '/blog', 'file'], ['Case studies', '/case-studies', 'chart']]
};

/* ---------- shell ---------- */
function shell(rel, { title, desc, active, body, main = false, bare = false }) {
  const depth = rel.split('/').length - 1, pre = '../'.repeat(depth);
  const libs = ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js', 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js'];
  const head = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="icon" href="${pre}assets/favicon.png">
<script>(function(){try{var t=localStorage.getItem('tk-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300..800&display=swap">
<link rel="stylesheet" href="${pre}assets/site.css">`;
  const scripts = libs.map(s => `<script src="${s}" defer></script>`).join('\n') + `\n<script src="${pre}assets/site.js" defer></script>`;
  const content = bare ? `${body}\n<div class="veil" aria-hidden="true"></div>\n${scripts}` : `<a class="skip" href="#main">Skip to content</a>
<div class="proto"><div class="wrap"><span>Prototype V4 · visual overhaul of trackeys.com, now in the product's own UI language · copy and page structure kept from the live site</span><span style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><a href="${pre}notes.html">Design notes</a><button type="button" id="review-toggle" aria-pressed="false">Show review notes</button></span></div></div>
${header(pre, active)}
<main id="main">
${body}
</main>
${footer(pre)}
<div class="veil" aria-hidden="true"></div>
<div id="live" class="sr-only" aria-live="polite"></div>
${scripts}`;
  if (main) return `${head}\n<script>document.documentElement.lang='en';</script>\n${content}\n`;
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${content}\n</body>\n</html>\n`;
}

function header(pre, active) {
  const menu = (k) => `<div class="nav-item"><button type="button" class="nav-trigger${NAV[k].some(i => i[1] === active) ? ' is-current' : ''}" aria-expanded="false" aria-controls="m-${k}">${k}<svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></button><div class="menu" id="m-${k}">${NAV[k].map(([t, h, ic]) => `<a href="${L(h, pre)}"${h === active ? ' aria-current="page"' : ''}><span class="ic">${icon(ic)}</span>${esc(t)}</a>`).join('')}</div></div>`;
  return `<header class="site-header"><div class="wrap">
<a class="brand" href="${pre}index.html"><img src="${pre}assets/mark.png" alt="" width="30" height="30">Trackeys</a>
<nav class="nav" aria-label="Main">${menu('Product')}${menu('Solutions')}${menu('Resources')}</nav>
<div class="utility"><a class="signin" href="${pre}signin.html">${esc(C.common.signin)}</a>
<button type="button" class="theme-toggle" aria-label="Switch between light and dark theme" aria-pressed="false">${icon('sun', 'i-sun')}${icon('moon', 'i-moon')}</button>
<a class="btn btn-primary btn-sm" href="${pre}book-a-demo.html">${esc(C.common.demo)} ${arrow}</a>
<button type="button" class="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Menu">${icon('menu', 'i-menu')}<svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
</div></header>
<div class="mobile-nav" id="mobile-nav">${Object.keys(NAV).map(k => `<h4>${k}</h4>${NAV[k].map(([t, h]) => `<a href="${L(h, pre)}">${esc(t)}${arrow}</a>`).join('')}`).join('')}<h4>Account</h4><a href="${pre}signin.html">${esc(C.common.signin)}${arrow}</a><a class="btn btn-primary" href="${pre}book-a-demo.html">${esc(C.common.demo)}</a></div>`;
}

function footer(pre) {
  const col = (h, items) => `<div class="f-col"><h4>${h}</h4><ul>${items.map(([t, href]) => `<li><a href="${L(href, pre)}"${href === '#' ? note(DEAD) : ''}>${esc(t)}</a></li>`).join('')}</ul></div>`;
  return `<footer class="site-footer"><div class="wrap">
<div class="f-top"><div><a class="brand" href="${pre}index.html"><img src="${pre}assets/mark.png" alt="" width="30" height="30">Trackeys</a><p class="f-desc">${esc(C.footer.desc)}</p></div>
${col('Product', [['Sales Force Automation', '/product/sales-force-automation'], ['Delivery & Routing', '/product/delivery-routing'], ['Merchandising AI', '/product/merchandising-ai'], ['Distribution', '/product/distribution'], ['Fleet Management', '#'], ['Integrations', '#']])}
${col('Solutions', [['FMCG', '/solutions/fmcg'], ['Logistics', '/solutions/logistics'], ['Distribution', '/solutions/distribution'], ['Fleet', '/solutions/fleet']])}
${col('Resources', [['All resources', '/resources'], ['Blog', '/blog'], ['Case studies', '/case-studies'], ['Book a demo', '/book-a-demo'], ['Documentation', '#'], ['Security', '#']])}</div>
<div class="f-bot"><span>${esc(C.footer.legal)}</span><nav aria-label="Legal"><a href="${pre}privacy-policy.html"${note('Live site links Privacy to #; the prototype links the existing policy page')}>Privacy</a><a href="#"${note(DEAD)}>Terms</a><a href="#"${note(DEAD)}>Security</a><a href="#"${note(DEAD)}>Cookies</a></nav></div>
</div></footer>`;
}

/* ---------- shared blocks ---------- */
const sh = (eyebrow, h2, sub, cls = '', id = '') => `<div class="sec-head ${cls}" data-r>${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}<h2 class="h2"${id ? ` id="${id}"` : ''}>${esc(h2)}</h2>${sub ? `<p class="lede">${esc(sub)}</p>` : ''}</div>`;
const ctaBand = (pre, h2, p = C.common.ctaP) => `<section class="band tight"><div class="wrap"><div class="ctaband" data-r data-cta><img src="${pre}assets/img/riyadh-dusk.jpg" alt="" loading="lazy">
<div class="sq" aria-hidden="true">${'<i></i>'.repeat(8)}</div>
<div class="inner"><h2 class="h2">${esc(h2)}</h2><p class="lede">${esc(p)}</p><div class="hero-ctas" style="justify-content:center"><a class="btn btn-primary" href="${pre}book-a-demo.html">${esc(C.common.demo)} ${arrow}</a></div></div></div></div></section>`;
const faqBlock = (eyebrow, h2, items) => `<section class="band"><div class="wrap two"><div>${sh(eyebrow, h2)}</div><div class="acc" data-r>${items.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q || f[0])}</summary><p class="a">${esc(f.a || f[1])}</p></details>`).join('')}</div></div></section>`;
const pinG = (x, y, cls = '') => `<g class="pin ${cls}" transform="translate(${x} ${y})"><circle class="halo" r="16"/><path d="M0 -28c-9 0-15 7-15 14 0 10 15 22 15 22s15-12 15-22c0-7-6-14-15-14z"/><circle cx="0" cy="-14" r="5"/></g>`;
const vanG = (id) => `<g id="${id}" class="van"><circle class="veh" r="10"/></g>`;

/* ---------- scenes ---------- */
function homeScene() {
  const h = C.home.copilot;
  const M = MAP.home, [sx, sy] = M.routes.hmain.stops[0];
  return `<div class="herostage"${note('Map: real Riyadh streets (Al Olaya, King Fahd Rd) from OpenStreetMap; the copilot copy names Dubai places')}><div class="scene" data-scene="home"><svg class="art" viewBox="0 0 560 510" aria-hidden="true">${mapBase('', 'home')}
<path id="h-route" class="route" data-b="${M.pts.hb_f}" d="${M.routes.hmain.d}"/><path id="h-alt" class="route alt" d="${M.routes.halt.d}" opacity="0"/>
<rect x="${sx - 15}" y="${sy - 12}" width="30" height="24" rx="7" style="fill:var(--surface);stroke:var(--line-2)"/>${pinG(...M.pts.hp1)}${pinG(...M.pts.hflag, 'warn flag')}${pinG(...M.routes.hmain.stops[1], 'ok')}${vanG('h-van')}</svg>${mattr('home')}</div>
<div class="copilot"><div class="co-head"><span class="co-ic">${icon('sparkle')}</span><div><b>${esc(h.title)}</b><small><span class="dots3"><i></i><i></i><i></i></span>${esc(h.status)}</small></div></div>
${h.rows.map(([t, a, b], i) => `<div class="co-row"><span class="tag ${['', 'warn', 'ok'][i]}">${esc(t)}</span><b>${esc(a)}</b><small>${esc(b)}</small></div>`).join('')}
<div class="co-stats">${h.stats.map(([k, v]) => `<div><span>${esc(k)}</span><b data-count>${esc(v)}</b></div>`).join('')}</div></div></div>`;
}
function liveScene() {
  const L2 = C.home.live;
  return `<div class="livemap" data-r${note('Copy from the live site names Dubai (lat/lng, DXB, Al Barsha); the map is real Riyadh streets. Align one to the other before launch')}><div class="scene" data-scene="live"><svg class="art" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${mapBase('', 'live')}
<path id="lr1" class="route" d="${MAP.live.routes.l1.d}"/><path id="lr2" class="route" style="stroke:#14b8a6" d="${MAP.live.routes.l2.d}"/><path id="lr3" class="route" style="stroke:#8b5cf6" d="${MAP.live.routes.l3.d}"/>
${pinG(...MAP.live.pts.p1)}${pinG(...MAP.live.pts.p2, 'ok')}${pinG(...MAP.live.pts.p3)}${pinG(...MAP.live.pts.p4, 'warn')}
<circle id="ld1" r="9" fill="#465fff" stroke="#fff" stroke-width="3"/><circle id="ld2" r="9" fill="#14b8a6" stroke="#fff" stroke-width="3"/><circle id="ld3" r="9" fill="#8b5cf6" stroke="#fff" stroke-width="3"/></svg>${mattr('live')}
<div class="maplabel"><span class="pill"><i></i>${esc(L2.map[0])}</span><div class="small mono" style="margin:8px 0 0 4px">${esc(L2.map[1])}</div></div>
<div class="kpis">${L2.kpis.map(([k, v, d]) => `<div class="kpi"><span>${esc(k)}</span><b data-count>${esc(v)}</b>${d ? `<em>${esc(d)}</em>` : ''}</div>`).join('')}</div></div></div>`;
}
function rolePanels() {
  const R = C.home.live.roles;
  const pill = (s) => `<span class="tag ${{ DELIVERED: 'ok', 'EN ROUTE': '', QUEUED: 'n', RISK: 'bad', HIGH: '', MED: 'warn', LOW: 'n' }[s] ?? 'n'}">${esc(s)}</span>`;
  const panels = {
    Operations: (a) => `<h3 class="h3">${esc(a[0])}</h3><p class="sub">${esc(a[1])}</p>${[2, 4, 6, 8].map(i => `<div class="rrow"><span class="nm">${esc(a[i])}</span><b data-count>${esc(a[i + 1])}</b></div>`).join('')}<div class="rolecard" style="padding:14px 0 0;gap:6px"><span class="lbl">${esc(a[10])}</span><svg class="spark" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><path class="ar" d="M0 64 L25 58 L50 60 L75 48 L100 52 L125 40 L150 44 L175 30 L200 34 L225 22 L250 26 L275 14 L300 18 L300 80 L0 80Z"/><path class="ln" pathLength="1" style="stroke-dasharray:1" d="M0 64 L25 58 L50 60 L75 48 L100 52 L125 40 L150 44 L175 30 L200 34 L225 22 L250 26 L275 14 L300 18"/></svg></div>`,
    Dispatch: (a) => `<h3 class="h3">${esc(a[0])}</h3><p class="sub">${esc(a[1])}</p>${[2, 5, 8, 11, 14].map(i => `<div class="rrow"><span class="t">${esc(a[i])}</span><span class="nm">${esc(a[i + 1])}</span>${pill(a[i + 2])}</div>`).join('')}`,
    Driver: (a) => `<h3 class="h3">${esc(a[0])}</h3><p class="sub">${esc(a[1])}</p><div class="drv"><span class="tag" style="justify-self:start">${esc(a[2])}</span><span class="big">${esc(a[3])}</span><span class="small">${esc(a[4])}</span><div class="acts"><span>${esc(a[5])}</span><span>${esc(a[6])}</span></div></div><span class="lbl" style="font:600 .7rem/1 var(--mono);letter-spacing:.12em;color:var(--ink-3)">${esc(a[7])}</span>${a.slice(8).map(s => `<div class="rrow"><span class="nm">${esc(s)}</span></div>`).join('')}`,
    Sales: (a) => `<h3 class="h3">${esc(a[0])}</h3><p class="sub">${esc(a[1])}</p>${[2, 5, 8, 11].map(i => `<div class="rrow"><span class="nm"><b style="display:block">${esc(a[i])}</b><span class="small">${esc(a[i + 1])}</span></span>${pill(a[i + 2])}</div>`).join('')}`,
    Merchandiser: (a) => `<h3 class="h3">${esc(a[0])}</h3><p class="sub">${esc(a[1])}</p><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="48"/><circle class="fg" cx="60" cy="60" r="48" pathLength="100" style="stroke-dasharray:87.5 100" data-ring="87.5"/><text x="60" y="60">${esc(a[5])}</text></svg><div style="display:grid;gap:8px;flex:1;min-width:160px"><span class="lbl" style="font:600 .7rem/1 var(--mono);letter-spacing:.12em;color:var(--ink-3);text-transform:uppercase">${esc(a[4])}</span><div class="rrow"><span class="nm">${esc(a[2])}</span>${icon('check')}</div><div class="rrow"><span class="nm">${esc(a[3])}</span><span class="tag warn">!</span></div></div></div>`
  };
  const keys = Object.keys(R);
  return `<div class="card rolecard" data-r data-tabs><span class="lbl">${esc(C.home.live.roleLabel)}</span>
<div class="seg" role="tablist" aria-label="${esc(C.home.live.roleLabel)}"><span class="ind" aria-hidden="true"></span>${keys.map((k, i) => `<button type="button" role="tab" id="rt-${i}" aria-controls="rp-${i}" aria-selected="${i === 0}">${esc(k)}</button>`).join('')}</div>
<div class="rpanels">${keys.map((k, i) => `<div class="rpanel" role="tabpanel" id="rp-${i}" aria-labelledby="rt-${i}"${i ? ' hidden' : ''}>${panels[k](R[k])}</div>`).join('')}</div></div>`;
}
function routeScene(v, pre) {
  const M = MAP.route.routes.r, stops = M.stops.map(p => p.map(Number));
  const names = [0, 2, 4, 6, 8, 10].map(i => [v[i], v[i + 1]]);
  const labelPos = [[20, 30], [-20, -26], [16, 34], [22, 6], [-26, -24], [-30, -28]];
  return `<div class="scene" data-scene="route"><svg class="art" viewBox="0 0 560 500" aria-hidden="true">${mapBase(pre, 'route')}
${M.segs.map((d, i) => `<path id="rs-${i}" class="route ghost" d="${d}"/>`).join('')}
${M.segs.map((d, i) => `<path id="rd-${i}" class="route" d="${d}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/>`).join('')}
${stops.map(([x, y], i) => `<g class="stop" data-i="${i}" transform="translate(${x} ${y})"><circle r="13" style="fill:var(--surface);stroke:var(--brand);stroke-width:3"/><path class="sck" d="M-5 0l3.5 3.5L6-4" style="fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;opacity:0"/><text x="${labelPos[i][0]}" y="${labelPos[i][1]}" text-anchor="${labelPos[i][0] < 0 ? 'end' : 'start'}" style="font:650 14px/1 var(--font);fill:var(--ink)">${esc(names[i][0])}<tspan x="${labelPos[i][0]}" dy="16" style="font:500 12px/1 var(--mono);fill:var(--ink-3)">${esc(names[i][1])}</tspan></text></g>`).join('')}
${vanG('r-van')}</svg>${mattr('route')}
<div class="float" style="left:18px;top:18px"><span class="chipf"><span class="dot"></span>${esc(v[12])} <small>${esc(v[13])}</small></span></div>
<div class="float saved" style="right:18px;bottom:18px"><span class="chipf">${icon('bolt')}${esc(v[14])} <small>${esc(v[15])}</small></span></div></div>`;
}
function phoneScene(v, pre) {
  const visits = [2, 4, 6, 8].map(i => [v[i], v[i + 1]]);
  const deals = [11, 14, 17].map(i => [v[i], v[i + 1], v[i + 2]]);
  return `<div class="scene sc-phone" data-scene="phone"><svg class="art" viewBox="0 0 560 500" aria-hidden="true">${mapBase(pre, 'phone')}</svg>${mattr('phone')}
<div class="ph"><div class="ph-top mono">${esc(v[0])}</div><b class="ph-h">${esc(v[1])}</b>${visits.map(([n, a], i) => `<div class="ph-row"><span class="ck${i < 2 ? ' on' : ''}">${icon('check')}</span><span>${esc(n)}</span><b>${esc(a)}</b></div>`).join('')}</div>
<div class="pipe"><span class="lbl">${esc(v[10])}</span>${deals.map(([n, a, s], i) => `<div class="deal"><div class="top"><b>${esc(n)}</b><span class="mono">${esc(a)}</span></div><span class="small">${esc(s)}</span><span class="bar"><i style="--w:${[70, 75, 80][i]}%"></i></span></div>`).join('')}</div>
<div class="toast">${icon('sparkle')}<span>${esc(v[20])}</span></div></div>`;
}
function shelfScene(v) {
  const colors = ['#465fff', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#465fff', '#14b8a6'];
  const oos = new Set(['0-2', '1-5', '2-1', '2-4']);
  return `<div class="scene sc-shelf" data-scene="shelf"><div class="sh-head"><span class="pill"><i></i>${esc(v[0])}</span><span class="small mono">${esc(v[1])} · ${esc(v[2])}</span></div>
<svg class="art shelfart" viewBox="0 0 560 360" aria-hidden="true"><rect x="40" y="20" width="480" height="320" rx="18" style="fill:var(--surface);stroke:var(--line-2);stroke-width:2"/>${[0, 1, 2].map(r => `<path d="M40 ${120 + r * 100}h480" style="stroke:var(--line-2);stroke-width:3"/>${[...Array(7)].map((_, c) => oos.has(r + '-' + c) ? `<g class="oos"><rect x="${62 + c * 64}" y="${40 + r * 100}" width="46" height="74" rx="8" style="fill:var(--bad-soft);stroke:var(--bad);stroke-width:2;stroke-dasharray:5 5"/><text x="${85 + c * 64}" y="${82 + r * 100}" text-anchor="middle" style="font:700 11px/1 var(--mono);fill:var(--bad)">${esc(v[3])}</text></g>` : `<rect class="prod" x="${62 + c * 64}" y="${48 + r * 100}" width="46" height="66" rx="10" style="fill:${colors[(c + r * 3) % 7]};opacity:.85"/><rect x="${70 + c * 64}" y="${58 + r * 100}" width="30" height="12" rx="4" style="fill:#fff;opacity:.55"/>`).join('')}`).join('')}
<rect class="beam" x="40" y="20" width="10" height="320" rx="5" style="fill:var(--brand);opacity:.55"/></svg>
<div class="sh-side"><div class="card" style="padding:16px;display:flex;gap:14px;align-items:center"><svg class="ring" viewBox="0 0 120 120" style="width:84px;height:84px" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="48"/><circle class="fg" cx="60" cy="60" r="48" pathLength="100" style="stroke-dasharray:87.5 100" data-ring="87.5"/><text x="60" y="60">${esc(v[8])}</text></svg><span class="lbl">${esc(v[7])}</span></div>
<div class="card" style="padding:14px 16px"><span class="lbl">${esc(v[9])}</span><b class="sv">${esc(v[10])}</b></div><div class="card" style="padding:14px 16px"><span class="lbl">${esc(v[11])}</span><b class="sv" style="color:var(--bad)">${esc(v[12])}</b></div></div></div>`;
}
function networkScene(v, pre) {
  const L2 = [[90, 130, v[2]], [90, 300, v[3]]], R = [[470, 74, v[4]], [482, 162, v[5]], [482, 250, v[6]], [470, 338, v[7]]];
  const hub = [280, 215];
  const curve = ([x, y]) => `M ${x} ${y} C ${(x + hub[0]) / 2} ${y} ${(x + hub[0]) / 2} ${hub[1]} ${hub[0]} ${hub[1]}`;
  const curveOut = ([x, y]) => `M ${hub[0]} ${hub[1]} C ${(x + hub[0]) / 2} ${hub[1]} ${(x + hub[0]) / 2} ${y} ${x} ${y}`;
  const node = ([x, y, t], cls) => `<g class="nnode" transform="translate(${x} ${y})"><rect x="-46" y="-20" width="92" height="40" rx="14" style="fill:var(--surface);stroke:${cls};stroke-width:2.5"/><text text-anchor="middle" dominant-baseline="central" style="font:650 13px/1 var(--font);fill:var(--ink)">${esc(t)}</text></g>`;
  return `<div class="scene" data-scene="network"><svg class="art" viewBox="0 0 560 500" aria-hidden="true">${mapBase(pre, 'network')}
${L2.map((p, i) => `<path id="nl-${i}" d="${curve(p)}" style="fill:none;stroke:var(--brand);stroke-width:3;opacity:.45"/>`).join('')}${R.map((p, i) => `<path id="nr-${i}" d="${curveOut(p)}" style="fill:none;stroke:#14b8a6;stroke-width:3;opacity:.45"/>`).join('')}
${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<circle class="pt" data-p="${i}" r="5" fill="${i < 4 ? '#465fff' : '#14b8a6'}"/>`).join('')}
${L2.map(p => node(p, 'var(--brand)')).join('')}${R.map(p => node(p, '#14b8a6')).join('')}
<g transform="translate(${hub[0]} ${hub[1]})"><circle class="hubpulse" r="62" style="fill:var(--brand-soft)"/><circle r="50" style="fill:var(--brand-2)"/><text text-anchor="middle" dominant-baseline="central" style="font:700 13px/1 var(--font);fill:#fff">${esc(v[1])}</text></g></svg>${mattr('network')}
<div class="float" style="left:18px;top:18px"><span class="pill"><i></i>${esc(v[0])}</span></div>
<div class="float nstats">${[[v[8], v[9]], [v[10], v[11]], [v[12], v[13]]].map(([k, val]) => `<div class="kpi"><span>${esc(k)}</span><b data-count>${esc(val)}</b></div>`).join('')}</div></div>`;
}
/* integration logos (brand marks from Wikimedia Commons, Simple Icons and the vendors' own sites) */
const TOOL = { 'SAP S/4HANA': 'sap.svg', 'SAP TM': 'sap.svg', 'SAP PM': 'sap.svg', 'Microsoft D365': 'microsoft-dynamics.svg', 'Oracle NetSuite': 'oracle.svg', 'Oracle TMS': 'oracle.svg', 'Oracle Fusion': 'oracle.svg', 'Oracle EAM': 'oracle.svg', Salesforce: 'salesforce.svg', Odoo: 'odoo.svg', Tally: 'tally.png', Stripe: 'stripe.svg', Twilio: 'twilio.svg', Samsara: 'samsara.svg', Geotab: 'geotab.svg', 'HERE Maps': 'here.svg', 'Google Maps': 'google-maps.svg', Nielsen: 'nielsen.svg', 'IRI Circana': 'circana.svg', Snowflake: 'snowflake.svg', Databricks: 'databricks.svg', 'Power BI': 'power-bi.svg', Tableau: 'tableau.png', Looker: 'looker.svg', 'AWS S3': 'aws.svg', Manhattan: 'manhattan.svg', 'Blue Yonder': 'blue-yonder.png', Kinaxis: 'kinaxis.svg', 'EDI X12': 'x12.svg', Motive: 'motive.svg', Fleetio: 'fleetio.svg', WEX: 'wex.png', 'Shell Card': 'shell.svg' };
// equal visual area per logo (wordmarks get shorter, symbols taller); aspect ratios measured on the trimmed files
const TOOL_AR = JSON.parse(fs.readFileSync(path.join(HERE, 'tool-logos.json'), 'utf8'));
const toolLogo = (name, pre) => {
  const f = TOOL[name]; if (!f) throw new Error('no logo for ' + name);
  const ar = TOOL_AR[f]; let h = Math.min(44, Math.max(18, Math.sqrt(2600 / ar))); if (h * ar > 160) h = 160 / ar;
  return `<img src="${pre}assets/logos/tools/${f}" alt="${esc(name)}" width="${Math.round(h * ar)}" height="${Math.round(h)}" loading="lazy" decoding="async">`;
};
// always-scrolling logo strip: the list twice (second copy hidden from assistive tech), pauses on hover, static when motion is reduced
const toolLoop = (items, pre) => {
  const li = items.map(s => `<li class="integ"><span class="lg">${toolLogo(s.name, pre)}</span><small>${esc(s.desc)}</small></li>`).join('');
  return `<div class="logoloop" data-r${note('Integration list from the live site; confirm which connectors exist')}><ul class="integs">${li}</ul><ul class="integs" aria-hidden="true">${li}</ul></div>`;
};
const UI = { 'sales-force-automation': 'orders', 'delivery-routing': 'route', 'merchandising-ai': 'shops', distribution: 'districts', fmcg: 'orders', logistics: 'route', fleet: 'dash' };
const UINOTE = 'Product UI rebuilt from the Trackeys dashboard (pav.trackeys.com); names and figures are sample data';
const shot = (pre, k, cls = '') => `<section class="shotband ${cls}"><div class="wrap"><div class="shot" data-shot${note(UINOTE)}>${screen(pre, k)}</div></div></section>`;
const SCENE = { 'sales-force-automation': phoneScene, 'delivery-routing': routeScene, 'merchandising-ai': shelfScene, distribution: networkScene, fmcg: phoneScene, logistics: routeScene, fleet: routeScene };

/* ---------- pages ---------- */
function home() {
  const h = C.home, pre = '';
  const indImg = ['shelf', 'riyadh-street', 'van-motion', 'depot'];
  const body = `
<section class="hero" aria-labelledby="hero-h"><div class="wrap">
<div class="hero-copy"><span class="pill" data-hero style="justify-self:start"><i></i>${esc(h.badge)}</span>
<h1 class="display" id="hero-h" data-split>${esc(h.h1a)} <span class="blue">${esc(h.h1b)}</span> ${esc(h.h1c)}</h1>
<p class="lede" data-hero>${esc(h.p)}</p>
<div class="hero-ctas" data-hero><a class="btn btn-primary" href="book-a-demo.html">${esc(h.ctas[0])} ${arrow}</a><button type="button" class="btn btn-ghost"${note(NOACT)}>${esc(h.ctas[1])}</button></div></div>
<div data-hero-art>${homeScene()}</div>
</div></section>
${shot(pre, 'dash', 'home')}

<section class="band" style="padding-top:clamp(40px,6vw,80px)" aria-labelledby="live-h"><div class="wrap">
<div class="sec-head" data-r><span class="eyebrow">${esc(h.live.eyebrow)}</span><h2 class="h2" id="live-h">${esc(h.live.h2)}</h2><p class="lede">${esc(h.live.sub)}</p></div>
<div class="live">${liveScene()}${rolePanels()}</div>
</div></section>

<div class="wrap"><div class="trusted" data-r${note('Customer logos from the live site; confirm permission before launch')}><span class="small">${esc(h.trusted.label)}</span><div class="logos">${h.trusted.logos.map(l => `<img src="assets/logos/${l}.svg" alt="${l[0].toUpperCase() + l.slice(1)}" loading="lazy">`).join('')}</div></div>
<div class="stats4" data-r data-stagger${note('Figures from the live site; no source is shown there')}>${h.stats.map(([v, k, d]) => `<div class="stat"><b data-count>${esc(v)}</b><strong>${esc(k)}</strong><span>${esc(d)}</span></div>`).join('')}</div></div>

<section class="band alt" aria-labelledby="cap-h"><div class="wrap">
${sh(h.caps.eyebrow, h.caps.h2, '', '', 'cap-h')}
<div class="grid3 specs" data-r data-stagger>${h.caps.items.map(i => `<article class="cap"><h3>${esc(i.title)}${i.tag ? ` <span class="tag">${esc(i.tag)}</span>` : ''}</h3><p>${esc(i.desc)}</p></article>`).join('')}</div>
</div></section>

<section class="band" aria-labelledby="roles-h"><div class="wrap">
${sh(h.roles.eyebrow, h.roles.h2, '', '', 'roles-h')}
<div class="roles6" data-r data-stagger>${h.roles.items.map((r, i) => `<div class="card role"><div><b>${esc(r.title)}</b><span>${esc(r.desc)}</span></div></div>`).join('')}</div>
</div></section>

<section class="band alt" aria-labelledby="ind-h"><div class="wrap">
${sh(h.industries.eyebrow, h.industries.h2, '', '', 'ind-h')}
<div class="ind4" data-r data-stagger>${h.industries.items.map((it, i) => `<a class="icard" href="${L(it.href, pre)}"><div class="ph" data-parallax><img src="assets/img/${indImg[i]}.jpg" alt="" loading="lazy"></div><div class="in"><h3>${esc(it.title)} ${arrow}</h3><p>${esc(it.desc)}</p><div class="chips">${it.chips.map(c => `<span>${esc(c)}</span>`).join('')}</div></div></a>`).join('')}</div>
</div></section>
${ctaBand(pre, h.cta.h2, h.cta.p)}`;
  return shell('index.html', { title: 'Trackeys Visual Overhaul V4', desc: h.p, active: '/', body, main: true });
}

function productPage(kind, slug) {
  const d = (kind === 'product' ? C.products : C.solutions)[slug], pre = '../', active = `/${kind === 'product' ? 'product' : 'solutions'}/${slug}`;
  const navList = kind === 'product' ? NAV.Product : NAV.Solutions;
  const body = `<nav class="subnav" aria-label="${kind === 'product' ? 'Product' : 'Solutions'}"><div class="wrap">${navList.map(([t, h]) => `<a href="${L(h, pre)}"${h === active ? ' aria-current="page"' : ''}>${esc(t)}</a>`).join('')}</div></nav>
<section class="hero" aria-labelledby="p-h"><div class="wrap">
<div class="hero-copy"><span class="eyebrow" data-hero>${esc(d.eyebrow)}</span><h1 class="h1" id="p-h" data-split>${esc(d.h1)}</h1><p class="lede" data-hero>${esc(d.p)}</p>
<div class="hero-ctas" data-hero><a class="btn btn-primary" href="${pre}book-a-demo.html">${esc(C.common.demo)} ${arrow}</a></div>
<div class="hstats" data-hero${note('Figures from the live site')}>${d.stats.map(([v, k]) => `<div><b data-count>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}</div></div>
<div data-hero-art>${SCENE[slug](d.visual, pre)}</div>
</div></section>
${shot(pre, UI[slug])}

<section class="band alt" aria-labelledby="c-h"><div class="wrap">
${sh(d.caps.eyebrow, d.caps.h2, d.caps.sub, '', 'c-h')}
<div class="grid3 specs" data-r data-stagger>${d.caps.items.map(i => `<article class="cap"><h3>${esc(i.title)}</h3><p>${esc(i.desc)}</p><ul>${i.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul></article>`).join('')}</div>
</div></section>

<section class="band how" aria-labelledby="h-h"><div class="wrap">
${sh(d.how.eyebrow, d.how.h2, d.how.sub, '', 'h-h')}
<ol class="steps" data-r data-stagger>${d.how.steps.map(s => `<li class="step"><span class="n">${esc(s.n)}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></li>`).join('')}</ol>
</div></section>

<section class="band dark" aria-labelledby="o-h"><div class="wrap">
${sh(d.outcomes.eyebrow, d.outcomes.h2, '', '', 'o-h')}
<div class="outs" data-r data-stagger${note('Figures from the live site')}>${d.outcomes.items.map(o => `<div class="card out"><b data-count>${esc(o.v)}</b><strong>${esc(o.k)}</strong><span>${esc(o.d)}</span></div>`).join('')}</div>
</div></section>

<section class="band" id="integrations" aria-labelledby="s-h"><div class="wrap">
${sh(d.stack.eyebrow, d.stack.h2, d.stack.sub, '', 's-h')}</div>
${toolLoop(d.stack.items, pre)}
</section>
${faqBlock(d.faq.eyebrow, d.faq.h2, d.faq.items)}
${ctaBand(pre, d.cta.h2, d.cta.p)}`;
  return shell(`${kind === 'product' ? 'product' : 'solutions'}/${slug}.html`, { title: `${d.eyebrow.charAt(0) + d.eyebrow.slice(1).toLowerCase()} · Trackeys`, desc: d.p, active, body });
}

function pricing() {
  const p = C.pricing, pre = '';
  const cell = (v) => v === 1 ? '<span class="yes" aria-label="Included">✓</span>' : v === 0 ? '<span class="no" role="img" aria-label="Not included"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg></span>' : esc(v);
  const body = `
<section class="hero" aria-labelledby="pr-h"><div class="wrap" style="grid-template-columns:1fr;justify-items:center;text-align:center">
<div class="hero-copy" style="justify-items:center;max-width:860px"><span class="eyebrow" data-hero>${esc(p.eyebrow)}</span><h1 class="display" id="pr-h" data-split style="font-size:clamp(2.6rem,6vw,4.8rem)">${esc(p.h1)}</h1><p class="lede" data-hero style="text-align:center">${esc(p.p)}</p>
<div data-hero style="display:grid;gap:8px;justify-items:center"><span class="small">${esc(p.curLabel)}</span><div class="seg cur" data-currency role="group" aria-label="${esc(p.curLabel)}"><span class="ind" aria-hidden="true"></span>${p.currencies.map((c, i) => `<button type="button" data-cur="${c}" aria-pressed="${i === 0}">${c}</button>`).join('')}</div></div></div>
</div>
<div class="wrap" style="display:block;padding-block:0 clamp(56px,7vw,96px)"><div class="tiers" data-r data-stagger${note('Prices and trial terms from the live site')}>${p.tiers.map(t => `<div class="card tier${t.popular ? ' pop' : ''}"><div class="nm">${esc(t.name)}${t.popular ? `<span class="tag">${esc(t.popular)}</span>` : ''}</div><p class="desc">${esc(t.desc)}</p>
<div class="price">${t.price ? `<span class="amt" data-usd="${t.price}">$${t.price}</span><span class="per">${esc(t.per)}</span>` : `<span class="amt">${esc(t.priceLabel)}</span>`}</div><span class="small">${esc(t.billed)}</span>
<a class="btn ${t.popular ? 'btn-primary' : 'btn-ghost'}" href="book-a-demo.html">${esc(t.cta)}</a><span class="lbl">${esc(t.incLabel)}</span><ul>${t.li.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`).join('')}</div></div></section>

<section class="band alt"><div class="wrap">${sh(p.addons.eyebrow, p.addons.h2, p.addons.sub)}
<div class="addons" data-r data-stagger>${p.addons.items.map((a, i) => `<div class="card addon"><b>${esc(a.name)}</b><p>${esc(a.desc)}</p><div class="price"><span class="amt" data-usd="${a.usd}">$${a.usd < 1 ? a.usd.toFixed(2) : a.usd.toLocaleString('en-US')}</span><span class="per">${esc(a.unit)}</span></div></div>`).join('')}</div></div></section>

<section class="band"><div class="wrap">${sh(p.compare.eyebrow, p.compare.h2, p.compare.sub)}
<div class="cmpwrap" data-r><table class="cmp"><thead><tr>${p.compare.cols.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${p.compare.groups.map(([g, rows]) => `<tr class="grp"><td colspan="4">${esc(g)}</td></tr>${rows.map(r => `<tr><th scope="row" style="font-weight:500;text-align:left">${esc(r[0])}</th>${r.slice(1).map(v => `<td>${cell(v)}</td>`).join('')}</tr>`).join('')}`).join('')}</tbody></table></div></div></section>

<section class="band alt"><div class="wrap">${sh(p.roi.eyebrow, p.roi.h2, p.roi.sub)}
<div class="card roi" data-roi data-r><div class="roi-in">${p.roi.inputs.map(([l, u, mn, mx, st, v], i) => `<div class="slider"><div class="top"><label for="roi-${i}">${esc(l)}</label><output for="roi-${i}" id="roi-o-${i}">${i === 2 ? '$ ' : ''}${v}<small>${esc(u)}</small></output></div><input type="range" id="roi-${i}" min="${mn}" max="${mx}" step="${st}" value="${v}"><div class="rng"><span>${mn}</span><span>${mx}</span></div></div>`).join('')}</div>
<div class="roi-out"><span class="lbl">${esc(p.roi.outputs[0])}</span><span class="big" id="roi-annual">$1,164,300</span><div class="roi-grid">${p.roi.outputs.slice(1).map((o, i) => `<div><span class="lbl">${esc(o)}</span><b id="roi-${['m', 'c', 'p', 'x'][i]}">${['$99,000', '$1,975/mo', '1 month', '50.1×'][i]}</b></div>`).join('')}</div></div></div>
<p class="small" style="margin-top:14px">${esc(p.roi.note)}</p></div></section>

<section class="band"><div class="wrap">${sh(p.impl.eyebrow, p.impl.h2, p.impl.sub)}
<div class="impl" data-impl><span class="line" aria-hidden="true"><i></i></span>${p.impl.steps.map(s => `<div class="card istep" data-r><span class="n">${esc(s.n)}</span><span class="when">${esc(s.when)}</span><h3 class="h3">${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>`).join('')}</div></div></section>
${faqBlock(p.faq.eyebrow, p.faq.h2, p.faq.items)}
${ctaBand(pre, p.cta.h2, p.cta.p)}`;
  return shell('pricing.html', { title: 'Pricing · Trackeys', desc: p.p, active: '/pricing', body });
}

function demo() {
  const d = C.demo, pre = '';
  const f = d.fields;
  const fld = ([id, label, ph], full) => {
    const req = /\*/.test(label);
    const input = id === 'hope' ? `<textarea id="${id}" placeholder="${esc(ph)}"></textarea>` : ['country', 'industry', 'size'].includes(id) ? `<select id="${id}"><option value="">${esc(d.choose)}</option>${(id === 'country' ? d.countries : id === 'industry' ? d.industries : d.sizes).map(o => `<option>${esc(o)}</option>`).join('')}</select>` : `<input id="${id}" type="${id === 'email' ? 'email' : id === 'phone' ? 'tel' : 'text'}" placeholder="${esc(ph)}"${req ? ' required aria-required="true"' : ''} aria-describedby="${id}-err">`;
    return `<div class="field${full ? ' full' : ''}"><label for="${id}">${esc(label)}</label>${input}<span class="err" id="${id}-err"></span></div>`;
  };
  const body = `
<section class="band" style="padding-top:clamp(48px,6vw,88px)"><div class="wrap demo">
<div style="display:grid;gap:28px;align-content:start"><span class="eyebrow" data-hero>${esc(d.eyebrow)}</span><h1 class="h1" data-split>${esc(d.h1)}</h1><p class="lede" data-hero>${esc(d.p)}</p>
<ul class="promises" data-r data-stagger>${d.promises.map(([b, s], i) => `<li><span class="ic">${icon(['clock', 'chart', 'users', 'file'][i])}</span><div><b>${esc(b)}</b><span>${esc(s)}</span></div></li>`).join('')}</ul></div>
<form class="card formcard" id="demo-form" novalidate data-hero>
<div class="progress" aria-hidden="true"><i></i></div>
<div class="step" data-step="1"><span class="small mono">${esc(d.step)}</span><h2 class="h3" style="font-size:1.6rem;margin:6px 0 18px">${esc(d.formH)}</h2>
<div class="fields">${fld(f[0])}${fld(f[1])}${fld(f[2], true)}${fld(f[3])}${fld(f[4])}${fld(f[5])}${fld(f[6])}${fld(f[7], true)}${fld(f[8], true)}</div>
<button class="btn btn-primary" type="submit" style="width:100%;margin-top:20px" disabled>${esc(d.cont)}</button></div>
<div class="step" data-step="2" hidden${note('New copy: the live site’s calendar step is not visible without submitting a real request')}><span class="small mono">Step 2 of 2</span><h2 class="h3" style="font-size:1.6rem;margin:6px 0 18px">Pick a time.</h2>
<div class="cal" id="cal"></div><div class="times" style="margin-top:10px">${['10:00', '11:30', '14:00', '16:00'].map((t, i) => `<div class="pick"><input type="radio" name="time" id="t-${i}" value="${t}"><label for="t-${i}"><b>${t}</b></label></div>`).join('')}</div>
<div style="display:flex;gap:10px;margin-top:20px"><button class="btn btn-ghost" type="button" data-back>Back</button><button class="btn btn-primary" type="submit" style="flex:1">Book demo ${arrow}</button></div></div>
<div class="step done" data-step="3" hidden${note('New copy: confirmation state')}><span class="tick"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" pathLength="30"/></svg></span><h2 class="h3" style="font-size:1.6rem">You're booked.</h2><p class="small" id="when"></p><p class="small">Prototype: nothing was sent.</p></div>
</form></div></section>
<div class="wrap"><div class="stats4" data-r data-stagger${note('Figures from the live site')}>${d.stats.map(([v, k]) => `<div class="stat"><b data-count>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}</div></div>
<section class="band tight alt"><div class="wrap" style="display:grid;gap:22px;justify-items:center"><span class="small mono" style="text-transform:uppercase;letter-spacing:.12em">${esc(d.trusted.label)}</span></div><div class="wrap"><ul class="names" data-r${note('Company names from the live site; unverified')}>${d.trusted.names.map(n => `<li>${esc(n)}</li>`).join('')}</ul></div></section>
<section class="band"><div class="wrap">${sh(d.faq.eyebrow, d.faq.h2)}<div class="qa" data-r data-stagger>${d.faq.items.map(([q, a]) => `<div class="card"><b>${esc(q)}</b><p>${esc(a)}</p></div>`).join('')}</div></div></section>`;
  return shell('book-a-demo.html', { title: 'Book a demo · Trackeys', desc: d.p, active: '/book-a-demo', body });
}

const KIND_BLOG = ['chart', 'grid', 'shelves', 'forecast', 'quote', 'phone', 'network', 'bars', 'chart2'];
const KIND_CASE = ['chart', 'network', 'chart2', 'shelves', 'chart', 'phone'];
const blogCard = (b, pre, i) => `<a class="card lift acard" href="${pre}blog/${b.href}.html" data-cat="${esc(b.cat)}"><div class="thumb bgk">${thumb(KIND_BLOG[i])}</div><div class="body"><span class="tag" style="justify-self:start">${esc(b.cat)}</span><h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p><span class="meta">${esc(b.meta)}</span></div></a>`;
const caseCard = (c, pre, i) => `<a class="card lift acard" href="${pre}case-studies/${c.slug}.html"><div class="thumb bgk">${thumb(KIND_CASE[i])}</div><div class="body"><span class="tag ok" style="justify-self:start">Customer stories</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><span class="meta">${esc(c.meta)}</span></div></a>`;
const pageHero = (eyebrow, h1, p) => `<section class="hero" style="border-bottom:1px solid var(--line)"><div class="wrap" style="grid-template-columns:1fr;padding-block:clamp(56px,8vw,112px)"><div class="hero-copy" style="max-width:860px"><span class="eyebrow" data-hero>${esc(eyebrow)}</span><h1 class="display" data-split style="font-size:clamp(2.6rem,6vw,4.8rem)">${esc(h1)}</h1><p class="lede" data-hero>${esc(p)}</p></div></div></section>`;

function resources() {
  const r = C.resources, b = C.blog.cards, pre = '';
  const f = b[0];
  const body = `${pageHero(r.eyebrow, r.h1, r.p)}
<section class="band"><div class="wrap"><div class="sec-head" data-r><span class="eyebrow">${esc(r.featured)}</span><h2 class="h2">${esc(r.startHere)}</h2></div>
<a class="card featured" href="blog/${f.href}.html" data-r><div class="ph"><img src="assets/img/depot.jpg" alt="" loading="lazy" data-parallax-img></div><div class="body"><span class="tag" style="justify-self:start">${esc(f.cat)}</span><h2>${esc(f.title)}</h2><p class="lede" style="font-size:1.05rem">${esc(f.excerpt)}</p><span class="small mono">${esc(f.meta.replace(/ · (\d+ min read)$/, ' · $1'))}</span></div></a></div></section>
<section class="band alt"><div class="wrap"><div class="headrow"><h2 class="h2">${esc(r.recent)}</h2><a class="link" href="blog.html">${esc(r.viewAll.replace(' →', ''))} ${arrow}</a></div><div class="cards3" data-r data-stagger>${b.slice(1, 4).map((x, i) => blogCard(x, pre, i + 1)).join('')}</div></div></section>
<section class="band"><div class="wrap"><div class="headrow"><h2 class="h2">${esc(r.stories)}</h2><a class="link" href="case-studies.html">${esc(r.allStories.replace(' →', ''))} ${arrow}</a></div><div class="cards3" data-r data-stagger>${C.cases.cards.slice(0, 3).map((c, i) => caseCard(c, pre, i)).join('')}</div></div></section>
${ctaBand(pre, r.cta.h2)}`;
  return shell('resources.html', { title: 'Resources · Trackeys', desc: r.p, active: '/resources', body });
}
function blog() {
  const B = C.blog, pre = '';
  const body = `${pageHero(B.eyebrow, B.h1, B.p)}
<section class="band"><div class="wrap"><div class="seg filters" role="group" aria-label="Filter articles" data-filter><span class="ind" aria-hidden="true"></span>${B.filters.map((f, i) => `<button type="button" aria-pressed="${i === 0}" data-f="${esc(f)}">${esc(f)}</button>`).join('')}</div>
<h2 class="sr-only">Articles</h2><div class="cards3" data-r data-stagger id="posts">${B.cards.map((c, i) => blogCard(c, pre, i)).join('')}</div></div></section>
${ctaBand(pre, B.cta.h2)}`;
  return shell('blog.html', { title: 'Blog · Trackeys', desc: B.p, active: '/blog', body });
}
function post(slug, i) {
  const p = C.posts[slug], pre = '../';
  const others = C.blog.cards.map((c, k) => [c, k]).filter(([c]) => c.href !== slug).slice(0, 3);
  const body = `<div class="readbar" aria-hidden="true"></div>
<section class="band" style="padding-top:clamp(40px,6vw,80px);padding-bottom:0"><div class="wrap"><article class="article">
<a class="back" href="${pre}blog.html" data-hero>${esc(p.back)}</a>
<div style="display:grid;gap:22px;margin-top:28px"><span class="tag" style="justify-self:start" data-hero>${esc(p.cat)}</span><h1 class="h1" data-split style="font-size:clamp(2.2rem,4.6vw,3.6rem)">${esc(p.title)}</h1><p class="lede" data-hero>${esc(p.sub)}</p>
<div class="byline" data-hero${note('Author names from the live site; confirm they are real people')}><span class="avatar">${esc(p.initials)}</span><div><b>${esc(p.author)}</b>${p.role ? `<span>${esc(p.role)}</span>` : ''}</div><span class="date">${esc(p.date)}</span></div></div>
<div class="cover thumb bgk" data-r>${thumb(KIND_BLOG[i])}</div>
<div class="prose" data-r>${p.body.map(([t, x]) => t === 'blockquote' ? `<blockquote>${esc(x)}</blockquote>` : t === 'li' ? `<p>• ${esc(x)}</p>` : `<${t}>${esc(x)}</${t}>`).join('')}</div>
</article></div></section>
<section class="band"><div class="wrap"><div class="headrow"><h2 class="h2">${esc(p.keep)}</h2></div><div class="cards3" data-r data-stagger>${others.map(([c, k]) => blogCard(c, pre, k)).join('')}</div></div></section>
${ctaBand(pre, p.cta.h2)}`;
  return shell(`blog/${slug}.html`, { title: `${p.title} · Trackeys`, desc: p.sub, active: '/blog', body });
}
function cases() {
  const K = C.cases, pre = '';
  const body = `${pageHero(K.eyebrow, K.h1, K.p)}
<section class="band"><div class="wrap"><div class="cards3" data-r data-stagger${note('Customer stories from the live site; unverified')}>${K.cards.map((c, i) => caseCard(c, pre, i)).join('')}</div></div></section>
${ctaBand(pre, K.cta.h2)}`;
  return shell('case-studies.html', { title: 'Case studies · Trackeys', desc: K.p, active: '/case-studies', body });
}
function caseDetail(slug) {
  const d = C.caseDetail[slug], pre = '../';
  const more = C.cases.cards.map((c, k) => [c, k]).filter(([c]) => c.slug !== slug).slice(0, 3);
  const body = `<section class="hero" style="border-bottom:1px solid var(--line)"><div class="wrap" style="grid-template-columns:1fr;padding-block:clamp(40px,6vw,88px)">
<a class="link" href="${pre}case-studies.html" style="color:var(--ink-3)" data-hero>${esc(d.back)}</a>
<div class="case-hero"><div class="hero-copy"><span class="tag ok" style="justify-self:start" data-hero>${esc(d.meta)}</span><h1 class="h1" data-split>${esc(d.title)}</h1><p class="lede" data-hero>${esc(d.p)}</p></div>
<div class="card company" data-hero${note('Customer name and results from the live site; unverified')}><span class="nm">${esc(d.company)}</span>${d.stats.map(([v, k]) => `<div class="st"><b data-count>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}</div></div></div></section>
<section class="band"><div class="wrap"><div class="cso" data-r data-stagger>${d.blocks.map(([t, x], i) => `<div class="card c${i + 1}"><h2>${esc(t)}</h2><p>${esc(x)}</p></div>`).join('')}</div></div></section>
<section class="band alt"><div class="wrap"><figure class="bigquote" data-r${note('Named quote from the live site; confirm sign-off')}><blockquote>“${esc(d.quote)}”</blockquote><figcaption><cite>${esc(d.by)}</cite></figcaption></figure></div></section>
<section class="band"><div class="wrap"><div class="headrow"><h2 class="h2">${esc(d.more)}</h2></div><div class="cards3" data-r data-stagger>${more.map(([c, k]) => caseCard(c, pre, k)).join('')}</div></div></section>
${ctaBand(pre, d.cta.h2)}`;
  return shell(`case-studies/${slug}.html`, { title: `${d.title} · Trackeys`, desc: d.p, active: '/case-studies', body });
}
function privacy() {
  const P2 = C.privacy;
  const heads = P2.body.filter(x => x[0] === 'h2').map(x => x[1]);
  const id = (s) => 's-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const body = `${pageHero('Legal', P2.title, P2.version)}
<section class="band"><div class="wrap doc"><nav aria-label="On this page">${heads.map(h => `<a href="#${id(h)}">${esc(h)}</a>`).join('')}</nav><div class="prose" style="max-width:720px">${P2.body.map(([t, x]) => t === 'h2' ? `<h2 id="${id(x)}">${esc(x)}</h2>` : `<p>${esc(x).replace(/privacy@trackeys\.com/, '<a href="mailto:privacy@trackeys.com">privacy@trackeys.com</a>')}</p>`).join('')}</div></div></section>`;
  return shell('privacy-policy.html', { title: 'Privacy Policy · Trackeys', desc: P2.body[0][1], active: '', body });
}
function signin() {
  const s = C.signin;
  const body = `<div class="signin-page"><div class="left"><form onsubmit="return false" style="gap:20px"><a class="brand" href="index.html"><img src="assets/mark.png" alt="" width="30" height="30">Trackeys</a>
<div><h1 class="h1" style="font-size:2.6rem" data-split>${esc(s.h1)}</h1><p class="lede" style="margin-top:8px" data-hero>${esc(s.p)}</p></div>
<div class="field"><label for="si-email">${esc(s.email)}</label><input id="si-email" type="email" placeholder="${esc(s.emailPh)}" autocomplete="email"></div>
<div class="field"><label for="si-pass">Password</label><input id="si-pass" type="password" placeholder="${esc(s.passPh)}" autocomplete="current-password"></div>
<button class="btn btn-primary" type="submit"${note('Prototype: sign-in is not connected')}>${esc(s.btn)}</button></form></div>
<div class="right"><div class="sq" aria-hidden="true">${Array.from({ length: 8 }, () => '<i></i>').join('')}</div><div style="display:grid;gap:22px;justify-items:center;text-align:center;max-width:360px"><img class="mk" src="assets/mark.png" alt="Trackeys"><p>${esc(s.side)}</p></div></div></div>`;
  return shell('signin.html', { title: 'Sign in · Trackeys', desc: s.side, active: '/signin', body, bare: true });
}

/* ---------- write ---------- */
const out = [];
const write = (rel, html) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); out.push(rel); };
write('index.html', home());
Object.keys(C.products).forEach(s => write(`product/${s}.html`, productPage('product', s)));
Object.keys(C.solutions).forEach(s => write(`solutions/${s}.html`, productPage('solution', s)));
write('pricing.html', pricing()); write('book-a-demo.html', demo()); write('resources.html', resources()); write('blog.html', blog());
C.blog.cards.forEach((c, i) => write(`blog/${c.href}.html`, post(c.href, i)));
write('case-studies.html', cases()); Object.keys(C.caseDetail).forEach(s => write(`case-studies/${s}.html`, caseDetail(s)));
write('privacy-policy.html', privacy()); write('signin.html', signin()); write('notes.html', notes());

// Copy guard: every headline in the content file must appear verbatim in the built pages.
const all = out.map(r => fs.readFileSync(path.join(ROOT, r), 'utf8')).join('\n');
const must = [C.home.p, C.home.live.h2, ...Object.values(C.products).flatMap(d => [d.h1, d.p, d.caps.h2, d.how.h2, d.outcomes.h2, d.stack.h2, d.cta.h2, ...d.faq.items.map(f => f.a)]), ...Object.values(C.solutions).flatMap(d => [d.h1, d.p, ...d.faq.items.map(f => f.a)]), C.pricing.h1, ...C.pricing.faq.items.map(f => f.a), ...Object.values(C.posts).flatMap(p => [p.title, ...p.body.map(b => b[1])]), ...Object.values(C.caseDetail).flatMap(d => [d.title, d.quote, ...d.blocks.map(b => b[1])])];
const missing = must.filter(s => s && !all.includes(esc(s)));
console.log(`built ${out.length} pages · ${missing.length ? missing.length + ' copy strings missing: ' + missing.slice(0, 3).join(' | ') : 'all checked copy present verbatim'}`);
process.exit(missing.length ? 1 : 0);
