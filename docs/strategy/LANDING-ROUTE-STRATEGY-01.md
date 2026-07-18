# Landing Route Strategy 01

Task: `LANDING-ROUTE-STRATEGY-01`

Scope: Tasting & Toasting website route strategy only. This document classifies
the 14 future-proposed website routes that currently have route policy entries
but no registered HTML source. It does not create routes, pages, HTML, SEO
metadata, translations, deployment behavior, pricing, CAP behavior, runtime code,
or mobile application behavior.

## Inputs Inspected

- `src/config/pages.json`
- `src/config/routes.json`
- `src/config/products.json`
- `src/config/README.md`
- `docs/audits/LANDING-PAGE-REGISTRY-01.md`
- `docs/audits/LANDING-ROUTE-COVERAGE-01.md`
- `docs/audits/LANDING-FOUNDATION-LEGACY-CONFLICTS-01.md`
- Existing HTML titles and `h1`/`h2` headings
- `index.html`, `operations.html`, `prototype.html`, `game-flow.html`,
  `wave1.html`, `for/index.html`, `tastings.html`, `cap-demo.html`,
  `cap-onboarding.html`
- `README.md`

## Decision Principles

- Do not invent product capabilities beyond the product registry and current
  HTML evidence.
- Do not treat prototype UI, pricing, checkout, booking, app screens, or
  operational flows as live public product capability.
- Prefer one strong public page per audience and conversion goal.
- Keep restricted partner/setup workflows separate from public marketing pages.
- Keep CAP Passport claims limited to traceability, recorded provenance,
  verification status, and public passport data.
- Keep overlapping product names distinct where the registries explicitly say
  not to merge them.
- A route classified as `CONSOLIDATE_INTO_EXISTING_PAGE` must not be represented
  as a standalone top-navigation destination.

## Decision Groups

- `APPROVED_ARCHITECTURAL_RECOMMENDATION`: Codex can recommend the IA decision
  from existing route, product, and page evidence without Maksim deciding product
  scope.
- `IMPLEMENTATION_INPUT_REQUIRED`: The IA decision is clear, but page copy, CTA,
  evidence selection, privacy wording, or audience prioritization is still
  needed before implementation.
- `EXECUTIVE_PRODUCT_DECISION_REQUIRED`: A real product, naming, commercial, or
  evidence decision from Maksim is required before the route can be approved.

## Classification Vocabulary

- `CREATE_STANDALONE_PAGE`: build a public website page when implementation is
  approved.
- `CONSOLIDATE_INTO_EXISTING_PAGE`: do not build a separate route; place the
  content into an existing or recommended parent page/section.
- `PRODUCT_DETAIL_PAGE_LATER`: valid product direction, but not a Phase 1
  standalone page.
- `APPLICATION_FEATURE_NOT_WEBSITE_PAGE`: product/app functionality that should
  not become a website route by default.
- `INTERNAL_OR_RESTRICTED`: route content belongs behind access control or in a
  non-indexed partner/internal workflow.
- `REMOVE_FROM_ROUTE_STRATEGY`: route should be removed from future website IA.
- `BUSINESS_DECISION_REQUIRED`: route cannot be classified safely without
  Maksim's explicit naming, audience, product, or legal/commercial decision.

## Classification Table

