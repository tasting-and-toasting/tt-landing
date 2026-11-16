# Verification status display — rules for the public passport pages

Task: SECURITY B1 (`security/b1-passport-display-integrity`), 2026-11-16.
Applies to: `bottle-scan.html` (`/cap/b/:token`), `wine-passport.html`, `vintage-passport.html`,
`winery-passport.html`, `cap-qr-sticker.html`, `cap-onboarding.html`; the wording rules of section 3a
also apply to the static demo pages `producer.html` and `cap-demo.html`.
Owner decision D5 (OD-16, 2026-11-16) is recorded in section 3a.
Single implementation: `src/passport/tt-trust.js` (`window.TT_TRUST`). Pages do not re-implement these rules.
Regression checks: `node tools/security/check-passport-trust.js` (offline, no dependencies);
optional browser check `tools/security/browser-check-passport-trust.js` (Playwright, every request intercepted).

## 1. Where the data may come from

| Host the page runs on | API base | `?api=` |
|---|---|---|
| Any non-local host (production, `www`, Vercel previews) | `https://tt-stack-prod.onrender.com/api/cap` (allowlist `TT_TRUST.ALLOWED_API_ORIGINS`) | ignored, and not copied into in-site or language links |
| `localhost`, `127.x.x.x`, `::1`, `0.0.0.0` (exact match, not prefix) | `http://localhost:8088/api/cap`, or the `?api=` value if it is an `http(s)` URL | honoured, for development only |

`vercel.json` sends a `Content-Security-Policy` on every passport route whose `connect-src` is exactly
`'self'` plus the allowlisted API origin(s). Adding an API origin means changing both
`TT_TRUST.ALLOWED_API_ORIGINS` and the `connect-src` of every passport route in `vercel.json`;
the regression check fails if they disagree.

`cap-qr-sticker.html` always encodes `https://tastingandtoasting.com/cap/b/<token>` in the QR.
`?target=` is accepted only on a local host and only as an `http(s)` URL.

## 2. What counts as "verified"

Source of truth: tt-stack `api/src/cap/wineryVerificationLifecycle.ts` (identical on `origin/main` and
`origin/v3/foundation` at the time of writing) and the public routes in `api/src/routes/cap.ts`.

- Only the **winery** has a verification state in the API contract: `cap_wineries.verification_status`,
  one of `claimed`, `documents_submitted`, `under_review`, `verified`, `rejected`
  (`submitted` is an input alias for `documents_submitted`).
- `verified` is reached only by a reviewer decision `under_review → verified`. It is the **only**
  value that is a confirmed verification decision.
- Wine, vintage and bottle verification are not exposed: the public routes omit them on purpose
  ("no writer, frozen at 'claimed'"). Pages therefore never show a verification state for a wine,
  vintage or bottle.
- Ownership confirmation (`ownership_confirmed`, `ownership_badge`) is a separate signal from
  verification. It counts only when the API sends the boolean `true`.

## 3. Display rules

| API value of winery `verification_status` | Shown |
|---|---|
| `verified` (exact) | "Verified" label, always named as the winery's (see 3a); the sticker shows nothing about it |
| `under_review` | neutral "Under review" |
| `documents_submitted` / `submitted` | neutral "Submitted" |
| `claimed` | neutral "Claimed" / "Producer-asserted" |
| `rejected` | "Not verified" |
| missing, empty, unknown (`certified`, `approved`, other casing such as `Verified`, non-string) | **nothing** — no badge, no guessed label |

