// SITE-SHORT-ROUTE-I18N-01: the sticker short link /cap/b/<token> must load cap-i18n.js (200),
// read the token from the path, switch language, and show "not found" in all 12 languages.
// The API is stubbed (404 for every call), so no scan is ever recorded on the backend.
// Run: node tools/passport-check/serve-vercel.js 8766 &
//      PLAYWRIGHT=<path to node_modules/playwright> CHROME=<chromium binary> node tools/passport-check/check-short-route.js [base]
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const BASE = (process.argv[2] || 'http://127.0.0.1:8766').replace(/\/$/, '');
const TOKEN = 'zz-not-a-real-token-0001';
const LANGS = ['en', 'fr', 'ru', 'es', 'uk', 'it', 'de', 'he', 'pt', 'ka', 'ro', 'pl'];
(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  let fail = 0; const bad = m => { fail++; console.log('  FAIL ' + m); };
  async function open(url) {
    const p = await b.newPage({ viewport: { width: 390, height: 900 } });
    const log = { i18n: [], notOk: [], api: [] };
    await p.route(/\/api\/cap\//, route => { log.api.push(route.request().url()); route.fulfill({ status: 404, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"error":"not_found"}' }); });
    p.on('response', r => { const u = r.url(); if (u.includes('cap-i18n.js')) log.i18n.push(r.status() + ' ' + u); if (u.startsWith(BASE) && r.status() >= 400) log.notOk.push(r.status() + ' ' + u); });
    await p.goto(BASE + url); await p.waitForSelector('.state h1', { timeout: 15000 }).catch(() => {});
    return { p, log };
  }
  const titles = {};
  for (const lang of LANGS) {
    const { p, log } = await open('/cap/b/' + TOKEN + '?lang=' + lang);
    const r = await p.evaluate(() => ({ lang: document.documentElement.lang, dir: document.dir, h1: (document.querySelector('.state h1') || {}).textContent || '', cap: typeof window.CAP, flags: document.querySelectorAll('[data-lang-link]').length, cur: (document.querySelector('.is-current-lang') || {}).getAttribute?.('data-lang-link') }));
    console.log(lang.padEnd(3), '| i18n:', log.i18n.join(', ') || 'NOT REQUESTED', '| api:', log.api.map(u => u.replace(/^.*\/api\/cap/, '')).join(',') || '-', '| html lang=' + r.lang, 'dir=' + r.dir, '| h1:', r.h1);
    if (!log.i18n.length || !log.i18n.every(s => s.startsWith('200 ') && s.includes(BASE + '/src/i18n/cap-i18n.js'))) bad(lang + ': cap-i18n.js not 200 from /src/i18n/');
    if (log.notOk.length) bad(lang + ': same-origin errors ' + log.notOk.join(', '));
    if (r.cap !== 'object') bad(lang + ': window.CAP missing');
    if (!log.api.some(u => u.endsWith('/scan/' + TOKEN))) bad(lang + ': token from path not sent to /scan/');
    if (!r.lang.startsWith(lang)) bad(lang + ': html lang=' + r.lang);
    if (r.flags !== 12 || r.cur !== lang) bad(lang + ': flags=' + r.flags + ' current=' + r.cur);
    if (!r.h1) bad(lang + ': no not-found heading');
    titles[lang] = r.h1; await p.close();
  }
  const distinct = new Set(Object.values(titles)).size;
  console.log('distinct not-found headings:', distinct, '/ 12'); if (distinct !== 12) bad('not-found heading not translated in every language');
  // Switcher: no ?lang, click the Russian flag, stay on the short path.
  { const { p } = await open('/cap/b/' + TOKEN);
    await p.click('[data-lang-link="ru"]'); await p.waitForSelector('.state h1');
    const r = await p.evaluate(() => ({ path: location.pathname + location.search, lang: document.documentElement.lang, h1: document.querySelector('.state h1').textContent }));
    console.log('switcher click ru ->', r.path, '| lang=' + r.lang, '| h1:', r.h1);
    if (r.path !== '/cap/b/' + TOKEN + '?lang=ru' || r.lang !== 'ru' || r.h1 !== titles.ru) bad('switcher on short route');
    const links = await p.evaluate(() => [pageHref('wine-passport.html', { wineId: 'w1' }), pageHref('winery-passport.html', { slug: 's1' }), pageHref('vintage-passport.html', { vintageId: 'v1' })]);
    console.log('passport links from /cap/b:', links.join('  '));
    if (!links.every(h => /^\/(wine|winery|vintage)-passport\?/.test(h))) bad('bottle links not absolute clean URLs');
    await p.close(); }
  // Pages still work from their own URLs.
  for (const url of ['/bottle-scan?token=' + TOKEN, '/wine-passport?wineId=w1', '/vintage-passport?vintageId=v1', '/winery-passport?slug=s1']) {
    const p = await b.newPage(); const st = [];
    await p.route(/\/api\/cap\//, route => route.fulfill({ status: 404, headers: { 'access-control-allow-origin': '*' }, body: '{}' }));
    p.on('response', r => { if (r.url().includes('cap-i18n.js')) st.push(r.status()); });
    await p.goto(BASE + url); await p.waitForTimeout(800);
    const cap = await p.evaluate(() => typeof window.CAP);
    console.log(url.padEnd(44), 'cap-i18n.js:', st.join(',') || 'NOT REQUESTED', '| CAP:', cap);
    if (st[0] !== 200 || cap !== 'object') bad(url + ': cap-i18n.js');
    await p.close();
  }
  await b.close();
  console.log(fail ? 'FAILED: ' + fail : 'ALL OK'); process.exit(fail ? 1 : 0);
})();
