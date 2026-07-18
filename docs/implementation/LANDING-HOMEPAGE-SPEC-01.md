# Landing Homepage Implementation Specification 01

Task: public homepage implementation specification for `/`.

Scope: public Tasting & Toasting website homepage only. This document does not
implement HTML, CSS, JavaScript, route registry changes, translations, SEO
metadata, assets, application behavior, backend behavior, authentication,
subscriptions, CAP implementation, mobile application behavior, deployment, or
product interface requirements.

Primary sources:

- `docs/content/LANDING-WEBSITE-COPY-02.md`
- `docs/content/LANDING-WEBSITE-COPY-REVIEW-01.md`
- `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md`
- `docs/strategy/LANDING-ROUTE-STRATEGY-01.md`
- `docs/strategy/LANDING-CONTENT-INVENTORY-01.md`
- `src/config/pages.json`
- `src/config/routes.json`
- `src/config/products.json`
- Current homepage implementation in `index.html`, `assets/`, and
  `src/i18n/apply-tt141.js`

## 1. Existing Homepage Assessment

### Current Homepage File Locations

| Role | File or asset | Current state |
| --- | --- | --- |
| Homepage HTML, CSS, and inline JavaScript | `index.html` | Current public landing page registered for `/`; indexable after owner-approved landing rewrite. |
| Homepage navigation logo | `assets/logo_nav.png` | Usable existing brand asset, subject to brand usage approval. |
| Homepage footer logo | `assets/logo_footer.png` | Usable existing brand asset, subject to brand usage approval. |
| Favicon | `assets/favicon-64.png` | Usable existing support asset. |
| Homepage i18n runtime | `src/i18n/apply-tt141.js` | Current homepage loads shared translation behavior and language UI state. |
| English i18n source | `src/i18n/all-pages-en.json` | Existing translation source used by homepage and other public pages. |
| Page registry | `src/config/pages.json` | Registers `/` as `index.html`; future Phase 1 routes are not yet implemented HTML pages. |
| Route policy registry | `src/config/routes.json` | Classifies current and future website routes and access/indexing expectations. |
| Product registry | `src/config/products.json` | Defines safe and unsafe public claims for Wine Lovers, For Wineries, Passport, Partners, and related concepts. |

### Reusable Patterns Already Present

- Fixed top bar with brand logo, navigation links, utility CTA, pre-launch
  status, and language switcher.
- Full-width dark visual system using inline CSS variables, serif display type,
  mono labels, compact section labels, and constrained content width.
- Hero pattern with metadata row, large H1, supporting paragraph, and paired
  CTAs.
- Notice/banner pattern for pre-launch and legal status.
- Two-column and single-column responsive section grid patterns.
- Repeated card grid pattern with metadata, heading, body, chips, and CTA text.
- About anchor pattern with explanatory text and company facts.
- Footer pattern with brand, grouped links, legal links, contact links, and
  company status.
- Mobile language dropdown with `aria-expanded` and cloned flag links.
- Smooth-scroll behavior for same-page anchors.

### Obsolete Or Conflicting Sections

The future homepage should replace or remove the following current public
homepage sections from the final homepage experience:

- Prototype-led hero copy: current H1 and supporting copy position the site
  around prototypes and European wine experiences, not the approved wine
  discovery and bottle context platform.
- `#prototypes`: prototype cards link to public-noindex prototype/demo pages and
  include subscription, cart, checkout, event booking, and operational concepts
  that conflict with the current pre-launch boundaries.
- Current remote event video: the Minsk blind tasting video may be usable only
  with explicit approval as public proof. It should not be required for launch.
- `#sommelier`: current "Your AI Sommelier" section creates application and AI
  claims outside this homepage scope.
- `#commerce`: current "Buy Wine You Love" section conflicts with the no active
  wine sales, checkout, shipping, and live orders boundary.
- `#voice`: current voice assistant copy describes app behavior and integrations
  outside this homepage scope.
- Current "Play now" CTA and iOS invitation copy are application/runtime
  oriented and should not be primary homepage CTAs for this public website
  implementation.
- Footer "Prototypes" group should transition to Phase 1 public routes and
  legal support links only.

### Existing Navigation Behavior

- Desktop top bar is fixed, translucent, and uses inline brand image plus text
  links.
- Current desktop nav links are `#prototypes`, `#voice`, `#sommelier`, and
  `legal.html`; these do not match the approved minimal navigation.
- Current primary utility CTA points to `https://web.tastingandtoasting.com` as
  "Play now"; this should be removed from the public homepage CTA hierarchy.
- Current language flags link through `?lang=` and collapse into a dropdown at
  mobile widths.
- Current same-page anchor behavior uses `scrollIntoView({ behavior: 'smooth',
  block: 'start' })`; it does not account for reduced-motion preference or fixed
  header offset.

### Current Responsive Behavior

- Breakpoint at `900px` hides desktop navigation links, reduces padding, stacks
  prototype cards, stacks about grid, and changes footer grid to two columns.
- Breakpoint at `600px` stacks footer columns into one column.
- Current mobile navigation removes section links rather than replacing them
  with an audience menu.
- Current cards and sections stack cleanly, but final implementation should
  define card wrapping, touch targets, media aspect ratios, and CTA wrapping
  explicitly.

### Current Asset Usage

- Local usable assets: `assets/logo_nav.png`, `assets/logo_footer.png`,
  `assets/favicon-64.png`.
- Current homepage has no local hero photography, no local Passport screenshot,
  no local product screenshot exports, no local partner logos, no local
  testimonial assets, and no approved static Passport hierarchy diagram.
- Current homepage embeds a remote S3 video. Treat it as usable with approval,
  not as a required homepage asset.
- Current feature icons are inline SVGs in `index.html`; they are implementation
  details, not an approved reusable icon asset library.

### Current Technical Constraints

- The homepage is a standalone static HTML file with inline CSS and inline
  scripts. No component framework is present.
