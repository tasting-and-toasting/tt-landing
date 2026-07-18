# Wine Lovers Page Implementation Specification 01

## 1. Document Control

| Field | Value |
| --- | --- |
| Document title | Wine Lovers Page Implementation Specification 01 |
| Document ID | LANDING-WINE-LOVERS-SPEC-01 |
| Version | 1.0 |
| Status | Implementation-ready with owner decisions called out |
| Target route | `/wine-lovers` |
| Source branch | `landing/wine-lovers-spec-v1` |
| Source commit | `f405697041bea8e23b063ae521b49c2b77ab3533` |
| Expected base branch | `origin/landing/homepage-implementation-v1` |
| Expected base commit | `f405697041bea8e23b063ae521b49c2b77ab3533` |
| Intended implementation branch | `landing/wine-lovers-implementation-v1` |

Owner decisions still required:

| Decision | Safe default in this specification | Blocking status |
| --- | --- | --- |
| Consumer waitlist destination, consent text, fields, processor, and retention language | Use `mailto:hello@tastingandtoasting.com?subject=Wine%20lover%20access` and avoid form-field copy | Non-blocking if mailto fallback is used; blocking for a true waitlist form |
| Public launch timing | Say "pre-launch" and "being prepared"; do not promise dates | Non-blocking |
| Public naming for blind tasting versus Blind Detective | Use "blind tasting" only | Non-blocking |
| Consumer visuals and Passport scan screenshots | Launch text-first with approved logo assets only | Non-blocking if owner accepts asset-free launch |
| Final Passport legal limitation language | Use minimal "recorded context, not guarantee" language already used on the homepage | Blocking if stronger trust claims are added |
| Privacy posture for tasting notes, taste profiles, personalization, and recommendations | Present as planned personal learning tools only; do not claim storage, portability, recommendations, or account processing | Non-blocking for general copy; blocking for detailed feature UX |
| Future route readiness for `/passport` and `/for-wineries` | Use same-page Passport context and homepage/legal/email fallbacks until routes are implemented | Non-blocking |

Source path note: the task names `docs/architecture/LANDING-CONTENT-ARCHITECTURE-01.md` and `docs/architecture/LANDING-ROUTE-STRATEGY-01.md`; in this repository those source-of-truth documents exist at `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md` and `docs/strategy/LANDING-ROUTE-STRATEGY-01.md`.

## 2. Executive Summary

The `/wine-lovers` page is the consumer intent page for Tasting & Toasting. Its job is to explain the wine discovery experience being prepared for people who want to learn, taste, remember, and understand bottle context without needing formal wine expertise.

The page sits one click deeper than the homepage. The homepage acts as the public audience router; `/wine-lovers` expands the consumer path and gives wine-curious visitors a clear next action. It must preserve the homepage's careful pre-launch posture and reuse the same visual and navigation patterns instead of introducing a second public design system.

The intended audience is casual wine drinkers, curious learners, social tasters, collectors, Wine Library prospects, Passport readers, and people interested in future tasting or marketplace concepts. It must not promise active commerce, event booking, subscription billing, account creation, live scanning for every bottle, universal localization, guaranteed authenticity, certification, anti-counterfeit protection, or legal compliance.

## 3. Current-State Audit

### VERIFIED

| Finding | Evidence |
| --- | --- |
| `/wine-lovers` is not currently implemented as an HTML page. | `src/config/routes.json` lists `/wine-lovers` as `future-product-page` with `source: future-proposed` and `currentState: not yet implemented` in the route entry beginning at `src/config/routes.json:404`. `src/config/pages.json` has no implemented `/wine-lovers` page entry. |
| The current homepage exists at `/` and is registered as `index.html`. | `src/config/pages.json:9-25`; `docs/content/LANDING-WEBSITE-COPY-02.md:620-626`. |
| The homepage currently references Wine Lovers through same-page anchors, not the future route. | `index.html:1023-1055` navigation and mobile links use `#wine-lovers`; `index.html:1101-1105` and `index.html:1151-1168` show the Wine Lovers card/section; `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:111-119` explains the fallback. |
| The homepage intentionally avoids broken links to future routes. | `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:131-165`. |
| Consumer wine discovery and tasting experiences are being prepared. | `docs/content/LANDING-WEBSITE-COPY-02.md:632`; `src/config/products.json:49`. |
| Blind tasting is represented as prototype evidence, not a production game. | `docs/content/LANDING-WEBSITE-COPY-02.md:262-270`; `src/config/products.json:55-71`. |
| Tasting notes and taste profiles are planned consumer concepts. | `docs/content/LANDING-WEBSITE-COPY-02.md:270-276`; `src/config/products.json:91-125`. |
| Bottle scan links can open public Passport data where a valid token exists. | `docs/content/LANDING-WEBSITE-COPY-02.md:278-285`; `src/config/products.json:127-143`; `src/config/pages.json:212-230`. |
| Public Passport page types exist for bottle, winery, wine, and vintage records. | `src/config/pages.json:212-280`. |
| Current public legal support routes exist. | `src/config/pages.json:103-144`; homepage links at `index.html:1231-1235` and `index.html:1304-1310`. |
| Existing reusable visual patterns are static HTML, inline CSS, fixed header, card grids, CTA rows, status panels, and footer. | `docs/implementation/LANDING-HOMEPAGE-SPEC-01.md:40-55`; `index.html:1075-1325`. |
| `vercel.json` uses clean URLs and `trailingSlash: false`. | `vercel.json:2-5`. |
| Language behavior is query-param driven and includes Hebrew RTL handling. | `src/i18n/apply-tt141.js:2-77`; homepage report at `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:248-264`. |

### PARTIAL

| Finding | Evidence |
| --- | --- |
| Consumer marketplace concepts exist in prototypes, but not as active public commerce. | `src/config/products.json:163-179`; `src/config/routes.json:26-39`; copy exclusions at `docs/content/LANDING-WEBSITE-COPY-02.md:648-667`. |
| Premium and subscription-style surfaces exist in prototypes, but public pricing and billing are not approved. | `src/config/products.json:181-197`; `docs/content/LANDING-WEBSITE-COPY-02.md:658-660`. |
| Wine Library and Collector concepts have product registry entries, but no current route or implementation. | `src/config/products.json:199-233`; `src/config/routes.json:460-485`. |
| Events/social tasting concepts exist, but paid live event booking is not supported. | `src/config/products.json:145-161`; `src/config/products.json:253-267`; homepage pre-launch notice at `index.html:1087-1091`. |

### UNVERIFIED

| Finding | Evidence |
| --- | --- |
| Consumer waitlist workflow details are unresolved. | `docs/content/LANDING-WEBSITE-COPY-02.md:246` and `docs/content/LANDING-WEBSITE-COPY-02.md:690-704`. |
| Notes/profile storage, recommendation behavior, and privacy posture are unresolved. | `docs/content/LANDING-WEBSITE-COPY-02.md:691-692`; `docs/content/LANDING-WEBSITE-COPY-REVIEW-01.md:271-281`. |
| Public scan behavior for valid, missing, invalid, and example token states needs engineering approval before detailed UX promises. | `docs/content/LANDING-WEBSITE-COPY-02.md:692`; `docs/content/LANDING-WEBSITE-COPY-REVIEW-01.md:273-276`. |
| Consumer hero photography, discovery visuals, blind tasting visuals, and Passport scan screenshots are not approved assets. | `docs/content/LANDING-WEBSITE-COPY-02.md:309-322`; `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:292-302`. |

### NOT IMPLEMENTED

| Finding | Evidence |
| --- | --- |
| `/passport`, `/for-wineries`, `/partners`, `/wine-library`, `/collector`, `/blind-detective`, `/experience-host`, `/sommelier`, `/contact`, and `/about` are not implemented public pages. | `src/config/routes.json:418-592`; homepage report at `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:313-316`. |
| Authentication, subscription checkout, commercial wine sales, marketplace purchasing, event booking, Ask Max runtime, Sommelier Workspace, Winery Workspace, and mobile app behavior are outside this public page. | Homepage implementation report scope at `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:21-24`; product registry safe/unsafe claims in `src/config/products.json`. |

### CONTRADICTORY

