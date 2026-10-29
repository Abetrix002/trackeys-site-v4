#!/usr/bin/env python3
"""Real Saudi street maps for the site's scenes.

Reads OpenStreetMap extracts in osm/ (Riyadh: Al Olaya / King Fahd Road; Jeddah: central districts),
renders each scene as a themeable SVG fragment (classes styled by site.css tokens, so light and dark both work),
and routes vans along real roads with Dijkstra over the street graph (one-way streets respected).
Map data © OpenStreetMap contributors, ODbL. Output: scenes.json, read by build.mjs.

    python3 -I src3/map/render.py            # build scenes.json
    python3 -I src3/map/render.py overview   # debug overview SVGs with a lat/lon grid
"""
import json, math, heapq, os, sys

H = os.path.dirname(os.path.abspath(__file__))
def load(n): return json.load(open(os.path.join(H, 'osm', n)))['elements']

CLS = {'motorway': 'mw', 'trunk': 'mw', 'primary': 'pr', 'secondary': 'sc', 'tertiary': 'sc', 'unclassified': 'rs', 'residential': 'rs',
       'living_street': 'rs', 'service': 'sv', 'motorway_link': 'lk', 'trunk_link': 'lk', 'primary_link': 'lk', 'secondary_link': 'lk', 'tertiary_link': 'lk'}
ORDER = ['sv', 'rs', 'lk', 'sc', 'pr', 'mw']
WIDTH_M = {'sv': 4, 'rs': 7, 'lk': 8, 'sc': 12, 'pr': 16, 'mw': 24}
SPEED = {'motorway': 100, 'trunk': 80, 'primary': 60, 'secondary': 50, 'tertiary': 40, 'unclassified': 30, 'residential': 25, 'living_street': 15,
         'motorway_link': 50, 'trunk_link': 50, 'primary_link': 40, 'secondary_link': 35, 'tertiary_link': 30}

PAL = {
    'light': dict(land='#f3f4f2', bld='#e5e5e1', blds='#d8d8d3', park='#cdeacf', water='#a9d3f2', c='#d4d7dc', r='#ffffff', prc='#ecd284', pr='#fff2c4', mwc='#e2ad45', mw='#ffdc85'),
    'dark': dict(land='#1a2130', bld='#212a3b', blds='#283247', park='#1c3529', water='#11294a', c='#121826', r='#2f3a4f', prc='#141a27', pr='#3c475e', mwc='#2a2416', mw='#66593a'),
}
def style(t):
    c = PAL[t]
    return (f".o-land{{fill:{c['land']}}}.o-water{{fill:{c['water']}}}.o-park{{fill:{c['park']}}}.o-bld{{fill:{c['bld']};stroke:{c['blds']};stroke-width:.5}}"
            f".o-c,.o-r{{fill:none;stroke-linecap:round;stroke-linejoin:round}}.o-c{{stroke:{c['c']}}}.o-r{{stroke:{c['r']}}}"
            f".o-c.o-pr,.o-c.o-lk{{stroke:{c['prc']}}}.o-r.o-pr,.o-r.o-lk{{stroke:{c['pr']}}}.o-c.o-mw{{stroke:{c['mwc']}}}.o-r.o-mw{{stroke:{c['mw']}}}.o-c.o-sv{{opacity:.7}}")

def num(v): s = '%.1f' % v; return s[:-2] if s.endswith('.0') else s

class Proj:
    def __init__(s, lat, lon, mpu, w, h):
        s.lat0, s.lon0, s.w, s.h = lat, lon, w, h
        s.kx = math.cos(math.radians(lat)) * 111320 / mpu; s.ky = 110540 / mpu; s.mpu = mpu
    def __call__(s, la, lo): return ((lo - s.lon0) * s.kx + s.w / 2, (s.lat0 - la) * s.ky + s.h / 2)

def rdp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]; dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy)
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / L if L > 1e-9 else math.hypot(x - x1, y - y1)
        if d > dmax: dmax, idx = d, i
    return rdp(pts[:idx + 1], eps)[:-1] + rdp(pts[idx:], eps) if dmax > eps else [pts[0], pts[-1]]

def runs(pts, w, h, m=30):
    """Split a polyline into runs whose segments touch the (expanded) viewport."""
    def hit(a, b): return max(a[0], b[0]) >= -m and min(a[0], b[0]) <= w + m and max(a[1], b[1]) >= -m and min(a[1], b[1]) <= h + m
    out, cur = [], []
    for a, b in zip(pts, pts[1:]):
        if hit(a, b):
            if not cur: cur = [a]
            cur.append(b)
        elif cur: out.append(cur); cur = []
    if cur: out.append(cur)
    return out