- The existing route `/` is registered in `src/config/pages.json`; `/wine-lovers`,
  `/for-wineries`, `/passport`, and `/partners` are future-proposed routes, not
  implemented HTML pages in this worktree.
- The current homepage is localized through a shared runtime and `data-i18n`
  attributes. Final copy implementation must decide whether new homepage text
  enters the translation workflow in a separate task.
- The current fixed header can cover anchor targets unless offsets are handled.
- External font loading currently depends on Google Fonts and should preserve
  `display=swap`.
- Passport record pages exist as separate public surfaces; the homepage must not
  implement CAP behavior or record rendering.

## 2. Final Section Order

Final homepage section count: 10.

| Order | Section ID | Section name | Required flow coverage |
| ---: | --- | --- | --- |
| 1 | `hero` | Hero | What Tasting & Toasting is, who it serves, why it matters, and what to do next. |
| 2 | `choose-path` | Audience paths | Role-based routing for Wine Lovers, For Wineries, Passport, and Partners. |
| 3 | `platform` | Platform explanation | How discovery, wineries, bottles, and Passport context connect. |
| 4 | `wine-lovers` | Wine Lovers | Consumer-facing path summary without app/product leakage. |
| 5 | `for-wineries` | For Wineries | Winery-facing path summary and reviewed-record framing. |
| 6 | `passport` | Passport | Trust-layer explanation with clear claim boundaries. |
| 7 | `trust-proof` | Trust and proof | Current status, approved proof readiness, and limitations. |
| 8 | `about` | About anchor | Company credibility anchor at `/#about`, not `/about`. |
| 9 | `final-cta` | Final CTA | Return visitor to audience choice and Passport explainer. |
| 10 | `footer-transition` | Footer transition | Public route and legal support handoff into the footer. |

Do not add product catalogue sections for Marketplace, Premium, Sommelier,
Voice, Commerce, Blind Detective, Collector, Wine Library, Wine Trade,
Experience Host, Heritage, Technology, `/about`, or `/contact`.

## 3. Section Specifications

### 3.1 `hero`

| Field | Specification |
| --- | --- |
| Purpose | Introduce Tasting & Toasting as the public wine discovery and Passport platform, identify wine lovers, wineries, and bottle-record readers, state why context matters, and give one clear next action. |
| Approved heading | `Wine discovery and bottle context, brought into one public platform.` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage `/`, Hero Copy. Use the hero body and "Why it matters" copy; remove inline validation markers from visitor copy. |
| CTA labels | Primary: `Choose your path`; secondary: `Learn how Passport works`. |
| CTA destinations | Primary: `#choose-path`; secondary: `/passport`. |
| CTA status | Primary `DESTINATION_REQUIRED` until anchor ID is implemented; secondary `CONFIRMED` with route implementation dependency. |
| Content hierarchy | Kicker `Tasting & Toasting`; H1; body paragraph; why-it-matters sentence; primary CTA; secondary CTA; optional pre-launch micro-status. |
| Recommended layout pattern | Current large editorial hero pattern, revised to use one H1, one compact body column, and optional media panel or background only if approved. |
| Desktop behavior | Two-column composition is allowed only if an approved hero asset exists: copy left, asset right or full-bleed restrained media. Without asset, use a copy-led centered or left-aligned hero with generous width and visible next-section cue. |
| Tablet behavior | Stack media below copy or remove media if it weakens readability; keep CTAs side by side if width allows. |
| Mobile behavior | Copy first, CTAs stacked or wrapped, no oversized H1 overflow, next section visible without excessive scrolling. |
| Accessibility requirements | Single page H1; CTA links have descriptive labels; hero media has meaningful alt text or `aria-hidden` if decorative; no text embedded only in images; reduced-motion honors user preference. |
| Semantic HTML recommendation | `<header>` for site header outside hero; `<main>` containing `<section id="hero" aria-labelledby="hero-title">`; H1 with `id="hero-title"`. |
| Asset requirements | Approved hero image/video or explicit asset-free launch decision; dimensions declared; responsive sources if image is used. |
| Fallback when asset is unavailable | Asset-free editorial hero using logo, typography, pre-launch status, and a restrained visual treatment. Do not use remote video as default fallback. |
| Dependencies | Business approval of final public positioning sentence; brand/asset approval; `/passport` route implementation or launch coordination. |
| Acceptance criteria | First screen answers what the company is, who it is for, why context matters, and what to click next; no application, commerce, subscription, or AI claims appear. |

Hero constraints:

- Heading should remain the approved H1 and should not be expanded with extra
  clauses.
- Supporting copy should remain one short paragraph plus one short why-it-matters
  sentence.
- Primary CTA must visually outrank the secondary CTA.
- Hero asset, if used, must load efficiently and must not hide or blur the
  actual subject.

### 3.2 `choose-path`

| Field | Specification |
| --- | --- |
| Purpose | Move visitors from the homepage to the relevant Phase 1 path. |
| Approved heading | `Start with your role` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage, `Start With Your Role`; architecture and route strategy for Partners route inclusion. |
| CTA labels | `For wine lovers`; `For wineries`; `Passport`; `Partners`. |
| CTA destinations | `/wine-lovers`; `/for-wineries`; `/passport`; `/partners`. |
| CTA status | Wine Lovers, For Wineries, and Passport are `CONFIRMED` copy destinations with route implementation dependency. Partners is route-strategy approved but partner page copy is outside this copy pack; include only as a minimal route card or nav link after route readiness. |
| Content hierarchy | Section intro; four equal audience cards; each card has label, one-sentence job-to-be-done, and link. |
| Recommended layout pattern | Reuse card grid pattern, but remove prototype-card language and unsupported chips. |
| Desktop behavior | Four cards in a 4-up or 2x2 grid depending available width; equal card heights; entire card clickable if focus styles are strong. |
| Tablet behavior | Two-column grid. |
| Mobile behavior | Single-column list; preserve reading order; each card has at least 44px touch target. |
| Accessibility requirements | Use real links; card focus state must be visible; card headings must be semantic; avoid nested interactive elements. |
| Semantic HTML recommendation | `<section id="choose-path" aria-labelledby="choose-path-title">`; card list as `<ul>` with `<li>` cards. |
| Asset requirements | No critical assets. Optional simple icons may be decorative if approved. |
| Fallback when asset is unavailable | Text-only cards. |
| Dependencies | Future route files for `/wine-lovers`, `/for-wineries`, `/passport`, and `/partners`, or a launch decision to hide any unavailable card. |
| Acceptance criteria | Primary hero CTA scrolls here; all visible cards route to approved destinations only; no unapproved product routes appear. |