| Route | Classification | Decision group | User audience | Intended website purpose | Closest existing page or route | Equivalent content already exists | Duplication risk | SEO value | Navigation value | Conversion value | Recommended action | Confidence | Unresolved business question |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/wine-lovers` | `CREATE_STANDALONE_PAGE` | `IMPLEMENTATION_INPUT_REQUIRED` | Consumers, members, tasting groups | Consumer umbrella page for wine discovery, tastings, membership interest, blind tasting, tasting notes, and social toasts in pre-launch language. | `/`, `/prototype`, `/wave1`, `/game-flow` | Partial: prototypes and homepage describe the consumer direction, but they are not approved public product pages. | Medium | High | High | High | Build as a Phase 1 public consumer page; consolidate Blind Tasting, Tasting Notes, Toasts, Marketplace, Premium, and Taste Profile as sections until standalone demand is proven. | High | Implementation input only: exact CTA and launch-state copy. |
| `/for-wineries` | `CREATE_STANDALONE_PAGE` | `IMPLEMENTATION_INPUT_REQUIRED` | Wineries and producers | Winery-facing page for preparing public digital passport data, explaining onboarding inquiry, and setting boundaries around QR/e-label concepts. | `/cap-onboarding`, `/winery-passport`, `/producer`, `/winery-setup` | Partial: onboarding/demo/passport surfaces exist, but restricted setup and demo pages are not public marketing pages. | Medium | High | High | High | Build as a Phase 1 B2B winery page; keep setup, uploads, and partner data collection restricted/noindex. | High | Implementation input only: reviewed copy, CTA, and compliance disclaimers. |
| `/sommelier` | `CREATE_STANDALONE_PAGE` | `IMPLEMENTATION_INPUT_REQUIRED` | Professional sommeliers, hosts, venues, partners | Professional-role landing page for Sommelier Passport with Sommelier Workspace as a secondary section. It should not be the consumer AI Sommelier app feature. | `/operations#somm`, `/operations#market`, `/operations#cal`, `/#sommelier` | Partial: `products.json` maps `/sommelier` to Sommelier Passport and `/sommelier#workspace`; `operations.html` shows sommelier profiles, credentials text, event hosting, calendar, and an internal earnings dashboard prototype. | Medium | Medium | Medium | Medium | Build after copy and privacy review. Use safe claims: planned professional profile and tools for planning/hosting experiences. Do not claim credential verification, live scheduling, live payments, active customer management, or app AI. | High | Implementation input only: credential wording, privacy posture, and whether workspace details are public or request-access. |
| `/blind-detective` | `PRODUCT_DETAIL_PAGE_LATER` | `EXECUTIVE_PRODUCT_DECISION_REQUIRED` | Consumers and groups | Brandable blind tasting game/detail page after product name and scope are approved. | `/game-flow`, `/wave1`, `/wine-lovers#blind-tasting` | Partial: blind tasting gameplay exists as public-noindex prototype screens. | High | Medium | Low now, medium later | Medium | Keep as a Wave 3 product detail candidate. In Phase 1, use generic Blind Tasting content under `/wine-lovers`. | Medium | Should the public product name be `Blind Detective` or generic `Blind Tasting`? |
| `/collector` | `PRODUCT_DETAIL_PAGE_LATER` | `IMPLEMENTATION_INPUT_REQUIRED` | Collectors and serious consumers | Future collector page around a digital cellar and bottle memory, without custody, resale, or valuation claims. | `/game-flow`, `/wave1` | Limited: "cellar remembers" and catalog-style prototype ideas exist; no dedicated product page source exists. | High with `/wine-library` | Medium | Medium later | Medium | Keep as a Wave 2 detail candidate after content/evidence review; do not merge with Wine Library. | High | Implementation input only: evidence and copy for collector use cases. |
| `/wine-library` | `PRODUCT_DETAIL_PAGE_LATER` | `IMPLEMENTATION_INPUT_REQUIRED` | Consumers and collectors | Future organization page for wines a user has discovered. | `/wave1`, `/prototype` | Limited: catalog, notes, and preference concepts exist in prototypes; no approved live library exists. | High with `/collector` | Medium | Medium later | Medium | Keep as a Wave 2 detail candidate after content/evidence review; do not merge with Collector. | High | Implementation input only: evidence and copy for library use cases. |
| `/wine-trade` | `PRODUCT_DETAIL_PAGE_LATER` | `EXECUTIVE_PRODUCT_DECISION_REQUIRED` | Trade buyers, distributors, wineries, strategic partners | Potential B2B trade-network page, distinct from consumer Marketplace and partner inquiry. | `/for`, `/partners`, `/prototype` | Partial: restricted partner feedback includes distribution, winery connections, restaurants/events, collector edition, strategic partnership, and investment; active trade transactions are not evidenced. | High with `/partners`, `/for-wineries`, and consumer Marketplace | High | Medium later | High | Do not build standalone until the commercial model is decided. Use `/partners#wine-trade` or partner segmentation as interim public positioning. | Medium | Is Wine Trade a public acquisition page, restricted partner workflow, or future transaction product? |
| `/experience-host` | `PRODUCT_DETAIL_PAGE_LATER` | `IMPLEMENTATION_INPUT_REQUIRED` | Hosts, sommeliers, venues, restaurants, partners | Future detail page for hosted tastings, tours, venue activations, and bookable experiences without claiming live inventory or payments. | `/operations`, `/tastings`, `/partners`, `/wine-lovers#experiences` | Partial: operations and tastings demos show host/event concepts, but they are public-noindex prototypes. | High with `/sommelier`, `/partners`, and `/wine-lovers` event content | Medium | Medium later | High | Keep as a Wave 2 detail candidate. In Phase 1, reference consumer experiences under `/wine-lovers` and business participation under `/partners`. | Medium | Implementation input only: primary audience priority and safe CTA. |
| `/passport` | `CREATE_STANDALONE_PAGE` | `APPROVED_ARCHITECTURAL_RECOMMENDATION` | Consumers, wineries, partners, collectors | Public overview for CAP Passport and Bottle Identity, linking conceptually to approved passport record surfaces. | `/bottle-scan`, `/cap/b/:token`, `/winery-passport`, `/wine-passport`, `/vintage-passport`, `/cap-demo` | Yes: API-backed passport pages exist; no public overview page exists. | Medium | High | High | High | Build first from existing verified CAP/passport evidence. Keep tokenized/data pages canonical for actual records and avoid certification/compliance overclaims. | High | None blocking architecture. Implementation still needs page copy. |
| `/heritage` | `PRODUCT_DETAIL_PAGE_LATER` | `EXECUTIVE_PRODUCT_DECISION_REQUIRED` | Wineries, regions, collectors | Possible Heritage Passport page, separate from CAP Passport and without historical certification claims. | None; nearest conceptual route is `/passport` | No approved equivalent content found. | Medium with `/passport` | Medium | Low now, medium later | Medium | Do not build until Heritage Passport evidence and public claim boundaries are defined. | Medium | What is Heritage Passport, and what evidence or verification can be publicly claimed? |
| `/technology` | `CONSOLIDATE_INTO_EXISTING_PAGE` | `APPROVED_ARCHITECTURAL_RECOMMENDATION` | Wineries, partners, investors, technical evaluators | Credibility support for passport, winery, and partner pages rather than a separate conversion path in Phase 1. | `/passport`, `/for-wineries`, `/partners`, `/`, CAP passport pages | Partial: CAP pages, translation runtime, QR scanner flow, and partner forms show technical direction. | High: a standalone page would repeat `/passport`, `/for-wineries`, `/partners`, and `/#about` before there is enough distinct technical narrative. | Medium | Low in Phase 1 | Medium | Do not build standalone in current website architecture. Add concise technology proof sections to `/passport`, `/for-wineries`, and `/partners`; revisit standalone later only if investor/technical diligence content becomes substantial. | High | None blocking architecture. |
| `/partners` | `CREATE_STANDALONE_PAGE` | `IMPLEMENTATION_INPUT_REQUIRED` | Combination audience: distributors, winery relationship holders, restaurants/venues, regional operating partners, strategic partners, investors. Wine retailers and technology/integration partners are secondary unless future evidence supports them. | Public segmented partner inquiry and pilot page that routes qualified interest without exposing private forms. | `/for`, `/access`, `/cap-onboarding`, `/winery-setup` | Partial: restricted partner feedback and access flows exist, but not a safe public partner page. | Medium with `/for-wineries` and `/wine-trade` | High | High | High | Build one segmented `/partners` page. Keep it broad but structured by partner type; do not create separate distributor/restaurant/investor pages yet. Keep `/for`, `/access`, and `/winery-setup` restricted/noindex. | High | Implementation input only: reviewed inquiry flow and data-processing language. |
| `/about` | `CONSOLIDATE_INTO_EXISTING_PAGE` | `APPROVED_ARCHITECTURAL_RECOMMENDATION` | General visitors, press, partners, investors | Company identity, pre-launch status, operating facts, and contact context. | `/#about`, footer, `/legal` | Yes: homepage has "Who we are" and company facts; legal pages carry formal entity detail. | High | Medium | Medium as anchor | Low | Do not build standalone. Keep About as a homepage anchor until there is enough distinct company, team, press, or investor content. | High | None blocking architecture. |
| `/contact` | `CONSOLIDATE_INTO_EXISTING_PAGE` | `APPROVED_ARCHITECTURAL_RECOMMENDATION` | General visitors, partners, press, privacy/legal contacts | Utility contact access without introducing unreviewed public form processing. | Footer mailto links, `/#about`, `/privacy`, `/legal`, future `/partners` inquiry | Yes: footer and homepage expose contact emails; legal/privacy pages include formal contacts. | High | Low | Low as primary nav, medium in footer | Medium | Do not build standalone. Use footer mailto links and a homepage/footer contact block; partner-specific forms belong inside `/partners` only after privacy review. | High | None blocking architecture. |

