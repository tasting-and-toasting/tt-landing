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
// Owner decision D5: the printed sticker and the onboarding sticker preview never carry a
// verification claim; they show the neutral text exactly "Digital Wine Passport" (not translated).
function stripComments(src) { return src.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1'); }
function verifWords(src) { return (src.match(/[^\s<>"'`]*verif[^\s<>"'`]*/gi) || []); }
{
  const html = read('cap-qr-sticker.html');
  const code = stripComments(html);
  const words = verifWords(code);
  check('D5 sticker: no "verified" text or logic anywhere', words.length === 0, 'cap-qr-sticker.html still contains: ' + words.join(', '));
  const id = code.match(/<div class="cap-id" id="capIdentity"([^>]*)>([^<]*)<\/div>/);
  check('D5 sticker: neutral identification text', !!id && id[2] === 'Digital Wine Passport', 'cap-qr-sticker.html identification line is ' + (id ? JSON.stringify(id[2]) : 'missing'));
  check('D5 sticker: identification not translated or hidden', !!id && !/data-i18n|data-wz|hidden/.test(id[1]), 'cap-qr-sticker.html identification attributes: ' + (id ? id[1] : 'missing'));
  const targetReads = html.split('\n').filter(l => /\.get\(\s*['"]target['"]\s*\)/.test(l));
  check('QR target not from URL on production', targetReads.length > 0 && targetReads.every(l => /isLocal\s*\?/.test(l)),
    'cap-qr-sticker.html reads ?target= outside a local-host guard: ' + targetReads.map(l => l.trim()).join(' | '));
}
{
  const html = read('cap-onboarding.html');
  const code = stripComments(html);
  const a = code.indexOf('<div class="sticker">');
  const b = a < 0 ? -1 : code.indexOf('<div class="surl"', a);
  const block = a < 0 || b < 0 ? '' : code.slice(a, b);
  check('D5 onboarding: sticker preview found', block.length > 0, 'cap-onboarding.html sticker preview block not found');
  const words = verifWords(block);
  check('D5 onboarding: sticker preview has no "verified" text', words.length === 0, 'cap-onboarding.html sticker preview contains: ' + words.join(', '));
  const id = block.match(/<div class="cid" id="stIdentity"([^>]*)>([^<]*)<\/div>/);
  check('D5 onboarding: neutral identification text', !!id && id[2] === 'Digital Wine Passport', 'cap-onboarding.html sticker identification is ' + (id ? JSON.stringify(id[2]) : 'missing'));
  check('D5 onboarding: identification not translated or hidden', !!id && !/data-i18n|data-wz|hidden/.test(id[1]), 'cap-onboarding.html identification attributes: ' + (id ? id[1] : 'missing'));
  check('D5 onboarding: no verified toggle', !/isWineryVerified\(/.test(code) && !/stVerified/.test(code), 'cap-onboarding.html still toggles a verified line');
  check('D5 onboarding: cap_verified key removed', !/cap_verified/.test(code), 'cap-onboarding.html still defines/uses cap_verified');
}
{
  const i18n = read('src/i18n/cap-i18n.js');
  check('D5 i18n: cap_verified key removed', !/cap_verified/.test(i18n), 'src/i18n/cap-i18n.js still defines cap_verified (' + (i18n.match(/cap_verified/g) || []).length + 'x)');
}
// Owner decision D5: a verification status is the WINERY's and the label says so.
{
  const bs = read('bottle-scan.html');
  const line = bs.split('\n').find(l => /if \(vs\.labelKey\) badges\.push\(/.test(l)) || '';
  check('D5 bottle: status badge names the winery', /data-status-subject="winery"/.test(line) && /esc\(ui\('winery'\)\)\+' · '\+esc\(ui\('vsPrefix'\)\)/.test(line),
    'bottle-scan.html status badge is not labelled as the winery\'s: ' + line.trim().slice(0, 160));
  const wy = read('winery-passport.html');
  check('D5 winery: status chip names the winery', /var st = wineryStatusLabel\(statusLabel\(status\)\);/.test(wy), 'winery-passport.html status chip is not wrapped by wineryStatusLabel');
  check('D5 winery: ownership fallback names the winery', /text\(ownershipBadge\) \|\| wineryStatusLabel\(CAP\.t\('b_verified'\)\)/.test(wy), 'winery-passport.html ownership fallback is a bare "Verified"');
  check('D5 winery: label helper prefixes the winery word', /function wineryStatusLabel\(label\)\{ return label \? L\('kick'\) \+/.test(wy), 'winery-passport.html wineryStatusLabel does not prefix L(\'kick\')');
  for (const page of ['wine-passport.html', 'vintage-passport.html']) {
    const code = stripComments(read(page));
    const uses = (code.match(/(?:\bt|\bL|\bui|CAP\.t)\(\s*['"](?:vs_verified|b_verified|vs)['"]|['"]vs_['"]\s*\+/g) || []);
    check('D5 ' + page + ': renders no verification label', uses.length === 0, page + ' renders a verification label: ' + uses.join(', '));
  }
}
{
  const demo = read('cap-demo.html');
  const bad = [];
  for (const re of [/>\s*VERIFIED\s*</g, /Verified &(?:amp;)? traceable/g, /Zweryfikowane i identyfikowalne/g, /ZWERYFIKOWANY/g, /VERIFIED BY/g]) for (const m of demo.match(re) || []) bad.push(m);
  for (const m of demo.matchAll(/pp_verified:`([^`]*)`/g)) if (!/^WINERY /.test(m[1])) bad.push('pp_verified:' + m[1]);
  check('D5 cap-demo: no wine/bottle-level verified claim', bad.length === 0, 'cap-demo.html still shows: ' + bad.join(' | '));
  check('D5 cap-demo: seal names the winery', /<div class="seal-status">WINERY VERIFIED<\/div>/.test(demo), 'cap-demo.html passport seal is not "WINERY VERIFIED"');
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
