#!/usr/bin/env node
// SECURITY B1 — offline regression checks for the public passport surface.
// No network, no dependencies, synthetic inputs only. Exit code 1 on any failure;
// every failure names the file and the exact thing it found.
//
// Run from the repo root:  node tools/security/check-passport-trust.js
//
// Checks:
//   1. No page reads ?api= itself; every page that talks to the CAP API takes its
//      base from TT_TRUST.resolveApiBase and loads tt-trust.js first.
//   2. resolveApiBase honours ?api= only on a local dev host (unit, synthetic hosts).
//   3. vercel.json sends a Content-Security-Policy on every passport route, and
//      connect-src is exactly 'self' + the allowlisted API origins.
//   4. Verification status module: "Verified" only for "verified" (unit).
//   5. Pages: no "certified" → verified mapping; sticker/onboarding badge hidden by
//      default and toggled only through TT_TRUST; QR target not taken from the URL
//      on production hosts; website links go through an http(s) filter.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const TRUST = require(path.join(ROOT, 'src', 'passport', 'tt-trust.js'));

let pass = 0;
const failures = [];
function check(name, ok, detail) {
  if (ok) { pass++; return; }
  failures.push(name + (detail ? ' — ' + detail : ''));
}

// Pages that fetch the CAP API and are part of the public passport surface.
const PASSPORT_PAGES = [
  'bottle-scan.html', 'wine-passport.html', 'vintage-passport.html',
  'winery-passport.html', 'cap-qr-sticker.html', 'cap-onboarding.html'
];

// Routes that serve those pages on Vercel (cleanUrls + rewrites).
const PASSPORT_ROUTES = [
  '/bottle-scan', '/cap/b/zz-synthetic-token-0001', '/wine-passport', '/vintage-passport',
  '/winery-passport', '/cap-qr-sticker', '/cap-onboarding'
];

