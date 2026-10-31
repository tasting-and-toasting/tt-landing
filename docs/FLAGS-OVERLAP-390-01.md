# FLAGS-OVERLAP-390-01

**Task:** FLAGS-OVERLAP-390-01  
**Repo:** tt-landing  
**Branch:** `fix/flags-overlap-390-01`  
**Date:** 31.10.2026  
**Page:** `wine-passport.html` (public wine passport)

## Problem

On viewport width 390px, the language flag switcher wraps to a second row. The header (`.brandbar`) used a fixed `height: 58px` (`wine-passport.html:25`). With `flex-wrap: wrap`, wrapped flag rows exceeded the header box (flags extended to ~93px while the bar stayed 58px), causing visual overlap with the header label «Wine passport» / «WINE PASSPORT» and bleeding into the page below.

## Reproduction (before fix)

- Local: `python3 -m http.server 8765` from repo root, open `http://127.0.0.1:8765/wine-passport.html?wineId=test&winerySlug=test`
- Viewport: 390×844, DPR 2 (browser emulation)
- Measured (before): `brandbarHeight` 58px, `flagsRect.bottom` 93px, `docScrollWidth` 390 (no horizontal scroll)
- Screenshot: `docs/screenshots/flags-overlap-390-before.png`

## Change

| File | Line | Before | After |
|------|------|--------|-------|
| `wine-passport.html` | 25 | `.brandbar{height:58px;...}` | `.brandbar{min-height:58px;...}` |

Only the wine passport page was changed. Other pages (`winery-passport.html`, `vintage-passport.html`, etc.) keep their own inline header styles and were not modified.

## Verification (after fix)

Same URL locally; checks via layout measurement in the browser.

| Width | `brandbarHeight` | Flags inside header | Flag/`ctx` overlap | Horizontal scroll |
|-------|------------------|---------------------|--------------------|-------------------|
| 320 | 103px | yes | no | no |
| 390 | 103px | yes | no | no |
| 1280 | 58px | yes | no | no |

Screenshots:

- `docs/screenshots/flags-overlap-390-after.png`
- `docs/screenshots/flags-overlap-1280-after.png`

## Out of scope (unchanged)

- Page body content, API, redirects, deploy
- Other HTML files in the repo

## Git

- Commit on `fix/flags-overlap-390-01`
- PR base: `main` (merge not performed by agent)
