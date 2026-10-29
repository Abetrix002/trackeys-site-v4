# Map scenes: crop (centre lat/lon, metres per SVG unit, viewBox), routes as stop lists in scene units
# (snapped to the nearest drivable node), and named points at a fraction of a route.
RIYADH = dict(area='riyadh')
SCENES = {
    # home hero: depot → delivery → incident on the main road → destination; the re-route branches at ~48%
    'home': dict(RIYADH, lat=24.7125, lon=46.6735, mpu=3.4, w=560, h=510, labels=3, oneway=False, attr='tl',
                 routes={'hmain': [(60, 420), (520, 190)], 'halt': ['hb', (520, 190)]}, block='hflag',
                 along={'hp1': ('hmain', 0.24), 'hb': ('hmain', 0.48), 'hflag': ('hmain', 0.66)}),
    # home live map: three vehicles on real roads
    'live': dict(RIYADH, lat=24.7185, lon=46.6705, mpu=4, w=600, h=460, labels=3, oneway=False, attr='tr',
                 routes={'l1': [(20, 130), (590, 100)], 'l2': [(210, 10), (230, 450)], 'l3': [(20, 340), (590, 300)]},
                 along={'p1': ('l1', 0.5), 'p2': ('l1', 0.8), 'p3': ('l2', 0.62), 'p4': ('l3', 0.6)}),
    # delivery & routing hero: six stops in order
    'route': dict(RIYADH, lat=24.7065, lon=46.6845, mpu=2.6, w=560, h=500, labels=2, oneway=False, attr='tr',
                  routes={'r': [(70, 410), (170, 320), (300, 350), (400, 250), (300, 160), (470, 92)]}),
    'phone': dict(RIYADH, lat=24.7215, lon=46.6855, mpu=3, w=560, h=500, labels=2, cls='mute', attr='tr'),
    'network': dict(RIYADH, lat=24.7045, lon=46.6610, mpu=3.5, w=560, h=500, labels=2, cls='mute', attr='tr'),
    # product window: route plans map
    'uiroute': dict(RIYADH, lat=24.7105, lon=46.6775, mpu=4.4, w=440, h=400, labels=2, skip=['sv'], oneway=False,
                    routes={'rp': [(60, 330), (150, 250), (250, 290), (330, 190), (250, 110), (380, 70)]}),
    # product window: assign districts (Jeddah, real district boundaries)
    'districts': dict(area='jeddah', lat=21.5745, lon=39.1525, mpu=17.5, w=560, h=460, labels=0, eps=0.8, skip=['rs', 'sv'], min=0.9, rw=1.6,
                      agents=[['Al Rawdah', 'Al Salamah', 'Al Zahra'], ['Al Bawadi', 'Al Rabwah'], ['Al Andalus', 'Al Khalidiyah', 'Al Shati'], ['Al Faisaliyah', 'Al Aziziyah']]),
}