## Grouped Route Decisions

### APPROVED_ARCHITECTURAL_RECOMMENDATION

- `/passport`: create standalone page.
- `/technology`: consolidate into `/passport`, `/for-wineries`, and
  `/partners` sections.
- `/about`: consolidate into `/#about`.
- `/contact`: consolidate into footer/homepage contact blocks and partner
  inquiry paths.

### IMPLEMENTATION_INPUT_REQUIRED

- `/wine-lovers`: create standalone page; needs safe launch-state copy and CTA.
- `/for-wineries`: create standalone page; needs reviewed claims, CTA, and
  compliance disclaimers.
- `/sommelier`: create standalone professional-role page; needs credential,
  privacy, and workspace-publicity review.
- `/collector`: later detail page; needs evidence and copy.
- `/wine-library`: later detail page; needs evidence and copy.
- `/experience-host`: later detail page; needs audience priority and safe CTA.
- `/partners`: create one segmented page; needs inquiry flow and data-processing
  language.

### EXECUTIVE_PRODUCT_DECISION_REQUIRED

- `/blind-detective`: naming and product scope decision.
- `/wine-trade`: commercial model decision.
- `/heritage`: product definition and evidence decision.

## Sommelier Reassessment

Repository evidence supports `/sommelier` as a professional-role website page,
not as the consumer AI Sommelier app feature:

