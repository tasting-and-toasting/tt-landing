#!/usr/bin/env node
// SECURITY B1/B2/B3 — read-only check of the DEPLOYED public site, for the maintainer.
// Run it only AFTER PR #36 is merged and deployed:
//
//   node tools/security/post-deploy-live-check.js                      (checks https://tastingandtoasting.com)
//   node tools/security/post-deploy-live-check.js --base https://www.tastingandtoasting.com
//
// What it does: plain HTTP GET of the static page files and of src/i18n/cap-i18n.js from the site
// host only. It never contacts the T&T API (tt-stack), never calls /scan/, never sends a body,
// cookie or token, and runs no page JavaScript, so it records no scans and changes nothing.
// It reads the delivered HTML/JS and the security headers and checks the wording rules:
//   - winery wizard headline "Create your winery's digital passport" in all 12 languages (OD-17 D2),
//     old "verified passport" headline absent;
//   - printed sticker / wizard sticker preview say "Digital Wine Passport", no "CAP Verified" (D5);
//   - no bottle-level "Verified & Traceable", "Verified by", "Chain confirmed" wording (D5, D2);
//   - Content-Security-Policy present on every passport route, API origin allowlisted (B1).
// Exit code 0 = all passed, 1 = something failed (each failure names the URL and what was found).
'use strict';

const args = process.argv.slice(2);
const bi = args.indexOf('--base');
const BASE = (bi >= 0 && args[bi + 1] ? args[bi + 1] : 'https://tastingandtoasting.com').replace(/\/+$/, '');
const ALLOWED_HOSTS = ['tastingandtoasting.com', 'www.tastingandtoasting.com', '127.0.0.1', 'localhost'];
const API_HOST = 'tt-stack-prod.onrender.com';

const host = new URL(BASE).hostname;
if (!ALLOWED_HOSTS.includes(host)) { console.error('Refusing to run against ' + host + ' (allowed: ' + ALLOWED_HOSTS.join(', ') + ')'); process.exit(2); }

let pass = 0; const fails = [];
const check = (name, ok, detail) => { if (ok) pass++; else fails.push(name + ' — ' + detail); };

async function get(pathname) {
  if (/\/scan\//.test(pathname)) throw new Error('refusing /scan/ path ' + pathname);
  const url = BASE + pathname;
  if (new URL(url).hostname !== host) throw new Error('refusing other host ' + url);
  const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'cache-control': 'no-cache' } });
  if (new URL(res.url).hostname === API_HOST) throw new Error('redirected to the API host: ' + res.url);
  const body = await res.text();
  return { url: res.url, status: res.status, csp: res.headers.get('content-security-policy') || '', body };
}

const HEADLINE = {
  en: "Create your winery's digital passport", fr: 'Créez le passeport numérique de votre domaine',
  ru: 'Создайте цифровой паспорт вашей винодельни', es: 'Crea el pasaporte digital de tu bodega',
  uk: 'Створіть цифровий паспорт вашої виноробні', it: 'Crea il passaporto digitale della tua cantina',
  de: 'Erstellen Sie den digitalen Pass Ihres Weinguts', he: 'צרו את הדרכון הדיגיטלי של היקב שלכם',
  pt: 'Crie o passaporte digital da sua quinta', ka: 'შექმენით თქვენი მარნის ციფრული პასპორტი',
  ro: 'Creează pașaportul digital al cramei tale', pl: 'Stwórz cyfrowy paszport swojej winnicy'
};
const OLD_HEADLINE = [/Create your (?:<em>)?verified/i, /passeport (?:<em>)?vérifié/i, /(?:<em>)?подтверждённый(?:<\/em>)? паспорт/i,
  /pasaporte (?:<em>)?verificado/i, /(?:<em>)?підтверджений(?:<\/em>)? паспорт/i, /passaporto (?:<em>)?verificato/i,
  /(?:<em>)?verifizierten(?:<\/em>)? Pass/i, /הדרכון (?:<em>)?המאומת/, /passaporte (?:<em>)?verificado/i,
  /(?:<em>)?დადასტურებული(?:<\/em>)? პასპორტი/, /pașaportul (?:<em>)?verificat/i, /(?:<em>)?zweryfikowany(?:<\/em>)? paszport/i];