def dpath(rs, close=False):
    return ''.join('M' + ' '.join(num(x) + ' ' + num(y) for x, y in r) + ('Z' if close else '') for r in rs)

def rings(segs):
    """Join way geometries into closed (or maximal open) chains."""
    segs = [list(s) for s in segs if len(s) > 1]; out = []
    while segs:
        r = segs.pop(0)
        while r[0] != r[-1]:
            for i, s in enumerate(segs):
                if s[0] == r[-1]: r = r + s[1:]; break
                if s[-1] == r[-1]: r = r + s[::-1][1:]; break
                if s[-1] == r[0]: r = s + r[1:]; break
                if s[0] == r[0]: r = s[::-1] + r[1:]; break
            else: break
            segs.pop(i)
        out.append(r)
    return out

def hav(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (*a, *b))
    return 2 * 6371000 * math.asin(math.sqrt(math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2))

class Graph:
    def __init__(s, ways):
        s.adj, s.und, s.pos = {}, {}, {}
        for w in ways:
            t = w['tags']; hw = t.get('highway'); sp = SPEED.get(hw)
            if not sp or t.get('access') in ('private', 'no'): continue
            ow = t.get('oneway') in ('yes', '1', 'true') or (hw in ('motorway', 'motorway_link') and t.get('oneway') != 'no')
            rev = t.get('oneway') == '-1'
            for a, b, ga, gb in zip(w['nodes'], w['nodes'][1:], w['geometry'], w['geometry'][1:]):
                pa, pb = (ga['lat'], ga['lon']), (gb['lat'], gb['lon']); s.pos[a], s.pos[b] = pa, pb
                c = hav(pa, pb) / (sp / 3.6)
                if not rev: s.adj.setdefault(a, []).append((b, c))
                if not ow or rev: s.adj.setdefault(b, []).append((a, c))
                s.und.setdefault(a, []).append((b, c)); s.und.setdefault(b, []).append((a, c))
    def main_component(s):
        if not hasattr(s, 'cc'):
            seen, best = set(), set()
            for n in s.und:
                if n in seen: continue
                comp, st = {n}, [n]
                while st:
                    for v, _ in s.und[st.pop()]:
                        if v not in comp: comp.add(v); st.append(v)
                seen |= comp; best = max(best, comp, key=len)
            s.cc = [n for n in best if n in s.adj]
        return s.cc
    def near(s, P, x, y):
        return min(s.main_component(), key=lambda n: (lambda p: (p[0] - x) ** 2 + (p[1] - y) ** 2)(P(*s.pos[n])))
    def route(s, a, b, avoid=(), adj=None):
        adj = adj or s.adj; dist, prev, pq = {a: 0}, {}, [(0, a)]
        while pq:
            d, u = heapq.heappop(pq)
            if u == b: break
            if d > dist.get(u, 1e18): continue
            for v, c in adj.get(u, ()):
                if v in avoid: continue
                if d + c < dist.get(v, 1e18): dist[v] = d + c; prev[v] = u; heapq.heappush(pq, (d + c, v))
        if b not in dist:
            if adj is s.und: raise SystemExit(f'no route {a}->{b}')
            print('  one-way fallback', a, b); return s.route(a, b, avoid, s.und)
        path = [b]
        while path[-1] != a: path.append(prev[path[-1]])
        return path[::-1]

AREAS = {}
def area(name):
    if name in AREAS: return AREAS[name]
    if name == 'riyadh':
        roads = [e for e in load('riyadh.json') if e['type'] == 'way' and e['tags'].get('highway')]
        parks = [e for e in load('riyadh.json') if e['type'] == 'way' and (e['tags'].get('leisure') == 'park' or e['tags'].get('landuse') == 'grass')]
        blds = [e for e in load('riyadh-b.json') if e['type'] == 'way']
        AREAS[name] = dict(roads=roads, parks=parks, blds=blds, graph=Graph(roads), coast=[], districts=[], places=[])
    else:
        el = load('jeddah.json')
        AREAS[name] = dict(roads=[e for e in el if e['type'] == 'way' and e['tags'].get('highway')], parks=[], blds=[], graph=None,
                           coast=[[(g['lat'], g['lon']) for g in e['geometry']] for e in el if e['type'] == 'way' and e['tags'].get('natural') == 'coastline'],
                           districts=[e for e in el if e['type'] == 'relation'], places=[e for e in el if e['type'] == 'node'])
    return AREAS[name]

def norm(n):
    n = n.replace('Al-', 'Al ')
    return {'Al Shatee': 'Al Shati', 'Al Faisaliyyah': 'Al Faisaliyah', 'Al Khalidiyyah': 'Al Khalidiyah'}.get(n, n)

