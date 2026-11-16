// SITE-PHOTO-CREDIT-01: the photo credit under the bottle photo on every passport page.
//   events.tastingandtoasting.com  -> "Фото: Tasting & Toasting" / "Photo: Tasting & Toasting" / "Photo : Tasting & Toasting"
//   any other host                 -> "Источник: <domain>" (unchanged)
//   named producer host            -> "© BDX Families, ..." (unchanged)
// Data: the live prod Rabl wine (hero_image_url on events.tastingandtoasting.com), read-only GETs.
//   wine-passport / winery-passport: live API responses relayed as-is (case "tt"), or with only the photo URL
//   swapped (cases "other", "producer"). vintage-passport / bottle-scan: Rabl has no vintages and /scan/ would
//   record a scan, so their responses are built from the same live wine object; nothing is ever written.
// Swapped photo URLs are served the real Rabl bottle.jpg bytes so the photo loads and the credit is shown.
// Run: python3 -m http.server 8767 --bind 127.0.0.1   (repo root)
//      PLAYWRIGHT=<path to node_modules/playwright> CHROME=<chromium binary> \
//      node tools/passport-check/check-photo-credit.js [screenshot-dir]
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8767/';
const LIVE = 'https://tt-stack-prod.onrender.com/api/cap';
const API = 'api=' + encodeURIComponent(LIVE);
const WINE_ID = '4b66a911-d164-4676-a17b-2d02f43e3a0a'; // Rabl
const SHOTS = process.argv[2] || '';
const OTHER = 'https://photos.example-winery.test/rabl/bottle.jpg';
const PRODUCER = 'https://www.bdxfamilies.fr/media/rabl-bottle.jpg';
const EXPECT = {
  tt: { ru: 'Фото: Tasting & Toasting', en: 'Photo: Tasting & Toasting', fr: 'Photo : Tasting & Toasting' },
  other: { ru: 'Источник: photos.example-winery.test', en: 'Source: photos.example-winery.test', fr: 'Source : photos.example-winery.test' },
  producer: { ru: '© BDX Families, сайт производителя', en: "© BDX Families, producer's website", fr: '© BDX Families, site du producteur' },
};
const PAGES = {
  wine: 'wine-passport.html?wineId=' + WINE_ID,
  vintage: 'vintage-passport.html?vintageId=00000000-0000-4000-8000-00000000c001',
  winery: 'winery-passport.html?slug=rabl',
  bottle: 'bottle-scan.html?token=zz-photo-credit-check-0001',
};
(async () => {
  const live = await (await fetch(LIVE + '/wines/' + WINE_ID)).json();
  const ttUrl = live.wine.hero_image_url;
  if (!/^https:\/\/events\.tastingandtoasting\.com\//.test(ttUrl)) { console.log('FAIL live Rabl hero_image_url is not on events.tastingandtoasting.com: ' + ttUrl); process.exit(1); }
  const jpg = Buffer.from(await (await fetch(ttUrl)).arrayBuffer());
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  let fail = 0;
  const swap = (body, url) => (url === ttUrl ? body : body.split(ttUrl).join(url));
  for (const [kase, photo] of [['tt', ttUrl], ['other', OTHER], ['producer', PRODUCER]]) {
    for (const [page, url] of Object.entries(PAGES)) {
      for (const lang of ['ru', 'en', 'fr']) {
        const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
        const w = Object.assign({}, live.wine, { hero_image_url: photo });
        await p.route(u => u.href === OTHER || u.href === PRODUCER, r => r.fulfill({ status: 200, contentType: 'image/jpeg', body: jpg }));
        await p.route(LIVE + '/**', async route => {
          const u = route.request().url();
          const json = o => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(o) });
          if (u.includes('/vintages/')) return json({ vintage: { id: '00000000-0000-4000-8000-00000000c001', wine_id: w.id, wine_name: w.name, winery_name: w.winery_name, winery_slug: w.winery_slug, vintage_year: 2023, status: 'published', bottle_image_url: photo } });
          if (u.includes('/scan/')) return json({ winery: { name: w.winery_name, slug: w.winery_slug, country: w.winery_country }, wine: w, vintage: { id: '00000000-0000-4000-8000-00000000c001', vintage_year: 2023 }, bottle: { bottle_number: 1 } });
          const resp = await route.fetch();
          const body = swap(await resp.text(), photo);
          await route.fulfill({ status: resp.status(), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body });
        });
        await p.goto(BASE + url + '&lang=' + lang + '&' + API);
        await p.waitForFunction(() => [...document.querySelectorAll('img')].some(i => i.complete && i.naturalWidth > 0 && /bottle|rabl/.test(i.src)), null, { timeout: 60000 }).catch(() => {});
        await p.waitForTimeout(800);
        const got = await p.evaluate(() => [...document.querySelectorAll('.credit, #photo-credit')]
          .filter(e => e.offsetParent !== null && !e.closest('#lightbox, .lb, [role="dialog"]'))
          .map(e => e.textContent.trim()).filter(Boolean));
        const want = EXPECT[kase][lang];
        const ok = got.length > 0 && got.every(t => t === want);
        if (!ok) fail++;
        console.log((ok ? 'ok  ' : 'FAIL') + ' ' + kase.padEnd(8) + page.padEnd(8) + lang + '  want "' + want + '"  got ' + JSON.stringify(got));
        if (SHOTS && kase === 'tt' && (page === 'wine' || lang === 'ru')) await p.screenshot({ path: path.join(SHOTS, page + '-' + lang + '-tt.png') });
        await p.close();
      }
    }
  }
  await b.close();
  console.log(fail ? 'FAILED: ' + fail : 'ALL OK');
  process.exit(fail ? 1 : 0);
})();
