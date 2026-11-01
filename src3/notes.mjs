// Design notes for the visual overhaul (V3 + V4 product UI pass). English working document.
export default function notes() {
  const rows = (r) => r.map(c => `<tr>${c.map(x => `<td>${x}</td>`).join('')}</tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Trackeys Overhaul Notes</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300..800&display=swap">
<style>:root{--bg:#fbfcfe;--fg:#0a0f1c;--mu:#5d6880;--ln:#e3e8f0;--ac:#3641f5;--card:#fff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#06080d;--fg:#eef2f8;--mu:#9aa7ba;--ln:#1f2a3a;--ac:#9cb9ff;--card:#0d121b;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#06080d;--fg:#eef2f8;--mu:#9aa7ba;--ln:#1f2a3a;--ac:#9cb9ff;--card:#0d121b;color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--fg);font:400 16px/1.6 "Outfit",system-ui,sans-serif}
.d{max-width:980px;margin:0 auto;padding:40px max(20px, env(safe-area-inset-right, 0px)) 80px max(20px, env(safe-area-inset-left, 0px))}
h1{font-size:2.4rem;letter-spacing:-.02em;line-height:1.05;margin:8px 0 12px}h2{font-size:1.4rem;margin:48px 0 10px;padding-top:22px;border-top:1px solid var(--ln)}
.e{font:500 11px/1 "Outfit",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--ac)}p,li{max-width:72ch;color:var(--mu)}b{color:var(--fg)}a{color:var(--ac)}
.t{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--card)}table{border-collapse:collapse;width:100%;min-width:620px;font-size:.9rem}td{padding:9px 12px;border-top:1px solid var(--ln);vertical-align:top}tr:first-child td{border-top:0;font:600 10px/1.3 "Outfit",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--mu)}</style></head>
<body><div class="d"><p><a href="index.html">← Back to the prototype</a></p><span class="e">Design notes · 26 Oct 2026 · V4 29 Oct 2026</span><h1>Visual overhaul of trackeys.com</h1>
<p>This version keeps the live site's <b>words and page structure exactly</b>: same pages, same section order, same headlines, cards, FAQs, prices, posts and case studies, crawled on 25–26 Oct 2026. Only the presentation is new. The copy check in the build fails if any headline, FAQ answer, post paragraph or case-study line is missing or altered.</p>

<h2>V4 · the product's own UI language</h2>
<p>V4 takes the Trackeys dashboard (pav.trackeys.com, reviewed 29 Oct 2026 across all 36 menu pages) and uses it wherever the site shows the product. The marketing site and the app now look like one company.</p>
<div class="t"><table>${rows([['Taken from the dashboard', 'Where it is used'],
['Outfit typeface, #465FFF blue, TailAdmin grays (#F9FAFB, #E4E7EC, #101828)', 'Every page: replaces Inter Tight / JetBrains Mono and the old #2A8BFF'],
['Navy #161950 with the faint square grid from the sign-in panel', 'Dark outcome bands, CTA bands, and the sign-in page (squares softly light up)'],
['Soft status pills (green / amber / red / gray / blue)', 'All tags site-wide, and every status inside the product windows'],
['Collapsed icon sidebar, top bar, metric cards with icon chip and delta pill, period switch, Delivery / Pre-Sale / Merchandising tabs, delivered gauge, order journey bar, order statistics chart, driver check-ins', 'Home: full dashboard window under the hero; tilts flat as you scroll; cycles Today → This Week → This Month and every figure, the gauge and the chart follow'],
['Route Plans table + Generate Route Plan', 'Delivery & Routing, Logistics: a cursor clicks Generate, a Pending row appears, the route draws on the map stop by stop, the row turns Approved'],
['Orders table, the 11 order statuses, payment status', 'Sales Force Automation, FMCG: a new order walks Ordered → Confirmed → Assigned to Driver → Out for Delivery → Delivered with the stage counters, then payment turns Paid'],
['Shops with Compliance Score, Task Types (Shelf Occupancy, Empty Seals Detection, Planogram Audit)', 'Merchandising AI: scores count up, the average ring fills, one shop scans and lands at 62.5% (red)'],
['Assign Districts: region / city, shop and merchandiser counts, agent cards, district map', 'Distribution (product and solution): each merchandiser lights up in turn and their districts fill on the map'],
['Dashboard (Delivery tab)', 'Fleet Management solution']])}</table></div>
<p><b>Data.</b> The live dashboard holds real client records (shop owners, phone numbers, addresses). None of it is used. Every name, code, district assignment and figure in the windows is sample data. District names are public Jeddah neighbourhoods. Turn on review notes to see this flagged on each window.</p>
<p><b>Not used.</b> Master data, users and roles, approval workflows, webhooks, subscriptions, payment histories, activity logs and settings: these are admin tables with nothing to show a buyer. Reports is a three-card launcher with emoji icons, so it adds nothing visually.</p>
<p><b>Maps.</b> Every map is now a real Saudi street map built from OpenStreetMap data (downloaded 29 Oct 2026): Riyadh around Al Olaya, King Fahd Road and Al Uruba Road for the home, live, routing, rep and network scenes and the Route Plans window, and Jeddah with its real district boundaries (Al Rawdah, Al Salamah, Al Zahra and neighbours) for Assign Districts. Each van route is computed along real roads between its stops, and the re-route on the home page detours around the blocked stretch. Streets, buildings and parks come as a light and a dark image that swap with the theme. Street and district names are drawn in the site font. Map data © OpenStreetMap contributors (ODbL); the credit sits on each map. The generator is <code>src3/map/render.py</code>.</p>
<p><b>Copy vs. map.</b> The live site's copy around the maps names Dubai places (lat 25.197 · lng 55.274, DXB route codes, Al Barsha); amounts are shown in SAR. The copy is kept verbatim, so it now sits on a Riyadh map. Either localise the copy or pick a Dubai map before launch.</p>
<p><b>Anti-slop pass (29 Oct).</b> An Impeccable critique (independent design review plus detector, 17/32) found the site generic below the hero. Fixed without touching copy or section order:</p>
<ul>
<li><b>Cards and stats:</b> capability cards are now typographic spec blocks, not keyword-picked filler art. Hero stats are a quiet row, and the outcomes band is the one big-number moment.</li>
<li><b>Labels and tiles:</b> eyebrows are plain labels instead of chips. Icon tiles are gone from roles, add-ons and case studies, and integrations are names instead of monograms.</li>
<li><b>Motion:</b> "How it works" is a static sequence, not a scroll-jacked pin. The tilt reveal, magnetic buttons, marquees and pulsing dots are gone.</li>
<li><b>Decoration:</b> button glows, radial halos, hero grid and the CTA swoosh are replaced by the product's own navy street-grid squares, and the logo now sits on its navy tile.</li>
<li><b>Fixes:</b> the mobile menu opens below the header and gains a close icon. Heading order, label sizes, the disabled button, the visible password label and the blog avatars are corrected.</li>
</ul>
<p>Detector hits went from 669 to about 330. The ones left are intentional: the brand grid motif, the Copilot thinking dots, the dashboard mockups (card-in-card, small labels), the week labels on the pricing timeline, and em-dashes in live-site copy.</p>
<p><b>Integration logos.</b> Each stack is now an always-scrolling strip of the real tool logos (requested 29 Oct; it reverses the earlier no-marquee call for this one section). Logos sit on white tiles so brand colours hold in both themes, sized to equal visual area, with the one-line description underneath. The tool name is carried by the logo and its alt text. The strip pauses on hover, and with reduced motion it becomes a static grid. Sources: Wikimedia Commons, Simple Icons (Shell) and the vendors' own websites (Samsara, Geotab, Circana, Blue Yonder, Fleetio, Motive, Manhattan, WEX). They are trademarks of their owners; showing them implies an integration, so confirm each connector exists, or get partner approval, before launch.</p>
<p><b>Small screens.</b> Each window is drawn at 1,200 px and scaled to fit like a screenshot, so it stays faithful to the product rather than reflowing into something the app never shows.</p>

<h2>What's new</h2>
<div class="t"><table>${rows([['Layer', 'Before (live site)', 'Now'],
['Themes', 'Light only', 'Light and dark from one token set; header toggle, remembered, no flash on load'],
['Imagery', 'No photography', 'Photo cards for industries, the resources feature and CTA bands (interim Unsplash, graded as one set)'],
['Graphics', 'Dark data panels and monogram tiles', 'Simple two-tone illustrations: a city map with a moving van, a route with stops, a rep\'s phone, a shelf scan, a distribution network. They carry the same labels as the live visuals, nothing extra'],
['Cards', 'Icon + title + text, same everywhere', 'Each capability card gets a small scene (route draws, pin pulses, shelf scans, bars grow); cursor-following glow and lift on hover'],
['Scrolling', 'Native', 'Lenis smooth scroll synced with GSAP ScrollTrigger'],
['How it works', 'Six equal boxes', 'Pinned horizontal scroll with a progress bar (desktop); vertical cards on phones'],
['Integrations', 'Static monogram grid', 'Slow marquee that pauses on hover'],
['Pricing', 'Static', 'Currency switch with blur swap; working ROI calculator using the live site\'s formula; animated border on the popular tier'],
['Navigation', 'Hover menus', 'Disclosure menus that open from the trigger with icons; header hides on scroll down and returns on scroll up; soft page-to-page fade']])}</table></div>

<h2>Motion spec</h2>
<div class="t"><table>${rows([['Element', 'Why it moves', 'How'],
['Headline reveal', 'First impression', 'Words rise out of a mask, 60 ms stagger, 1 s expo-out, once on load'],
['Hero scenes', 'Explain the product in one glance', 'GSAP timelines: the van drives, a stop flags, the green re-route draws and the van takes it; route stops tick as the van passes; shelf beam sweeps and the score ring fills; network particles flow. Loops pause off-screen'],
['Section reveals', 'Prevent jarring arrival', 'Only content below the fold starts offset (24 px, fade); ScrollTrigger batch with 80 ms stagger. Above-the-fold content is never hidden'],
['Numbers', 'Explanation', 'Count up once from 0 to the live value when visible'],
['Industry photos', 'Depth', 'Gentle parallax (±8%) scrubbed to scroll'],
['Buttons', 'Feedback', 'Press scale .97, arrow nudge, one-pass sheen; primary CTAs are slightly magnetic (max 8 px) on fine pointers'],
['Tabs and filters', 'Spatial consistency', 'Sliding pill indicator (GSAP, 0.45 s); panels cross-fade with a short rise'],
['Accordions', 'Preventing jarring change', 'Height animates with CSS interpolate-size; icon rotates to ×'],
['Reduced motion', 'Accessibility', 'No smooth scroll, no loops, no reveals or parallax: every scene shows its finished state. Controls still work']])}</table></div>

<h2>Flags kept for review</h2>
<p>Turn on <b>Show review notes</b> in the dark bar. It marks content that comes from the live site but can't be verified (customer logos, case studies and named quotes, unsourced percentages, blog authors, the integration list, prices and trial terms), plus places where the live site has no destination ("How the model works", Documentation, Security, Terms, Cookies, Fleet Management and Integrations in the footer). The "Watch 2-min overview" and "Download datasheet" buttons were removed on 1 Nov 2026, and prices switch between USD, SAR and EUR (SAR at the 3.75 peg). Two deliberate changes: the footer's Privacy link now opens the existing policy page (the live site links it to #), and the demo form's step 2 (calendar) and confirmation use minimal new copy, because the live step 2 can't be seen without sending a real request.</p>

<h2>Not in this version</h2>
<p>Arabic: the live site is English only, so this pass is English only. The bilingual narrative prototype remains at its own link. The reset-password page (still the TailAdmin template) is left out.</p>

<h2>Photography</h2>
<p>Interim photos from Unsplash (free licence), graded slightly cool with reduced saturation. They depict no Trackeys customer. Replace them with a commissioned shoot before launch.</p>
</div></body></html>`;
}