| Finding | Resolution |
| --- | --- |
| Older prototype/i18n copy contains commercial, checkout, subscription, delivery, event, and authenticity language. | Treat these as prototype-only evidence. The public Wine Lovers page must follow Copy Pack v2 and product registry safety boundaries, not legacy prototype marketing language. Evidence: `src/config/routes.json:26-39`, `src/config/routes.json:68-79`, `src/i18n/all-pages-en.json` prototype strings, and exclusions at `docs/content/LANDING-WEBSITE-COPY-02.md:648-667`. |
| Copy Pack v2 names "Join the wine lover waitlist" as the primary CTA, while its own validation register says the destination and consent language are unresolved. | Use a low-risk email CTA in v1 implementation unless owner approval supplies a real waitlist flow. Evidence: `docs/content/LANDING-WEBSITE-COPY-02.md:300-306` and fallback guidance at `docs/content/LANDING-WEBSITE-COPY-02.md:743-746`. |
| Homepage spec originally maps future routes, while homepage implementation uses same-page fallbacks until destination pages exist. | The Wine Lovers implementation should update homepage links only in the later implementation task after `/wine-lovers` exists and passes route validation. This specification task must not edit homepage code. |

## 4. Audience Definition

Primary audiences:

| Audience | Definition | Page treatment |
| --- | --- | --- |
| Casual wine drinkers | People who enjoy wine socially and want clearer, less intimidating context. | Warm, plain-language discovery copy. |
| Curious learners | People who want to notice styles, producers, regions, and bottle stories. | Educational framing without expert jargon. |
| Tasting participants | People interested in blind tasting or social tasting concepts. | Present as planned/prototype-backed concepts, not live paid events. |
| Wine Library users | People who may want to organize wines they have discovered. | Mention as planned organization direction only. |
| Passport users | People holding or scanning bottles with valid Passport data. | Explain recorded context and trust boundaries. |

Secondary audiences:

| Audience | Definition | Page treatment |
| --- | --- | --- |
| Collectors | Consumers who care about memory, bottle context, and cellar organization. | Mention carefully; do not claim custody, resale, valuation, or live collector tooling. |
| Marketplace users | People interested in future ways to access wine or experiences. | Boundary-only copy: concepts are exploratory, purchasing is not live. |
| Event participants | People interested in group tastings or social wine rituals. | Keep as planned social experience; no booking, ticketing, pricing, venue inventory, or hosted event guarantee. |
| Wineries/producers who arrive accidentally | Professional visitors looking for winery onboarding or Passport record preparation. | Route to the future `/for-wineries` only once implemented; until then use homepage `/#for-wineries` or mailto fallback. |

Professional sommelier credential verification, winery onboarding, Sommelier Workspace, and winery workflow details are excluded unless future owner-approved content explicitly adds a bridge.

## 5. Page Goals

| Goal | Measurement or acceptance signal |
| --- | --- |
| Explain consumer value | A first-time visitor can state that the page is about learning, tasting, remembering, and bottle context. |
| Guide users into relevant journeys | Primary action captures interest safely; secondary actions route to Passport context, legal/privacy support, and misroute handling without broken links. |
| Build trust | Pre-launch status, Passport limitations, and legal/privacy links are visible and understandable. |
| Avoid overclaiming | No unsupported claims about sales, subscriptions, events, authentication, AI, authenticity, certification, compliance, or universal localization appear. |
| Support pre-launch positioning | The page uses "being prepared", "planned direction", and "where valid Passport data exists" consistently. |
| Create clear next actions | CTAs have stable labels, destinations, fallbacks, and analytics names. |
| Preserve homepage relationship | The page feels like a deeper continuation of the homepage rather than a separate product brand. |

## 6. Page Non-Goals

The Wine Lovers page must not implement or promise:

- Professional credential verification.
- Winery onboarding or enterprise workflows.
- Full marketplace implementation.
- Marketplace purchasing, carts, checkout, booking, delivery, ticketing, or inventory.
- Full scanner implementation.
- Full Passport runtime.
- Ask Max runtime or AI sommelier service.
- Account creation, login, OTP, age-gate, or profile flows unless separately verified.
- Subscription checkout, active membership billing, final plan prices, or premium benefits.
- Sommelier Workspace, Winery Workspace, CAP admin/runtime work, mobile app code, backend code, or deployment.

## 7. Information Architecture

Proposed page section count: 8.

### 7.1 `hero`

| Item | Specification |
| --- | --- |
| Purpose | Introduce the consumer path, set pre-launch status, and offer a safe next action. |
| Eyebrow | `For wine lovers` |
| Heading | `Drink with more memory, context, and confidence.` |
| Body copy | `Tasting & Toasting is preparing wine discovery and tasting experiences for people who want to learn through the glass. The goal is simple: help you notice what you enjoy, remember what you tasted, and understand more about the bottle in front of you.` |
| Supporting points | `Pre-launch`; `No sales, subscriptions, or event booking on this website`; `Passport context only where valid records exist` |
| Visual treatment | Text-first hero using homepage typography, warm dark background, optional status panel. No speculative photography required. |
| CTA or action | Primary `Email for wine lover access`; secondary `See Passport context` |
| Destination or behavior | Primary `mailto:hello@tastingandtoasting.com?subject=Wine%20lover%20access`; secondary `#passport-context` until `/passport` exists. |
| Availability language | `Consumer access is being prepared.` |
| Mobile behavior | Single column; H1 below 46px; CTAs stacked; status panel follows body; next section visible without excessive vertical gap. |

### 7.2 `discovery`

| Item | Specification |
| --- | --- |
| Purpose | Explain consumer discovery in approachable language. |
| Eyebrow | `Wine discovery without the snobbery` |
| Heading | `Better questions make wine easier to enjoy.` |
| Body copy | `You do not need to know every region, grape, or technical term to have a good tasting experience. Tasting & Toasting is being prepared to help people explore styles, producers, regions, and bottle stories in language that works at the table.` |
| Supporting points | `Find context`; `Build taste memory`; `Keep the moment` |
| Visual treatment | Three-card grid reusing homepage card styling. |
| CTA or action | Inline text link `See how the platform helps` |
| Destination or behavior | Same-page anchor `#how-it-helps`. |
| Availability language | `Being prepared` badge. |
| Mobile behavior | Cards stack in source order; badges do not wrap awkwardly; cards keep equal spacing but need not equal heights. |

### 7.3 `how-it-helps`

| Item | Specification |
| --- | --- |
| Purpose | Connect discovery, tasting, notes, library, Passport, and future access without implying live runtime. |
| Eyebrow | `How the platform helps` |
| Heading | `From a glass at the table to context you can return to.` |
| Body copy | `The consumer experience is being prepared to help a wine lover move from curiosity to memory: notice the bottle, learn what matters, keep a personal note, and read public Passport context when valid records exist.` |
| Supporting points | `Learn through the glass`; `Remember your own reactions`; `Read recorded bottle context`; `Understand what is planned and what is live` |
| Visual treatment | Compact feature list or two-column panel; no nested cards. |
| CTA or action | No primary CTA; section cards may be focusable only if a real anchor exists. |
| Destination or behavior | Internal anchors to `#tasting-social`, `#notes-library`, `#passport-context`, and `#availability`. |
| Availability language | Each item includes `Preparing`, `Planned direction`, or `Available where valid Passport records exist`. |
| Mobile behavior | Convert to single-column list; keep status labels before descriptions. |

### 7.4 `tasting-social`

| Item | Specification |
| --- | --- |
| Purpose | Present blind tasting and social tasting concepts safely. |
| Eyebrow | `Tasting concepts` |
| Heading | `Tasting should feel social before it feels technical.` |
| Body copy | `Blind tasting is represented in the repository as a prototype experience. On this page, it is a concept in preparation: useful for learning and social play, not a production multiplayer game, paid event product, or final branded release.` |
| Supporting points | `For now, this page calls the concept "blind tasting"`; `Toasts and group rituals are planned`; `No paid event booking or delivered kits are available from this page` |
| Visual treatment | Text panel plus optional approved prototype-neutral image only after owner review. |
| CTA or action | `Ask about tasting updates` |
| Destination or behavior | `mailto:hello@tastingandtoasting.com?subject=Wine%20tasting%20updates` |
| Availability language | `Concept in preparation` |
| Mobile behavior | Status copy stays above CTA; no carousel or hidden interaction. |