### 3.3 `platform`

| Field | Specification |
| --- | --- |
| Purpose | Explain the relationship between wine discovery, producer records, bottle context, and Passport without turning the homepage into a product catalogue. |
| Approved heading | `Wine stories need a place to travel.` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage, `What Tasting & Toasting Connects`. |
| CTA labels | Optional inline text links only: `For wine lovers`, `For wineries`, `Passport`. |
| CTA destinations | `/wine-lovers`; `/for-wineries`; `/passport`. |
| CTA status | `CONFIRMED` with route implementation dependency. |
| Content hierarchy | Heading; two short paragraphs; optional three-part connector list for wine lovers, wineries, and Passport readers. |
| Recommended layout pattern | Section intro plus three compact feature panels or a simple narrative band. |
| Desktop behavior | Copy and connector panels can sit side by side; avoid decorative nested cards. |
| Tablet behavior | Copy first, connector panels wrap to two columns or stack. |
| Mobile behavior | Single-column narrative; links remain inline or appear as small text links below copy. |
| Accessibility requirements | Preserve heading order after audience paths; do not rely on diagram-only explanation. |
| Semantic HTML recommendation | `<section id="platform" aria-labelledby="platform-title">` with paragraphs and optional `<ul>`. |
| Asset requirements | Optional approved relationship diagram; not required. |
| Fallback when asset is unavailable | Plain text explanation. |
| Dependencies | Product and legal approval of the plain-language relationship between consumer experience and Passport infrastructure. |
| Acceptance criteria | Visitor understands how the platform connects moments from producer to bottle to table; no unsupported technology or application claims. |

### 3.4 `wine-lovers`

| Field | Specification |
| --- | --- |
| Purpose | Summarize the consumer path and route wine-curious visitors to the dedicated page. |
| Approved heading | `For wine lovers` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage, `Start With Your Role` path card; Wine Lovers page hero and discovery copy may inform summary only. |
| CTA labels | `For wine lovers`; optional secondary `Learn how Passport works`. |
| CTA destinations | `/wine-lovers`; `/passport`. |
| CTA status | `CONFIRMED` with route implementation dependency. |
| Content hierarchy | Audience label; short benefit summary: taste, learn, remember; optional bullets for context, taste memory, and keeping the moment. |
| Recommended layout pattern | Product feature panel paired with approved consumer image only if available; otherwise text panel within the homepage flow. |
| Desktop behavior | Can sit as one of two audience feature panels, or as a full-width row with text and small media. |
| Tablet behavior | Text and media stack; CTA remains close to text. |
| Mobile behavior | Text first, CTA next, media optional after CTA. |
| Accessibility requirements | Avoid implying app account storage, recommendations, purchases, kits, or live events; image alt should describe tasting/discovery context if used. |
| Semantic HTML recommendation | `<section id="wine-lovers" aria-labelledby="wine-lovers-title">`. |
| Asset requirements | Optional approved consumer tasting or discovery photography; no current local asset. |
| Fallback when asset is unavailable | Text-only feature panel. |
| Dependencies | `/wine-lovers` page implementation; consumer waitlist destination belongs on `/wine-lovers`, not as a homepage primary action. |
| Acceptance criteria | Section routes consumers without promising live sales, subscriptions, event booking, delivery, account storage, or final pricing. |

### 3.5 `for-wineries`

| Field | Specification |
| --- | --- |
| Purpose | Summarize the winery path and route producers to the dedicated winery page. |
| Approved heading | `For wineries` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage, `Start With Your Role` path card; For Wineries page hero and practical value copy may inform summary only. |
| CTA labels | `For wineries`; optional secondary `Learn how Passport works`. |
| CTA destinations | `/for-wineries`; `/passport`. |
| CTA status | `CONFIRMED` with route implementation dependency. |
| Content hierarchy | Audience label; concise winery value statement; mention reviewed public Passport records; CTA. |
| Recommended layout pattern | Product feature panel; can mirror Wine Lovers panel for balanced audience routing. |
| Desktop behavior | Pair with Wine Lovers or Passport feature row; avoid exposing setup form UI. |
| Tablet behavior | Stack after Wine Lovers in approved section order. |
| Mobile behavior | Single-column copy; CTA touch target at least 44px. |
| Accessibility requirements | Do not link to restricted setup forms; do not imply self-serve onboarding, automatic publication, or compliance certification. |
| Semantic HTML recommendation | `<section id="for-wineries" aria-labelledby="for-wineries-title">`. |
| Asset requirements | Optional approved winery, bottle, or public Passport screenshot; no current local asset. |
| Fallback when asset is unavailable | Text-only feature panel with no proof image. |
| Dependencies | `/for-wineries` page implementation; winery inquiry destination belongs on `/for-wineries`, with mailto fallback there if no form is approved. |
| Acceptance criteria | Section communicates reviewed public records and producer context without compliance, certification, anti-counterfeit, self-serve, or commercial outcome claims. |

### 3.6 `passport`

