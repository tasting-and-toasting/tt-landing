# Landing Page Registry 01

## Summary

This task adds a page registry foundation at `src/config/pages.json`. The registry describes implemented website pages only. It does not change page content, HTML, runtime JavaScript, SEO behavior, deployment rewrites, or route availability.

## Page Audit Scope

The audit found 25 HTML page sources:

- Main landing and prototypes: `/`, `/prototype`, `/game-flow`, `/operations`, `/wave1`
- Legal pages: `/legal`, `/privacy`, `/terms`
- Access, demo, and onboarding pages: `/access`, `/cap-demo`, `/cap-onboarding`, `/cap-qr-sticker`
- CAP passport pages: `/bottle-scan`, `/winery-passport`, `/wine-passport`, `/vintage-passport`
- Demo/product surfaces: `/producer`, `/tastings`
- Partner and setup flows: `/for`, `/winery-setup`
- Private preview: `/tamada-preview-xk7m9q2026`
- Design references: `/_design/Bottle_Passport_Canonical`, `/_design/Wine_Passport_Canonical`, `/_design/Vintage_Passport_Canonical`, `/_design/Winery_Passport_Canonical`

The registry also records existing route aliases for current deployment rewrites:

- `/cap/b/:token` aliases `/bottle-scan`
- `/for/:name` aliases `/for`
- `/winery-setup/:token` aliases `/winery-setup`

## Recorded Fields

Each page entry records:

- `id`
- `route`
- `source`
- `title`
- `product`
- `productIds`
- `public`
- `localized`
- `indexable`
- `routeAliases`
- `titleSource`
- `notes`

`product` is the primary product for quick review. `productIds` preserves the existing multi-product mapping used by route policy.
`public`, `localized`, and `indexable` are explicit booleans.

## Localization Findings

Pages marked localized have either `data-i18n` attributes, related i18n attributes, `src/i18n/apply-tt141.js`, or `src/i18n/cap-i18n.js`.

The registry records localization status only. It does not generate translations, rewrite dictionaries, or connect standalone pages to the shared locale registry.

## Indexability Findings

`indexable` follows current route policy metadata:

- `true` for pages whose route policy is `public-indexable`
- `false` for `public-noindex`, `restricted`, and `internal` pages

This is metadata only. No robots tags, canonical tags, sitemap entries, deployment settings, or HTML files were changed.

## Public And Private Classification

`publicAccess` is `public` for public route-policy surfaces, including public-noindex prototypes and demos. It is `private` for restricted partner flows, internal previews, and design reference templates.

## Validation

`tools/validate-page-registry.py` validates that:

- every HTML source is represented exactly once;
- every page ID is unique;
- every page route exists in `routes.json`;
- route aliases match existing `vercel.json` rewrites and exist in `routes.json`;
- product references exist in `products.json`;
- titles match HTML titles when `titleSource` is `html-title`;
- pages without HTML titles are explicitly marked `filename-derived`;
- localized flags match current HTML signals;
- public/private and indexable flags agree with route policy.

Unit tests live in `tools/tests/test_page_registry.py`.

## Not Modified

- HTML files were not modified.
- Browser runtime JavaScript was not modified.
- CAP runtime JavaScript was not modified.
- SEO files and meta tags were not modified.
- Deployment configuration was not modified.
- Translation payloads were not modified.
- Page copy and titles were not edited.

## Recommended Next Step

Use `pages.json` as the review input for a later SEO-routing task that can decide which indexable-policy pages should actually receive robots, canonical, sitemap, and hreflang implementation.