### 7.5 `notes-library`

| Item | Specification |
| --- | --- |
| Purpose | Explain tasting notes, taste profile, Wine Library, and collection ideas as planned learning/organization tools. |
| Eyebrow | `Notes, taste memory, and library` |
| Heading | `Make your own taste easier to remember.` |
| Body copy | `Tasting note capture is part of the planned consumer experience. Taste profiling and Wine Library organization are also planned as personal learning and organization tools, separate from Passport, provenance, or verification data.` |
| Supporting points | `Tasting notes: planned`; `Taste profile: planned`; `Wine Library: planned organization direction`; `Collection ideas are limited to memory and organization context` |
| Visual treatment | Four small status rows, not a pricing or account dashboard. |
| CTA or action | `Review privacy information` |
| Destination or behavior | `/privacy` |
| Availability language | `Planned direction until privacy, storage, and recommendation behavior are approved.` |
| Mobile behavior | Status rows stack; labels remain visible text, not color-only dots. |

### 7.6 `passport-context`

| Item | Specification |
| --- | --- |
| Purpose | Bridge consumer curiosity to Passport without turning Passport into a guarantee. |
| Eyebrow | `Passport-backed bottle context` |
| Heading | `When a bottle has a Passport, the story can travel with it.` |
| Body copy | `Bottle scan links can open public Passport data where a valid token exists. For wine lovers, Passport can help explain what is recorded for the bottle or related wine record, including producer context and available public information.` |
| Supporting points | `A Passport can show what is recorded`; `Valid records may connect bottle, vintage, wine, and winery information`; `Verification status is a signal, not a blanket guarantee` |
| Visual treatment | Trust panel reusing homepage notice/status styling; optional hierarchy diagram or screenshot only after approval. |
| CTA or action | `Learn how Passport works` |
| Destination or behavior | Same-page anchor `#passport-context` in v1 if `/passport` is still unimplemented; change to `/passport` only when route registry and source file exist. |
| Availability language | `Available where valid public Passport data exists.` |
| Mobile behavior | Limitation copy remains visible before CTA. |

### 7.7 `availability`

| Item | Specification |
| --- | --- |
| Purpose | State launch, marketplace, event, subscription, and access boundaries plainly. |
| Eyebrow | `Availability` |
| Heading | `Be first to hear when reviewed access opens.` |
| Body copy | `During pre-launch, consumer access is being prepared. The website can invite interest for launch updates, but it should not promise timing, availability, purchases, deliveries, event booking, live subscriptions, or final pricing.` |
| Supporting points | `Available now: public website, contact channels, legal support pages, and public Passport page types where valid records exist`; `In preparation: consumer wine discovery, tasting concepts, notes, profile tools, and Wine Library direction`; `Not offered here: purchases, payments, subscriptions, event booking, deliveries, final pricing` |
| Visual treatment | Three-column status list on desktop; single-column on mobile. |
| CTA or action | `Email for wine lover access`; `Legal notice`; `Privacy`; `Terms` |
| Destination or behavior | Mailto and existing legal routes. |
| Availability language | This section is the canonical availability wording for the page. |
| Mobile behavior | Legal links wrap cleanly; mailto remains a 44px target. |

### 7.8 `related-paths`

| Item | Specification |
| --- | --- |
| Purpose | Route visitors who need another public path and close with safe next actions. |
| Eyebrow | `Related paths` |
| Heading | `Looking for another route?` |
| Body copy | `Wineries can return to the homepage for the winery path when it is available. Visitors trying to understand bottle records can use Passport context. Legal and privacy information remain available through the public support pages.` |
| Supporting points | `For wineries`; `Passport`; `Company and legal`; `Email Tasting & Toasting` |
| Visual treatment | Compact CTA band followed by standard footer transition. |
| CTA or action | `Back to homepage`; `Email Tasting & Toasting`; `Review legal information` |
| Destination or behavior | `/`, mailto, `/legal`. Do not link directly to `/for-wineries` or `/passport` until those pages exist. |
| Availability language | `Future route labels may appear as text with "not yet implemented" notes if the implementation needs transparency.` |
| Mobile behavior | CTA buttons stack; footer remains one column at 375px. |

## 8. Final Copy

All visible English copy must match this section unless an owner supplies a later approved copy document.

Navigation context:

| Element | Copy | Destination |
| --- | --- | --- |
| Brand link accessible label | `Tasting & Toasting home` | `/` |
| Header nav item | `Home` | `/` |
| Header nav item | `Wine Lovers` | `/wine-lovers` after implementation |
| Header nav item | `Passport` | `#passport-context` for v1; `/passport` only after implementation |
| Header nav item | `Legal` | `/legal` |
| Language button label | `Select language` | Toggles language menu |
| Mobile menu button closed | `Open menu` | Opens mobile navigation |
| Mobile menu button open | `Close menu` | Closes mobile navigation |

Hero:

| Element | Copy |
| --- | --- |
| Eyebrow | `For wine lovers` |
| H1 | `Drink with more memory, context, and confidence.` |
| Body | `Tasting & Toasting is preparing wine discovery and tasting experiences for people who want to learn through the glass. The goal is simple: help you notice what you enjoy, remember what you tasted, and understand more about the bottle in front of you.` |
| Status eyebrow | `Current status` |
| Status heading | `Consumer access is being prepared.` |
| Status body | `This page provides information and a contact route for launch updates. It does not offer commercial wine sales, event ticketing, purchases, payments, live subscriptions, deliveries, or final pricing.` |
| Primary CTA | `Email for wine lover access` |
| Secondary CTA | `See Passport context` |

Discovery:

| Element | Copy |
| --- | --- |
| Eyebrow | `Wine discovery without the snobbery` |
| Heading | `Better questions make wine easier to enjoy.` |
| Body | `You do not need to know every region, grape, or technical term to have a good tasting experience. Tasting & Toasting is being prepared to help people explore styles, producers, regions, and bottle stories in language that works at the table.` |
| Card heading | `Find context` |
| Card body | `Learn what makes a wine worth noticing.` |
| Card badge | `Preparing` |
| Card heading | `Build taste memory` |
| Card body | `Connect what you drink with what you actually enjoy.` |
| Card badge | `Preparing` |
| Card heading | `Keep the moment` |
| Card body | `Save the story around the bottle, not just the name on the label.` |
| Card badge | `Preparing` |
| CTA | `See how the platform helps` |

How it helps:

| Element | Copy |
| --- | --- |
| Eyebrow | `How the platform helps` |
| Heading | `From a glass at the table to context you can return to.` |
| Body | `The consumer experience is being prepared to help a wine lover move from curiosity to memory: notice the bottle, learn what matters, keep a personal note, and read public Passport context when valid records exist.` |
| Point heading | `Learn through the glass` |
| Point body | `Use approachable prompts and tasting concepts to make the next sip easier to understand.` |
| Point status | `Preparing` |
| Point heading | `Remember your own reactions` |
| Point body | `Planned notes and profile concepts are intended to help you recognize what you enjoy over time.` |
| Point status | `Planned direction` |
| Point heading | `Read recorded bottle context` |
| Point body | `When valid Passport data exists, public records can show available context connected to the bottle.` |
| Point status | `Where valid records exist` |
| Point heading | `Know the boundary` |
| Point body | `This page keeps clear what is available now, what is being prepared, and what is not offered here.` |
| Point status | `Pre-launch` |

Tasting and social:

| Element | Copy |
| --- | --- |
| Eyebrow | `Tasting concepts` |
| Heading | `Tasting should feel social before it feels technical.` |
| Body | `Blind tasting is represented in the repository as a prototype experience. On this page, it is a concept in preparation: useful for learning and social play, not a production multiplayer game, paid event product, or final branded release.` |
| Support line | `For now, this page calls the concept "blind tasting."` |
| Support line | `Social wine moments and guided group rituals are planned directions, not active paid hosted events.` |
| CTA | `Ask about tasting updates` |
| Status label | `Concept in preparation` |

Notes and library:

| Element | Copy |
| --- | --- |
| Eyebrow | `Notes, taste memory, and library` |
| Heading | `Make your own taste easier to remember.` |
| Body | `Tasting note capture is part of the planned consumer experience. Taste profiling and Wine Library organization are also planned as personal learning and organization tools, separate from Passport, provenance, or verification data.` |
| Row heading | `Tasting notes` |
| Row body | `Planned personal notes for remembering what you tasted.` |
| Row status | `Planned direction` |
| Row heading | `Taste profile` |
| Row body | `A future personalization concept, subject to privacy and engineering approval.` |
| Row status | `Planned direction` |
| Row heading | `Wine Library` |
| Row body | `A planned way to organize wines you have discovered.` |
| Row status | `Planned direction` |
| Row heading | `Collection` |
| Row body | `Collection ideas are limited to memory and organization context. Custody, resale, valuation, and inventory sync are not offered here.` |
| Row status | `Boundary` |
| CTA | `Review privacy information` |

Passport context:

| Element | Copy |
| --- | --- |
| Eyebrow | `Passport-backed bottle context` |
| Heading | `When a bottle has a Passport, the story can travel with it.` |
| Body | `Bottle scan links can open public Passport data where a valid token exists. For wine lovers, Passport can help explain what is recorded for the bottle or related wine record, including producer context and available public information.` |
| Limitation heading | `What Passport can and cannot say` |
| Limitation body | `A Passport can show what is recorded. It should not be treated as a guarantee that every bottle is authentic, certified, anti-counterfeit protected, or compliant in every jurisdiction.` |
| CTA | `Learn how Passport works` |
| Status label | `Where valid records exist` |

Availability:

| Element | Copy |
| --- | --- |
| Eyebrow | `Availability` |
| Heading | `Be first to hear when reviewed access opens.` |
| Body | `During pre-launch, consumer access is being prepared. The website can invite interest for launch updates, but it should not promise timing, availability, purchases, deliveries, event booking, live subscriptions, or final pricing.` |
| Status heading | `Available now` |
| Status body | `Public website, contact channels, legal support pages, and public Passport page types where valid records exist.` |
| Status heading | `In preparation` |
| Status body | `Consumer wine discovery, tasting concepts, planned notes, profile tools, and Wine Library direction.` |
| Status heading | `Not offered here` |
| Status body | `Commercial wine sales, marketplace purchasing, event booking, payments, live subscriptions, deliveries, and final pricing.` |
| Primary CTA | `Email for wine lover access` |
| Link | `Legal notice` |
| Link | `Privacy` |
| Link | `Terms` |

Related paths and footer transition:

| Element | Copy |
| --- | --- |
| Eyebrow | `Related paths` |
| Heading | `Looking for another route?` |
| Body | `Wineries can return to the homepage for the winery path when it is available. Visitors trying to understand bottle records can use Passport context. Legal and privacy information remain available through the public support pages.` |
| CTA | `Back to homepage` |
| CTA | `Email Tasting & Toasting` |
| CTA | `Review legal information` |
| Footer transition heading | `Keep public paths simple.` |
| Footer transition body | `Tasting & Toasting is preparing a public wine discovery and Passport platform.` |
| Footer public links | `Home`; `Wine Lovers`; `Passport`; `About` as footer support navigation, not page CTA count entries. Use `/`, `/wine-lovers`, `#passport-context` for v1, and `/#about` only after validating the homepage anchor from the implemented page. |
| Footer legal links | `Legal Notice`; `Privacy Policy`; `Terms of Service` as footer support navigation, not page CTA count entries. Use `/legal`, `/privacy`, and `/terms`. |
| Footer contact links | `hello@tastingandtoasting.com`; `privacy@tastingandtoasting.com`; `legal@tastingandtoasting.com` as footer support contacts, not page CTA count entries. |

Accessibility labels where wording matters:

| Element | Label |
| --- | --- |
| Primary mailto CTA | `Email Tasting & Toasting about wine lover access` |
| Tasting updates mailto CTA | `Email Tasting & Toasting about tasting updates` |
| Passport same-page CTA | `Read Passport context on this page` |
| Privacy link | `Review privacy information` |
| Legal link | `Review legal notice` |

## 9. Feature Truth Matrix

Feature truth matrix row count: 16.

| Feature | Repository evidence | Current status | Allowed public wording | Prohibited wording | CTA behavior | Implementation dependency |
| --- | --- | --- | --- | --- | --- | --- |
| Bottle scanning | `src/config/products.json:127-143`; `src/config/pages.json:212-230`; `src/config/routes.json:180-205` | Valid-token Passport behavior exists | `Bottle scan links can open public Passport data where a valid token exists.` | Every bottle works; guaranteed authentic; certified globally | Link to same-page Passport context; do not send users to arbitrary scanner token | Public scan behavior for valid/missing/invalid/example states |
| QR scanning | `src/config/products.json:343-359`; `src/config/routes.json:166-177` | Planned/exploratory for winery Passport access | `QR label concepts are being explored for winery Passport access.` | EU compliance, e-label certification, legal readiness | Informational only on Wine Lovers; no CTA | Legal, product, engineering, and pricing review |
| Passport scanning | `src/config/products.json:307-323`; `src/config/routes.json:516-527` | Passport records exist; overview page not implemented | `Public Passport pages can show traceability, recorded provenance, verification status, and public Passport data.` | Absolute proof, anti-counterfeit guarantee, certification | Same-page anchor until `/passport` is implemented | `/passport` route/source implementation |
| Tasting notes | `src/config/products.json:91-107`; `docs/content/LANDING-WEBSITE-COPY-02.md:270-276` | Planned consumer experience | `Tasting note capture is part of the planned consumer experience.` | Production account storage, portability, recommendations | Link to `#notes-library`; `/privacy` for support | Privacy and engineering validation |
| Wine Library | `src/config/products.json:217-233`; `src/config/routes.json:474-485` | Planned/future page, not implemented | `A planned way to organize wines you have discovered.` | Live inventory sync; merge with Collector; active subscription plan | Mention only; no `/wine-library` link until implemented | Product scope and route implementation |
| Collection management | `src/config/products.json:199-215`; `src/config/routes.json:460-471` | Preparing/provisional owner direction | `Collection can be discussed as memory and organization context.` | Custody, resale, valuation services, inventory sync | Informational only | Owner-approved collector boundaries |
| Passport records | `src/config/pages.json:212-280`; `src/config/products.json:307-323` | Existing API-backed public surfaces where valid records exist | `A valid record may show recorded public context.` | Universal records, certified authenticity, legal compliance | Same-page context; no example token unless approved | Field-list, hierarchy, and scan-state validation |
| Ask Max | `src/config/products.json:451-466` AI entry; no approved public AI product | Unverified/future direction only | `AI-assisted features are a possible future direction` only if owner explicitly adds it | Active AI sommelier service; Ask Max runtime; automated recommendations | Do not include visible CTA | Owner-approved AI copy and runtime |
| Marketplace browsing | `src/config/products.json:163-179`; prototype routes in `src/config/routes.json:26-39` and `src/config/routes.json:68-79` | Prototype-only/exploratory | `Marketplace concepts are exploratory prototype surfaces.` | Active merchant availability; live catalog; purchasable wine | Boundary text only | Licensing, commerce, product, route review |
| Marketplace purchasing | Same as marketplace browsing plus copy exclusions at `docs/content/LANDING-WEBSITE-COPY-02.md:648-667` | Not implemented for public site | `Not offered here.` | Cart, checkout, payment, delivery, tickets | No CTA | Commerce/licensing/runtime implementation outside scope |
| Events | `src/config/products.json:145-161`; `src/config/products.json:253-267` | Planned concepts/prototypes | `Social wine moments and guided group rituals are part of the planned experience.` | Active live-hosted paid events; ticket booking; inventory | Mailto for updates only | Event product approval and booking runtime outside scope |
| Toasts game | `src/config/products.json:145-161` | Planned; evidence in game prototype | `Social wine moments and guided group rituals are part of the planned experience.` | Production multiplayer game; paid toast events | Same section as tasting concepts; mailto optional | Owner naming and product boundaries |
| Premium access | `src/config/products.json:181-197` | Planned/under consideration | `Premium membership concepts are under consideration.` | Live benefits; final prices; active subscription billing | Do not include as CTA in v1 | Legal and pricing review |
| Subscriptions | `src/config/products.json:181-197`; exclusions at `docs/content/LANDING-WEBSITE-COPY-02.md:658-660` | Not active | `Not offered here.` | Monthly billing; cancel-anytime terms; member tiers as live | No CTA | Pricing, legal, billing, and product approval |
| Authentication | Homepage report scope excludes auth at `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:21-24`; prototypes contain auth copy | Not implemented for public page | No visible auth copy | Sign up, log in, OTP, age gate, account creation | No CTA | Separate auth implementation and legal review |
| Multilingual support | `src/config/locales.json`; `src/i18n/apply-tt141.js:2-77`; homepage report `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:248-264` | Query-param language shell exists; visible copy remains English-first unless translations are supplied | `Language selection preserves state; English copy is canonical for this page.` | Fully localized page; universal localization | Language menu links only | Translation assets and i18n coverage |