| Field | Specification |
| --- | --- |
| Purpose | Introduce Passport as recorded bottle context and the shared trust layer. |
| Approved heading | `Passport shows recorded context.` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage, `Passport Trust Overview`; Passport page hero and claim-boundary copy for wording boundaries. |
| CTA labels | `Learn how Passport works`; optional `For wineries` for producer readers. |
| CTA destinations | `/passport`; `/for-wineries`. |
| CTA status | `CONFIRMED` with route implementation dependency. |
| Content hierarchy | Heading; body explaining public data where valid records exist; concise limitations copy; CTA. |
| Recommended layout pattern | Trust panel or media block with hierarchy diagram/screenshot only after approval. |
| Desktop behavior | Text plus approved Passport visual or hierarchy diagram; limitations remain visible, not buried. |
| Tablet behavior | Stack text above visual; keep limitation copy adjacent to claim. |
| Mobile behavior | Text-first; no tiny diagram labels; use accessible list if diagram cannot scale. |
| Accessibility requirements | Verification status must be framed as a signal; diagram must have text equivalent; links are descriptive. |
| Semantic HTML recommendation | `<section id="passport" aria-labelledby="passport-title">`; limitations can use `<aside>` or a clearly labeled paragraph inside the section. |
| Asset requirements | Approved Passport screenshot, sample record, or hierarchy diagram. |
| Fallback when asset is unavailable | Text-only trust panel with no sample record. |
| Dependencies | Legal approval of final Passport limitations wording; engineering approval of hierarchy, field list, and scan behavior before visual proof. |
| Acceptance criteria | Section uses recorded context language and explicitly avoids proof, certification, anti-counterfeit, and compliance overclaims. |

### 3.7 `trust-proof`

| Field | Specification |
| --- | --- |
| Purpose | State current public status, show only approved proof, and avoid pre-launch confusion. |
| Approved heading | `Available now, in preparation, and planned direction.` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage, `Current Status` and `Proof And Trust Placeholders`; copy review recommendation to compress repeated caveats. |
| CTA labels | `Review legal information`; optional text links to `Privacy` and `Terms`. |
| CTA destinations | `/legal`; `/privacy`; `/terms`. |
| CTA status | `CONFIRMED`. |
| Content hierarchy | Status buckets: Available now, In preparation, Planned direction; pre-launch notice; optional approved proof list. |
| Recommended layout pattern | Trust/status band with three compact columns and a concise notice. |
| Desktop behavior | Three columns with equal visual weight; proof area appears only if approved material exists. |
| Tablet behavior | Columns wrap to two then one. |
| Mobile behavior | Stack status cards; keep no-commerce notice short and readable. |
| Accessibility requirements | Status labels should be text, not color-only; proof images need alt text; legal links must be identifiable. |
| Semantic HTML recommendation | `<section id="trust-proof" aria-labelledby="trust-proof-title">` with `<dl>` or `<ul>` status groups. |
| Asset requirements | Approved proof screenshots, brand assets, Passport hierarchy visual, or explicit asset-free launch decision. |
| Fallback when asset is unavailable | Status-only trust band with legal links and no proof images. |
| Dependencies | Legal-approved concise pre-launch wording; asset/brand approval for any proof material. |
| Acceptance criteria | No commercial wine sales, event ticketing, purchases, payments, live subscriptions, final pricing, or unsupported proof claims appear. |

### 3.8 `about`

| Field | Specification |
| --- | --- |
| Purpose | Provide company credibility and contact context as a homepage anchor, not a standalone page. |
| Approved heading | `Who we are.` |
| Approved body copy source | Existing `index.html` `#about` company anchor, verified fact bank in `LANDING-CONTENT-INVENTORY-01.md`, and route strategy direction for `/#about`. |
| CTA labels | `Email Tasting & Toasting`; `Review legal information`. |
| CTA destinations | `mailto:hello@tastingandtoasting.com`; `/legal`. |
| CTA status | `CONFIRMED`. |
| Content hierarchy | Short company explanation; pre-launch status; company facts; public contact email; legal support link. |
| Recommended layout pattern | Keep current about grid pattern: text plus fact card. |
| Desktop behavior | Two-column layout with fact card on the side. |
| Tablet behavior | Stack text before facts. |
| Mobile behavior | Single-column with facts readable as definition list or compact table. |
| Accessibility requirements | Use a semantic heading and definition list for facts; email link has visible text; do not expose pending details without legal review. |
| Semantic HTML recommendation | `<section id="about" aria-labelledby="about-title">`; company facts as `<dl>`. |
| Asset requirements | No critical asset. Optional footer/logo use already available. |
| Fallback when asset is unavailable | Text-only about section. |
| Dependencies | Legal review of company status, entity language, pending registration wording, and contact information. |
| Acceptance criteria | About nav points to `/#about`; no `/about` route is assumed or recommended. |

### 3.9 `final-cta`

| Field | Specification |
| --- | --- |
| Purpose | Re-state the main action after visitors have seen the platform explanation and trust context. |
| Approved heading | `Choose your path` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage primary CTA and CTA matrix. |
| CTA labels | Primary: `Choose your path`; secondary: `Learn how Passport works`. |
| CTA destinations | `#choose-path`; `/passport`. |
| CTA status | Primary `DESTINATION_REQUIRED` until anchor is implemented; secondary `CONFIRMED` with route implementation dependency. |
| Content hierarchy | Short line of copy; two CTAs; optional low-emphasis email link only if approved. |
| Recommended layout pattern | Full-width CTA band, not a nested card. |
| Desktop behavior | Horizontal CTA group; primary remains dominant. |
| Tablet behavior | CTAs wrap without overlap. |
| Mobile behavior | Stack buttons full-width or content-width; minimum 44px height. |
| Accessibility requirements | Same label and destination behavior as hero; avoid duplicate ambiguous links if screen reader context is unclear. |
| Semantic HTML recommendation | `<section id="final-cta" aria-labelledby="final-cta-title">`. |
| Asset requirements | None. |
| Fallback when asset is unavailable | Text and CTA only. |
| Dependencies | `#choose-path` anchor and `/passport` route availability. |
| Acceptance criteria | Final action returns to approved audience routing and does not introduce waitlist, pilot, app, checkout, or subscription CTAs on the homepage. |

