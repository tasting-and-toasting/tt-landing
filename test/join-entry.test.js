'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const PAGE = path.join(ROOT, 'join/index.html');
const DICT = path.join(ROOT, 'src/i18n/tt141-features.json');

/* Server alphabet, tt-stack api/src/payments/game_join.ts. No I, L, O, U. */
const PASS_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

const LANGS = ['en', 'fr', 'ru', 'es', 'uk', 'it', 'de', 'he', 'pt', 'ka', 'ro', 'pl'];

const PAGE_KEYS = [
  'join_body_ask',
  'join_body_bad',
  'join_body_ok_v2',
  'join_byhand_label',
  'join_code_label',
  'join_field_label',
  'join_footnote_scanner',
  'join_footnote_wrong',
  'join_footnote_wrong_link',
  'join_have_app_label',
  'join_hint_open',
  'join_hint_web',
  'join_kick',
  'join_no_app_label',
  'join_noscript_body',
  'join_noscript_title',
  'join_open_app',
  'join_pass_note',
  'join_play_web',
  'join_step_join',
  'join_step_open',
  'join_step_type',
  'join_store_hint',
  'join_submit',
  'join_title_ask',
  'join_title_bad',
  'join_title_ok',
];

function passOf(length) {
  let out = '';
  while (out.length < length) out += PASS_ALPHABET;
  return out.slice(0, length);
}

function extractInlineBody(html) {
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const inline = [];
  let match;
  while ((match = re.exec(html))) {
    if (!/\bsrc\s*=/i.test(match[1])) inline.push(match[2]);
  }
  if (inline.length !== 1) {
    throw new Error('STOP: expected exactly one inline script in join/index.html, found ' + inline.length);
  }
  const wrapped = inline[0].match(/^\s*\(function\s*\(\s*\)\s*\{([\s\S]*)\}\)\(\);\s*$/);
  if (!wrapped) {
    throw new Error('STOP: cannot strip the outer (function () { ... })(); wrapper. The page was not modified.');
  }
  return wrapped[1];
}

function loadPage(html) {
  const elements = new Map();
  function makeEl() {
    return {
      innerHTML: '',
      textContent: '',
      value: '',
      selectionStart: 0,
      selectionEnd: 0,
      addEventListener() {},
      setSelectionRange() {},
      focus() {},
    };
  }
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeEl());
      return elements.get(id);
    },
  };
  const window = {
    TT_I18N: undefined,
    location: {
      search: '',
      pathname: '/join',
      assign() {},
    },
  };
  const sandbox = {
    document,
    window,
    URLSearchParams,
    console,
  };
  vm.createContext(sandbox);
  const body = extractInlineBody(html);
  const tail = `
    var __join = {
      normalizeCode: normalizeCode,
      normalizePass: normalizePass,
      appLink: appLink,
      webLink: webLink,
      renderCode: renderCode,
      storeBlock: storeBlock
    };
  `;
  vm.runInContext(body + '\n' + tail, sandbox, { filename: 'join/index.html' });
  if (!sandbox.__join || typeof sandbox.__join.normalizeCode !== 'function') {
    throw new Error('STOP: page functions did not become visible after stripping the wrapper. The page was not modified.');
  }
  return { api: sandbox.__join, stage: elements.get('stage') };
}

const html = fs.readFileSync(PAGE, 'utf8');
const page = loadPage(html);
const api = page.api;

function pageKeys(source) {
  const found = new Set();
  const re = /data-i18n(?:-html)?=(["'])([^"']+)\1/g;
  let match;
  while ((match = re.exec(source))) found.add(match[2]);
  return [...found].sort();
}

test('normalizeCode keeps ABC234', () => {
  assert.equal(api.normalizeCode('ABC234'), 'ABC234');
});

test('normalizeCode uppercases abc234', () => {
  assert.equal(api.normalizeCode('abc234'), 'ABC234');
});

test('normalizeCode strips the hyphen in ABC-234', () => {
  assert.equal(api.normalizeCode('ABC-234'), 'ABC234');
});

test('normalizeCode rejects ABC23', () => {
  assert.equal(api.normalizeCode('ABC23'), null);
});

test('normalizeCode rejects ABC2345', () => {
  assert.equal(api.normalizeCode('ABC2345'), null);
});

test('normalizePass accepts 12 alphabet characters', () => {
  const pass = passOf(12);
  assert.equal(pass.length, 12);
  assert.equal(api.normalizePass(pass), pass);
});

test('normalizePass rejects a value containing I', () => {
  assert.equal(api.normalizePass(passOf(31) + 'I' + passOf(32)), null);
});

test('normalizePass rejects a value containing L', () => {
  assert.equal(api.normalizePass(passOf(31) + 'L' + passOf(32)), null);
});

test('normalizePass rejects a value containing O', () => {
  assert.equal(api.normalizePass(passOf(31) + 'O' + passOf(32)), null);
});

test('normalizePass rejects a value containing U', () => {
  assert.equal(api.normalizePass(passOf(31) + 'U' + passOf(32)), null);
});

test('normalizePass rejects 11 characters', () => {
  assert.equal(api.normalizePass(passOf(11)), null);
});

test('normalizePass accepts 64 characters', () => {
  const pass = passOf(64);
  assert.equal(pass.length, 64);
  assert.equal(api.normalizePass(pass), pass);
});

test('normalizePass rejects 65 characters', () => {
  assert.equal(api.normalizePass(passOf(65)), null);
});

test('webLink drops an invalid pass and keeps the game code', () => {
  const link = api.webLink(api.normalizeCode('abc234'), api.normalizePass('PREPAIDTOKEN987'));
  assert.equal(api.normalizePass('PREPAIDTOKEN987'), null);
  assert.ok(link.includes('/join/ABC234'), link);
  assert.equal(link.includes('pass='), false, link);
});

test('a valid pass is carried in full by webLink and appLink', () => {
  const pass = passOf(64);
  const web = api.webLink('ABC234', pass);
  const app = api.appLink('ABC234', pass);
  assert.equal(web, 'https://web.tastingandtoasting.com/join/ABC234?pass=' + pass);
  assert.equal(app, 'tastingandtoasting://join/ABC234?pass=' + pass);
});

test('appLink starts with the app scheme', () => {
  assert.equal(api.appLink('ABC234', null).startsWith('tastingandtoasting://join/'), true);
  assert.equal(api.appLink('ABC234', passOf(12)).startsWith('tastingandtoasting://join/'), true);
});

test('empty store urls render no store links and no empty href', () => {
  const stores = api.storeBlock();
  assert.equal(stores.includes('App Store'), false, stores);
  assert.equal(stores.includes('Google Play'), false, stores);
  assert.equal(stores.includes('href=""'), false, stores);

  api.renderCode('ABC234', null);
  const rendered = page.stage.innerHTML;
  assert.equal(rendered.includes('App Store'), false, rendered);
  assert.equal(rendered.includes('Google Play'), false, rendered);
  assert.equal(rendered.includes('href=""'), false, rendered);
});

test('every data-i18n key used by the page exists in all 12 languages', () => {
  const keys = pageKeys(html);
  assert.deepEqual(keys, PAGE_KEYS);

  const dict = JSON.parse(fs.readFileSync(DICT, 'utf8'));
  assert.deepEqual(Object.keys(dict).sort(), [...LANGS].sort());

  const missing = [];
  for (const lang of LANGS) {
    const table = dict[lang];
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(table, key)) {
        missing.push('key "' + key + '" language "' + lang + '"');
      }
    }
  }
  assert.equal(
    missing.length,
    0,
    'missing data-i18n keys:\n' + missing.join('\n')
  );
});