## 10. CTA Architecture

CTA count: 17 page CTA and header/navigation mappings. Footer support navigation and footer contact links are not included in this count.

| # | Visible label | Section | Priority | Type | Target | Route or anchor | Required destination state | Fallback behavior if destination is not implemented | Analytics event name | Accessibility label | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `Home` | Header | Utility | Nav link | Homepage | `/` | Existing route | None | `wine_lovers_nav_home_click` | `Go to Tasting & Toasting home` | Ready |
| 2 | `Wine Lovers` | Header | Utility | Nav link | Current page | `/wine-lovers` | Implemented route | Current page link remains valid after implementation | `wine_lovers_nav_self_click` | `Wine Lovers page` | Ready after route implementation |
| 3 | `Passport` | Header | Secondary | Anchor/link | Passport context | `#passport-context` for v1 | Anchor exists | Change to `/passport` only after page exists | `wine_lovers_nav_passport_click` | `Read Passport context on this page` | Fallback required in v1 |
| 4 | `Legal` | Header | Support | Nav link | Legal notice | `/legal` | Existing route | None | `wine_lovers_nav_legal_click` | `Review legal notice` | Ready |
| 5 | `Email for wine lover access` | Hero | Primary | Mail link | Consumer interest | `mailto:hello@tastingandtoasting.com?subject=Wine%20lover%20access` | Existing email route | Keep mailto until waitlist destination and consent flow are approved | `wine_lovers_hero_email_access_click` | `Email Tasting & Toasting about wine lover access` | Ready |
| 6 | `See Passport context` | Hero | Secondary | Anchor | Passport section | `#passport-context` | Anchor exists | None | `wine_lovers_hero_passport_context_click` | `Read Passport context on this page` | Ready |
| 7 | `See how the platform helps` | Discovery | Secondary | Anchor | How-it-helps section | `#how-it-helps` | Anchor exists | None | `wine_lovers_discovery_how_it_helps_click` | Same as visible label | Ready |
| 8 | `Ask about tasting updates` | Tasting concepts | Support | Mail link | Tasting updates | `mailto:hello@tastingandtoasting.com?subject=Wine%20tasting%20updates` | Existing email route | None | `wine_lovers_tasting_updates_email_click` | `Email Tasting & Toasting about tasting updates` | Ready |
| 9 | `Review privacy information` | Notes and library | Support | Route link | Privacy page | `/privacy` | Existing route | None | `wine_lovers_privacy_click` | Same as visible label | Ready |
| 10 | `Learn how Passport works` | Passport context | Secondary | Anchor/link | Passport context or future page | `#passport-context` for v1 | Anchor exists | Change to `/passport` only after implemented | `wine_lovers_passport_learn_click` | `Read Passport context on this page` | Fallback required in v1 |
| 11 | `Email for wine lover access` | Availability | Primary | Mail link | Consumer interest | `mailto:hello@tastingandtoasting.com?subject=Wine%20lover%20access` | Existing email route | Keep mailto until waitlist destination and consent flow are approved | `wine_lovers_availability_email_access_click` | `Email Tasting & Toasting about wine lover access` | Ready |
| 12 | `Legal notice` | Availability | Support | Route link | Legal notice | `/legal` | Existing route | None | `wine_lovers_legal_notice_click` | `Review legal notice` | Ready |
| 13 | `Privacy` | Availability | Support | Route link | Privacy page | `/privacy` | Existing route | None | `wine_lovers_availability_privacy_click` | `Review privacy policy` | Ready |
| 14 | `Terms` | Availability | Support | Route link | Terms page | `/terms` | Existing route | None | `wine_lovers_terms_click` | `Review terms of service` | Ready |
| 15 | `Back to homepage` | Related paths | Secondary | Route link | Homepage | `/` | Existing route | None | `wine_lovers_back_home_click` | `Go back to the homepage` | Ready |
| 16 | `Email Tasting & Toasting` | Related paths | Support | Mail link | General contact | `mailto:hello@tastingandtoasting.com` | Existing email route | None | `wine_lovers_related_email_click` | `Email Tasting & Toasting` | Ready |
| 17 | `Review legal information` | Related paths | Support | Route link | Legal notice | `/legal` | Existing route | None | `wine_lovers_related_legal_click` | `Review legal information` | Ready |

Duplicate CTA labels are intentional where they repeat a safe primary action in both the hero and availability section. Repeated destinations must use separate analytics events when the section context differs. Footer links are footer support navigation and are not part of the 17 page CTA mappings.

Withheld until approved:

| Label | Reason withheld | Safe replacement |
| --- | --- | --- |
| `Join the wine lover waitlist` | Waitlist destination, consent text, fields, processor, and retention language are unresolved. | `Email for wine lover access` |
| `/for-wineries` link | Future route not implemented. | Link to `/` or `/#for-wineries` only if homepage anchor behavior is validated from the new page; otherwise use plain text. |
| `/passport` link | Future overview route not implemented. | Same-page `#passport-context` anchor. |
| Marketplace, purchase, subscription, event booking CTAs | Unsupported public functionality. | Informational boundary copy only. |

## 11. Route Behavior

| Behavior | Specification |
| --- | --- |
| Canonical route | `/wine-lovers` |
| Source file expected in implementation | `wine-lovers.html` at repository root, unless the implementation task establishes a different static-page convention and updates registries consistently. |
| Clean URL | Vercel `cleanUrls: true` means `/wine-lovers` should serve the static HTML source without exposing `.html`. |
| Trailing slash | `trailingSlash: false`; canonical and internal links use `/wine-lovers`, not `/wine-lovers/`. |
| Query parameters | Unknown query parameters must not change content or create errors. Preserve them only when current runtime already does so safely. |
| Language query | `?lang=en` sets English/LTR; `?lang=he` sets Hebrew/RTL document attributes through existing runtime behavior. Visible copy remains English unless translations are supplied. |
| Internal anchors | `#how-it-helps`, `#tasting-social`, `#notes-library`, `#passport-context`, `#availability`, and `#related-paths` must scroll below the fixed header and respect reduced motion. |
| Homepage navigation to `/wine-lovers` | Implementation may update homepage links from `#wine-lovers` to `/wine-lovers` only in the separate implementation task after route validation passes. |
| Navigation from `/wine-lovers` to homepage | Use `/` for Home and footer; use `/#about` only if adding About as a direct header/footer link. |
| Expected 404 behavior | Before deployment or route registration, `/wine-lovers` must not be linked from public nav. After implementation, route coverage tests must show it is registered and served. |
| Handling before deployment | Keep the route out of public links until `wine-lovers.html`, `src/config/pages.json`, `src/config/routes.json`, href validation, and screenshots pass. |
| Registry changes required during implementation | Add implemented page entry to `src/config/pages.json`; update `src/config/routes.json` `/wine-lovers` source/currentState as implemented; do not touch product claims unless source docs change. |
| Tests required | Page registry validation, route coverage audit, HTML parsing, href validation, language query checks, and homepage regression checks. |

## 12. Component Model

Reusable component count: 10.