### 3.10 `footer-transition`

| Field | Specification |
| --- | --- |
| Purpose | Transition from homepage content into durable public navigation and legal support. |
| Approved heading | `Keep public paths simple.` |
| Approved body copy source | `LANDING-WEBSITE-COPY-02.md`, Homepage, `Footer And Internal Links`; route strategy footer relationships. |
| CTA labels | Footer links: `Wine Lovers`, `For Wineries`, `Passport`, `Partners`, `About`, `Legal`, `Privacy`, `Terms`, email contacts. |
| CTA destinations | `/wine-lovers`; `/for-wineries`; `/passport`; `/partners`; `/#about`; `/legal`; `/privacy`; `/terms`; `mailto:` contact links. |
| CTA status | Legal and mailto links `CONFIRMED`; Phase 1 marketing routes have route implementation dependency. |
| Content hierarchy | Brand/logo; concise tagline; primary public paths; legal links; contact links; company status. |
| Recommended layout pattern | Reuse existing footer grid with updated link taxonomy. |
| Desktop behavior | 3-4 footer columns with clear grouping. |
| Tablet behavior | Two-column footer. |
| Mobile behavior | Single-column footer; contact links remain tappable and readable. |
| Accessibility requirements | Footer has clear landmark; link text is descriptive; no restricted/prototype routes in public footer. |
| Semantic HTML recommendation | `<footer class="site-footer">` with grouped `<nav aria-label="...">` lists. |
| Asset requirements | `assets/logo_footer.png`; optional brand usage approval. |
| Fallback when asset is unavailable | Text brand mark `Tasting & Toasting`. |
| Dependencies | Route readiness for Phase 1 public pages; legal review of public contact and entity language. |
| Acceptance criteria | Footer does not link to restricted setup, access-code, prototype, internal preview, design-reference, `/about`, `/contact`, or `/technology` routes. |

## 4. Hero Specification

The first screen must answer:

- What is Tasting & Toasting? A public wine discovery and Passport platform.
- Who is it for? Wine lovers, wineries, and people reading bottle records.
- Why does it matter? Wine is easier to enjoy when story, producer, vintage, and
  recorded bottle information are close at hand.
- What should the visitor do next? Choose a path.

Primary homepage CTA: `Choose your path`.

Implementation constraints:

- Desktop composition: copy-led hero with optional approved asset. If an asset
  exists, use a balanced two-column or controlled full-bleed treatment; never let
  media obscure the H1 or CTA.
- Mobile composition: kicker, H1, body, why-it-matters sentence, primary CTA,
  secondary CTA; optional media appears after CTAs or is omitted.
- Heading length: use the approved H1 exactly; avoid extra line breaks that
  create widows or overflow.
- Supporting copy: one concise body paragraph plus one concise why-it-matters
  sentence.
- CTA hierarchy: primary filled or highest-contrast; secondary lower emphasis.
- Visual behavior: image/video must use explicit width/height or aspect ratio,
  responsive sources, and no layout shift.
- Fallback: asset-free launch is acceptable and preferred over unapproved stock,
  remote event video, blurred media, or generated assets.
- Accessibility: one H1, visible focus, reduced motion, meaningful media alt,
  no text-only color cues.
- Performance: avoid autoplay video; preload only essential hero image metadata
  or use eager loading for the LCP asset with responsive sizing.

## 5. Navigation Specification

Approved minimal navigation:

| Label | Destination | Status |
| --- | --- | --- |
| Wine Lovers | `/wine-lovers` | Route strategy approved; page implementation dependency. |
| For Wineries | `/for-wineries` | Route strategy approved; page implementation dependency. |
| Passport | `/passport` | Route strategy approved; page implementation dependency. |
| Partners | `/partners` | Route strategy approved; partner copy and inquiry dependency. |
| About | `/#about` | Confirmed homepage anchor. |

Do not recommend standalone `/about`, `/contact`, or `/technology`.

Navigation behavior:

- Desktop navigation should show the five approved labels once destinations are
  implemented and reviewed. Hide or defer any route that would otherwise be a
  broken link at launch.
- Mobile navigation should collapse into a menu button or compact nav drawer;
  the current behavior of hiding all primary nav links is not sufficient for the
  final homepage.
- Header CTA placement should favor `Choose your path` or omit a header CTA if
  it competes with the hero. Do not use `Play now`, `Get started`, sign-in, or
  app-runtime CTAs.
- Hover states should be visible but restrained; active state should reflect the
  current anchor or route when practical.
- Keyboard behavior: all nav items reachable in DOM order; menu button uses
  `aria-expanded`; Escape closes mobile menu; focus returns to menu trigger.
- Focus management: visible focus ring must not be removed; focus should not be
  trapped outside a modal/drawer unless a drawer is open.
- Anchor behavior: `/#about` and `#choose-path` require scroll offset for the
  fixed header. Smooth scrolling must respect `prefers-reduced-motion`.
- Language switcher can remain as a utility nav if translation behavior is
  retained, but it should not displace the primary audience navigation.

## 6. CTA Mapping

CTA mapping count: 19.

