# Landing Route Coverage 01

## Summary

This audit compares implemented website HTML page sources, `src/config/pages.json`,
`src/config/routes.json`, and `vercel.json` rewrites for the Tasting & Toasting
website.

No HTML, JavaScript runtime, SEO metadata, translation content, CAP behavior,
pricing, route configuration, deployment configuration, or mobile application
files were modified.

## Inputs Inspected

- Physical HTML page sources: 25
- Registered pages in `src/config/pages.json`: 25
- Route policy entries in `src/config/routes.json`: 42
- Rewrites in `vercel.json`: 4
- Total route declarations inspected: 46

## Classification Summary

- Valid pages: 25
- Valid route policies connected to pages or registered aliases: 28
- Orphan pages: 0
- Registered pages with missing source files: 0
- Pages with no public route policy: 0
- Orphan routes: 0
- Broken routes: 0
- Duplicate routes: 0
- Conflicting routes: 0
- Intentional internal or restricted pages: 8
- Unknown cases requiring business review: 14
- Trailing-slash findings: 0
- File-extension findings: 0

## Pages Inspected

- `/` -> `index.html`
- `/prototype` -> `prototype.html`
- `/game-flow` -> `game-flow.html`
- `/operations` -> `operations.html`
- `/wave1` -> `wave1.html`
- `/legal` -> `legal.html`
- `/privacy` -> `privacy.html`
- `/terms` -> `terms.html`
- `/access` -> `access.html`
- `/cap-demo` -> `cap-demo.html`
- `/cap-onboarding` -> `cap-onboarding.html`
- `/cap-qr-sticker` -> `cap-qr-sticker.html`
- `/bottle-scan` -> `bottle-scan.html`
- `/winery-passport` -> `winery-passport.html`
- `/wine-passport` -> `wine-passport.html`
- `/vintage-passport` -> `vintage-passport.html`
- `/producer` -> `producer.html`
- `/tastings` -> `tastings.html`
- `/for` -> `for/index.html`
- `/winery-setup` -> `winery-setup/index.html`
- `/tamada-preview-xk7m9q2026` -> `tamada-preview-xk7m9q2026.html`
- `/_design/Bottle_Passport_Canonical` -> `_design/Bottle_Passport_Canonical.html`
- `/_design/Wine_Passport_Canonical` -> `_design/Wine_Passport_Canonical.html`
- `/_design/Vintage_Passport_Canonical` -> `_design/Vintage_Passport_Canonical.html`
- `/_design/Winery_Passport_Canonical` -> `_design/Winery_Passport_Canonical.html`

## Valid Routes

The audit found 28 valid route policies connected either to a registered page
source or to a registered Vercel rewrite alias:

- `/` -> `index.html`
- `/prototype` -> `prototype.html`
- `/game-flow` -> `game-flow.html`
- `/operations` -> `operations.html`
- `/wave1` -> `wave1.html`
- `/legal` -> `legal.html`
- `/privacy` -> `privacy.html`
- `/terms` -> `terms.html`
- `/access` -> `access.html`
- `/cap-demo` -> `cap-demo.html`
- `/cap-onboarding` -> `cap-onboarding.html`
- `/cap-qr-sticker` -> `cap-qr-sticker.html`
- `/bottle-scan` -> `bottle-scan.html`
- `/cap/b/:token` -> `/bottle-scan`
- `/winery-passport` -> `winery-passport.html`
- `/wine-passport` -> `wine-passport.html`
- `/vintage-passport` -> `vintage-passport.html`
- `/producer` -> `producer.html`
- `/tastings` -> `tastings.html`
- `/for` -> `for/index.html`
- `/for/:name` -> `/for`
- `/winery-setup` -> `winery-setup/index.html`
- `/winery-setup/:token` -> `/winery-setup`
- `/tamada-preview-xk7m9q2026` -> `tamada-preview-xk7m9q2026.html`
- `/_design/Bottle_Passport_Canonical` -> `_design/Bottle_Passport_Canonical.html`
- `/_design/Wine_Passport_Canonical` -> `_design/Wine_Passport_Canonical.html`
- `/_design/Vintage_Passport_Canonical` -> `_design/Vintage_Passport_Canonical.html`
- `/_design/Winery_Passport_Canonical` -> `_design/Winery_Passport_Canonical.html`

## Orphan Pages

None. Every physical HTML file is represented in `src/config/pages.json`.

## Orphan Routes

None among implemented current routes or deployment rewrites.

## Broken Routes

None. All current page routes resolve to existing HTML sources, and all
registered rewrite aliases resolve to registered destination pages.

## Duplicate Or Conflicting Routes

None. The audit found no duplicate route policy paths, duplicate Vercel rewrite
sources, normalized trailing-slash duplicates, or conflicting dynamic route
patterns.

## Intentional Internal Or Restricted Pages

These pages are registered, resolve to real source files, and are intentionally
non-indexable under current route policy:

- `/access` -> `access.html` (`restricted`)
- `/for` -> `for/index.html` (`restricted`)
- `/winery-setup` -> `winery-setup/index.html` (`restricted`)
- `/tamada-preview-xk7m9q2026` -> `tamada-preview-xk7m9q2026.html` (`internal`)
- `/_design/Bottle_Passport_Canonical` -> `_design/Bottle_Passport_Canonical.html` (`internal`)
- `/_design/Wine_Passport_Canonical` -> `_design/Wine_Passport_Canonical.html` (`internal`)
- `/_design/Vintage_Passport_Canonical` -> `_design/Vintage_Passport_Canonical.html` (`internal`)
- `/_design/Winery_Passport_Canonical` -> `_design/Winery_Passport_Canonical.html` (`internal`)

## Unknown Cases Requiring Business Review

These `routes.json` entries are explicitly marked `future-proposed`, are not
implemented physical HTML pages, and are not connected to registered page
entries. They are not broken deployment routes in the current website, but they
require business/product review before implementation or publication:

- `/wine-lovers`
- `/for-wineries`
- `/sommelier`
- `/blind-detective`
- `/collector`
- `/wine-library`
- `/wine-trade`
- `/experience-host`
- `/passport`
- `/heritage`
- `/technology`
- `/partners`
- `/about`
- `/contact`

## Trailing Slash And File Extension Behavior

`vercel.json` currently sets:

- `cleanUrls`: `true`
- `trailingSlash`: `false`

The route registry consistently uses extensionless routes without trailing
slashes, except for `/`. Directory index sources such as `for/index.html` and
`winery-setup/index.html` map to extensionless routes `/for` and
`/winery-setup`. No inconsistent trailing-slash or `.html` route registrations
were found.

## Validator

The audit validator lives at `tools/audit-route-coverage.py`. It checks:

- physical HTML sources missing from the page registry;
- registered page sources that do not exist;
- page routes missing from route policy;
- current route policies that do not resolve to a registered page;
- Vercel rewrite aliases that point to missing destination pages;
- page aliases missing from route policy or Vercel rewrites;
- duplicate route policy paths and duplicate rewrite sources;
- conflicting dynamic route patterns;
- trailing-slash and file-extension policy drift.

Run it with:

`python3 tools/audit-route-coverage.py`

Unit tests live in `tools/tests/test_route_coverage.py`.

## Validation Results

Final validation during this audit:

- `python3 tools/validate-foundation-config.py`: PASS
- `python3 tools/validate-page-registry.py`: PASS
- `python3 tools/audit-route-coverage.py`: PASS
- `python3 -m unittest discover -s tools/tests -p 'test_*route*.py'`: PASS
- `git diff --check`: PASS
- `git status --short`: expected modified/untracked audit files only
