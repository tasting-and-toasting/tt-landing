#!/usr/bin/env node
// SECURITY B1 — browser check of the passport trust rules, fully offline.
// Optional companion to check-passport-trust.js (that one needs only node).
//
// Every request the browser makes is intercepted: pages are served from this
// checkout under the production host name with the vercel.json headers (so the
// CSP is enforced exactly as Vercel would send it), the tt-stack API is answered
// with synthetic data, and anything else is aborted. Nothing leaves the machine.
//
// Run:  PLAYWRIGHT=<path to playwright module> CHROME=<chrome binary> \
//       node tools/security/browser-check-passport-trust.js
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const SITE = 'https://tastingandtoasting.com';
const API_HOST = 'tt-stack-prod.onrender.com';
const EVIL = 'https://attacker.example/api/cap';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

function match(source, pathname) {
  if (source === '/(.*)') return {};
  const names = [];
  const re = new RegExp('^' + source.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:(\w+)/g, (_, n) => { names.push(n); return '([^/]+)'; }) + '$');
  const m = pathname.match(re); if (!m) return null;
  const o = {}; names.forEach((n, i) => { o[n] = m[i + 1]; }); return o;
}
function file(p) { const f = path.join(ROOT, decodeURIComponent(p)); return f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isFile() ? f : null; }
function resolve(pathname) {
  if (pathname === '/') return file('/index.html');
  return file(pathname) || file(pathname + '.html') || file(pathname + '/index.html');
}
function headersFor(pathname) {
  const h = {};
  for (const g of cfg.headers || []) if (match(g.source, pathname)) for (const kv of g.headers) h[kv.key.toLowerCase()] = kv.value;
  return h;
}
function serveSite(u) {
  let f = resolve(u.pathname);
  if (!f) for (const r of cfg.rewrites || []) {
    const m = match(r.source, u.pathname); if (!m) continue;
    f = resolve(new URL(r.destination.replace(/:(\w+)/g, (_, n) => m[n] || ''), SITE).pathname); break;
  }
  if (!f) return { status: 404, body: '404' };
  return { status: 200, contentType: TYPES[path.extname(f)] || 'application/octet-stream', headers: headersFor(u.pathname), body: fs.readFileSync(f) };
}