// ---------------------------------------------------------------- 1. pages
function allHtml(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === '_design') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) allHtml(p, out);
    else if (/\.(html|js)$/.test(e.name)) out.push(path.relative(ROOT, p));
  }
  return out;
}
const API_PARAM_READ = /\.get\(\s*['"`]api['"`]\s*\)/;
for (const rel of allHtml(ROOT, [])) {
  if (rel === path.join('src', 'passport', 'tt-trust.js')) continue;
  if (rel.startsWith(path.join('tools', ''))) continue; // dev tooling, never served as a page script
  const hits = [];
  read(rel).split('\n').forEach((line, i) => { if (API_PARAM_READ.test(line)) hits.push(rel + ':' + (i + 1) + ' ' + line.trim().slice(0, 120)); });
  check('no page reads ?api= directly', hits.length === 0, 'reads the api query parameter: ' + hits.join(' | '));
}
for (const page of PASSPORT_PAGES) {
  const html = read(page);
  const trustTag = html.search(/<script src="\/?src\/passport\/tt-trust\.js"><\/script>/);
  const firstInline = html.search(/<script>/);
  check('tt-trust.js loaded before page code', trustTag !== -1 && trustTag < firstInline,
    page + (trustTag === -1 ? ' does not load src/passport/tt-trust.js' : ' loads tt-trust.js after its inline script'));
  check('API base from TT_TRUST.resolveApiBase', /const API\s*=\s*TT_TRUST\.resolveApiBase\(location\)/.test(html),
    page + ' does not take its API base from TT_TRUST.resolveApiBase(location)');
  check('no hard-coded CAP API origin in page', !/tt-stack-prod\.onrender\.com\/api\/cap/.test(html),
    page + ' still hard-codes the CAP API origin (must live only in tt-trust.js)');
  const prefixHost = html.match(/\/\^\(localhost\|127[^/]*\//);
  check('no prefix-match localhost test', !prefixHost,
    page + ' tests the hostname with a prefix regex ' + (prefixHost ? prefixHost[0] : '') + ' (matches localhost.attacker.tld)');
}

// ------------------------------------------------- 2. resolveApiBase (unit)
function loc(hostname, search) { return { hostname, search: search || '' }; }
const EVIL = '?api=' + encodeURIComponent('https://attacker.example/api/cap');
const prodCases = [
  'tastingandtoasting.com', 'www.tastingandtoasting.com', 'tt-landing-synthetic.vercel.app',
  'localhost.attacker.example', '127.0.0.1.attacker.example', '0.0.attacker.example', 'evil-localhost'
];
for (const h of prodCases) {
  const got = TRUST.resolveApiBase(loc(h, EVIL));
  check('?api= ignored on non-local host', got === TRUST.PROD_API, h + ' with ?api=attacker resolved to ' + got);
  check('no api carried into links on non-local host', TRUST.devApiOverride(loc(h, EVIL)) === null,
    h + ' devApiOverride returned ' + TRUST.devApiOverride(loc(h, EVIL)));
}
for (const h of ['localhost', '127.0.0.1', '127.1.2.3', '0.0.0.0', '::1', '[::1]']) {
  check('?api= honoured on local host', TRUST.resolveApiBase(loc(h, '?api=http://127.0.0.1:9999/api/cap')) === 'http://127.0.0.1:9999/api/cap',
    h + ' did not honour a local override');
  check('local default without override', TRUST.resolveApiBase(loc(h, '')) === TRUST.LOCAL_API, h + ' default is not LOCAL_API');
  check('non-http override refused even locally', TRUST.resolveApiBase(loc(h, '?api=javascript:alert(1)')) === TRUST.LOCAL_API,
    h + ' accepted a javascript: api override');
}
check('PROD_API origin is allowlisted', TRUST.ALLOWED_API_ORIGINS.includes(new URL(TRUST.PROD_API).origin),
  'PROD_API origin ' + new URL(TRUST.PROD_API).origin + ' is not in ALLOWED_API_ORIGINS');

// ------------------------------------------------------------ 3. vercel CSP
const vercel = JSON.parse(read('vercel.json'));
function matchSource(source, pathname) {
  // Same subset of Vercel's path syntax that tools/passport-check/serve-vercel.js
  // supports: literal segments and :param. "/(.*)" is the catch-all.
  if (source === '/(.*)') return true;
  const re = new RegExp('^' + source.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:(\w+)/g, '[^/]+') + '$');
  return re.test(pathname);
}
function cspFor(pathname) {
  const values = [];
  for (const h of vercel.headers || []) {
    if (!matchSource(h.source, pathname)) continue;
    for (const kv of h.headers || []) if (String(kv.key).toLowerCase() === 'content-security-policy') values.push(kv.value);
  }
  return values;
}
function directives(csp) {
  const out = {};
  for (const part of csp.split(';')) {
    const toks = part.trim().split(/\s+/).filter(Boolean);
    if (toks.length) out[toks[0].toLowerCase()] = toks.slice(1);
  }
  return out;
}
const allowedConnect = new Set(["'self'"].concat(TRUST.ALLOWED_API_ORIGINS));
for (const route of PASSPORT_ROUTES) {
  const csps = cspFor(route);
  check('CSP header present', csps.length === 1, route + ' has ' + csps.length + ' Content-Security-Policy headers in vercel.json (want 1)');
  if (csps.length !== 1) continue;
  const d = directives(csps[0]);
  const connect = d['connect-src'];
  check('connect-src present', !!connect, route + ' CSP has no connect-src (falls back to default-src)');
  if (connect) {
    const extra = connect.filter(s => !allowedConnect.has(s));
    check('connect-src restricted to allowlist', extra.length === 0, route + ' connect-src allows ' + extra.join(' '));
    for (const o of TRUST.ALLOWED_API_ORIGINS) check('connect-src includes API', connect.includes(o), route + ' connect-src misses ' + o);
  }
  check('default-src self', JSON.stringify(d['default-src']) === JSON.stringify(["'self'"]), route + ' default-src is ' + (d['default-src'] || []).join(' '));
  check("object-src 'none'", JSON.stringify(d['object-src']) === JSON.stringify(["'none'"]), route + ' object-src is ' + (d['object-src'] || []).join(' '));
  check('base-uri self', !!d['base-uri'] && d['base-uri'].join(' ') === "'self'", route + ' base-uri is ' + (d['base-uri'] || []).join(' '));
  check('frame-ancestors set', !!d['frame-ancestors'], route + ' has no frame-ancestors');
  const scriptSrc = d['script-src'] || [];
  const wild = scriptSrc.filter(s => s === '*' || s === 'https:' || s === 'http:' || s === "'unsafe-eval'" || s === 'data:');
  check('script-src not wildcard', wild.length === 0, route + ' script-src allows ' + wild.join(' '));
}

// ------------------------------------------------- 4. status module (unit)
const notVerified = [
  undefined, null, '', ' ', 'certified', 'Verified', 'VERIFIED', 'verified ' + 'x', 'approved', 'claimed',
  'documents_submitted', 'submitted', 'under_review', 'rejected', true, 1, {}, ['verified'], { status: 'verified' }
];
for (const v of notVerified) {
  const r = TRUST.wineryVerification(v);
  check('no Verified for unconfirmed status', r.verified === false && TRUST.isWineryVerified(v) === false,
    'status ' + JSON.stringify(v) + ' was treated as verified');
  check('no verified label for unconfirmed status', r.labelKey !== 'verified', 'status ' + JSON.stringify(v) + ' got the verified label');
}
check('verified is verified', TRUST.wineryVerification('verified').verified === true && TRUST.wineryVerification('verified').labelKey === 'verified',
  'the confirmed status "verified" was not shown as verified');
for (const v of [undefined, null, '', 'certified', 'pending', 42, true]) {
  check('unknown status renders nothing', TRUST.wineryVerification(v).labelKey === null,
    'unknown status ' + JSON.stringify(v) + ' got label ' + TRUST.wineryVerification(v).labelKey);
}
check('submitted alias normalised', TRUST.wineryVerification('submitted').status === 'documents_submitted', 'submitted alias not normalised');
for (const [payload, winery, want] of [
  [{ ownership_confirmed: true }, {}, true],
  [{ ownership_confirmed: 'true' }, {}, false],
  [{ ownership_confirmed: 1 }, {}, false],
  [{}, { ownership_confirmed: true }, true],
  [{ ownership_confirmed: false }, { ownership_confirmed: true }, false],
  [null, null, false]
]) {
  check('ownership only for boolean true', TRUST.ownershipConfirmed(payload, winery) === want,
    'ownershipConfirmed(' + JSON.stringify(payload) + ',' + JSON.stringify(winery) + ') !== ' + want);
}
for (const [u, want] of [
  ['https://winery.example/', 'https://winery.example/'], ['http://winery.example', 'http://winery.example'],
  ['javascript:alert(1)', ''], ['JaVaScRiPt:alert(1)', ''], [' javascript:alert(1)', ''], ['data:text/html,x', ''],
  ['//attacker.example', ''], ['vbscript:x', ''], [null, ''], [42, '']
]) {
  check('safeHttpUrl filters non-http', TRUST.safeHttpUrl(u) === want, 'safeHttpUrl(' + JSON.stringify(u) + ') returned ' + JSON.stringify(TRUST.safeHttpUrl(u)));
}

// ------------------------------------------------------ 5. page-level rules
for (const page of PASSPORT_PAGES) {
  const html = read(page);
  const m = html.match(/certified['"]?\s*[:=,)]|===?\s*['"]certified['"]/);
  check('no "certified" verified mapping', !m, page + ' still maps "certified": ' + (m ? m[0] : ''));
}
{
  const html = read('cap-qr-sticker.html');
  const tag = html.match(/<div class="cap-verified"[^>]*>/);
  check('sticker badge hidden by default', !!tag && /\shidden(\s|>)/.test(tag[0]), 'cap-qr-sticker.html badge tag is ' + (tag ? tag[0] : 'missing'));
  check('sticker badge hidden CSS', /\.cap-verified\[hidden\]\s*\{\s*display:\s*none/.test(html), 'cap-qr-sticker.html has no .cap-verified[hidden]{display:none} (author display wins over hidden)');
  check('sticker badge toggled by TT_TRUST', /getElementById\('capVerified'\)\.hidden\s*=\s*!TT_TRUST\.isWineryVerified\(/.test(html),
    'cap-qr-sticker.html does not toggle the badge via TT_TRUST.isWineryVerified');
  const targetReads = html.split('\n').filter(l => /\.get\(\s*['"]target['"]\s*\)/.test(l));
  check('QR target not from URL on production', targetReads.length > 0 && targetReads.every(l => /isLocal\s*\?/.test(l)),
    'cap-qr-sticker.html reads ?target= outside a local-host guard: ' + targetReads.map(l => l.trim()).join(' | '));
}
{
  const html = read('cap-onboarding.html');
  const tag = html.match(/<div class="cv"[^>]*>/);
  check('onboarding badge hidden by default', !!tag && /\shidden(\s|>)/.test(tag[0]), 'cap-onboarding.html badge tag is ' + (tag ? tag[0] : 'missing'));
  check('onboarding badge hidden CSS', /\.sticker \.cv\[hidden\]\s*\{\s*display:\s*none/.test(html), 'cap-onboarding.html has no .sticker .cv[hidden]{display:none}');
  check('onboarding badge toggled by TT_TRUST', /getElementById\("stVerified"\)\.hidden\s*=\s*!TT_TRUST\.isWineryVerified\(/.test(html),
    'cap-onboarding.html does not toggle the badge via TT_TRUST.isWineryVerified');
}
{
  const bs = read('bottle-scan.html');
  check('bottle-scan website filtered', /const website = TT_TRUST\.safeHttpUrl\(w\.website_url\)/.test(bs), 'bottle-scan.html builds the website href without TT_TRUST.safeHttpUrl');
  check('bottle-scan ownership strict', /TT_TRUST\.ownershipConfirmed\(d, w\)/.test(bs), 'bottle-scan.html does not use TT_TRUST.ownershipConfirmed');
  check('bottle-scan status via module', /TT_TRUST\.wineryVerification\(w\.verification_status\)/.test(bs), 'bottle-scan.html does not use TT_TRUST.wineryVerification');
  const wy = read('winery-passport.html');
  check('winery website filtered', /var website = TT_TRUST\.safeHttpUrl\(w\.website_url\)/.test(wy), 'winery-passport.html builds the website href without TT_TRUST.safeHttpUrl');
  check('winery ownership strict', /TT_TRUST\.ownershipConfirmed\(data, w\)/.test(wy), 'winery-passport.html does not use TT_TRUST.ownershipConfirmed');
  check('winery status via module', /TT_TRUST\.wineryVerification\(w\.verification_status\)\.status/.test(wy), 'winery-passport.html does not use TT_TRUST.wineryVerification');
  const wp = read('wine-passport.html');
  check('wine Research Edition via module', /TT_TRUST\.isWineryVerified\(raw\)/.test(wp), 'wine-passport.html does not decide Research Edition via TT_TRUST');
  const vp = read('vintage-passport.html');
  check('vintage shows no verification line', !/verification_status/.test(vp.replace(/\/\/[^\n]*/g, '')), 'vintage-passport.html still renders a vintage verification_status');
}

{
  const i18n = read(path.join('src', 'i18n', 'cap-i18n.js'));
  check('language switcher drops ?api= off local hosts', /if \(!keepApi\) params\.delete\("api"\);/.test(i18n) && /keepApi = !!\(window\.TT_TRUST && window\.TT_TRUST\.devApiOverride\(window\.location\)\)/.test(i18n),
    'src/i18n/cap-i18n.js wireSwitcher copies ?api= into language links without the TT_TRUST local-host guard');
}

console.log('passport trust checks: ' + pass + ' passed, ' + failures.length + ' failed');
for (const f of failures) console.log('  FAIL ' + f);
process.exit(failures.length ? 1 : 0);
