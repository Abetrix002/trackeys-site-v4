// Product UI kit: screens rebuilt from the Trackeys dashboard (pav.trackeys.com): its sidebar, metric cards,
// status pills, tables, gauge, order journey and district map. All names and figures are sample data.
import { esc } from './art.mjs';
import { MAP, mapBase, mattr } from './map.mjs';

const P = {
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  truck: '<path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/>',
  wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/><path d="M4 11c4-2 12-2 16 0M12 14v6.5"/>',
  box: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16v10H4zM9 19.5v-5h6v5"/>',
  file: '<rect x="4.5" y="3.5" width="15" height="17" rx="2.5"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.8-5"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
  users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5M15.5 5.6a3.2 3.2 0 0 1 0 6M17.5 14.4c2 .6 3.2 2.2 3.5 4.6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
  menu: '<path d="M4 7h16M4 12h10M4 17h16"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  down: '<path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19.5h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  chev: '<path d="m7 10 5 5 5-5"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.6-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2.1 0 3 5.8 1.4 5.8 4.3 0 1.3-1.3 2.2-3 2.2-1.3 0-2.4-.6-3-1.6M12 6v1.8M12 16.4v1.6"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>'
};
const ic = (k, cls = '') => `<svg class="ui-i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;
const pill = (t, c = 'ok') => `<span class="upl ${c}">${esc(t)}</span>`;
const SIDE = ['grid', 'truck', 'wheel', 'box', 'store', 'file', 'check', 'user', 'gear'];

/* window chrome: collapsed sidebar + top bar, as in the dashboard */
export function appFrame(pre, type, active, body, label) {
  return `<div class="appfit" role="img" aria-label="${esc(label)}"><div class="app" data-ui="${type}" aria-hidden="true">
<aside class="ui-side"><img src="${pre}assets/mark.png" alt="" width="34" height="34"><span class="ui-dots">···</span>${SIDE.map((k, i) => `<span class="ui-nav${i === active ? ' on' : ''}">${ic(k)}</span>`).join('')}</aside>
<div class="ui-main"><div class="ui-top"><span class="ui-sq">${ic('menu')}</span><span class="ui-sp"></span><span class="ui-rd">${ic('moon')}</span><span class="ui-rd bell">${ic('bell')}<i></i></span><span class="ui-av">${ic('user')}</span><b class="ui-adm">Admin</b>${ic('chev', 'ui-ch')}</div>
<div class="ui-body">${body}</div></div>
<span class="ui-cursor"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6.2 1.6L9.6 19z" fill="#101828" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg></span></div></div>`;
}
const head = (h, sub, right = '') => `<div class="ui-head"><div><strong class="ui-h5">${esc(h)}</strong>${sub ? `<p>${esc(sub)}</p>` : ''}</div>${right}</div>`;
const btnP = (t, k = 'plus') => `<span class="ui-btn p">${esc(t)}${ic(k)}</span>`;
const btnG = (t, k = 'down') => `<span class="ui-btn">${esc(t)}${ic(k)}</span>`;
const table = (cols, rows, cls = '') => `<div class="ui-tbl ${cls}"><div class="tr th">${cols.map(c => `<span>${esc(c)}</span>`).join('')}</div>${rows.join('')}</div>`;
const tools = (date) => `<div class="ui-tools"><span>Show</span><span class="ui-in sm">10</span><span>entries</span><span class="ui-sp"></span>${date ? `<span class="ui-in date">${esc(date)}${ic('cal')}</span>` : ''}<span class="ui-in srch">${ic('search')}Search...</span></div>`;