// Synthetic tt-stack data; the scenario sets the winery fields.
let SCEN = {};
function winery() {
  return Object.assign({ id: 'wy-synthetic', slug: 'synthetic-winery', name: 'Synthetic Winery', status: 'published', country: 'FR' }, SCEN.winery || {});
}
function apiAnswer(u) {
  const p = u.pathname.replace(/^\/api\/cap/, '');
  const own = { ownership_confirmed: SCEN.ownership === true, ownership_badge: SCEN.ownership === true ? 'Verified Winery' : null };
  if (/^\/scan\//.test(p)) return { winery: winery(), wine: { id: 'wn-synthetic', name: 'Synthetic Wine' }, vintage: { id: 'vt-synthetic', vintage_year: 2020 }, bottle: { qr_token: 'tok-synthetic', bottle_number: 1, total_in_series: 10, status: 'minted' }, dna: {}, timeline: [], ...own };
  if (/^\/wineries\/[^/]+\/wines$/.test(p)) return { wines: [] };
  if (/^\/wineries\//.test(p)) return { winery: winery(), dna: {}, services: [], ...own };
  if (/^\/wines\//.test(p)) return { wine: { id: 'wn-synthetic', name: 'Synthetic Wine', winery_slug: 'synthetic-winery', status: 'published' }, vintages: [] };
  if (/^\/vintages\//.test(p)) return { vintage: { id: 'vt-synthetic', wine_id: 'wn-synthetic', vintage_year: 2020, wine_name: 'Synthetic Wine', verification_status: 'verified' } };
  return null;
}
// Capital "Verified" not followed by a lowercase letter; rendered text has no spaces between blocks ("FRVerifiedWines"). "Not verified"/"Unverified" do not match.
const VERIFIED_RE = /Verified(?![a-z])/;
const QR_STUB = 'window.QRCode=function(el,o){el.setAttribute("data-qr-text",o.text);};window.QRCode.CorrectLevel={M:0};';

(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  let pass = 0; const fails = [];
  const check = (name, ok, detail) => { if (ok) pass++; else fails.push(name + ' — ' + detail); };

  async function open(url, scen) {
    SCEN = scen || {};
    const ctx = await browser.newContext();
    const log = { api: [], evil: [], aborted: [], csp: [] };
    await ctx.route('**/*', route => {
      const u = new URL(route.request().url());
      if (u.origin === SITE) { const r = serveSite(u); return route.fulfill(r); }
      if (u.host === API_HOST) {
        log.api.push(u.pathname);
        const body = apiAnswer(u);
        return body ? route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) })
                    : route.fulfill({ status: 404, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"error":"NotFound"}' });
      }
      if (u.host === 'attacker.example') { log.evil.push(u.href); return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ winery: { name: 'SPOOF', verification_status: 'verified' } }) }); }
      if (u.host === 'cdn.jsdelivr.net' && u.pathname === '/npm/qrcodejs@1.0.0/qrcode.min.js') return route.fulfill({ status: 200, contentType: 'text/javascript', body: QR_STUB });
      log.aborted.push(u.host); return route.abort();
    });
    const page = await ctx.newPage();
    page.on('console', m => { if (/Content Security Policy|Refused to/i.test(m.text())) log.csp.push(m.text().slice(0, 200)); });
    const resp = await page.goto(SITE + url, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    // textContent of the rendered app (innerText would apply CSS text-transform; body would include inline scripts).
    const text = await page.evaluate(() => { const a = document.getElementById('app'); return a ? a.textContent : ''; });
    return { ctx, page, log, text, csp: (resp && resp.headers()['content-security-policy']) || '' };
  }
  const Q = '&api=' + encodeURIComponent(EVIL);

  // 1. bottle scan via the short route, spoof attempt + each status.
  for (const [status, wantVerified] of [['claimed', false], ['certified', false], ['VERIFIED', false], ['weird', false], [undefined, false], ['verified', true]]) {
    const r = await open('/cap/b/tok-synthetic?x=1' + Q, { winery: status === undefined ? {} : { verification_status: status, website_url: 'javascript:alert(1)' } });
    check('bottle: CSP sent', /connect-src 'self' https:\/\/tt-stack-prod\.onrender\.com;/.test(r.csp), 'CSP header on /cap/b/: ' + r.csp);
    check('bottle: ?api= ignored', r.log.evil.length === 0 && r.log.api.some(p => p.startsWith('/api/cap/scan/')), 'evil=' + r.log.evil.length + ' api=' + r.log.api.join(','));
    check('bottle: renders', /Synthetic Wine/.test(r.text), 'status ' + status + ': page did not render synthetic data');
    check('bottle: Verified only when verified', VERIFIED_RE.test(r.text) === wantVerified, 'status ' + JSON.stringify(status) + ' Verified shown=' + VERIFIED_RE.test(r.text));
    const jsLinks = await r.page.evaluate(() => [...document.querySelectorAll('a[href]')].filter(a => /^\s*javascript:/i.test(a.getAttribute('href'))).length);
    check('bottle: no javascript: link', jsLinks === 0, 'status ' + status + ': ' + jsLinks + ' javascript: links');
    check('bottle: no CSP violations on normal load', r.log.csp.length === 0, r.log.csp.join(' | '));
    if (status === 'verified') {
      // D5: the status is the WINERY's, labelled so, inside the Winery section.
      const lab = await r.page.evaluate(() => { const b = document.querySelector('[data-status-subject="winery"]'); const band = b && b.closest('section'); const eb = band && band.querySelector('.eyebrow'); return { text: b ? b.textContent : null, section: eb ? eb.textContent : null }; });
      check('D5 bottle: verified label names the winery', lab.text === 'Winery · Verification status: Verified' && lab.section === 'Winery', 'badge ' + JSON.stringify(lab));
      const blocked = await r.page.evaluate(async () => { try { await fetch('https://attacker.example/probe'); return 'reached'; } catch (e) { return 'blocked'; } });
      check('bottle: CSP blocks foreign fetch', blocked === 'blocked' && r.log.evil.length === 0, 'fetch to attacker.example was ' + blocked + ', intercepted=' + r.log.evil.length);
    }
    await r.ctx.close();
  }
  // Ownership: string "true" must not count.
  {
    const r = await open('/cap/b/tok-synthetic?x=1', { winery: { verification_status: 'claimed', ownership_confirmed: 'true' } });
    check('bottle: no ownership badge for "true" string', !/Verified Winery/.test(r.text), 'ownership badge shown for string "true"');
    await r.ctx.close();
  }

  // 2. winery passport.
  for (const [status, wantVerified] of [['certified', false], ['weird', false], ['verified', true]]) {
    const r = await open('/winery-passport?slug=synthetic-winery' + Q, { winery: { verification_status: status } });
    check('winery: CSP sent', /connect-src/.test(r.csp), 'no CSP on /winery-passport');
    check('winery: ?api= ignored', r.log.evil.length === 0 && r.log.api.length > 0, 'evil=' + r.log.evil.length);
    check('winery: Verified only when verified', VERIFIED_RE.test(r.text) === wantVerified, 'status ' + status + ' Verified shown=' + VERIFIED_RE.test(r.text));
    if (status === 'verified') {
      const chips = await r.page.evaluate(() => [...document.querySelectorAll('.badge')].map(b => b.textContent));
      check('D5 winery: verified chip names the winery', chips.includes('Winery · Verified') && !chips.includes('Verified'), 'chips ' + JSON.stringify(chips));
    }
    check('winery: unknown status gets no "Under review"', status !== 'weird' || !/Under review/.test(r.text), 'unknown status shown as Under review');
    const links = await r.page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => /api=/.test(h)));
    check('winery: api not carried into links', links.length === 0, links.join(' '));
    check('winery: no CSP violations', r.log.csp.length === 0, r.log.csp.join(' | '));
    await r.ctx.close();
  }

  // 3. wine + vintage passports: API host only, no CSP violations, no vintage verification line.
  for (const url of ['/wine-passport?wineId=wn-synthetic', '/vintage-passport?vintageId=vt-synthetic']) {
    const r = await open(url + Q, { winery: { verification_status: 'certified' } });
    check(url + ': CSP sent', /connect-src/.test(r.csp), 'no CSP');
    check(url + ': ?api= ignored', r.log.evil.length === 0 && r.log.api.length > 0, 'evil=' + r.log.evil.length + ' api=' + r.log.api.length);
    check(url + ': no Verified', !VERIFIED_RE.test(r.text), 'Verified shown');
    check(url + ': no CSP violations', r.log.csp.length === 0, r.log.csp.join(' | '));
    if (url.startsWith('/wine')) check('wine: Research Edition for certified', /Research Edition/i.test(r.text), 'Research Edition tag missing for status "certified"');
    await r.ctx.close();
  }

  // 4. QR sticker: D5 neutral text for every status and language, and the QR target.
  for (const [status, lang] of [['claimed', 'en'], ['certified', 'en'], ['verified', 'en'], ['verified', 'fr'], ['verified', 'ru'], ['verified', 'pl']]) {
    const r = await open('/cap-qr-sticker?token=tok-synthetic&lang=' + lang + '&target=' + encodeURIComponent('https://attacker.example/phish') + Q, { winery: { verification_status: status } });
    const st = await r.page.evaluate(() => { const s = document.querySelector('.sticker'); const id = document.getElementById('capIdentity'); return { text: s ? s.textContent : '', id: id ? id.textContent : null, idVisible: !!id && getComputedStyle(id).display !== 'none', wine: (document.getElementById('wine') || {}).textContent, qr: document.getElementById('qr').getAttribute('data-qr-text') }; });
    check('D5 sticker: rendered', /Synthetic Wine/.test(st.wine || ''), 'status ' + status + '/' + lang + ': sticker did not render, wine=' + st.wine);
    check('D5 sticker: no verified text', !/verif|vérifi|подтвержд|zweryfik/i.test(st.text), 'status ' + status + '/' + lang + ' sticker text: ' + st.text.replace(/\s+/g, ' ').trim().slice(0, 160));
    check('D5 sticker: "Digital Wine Passport" shown untranslated', st.id === 'Digital Wine Passport' && st.idVisible, 'status ' + status + '/' + lang + ' identification ' + JSON.stringify(st.id) + ' visible=' + st.idVisible);
    check('sticker: CSP sent', /qrcodejs@1\.0\.0\/qrcode\.min\.js/.test(r.csp), 'sticker CSP: ' + r.csp);
    check('sticker: ?api= ignored', r.log.evil.length === 0 && r.log.api.length > 0, 'evil=' + r.log.evil.length);
    check('sticker: QR is our short link', st.qr === 'https://tastingandtoasting.com/cap/b/tok-synthetic', 'QR text ' + st.qr);
    check('sticker: no CSP violations', r.log.csp.length === 0, r.log.csp.join(' | '));
    await r.ctx.close();
  }

  // 5. onboarding wizard: API origin and CSP only (the wizard writes; it is not driven here).
  {
    const r = await open('/cap-onboarding?demo=1' + Q, {});
    const api = await r.page.evaluate(() => typeof API === 'string' ? API : (window.API || null)).catch(() => null);
    check('onboarding: CSP sent', /connect-src 'self' https:\/\/tt-stack-prod\.onrender\.com;/.test(r.csp), 'onboarding CSP: ' + r.csp);
    check('onboarding: API is production allowlist', api === 'https://tt-stack-prod.onrender.com/api/cap', 'API resolved to ' + api);
    const st = await r.page.evaluate(() => { const s = document.querySelector('.sticker'); const id = document.getElementById('stIdentity'); return { text: s ? s.textContent : '', id: id ? id.textContent : null }; });
    check('D5 onboarding: sticker preview has no verified text', !/verif/i.test(st.text), 'preview text: ' + st.text.replace(/\s+/g, ' ').trim().slice(0, 160));
    check('D5 onboarding: sticker preview shows "Digital Wine Passport"', st.id === 'Digital Wine Passport', 'identification ' + JSON.stringify(st.id));
    check('onboarding: no CSP violations', r.log.csp.length === 0, r.log.csp.join(' | '));
    await r.ctx.close();
  }

  // 6. cap-demo (static demo): after the console flow is signed, the bottle passport shows the
  //    WINERY's status, never a bare VERIFIED for the bottle (D5). Every demo language.
  for (const lang of ['en', 'ru', 'es', 'de', 'it', 'pl']) {
    const r = await open('/cap-demo.html?lang=' + lang, {});
    const out = await r.page.evaluate(async () => {
      const btn = document.getElementById('signAll'); if (btn) btn.click();
      await new Promise(res => setTimeout(res, 2500));
      const g = id => { const e = document.getElementById(id); return e ? e.textContent : null; };
      return { status: g('ppStatus'), verdict: g('ppVerdict'), body: document.body.textContent };
    });
    const bare = (out.body.match(/(?:^|[^A-Za-z])(?:VERIFIED|Verified|ZWERYFIKOWANY)(?![a-z])/g) || []).length;
    const named = (out.body.match(/WINERY VERIFIED|Winery verified|Verified Winery/g) || []).length;
    check('D5 cap-demo ' + lang + ': no bottle-level verified claim', !/Verified & traceable|VERIFIED BY|Zweryfikowane i identyfikowalne/.test(out.body) && bare <= named,
      'bare=' + bare + ' named=' + named + ' status=' + out.status);
    check('D5 cap-demo ' + lang + ': signed passport status names the winery', out.status === 'WINERY VERIFIED', 'ppStatus=' + JSON.stringify(out.status) + ' verdict=' + JSON.stringify(out.verdict));
    await r.ctx.close();
  }

  await browser.close();
  console.log('browser passport trust checks: ' + pass + ' passed, ' + fails.length + ' failed');
  for (const f of fails) console.log('  FAIL ' + f);
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