| Component | Purpose | Required content | States | Responsive behavior | Accessibility behavior | Exists on homepage? | Reuse or extend |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Site header | Global navigation, brand, status/language controls | Logo, Home, Wine Lovers, Passport, Legal, language menu | Desktop, mobile menu open/closed, current page | Fixed header; mobile drawer below breakpoint | `header`, `nav`, `aria-expanded`, visible focus, 44px targets | Yes | Reuse with page-specific nav |
| Language switcher | Preserve query-param language state | EN/FR/RU/ES/UK/IT/DE/HE/PT/KA/RO/PL links | Current language, menu open/closed | Compact desktop; inside mobile drawer | `aria-current`, labelled button, Escape closes | Yes | Reuse existing runtime |
| Hero | First-screen positioning | Eyebrow, H1, body, status, two CTAs | Asset-free, approved-media optional | Two-column desktop; single-column mobile | One H1, readable focus order | Yes | Extend copy/content only |
| Status panel | Communicate pre-launch truth | Status eyebrow, heading, body, badges | Available/preparing/not offered | Grid or stacked panel | Status text visible, not color-only | Yes | Reuse |
| Card grid | Discovery value cards | Card heading, body, badge | Static, optional internal anchor | 3-up desktop; stacked mobile | Article/list semantics; focus only if clickable | Yes | Reuse |
| Feature list | Explain platform help | Heading, body, status label | Static | Two columns desktop; one column mobile | Semantic list, no color-only meaning | Yes | Extend |
| Trust panel | Passport limitations | Heading, body, CTA | No asset, asset-supported | Limitation stays adjacent to Passport copy | Clear wording; no hidden disclaimers | Yes | Reuse |
| CTA row | Action grouping | Primary/secondary links | Horizontal/wrapped/stacked | Wrap before overflow; stack at 375px | Link text unique enough; focus visible | Yes | Reuse |
| CTA band | Final transition | Eyebrow, heading, body, CTAs | Text-only | Full-width band; no nested card | Landmark section, clear heading | Yes | Reuse |
| Site footer | Public/legal/contact links | Logo, footer transition, nav groups, email links | Static | 4 columns desktop; 2 tablet; 1 mobile | Footer landmark, labelled nav groups | Yes | Reuse |

## 13. Visual Direction

| Area | Specification |
| --- | --- |
| Page tone | Warm, welcoming, practical, and clear. It should feel like a confident consumer information page, not a luxury magazine spread or app sales funnel. |
| Relationship to homepage | Reuse homepage palette, type scale, fixed header, cards, panels, CTA rows, and footer. Do not introduce a second design system. |
| Spacing rhythm | Follow homepage rhythm: generous section padding on desktop, tighter but breathable spacing on mobile. Maintain fixed-header scroll offset. |
| Typography hierarchy | One H1; section headings use the homepage serif scale; cards use smaller headings. Letter spacing stays at 0 for display text. |
| Card behavior | Cards use 8px radius or less, stable padding, and no nested cards. Cards should not resize unpredictably on hover. |
| Background treatments | Use the homepage dark/wine/gold palette and restrained band backgrounds. Do not add decorative orbs, bokeh, or unrelated gradients. |
| Icon usage | Icons are optional. If used, prefer the existing visual language and ensure accessible labels. Do not add icon-only meaning. |
| Imagery rules | Use only approved consumer photography, approved Passport screenshot, or approved hierarchy diagram. The page may ship text-first if assets are missing. |
| Decorative elements | Logo assets may be used; decorative texture must be subtle and non-essential. |

## 14. Asset Plan

### Required

| Asset | Purpose | Existing or missing | Path | Dimensions/aspect ratio | Alt text | Loading priority | Fallback | Proceed without it? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Navigation logo | Header brand | Existing | `assets/logo_nav.png` | Use existing intrinsic ratio; rendered 193x30 if matching homepage | `Tasting & Toasting` | Eager | Text brand link | Yes, if text replacement is accessible |
| Footer logo | Footer brand | Existing | `assets/logo_footer.png` | Use existing intrinsic ratio; rendered 142x22 if matching homepage | `Tasting & Toasting` | Lazy | Text brand | Yes |
| Favicon | Browser icon | Existing | `assets/favicon-64.png` | 64x64 PNG | Not applicable | Head resource | Omit only if current site pattern changes | Yes |

### Recommended

| Asset | Purpose | Existing or missing | Path | Dimensions/aspect ratio | Alt text | Loading priority | Fallback | Proceed without it? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Wine lover hero image | Consumer warmth and context | Missing | Owner-approved future path only | 16:10 or 4:3, responsive dimensions declared | `People tasting wine and reading bottle context at a table` | Eager only if in first viewport | Text-first status panel | Yes |
| Consumer discovery/tasting image | Support discovery section | Missing | Owner-approved future path only | 4:3 or 1:1 | `Wine tasting notes beside a glass and bottle` | Lazy | Card grid | Yes |
| Passport scan screenshot | Explain Passport context | Missing | Owner-approved future path only | Device screenshot or 4:3 crop | `Example Passport record showing recorded bottle context` | Lazy | Text trust panel | Yes |
| Passport hierarchy diagram | Explain bottle/vintage/wine/winery relationship | Missing | Owner-approved future path only | Wide desktop, stacked mobile | Text equivalent of record relationship | Lazy | Text list | Yes |

### Optional

| Asset | Purpose | Existing or missing | Path | Dimensions/aspect ratio | Alt text | Loading priority | Fallback | Proceed without it? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Blind tasting visual | Support tasting concept if prototype scope approved | Missing | Owner-approved future path only | 16:9 | `Blind tasting setup with covered bottle labels` | Lazy | Text-only tasting section | Yes |
| Simple section icons | Improve scanning | Missing | Implementation-created only if consistent with homepage | 24x24 or CSS icons | Decorative or labelled per use | Inline | Text labels | Yes |

### Prohibited

| Asset | Reason |
| --- | --- |
| Speculative luxury stock photography | No approved asset and risks shifting tone away from truthful pre-launch context. |
| Unapproved winery, sommelier, partner, venue, award, or customer imagery | Would imply relationships or proof not evidenced in the repository. |
| Screenshots of prototype checkout, subscriptions, booking, or app auth flows | Would imply live unavailable functionality. |
| `og:image` | No approved social image exists. |

Asset gaps: wine lover hero image; consumer discovery/tasting image; blind tasting visual; Passport scan screenshot; Passport hierarchy diagram.

## 15. Responsive Specification

| Width | Navigation | Hero layout | Card grids | Section spacing | Typography | CTA wrapping | Image behavior | Order changes | Footer behavior | Overflow prevention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 375px | Mobile menu button visible; language links available in mobile panel; current page clear | Single column; status after hero body; H1 max 42-46px | One column | 52-64px vertical padding | No viewport-scaled font sizes beyond CSS `clamp` with safe minimums | CTAs stack; min 44px height | Optional images below copy; fixed aspect ratio | Source order preserved | Single column | `overflow-x: hidden`; no unbreakable long labels |
| 768px | Mobile or compact nav depending on fit; no collision with language button | Single column or two narrow columns only if readable | Two columns for cards if space permits | 64-76px | Section headings around 36-44px | CTAs wrap | Images can sit below or beside copy | No semantic reordering | Two columns | Cards use `minmax(0, 1fr)` |
| 1024px | Desktop nav visible; language dropdown compact | Two columns allowed: copy plus status/media | Three columns for discovery; two columns for dense lists | 76-86px | H1 up to 72px | Horizontal with wrap | Optional hero image/status panel stable dimensions | Source order remains logical | Two or three columns | Fixed header offset applied to anchors |
| 1440px | Full desktop nav with no hidden primary links | Two-column hero with max-width container | Three or four columns only where content remains scannable | Match homepage max-width rhythm | H1 up to homepage max; no oversized section headings | Horizontal groups; no clipped labels | Images have declared dimensions and lazy loading outside first viewport | No reordering needed | Four columns | Body, grids, and media constrained to site max-width |

## 16. Accessibility Specification

- Use semantic landmarks: `<header>`, `<main>`, `<section>`, `<nav>`, and `<footer>`.
- Include a skip link targeting `#main`.
- Use exactly one H1: `Drink with more memory, context, and confidence.`
- Preserve heading hierarchy: H1 in hero, H2 for sections, H3 for cards/panels.
- All keyboard-focusable elements must have visible focus states.
- Header/mobile menu and language menu must expose `aria-expanded` and close on Escape.
- Link and button targets must be at least 44px by 44px.
- Same-page anchor scrolling must respect fixed-header offset and `prefers-reduced-motion`.
- Color contrast must meet WCAG AA for text and interactive labels.
- Status cannot rely on color only; use visible text labels like `Preparing`, `Planned direction`, and `Where valid records exist`.
- Images need meaningful alt text when informative; decorative images use empty alt or `aria-hidden="true"`.
- Cards should use list/article semantics. Make an entire card clickable only if it has one destination and no nested interactive controls.
- Do not use text embedded only in images.
- Do not hide Passport limitation copy behind accordions, tooltips, or hover-only UI.
- Language/RTL behavior must not create unreadable layout or reversed punctuation in visible English copy.