/* ---------- Dashboard (Delivery tab) ---------- */
const PERIODS = ['Today', 'This Week', 'This Month', 'This Year'];
const METRICS = [
  ['users', 'Customers', ['86', '412', '1,284'], ['4%', '9%', '12%']],
  ['box', 'Orders', ['214', '1,046', '3,906'], ['3%', '6%', '8%']],
  ['truck', 'Vehicles', ['48', '48', '48'], null],
  ['coin', 'Sales', ['SAR 68,400', 'SAR 486,200', 'SAR 1,920,500'], ['5%', '11%', '14%']],
  ['target', 'Route Plans', ['16', '104', '412'], ['2%', '6%', '6%']],
  ['user', 'Drivers', ['52', '52', '52'], null]
];
const GAUGE = [['91', '195 / 214'], ['94', '983 / 1,046'], ['95', '3,712 / 3,906']];
const CHART = [
  [12, 18, 15, 22, 19, 26, 24, 30],
  [40, 52, 47, 61, 58, 66, 71, 78],
  [120, 168, 152, 210, 196, 248, 236, 290]
];
const chartPath = (v) => { const mx = Math.max(...v) * 1.15, w = 640, h = 170; return v.map((y, i) => `${i ? 'L' : 'M'}${(i * w / (v.length - 1)).toFixed(1)} ${(h - y / mx * h).toFixed(1)}`).join(' '); };
export function dashScreen(pre) {
  const p = 2;
  const metric = ([k, t, v, d]) => `<div class="m-card"><span class="m-ic">${ic(k)}</span>${d ? `<span class="m-d" data-v='${JSON.stringify(d.map(x => '↑ ' + x))}'>↑ ${d[p]}</span>` : ''}<span class="m-k">${esc(t)}</span><b class="m-v" data-v='${JSON.stringify(v)}'>${esc(v[p])}</b></div>`;
  const checks = [['FA', 'Faisal A.', '06:42'], ['OK', 'Omar K.', '06:51'], ['YM', 'Yousef M.', '07:03'], ['SR', 'Sami R.', '07:12'], ['HT', 'Hassan T.', '07:20']];
  const body = `${head('Dashboard', 'Reports for each part of your operation', `<div class="ui-seg"><span class="ind"></span>${PERIODS.map((t, i) => `<span class="${i === p ? 'on' : ''}">${t}</span>`).join('')}</div><span class="ui-in date wide">${ic('cal')}</span>`)}
<div class="ui-tabs"><span class="on">Delivery</span><span>Pre-Sale</span><span>Merchandising</span></div>
<div class="d-grid">
<div class="m-grid">${METRICS.map(metric).join('')}</div>
<div class="ui-card gauge"><strong class="ui-h6">Sales Overview</strong><small class="g-sub">Delivered Orders: <b class="g-of" data-v='${JSON.stringify(GAUGE.map(g => g[1]))}'>${GAUGE[p][1]}</b></small><small>Returns: 41 (1%)</small>
<svg viewBox="0 0 240 140"><path class="g-bg" d="M24 124a96 96 0 0 1 192 0" pathLength="100"/><path class="g-fg" d="M24 124a96 96 0 0 1 192 0" pathLength="100" style="stroke-dasharray:${GAUGE[p][0]} 100" data-v='${JSON.stringify(GAUGE.map(g => g[0]))}'/></svg>
<b class="g-big"><span class="g-pct" data-v='${JSON.stringify(GAUGE.map(g => g[0] + '%'))}'>${GAUGE[p][0]}%</span></b>${pill('Delivered')}
<div class="g-row"><div><small>Revenue</small><b>SAR 1.92M</b></div><div><small>Today</small><b>SAR 68.4K</b></div></div></div>
<div class="ui-card journey"><div class="j-top"><div><strong class="ui-h6">Order journey</strong><small>Orders booked in this period and how far they got</small></div><small>New shops registered: <b>38</b></small></div>
<div class="j-bar"><i class="j1" style="--w:4%"></i><i class="j2" style="--w:9%"></i><i class="j3" style="--w:87%"></i></div>
<div class="j-leg"><span><i class="j1"></i>Ordered</span><span><i class="j2"></i>Out for Delivery</span><span><i class="j3"></i>Delivered</span><span class="ui-sp"></span>${pill('Returned 41', 'bad')}${pill('Skipped 12', 'warn')}${pill('Cancelled 9', 'n')}</div></div>
<div class="ui-card chart"><strong class="ui-h6">Order Statistics</strong><svg viewBox="0 0 640 190" preserveAspectRatio="none">${[0, 1, 2, 3].map(i => `<path class="c-grid" d="M0 ${10 + i * 53}H640"/>`).join('')}<path class="c-area" d="${chartPath(CHART[p])} L640 190 L0 190Z" data-v='${JSON.stringify(CHART.map(c => chartPath(c) + ' L640 190 L0 190Z'))}'/><path class="c-line" d="${chartPath(CHART[p])}" pathLength="1" data-v='${JSON.stringify(CHART.map(chartPath))}'/></svg><div class="c-x">${['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'].map(w => `<span>${w}</span>`).join('')}</div></div>
<div class="ui-card checkins"><div class="j-top"><strong class="ui-h6">Today's Driver Check-ins</strong></div>${table(['Driver', 'Checked in', 'Checked out'], checks.map(([a, n, t]) => `<div class="tr"><span class="who"><i>${a}</i>${n}</span><span>${t}</span><span>Not yet</span></div>`), 'cki')}</div>
</div>`;
  return body;
}