| Source section | Label | Destination | Intent | Status | Implementation fallback |
| --- | --- | --- | --- | --- | --- |
| Header nav | Wine Lovers | `/wine-lovers` | Route consumer visitors. | Route approved; implementation dependency. | Hide until page exists; do not redirect to prototype. |
| Header nav | For Wineries | `/for-wineries` | Route producers. | Route approved; implementation dependency. | Hide until page exists; do not link restricted setup. |
| Header nav | Passport | `/passport` | Route trust-first readers. | Route approved; implementation dependency. | Hide until page exists; do not link design templates. |
| Header nav | Partners | `/partners` | Route qualified business collaborators. | Route approved; content/inquiry dependency. | Hide until page exists; do not link `/for` or `/access`. |
| Header nav | About | `/#about` | Show company credibility anchor. | `CONFIRMED`. | Use same-page `#about`; never `/about`. |
| Hero | Choose your path | `#choose-path` | Scroll to audience routing. | `DESTINATION_REQUIRED`. | Implement `#choose-path`; no external fallback. |
| Hero | Learn how Passport works | `/passport` | Explain recorded bottle context. | `CONFIRMED`; route dependency. | Hide until route exists; do not use CAP token page as substitute. |
| Audience paths | For wine lovers | `/wine-lovers` | Route consumers. | `CONFIRMED`; route dependency. | Hide/defer until route exists. |
| Audience paths | For wineries | `/for-wineries` | Route producers. | `CONFIRMED`; route dependency. | Hide/defer until route exists. |
| Audience paths | Passport | `/passport` | Route bottle-record readers. | `CONFIRMED`; route dependency. | Hide/defer until route exists. |
| Audience paths | Partners | `/partners` | Route partners. | Route approved; copy dependency. | Hide/defer until route exists. |
| Platform | For wine lovers | `/wine-lovers` | Contextual consumer link. | `CONFIRMED`; route dependency. | Render as plain text if route unavailable. |
| Platform | For wineries | `/for-wineries` | Contextual winery link. | `CONFIRMED`; route dependency. | Render as plain text if route unavailable. |
| Platform | Passport | `/passport` | Contextual trust link. | `CONFIRMED`; route dependency. | Render as plain text if route unavailable. |
| Passport | Learn how Passport works | `/passport` | Deepen trust explanation. | `CONFIRMED`; route dependency. | Hide until route exists. |
| Trust/proof | Review legal information | `/legal`, `/privacy`, `/terms` | Support legal/privacy review. | `CONFIRMED`. | Link to individual legal pages. |
| About | Email Tasting & Toasting | `mailto:hello@tastingandtoasting.com` | General contact without form processing. | `CONFIRMED`. | Keep mailto; no public form unless reviewed. |
| Final CTA | Choose your path | `#choose-path` | Return to audience routing. | `DESTINATION_REQUIRED`. | Implement same-page anchor. |
| Final CTA | Learn how Passport works | `/passport` | Secondary trust route. | `CONFIRMED`; route dependency. | Hide until route exists. |

Do not add homepage CTAs for joining the wine lover waitlist, requesting winery
pilot access, app play, sign in, checkout, subscription, product demos, or
restricted setup flows. Those belong on their approved destination pages after
privacy and legal review.

## 7. Component Map

Reusable component count: 10.

| Component | Role | Inputs | Variants | Reusable scope | Accessibility notes | Implementation risks |
| --- | --- | --- | --- | --- | --- | --- |
| Site header | Brand, primary nav, utility language/status. | Logo, nav items, optional CTA, language data. | Desktop fixed, mobile collapsed. | All public website pages. | Landmark, visible focus, `aria-expanded` menu. | Broken route links; mobile links hidden without replacement. |
| Navigation | Route and anchor list. | Label, href, status, active state. | Header, footer, mobile drawer. | Public website pages. | Keyboard order and descriptive links. | Linking future/unimplemented routes too early. |
| Hero | First-screen positioning and action. | Kicker, H1, body, why copy, CTAs, optional media. | Asset-backed, asset-free. | Homepage and future top-level pages. | Single H1 on homepage. | Unsupported media, layout shift, overlong copy. |
| Audience choice cards | Role-based routing. | Label, summary, href, status. | 4-up, 2x2, stacked. | Homepage and Passport next-steps. | Entire card focus; avoid nested controls. | Broken routes or equal emphasis confusing primary CTA. |
| Section intro | Kicker/label, heading, body. | Label, title, intro. | Compact, editorial, status. | All long-form pages. | Correct heading order. | Decorative label becoming only context. |
| Product feature panel | Summarize Wine Lovers, Wineries, Passport. | Heading, body, CTA, optional media. | Text-only, media-left/right. | Homepage and audience pages. | Media alt and text equivalent. | Product leakage into app/runtime claims. |
| Trust panel | Status, limitations, legal links. | Status items, limitation copy, links. | Three-column, compact band. | Homepage, Passport, Wineries. | Status not color-only. | Overclaiming proof or hiding limitations. |
| Media block | Approved image/video/diagram presentation. | Source, alt, dimensions, caption, approval state. | Image, video, diagram, screenshot. | Proof sections and product pages. | Captions, alt, keyboard controls for video. | Unapproved remote video, CLS, poor mobile crop. |
| CTA band | Repeated high-intent action. | Heading, copy, primary/secondary CTA. | Full-width, compact footer-prep. | Homepage and destination pages. | Distinct link text and focus. | Introducing unapproved destinations. |
| Site footer | Durable links and legal/contact support. | Logo, nav groups, legal links, contacts, company status. | 4-column, 2-column, stacked. | All public pages. | Footer landmark and nav labels. | Prototype/restricted/internal links leaking into public footer. |

## 8. Responsive Specification

### Large Desktop

- Use constrained inner width consistent with current `1200px` pattern.
- Hero may use two-column composition if approved media exists; otherwise use
  a copy-led editorial layout.
- Audience cards can be 4-up or 2x2, with stable equal-height cards.
- Text width should remain readable, roughly 60-75 characters for paragraphs.
- Media should use declared aspect ratios; avoid uncontrolled full-viewport
  video.

### Desktop/Laptop

- Header shows approved primary nav and optional utility language/status.
- Sections follow exact final order.
- Product feature panels can alternate media/text only if it improves scanning.
- CTA rows may remain horizontal but must wrap cleanly.

### Tablet

- Header primary nav may collapse depending available width.
- Hero stacks media below text.
- Audience cards use two columns.
- Product panels stack or use one-column text/media.
- Footer uses two columns.

### Mobile

- Header uses a menu button or compact drawer for approved nav items.
- Content order remains source order: hero, choose path, platform, Wine Lovers,
  For Wineries, Passport, trust/proof, About, final CTA, footer.