def render(key, sp):
    A = area(sp['area']); w, h = sp['w'], sp['h']; P = Proj(sp['lat'], sp['lon'], sp['mpu'], w, h)
    eps = sp.get('eps', 0.5); rw = sp.get('rw', 1.0); skip = set(sp.get('skip', ()))
    o = [f'<rect class="o-land" x="-40" y="-40" width="{w + 80}" height="{h + 80}"/>']
    if A['coast']:
        chain = max(rings(A['coast']), key=len)
        rr = max(runs([P(*p) for p in chain], w, h, 200), key=len)
        if rr[0][1] > rr[-1][1]: rr = rr[::-1]
        rr = rdp(rr, eps)
        o.append(f'<path class="o-water" d="{dpath([rr + [(-400, rr[-1][1]), (-400, -400), (rr[0][0], -400)]], True)}"/>')
    for e in A['parks']:
        g = [P(x['lat'], x['lon']) for x in e['geometry']]
        if len(g) > 3 and g[0] == g[-1] and any(-20 < x < w + 20 and -20 < y < h + 20 for x, y in g): o.append(f'<path class="o-park" d="{dpath([rdp(g, eps)], True)}"/>')
    if A['blds'] and 'blds' not in skip:
        bs = []
        for e in A['blds']:
            g = [P(x['lat'], x['lon']) for x in e['geometry']]; cx = sum(p[0] for p in g) / len(g); cy = sum(p[1] for p in g) / len(g)
            if not (-10 < cx < w + 10 and -10 < cy < h + 10): continue
            g = rdp(g[:-1] if g[0] == g[-1] else g, 0.45)
            ar = abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(g, g[1:] + g[:1]))) / 2
            if len(g) >= 3 and ar > 2.5: bs.append(g)
        o.append(f'<path class="o-bld" d="{dpath([[(round(x), round(y)) for x, y in g] for g in bs], True)}"/>')
    dist_svg, labels = '', []
    if A['districts']:
        own = {d: i for i, ds in enumerate(sp.get('agents', [])) for d in ds}
        for e in A['districts']:
            nm = norm(e['tags'].get('name:en') or e['tags'].get('name', ''))
            rs = rings([[(g['lat'], g['lon']) for g in m['geometry']] for m in e['members'] if m['type'] == 'way' and m.get('role') in ('outer', '')])
            d = dpath([rdp([P(*p) for p in r], eps) for r in rs if len(r) > 3], True); a = own.get(nm, -1)
            dist_svg += f'<path class="dist{"" if a >= 0 else " free"}" data-a="{a}" data-n="{nm}" d="{d}"/>'
        for e in A['places']:
            nm = norm(e['tags'].get('name:en') or e['tags'].get('name', '')); x, y = P(e['lat'], e['lon'])
            if 12 < x < w - 12 and 12 < y < h - 12: labels.append(f'<text class="o-dl" x="{num(x)}" y="{num(y)}">{nm}</text>')
    road = {c: [] for c in ORDER}; named = {}
    for e in A['roads']:
        c = CLS.get(e['tags'].get('highway'))
        if not c or c in skip: continue
        pts = [P(g['lat'], g['lon']) for g in e['geometry']]
        for r in runs(pts, w, h):
            road[c].append(rdp(r, eps))
            nm = e['tags'].get('name:en')
            if nm and c in ('mw', 'pr') and 'Branch' not in nm: named.setdefault(nm.replace(' Rd', ' Road'), []).append(r)
    wd = {c: max(sp.get('min', 1.1), WIDTH_M[c] / P.mpu * rw) for c in ORDER}
    for c in ORDER:
        if road[c]: o.append(f'<path class="o-c o-{c}" stroke-width="{num(wd[c] + max(1.2, wd[c] * .3))}" d="{dpath(road[c])}"/>')
    for c in ORDER:
        if road[c]: o.append(f'<path class="o-r o-{c}" stroke-width="{num(wd[c])}" d="{dpath(road[c])}"/>')
    # street labels along the longest visible run of each major road
    nl = 0; defs = ''
    cands = []
    for nm, rs in named.items():
        for r in rs:
            r2 = [p for p in r if 8 < p[0] < w - 8 and 8 < p[1] < h - 8]
            L = sum(math.dist(a, b) for a, b in zip(r2, r2[1:]))
            if len(r2) > 1: cands.append((L, nm, r2))
    used = set()
    for L, nm, r in sorted(cands, reverse=True):
        if nm in used or L < sp.get('lmin', 150) or nl >= sp.get('labels', 3): continue
        r = rdp(r, 4)
        if r[-1][0] < r[0][0]: r = r[::-1]
        pid = f'lb-{key}-{nl}'; defs += f'<path id="{pid}" d="{dpath([r])}"/>'
        labels.append(f'<text class="o-lb"><textPath href="#{pid}" startOffset="50%" text-anchor="middle">{nm}</textPath></text>'); used.add(nm); nl += 1
    over = (f'<defs>{defs}</defs>' if defs else '') + dist_svg + ''.join(labels)
    out = {'base': ''.join(o), 'over': over, 'w': w, 'h': h, 'cls': sp.get('cls', ''), 'attr': sp.get('attr', 'br'), 'routes': {}, 'pts': {}}
    G = A['graph']; ref = {}
    for rk, stops in sp.get('routes', {}).items():
        ns = [ref[x] if isinstance(x, str) else G.near(P, *x) for x in stops]; segs = []
        for a, b in zip(ns, ns[1:]):
            av = set()
            if rk.endswith('alt'):  # avoid the blocked stretch of the main route
                main = out['routes'][rk[:-3] + 'main']['nodes']; k = main.index(a); bl = sp.get('block', 12)
                j = main.index(ref[bl]) + 2 if isinstance(bl, str) else k + 1 + bl
                av = set(main[k + 1:min(j, len(main) - 2)])
            segs.append(G.route(a, b, av, None if sp.get('oneway', True) else G.und))
        nodes = [n for i, s in enumerate(segs) for n in (s if i == 0 else s[1:])]
        pl = lambda nn: rdp([P(*G.pos[n]) for n in nn], 0.6)
        out['routes'][rk] = {'d': 'M' + ' L'.join(num(x) + ' ' + num(y) for x, y in pl(nodes)), 'segs': ['M' + ' L'.join(num(x) + ' ' + num(y) for x, y in pl(s)) for s in segs],
                             'stops': [[num(c) for c in P(*G.pos[n])] for n in ns], 'nodes': nodes}
        # named points at a fraction of this route's length, snapped to a node (frac is exact for that node)
        pts = [P(*G.pos[n]) for n in nodes]; cum = [0]
        for u, v in zip(pts, pts[1:]): cum.append(cum[-1] + math.dist(u, v))
        for pk, (rk2, f) in sp.get('along', {}).items():
            if rk2 != rk: continue
            i = next(i for i, c in enumerate(cum) if c >= f * cum[-1]); ref[pk] = nodes[i]
            out['pts'][pk] = [num(pts[i][0]), num(pts[i][1])]; out['pts'][pk + '_f'] = round(cum[i] / cum[-1], 4)
    for v in out['routes'].values(): v.pop('nodes')
    return out