/* ---------- Delivery route plans ---------- */
export function routeScreen(pre) {
  const rows = [['SA 4821', 'Faisal A.', 'Riyadh', '38.4 km', '2h 50m', 'Approved'], ['SA 3307', 'Omar K.', 'Riyadh', '29.1 km', '2h 12m', 'Approved'], ['SA 5512', 'Yousef M.', 'Jeddah', '44.7 km', '3h 20m', 'Approved'], ['SA 1180', 'Sami R.', 'Jeddah', '21.9 km', '1h 41m', 'Approved'], ['SA 2764', 'Hassan T.', 'Dammam', '33.0 km', '2h 28m', 'Approved']];
  const r = (x, cls = '') => `<div class="tr ${cls}"><span>29/10/2026</span><span><b>${x[0]}</b></span><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span><span>${x[4]}</span><span>${pill(x[5], x[5] === 'Approved' ? 'ok' : 'warn')}</span></div>`;
  const RP = MAP.uiroute.routes.rp;
  return `${head('Route Plans', '', `<span class="ui-row">${btnP('Generate Route Plan')}${btnG('Download')}</span>`)}
<div class="rp-grid"><div class="ui-card flush">${tools('2026-10-29')}${table(['Date', 'Plate Number', 'Driver', 'City', 'Distance', 'Duration', 'Approval Status'], [r(['SA 6093', 'Khalid N.', 'Riyadh', '42.6 km', '3h 05m', 'Pending'], 'new'), ...rows.map(x => r(x))], 'rp')}</div>
<div class="ui-card flush map"><svg viewBox="0 0 440 400" preserveAspectRatio="xMidYMid slice">${mapBase(pre, 'uiroute')}<path class="m-route" d="${RP.d}" pathLength="1"/>${RP.stops.map(([x, y], i) => `<g class="m-stop" transform="translate(${x} ${y})"><circle r="11"/><text dy="4">${i + 1}</text></g>`).join('')}</svg>${mattr('uiroute')}
<span class="m-chip">${ic('truck')}<b>SA 6093</b> 42.6 km · 3h 05m</span></div></div>`;
}

/* ---------- Sales orders ---------- */
const STAGES = [['Ordered', 'n'], ['Confirmed', 'b'], ['Assigned to Driver', 'b'], ['Out for Delivery', 'warn'], ['Delivered', 'ok']];
export function ordersScreen(pre) {
  const rows = [['ORD-24117', 'Al Noor Market', 'Faisal A.', 4, 'Paid', 'SAR 2,480'], ['ORD-24116', 'Hayat Grocery', 'Omar K.', 4, 'Paid', 'SAR 1,915'], ['ORD-24115', 'Corner Mart 12', 'Yousef M.', 3, 'Pending', 'SAR 3,120'], ['ORD-24114', 'Green Valley', 'Sami R.', 2, 'Pending', 'SAR 860'], ['ORD-24113', 'Family Store', 'Hassan T.', 4, 'Paid', 'SAR 1,340']];
  const r = (x, cls = '') => `<div class="tr ${cls}"><span><b>${x[0]}</b></span><span>29/10/2026</span><span>${x[1]}</span><span>${x[2]}</span><span class="ost">${pill(STAGES[x[3]][0], STAGES[x[3]][1])}</span><span class="pay">${pill(x[4], x[4] === 'Paid' ? 'ok' : 'warn')}</span><span><b>${x[5]}</b></span></div>`;
  const counts = [18, 42, 31, 26, 312];
  return `${head('Orders', '', btnG('Download'))}
<div class="o-flow">${STAGES.map(([t], i) => `<div class="o-st${i === 0 ? ' on' : ''}"><small>${t}</small><b data-n="${counts[i]}">${counts[i]}</b><i></i></div>`).join('')}</div>
<div class="ui-card flush"><div class="ui-tools"><span class="ui-in sel">All Order Status${ic('chev')}</span><span class="ui-in sel">All Payment Status${ic('chev')}</span><span class="ui-sp"></span><span class="ui-in srch">${ic('search')}Search...</span></div>
${table(['Order Number', 'Date', 'Store', 'Driver', 'Order Status', 'Payment Status', 'Total'], [r(['ORD-24118', 'Al Rawdah Mini Mart', 'Khalid N.', 0, 'Pending', 'SAR 1,760'], 'cur'), ...rows.map(x => r(x))], 'or')}</div>`;
}