- Cards stack as a single column.
- CTAs stack or wrap without overflow; minimum touch target is 44px by 44px.
- Text must not scale with viewport width in a way that causes overflow.
- Diagrams must become text-first summaries or simplified stacked diagrams.
- Media crops should preserve subject; do not use tiny proof screenshots that
  cannot be read.

### Motion And Interaction

- Respect `prefers-reduced-motion` by disabling smooth scrolling and hover
  transforms for users who request reduced motion.
- Hover-only affordances must have focus equivalents.
- Animations should not be required to understand content.

## 9. Visual And Asset Strategy

Existing usable assets count: 3.
Missing critical assets count: 4.

### Asset Inventory

| Asset | Availability | Recommended usage | Required format | Aspect-ratio guidance | Responsive treatment | Alt-text intent | Fallback |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `assets/logo_nav.png` | Usable now, subject to brand approval. | Header brand mark. | PNG; consider future SVG/webp only in implementation task. | Preserve intrinsic ratio. | Fixed height, auto width. | `Tasting & Toasting`. | Text brand mark. |
| `assets/logo_footer.png` | Usable now, subject to brand approval. | Footer brand mark. | PNG. | Preserve intrinsic ratio. | Fixed height, auto width. | `Tasting & Toasting`. | Text brand mark. |
| `assets/favicon-64.png` | Usable now. | Browser favicon. | PNG. | Square. | Not responsive. | Not applicable. | Browser default. |
| Remote Minsk event video | Usable with approval only. | Optional proof, not hero. | MP4 with poster required. | 16:9 or stable media ratio. | Lazy load; controls visible. | Caption describes approved event proof. | Omit. |
| Inline SVG icons | Usable with approval. | Decorative support icons only. | Inline SVG. | Fixed icon box. | Scale from CSS. | `aria-hidden` if decorative. | Text labels only. |
| Hero photography/video | Missing critical. | Hero media only if approved. | AVIF/WebP/JPEG or MP4 with poster. | 16:9, 4:3, or editorial crop defined. | `srcset`/`sizes`; eager only if LCP. | Describe wine discovery, bottle context, or producer context. | Asset-free hero. |
| Passport hierarchy diagram | Missing critical. | Passport/platform explainer. | SVG/PNG generated in implementation task only after approval. | Wide desktop; stacked mobile. | Text equivalent on mobile. | Explain bottle, vintage, wine, winery relationship. | Text list. |
| Approved Passport screenshot/sample record | Missing critical. | Passport trust/proof. | PNG/WebP screenshot. | Device-independent crop. | Lazy load; dimensions declared. | Describe recorded data shown. | No screenshot. |
| Approved proof screenshot set | Missing critical. | Trust/proof section. | PNG/WebP. | Consistent card ratio. | Lazy load. | Describe public approved proof. | Status-only trust panel. |

### Asset Readiness Groups

- Usable now: `assets/logo_nav.png`, `assets/logo_footer.png`,
  `assets/favicon-64.png`.
- Usable with approval: remote Minsk event video, inline SVG decorative icons,
  existing passport/prototype surfaces after screenshots are exported and
  approved.
- Missing: hero image, Passport hierarchy diagram, Passport screenshot/sample
  record, approved proof screenshot set, winery/consumer photography, brand
  usage rules.
- Optional enhancement: testimonials, partner logos, product videos, richer
  diagrams, approved icon system.

## 10. Accessibility Requirements

- Use semantic landmarks: `<header>`, `<main>`, `<section>`, `<footer>`, and
  labeled `<nav>` elements.
- Use a single H1 on the homepage.
- Maintain heading order from H1 to H2/H3 without skipping for visual styling.
- All links and buttons must be keyboard reachable and visibly focused.
- Mobile menu must expose state with `aria-expanded`; Escape should close it.
- Color contrast must meet WCAG AA for text, links, controls, and focus states.
- Alternative text must communicate the intent of content images; decorative
  images/icons should be `aria-hidden`.
- Respect reduced motion for smooth scroll, transforms, video, and animation.
- Touch targets must be at least 44px by 44px for primary interactive controls.
- Fixed-header anchor offset must prevent `#choose-path` and `#about` headings
  from being hidden.
- Screen-reader labels are required for icon-only controls such as language menu
  and mobile menu.
- CTA distinction must not rely on color alone; use label, position, shape, and
  focus treatment.
- Keep `<html lang="en">`; only set `dir="rtl"` when the language runtime
  actually applies an RTL language.

## 11. Performance Requirements

- Hero asset loading: use one optimized LCP image if approved; otherwise keep
  hero asset-free. Do not autoplay hero video.
- Responsive images: provide `srcset`, `sizes`, dimensions, and stable aspect
  ratios for all content images.
- Lazy loading: lazy-load below-the-fold images and videos; do not lazy-load the
  primary LCP image.
- Font loading: keep preconnect and `display=swap`; avoid adding extra font
  families.
- Animation limits: remove non-essential pulsing and hover transform effects for
  reduced-motion users.
- JavaScript dependency limits: keep homepage interactions small and native; do
  not add a framework for this static page.
- Layout shift: declare image/video dimensions, avoid late injected content that
  changes header or card heights.
- Mobile bandwidth: no required video downloads; avoid large screenshots unless
  compressed and lazy-loaded.
- Fallback behavior: all core content and CTAs work without media assets and
  without JavaScript beyond optional nav/language enhancements.

## 12. SEO Implementation Notes

Specification only; do not implement SEO metadata in this task.

- Title source: use Homepage SEO Working Title from
  `LANDING-WEBSITE-COPY-02.md`: `Tasting & Toasting | Wine Discovery And Bottle
  Passport Context`.
- Meta description source: use Homepage Meta Description from
  `LANDING-WEBSITE-COPY-02.md`.
- Canonical recommendation: canonical should remain the production homepage URL
  for `/`, subject to deployment domain policy.