const plain = s => s.replace(/<[^>]+>/g, '');

(async () => {
  // 1. Winery wizard
  const ob = await get('/cap-onboarding');
  check('wizard page loads', ob.status === 200, ob.url + ' HTTP ' + ob.status);
  for (const [lang, want] of Object.entries(HEADLINE)) {
    const m = ob.body.match(new RegExp('\\n\\s*' + lang + ':\\{nav:"[^"]*", title:"([^"]*)"'));
    check('wizard headline ' + lang, !!m && plain(m[1]) === want, ob.url + ' ' + lang + ' title = ' + (m ? JSON.stringify(plain(m[1])) : 'not found'));
  }
  const h1 = ob.body.match(/<h1 data-wz-html="title">([\s\S]*?)<\/h1>/);
  check('wizard headline before JS runs', !!h1 && plain(h1[1]) === HEADLINE.en, ob.url + ' <h1> = ' + (h1 ? JSON.stringify(plain(h1[1])) : 'not found'));
  for (const re of OLD_HEADLINE) { const m = ob.body.match(re); check('old wizard headline gone', !m, ob.url + ' still has: ' + (m ? m[0] : '')); }
  check('wizard sticker preview neutral', /id="stIdentity"[^>]*>Digital Wine Passport</.test(ob.body) && !/CAP Verified|cap_verified/.test(ob.body),
    ob.url + ' sticker preview text is not exactly "Digital Wine Passport" or "CAP Verified" is still present');

  // 2. Printed sticker page (static HTML only; no token, so the page itself would show "not found")
  const st = await get('/cap-qr-sticker');
  check('sticker page neutral', st.status === 200 && /id="capIdentity"[^>]*>Digital Wine Passport</.test(st.body) && !/CAP Verified|cap_verified/.test(st.body),
    st.url + ' HTTP ' + st.status + ', sticker identification not "Digital Wine Passport" or "CAP Verified" present');

  // 3. Shared dictionary
  const i18n = await get('/src/i18n/cap-i18n.js');
  check('dictionary loads', i18n.status === 200, i18n.url + ' HTTP ' + i18n.status);
  for (const k of ['verified_h', 'verified_facts', 'cap_verified']) check('dictionary key ' + k + ' removed', !new RegExp('\\b' + k + ':').test(i18n.body), i18n.url + ' still defines ' + k);

  // 4. Demo pages
  const demo = await get('/cap-demo');
  check('cap-demo: no bottle "VERIFIED" seal / "Verified by" / "Chain confirmed"',
    demo.status === 200 && /<div class="seal-status">WINERY VERIFIED<\/div>/.test(demo.body) && !/VERIFIED BY|Verified &(?:amp;)? traceable|Chain <b>confirmed<\/b>|<b>подтверждена<\/b>|ZWERYFIKOWANY/.test(demo.body),
    demo.url + ' HTTP ' + demo.status + ' still shows a bottle-level verified/confirmed claim or lacks "WINERY VERIFIED"');
  const prod = await get('/producer');
  const foots = [...prod.body.matchAll(/foot:`([^`]*)`/g)].map(m => m[1]);
  check('producer demo footer neutral', prod.status === 200 && foots.length === 9 && foots.every(f => f.startsWith('Digital Wine Passport · Tasting & Toasting CAP')),
    prod.url + ' HTTP ' + prod.status + ', footers: ' + foots.map(f => f.slice(0, 40)).join(' | '));

  // 5. Security headers on the passport routes (B1). /cap/b/... is fetched as a static page only.
  for (const p of ['/bottle-scan', '/cap/b/post-deploy-check', '/wine-passport', '/vintage-passport', '/winery-passport', '/cap-qr-sticker', '/cap-onboarding']) {
    const r = p === '/cap-onboarding' ? ob : (p === '/cap-qr-sticker' ? st : await get(p));
    check('CSP on ' + p, /connect-src 'self' https:\/\/tt-stack-prod\.onrender\.com;/.test(r.csp), r.url + ' CSP = ' + JSON.stringify(r.csp.slice(0, 120)));
  }

  console.log('post-deploy live checks (' + BASE + '): ' + pass + ' passed, ' + fails.length + ' failed');
  for (const f of fails) console.log('  FAIL ' + f);
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('ERROR ' + e.message); process.exit(2); });
