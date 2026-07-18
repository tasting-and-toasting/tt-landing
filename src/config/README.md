# Landing Foundation Config

These registries are the canonical planning and implementation foundation for the landing rewrite, but they are not yet automatically wired into every legacy HTML page.

## Files

- `locales.json` defines the canonical public locale registry.
- `products.json` defines product truth, public status, CTA status, evidence level, pricing state, and safe versus unsafe public claims.
- `routes.json` defines current and proposed public route policy, including access, indexability, locale strategy, product mapping, and data/prototype-commerce risk.

## Locale Policy

The canonical public locale set is 12 languages, in this order:

`en`, `fr`, `ru`, `es`, `uk`, `it`, `de`, `he`, `pt`, `ka`, `ro`, `pl`.

Do not delete Polish. Do not delete French. Do not preserve an artificial 11-language limit.

English (`en`) is the technical default and fallback locale. Russian (`ru`) is the master editorial language for the future rewrite. That editorial workflow does not make Russian the technical fallback.

Hebrew (`he`) is the only RTL locale. All other canonical locales are LTR.

Runtime support and complete page translation are different facts. The shared runtime and CAP runtime can expose a locale while standalone pages, legacy scripts, legal pages, partner forms, and prototypes may still have partial or inconsistent language coverage.

Python translation tooling consumes `locales.json` through `tools/locale_registry.py` for canonical locale order, non-default translation targets, default locale, editorial master locale, and RTL locale checks. This does not mean browser runtime scripts, CAP runtime scripts, standalone pages, or translation payload content are all automatically generated from the registry.

## Product Policy

Public product status vocabulary:

- `live`
- `preview`
- `preparing`
- `planned`
- `partner-pilot`
- `internal`

CTA status vocabulary:

- `live`
- `demo`
- `preview`
- `waitlist`
- `request-access`
- `partner-inquiry`
- `internal`
- `disabled`

Evidence-level vocabulary:

- `exists-in-code`
- `wired`
- `reachable`
- `deployment-configured`
- `live-verified`
- `unknown`

Pricing status must not invent prices. Current supported values are `unpublished`, `prototype-only`, `provisional-owner-supplied`, and `not-applicable`. Use owner-supplied provisional pricing only where explicitly supplied.

Product cards should eventually consume `products.json` so public pages do not drift from owner-approved product status, safe claim language, CTA state, and pricing rules.

Important separations:

- CAP Passport and Bottle Identity are not EU QR or EU e-label compliance.
- Sommelier Passport is not consumer Taste Profile.
- Collector is not Wine Library.
- Wine Trade is not consumer Marketplace.
- Experience Host is not winery onboarding.
- Heritage Passport is not CAP Passport.

## Route Policy

Route access vocabulary:

- `public-indexable`
- `public-noindex`
- `restricted`
- `internal`
- `legacy-review`

SEO work should eventually consume `routes.json` for robots, sitemap, canonical, hreflang, and noindex decisions. This task records policy only and intentionally does not change HTML meta tags.

Current policy intent:

- Public-indexable candidates include `/`, approved legal pages, approved public CAP passport pages, and future approved product pages.
- Public-noindex candidates include prototypes, demos, and unapproved production-looking surfaces.
- Restricted or internal candidates include access flows, partner forms, winery setup, private previews, and design templates.

Future pages must consume these registries before publishing marketing copy, product cards, CTAs, locale switchers, SEO metadata, or route access policy.
