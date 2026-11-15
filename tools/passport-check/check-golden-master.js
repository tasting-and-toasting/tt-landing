// SITE-PASSPORT-GOLDEN-MASTER-01: live-data check of the public passports against the Golden Master.
// Serve the repo root:  python3 -m http.server 8765 --bind 127.0.0.1
// Run:                  PLAYWRIGHT=<path to node_modules/playwright> CHROME=<chromium binary> \
//                       node tools/passport-check/check-golden-master.js docs/screenshots/site-passport-golden-master-01 [--no-shots]
// Fails (exit 1) when: logo missing / not loaded / overlapped by flags or crumbs, header shows "CAP",
// not 12 flags, horizontal scroll, a photo without its source line, wine page not in ready state.
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const path = require('path');
const out = process.argv[2]; const shots = !process.argv.includes('--no-shots');
const BASE = 'http://127.0.0.1:8765/';
const API = 'api=' + encodeURIComponent('https://tt-stack-prod.onrender.com/api/cap');
const PAGES = [
  ['la-chablisienne', 'wine-passport.html?wineId=03c86c8d-780e-421b-b557-c4b7f528897e'],
  ['grattamacco', 'wine-passport.html?wineId=84144c2b-6751-4a6d-85a1-da7226bb1232'],
  ['henri-bourgeois', 'wine-passport.html?wineId=ccad2276-492c-4202-b55f-81657c5cc35d'],
  ['rabl', 'wine-passport.html?wineId=4b66a911-d164-4676-a17b-2d02f43e3a0a'],
  ['marcel-martin', 'wine-passport.html?wineId=cfc8644e-d53c-4d85-b5fc-11ff4a882acc'],
  ['mure', 'wine-passport.html?wineId=7ea4bfc2-e6c7-404c-aabd-6af356a8fe20'],
  ['winery-la-chablisienne', 'winery-passport.html?slug=la-chablisienne&lang=ru'],
  ...(process.env.EXTRA ? JSON.parse(process.env.EXTRA) : []),
];
const LANG = process.env.LANG_Q || 'ru';
(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const results = []; let fail = 0;
  for (const [name, url] of PAGES) {
    for (const w of [1440, 390]) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      // Live prod API answers CORS only for www.tastingandtoasting.com: relay it unchanged with an ACAO header.
      await p.route('https://tt-stack-prod.onrender.com/**', async route => {
        const resp = await route.fetch();
        await route.fulfill({ response: resp, headers: { ...resp.headers(), 'access-control-allow-origin': '*' } });
      });
      const full = BASE + url + (url.includes('lang=') ? '' : '&lang=' + LANG) + '&' + API;
      await p.goto(full);
      await p.waitForFunction(() => !document.querySelector('[data-state="loading"], [aria-busy="true"]') && document.getElementById('app').innerHTML.length > 50, null, { timeout: 90000 }).catch(() => {});
      await p.waitForTimeout(2500);
      const r = await p.evaluate(() => {
        const errs = [];
        const head = document.querySelector('header');
        const img = head && head.querySelector('.tt-logo img');
        const box = el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
        const hit = (a, c) => a.x < c.x + c.w && c.x < a.x + a.w && a.y < c.y + c.h && c.y < a.y + a.h;
        if (!img) errs.push('logo: missing in header');
        else {
          const lb = box(img);
          if (!img.complete || img.naturalWidth === 0) errs.push('logo: image not loaded');
          if (lb.w < 100 || lb.h < 15) errs.push('logo: too small ' + JSON.stringify(lb));
          head.querySelectorAll('.lang-flag-link, .crumb, .crumbs').forEach(el => { const c = box(el); if (c.w && hit(lb, c)) errs.push('logo: overlapped by ' + el.className); });
        }
        const st = document.querySelector('[data-state]');
        if (location.pathname.includes('wine-passport') && !location.search.includes('wineId=00000000') && (!st || st.getAttribute('data-state') !== 'ready')) errs.push('page not ready: ' + (st && st.getAttribute('data-state')));
        if (location.pathname.includes('winery-passport') && !document.querySelector('main .hero-name')) errs.push('winery not rendered');
        if (head && /\bCAP\b/.test(head.innerText)) errs.push('header still shows CAP');
        if (head && head.querySelectorAll('.lang-flag-link').length !== 12) errs.push('flags != 12');
        if (document.documentElement.scrollWidth > innerWidth) errs.push('horizontal scroll ' + document.documentElement.scrollWidth + '>' + innerWidth);
        document.querySelectorAll('main img[data-photo], main img.producer-photo, main .plate-img').forEach(im => {
          const wrap = im.closest('.photo-block, .photo-col, .wine-visual');
          if (!wrap || !/\S/.test((wrap.querySelector('.credit') || {}).textContent || '')) errs.push('photo without source line');
        });
        const blocks = [...document.querySelectorAll('[data-block]')].map(e => e.getAttribute('data-block'));
        const crumb = (document.querySelector('#crumb, #crumbs') || {}).innerText || '';
        const state = (document.querySelector('[data-state]') || {}).getAttribute ? document.querySelector('[data-state]').getAttribute('data-state') : '';
        return { errs, blocks, crumb: crumb.replace(/\s+/g, ' ').trim(), state, dir: document.documentElement.dir, fields: [...document.querySelectorAll('[data-field]')].map(e => e.getAttribute('data-field')) };
      });
      if (shots) await p.screenshot({ path: path.join(out, `site-${name}-${w}.png`), fullPage: true });
      if (r.errs.length) fail++;
      results.push({ name, w, ...r });
      console.log((r.errs.length ? 'FAIL ' : 'ok   ') + name + ' ' + w + ' | ' + r.state + ' | ' + r.crumb + ' | ' + r.blocks.join(',') + ' | ' + r.fields.join(',') + (r.errs.length ? ' | ' + r.errs.join('; ') : ''));
      await p.close();
    }
  }
  await b.close();
  console.log(fail ? `CHECK FAILED: ${fail} page(s)` : 'CHECK PASSED');
  process.exit(fail ? 1 : 0);
})();