| API value of `ownership_confirmed` | Shown |
|---|---|
| boolean `true` | ownership badge (API text, escaped, or the page's fallback text) |
| anything else (`false`, `"true"`, `1`, missing) | no ownership badge and no ownership text |

Wine passport: the "Research Edition" tag appears when the winery has a non-empty status that is not
`verified` (so `certified` now gets the tag; before it was treated as verified).

### 3a. Owner decision D5 — whose status, and nothing verified on paper

1. **Printed sticker** (`cap-qr-sticker.html`) and the **onboarding sticker preview** (`cap-onboarding.html`)
   carry **no** "CAP Verified" / "verified" text at all, for any status, ever. They show the neutral
   identification text exactly `Digital Wine Passport`. It is deliberately not translated: there is no
   established translation key for it, so it is plain markup without `data-i18n` / `data-wz`
   (`translate="no"`), and the old `cap_verified` keys were removed from `src/i18n/cap-i18n.js` and from
   the onboarding dictionary so they cannot be re-attached. The shield-with-tick icon was removed with it.
2. The **current** verification status is shown only on the digital page reached by the QR scan
   (`/cap/b/:token` = `bottle-scan.html`), from the API at the moment of the scan.
3. A verification status is the **winery's** status and every page that shows one names the winery
   in the same label. It is never shown as, or next to, a claim that the wine, vintage, batch or bottle
   is verified.

| Page | What it shows | Labelled as |
|---|---|---|
| `bottle-scan.html` | winery status badge inside the "Winery" section | `Winery · Verification status: …` (existing keys `winery` + `vsPrefix` + `vs_*`) |
| `winery-passport.html` | status chip in the winery hero | `Winery · Verified` etc. (existing keys `kick` + `b_*`); ownership fallback likewise |
| `wine-passport.html` | no verified label; "Research Edition" tag for a non-verified winery | n/a — a verified winery adds nothing to the wine |
| `vintage-passport.html` | no verification line at all | n/a |
| ownership badge (all pages) | API text, which tt-stack sets to `Verified Winery` (`ownershipResolver.ts consumerOwnershipBadge`) | names the winery |
| `producer.html` (static demo, fictional producer) | `CAP verified producer` | names the producer (= winery); unchanged |
| `cap-demo.html` (static demo) | passport mock seal `WINERY VERIFIED` / `Winery status — not a verdict on this bottle`; passport footers `DIGITAL WINE PASSPORT · …` | names the winery; was `VERIFIED` / `Verified & traceable` / `VERIFIED BY …` on a bottle mock |


### 3b. Owner decision OD-17 D2 — wizard headline and the wording sweep (SECURITY B3)

1. **Winery wizard headline** (`cap-onboarding.html`, `<h1 data-wz-html="title">` and the `title` key in all
   12 wizard dictionaries) says what the wizard makes, not a verification result:

| Lang | Headline (emphasis on the "digital" word) | Note |
|---|---|---|
| en | Create your winery's digital passport | owner wording |
| ru | Создайте цифровой паспорт вашей винодельни | owner wording |
| fr | Créez le passeport numérique de votre domaine | |
| es | Crea el pasaporte digital de tu bodega | |
| uk | Створіть цифровий паспорт вашої виноробні | |
| it | Crea il passaporto digitale della tua cantina | |
| de | Erstellen Sie den digitalen Pass Ihres Weinguts | |
| he | צרו את הדרכון הדיגיטלי של היקב שלכם | needs native review |
| pt | Crie o passaporte digital da sua quinta | |
| ka | შექმენით თქვენი მარნის ციფრული პასპორტი | needs native review |
| ro | Creează pașaportul digital al cramei tale | needs native review |
| pl | Stwórz cyfrowy paszport swojej winnicy | |

2. **Rule.** On the passport, onboarding, sticker and demo pages, "verified" / «подтверждён» / "confirmed"
   and their equivalents in the 12 languages are never a general status of a wine, vintage, bottle or
   winery. The only permitted uses are: the winery's own status, labelled as the winery's, rendered from
   the API (`TT_TRUST`), or demo text that names the winery/producer; negative or failure text ("Not
   verified", "This bottle could not be verified"); the verb "to check".
3. **Sweep changes (B3):** `cap-demo.html` bottle chain banner `Chain confirmed` → `Chain recorded` (6 demo
   languages); `producer.html` footer `Verified by Tasting & Toasting CAP` → `Digital Wine Passport ·
   Tasting & Toasting CAP` (9 languages); unused bottle-level keys `verified_h` ("Verified & Traceable")
   and `verified_facts` ("Verified Facts") removed from `src/i18n/cap-i18n.js` (12 languages each).
4. **Enforcement.** `tools/security/check-passport-trust.js` section 6 extracts every user-visible text
   (dictionary values, string literals, HTML text) on these pages that carries a status word and fails
   unless its key is on the reviewed list (`ALLOWED_KEYS`: W winery-scoped, N negative, X defined but not
   rendered, V verb). Adding a key to that list is a product decision, not a test fix.

## 4. Other rules on the same pages

- Every value from the API that becomes an `href` must pass `TT_TRUST.safeHttpUrl` (only `http:`/`https:`).
- All API text goes through the page's HTML escaper before `innerHTML`.
- `cap-qr-sticker.html` and `cap-onboarding.html` contain no verification markup and no verification
  logic (D5); the regression check fails if either page mentions "verified" or calls `isWineryVerified`.

## 5. Known limits

- A printed sticker keeps whatever it printed. Resolved by D5: no sticker printed from this version carries
  a verification claim. Stickers printed earlier from a version that showed "CAP Verified" stay as printed.
- The pages show what the T&T API says. There is no signature, hash or independent proof on any page;
  "Verified" means "the T&T API returned `verified` for this winery".
- `script-src` keeps `'unsafe-inline'` because every page runs inline scripts; moving them to files would
  allow a stricter policy.