- Heading hierarchy: one H1 matching approved homepage H1; each final section
  should use H2; card titles can use H3.
- Internal links: link to `/wine-lovers`, `/for-wineries`, `/passport`,
  `/partners`, `/#about`, `/legal`, `/privacy`, and `/terms` only when routes
  are implemented/reviewed; do not link to restricted/prototype routes.
- Structured data recommendation: consider Organization structured data only
  after legal entity and contact details are approved; do not add Product,
  Event, Offer, or Review schema for pre-launch homepage.
- Open Graph asset dependency: use approved brand/hero image or explicit
  asset-free/default OG decision. Do not use unapproved remote video stills or
  prototype screenshots.

## 13. Implementation Plan

Implementation waves count: 8.

| Wave | Step | Files likely affected | Dependencies | Acceptance criteria | Risk |
| ---: | --- | --- | --- | --- | --- |
| 1 | Existing homepage cleanup | `index.html`; possibly `src/i18n/all-pages-en.json` in a later copy task | Owner approval to remove prototype/app sections from public homepage | Prototype/app/commerce/AI sections removed from final homepage | Accidental loss of still-needed legal/about content |
| 2 | Reusable component preparation | `index.html`; future shared CSS if introduced by owner | Decision whether to keep inline CSS or extract shared styles | Header, footer, cards, section intro, CTA band patterns are consistent | Scope creep into design system refactor |
| 3 | Section implementation | `index.html`; translation sources if localization is in scope | Approved homepage copy and route readiness | 10 final sections appear in exact order | Inventing copy or unsupported claims |
| 4 | Responsive pass | `index.html` CSS | Final content length and asset decisions | Large desktop, desktop, tablet, and mobile layouts work without overlap | Header/nav collapse regression |
| 5 | Accessibility pass | `index.html` | Final nav/menu behavior and media assets | Landmarks, heading order, focus, reduced motion, anchors, alt text pass review | Smooth-scroll/fixed-header issues |
| 6 | Performance pass | `index.html`; assets if added | Approved media and image formats | No unnecessary video load; dimensions declared; no major CLS | Large unoptimized proof assets |
| 7 | Content and CTA validation | `index.html`; route configs only in separate route task | Route/page availability and legal/copy approval | CTA matrix matches approved destinations; no broken public nav | Linking unimplemented future routes |
| 8 | QA | Browser testing, `git diff --check`, route/link checks | Built homepage | Homepage passes content, route, responsive, accessibility, and performance checklist | Future pages unavailable at homepage launch |

## 14. Acceptance Criteria

### Content Fidelity

- Homepage H1, hero body, why-it-matters copy, audience path copy, platform
  explanation, Passport limitations, current status, proof guidance, and footer
  links follow `LANDING-WEBSITE-COPY-02.md`.
- Internal validation markers do not appear as visitor-facing copy.
- Copy review recommendations are reflected through compression, not new claims.

### Route Fidelity

- Homepage route remains `/`.
- About is `/#about`, not `/about`.
- No standalone `/contact` or `/technology` route assumptions.
- Restricted/prototype/internal routes are not public homepage destinations.

### CTA Behavior

- Primary homepage CTA is `Choose your path`.
- `Choose your path` scrolls to `#choose-path`.
- Secondary Passport CTA routes to `/passport` only when the route exists.
- Waitlist and pilot CTAs are not primary homepage CTAs.

### Responsive Behavior

- Sections stack in approved order across desktop, tablet, and mobile.
- Cards do not shift size on hover/focus.
- CTA labels wrap cleanly.
- Media crops preserve the subject.
- Header/nav remains usable on mobile.

### Accessibility

- Single H1.
- Correct heading order.
- Semantic landmarks.
- Keyboard-visible focus.
- Reduced-motion behavior.
- Adequate contrast.
- Meaningful alt text or decorative hiding.
- Minimum touch targets.
- Anchor offsets for fixed header.

### Performance

- No autoplay hero video.
- Responsive images with dimensions when assets are used.
- Lazy loading for below-fold media.
- No unnecessary JavaScript dependencies.
- No avoidable layout shift.
- Mobile bandwidth stays low if proof assets are absent.

### Boundary Compliance

- No mobile application requirements.
- No application runtime behavior.
- No backend workflows.
- No authentication or subscription implementation.
- No CAP implementation.
- No product interface specification.
- No unsupported commerce, pricing, authenticity, anti-counterfeit, compliance,
  certification, live orders, live event booking, or guaranteed result claims.

## 15. Open Decisions

Open blocking decisions count: 4.

| Decision | Owner | Recommended default | Implementation impact |
| --- | --- | --- | --- |
| Approve final public positioning sentence for Tasting & Toasting. | Business | Use the approved H1 and hero body from copy pack until final sentence is approved. | Blocks publication-ready hero wording if owner wants a different positioning sentence. |
| Approve final Passport limitations language. | Legal | Use copy pack limitation language: recorded context, not proof, certification, anti-counterfeit protection, or legal compliance. | Blocks publication of Passport/trust claims and proof visuals. |
| Approve homepage visual plan or explicit asset-free launch. | Assets / Brand | Launch asset-free except for approved logos. | Blocks any hero/proof media and Open Graph image selection. |
| Confirm Phase 1 route launch timing for `/wine-lovers`, `/for-wineries`, `/passport`, and `/partners`. | Product / Engineering | Hide route links until destination pages are implemented and reviewed. | Blocks visible nav/cards that would otherwise create broken or unreviewed public links. |

## 16. Final Implementation Summary

- Final homepage sections count: 10.
- Reusable components count: 10.
- CTA mappings count: 19.
- Existing usable assets count: 3.
- Missing critical assets count: 4.
- Open blocking decisions count: 4.
- Implementation waves count: 8.
- Required implementation route: `/`.
- Required homepage primary CTA: `Choose your path`.
- Required About destination: `/#about`.
- Prohibited standalone route assumptions: `/about`, `/contact`,
  `/technology`.