def overview(name, lat, lon, mpu, w, h, step):
    sp = dict(area=name, lat=lat, lon=lon, mpu=mpu, w=w, h=h, labels=12, lmin=60, skip=['blds'])
    rr = render('ov', sp); s = f'<style>{style("light")}</style>' + rr['base'] + rr['over']; P = Proj(lat, lon, mpu, w, h); grid = ''
    la = math.floor((lat - h / 2 * mpu / 110540) / step) * step
    while la < lat + h / 2 * mpu / 110540:
        y = P(la, lon)[1]; grid += f'<path d="M0 {num(y)}H{w}" stroke="red" stroke-width=".6"/><text x="4" y="{num(y - 3)}" fill="red" font-size="11">{la:.3f}</text>'; la += step
    lo = math.floor((lon - (w / 2) / P.kx) / step) * step
    while lo < lon + (w / 2) / P.kx:
        x = P(lat, lo)[0]; grid += f'<path d="M{num(x)} 0V{h}" stroke="red" stroke-width=".6"/><text x="{num(x + 3)}" y="12" fill="red" font-size="11">{lo:.3f}</text>'; lo += step
    css = open(os.path.join(H, 'map.css')).read() if os.path.exists(os.path.join(H, 'map.css')) else ''
    open(os.path.join(H, f'overview-{name}.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><style>{css}</style>{s}{grid}</svg>')

if __name__ == '__main__':
    if sys.argv[1:] == ['overview']:
        overview('riyadh', 24.714, 46.675, 4.5, 1000, 700, 0.005); overview('jeddah', 21.58, 39.15, 12, 900, 760, 0.01)
    else:
        from scenes import SCENES
        res = {k: render(k, v) for k, v in SCENES.items()}
        outdir = os.path.join(H, '..', '..', 'web3', 'assets', 'map'); os.makedirs(outdir, exist_ok=True)
        for k, v in res.items():
            for t in PAL:
                open(os.path.join(outdir, f'{k}-{t}.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {v["w"]} {v["h"]}" width="{v["w"]}" height="{v["h"]}"><style>{style(t)}</style>{v["base"]}</svg>')
            print(k, len(v['base']) // 1024, 'KB base,', len(v['over']) // 1024, 'KB inline', list(v['routes']), {a: b for a, b in v['pts'].items()})
            del v['base']
        json.dump(res, open(os.path.join(H, 'scenes.json'), 'w'))