- `products.json` maps Sommelier Passport to `/sommelier` and Sommelier
  Workspace to `/sommelier#workspace`.
- `routes.json` maps `/sommelier` to `sommelier-passport`,
  `sommelier-workspace`, and `experience-host`.
- `operations.html` includes a sommelier network/profile prototype with
  credentials-style copy, hosted events, event calendar context, and an internal
  earnings dashboard.
- `index.html` also has `/#sommelier`, but that section describes an AI
  Sommelier app feature. That content should not control the `/sommelier`
  website route.

Recommendation: build `/sommelier` later as a professional-role landing page
for Sommelier Passport, with Sommelier Workspace as a request-access or
secondary section. Do not claim verified credentials, live scheduling, active
payments, active customer management, or production marketplace availability.

## Technology Reassessment

`/technology` is not necessary as a Phase 1 standalone page. Its evidence is
real but supporting: CAP passport pages, multilingual runtime, QR scanning, and
partner workflow prototypes. Those proof points serve the conversion goals of
`/passport`, `/for-wineries`, and `/partners` better than a separate top-level
technology page.

Recommendation: consolidate technology content into those pages in Phase 1.
Revisit a standalone `/technology` page only when investor/technical diligence
content is large enough to avoid repeating passport, winery, and partner copy.

## Partners Reassessment

The current evidence supports a combination partner audience:

- distributors and wine portfolio holders;
- winery relationship holders;
- restaurants, wine bars, venues, and event organizers;
- regional operating or strategic partners;
- investors.

Wine retailers appear only as possible buyers in a collector-edition feedback
path, not yet as a primary partner segment. Technology/integration partners are
plausible but not directly evidenced enough to lead the page.

Recommendation: one `/partners` page can serve the current audience if it is
segmented clearly. Do not create separate distributor, restaurant, investor, or
integration partner routes yet.

## Contact Reconciliation

Choose a homepage/footer contact destination, not a standalone `/contact` page.
General contact should remain mailto-based or a simple contact block in the
homepage/footer. Any form that collects partner information should live inside
`/partners` after privacy and processor review.

Navigation consequence: `/contact` is not a primary top-nav item and should not
receive standalone HTML in the current architecture.

## Minimal Phase 1 Top Navigation

This is the target public navigation once the Phase 1 pages exist. Hide any item
until its destination is implemented and reviewed.

| Label | Route or anchor | Primary audience | Conversion purpose |
| --- | --- | --- | --- |
| Wine Lovers | `/wine-lovers` | Consumers, members, tasting groups | Join waitlist or understand the consumer tasting experience. |
| For Wineries | `/for-wineries` | Wineries and producers | Start a reviewed winery/passport inquiry. |
| Passport | `/passport` | Consumers, wineries, partners, collectors | Understand CAP Passport and scan/passport trust surfaces. |
| Partners | `/partners` | Distributors, venues, regional partners, investors | Route qualified partner interest to reviewed inquiry paths. |
| About | `/#about` | General visitors, press, investors | Establish company status and credibility without a standalone page. |

Utility actions such as Sign In, Play Now, Get Started, Request Access, and
Language are outside this primary navigation count.