## 17. SEO Specification

| Field | Value |
| --- | --- |
| Title | `Wine Lovers | Learn, Taste, And Remember Wine | Tasting & Toasting` |
| Meta description | `Explore the wine lover experience Tasting & Toasting is preparing, including wine discovery, tasting concepts, planned notes, taste profiles, and Passport-backed bottle context.` |
| Canonical URL | `https://tastingandtoasting.com/wine-lovers` |
| Open Graph title | `Wine Lovers | Learn, Taste, And Remember Wine | Tasting & Toasting` |
| Open Graph description | `Explore the wine lover experience Tasting & Toasting is preparing, including wine discovery, tasting concepts, planned notes, taste profiles, and Passport-backed bottle context.` |
| Open Graph type | `website` |
| Open Graph URL | `https://tastingandtoasting.com/wine-lovers` |
| Open Graph site name | `Tasting & Toasting` |
| Open Graph image | Do not specify until an approved asset exists. |
| Twitter card type | `summary` |
| Twitter title | `Wine Lovers | Learn, Taste, And Remember Wine | Tasting & Toasting` |
| Twitter description | `Explore the wine lover experience Tasting & Toasting is preparing, including wine discovery, tasting concepts, planned notes, taste profiles, and Passport-backed bottle context.` |
| Robots behavior | Index after approved implementation; noindex before implementation or if route is incomplete. |
| H1 | `Drink with more memory, context, and confidence.` |
| Internal linking | Link to `/`, `/legal`, `/privacy`, `/terms`, mailto contacts, and same-page anchors. Link to `/passport` and `/for-wineries` only after those routes are implemented. |
| Breadcrumb decision | No breadcrumb for this top-level Phase 1 page. |
| Schema decision | Do not add schema in v1; no supported product, event, FAQ, review, organization proof, or offer schema is approved. |

## 18. Language Behavior

| Behavior | Specification |
| --- | --- |
| Current supported behavior | Existing runtime supports query-param language selection and document `lang`/`dir` updates. |
| English-first status | English is the canonical visible copy for this specification. |
| `?lang=en` | Sets or preserves English and `dir="ltr"`. |
| `?lang=he` | Sets `lang="he"` and `dir="rtl"` through the runtime; visible copy remains English unless translations are provided. |
| `lang` attribute | Must be set consistently by the runtime and start as `<html lang="en">`. |
| Direction behavior | Only Hebrew should set RTL. Other languages remain LTR. |
| Selector state | Current language should have `aria-current="true"` and update the compact language button label/state. |
| Visible copy translation | Do not claim translated Wine Lovers copy exists unless translation files are added and validated. |
| Implementation limits | No machine translation at runtime; no unreviewed hidden translation strings. |
| Prohibited claims | Universal localization, complete multilingual page coverage, or localized legal consent. |

## 19. Analytics Plan

Do not implement analytics in this task. Recommended stable event names for the implementation task:

| Interaction | Event name |
| --- | --- |
| Page view | `wine_lovers_page_view` |
| Header Home click | `wine_lovers_nav_home_click` |
| Header self click | `wine_lovers_nav_self_click` |
| Header Passport click | `wine_lovers_nav_passport_click` |
| Header Legal click | `wine_lovers_nav_legal_click` |
| Hero primary CTA | `wine_lovers_hero_email_access_click` |
| Hero Passport CTA | `wine_lovers_hero_passport_context_click` |
| Discovery section CTA | `wine_lovers_discovery_how_it_helps_click` |
| Feature-card/internal anchor interaction | `wine_lovers_feature_anchor_click` |
| Tasting updates mail link | `wine_lovers_tasting_updates_email_click` |
| Final/availability email CTA | `wine_lovers_availability_email_access_click` |
| Legal link | `wine_lovers_legal_notice_click` |
| Availability privacy link | `wine_lovers_availability_privacy_click` |
| Notes privacy link | `wine_lovers_privacy_click` |
| Terms link | `wine_lovers_terms_click` |
| Navigation back to homepage | `wine_lovers_back_home_click` |
| Related email link | `wine_lovers_related_email_click` |
| Related legal link | `wine_lovers_related_legal_click` |
| Language selection | `wine_lovers_language_select` |

## 20. Performance Requirements

| Requirement | Specification |
| --- | --- |
| JavaScript budget | Reuse existing lightweight header/menu/language behavior. Do not add framework runtime. |
| Dependency policy | No new npm/package dependency for a static informational page. |
| Image loading | Eager-load only the brand logo and first-viewport approved hero image if present; lazy-load below-fold images. |
| Image dimensions | Declare `width`, `height`, or CSS `aspect-ratio` for every image to prevent layout shift. |
| Lazy loading | Use `loading="lazy"` for below-fold images. |
| Layout shift prevention | Stable grid columns, min-width `0`, explicit media ratios, and no hover-resizing. |
| Font policy | Match homepage font policy; do not add extra font families. |
| External resource policy | No new third-party scripts, trackers, embeds, videos, maps, or commerce widgets. |
| First render expectations | Core content, CTAs, legal links, and mailto links must be usable before optional JavaScript enhances menus/language. |
| Reduced motion | Smooth scrolling and transitions honor `prefers-reduced-motion`. |

## 21. Implementation Plan

| Wave | Work | Files likely affected | Dependencies | Validation | Completion criteria |
| --- | --- | --- | --- | --- | --- |
| 1 | Route and registry | `wine-lovers.html`, `src/config/pages.json`, `src/config/routes.json` | This specification; route naming decision | Registry tests and route coverage | `/wine-lovers` is implemented, registered, clean URL works, and no broken route appears |
| 2 | Shared shell reuse | `wine-lovers.html`; possibly shared CSS only if already approved | Homepage patterns | Visual review against homepage | Header, language selector, footer, card, status, and CTA patterns match homepage |
| 3 | Semantic page structure | `wine-lovers.html` | Final copy in this spec | HTML parser and heading audit | Eight sections appear in specified order with one H1 |
| 4 | Responsive styling | `wine-lovers.html` CSS or shared stylesheet | Homepage responsive patterns | 375/768/1024/1440 screenshots | No horizontal overflow, clipped text, or CTA collisions |
| 5 | CTA wiring | `wine-lovers.html`; homepage links only after route passes | Destination availability | href validation | CTA inventory matches this spec and no future route links are broken |
| 6 | Language behavior | `wine-lovers.html`; i18n files only if translations are explicitly in scope | Existing runtime | `?lang=en` and `?lang=he` checks | `lang`, `dir`, selector state, and link preservation work |
| 7 | SEO | `wine-lovers.html`; registries | Approved metadata | HTML head audit | Title, meta, canonical, OG/Twitter, robots policy are correct |
| 8 | Accessibility | `wine-lovers.html` | Final markup | Keyboard, focus, landmarks, contrast, reduced-motion checks | Page meets Section 16 |
| 9 | Tests | `tools/tests/*` only if current tests require updates for the new page | Existing validation tooling | `npm test` or targeted registry scripts | Tests cover page registry, route coverage, hrefs, and syntax |
| 10 | Screenshots and report | `docs/implementation/screenshots/wine-lovers-v1-review/*`, `docs/implementation/LANDING-WINE-LOVERS-IMPLEMENTATION-REPORT-01.md` | Implemented page and test run | Screenshot review | Durable screenshots and implementation report are stored |

Implementation must occur in a separate task/worktree from this specification task.

## 22. Testing Plan