/* ---------- Shops + task types (merchandising) ---------- */
export function shopsScreen(pre) {
  const rows = [['Al Noor Market', 'MK-1042', 'Supermarket', 'Large', '96.5'], ['Hayat Grocery', 'MK-1038', 'Grocery', 'Medium', '91.0'], ['Corner Mart 12', 'MK-1031', 'Mini mart', 'Small', '88.5'], ['Green Valley', 'MK-1027', 'Supermarket', 'Large', '100.0'], ['Family Store', 'MK-1019', 'Grocery', 'Medium', '84.0']];
  const sc = (v) => pill(v + '%', +v >= 90 ? 'ok' : +v >= 75 ? 'warn' : 'bad');
  const r = (x, cls = '') => `<div class="tr ${cls}"><span class="shop"><b>${x[0]}</b><small>Owner verified</small></span><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span><span class="sc">${sc(x[4])}</span><span>${ic('eye', 'ui-act')}</span></div>`;
  const types = [['Shelf Occupancy', 'Image-based shelf compliance scoring', 312], ['Empty Seals Detection', 'Foil and seal detection on shelf images', 148], ['Planogram Audit', 'Per-SKU shelf-photo audit against a planogram', 96]];
  return `${head('Shops', '', `<span class="ui-row">${btnP('Import Shops')}${btnG('Download')}</span>`)}
<div class="shp-grid"><div class="ui-card flush">${tools('')}${table(['Shop Details', 'Shop Code', 'Business Type', 'Shop Size', 'Compliance Score', ''], [r(['Al Rawdah Mini Mart', 'MK-1046', 'Mini mart', 'Small', '62.5'], 'scan'), ...rows.map(x => r(x))], 'shp')}</div>
<div class="shp-side"><div class="ui-card cring"><strong class="ui-h6">Average compliance</strong><svg viewBox="0 0 120 120"><circle class="g-bg" cx="60" cy="60" r="48" pathLength="100"/><circle class="g-fg" cx="60" cy="60" r="48" pathLength="100" style="stroke-dasharray:91 100"/></svg><b class="r-v">91%</b><small>${pill('↑ 6%')} vs last month</small></div>
<div class="ui-card types"><strong class="ui-h6">Task Types</strong>${types.map(([t, d, n]) => `<div class="ty"><div><b>${t}</b><small>${d}</small></div><span class="tyn">${n}</span>${pill('active')}</div>`).join('')}</div></div></div>`;
}

/* ---------- Assign districts (distribution) ---------- */
const AGENTS = [['Faisal A.', '#465fff', ['Al Rawdah', 'Al Salamah', 'Al Zahra'], 14], ['Omar K.', '#12b76a', ['Al Bawadi', 'Al Rabwah'], 9], ['Yousef M.', '#f79009', ['Al Andalus', 'Al Khalidiyah', 'Al Shati'], 12], ['Sami R.', '#7a5af8', ['Al Faisaliyah', 'Al Aziziyah'], 8]];
export function districtsScreen(pre) {
  return `<div class="ui-card dz-top"><div class="dz-f"><label>Region <i>*</i></label><span class="ui-in">Makkah Region${ic('chev')}</span></div><div class="dz-f"><label>City</label><span class="ui-in">Jeddah${ic('chev')}</span></div><div class="dz-n"><b>No Of Shops <em>128</em></b><b>No Of Merchandisers <em>${AGENTS.length}</em></b></div></div>
<div class="dz-grid"><div class="dz-list"><strong class="ui-h5">Assign Districts</strong><div class="dz-leg"><span><i style="background:#98a2b3"></i>No Shops</span><span><i style="background:#f04438"></i>Has Shops</span></div>
${AGENTS.map(([n, c, d, s], i) => `<div class="ui-card agent" data-a="${i}"><div class="ag-top"><b>${n}</b><i style="background:${c}"></i><span class="upl y">No Of Shops: <em data-n="${s}">${s}</em></span></div><small>Merchandiser</small><small class="ag-l">Assigned Districts:</small><small class="ag-d">${d.join(', ')}</small></div>`).join('')}</div>
<div class="ui-card flush map dz-map"><svg viewBox="0 0 560 460" preserveAspectRatio="xMidYMid slice">${mapBase(pre, 'districts')}<g class="m-zoom" transform="translate(516 16)"><rect width="28" height="56" rx="6"/><path d="M14 10v12M8 16h12M8 42h12"/></g></svg>${mattr('districts')}</div></div>`;
}

export const SCREENS = { dash: [dashScreen, 0, 'Trackeys dashboard: metric cards, delivery gauge, order journey, order statistics and driver check-ins'], route: [routeScreen, 1, 'Trackeys route plans: a table of approved routes and a map of the new route'], orders: [ordersScreen, 3, 'Trackeys sales orders: order status pipeline and orders table'], shops: [shopsScreen, 4, 'Trackeys shops: compliance scores per shop and AI task types'], districts: [districtsScreen, 4, 'Trackeys assign districts: merchandisers and their districts on a city map'] };
export const screen = (pre, k) => { const [fn, active, label] = SCREENS[k]; return appFrame(pre, k, active, fn(pre), label); };