## Implementation Sequence

### Wave 1

Pages or IA moves that can be implemented immediately from existing verified
content:

- `/passport`: strongest evidence-backed standalone page, based on existing CAP
  passport record pages and safe product-registry claims.
- `/#about`: keep and refine as the company anchor; do not create `/about`.
- Footer/homepage contact block: keep mailto-based general contact; do not
  create `/contact`.
- Technology proof sections inside `/passport`, `/for-wineries`, and
  `/partners`; do not create `/technology`.

### Wave 2

Pages requiring content preparation, evidence review, CTA definition, or privacy
wording, but not executive product decisions:

- `/wine-lovers`
- `/for-wineries`
- `/sommelier`
- `/partners`
- `/collector`
- `/wine-library`
- `/experience-host`

### Wave 3

Routes dependent on product, naming, commercial, or evidence decisions from
Maksim:

- `/blind-detective`
- `/wine-trade`
- `/heritage`

## DECISIONS REQUIRED FROM MAKSIM

| Decision | Available options | Recommended default | Consequence of delaying |
| --- | --- | --- | --- |
| What should the public blind tasting product be called? | Use `Blind Tasting` as the generic section under `/wine-lovers`; approve `Blind Detective` as a branded product route; retire `Blind Detective` from website IA. | Keep `Blind Tasting` under `/wine-lovers`; defer `/blind-detective`. | No standalone game detail page; consumer page can still launch with generic blind tasting copy. |
| What is the Wine Trade commercial model? | Public acquisition page; restricted partner workflow; future transaction product; defer/remove from website IA. | Use `/partners#wine-trade` as interim positioning; do not build `/wine-trade`. | Partner page can launch, but trade SEO and conversion remain limited. |
| What is Heritage Passport? | Standalone heritage product; section under `/passport`; private pilot only; remove from website IA. | Defer `/heritage` until evidence and claim boundaries exist. | No heritage SEO page; avoids confusing Heritage Passport with CAP Passport. |

## NO-BUILD DECISIONS

These routes should not receive standalone HTML pages in the current website
architecture:

- `/about`: consolidate into `/#about`.
- `/contact`: consolidate into footer/homepage contact and partner inquiry
  paths.
- `/technology`: consolidate into technology/proof sections on `/passport`,
  `/for-wineries`, and `/partners`.

Conditional no-build until executive decision:

- `/blind-detective`: no standalone HTML until naming and product scope are
  approved.
- `/wine-trade`: no standalone HTML until commercial model is approved.
- `/heritage`: no standalone HTML until product definition and evidence are
  approved.

## Recommended Canonical Naming Where Routes Overlap

- Use `Wine Lovers` as the consumer umbrella. Treat Blind Tasting, Tasting
  Notes, Toasts, Marketplace, Premium, and Taste Profile as sections or later
  detail pages, not automatic top-level routes.
- Use `Blind Tasting` as the generic experience label until Maksim approves
  `Blind Detective` as the public product name.
- Use `For Wineries` as the winery marketing page. Keep `Winery Onboarding` and
  `/winery-setup` restricted workflows.
- Use `Passport` as the public overview route for CAP Passport and Bottle
  Identity. Keep record pages distinct: `/cap/b/:token`, `/bottle-scan`,
  `/winery-passport`, `/wine-passport`, and `/vintage-passport`.
- Do not merge `CAP Passport`, `Bottle Identity`, `EU QR`, and `EU E-label`.
  Compliance claims require separate approval.
- Do not merge `Heritage Passport` with CAP Passport.
- Use `/sommelier` for the professional Sommelier Passport and Workspace story,
  not for the consumer AI Sommelier app feature.
- Do not merge `Sommelier Passport` with consumer `Taste Profile`.
- Do not merge `Collector` with `Wine Library`.
- Do not merge `Wine Trade` with consumer `Marketplace`.
- Do not merge `Experience Host` with winery onboarding.
- Use `Partners` as the public segmented partner inquiry hub. Keep `/for`,
  `/access`, and `/winery-setup` restricted/noindex.

## Not Modified

- `routes.json` was not modified.
- `pages.json` was not modified.
- HTML files were not modified.
- JavaScript/runtime files were not modified.
- SEO metadata, robots, sitemap, canonical, and hreflang behavior were not
  modified.
- Translation files were not modified.
- Deployment configuration was not modified.
- CAP behavior and pricing were not modified.
- Mobile application files were not modified.
