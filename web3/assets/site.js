(() => {
  const D = document.documentElement; D.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) G.registerPlugin(ST, ...(window.MotionPathPlugin ? [window.MotionPathPlugin] : []));
  const motion = !!(G && ST && !reduce);
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
  const live = $('#live'); const say = (m) => { if (live) { live.textContent = ''; setTimeout(() => live.textContent = m, 30); } };

  /* theme */
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (D.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light')) === 'dark';
  const paint = () => { D.classList.toggle('is-dark', isDark()); $$('.theme-toggle').forEach(b => b.setAttribute('aria-pressed', String(isDark()))); };
  paint(); mq.addEventListener?.('change', paint); new MutationObserver(paint).observe(D, { attributes: true, attributeFilter: ['data-theme'] });
  $$('.theme-toggle').forEach(b => b.addEventListener('click', () => { const n = isDark() ? 'light' : 'dark'; D.setAttribute('data-theme', n); store.set('tk-theme', n); paint(); }));

  /* review notes */
  const rv = $('#review-toggle');
  if (rv) { const ap = (on) => { document.body.classList.toggle('review', on); rv.setAttribute('aria-pressed', String(on)); }; ap(store.get('tk-review3') === '1'); rv.addEventListener('click', () => { const on = rv.getAttribute('aria-pressed') !== 'true'; ap(on); store.set('tk-review3', on ? '1' : '0'); }); }

  /* header: blur after scroll, hide on the way down, return on the way up */
  const hdr = $('.site-header'), sub = $('.subnav');
  if (hdr) {
    let last = scrollY, tick = false;
    const upd = () => {
      const y = scrollY; hdr.classList.toggle('scrolled', y > 8);
      const hide = y > 260 && y > last + 2 && !$('.menu.open') && !$('.mobile-nav.open');
      if (y < last - 2 || y < 260) hdr.classList.remove('hide'); else if (hide) hdr.classList.add('hide');
      sub?.classList.toggle('up', hdr.classList.contains('hide'));
      last = y; tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
  }

  /* menus */
  const items = $$('.nav-item');
  const setMenu = (it, open) => { $('.nav-trigger', it).setAttribute('aria-expanded', String(open)); $('.menu', it).classList.toggle('open', open); if (open) items.forEach(o => o !== it && setMenu(o, false)); };
  items.forEach(it => {
    const t = $('.nav-trigger', it); let tm;
    t.addEventListener('click', () => setMenu(it, t.getAttribute('aria-expanded') !== 'true'));
    it.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(it, false); t.focus(); } });
    it.addEventListener('focusout', e => { if (!it.contains(e.relatedTarget)) setMenu(it, false); });
    if (fine) { it.addEventListener('pointerenter', () => { clearTimeout(tm); tm = setTimeout(() => setMenu(it, true), 60); }); it.addEventListener('pointerleave', () => { clearTimeout(tm); tm = setTimeout(() => setMenu(it, false), 160); }); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.nav-item')) items.forEach(i => setMenu(i, false)); });
  const mt = $('.menu-toggle'), mn = $('#mobile-nav');
  if (mt && mn) { const set = (o) => { if (o && hdr) mn.style.top = Math.max(0, hdr.getBoundingClientRect().bottom) + 'px'; mt.setAttribute('aria-expanded', String(o)); mt.setAttribute('aria-label', o ? 'Close menu' : 'Menu'); mn.classList.toggle('open', o); mn.toggleAttribute('inert', !o); document.body.style.overflow = o ? 'hidden' : ''; }; set(false); mt.addEventListener('click', () => set(mt.getAttribute('aria-expanded') !== 'true')); mn.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); mt.focus(); } }); }

  /* spotlight cards */
  if (fine) { let raf = 0, ev; document.addEventListener('pointermove', e => { ev = e; if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const c = ev.target.closest?.('.spot'); if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty('--mx', ev.clientX - r.left + 'px'); c.style.setProperty('--my', ev.clientY - r.top + 'px'); }); }, { passive: true }); }

  /* page-to-page fade */
  const veil = $('.veil');
  if (veil && !reduce) {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const h = a.getAttribute('href'); if (!h || h.startsWith('#') || /^(https?:|mailto:|tel:)/.test(h)) return;
      e.preventDefault(); veil.classList.add('on'); setTimeout(() => { location.href = a.href; }, 240);
    });
    addEventListener('pageshow', () => veil.classList.remove('on'));
  }

  /* smooth scroll */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ST.update); G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute('href'); if (id.length < 2) { e.preventDefault(); return; }
    const t = document.getElementById(id.slice(1)); if (!t) return; e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: -96 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* numbers */
  const countUp = (el) => {
    const raw = el.dataset.final || el.textContent; el.dataset.final = raw;
    const m = raw.match(/^(.*?)(\d[\d,]*\.?\d*)(.*)$/); if (!m || !motion) { el.textContent = raw; return; }
    const target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].includes(',');
    const o = { v: 0 };
    G.to(o, { v: target, duration: 1.4, ease: 'power3.out', onUpdate: () => { let s = o.v.toFixed(dec); if (comma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); el.textContent = m[1] + s + m[3]; }, onComplete: () => el.textContent = raw });
  };

  /* headline split + intro */
  $$('[data-split]').forEach(h => {
    const wrap = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part)) frag.append(' '); else { const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); i.className = 'wi'; i.textContent = part; w.append(i); frag.append(w); } });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    h.setAttribute('aria-label', h.textContent.trim()); wrap(h); $$('.w', h).forEach(w => w.setAttribute('aria-hidden', 'true'));
  });
  if (motion) {
    const tl = G.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('[data-split] .wi', { yPercent: 115, duration: 1.1, stagger: 0.045 })
      .from('[data-hero]', { y: 20, opacity: 0, duration: 1, stagger: 0.08 }, 0.15)
      .from('[data-hero-art]', { y: 36, opacity: 0, scale: 0.97, duration: 1.2 }, 0.2);
  }

  /* reveals: only content that starts below the fold is offset */
  const vh = innerHeight;
  $$('[data-r]').forEach(el => {
    const below = el.getBoundingClientRect().top > vh * 0.9;
    const targets = el.hasAttribute('data-stagger') ? [...el.children] : [el];
    const done = () => { el.classList.add('in'); $$('[data-count]', el).forEach(c => { if (!c.closest('[hidden]')) countUp(c); }); };
    if (!motion) { el.classList.add('in'); return; }
    if (below) {
      G.set(targets, { y: 26, opacity: 0 });
      ST.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => { G.to(targets, { y: 0, opacity: 1, duration: 0.95, ease: 'expo.out', stagger: 0.08 }); done(); } });
    } else setTimeout(done, 400);
  });
  if (motion) $$('[data-hero] [data-count], .hstats [data-count], .company [data-count]').forEach(c => setTimeout(() => countUp(c), 500));

  /* parallax */
  if (motion) {
    $$('[data-parallax]').forEach(el => G.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    $$('[data-parallax-img]').forEach(el => G.fromTo(el, { scale: 1.12, yPercent: -4 }, { scale: 1.02, yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    $$('[data-impl] .line i').forEach(l => G.to(l, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: l.closest('[data-impl]'), start: 'top 75%', end: 'bottom 60%', scrub: true } }));
  } else $$('[data-impl] .line i').forEach(l => l.style.transform = 'none');

  /* segmented controls (tabs + toggle groups) with a sliding pill */
  const moveInd = (seg, btn, instant) => {
    const ind = $('.ind', seg); if (!ind || !btn) return;
    const x = btn.offsetLeft, w = btn.offsetWidth;
    if (G && !instant && !reduce) G.to(ind, { x, width: w, duration: 0.45, ease: 'expo.out' }); else { ind.style.transform = `translateX(${x}px)`; ind.style.width = w + 'px'; }
  };
  const segs = $$('.seg');
  const reflow = () => segs.forEach(s => moveInd(s, $('[aria-selected="true"],[aria-pressed="true"]', s), true));
  addEventListener('resize', reflow); document.fonts?.ready.then(reflow); reflow();
  const panelIn = (p) => {
    if (motion) G.fromTo(p, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' });
    $$('[data-count]', p).forEach(countUp);
    $$('.spark .ln', p).forEach(l => motion && G.fromTo(l, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power3.out' }));
    $$('[data-ring]', p).forEach(r => motion && G.fromTo(r, { strokeDasharray: '0 100' }, { strokeDasharray: r.dataset.ring + ' 100', duration: 1.2, ease: 'power3.out' }));
  };
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list); let cur = 0;
    const sel = (i, focus) => {
      tabs.forEach((t, j) => { const on = i === j; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; const p = document.getElementById(t.getAttribute('aria-controls')); p.hidden = !on; if (on && i !== cur) panelIn(p); });
      cur = i; moveInd(list, tabs[i]); if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => { t.addEventListener('click', () => sel(i)); t.addEventListener('keydown', e => { let n = null; if (e.key === 'ArrowRight') n = (i + 1) % tabs.length; if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length; if (e.key === 'Home') n = 0; if (e.key === 'End') n = tabs.length - 1; if (n !== null) { e.preventDefault(); sel(n, true); } }); });
    tabs.forEach((t, j) => t.tabIndex = j ? -1 : 0);
  });

  /* currency */
  const cur = $('[data-currency]');
  if (cur) {
    const rate = { USD: 1, AED: 3.67, EUR: 0.92 };
    const fmt = (c, n) => { const v = n < 1 ? n.toFixed(2) : Math.round(n).toLocaleString('en-US'); return c === 'USD' ? '$' + v : c === 'EUR' ? '€' + v : 'AED ' + v; };
    const btns = $$('button', cur);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); moveInd(cur, b);
      $$('[data-usd]').forEach(el => { const t = fmt(b.dataset.cur, +el.dataset.usd * rate[b.dataset.cur]); if (reduce) { el.textContent = t; return; } el.classList.add('swap'); setTimeout(() => { el.textContent = t; el.classList.remove('swap'); }, 170); });
    }));
  }

  /* ROI calculator (formula matched to the live site) */
  const roi = $('[data-roi]');
  if (roi) {
    const ins = $$('input[type=range]', roi), outs = ins.map((_, i) => $('#roi-o-' + i));
    const units = ['people', 'visits', 'USD'];
    const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const state = { a: 1164300, m: 99000, c: 1975, x: 50.1 };
    const render = () => { $('#roi-annual').textContent = money(state.a); $('#roi-m').textContent = money(state.m); $('#roi-c').textContent = money(state.c) + '/mo'; $('#roi-x').textContent = state.x.toFixed(1) + '×'; };
    const calc = () => {
      const [reps, visits, rev] = ins.map(i => +i.value);
      ins.forEach((i, k) => { i.style.setProperty('--fill', ((i.value - i.min) / (i.max - i.min) * 100) + '%'); outs[k].innerHTML = (k === 2 ? '$ ' : '') + i.value + `<small>${units[k]}</small>`; });
      const m = reps * (visits * rev * 7.7 + 264), c = reps * 79, a = (m - c) * 12, x = m / c;
      $('#roi-p').textContent = m > c ? '1 month' : 'Not reached';
      if (G && !reduce) G.to(state, { a, m, c, x, duration: 0.5, ease: 'power2.out', onUpdate: render, overwrite: true }); else { Object.assign(state, { a, m, c, x }); render(); }
    };
    ins.forEach(i => i.addEventListener('input', calc)); calc();
  }

  /* blog filters */
  const flt = $('[data-filter]');
  if (flt) {
    const btns = $$('button', flt), cards = $$('#posts > .acard');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); moveInd(flt, b);
      const f = b.dataset.f, show = cards.filter(c => f === 'All' || c.dataset.cat === f), hide = cards.filter(c => !show.includes(c));
      if (!G || reduce) { cards.forEach(c => c.hidden = !show.includes(c)); return; }
      G.to(hide, { opacity: 0, scale: 0.96, duration: 0.2, onComplete: () => { hide.forEach(c => c.hidden = true); show.forEach(c => c.hidden = false); G.fromTo(show, { opacity: 0, y: 16 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05 }); ST.refresh(); } });
      if (!hide.length) G.fromTo(show, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.05 });
      say(show.length + ' articles');
    }));
  }

  /* reading progress */
  const rb = $('.readbar');
  if (rb) { const art = $('.article'); const upd = () => { const r = art.getBoundingClientRect(); const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); rb.style.transform = `scaleX(${p})`; }; addEventListener('scroll', upd, { passive: true }); upd(); }

  /* scenes */
  const loop = (el, build) => {
    if (!motion || !window.MotionPathPlugin) return false;
    const tl = build(); tl.pause();
    ST.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: s => s.isActive ? tl.play() : tl.pause() });
    return tl;
  };
  const mp = (path, o = {}) => ({ path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true, ...o });
  $$('[data-scene]').forEach(sc => {
    const type = sc.dataset.scene;
    if (type === 'home') {
      const van = $('#h-van', sc), alt = $('#h-alt', sc), flag = $('.flag', sc), rows = $$('.co-row', sc.closest('.herostage') || sc), main = $('#h-route', sc), hb = +main.dataset.b || 0.48;
      const hot = (i) => rows.forEach((r, k) => r.classList.toggle('hot', k === i));
      if (!loop(sc, () => G.timeline({ repeat: -1, repeatDelay: 1.2 })
        .set(alt, { opacity: 0 }).set(main, { opacity: 1 }).call(() => hot(-1))
        .to(van, { motionPath: mp('#h-route', { start: 0, end: hb }), duration: 3, ease: 'power1.inOut' })
        .call(() => hot(1)).fromTo(flag, { scale: 1, transformOrigin: '50% 100%' }, { scale: 1.25, yoyo: true, repeat: 3, duration: 0.25, ease: 'power1.inOut' })
        .call(() => hot(0)).to(alt, { opacity: 1, duration: 0.5 }).to(main, { opacity: 0.35, duration: 0.5 }, '<')
        .to(van, { motionPath: mp('#h-alt'), duration: 2.8, ease: 'power1.inOut' })
        .call(() => hot(2)).to({}, { duration: 1.6 }))) {
        alt.setAttribute('opacity', '1'); if (window.MotionPathPlugin && G) G.set(van, { motionPath: mp('#h-route', { start: hb, end: hb }) }); else { const q = main.getPointAtLength(main.getTotalLength() * hb); van.setAttribute('transform', `translate(${q.x} ${q.y})`); } rows[0]?.classList.add('hot');
      }
    }
    if (type === 'live') {
      if (motion && window.MotionPathPlugin) [['#ld1', '#lr1', 10], ['#ld2', '#lr2', 13], ['#ld3', '#lr3', 15]].forEach(([d, p, s], i) => { const tw = G.to($(d, sc), { motionPath: { path: $(p, sc), align: $(p, sc), alignOrigin: [0.5, 0.5] }, duration: s, ease: 'none', repeat: -1, yoyo: i === 1, delay: -i * 2 }); ST.create({ trigger: sc, onToggle: s2 => s2.isActive ? tw.play() : tw.pause() }); });
      else [['#ld1', '#lr1'], ['#ld2', '#lr2'], ['#ld3', '#lr3']].forEach(([d, p]) => { const r = $(p, sc), q = r.getPointAtLength(r.getTotalLength() * 0.5), c = $(d, sc); c.setAttribute('cx', q.x); c.setAttribute('cy', q.y); });
    }
    if (type === 'route') {
      const van = $('#r-van', sc), stops = $$('.stop', sc), saved = $('.saved', sc), segs = $$('[id^="rs-"]', sc).length;
      const fill = (i, on) => { const s = stops[i]; G.set($('circle', s), { attr: { style: on ? 'fill:var(--ok);stroke:var(--ok);stroke-width:3' : 'fill:var(--surface);stroke:var(--brand);stroke-width:3' } }); G.set($('.sck', s), { opacity: on ? 1 : 0 }); };
      const ok = loop(sc, () => {
        const tl = G.timeline({ repeat: -1, repeatDelay: 1.4 });
        tl.call(() => { stops.forEach((_, i) => fill(i, i === 0)); }).set($$('[id^="rd-"]', sc), { strokeDashoffset: 1 }).set(saved, { opacity: 0, scale: 0.85 });
        for (let i = 0; i < segs; i++) tl.to(van, { motionPath: mp('#rs-' + i), duration: 1.15, ease: 'power1.inOut' }).to('#rd-' + i, { strokeDashoffset: 0, duration: 1.15, ease: 'power1.inOut' }, '<').call(() => fill(i + 1, true)).to({}, { duration: 0.25 });
        return tl.to(saved, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }).to({}, { duration: 1.6 });
      });
      if (!ok) { stops.forEach((_, i) => { $('circle', stops[i]).setAttribute('style', 'fill:var(--ok);stroke:var(--ok);stroke-width:3'); $('.sck', stops[i]).style.opacity = 1; }); $$('[id^="rd-"]', sc).forEach(p => p.style.strokeDashoffset = 0); }
    }
    if (type === 'phone') {
      const cks = $$('.ck', sc), bars = $$('.deal .bar i', sc), deals = $$('.deal', sc), toast = $('.toast', sc), rowsP = $$('.ph-row', sc);
      loop(sc, () => G.timeline({ repeat: -1, repeatDelay: 1.6 })
        .call(() => cks.forEach(c => c.classList.remove('on'))).set(bars, { scaleX: 0 }).set(toast, { y: 24, opacity: 0 }).set(deals, { x: 24, opacity: 0 }).set(rowsP, { x: -14, opacity: 0 })
        .to(rowsP, { x: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'expo.out' })
        .to(deals, { x: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: 'expo.out' }, '-=0.3')
        .to(bars, { scaleX: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .call(() => cks[0].classList.add('on'), null, '+=0.1').call(() => cks[1].classList.add('on'), null, '+=0.5').call(() => cks[2].classList.add('on'), null, '+=0.5')
        .to(toast, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, '+=0.3').to({}, { duration: 2.6 }));
    }
    if (type === 'shelf') {
      const beam = $('.beam', sc), oos = $$('.oos', sc), ring = $('[data-ring]', sc);
      if (!loop(sc, () => G.timeline({ repeat: -1, repeatDelay: 0.8 })
        .set(oos, { opacity: 0.15 }).set(ring, { strokeDasharray: '0 100' })
        .fromTo(beam, { x: 0 }, { x: 460, duration: 2.2, ease: 'power1.inOut' })
        .to(oos, { opacity: 1, duration: 0.3, stagger: 0.18 }, '-=1.6')
        .to(ring, { strokeDasharray: '87.5 100', duration: 1.2, ease: 'power3.out' }, '-=0.6')
        .to(beam, { x: 0, duration: 0.8, ease: 'power2.inOut', opacity: 0 }, '+=1.2').set(beam, { opacity: 0.55 }))) beam.style.display = 'none';
    }
    if (type === 'network') {
      const pts = $$('.pt', sc);
      const paths = ['#nl-0', '#nl-0', '#nl-1', '#nl-1', '#nr-0', '#nr-1', '#nr-2', '#nr-3', '#nr-1', '#nr-3'];
      if (motion && window.MotionPathPlugin) pts.forEach((p, i) => { const tw = G.to(p, { motionPath: { path: $(paths[i], sc), align: $(paths[i], sc), alignOrigin: [0.5, 0.5] }, duration: 2.4, ease: 'none', repeat: -1, delay: (i % 2) * 1.2 + i * 0.1 }); ST.create({ trigger: sc, onToggle: s => s.isActive ? tw.play() : tw.pause() }); });
      else pts.forEach(p => p.style.display = 'none');
    }
  });

  /* product windows (rebuilt from the Trackeys dashboard): drawn at 1200px, scaled to fit, each plays a short loop of real product moments */
  const UW = 1200;
  const numTo = (el, to) => {
    const m = to.match(/^(.*?)(\d[\d,]*\.?\d*)(.*)$/), from = parseFloat(((el.textContent.match(/\d[\d,]*\.?\d*/) || ['0'])[0]).replace(/,/g, ''));
    if (!m || !motion) { el.textContent = to; return; }
    const t = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, o = { v: from };
    G.to(o, { v: t, duration: 0.9, ease: 'power3.out', overwrite: true, onUpdate: () => { el.textContent = m[1] + Number(o.v.toFixed(dec)).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3]; } });
  };
  const segTo = (seg, i, instant) => {
    const tabs = [...seg.children].slice(1), ind = seg.firstElementChild, t = tabs[i];
    tabs.forEach((s, k) => s.classList.toggle('on', k === i));
    if (G && motion && !instant) G.to(ind, { x: t.offsetLeft, width: t.offsetWidth, duration: 0.45, ease: 'expo.out' }); else { ind.style.transform = `translateX(${t.offsetLeft}px)`; ind.style.width = t.offsetWidth + 'px'; }
  };
  const pos = (app, el) => { const a = app.getBoundingClientRect(), r = el.getBoundingClientRect(), s = a.width / UW; return { x: (r.left - a.left + r.width * 0.6) / s, y: (r.top - a.top + r.height * 0.55) / s }; };
  $$('.appfit').forEach(fit => {
    const app = $('.app', fit);
    const size = () => { const s = Math.min(1, fit.clientWidth / UW); app.style.transform = `scale(${s})`; fit.style.height = Math.ceil(app.offsetHeight * s) + 'px'; };
    const ro = new ResizeObserver(size); ro.observe(fit); ro.observe(app); size();
    $$('.ui-seg', app).forEach(sg => { const at = () => segTo(sg, [...sg.children].slice(1).findIndex(s => s.classList.contains('on')), true); at(); document.fonts?.ready.then(at); });
  });
  if (motion) $$('[data-shot]').forEach(s => { G.set(s, { y: 40, opacity: 0 }); ST.create({ trigger: s, start: 'top 88%', once: true, onEnter: () => G.to(s, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' }) }); });
  $$('.app[data-ui]').forEach(app => {
    const type = app.dataset.ui, pop = (el) => motion && G.fromTo(el, { scale: 0.82 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
    const setPill = (el, t, c) => { el.textContent = t; el.className = 'upl ' + c; };
    if (type === 'dash') {
      const seg = $('.ui-seg', app), vals = $$('[data-v]', app).filter(e => !(e instanceof SVGElement)), gfg = $('.g-fg', app), line = $('.c-line', app), area = $('.c-area', app), rows = $$('.cki .tr:not(.th)', app), bars = $$('.j-bar i', app);
      const LV = JSON.parse(line.dataset.v), AV = JSON.parse(area.dataset.v), GV = JSON.parse(gfg.dataset.v);
      const period = (p) => {
        segTo(seg, p); vals.forEach(e => numTo(e, JSON.parse(e.dataset.v)[p]));
        G.to(gfg, { strokeDasharray: GV[p] + ' 100', duration: 1, ease: 'power3.out' });
        line.setAttribute('d', LV[p]); area.setAttribute('d', AV[p]);
        G.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }); G.fromTo(area, { opacity: 0 }, { opacity: 1, duration: 0.8 });
      };
      loop(app, () => G.timeline({ repeat: -1 })
        .set(rows, { opacity: 0, x: -10 }).set(bars, { scaleX: 0 }).call(() => period(0))
        .to(bars, { scaleX: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0.2)
        .to(rows, { opacity: 1, x: 0, stagger: 0.18, duration: 0.5, ease: 'expo.out' }, 0.4)
        .call(() => period(1), null, 3.2).call(() => period(2), null, 6.4).to({}, { duration: 3.6 }, 6.4));
    }
    if (type === 'route') {
      const nr = $('.tr.new', app), pn = $('.upl', nr), btn = $('.ui-btn.p', app), cur = $('.ui-cursor', app), rows = $$('.rp .tr:not(.th):not(.new)', app), rt = $('.m-route', app), stops = $$('.m-stop', app), chip = $('.m-chip', app);
      loop(app, () => G.timeline({ repeat: -1, repeatDelay: 0.6 })
        .call(() => setPill(pn, 'Pending', 'warn'))
        .set(nr, { opacity: 0 }).set(rows, { opacity: 0, y: 8 }).set(rt, { strokeDashoffset: 1 }).set(stops, { scale: 0, transformOrigin: '50% 50%' }).set(chip, { opacity: 0, y: 8 }).set(cur, { opacity: 0, x: 980, y: 420 })
        .to(rows, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'expo.out' })
        .to(cur, { opacity: 1, duration: 0.2 }, '+=0.2')
        .to(cur, { x: () => pos(app, btn).x, y: () => pos(app, btn).y, duration: 0.9, ease: 'power3.inOut' })
        .call(() => btn.classList.add('press')).call(() => btn.classList.remove('press'), null, '+=0.16')
        .fromTo(nr, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' })
        .to(cur, { opacity: 0, x: '+=40', y: '+=60', duration: 0.5 }, '<')
        .to(rt, { strokeDashoffset: 0, duration: 2, ease: 'power1.inOut' })
        .to(stops, { scale: 1, duration: 0.35, stagger: 0.32, ease: 'back.out(2.4)' }, '<')
        .to(chip, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' })
        .call(() => { setPill(pn, 'Approved', 'ok'); pop(pn); }, null, '+=0.6')
        .to({}, { duration: 3 }));
    }
    if (type === 'orders') {
      const row = $('.tr.cur', app), st = $('.ost .upl', row), pay = $('.pay .upl', row), flows = $$('.o-st', app), rows = $$('.or .tr:not(.th):not(.cur)', app);
      const STG = [['Ordered', 'n'], ['Confirmed', 'b'], ['Assigned to Driver', 'b'], ['Out for Delivery', 'warn'], ['Delivered', 'ok']];
      const stage = (i) => { setPill(st, ...STG[i]); pop(st); flows.forEach((f, k) => f.classList.toggle('on', k === i)); const b = $('b', flows[i]); numTo(b, String(+b.dataset.n + 1)); if (i) { const p = $('b', flows[i - 1]); numTo(p, p.dataset.n); } };
      loop(app, () => {
        const tl = G.timeline({ repeat: -1, repeatDelay: 0.8 })
          .call(() => { setPill(pay, 'Pending', 'warn'); flows.forEach(f => { const b = $('b', f); b.textContent = b.dataset.n; }); })
          .set(rows, { opacity: 0, y: 8 }).set(row, { opacity: 0 })
          .to(rows, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'expo.out' }).to(row, { opacity: 1, duration: 0.4 }).call(() => stage(0));
        for (let i = 1; i < STG.length; i++) tl.call(() => stage(i), null, '+=1.1');
        return tl.call(() => { setPill(pay, 'Paid', 'ok'); pop(pay); }, null, '+=0.5').to({}, { duration: 2.6 });
      });
    }
    if (type === 'shops') {
      const row = $('.tr.scan', app), sc = $('.sc .upl', row), scs = $$('.shp .tr:not(.th):not(.scan) .sc .upl', app), rows = $$('.shp .tr:not(.th)', app), ring = $('.cring .g-fg', app), rv = $('.r-v', app), tyn = $$('.tyn', app);
      const finals = scs.map(s => s.textContent), tyF = tyn.map(t => t.textContent);
      loop(app, () => G.timeline({ repeat: -1, repeatDelay: 0.8 })
        .call(() => { setPill(sc, 'Scanning…', 'b'); scs.forEach(s => s.textContent = '…'); rv.textContent = '…'; tyn.forEach(t => t.textContent = '…'); })
        .set(rows, { opacity: 0, y: 8 }).set(ring, { strokeDasharray: '0 100' })
        .to(rows, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'expo.out' })
        .call(() => { scs.forEach((s, i) => numTo(s, finals[i])); numTo(rv, '91%'); tyn.forEach((t, i) => numTo(t, tyF[i])); })
        .to(ring, { strokeDasharray: '91 100', duration: 1.2, ease: 'power3.out' }, '<')
        .call(() => { setPill(sc, '62.5%', 'bad'); pop(sc); }, null, '+=1.6')
        .to({}, { duration: 3.2 }));
    }
    if (type === 'districts') {
      const ds = $$('.dist:not(.free)', app), ags = $$('.agent', app), byA = ags.map((_, a) => ds.filter(d => +d.dataset.a === a));
      const hot = (a) => ags.forEach((x, k) => x.classList.toggle('hot', k === a));
      loop(app, () => {
        const tl = G.timeline({ repeat: -1, repeatDelay: 0.6 }).call(() => hot(-1)).set(ds, { fillOpacity: 0, strokeOpacity: 0.2 }).set(ags, { opacity: 0, x: -10 })
          .to(ags, { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'expo.out' });
        byA.forEach((g, a) => tl.call(() => hot(a)).to(g, { fillOpacity: 0.42, strokeOpacity: 1, stagger: 0.12, duration: 0.4, ease: 'power2.out' }).to({}, { duration: 0.3 }));
        return tl.call(() => hot(-1)).to({}, { duration: 2.6 });
      });
    }
  });

  /* demo form: Continue enables once the required fields are valid (as on the live site) */
  const form = $('#demo-form');
  if (form) {
    const steps = $$('[data-step]', form), bar = $('.progress i', form), btn1 = $('[data-step="1"] button[type=submit]', form);
    const req = ['name', 'email', 'company'].map(id => $('#' + id, form));
    const valid = () => req.every(f => f.value.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email', form).value.trim());
    form.addEventListener('input', () => { btn1.disabled = !valid(); });
    $('#email', form).addEventListener('blur', e => { const v = e.target.value.trim(); const bad = v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); e.target.setAttribute('aria-invalid', String(!!bad)); $('#email-err').textContent = bad ? 'Enter an email like jane@company.com.' : ''; });
    const show = (n) => {
      steps.forEach(s => s.hidden = +s.dataset.step !== n); if (bar) bar.style.transform = `scaleX(${n === 1 ? 0.5 : 1})`;
      const s = steps[n - 1]; if (G && !reduce) G.fromTo(s, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' });
      const h = $('h2', s); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    };
    const cal = $('#cal');
    const buildCal = () => { cal.innerHTML = ''; const d = new Date(); let n = 0; while (n < 5) { d.setDate(d.getDate() + 1); if (d.getDay() === 0 || d.getDay() === 6) continue; const wd = d.toLocaleDateString('en-GB', { weekday: 'short' }), dm = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); cal.insertAdjacentHTML('beforeend', `<div class="pick"><input type="radio" name="day" id="d-${n}" value="${wd} ${dm}"><label for="d-${n}"><span>${wd}</span><b>${dm}</b></label></div>`); n++; } };
    form.addEventListener('submit', e => {
      e.preventDefault(); const at = steps.find(s => !s.hidden).dataset.step;
      if (at === '1' && valid()) { buildCal(); show(2); }
      else if (at === '2') { const d = $('input[name=day]:checked', form), t = $('input[name=time]:checked', form); if (!d || !t) { (d ? $('input[name=time]', form) : $('input[name=day]', form)).focus(); return; } $('#when').textContent = d.value + ' · ' + t.value; show(3); say("You're booked."); }
    });
    $('[data-back]', form)?.addEventListener('click', () => show(1));
  }

  addEventListener('load', () => ST && ST.refresh());
})();
