// Assembles the live trackeys.com copy (crawled 25–26 Oct 2026) into one content file. Text is verbatim.
const fs = require('fs'); const J = (f) => JSON.parse(fs.readFileSync('orig/json/' + f + '.json'));
const S = JSON.parse(fs.readFileSync('orig/special.json')); const X = JSON.parse(fs.readFileSync('orig/_extra.json'));
const cap = (s) => s ? s.charAt(0) + s.slice(1).toLowerCase() : s;
const sec = (d, i) => d.sections[i];
const page = (slug) => {
  const d = J(slug); const h = d.hero;
  const [caps, how, out, stack, faqS, cta] = d.sections;
  return {
    eyebrow: h.eyebrow, h1: h.h1, p: h.p, stats: h.stats, visual: (h.visual[0] || {}).text || [],
    caps: { eyebrow: caps.eyebrow, h2: caps.h2, sub: caps.sub, items: caps.items.map(i => ({ title: i.title, desc: i.desc, bullets: i.bullets })) },
    how: { eyebrow: how.eyebrow, h2: how.h2, sub: how.sub, steps: how.items.map(i => ({ n: i.lines[0], title: i.lines[1], desc: i.lines.slice(2).join(' ') })) },
    outcomes: { eyebrow: out.eyebrow, h2: out.h2, items: out.items.map(i => ({ v: i.lines[0], k: i.lines[1], d: i.lines[2] })) },
    stack: { eyebrow: stack.eyebrow, h2: stack.h2, sub: stack.sub, items: stack.items.map(i => ({ mono: i.lines[0], name: i.lines[1], desc: i.lines[2] })) },
    faq: { eyebrow: faqS.eyebrow, h2: faqS.h2, items: d.faq },
    cta: { h2: cta.h2, p: cta.sub }
  };
};
const home = J('home');
const roles = {};
for (const [k, v] of Object.entries(X.roles)) roles[k] = v.split('\n').slice(v.split('\n').indexOf('Merchandiser') + 1);
const pr = J('pricing');
const card = (lines) => ({ tag: lines[0], title: lines[1], desc: lines[2], meta: lines[3] });
const dump = (f) => fs.readFileSync('orig/' + f + '.html', 'utf8');
const blogCards = [...dump('blog').matchAll(/<a href="(\/blog\/[^"]+)"><article><div>([^<]+)<h3>([^<]+)<\/h3> <p>([^<]+)<\/p> <div>([^<]+)<span>([^<]+)<\/span>/g)].map(m => ({ href: m[1].replace('/blog/', ''), cat: m[2].trim(), title: m[3], excerpt: m[4], meta: (m[5] + m[6]).replace(/\s+/g, ' ').trim() }));
const caseCards = [...dump('case-studies').matchAll(/<a href="\/case-studies\/([^"]+)"><article><div>Customer stories <h3>([^<]+)<\/h3> <p>([^<]+)<\/p> ([^<]+)<\/div>/g)].map(m => ({ slug: m[1], title: m[2], desc: m[3], meta: m[4].trim() }));
const un = (s) => s.replace(/&amp;/g, '&');
const out = {
  nav: { Product: X.menus.Product, Solutions: X.menus.Solutions, Resources: X.menus.Resources },
  footer: { desc: 'AI-enhanced sales force tracking & automation. Every field activity, visible.', legal: '© 2026 Koraspond Technologies. Trackeys is a Koraspond product.' },
  home: {
    badge: 'Field-ops AI · model v5', h1a: 'Field ops', h1b: 'that think', h1c: 'ahead.',
    p: home.hero.p, ctas: ['Book a demo', 'How the model works'],
    copilot: { title: 'Trackeys Copilot', status: 'thinking · 23 signals/s', rows: [['RE-OPTIMIZE', 'route DXB-N-03', '−14 min · −8 km'], ['FLAG', 'stockout risk', 'LuLu Al Barsha · 2h'], ['SCORE', 'planogram audit', 'Carrefour MBZ · 87.5%']], stats: [['Decisions', '1,284'], ['Accepted', '94%'], ['Saved', '$42k']] },
    live: { eyebrow: 'Live', h2: sec(home, 0).h2, sub: sec(home, 0).sub, map: ['LIVE · 38 field units', 'lat 25.197 · lng 55.274'], kpis: [['DIFOT', '96.2%', '▲ +2.1'], ['Active routes', '14', ''], ['Avg ETA drift', '−3m', ''], ['CFR', '98.8%', '▲ +0.4']], roleLabel: 'View as role', roles },
    trusted: { label: 'Trusted by field operations teams across globe', logos: ['halagaty', 'sheel', 'petrolube'] },
    stats: [['25%', 'lower operational cost', 'AI optimization across routes, inventory & visits'], ['95%', 'on-time delivery', 'Real-time DIFOT tracking at every stop'], ['20%', 'higher task completion', 'AI-assisted workflows for every role'], ['99.5%', 'inventory accuracy', 'Live sync across depots, vans and distributors']],
    caps: { eyebrow: 'Capabilities', h2: sec(home, 1).h2, items: sec(home, 1).items.map(i => ({ tag: i.lines.length > 2 ? i.lines[0] : '', title: i.title, desc: i.desc })) },
    roles: { eyebrow: 'By role', h2: sec(home, 2).h2, items: sec(home, 2).items.map(i => ({ title: i.lines[0], desc: i.lines[1] })) },
    industries: { eyebrow: 'By industry', h2: sec(home, 3).h2, items: sec(home, 3).items.map((i, k) => ({ title: i.title, desc: i.desc, chips: i.lines.slice(2), href: ['/solutions/fmcg', '/solutions/logistics', '/solutions/fleet', '/solutions/distribution'][k] })) },
    cta: { h2: sec(home, 4).h2, p: sec(home, 4).sub, ctas: ['Book a demo', 'Watch 2-min overview'] }
  },
  products: { 'sales-force-automation': page('product__sales-force-automation'), 'delivery-routing': page('product__delivery-routing'), 'merchandising-ai': page('product__merchandising-ai'), distribution: page('product__distribution') },
  solutions: { fmcg: page('solutions__fmcg'), logistics: page('solutions__logistics'), distribution: page('solutions__distribution'), fleet: page('solutions__fleet') },
  pricing: {
    eyebrow: 'Pricing', h1: pr.hero.h1, p: pr.hero.p, curLabel: 'Show prices in', currencies: ['USD', 'AED', 'EUR'], rates: { USD: 1, AED: 3.67, EUR: 0.92 },
    tiers: S.pricing.tiers.map((t, i) => { const L = t.lines; const pop = L[0] === 'MOST POPULAR'; const o = pop ? 1 : 0; return { popular: pop ? 'Most popular' : '', name: L[o], desc: L[o + 1], price: i === 2 ? null : [29, 79][i], priceLabel: i === 2 ? L[o + 2] : null, per: 'per user / month', billed: L[o + 3], cta: L[o + 4], incLabel: ["What's included", 'Everything in Starter, plus', 'Everything in Growth, plus'][i], li: t.li }; }),
    addons: { eyebrow: 'Add-ons', h2: sec(pr, 0).h2, sub: sec(pr, 0).sub, items: sec(pr, 0).items.map(i => ({ name: i.lines[0], desc: i.lines[1], usd: parseFloat(i.lines[2].replace(/[$,]/g, '')), unit: i.lines[3] })) },
    compare: { eyebrow: 'Compare', h2: 'Full feature comparison.', sub: 'Every capability, line by line, across the three tiers.', cols: ['Feature', 'Starter', 'Growth', 'Enterprise'], groups: [
      ['Sales Force Automation', [['Visits / month', '5,000', '50,000', 'Unlimited'], ['Pre-sales & van sales', 1, 1, 1], ['Offline-first mobile app', 1, 1, 1], ['AI sales copilot', 0, 1, 1], ['Territory planning AI', 0, 1, 1]]],
      ['Delivery & Routing', [['Real-time GPS tracking', 1, 1, 1], ['Proof-of-delivery workflows', 1, 1, 1], ['AI multi-factor routing', 'Basic', 'Full', 'Full + custom'], ['Dynamic re-routing', 0, 1, 1], ['Customer tracking page', 0, 1, 1]]],
      ['Merchandising AI', [['Shelf scans / month', 0, '10,000', 'Unlimited'], ['Planogram compliance', 0, 1, 1], ['Share-of-shelf analytics', 0, 1, 1], ['Custom model training', 0, 0, 1]]],
      ['Distribution & DMS', [['Distributor portal', 0, 1, 1], ['AI demand forecasting', 0, 1, 1], ['Secondary sales tracking', 0, 1, 1], ['Trade spend management', 0, 0, 1]]],
      ['Platform & Support', [['Users', '5–25', '15–500', 'Unlimited'], ['Role-based dashboards', '3 roles', 'All roles', 'Custom roles'], ['API access', 0, 1, 1], ['Integrations included', 0, '3', 'Unlimited'], ['SSO / SCIM', 0, 0, 1], ['Audit logs', 0, 'Standard', 'Advanced'], ['Uptime SLA', '99.5%', '99.9%', '99.95%'], ['Support', 'Email', 'Priority · 4h SLA', 'Dedicated CSM'], ['Onboarding', 'Self-serve', 'Guided', 'White-glove']]]] },
    roi: { eyebrow: 'ROI Calculator', h2: sec(pr, 2).h2, sub: sec(pr, 2).sub, inputs: [['Field reps', 'people', 5, 500, 1, 25], ['Visits per rep / day', 'visits', 4, 30, 1, 12], ['Avg revenue per visit', 'USD', 10, 500, 5, 40]], outputs: ['Estimated annual ROI', 'Monthly benefit', 'Growth-tier cost', 'Payback period', 'Multiple on spend'], note: 'Estimates based on customer-reported outcomes. Actual results depend on adoption, team size and industry.' },
    impl: { eyebrow: 'Implementation', h2: sec(pr, 3).h2, sub: sec(pr, 3).sub, steps: sec(pr, 3).items.map(i => ({ n: i.lines[0], when: cap(i.lines[1]).replace(/^Weeks? /, m => m), title: i.lines[2], desc: i.lines[3] })) },
    faq: { eyebrow: 'FAQ', h2: sec(pr, 4).h2, items: pr.faq }, cta: { h2: sec(pr, 5).h2, p: sec(pr, 5).sub }
  },
  demo: {
    eyebrow: 'Book a demo', h1: 'See Trackeys on your data. In 30 minutes.', p: "Live walkthrough tailored to your industry. Bring a sample of your stores, SKUs or routes — we'll load it and show you what Trackeys surfaces.",
    promises: [['30 minutes, tailored to you', 'We set up a demo on your industry and workflows — not a canned script.'], ['See your data, not lorem ipsum', "Bring a CSV of stores, SKUs or reps. We'll show live insights within minutes."], ['Meet a specialist, not a BDR', "You talk to someone who's rolled out Trackeys — not a qualifier."], ['Leave with a pilot plan', 'A concrete next-step proposal in your inbox within 24 hours.']],
    step: 'Step 1 of 2', formH: 'Tell us about your team.', fields: [['name', 'Full name *', 'Jane Smith'], ['email', 'Work email *', 'jane@company.com'], ['company', 'Company *', 'Acme FMCG'], ['phone', 'Phone', '+971 50 000 0000'], ['country', 'Country'], ['industry', 'Industry'], ['size', 'Team size'], ['tools', 'Current tools (optional)', 'e.g. SAP, Salesforce, Excel, custom app'], ['hope', 'What are you hoping to see?', 'Pain points, goals, must-haves...']],
    countries: S.demo.selects[0].slice(1), industries: S.demo.selects[1].slice(1), sizes: S.demo.selects[2].slice(1), cont: 'Continue to calendar →', choose: 'Select...',
    stats: [['+15%', 'sales per visit'], ['−20%', 'delivery delays'], ['+20%', 'merch compliance'], ['30 min', 'avg demo length']],
    trusted: { label: 'Trusted by teams running field operations at scale', names: ['Gulf Beverages', 'Patil Foods', 'Savannah Logistics', 'Al-Riyadh Bevco', 'Cairo Pharma', 'Nusantara Dairy'] },
    faq: { eyebrow: 'FAQ', h2: 'What to expect from the demo.', items: [['How long is the demo?', '30 minutes for the standard demo. We reserve an optional 15-minute buffer for Q&A.'], ['Who should join from our side?', 'Ideally 2–3 people: the operational owner (sales/ops/distribution), a tech stakeholder, and a decision-maker. We adapt content to the attendees.'], ['Can we see it on our own data?', "Yes. Send a sample (CSV, Excel, or a read-only export) 24 hours ahead and we'll load it into a sandbox before the call."], ['Is there a commitment?', 'None. No credit card, no NDA required for the demo. If you want to pilot, we sign a lightweight mutual NDA and a pilot-scope doc.']] }
  },
  resources: { eyebrow: 'Resources', h1: 'Field ops, distribution and AI — without the consultant-speak.', p: 'Articles, case studies and playbooks from the people building Trackeys — and the teams running it.', featured: 'Featured', startHere: 'Start here.', recent: 'Recent articles', viewAll: 'View all →', stories: 'Customer stories', allStories: 'All stories →', cta: { h2: 'See Trackeys on your data. 30 minutes, tailored to your team.' } },
  blog: { eyebrow: 'Blog', h1: 'Ideas from the field.', p: 'Articles on distribution, AI in FMCG, merchandising and how our customers actually use Trackeys.', filters: ['All', 'Distribution', 'AI in FMCG', 'Merchandising', 'Customer stories'], cards: blogCards, cta: { h2: 'Ideas are great. Execution is better. Book a demo.' } },
  posts: Object.fromEntries(Object.entries(S.posts).map(([k, v]) => { const H = v.head; const card = blogCards.find(c => c.href === k); return [k, { back: '← All articles', cat: card.cat, title: H[2], sub: H[3], initials: H[4], author: H[5], role: H.length === 8 ? H[6] : '', date: H[H.length - 1], body: v.body, keep: 'Keep reading', cta: { h2: 'Turn the ideas into outcomes. Book a 30-minute demo.' } }]; })),
  cases: { eyebrow: 'Case studies', h1: 'Real teams. Real numbers. Real outcomes.', p: 'What our customers did with Trackeys — and the measurable results that followed.', cards: caseCards, cta: { h2: "Your story is next. Let's build it." } },
  caseDetail: Object.fromEntries(Object.entries(S.cases).map(([k, v]) => { const L = v.quote; const qi = L.findIndex(x => /^“/.test(x)); const card = caseCards.find(c => c.slug === k); return [k, { back: '← All case studies', meta: card.meta, title: v.head[1], p: v.head[2], company: v.stats[0].join(' '), stats: v.stats.slice(1), blocks: ['Challenge', 'Solution', 'Outcome'].map(t => [t, L[L.findIndex(x => x.toUpperCase() === t.toUpperCase()) + 1]]), quote: L[qi].replace(/^“\s*|\s*”$/g, ''), by: L[qi + 1].replace(/^—\s*/, ''), more: 'More customer stories', cta: { h2: 'Your story is next. Book a demo.' } }]; })),
  privacy: { title: 'Privacy Policy', version: 'Version 2026-06', body: [...un(dump('privacy-policy')).matchAll(/<(h2|p)>([\s\S]*?)<\/\1>/g)].map(m => [m[1], m[2].replace(/<a href="mailto:([^"]+)">[^<]+<\/a>/, '$1').replace(/\s+\./, '.')]).filter(x => x[1] !== 'Version 2026-06') },
  signin: { h1: 'Sign In', p: 'Enter your email and password to sign in!', email: 'Email', emailPh: 'Enter your email address', passPh: 'Enter your password', btn: 'Sign In', side: 'Trackeys is an end-to-end platform designed to streamline and optimize delivery management operations for businesses.' },
  common: { ctaP: "Book a 30-minute walkthrough with our field-ops team. We'll map Trackeys to your territory, fleet and KPIs.", demo: 'Book a demo', watch: 'Watch 2-min overview', datasheet: 'Download datasheet', signin: 'Sign in' }
};
fs.writeFileSync('src3/content.json', JSON.stringify(out, null, 1));
console.log('pages', Object.keys(out.products).length + Object.keys(out.solutions).length, 'posts', Object.keys(out.posts).length, 'cases', Object.keys(out.caseDetail).length, 'blog cards', blogCards.length, 'case cards', caseCards.length);
console.log(JSON.stringify(out.home.live.roles).slice(0, 900)); console.log(JSON.stringify(out.pricing.tiers[1]).slice(0, 400)); console.log(JSON.stringify(out.pricing.impl)); console.log(JSON.stringify(out.caseDetail['gulf-beverages'])); console.log(JSON.stringify(out.privacy.body).slice(0, 500)); console.log(JSON.stringify(out.home.caps.items[0]), JSON.stringify(out.home.industries.items[0]));