| Test area | Required validation |
| --- | --- |
| Registry tests | Validate `src/config/pages.json` and `src/config/routes.json` after adding `/wine-lovers`. |
| Route coverage tests | Confirm `/wine-lovers` has a source file and no stale future-proposed state remains after implementation. |
| HTML parsing | Parse `wine-lovers.html`; fail on malformed tags, duplicate IDs, missing landmark structure, or missing metadata. |
| JavaScript syntax | Validate any inline script; prefer reusing homepage script exactly where practical. |
| href validation | Confirm all `href`s point to existing files/routes, same-page anchors, mailto links, or query-param language links. |
| Heading validation | One H1; section H2s in order; no skipped visible section title. |
| Accessibility checks | Keyboard navigation, focus visibility, target size, contrast, labels, `aria-expanded`, `aria-current`, reduced motion. |
| Keyboard checks | Tab through header, language menu, mobile menu, cards/CTAs, footer; Escape closes menus. |
| Mobile navigation checks | Open/close menu at 375px; links remain visible and tappable; no body scroll trap after close. |
| Language query checks | Load `/wine-lovers?lang=en` and `/wine-lovers?lang=he`; confirm `lang`, `dir`, current selector state, and link behavior. |
| Responsive screenshots | Store 375, 768, 1024, and 1440 full-page screenshots plus 375 menu-open screenshot. |
| Console checks | No console errors on initial load, menu interactions, language selection, or anchor clicks. |
| Performance checks | No new large assets or third-party scripts; image dimensions declared; no major layout shift. |
| Homepage regression | After implementation, homepage route links to `/wine-lovers` only if route is valid; existing homepage anchors/legal/mailto links remain valid. |

## 23. Acceptance Criteria

Publication-readiness checklist:

- All eight approved sections are implemented in the specified order.
- Final visible copy matches Section 8 or a later owner-approved copy document.
- No unsupported claims exist.
- No broken routes, anchors, mailto links, legal links, or language links exist.
- CTA inventory is reconciled with Section 10.
- `/wine-lovers` is registered in page and route registries after implementation.
- Responsive review passes at 375px, 768px, 1024px, and 1440px.
- Accessibility requirements in Section 16 pass.
- SEO metadata in Section 17 is present and correct.
- Language behavior in Section 18 is documented and working.
- All required tests pass.
- Screenshots are stored in the repository.
- Implementation report is complete.
- Homepage regression checks pass if homepage links are changed in the implementation task.
- Nothing unrelated is changed.
- No homepage code, CSS, JavaScript, runtime, mobile app, backend, authentication, subscriptions, CAP runtime, marketplace runtime, Ask Max runtime, Sommelier Workspace, Winery Workspace, deployment, commit, push, PR, merge, or deploy work is included in this specification task.

## 24. Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Overclaiming unavailable functionality | Use "being prepared", "planned direction", and "where valid records exist"; follow product registry safe claims. |
| Duplicating homepage content | Expand the consumer path with deeper sections; reuse only shared status/trust language where necessary. |
| Confusing Wine Library with Passport | State Wine Library is planned personal organization; Passport is recorded public bottle context. |
| Confusing Collector with Wine Library | Avoid collector-route CTAs and do not claim custody, resale, valuation, or inventory sync. |
| Implying subscriptions are active | Say subscriptions are not offered here; withhold premium CTAs and pricing. |
| Misleading multilingual presentation | Preserve language selector behavior but state English copy is canonical unless translations are supplied. |
| Missing assets | Use text-first implementation and existing logo assets; do not add `og:image`. |
| Dead future-route CTAs | Use same-page anchors, existing routes, mailto links, or plain text until future pages exist. |
| Consumer/professional audience mixing | Route winery/professional concepts away; do not include Sommelier Workspace, credential verification, or winery onboarding. |
| Design inconsistency | Reuse homepage shell, palette, typography, card, status, CTA, and footer patterns. |
| Accessibility regression | Require keyboard, focus, heading, contrast, target-size, reduced-motion, and anchor-offset checks. |

## 25. Open Owner Decisions

Open owner decision count: 7.

### Blocking Before Implementation

None if the safe defaults in this specification are used. A true waitlist form, stronger Passport trust copy, detailed account/profile UX, or direct links to unimplemented future routes would require the decisions below before implementation.

### Blocking Before Publication

None for a text-first, mailto-based, general-copy publication. Publication becomes blocked if owners require a real waitlist form, approved consumer visuals, stronger Passport screenshots/field lists, or direct `/passport` and `/for-wineries` links before launch.

### Non-Blocking Enhancement

| Decision | Why it matters | Repository evidence | Safe default | Implementation impact | Blocking or non-blocking |
| --- | --- | --- | --- | --- | --- |
| Approve consumer waitlist destination and consent model | Determines whether the page can use the source copy's waitlist CTA | Copy Pack v2 marks the waitlist destination required at `docs/content/LANDING-WEBSITE-COPY-02.md:300-306`; validation fallback appears at `docs/content/LANDING-WEBSITE-COPY-02.md:743-746`. | Use mailto fallback and avoid collecting form data | No form; CTA label remains `Email for wine lover access` | Non-blocking with fallback; blocking only for a true waitlist form |
| Approve public launch timing language | Prevents accidental date or availability promises | Pre-launch/no-commerce claims are used at `docs/content/LANDING-WEBSITE-COPY-02.md:621-623` and homepage status copy at `index.html:1087-1091`. | No timing promises | Availability section remains evergreen | Non-blocking |
| Approve blind tasting public naming | Decides whether "Blind Detective" can appear | `src/config/products.json:55-89` separates `blind-tasting` prototype evidence from `blind-detective` planned naming. | Use generic `blind tasting` | No branded game module or route link | Non-blocking |
| Approve consumer notes/profile privacy language | Needed before detailed storage or recommendation claims | `src/config/products.json:91-125` treats notes/profile as preparing; `docs/content/LANDING-WEBSITE-COPY-REVIEW-01.md:271-281` keeps storage/recommendation behavior unresolved. | Planned personal learning tools only | No account/profile UI | Non-blocking for general copy |
| Approve public Passport scan behavior and field-list detail | Needed before screenshots or exact scan-state copy | Valid-token behavior is evidenced at `src/config/products.json:127-143`; deeper scan states are unresolved at `docs/content/LANDING-WEBSITE-COPY-REVIEW-01.md:273-276`. | General valid-record language only | No example token or field table on page | Non-blocking for general copy |
| Approve visual assets or asset-free launch | Determines whether hero/proof visuals are included | Copy Pack v2 lists needed visuals at `docs/content/LANDING-WEBSITE-COPY-02.md:309-322`; homepage report keeps missing assets non-blocking at `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:292-302`. | Text-first launch using existing logo assets | Implementation can proceed without new assets | Non-blocking if asset-free launch is accepted |
| Confirm when `/passport` and `/for-wineries` are implemented | Determines whether direct links may replace same-page/homepage fallbacks | `src/config/routes.json:418-431` and `src/config/routes.json:516-527` mark both routes as future-proposed; homepage report documents same-page fallbacks at `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md:156-165`. | Use same-page Passport context and homepage/legal/email fallback routes | Prevents broken links | Non-blocking |

## 26. Final Implementation Handoff

| Handoff item | Instruction |
| --- | --- |
| Exact target route | `/wine-lovers` |
| Exact proposed implementation branch | `landing/wine-lovers-implementation-v1` |
| Expected base branch | `origin/landing/homepage-implementation-v1` |
| Likely files to change | `wine-lovers.html`, `src/config/pages.json`, `src/config/routes.json`, `docs/implementation/LANDING-WINE-LOVERS-IMPLEMENTATION-REPORT-01.md`, `docs/implementation/screenshots/wine-lovers-v1-review/*`; homepage links only if implementation validates the route and the implementation task explicitly includes homepage route reconciliation |
| Files that must not change without separate scope | Mobile application code, backend code, CAP runtime, authentication/runtime code, subscription/billing code, marketplace runtime, Ask Max runtime, Sommelier Workspace, Winery Workspace, deployment config unless route serving requires it, unapproved assets, unrelated docs |
| Validations required | `git diff --check`; `git status --short`; page registry validation; route coverage validation; HTML parsing; JavaScript syntax; href validation; heading validation; accessibility checks; keyboard checks; mobile navigation checks; language query checks; responsive screenshots; console checks; performance checks; homepage regression checks |
| Publication sequence | Implement route and registry; build page shell; add final copy; wire safe CTAs; validate language/SEO/accessibility/responsiveness; capture screenshots; write implementation report; only then expose homepage direct links if route is valid |
| Worktree instruction | Implementation must occur in a separate worktree and branch from this specification work. Do not implement the page in this specification task. |
