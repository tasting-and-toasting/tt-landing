# Verification status display — rules for the public passport pages

Task: SECURITY B1 (`security/b1-passport-display-integrity`), 2026-11-16.
Applies to: `bottle-scan.html` (`/cap/b/:token`), `wine-passport.html`, `vintage-passport.html`,
`winery-passport.html`, `cap-qr-sticker.html`, `cap-onboarding.html`.
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
| `verified` (exact) | "Verified" badge / label; sticker and onboarding preview show "CAP Verified" |
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

## 4. Other rules on the same pages

- Every value from the API that becomes an `href` must pass `TT_TRUST.safeHttpUrl` (only `http:`/`https:`).
- All API text goes through the page's HTML escaper before `innerHTML`.
- `CAP Verified` markup in `cap-qr-sticker.html` and `cap-onboarding.html` is `hidden` by default and
  is shown only by `TT_TRUST.isWineryVerified(...)`.

## 5. Known limits

- A printed sticker keeps whatever it printed. A winery verified at print time and later rejected still
  has "CAP Verified" on its bottles. Whether printed stickers should carry a verification claim at all is
  an owner decision.
- The pages show what the T&T API says. There is no signature, hash or independent proof on any page;
  "Verified" means "the T&T API returned `verified` for this winery".
- `script-src` keeps `'unsafe-inline'` because every page runs inline scripts; moving them to files would
  allow a stricter policy.
