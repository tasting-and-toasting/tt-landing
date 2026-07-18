# Landing Website Copy 02

Task: Public Website Copy Pack v2

Scope: public Tasting & Toasting website copy only for `/`, `/wine-lovers`, `/for-wineries`, and `/passport`.

This document is a copy pack. It does not implement HTML, CSS, JavaScript, routes, registries, translations, SEO metadata, product requirements, backend behavior, application workflows, mobile application content, partner page copy, deployment, or design wireframes.

## 1. Executive Editorial Note

This v2 copy pack revises `docs/content/LANDING-WEBSITE-COPY-01.md` using the findings in `docs/content/LANDING-WEBSITE-COPY-REVIEW-01.md`.

The main change is editorial compression. The v1 pack was careful and well evidenced, but it carried too many internal review notes inside the visitor copy. This version keeps the same website-only scope, the same restrained trust posture, and the same distinction between current evidence and planned direction, while making the pages easier to read and easier to implement.

Key changes from v1:

- The homepage now opens with a clearer answer to what Tasting & Toasting is, who it serves, why it matters, and what the visitor should do next.
- The homepage has one primary CTA: **Choose your path**.
- Repeated legal, engineering, pricing, business, and asset dependencies have been moved into a deduplicated Validation Register.
- Headlines have been rewritten to be more specific and less generic.
- Audience pages now feel more distinct: `/wine-lovers` is warmer and consumer-oriented, `/for-wineries` is more practical and commercially credible, and `/passport` remains the main trust explainer.
- Current and planned capabilities are labelled only where the distinction affects publication safety.

## 2. Global Voice And Terminology

### Voice

The public website should sound clear, warm, practical, and careful. It should help visitors understand the product direction without asking them to read internal governance language.

Use:

- direct explanations;
- short paragraphs;
- concrete visitor benefits;
- restrained confidence;
- plain wine language;
- specific limitations where they protect trust.

Avoid:

- luxury cliches;
- abstract technology language;
- unsupported proof claims;
- compliance promises;
- conversion guarantees;
- generic "discover more" phrasing;
- repeated pre-launch caveats.

### Terminology

| Term | Public definition | Editorial boundary |
| --- | --- | --- |
| Tasting & Toasting | A public wine discovery and Passport platform being prepared for wine lovers, wineries, and people reading bottle records. | Final positioning sentence still needs business approval before publication. |
| Passport | The public explanation layer for recorded bottle, winery, wine, and vintage information where valid public Passport data exists. | Do not describe Passport as absolute proof, certification, anti-counterfeit protection, or legal compliance. |
| Wine lover | A consumer, enthusiast, collector, learner, or social taster who wants more context around what they drink. | Avoid assuming expert knowledge or production account features. |
| Winery | A producer or winery team preparing public wine, vintage, bottle, or winery information for reviewed Passport records. | Avoid implying open self-serve access, automatic publication, or guaranteed commercial results. |
| Partner | A business or ecosystem collaborator outside the consumer and winery paths. | `/partners` copy is excluded from this pack. Mentions should remain minimal and route decisions require separate approval. |
| Tasting | A guided or personal wine experience used for learning, remembering, and talking about wine. | Do not claim active paid events, booking inventory, delivered kits, or live hosted services. |
| Bottle information | Public record details associated with a bottle or related wine record. | Field lists require engineering and winery validation. |
| Verified information | Recorded information with an associated review or verification signal in the Passport context. | Verification status is a signal, not a blanket promise of authenticity or compliance. |
| Planned capability | A feature direction supported by repository evidence but not approved as live public functionality. | Label as **In preparation** or **Planned direction** when visitor expectations could otherwise be misleading. |

## 3. Global CTA System

Use sentence case for implemented button labels.

| Label | Intent | Destination | Status | Notes |
| --- | --- | --- | --- | --- |
| Choose your path | Primary homepage action; move the visitor to audience routing. | Same-page audience path module, implementation anchor required. | DESTINATION_REQUIRED | Primary homepage CTA. |
| For wine lovers | Route consumer visitors to the consumer page. | `/wine-lovers` | CONFIRMED | In-scope page in this copy pack. |
| For wineries | Route producer visitors to the winery page. | `/for-wineries` | CONFIRMED | In-scope page in this copy pack. |
| Learn how Passport works | Route trust-first visitors to the Passport explainer. | `/passport` | CONFIRMED | Preferred secondary CTA on `/` and `/wine-lovers`. |
| Join the wine lover waitlist | Capture consumer interest for launch updates. | Approved waitlist destination required. | DESTINATION_REQUIRED | Requires consent, processor, retention, and fields approval. |
| Request winery pilot access | Capture producer interest for reviewed pilot access. | Approved winery inquiry destination required. | DESTINATION_REQUIRED | Requires pilot criteria, data handling, and follow-up language. |
| Email Tasting & Toasting | Offer a low-risk public contact route. | `mailto:hello@tastingandtoasting.com` | CONFIRMED | Use when no form is approved. |
| Review legal information | Route visitors to legal support pages. | `/legal`, `/privacy`, `/terms` | CONFIRMED | Legal pages exist as support destinations. |
| Choose your Passport path | Route Passport readers by role. | `/wine-lovers`, `/for-wineries`, legal support links; partner destination requires separate approval. | BUSINESS_DECISION_REQUIRED | Keep partner routing out of page copy until approved. |

## 4. Homepage `/`

### Purpose

Introduce Tasting & Toasting, explain the four public website paths in scope, establish a careful trust frame for Passport, and help visitors choose the next page.

### Audience

New visitors, wine lovers, wineries, and Passport-first readers.

### SEO Working Title

Tasting & Toasting | Wine Discovery And Bottle Passport Context

### Meta Description

Tasting & Toasting is preparing a public wine discovery and Passport platform for wine lovers, wineries, and people reading recorded bottle information.

### H1

Wine discovery and bottle context, brought into one public platform.

### Hero Copy

**Kicker:** Tasting & Toasting

**Headline:** Wine discovery and bottle context, brought into one public platform.

**Body:** Tasting & Toasting helps people find the right wine path: learn as a wine lover, prepare public Passport records as a winery, or understand the information connected to a bottle.

**Why it matters:** Wine is easier to enjoy when the story, producer, vintage, and recorded bottle information are close at hand.

**Primary CTA:** Choose your path

**Secondary CTA:** Learn how Passport works

[BUSINESS_DECISION_REQUIRED: approve the final public positioning sentence for Tasting & Toasting before publication.]

### Full Section-By-Section Copy

#### Start With Your Role

**Intro:** Choose the page that matches what you need today.

**Path cards:**

- **For wine lovers:** Taste, learn, and remember more about the wines you enjoy.
- **For wineries:** Prepare public wine, vintage, bottle, and winery information for reviewed Passport records.
- **Passport:** See how recorded bottle information can be shown and explained.
- **Company and legal:** Review public status, contact details, legal notice, privacy, and terms.

#### What Tasting & Toasting Connects

**Headline:** Wine stories need a place to travel.

**Body:** A wine can begin with a producer, continue through a bottle, and end up at a dinner table, tasting, cellar, or gift. Tasting & Toasting is being prepared to connect those moments with clearer discovery tools and public Passport records.

For wine lovers, that means more context while tasting. For wineries, it means a practical way to prepare reviewed public information. For Passport readers, it means a clearer view of what has been recorded for a bottle or related wine record.

#### Passport Trust Overview

**Headline:** Passport shows recorded context.

**Body:** Passport pages can show public data where valid records exist, including recorded provenance, traceability, verification status, and bottle, winery, wine, or vintage information.

**Limitations copy:** Passport context can support a more informed reading of a bottle. It should not be presented as absolute proof of authenticity, certification, anti-counterfeit protection, or legal compliance.

[LEGAL_REVIEW_REQUIRED: approve final global Passport limitations wording before publication.]

#### Current Status

**Headline:** Available now, in preparation, and planned direction.

**Status copy:**

- **Available now:** Public website, contact channels, legal support pages, and public Passport page types where valid records exist.
- **In preparation:** Consumer wine discovery, winery Passport preparation, and reviewed public page routes for `/wine-lovers`, `/for-wineries`, and `/passport`.
- **Planned direction:** Broader consumer experiences, tasting concepts, profile tools, QR label concepts, and e-label support, subject to review.

**Pre-launch notice:** During pre-launch, the public website provides information, waitlist or inquiry routes, contact channels, and legal support pages. It does not offer commercial wine sales, event ticketing, purchases, payments, live subscriptions, or final pricing.

#### Proof And Trust Placeholders

**Headline:** What the page should be ready to show.

**Copy:** Use proof only where the underlying material has been approved for public marketing. Suitable proof may include public legal links, approved brand assets, approved screenshots of Passport records, and a concise visual explanation of how a bottle, vintage, wine, and winery record relate.

#### Footer And Internal Links

**Headline:** Keep public paths simple.

**Copy:** The homepage should link clearly to `/wine-lovers`, `/for-wineries`, `/passport`, `/#about`, `/legal`, `/privacy`, and `/terms`. Restricted setup, access-code, prototype, internal preview, and design-reference routes should not appear as public footer destinations.

### Primary And Secondary CTAs

| Priority | Label | Intent | Destination | Status |
| --- | --- | --- | --- | --- |
| Primary | Choose your path | Move to audience routing. | Same-page audience path module, anchor required. | DESTINATION_REQUIRED |
| Secondary | Learn how Passport works | Explain trust and bottle context. | `/passport` | CONFIRMED |
| Audience | For wine lovers | Route consumer visitors. | `/wine-lovers` | CONFIRMED |
| Audience | For wineries | Route producers. | `/for-wineries` | CONFIRMED |
| Support | Review legal information | Route to legal support. | `/legal`, `/privacy`, `/terms` | CONFIRMED |

### Trust Placeholders

- Public legal, privacy, and terms links.
- Public contact email: `hello@tastingandtoasting.com`.
- Approved brand logo assets.
- Approved Passport screenshots or explicit asset-free launch decision.
- Approved Passport hierarchy visual.

### Required Assets

- Homepage hero image or explicit asset-free launch decision.
- Brand logo usage rules.
- Passport overview screenshot or diagram.
- Proof module screenshot set, only if approved for public marketing.

### Internal Links

- `/wine-lovers`
- `/for-wineries`
- `/passport`
- `/#about`
- `/legal`
- `/privacy`
- `/terms`

### Essential Inline Validation Markers

- Business decision: final public positioning sentence.
- Legal review: global Passport limitations wording.

## 5. Wine Lovers `/wine-lovers`

### Purpose

Explain the consumer wine discovery path in welcoming language, invite interest in future access, and connect consumer curiosity to Passport without overclaiming live features.

### Audience

Wine-curious consumers, social tasters, collectors, enthusiasts, and people who want more context without needing formal wine expertise.

### SEO Working Title

Wine Lovers | Learn, Taste, And Remember Wine | Tasting & Toasting

### Meta Description

Explore the wine lover experience Tasting & Toasting is preparing, including wine discovery, tasting concepts, planned notes, taste profiles, and Passport-backed bottle context.

### H1

Drink with more memory, context, and confidence.

### Hero Copy

**Kicker:** For wine lovers

**Headline:** Drink with more memory, context, and confidence.

**Body:** Tasting & Toasting is preparing wine discovery and tasting experiences for people who want to learn through the glass. The goal is simple: help you notice what you enjoy, remember what you tasted, and understand more about the bottle in front of you.

**Primary CTA:** Join the wine lover waitlist

**Secondary CTA:** Learn how Passport works

[DESTINATION_REQUIRED: approve consumer waitlist destination, consent text, fields, processor, and retention language before publication.]

### Full Section-By-Section Copy

#### Wine Discovery Without The Snobbery

**Headline:** Better questions make wine easier to enjoy.

**Body:** You do not need to know every region, grape, or technical term to have a good tasting experience. Tasting & Toasting is being prepared to help people explore styles, producers, regions, and bottle stories in language that works at the table.

**Copy blocks:**

- **Find context:** Learn what makes a wine worth noticing.
- **Build taste memory:** Connect what you drink with what you actually enjoy.
- **Keep the moment:** Save the story around the bottle, not just the name on the label.

#### Tasting Concepts

**Headline:** Tasting should feel social before it feels technical.

**Body:** Blind tasting is represented in the repository as a prototype experience. Public copy should treat it as a concept in preparation, useful for learning and social play, not as a production multiplayer game, paid event product, or final branded release.

**Support copy:** Use the phrase "blind tasting" until the final public naming decision is approved.

#### Notes And Taste Profile

**Headline:** Make your own taste easier to remember.

**Body:** Tasting note capture is part of the planned consumer experience. Taste profiling is also planned as a future personalization direction. These should be presented as personal learning tools, separate from Passport, provenance, or verification data.

**Planned direction label:** Notes and taste profile features are planned direction until privacy, storage, and recommendation behavior are approved.

#### Passport-Backed Bottle Context

**Headline:** When a bottle has a Passport, the story can travel with it.

**Body:** Bottle scan links can open public Passport data where a valid token exists. For wine lovers, Passport can help explain what is recorded for the bottle or related wine record, including producer context and available public information.

**Limitations copy:** A Passport can show what is recorded. It should not be treated as a guarantee that every bottle is authentic, certified, or compliant in every jurisdiction.

#### Availability

**Headline:** Be first to hear when reviewed access opens.

**Body:** During pre-launch, consumer access is being prepared. The website can invite interest for launch updates, but it should not promise timing, availability, purchases, deliveries, event booking, live subscriptions, or final pricing.

**CTA block:** Join the wine lover waitlist. Learn how Passport works. Email Tasting & Toasting.

#### Related Paths

**Headline:** Looking for another route?

**Body:** Wineries should use `/for-wineries`. Visitors trying to understand bottle records should use `/passport`. Legal and privacy information should remain available through `/legal`, `/privacy`, and `/terms`.

### Primary And Secondary CTAs

| Priority | Label | Intent | Destination | Status |
| --- | --- | --- | --- | --- |
| Primary | Join the wine lover waitlist | Capture consumer launch interest. | Approved waitlist destination required. | DESTINATION_REQUIRED |
| Secondary | Learn how Passport works | Explain bottle context and trust boundaries. | `/passport` | CONFIRMED |
| Support | Email Tasting & Toasting | Provide a low-risk contact route. | `mailto:hello@tastingandtoasting.com` | CONFIRMED |
| Related | For wineries | Route misdirected producer visitors. | `/for-wineries` | CONFIRMED |

### Trust Placeholders

- Pre-launch notice.
- Public legal, privacy, and terms links.
- Approved consumer discovery visual.
- Approved blind tasting visual if the prototype scope is cleared for public marketing.
- Approved Passport scan screenshot for consumer explanation.

### Required Assets

- Wine lover hero image.
- Consumer tasting or discovery photography.
- Blind tasting visual, if naming and prototype scope are approved.
- Passport scan screenshot for consumer page.

### Internal Links

- `/passport`
- `/privacy`
- `/terms`
- `/for-wineries`
- `/legal`

### Essential Inline Validation Markers

- Destination required: consumer waitlist destination, consent text, fields, processor, and retention language.

## 6. For Wineries `/for-wineries`

### Purpose

Explain the winery-facing value of Tasting & Toasting in practical terms: reviewed public Passport records, bottle identity, producer storytelling, and controlled pilot inquiry.

### Audience

Wineries, producers, and winery teams evaluating public Passport data, bottle identity, and reviewed onboarding conversations.

### SEO Working Title

For Wineries | Wine Passport Records | Tasting & Toasting

### Meta Description

For wineries preparing public digital Passport data, bottle identity, and reviewed producer information with Tasting & Toasting.

### H1

Prepare your wine story for the bottle and the public record.

### Hero Copy

**Kicker:** For wineries

**Headline:** Prepare your wine story for the bottle and the public record.

**Body:** Tasting & Toasting is preparing tools for wineries to create and manage public digital Passport data. The winery path is for producers who want bottle, wine, vintage, and winery information to be easier for customers and partners to read.

**Primary CTA:** Request winery pilot access

**Secondary CTA:** Learn how Passport works

[DESTINATION_REQUIRED: approve winery inquiry destination, pilot criteria, data handling, consent, retention, and follow-up language before publication.]

### Full Section-By-Section Copy

#### Practical Value For Producers

**Headline:** Give recorded wine information a clearer public home.

**Body:** A bottle often has more context than a label can hold. Tasting & Toasting is being prepared to help wineries organize producer-approved information into reviewed public Passport records.

**Copy blocks:**

- **For the bottle:** Help readers find recorded bottle-level context.
- **For the wine:** Connect a bottle to wine and vintage information where valid records exist.
- **For the winery:** Present producer information in a structured public record.

#### Passport Data Model

**Headline:** Winery, wine, vintage, and bottle records can work together.

**Body:** Repository evidence supports public Passport page types for bottle, winery, wine, and vintage records. A safe public explanation is that a bottle record may connect to a vintage, wine, and winery when valid public data exists.

**Support copy:** The exact hierarchy wording and public field list need engineering and winery validation before final publication.

[ENGINEERING_VALIDATION_REQUIRED: approve final public Passport hierarchy, field list, and scan behavior for winery and Passport pages.]

#### Controlled Onboarding

**Headline:** Reviewed access, not open self-serve setup.

**Body:** Winery onboarding evidence exists in restricted and public-noindex surfaces. Public copy should invite wineries into a reviewed inquiry or pilot access path, not direct them to restricted setup forms or imply that submitted materials are published automatically.

**Microcopy:** Tell us who you are, what you produce, and what Passport or bottle identity question you want to explore.

#### Bottle Identity

**Headline:** Make recorded bottle information easier to read.

**Body:** Bottle identity pages can display recorded bottle-level data and verification status. This can help customers and trade readers understand available public information for a bottle or related record.

**Limitations copy:** Bottle identity should not be described as legal certification, anti-counterfeit protection, universal authenticity proof, EU compliance, or guaranteed market performance.

#### QR And E-Label Boundaries

**Headline:** QR access and compliance claims are separate decisions.

**Body:** QR label concepts are being explored for winery Passport access. EU e-label support is a planned compliance direction. Public winery copy may discuss these as planning areas only, unless legal, product, engineering, and pricing review approve stronger language.

**Planned direction label:** QR and e-label language remains planned direction unless validated for publication.

#### Materials A Winery May Need

**Headline:** Passport content depends on records a winery can stand behind.

**Body:** Public Passport records should be built from producer-approved materials. Potential content areas may include winery profile information, wine and vintage information, bottle-level data, producer story, images, and review status.

**Support copy:** The final public checklist should state what the winery provides, what Tasting & Toasting prepares, and what must be reviewed before publication.

#### Related Paths

**Headline:** Need the trust explainer first?

**Body:** Use `/passport` for the general Passport overview. Consumers should use `/wine-lovers`. Legal, privacy, and terms information should remain available from support links.

### Primary And Secondary CTAs

| Priority | Label | Intent | Destination | Status |
| --- | --- | --- | --- | --- |
| Primary | Request winery pilot access | Capture producer interest for reviewed access. | Approved winery inquiry destination required. | DESTINATION_REQUIRED |
| Secondary | Learn how Passport works | Explain record structure and trust boundaries. | `/passport` | CONFIRMED |
| Support | Email Tasting & Toasting | Provide fallback contact if no form is approved. | `mailto:hello@tastingandtoasting.com` | CONFIRMED |
| Related | For wine lovers | Route misdirected consumer visitors. | `/wine-lovers` | CONFIRMED |
| Support | Review legal information | Route compliance-sensitive visitors. | `/legal`, `/privacy`, `/terms` | CONFIRMED |

### Trust Placeholders

- Public Passport page types for bottle, winery, wine, and vintage records.
- Approved Passport hierarchy diagram.
- Approved winery or bottle Passport screenshot.
- Legal, privacy, and terms links.
- Approved winery inquiry privacy and retention language.

### Required Assets

- Winery hero image.
- Passport hierarchy diagram.
- Winery Passport screenshot.
- Bottle identity screenshot or bottle-label visual.
- QR or label visual only if QR copy remains on the page after review.
- Winery onboarding checklist asset, if approved.

### Internal Links

- `/passport`
- `/wine-lovers`
- `/privacy`
- `/legal`
- `/terms`

### Essential Inline Validation Markers

- Destination required: winery inquiry destination, pilot criteria, data handling, consent, retention, and follow-up language.
- Engineering validation: public Passport hierarchy, field list, and scan behavior for winery and Passport pages.

## 7. Passport `/passport`

### Purpose

Explain Passport as the public trust and product concept behind recorded bottle, winery, wine, and vintage information.

### Audience

Consumers, wineries, collectors, trade readers, and anyone who scans a bottle or wants to understand what Passport can and cannot show.

### SEO Working Title

Passport | Bottle, Wine, Vintage, And Winery Records | Tasting & Toasting

### Meta Description

Learn how Tasting & Toasting Passport pages can show recorded public bottle, winery, wine, and vintage information where valid Passport records exist.

### H1

Bottle context, recorded carefully.

### Hero Copy

**Kicker:** Passport

**Headline:** Bottle context, recorded carefully.

**Body:** Passport is the public explanation layer for recorded bottle, winery, wine, and vintage information where valid Passport data exists. It helps readers see what is connected to a bottle without turning a scan into an unlimited proof claim.

**Primary CTA:** Choose your Passport path

**Secondary CTA:** Review legal information

[LEGAL_REVIEW_REQUIRED: approve final Passport disclaimer for provenance, verification status, authenticity, certification, anti-counterfeit, and compliance boundaries.]

### Full Section-By-Section Copy

#### What Passport Can Show

**Headline:** A scan can show what is recorded.

**Body:** Bottle scan links can open public Passport data where a valid token exists. A valid Passport page may show available public information connected to the bottle, related wine, vintage, winery, recorded provenance, traceability, verification status, descriptions, facts, and related links.

**Support copy:** Exact field names, examples, invalid-record behavior, missing-record behavior, and screenshots require engineering and winery validation before publication.

#### How Records Relate

**Headline:** From producer to bottle.

**Body:** Public Passport page types exist for winery, wine, vintage, and bottle records. In plain language, a bottle record may connect upward to a vintage, wine, and winery when valid public data exists.

**Reader value:** This helps someone move from the physical bottle to the structured public information available for that record.

#### Verification Status

**Headline:** Verification status is a signal.

**Body:** Verification status can help readers understand the review state of recorded information. It should be treated as a signal within the Passport context, not as a blanket guarantee of authenticity, certification, anti-counterfeit protection, or legal compliance.

**Support copy:** The source and lifecycle of verification status values need engineering, legal, and winery validation before final public wording.

#### For The Person Holding The Bottle

**Headline:** Read the bottle with more context.

**Body:** A consumer can use Passport to read available bottle context, connect a wine to its producer story, and support a more informed tasting or collection note.

**Boundary:** Consumer use cases should stay general until journey language, collector language, and imagery are approved.

#### For The Producer Behind The Bottle

**Headline:** Prepare records that customers can read.

**Body:** A winery can use Passport concepts to prepare public digital records for winery, wine, vintage, and bottle information. Those records should be reviewed before publication and should not imply open self-serve access, automatic approval, or guaranteed commercial outcomes.

#### What Passport Does Not Claim

**Headline:** Context is useful because its limits are clear.

**Body:** Passport should not be described as guaranteed authenticity, absolute proof of authenticity, certified authenticity, anti-counterfeit protection, EU regulatory compliance, e-label certification, legal readiness, active sales, live subscriptions, final pricing, live event booking, complete automation, or universal localization.

#### Available Now And Planned Direction

**Headline:** Keep scan facts separate from future plans.

**Status copy:**

- **Available now:** Public Passport page types and tokenized bottle scan behavior where valid records exist.
- **In preparation:** Public overview copy for `/passport`, winery-facing record preparation, and consumer-facing explanations.
- **Planned direction:** QR label concepts and EU e-label support, subject to legal, product, engineering, and pricing review.

#### Audience Next Steps

**Headline:** Choose the next page by role.

**Path copy:**

- **I drink wine:** Go to `/wine-lovers`.
- **I represent a winery:** Go to `/for-wineries`.
- **I need legal context:** Go to `/legal`, `/privacy`, or `/terms`.
- **I need general contact:** Email `hello@tastingandtoasting.com`.

### Primary And Secondary CTAs

| Priority | Label | Intent | Destination | Status |
| --- | --- | --- | --- | --- |
| Primary | Choose your Passport path | Route Passport readers by role. | `/wine-lovers`, `/for-wineries`, legal support links, email contact. | CONFIRMED |
| Secondary | Review legal information | Route to public legal support. | `/legal`, `/privacy`, `/terms` | CONFIRMED |
| Audience | For wine lovers | Route consumer readers. | `/wine-lovers` | CONFIRMED |
| Audience | For wineries | Route producers. | `/for-wineries` | CONFIRMED |
| Support | Email Tasting & Toasting | Provide general contact. | `mailto:hello@tastingandtoasting.com` | CONFIRMED |

### Trust Placeholders

- Public Passport page types for bottle, winery, wine, and vintage records.
- Approved Passport hierarchy diagram.
- Approved sample token or sample Passport record.
- Approved scan screenshot set.
- Public legal, privacy, and terms links.

### Required Assets

- Passport hero visual.
- Passport hierarchy diagram.
- Sample Passport record or token.
- Bottle scan screenshot set.
- Winery Passport example only if approved as public proof.

### Internal Links

- `/wine-lovers`
- `/for-wineries`
- `/legal`
- `/privacy`
- `/terms`

### Essential Inline Validation Markers

- Legal review: final Passport disclaimer for provenance, verification status, authenticity, certification, anti-counterfeit, and compliance boundaries.

## 8. Claims Used

| Claim | Evidence status | Source | Page where used |
| --- | --- | --- | --- |
| Tasting & Toasting has an existing public website at `tastingandtoasting.com`. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:98` | `/` |
| The public homepage exists and is registered as `/` with `index.html`. | VERIFIED_REPOSITORY_FACT | `src/config/pages.json:9` | `/` |
| The current site is in pre-launch and development phase. | VERIFIED_PUBLIC_CONTENT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:102`; `terms.html:404` | `/`, `/wine-lovers`, `/for-wineries` |
| No commercial wine sales, event ticketing, paid services, purchases, or payments are offered during pre-launch. | VERIFIED_PUBLIC_CONTENT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:104`; `index.html:719`; `terms.html:638` | `/`, `/wine-lovers` |
| During pre-launch, the service offers information, waitlist registration, and contact or inquiry channels. | VERIFIED_PUBLIC_CONTENT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:107`; `terms.html:485` | `/`, `/wine-lovers`, `/for-wineries` |
| Public legal, privacy, and terms pages exist. | VERIFIED_REPOSITORY_FACT | `src/config/pages.json:102`; `src/config/pages.json:116`; `src/config/pages.json:130` | all |
| Public contact emails include `hello@tastingandtoasting.com`, `privacy@tastingandtoasting.com`, and `legal@tastingandtoasting.com`. | VERIFIED_PUBLIC_CONTENT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:113`; `index.html:899` | all |
| Brand logo assets are present in the repository. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:121`; `assets/logo_nav.png`; `assets/logo_footer.png` | `/` |
| `/wine-lovers`, `/for-wineries`, `/passport`, and `/partners` are future-proposed Phase 1 public website pages. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:123`; `docs/audits/LANDING-ROUTE-COVERAGE-01.md:116` | `/` |
| `/` is the primary website entry point and audience router. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:361` | `/` |
| `/#about` is a homepage company anchor, not a standalone Phase 1 page. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:370` | `/` |
| Every Phase 1 page should link to `/passport` because Passport trust is the shared proof layer. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:390` | `/`, `/wine-lovers`, `/for-wineries`, `/passport` |
| Legal pages remain footer-level support pages, not primary marketing pages. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:372` | all |
| Consumer wine discovery and tasting experiences are being prepared. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:130`; `src/config/products.json:49` | `/wine-lovers` |
| Blind tasting gameplay is represented as a prototype experience. | DOCUMENTED_BUT_REQUIRES_REVIEW | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:132`; `src/config/products.json:67` | `/wine-lovers` |
| Tasting note capture is part of the planned consumer experience. | DOCUMENTED_BUT_REQUIRES_REVIEW | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:134`; `src/config/products.json:103` | `/wine-lovers` |
| Consumer preference profiling is planned to personalize future experiences. | STRATEGIC_INTENT_ONLY | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:136`; `src/config/products.json:121` | `/wine-lovers` |
| Bottle scan links can open public Passport data where a valid token exists. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:138`; `src/config/products.json:139` | `/wine-lovers`, `/passport` |
| Public Passport pages can show traceability, recorded provenance, verification status, and public Passport data. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:140`; `src/config/products.json:319` | `/`, `/passport` |
| Bottle identity pages can display recorded bottle-level data and verification status. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:143`; `src/config/products.json:337` | `/for-wineries`, `/passport` |
| Tools for wineries to prepare public digital Passport data are being prepared. | VERIFIED_REPOSITORY_FACT | `src/config/products.json:271`; `src/config/products.json:283` | `/for-wineries` |
| Partner onboarding is available only through controlled pilot access. | DOCUMENTED_BUT_REQUIRES_REVIEW | `src/config/products.json:283`; `docs/strategy/LANDING-CONTENT-INVENTORY-01.md:145` | `/for-wineries` |
| Public Passport page types exist for bottle, winery, wine, and vintage records. | VERIFIED_REPOSITORY_FACT | `src/config/pages.json:212`; `src/config/pages.json:232`; `src/config/pages.json:249`; `src/config/pages.json:265` | `/for-wineries`, `/passport` |
| QR label concepts are being explored for winery Passport access. | STRATEGIC_INTENT_ONLY | `src/config/products.json:355` | `/for-wineries`, `/passport` |
| EU e-label support is a planned compliance direction. | STRATEGIC_INTENT_ONLY | `src/config/products.json:373` | `/for-wineries`, `/passport` |
| Restricted setup, access-code, prototype, internal preview, and design-reference routes should not appear as public footer destinations. | VERIFIED_REPOSITORY_FACT | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:430` | `/` |

Claims used count: 26.

## 9. Claims Excluded

| Excluded claim | Reason |
| --- | --- |
| Guaranteed authenticity | Unsupported and legally sensitive. |
| Absolute proof of authenticity | Unsupported and stronger than repository evidence. |
| Certified authenticity | Unsupported certification claim. |
| Anti-counterfeit guarantee | Unsupported protection claim. |
| Universal traceability | Unsupported scope claim. |
| EU regulatory compliance | Requires legal approval and verified compliance scope. |
| EU e-label certification or legal readiness | Repository evidence supports planned direction only. |
| Active paid wine sales | Pre-launch evidence excludes active commerce. |
| Active subscriptions, membership billing, or final plan prices | Pricing is unpublished and subscriptions are not offered during pre-launch. |
| Live event ticketing, booking inventory, delivery, or checkout | Unsupported as active public functionality. |
| Licensed alcohol delivery or distribution readiness | Not supported by the evidence inventory. |
| Open self-serve winery onboarding | Onboarding evidence is restricted or reviewed-access only. |
| Guaranteed sales, conversion, scan volume, or customer adoption | Unsupported commercial results claim. |
| Named winery, distributor, venue, investor, media, or partner relationships | No approved public proof in scope. |
| Production multiplayer game availability | Blind tasting is prototype evidence, not production availability. |
| Production account storage, recommendation accuracy, profile portability, or active data processing | Requires privacy and engineering validation. |
| Complete platform automation or universal localization | Unsupported maturity and scope claims. |
| Public claim that restricted forms are approved for public use | Restricted workflows require approval before public routing. |

Claims excluded count: 18.

## 10. Deduplicated Validation Register

### Business

| ID | Exact decision or evidence needed | Affected page/section | Publication impact | Responsible validator |
| --- | --- | --- | --- | --- |
| B01 | Approve final public positioning sentence for Tasting & Toasting. | `/` hero | Blocks final homepage hero wording. | Business owner |
| B02 | Approve plain-language relationship between consumer discovery and Passport infrastructure. | `/` What Tasting & Toasting connects; `/passport` hero | Needed for final positioning consistency. | Business owner |
| B03 | Approve which prototype surfaces may be referenced in public marketing. | `/wine-lovers` tasting concepts; `/` proof | Blocks prototype screenshots and detailed prototype claims. | Business owner |
| B04 | Approve public naming for "blind tasting" versus any branded game name. | `/wine-lovers` tasting concepts | Blocks final naming only, not generic blind tasting copy. | Business owner |
| B05 | Approve launch timing language or explicit no-timing policy. | `/wine-lovers` availability; global pre-launch notices | Blocks any timing promise. | Business owner |
| B06 | Decide whether partner routing should appear in these four pages before `/partners` copy is approved. | `/`; `/passport` next steps | Blocks partner CTA inclusion, not page publication. | Business owner |

### Engineering

| ID | Exact decision or evidence needed | Affected page/section | Publication impact | Responsible validator |
| --- | --- | --- | --- | --- |
| E01 | Approve public waitlist destination or confirm email fallback. | `/wine-lovers` CTA | Blocks primary consumer CTA. | Engineering |
| E02 | Confirm consumer notes, profile storage, and recommendation behavior. | `/wine-lovers` notes and taste profile | Blocks detailed feature copy. | Engineering |
| E03 | Approve public scan behavior for valid, missing, invalid, and example token states. | `/passport`; `/wine-lovers`; `/for-wineries` | Blocks exact scan explanation and screenshots. | Engineering |
| E04 | Approve Passport hierarchy wording for winery, wine, vintage, and bottle relationships. | `/for-wineries`; `/passport` | Blocks final model language and diagram labels. | Engineering |
| E05 | Approve public Passport field list for bottle, winery, wine, and vintage page types. | `/for-wineries`; `/passport` | Blocks exact field list copy. | Engineering |
| E06 | Confirm source and lifecycle of verification status values. | `/passport` verification status | Blocks final verification-status explanation. | Engineering |
| E07 | Approve public winery inquiry destination or confirm email fallback. | `/for-wineries` CTA | Blocks primary winery CTA. | Engineering |

### Legal

| ID | Exact decision or evidence needed | Affected page/section | Publication impact | Responsible validator |
| --- | --- | --- | --- | --- |
| L01 | Approve global Passport limitation language for provenance, verification, authenticity, certification, anti-counterfeit, and compliance. | `/`; `/for-wineries`; `/passport` | Blocks final trust language. | Legal |
| L02 | Approve concise pre-launch and non-commerce wording. | `/`; `/wine-lovers`; `/for-wineries` | Blocks final status notices. | Legal |
| L03 | Approve consumer waitlist consent text, fields, processor, retention, and privacy link language. | `/wine-lovers` CTA | Blocks consumer waitlist publication. | Legal |
| L04 | Approve privacy posture for notes, taste profiles, personalization, and recommendations. | `/wine-lovers` notes and taste profile | Blocks detailed data feature copy. | Legal |
| L05 | Approve winery inquiry fields, data handling, consent, processor, retention, and follow-up language. | `/for-wineries` CTA and controlled onboarding | Blocks winery inquiry publication. | Legal |
| L06 | Approve bottle identity claim boundaries for authenticity, certification, anti-counterfeit, and compliance. | `/for-wineries`; `/passport` | Blocks final bottle identity language. | Legal |
| L07 | Approve QR and EU e-label claim boundaries. | `/for-wineries`; `/passport` | Blocks any QR or e-label wording stronger than planned direction. | Legal |

### Winery/Pilot

| ID | Exact decision or evidence needed | Affected page/section | Publication impact | Responsible validator |
| --- | --- | --- | --- | --- |
| W01 | Approve winery pilot criteria and access rules. | `/for-wineries` hero and CTA | Blocks final pilot invitation. | Winery/pilot owner |
| W02 | Approve public winery onboarding checklist and required materials. | `/for-wineries` materials | Blocks final checklist copy. | Winery/pilot owner |
| W03 | Approve winery validation language for provenance and verification status. | `/for-wineries`; `/passport` verification status | Blocks winery-specific proof wording. | Winery/pilot owner |
| W04 | Approve winery Passport use cases or pilot examples. | `/for-wineries`; `/passport` producer section | Blocks case-study or example modules. | Winery/pilot owner |

### Pricing

| ID | Exact decision or evidence needed | Affected page/section | Publication impact | Responsible validator |
| --- | --- | --- | --- | --- |
| P01 | Approve public no-pricing policy or final pricing language for Phase 1. | `/`; `/wine-lovers`; `/for-wineries` | Blocks any price or plan reference. | Pricing owner |
| P02 | Decide whether QR or e-label services remain inquiry-only. | `/for-wineries` QR and e-label boundaries | Blocks service packaging language. | Pricing owner |

### Assets

| ID | Exact decision or evidence needed | Affected page/section | Publication impact | Responsible validator |
| --- | --- | --- | --- | --- |
| A01 | Approve homepage hero image, proof module screenshots, brand logo rules, or explicit asset-free launch decision. | `/` hero and proof | Blocks final visual implementation, not text-only copy. | Brand/assets owner |
| A02 | Approve consumer visuals for wine discovery, tasting, blind tasting, and Passport scan. | `/wine-lovers` | Blocks final image selection and alt text. | Brand/assets owner |
| A03 | Approve winery visuals, bottle identity screenshots, QR or label visuals, and onboarding checklist asset. | `/for-wineries` | Blocks visual modules and proof details. | Brand/assets owner |
| A04 | Approve Passport hero visual, hierarchy diagram, sample record or token, and scan screenshots. | `/passport` | Blocks final visual proof and diagram labels. | Brand/assets owner |

Deduplicated validation items count: 30.

## 11. Publication Blockers

Only genuine launch blockers are listed here. Assets may block the preferred visual layout but do not block a text-only implementation if an explicit asset-free launch decision is approved.

| ID | Affected page | Exact missing decision or evidence | Can the page launch without it? | Recommended fallback |
| --- | --- | --- | --- | --- |
| PB01 | `/` | Final public positioning sentence for Tasting & Toasting. | No, not with the current hero. | Use a temporary implementation placeholder and keep the page unpublished until approved. |
| PB02 | `/`, `/for-wineries`, `/passport` | Final Passport limitation language. | No, if Passport trust claims appear. | Use only the minimal limitations wording in this pack pending legal approval. |
| PB03 | `/wine-lovers` | Consumer waitlist destination and consent language. | Yes, if the primary CTA changes. | Use `mailto:hello@tastingandtoasting.com` as a temporary contact route and remove waitlist form language. |
| PB04 | `/for-wineries` | Winery inquiry destination, pilot criteria, and data handling language. | Yes, if the primary CTA changes. | Use `mailto:hello@tastingandtoasting.com` as a temporary inquiry route and avoid form-field copy. |
| PB05 | `/passport`, `/for-wineries` | Public scan behavior, hierarchy wording, field list, and verification status lifecycle. | Yes, with general copy only. | Keep the general "can show what is recorded" language and remove field lists/screenshots. |
| PB06 | `/`, `/wine-lovers`, `/for-wineries` | Public pricing or no-pricing policy. | Yes, if pricing is omitted. | Use the pre-launch no-commerce notice and exclude all prices. |
| PB07 | all | Asset approval or explicit asset-free launch decision. | Yes, if text-only launch is approved. | Launch without proof screenshots or diagrams and reserve visual slots for approved assets. |

Publication blockers remaining count: 7.

## 12. Copy Readiness

| Page | Readiness | Reason |
| --- | --- | --- |
| `/` | IMPLEMENTATION_READY_WITH_PLACEHOLDERS | Copy flow, CTA hierarchy, and internal links are ready. Final positioning sentence, Passport limitation wording, anchor destination, and asset plan remain placeholders. |
| `/wine-lovers` | IMPLEMENTATION_READY_WITH_PLACEHOLDERS | Consumer narrative is ready. Waitlist destination, consent language, privacy posture, prototype naming, and assets remain placeholders. |
| `/for-wineries` | IMPLEMENTATION_READY_WITH_PLACEHOLDERS | Winery proposition and controlled-access framing are ready. Inquiry destination, pilot criteria, field list, data handling, pricing posture, and assets remain placeholders. |
| `/passport` | IMPLEMENTATION_READY_WITH_PLACEHOLDERS | Trust explainer is the strongest page. Final legal limitation language, scan behavior, verification lifecycle, field list, and visuals remain placeholders. |

## 13. Change Summary From v1

| Item | v1 | v2 |
| --- | ---: | ---: |
| Pages revised | 4 | 4 |
| Page copy sections | 31 | 27 |
| Homepage sections | 7 | 6 |
| `/wine-lovers` sections | 7 | 6 |
| `/for-wineries` sections | 8 | 7 |
| `/passport` sections | 9 | 8 |
| Inline markers removed | 0 | 193 |
| Inline markers remaining | 199 | 6 |
| Deduplicated validation items | 33 in review | 30 |
| Publication blockers resolved through copy cleanup | 0 | 3 |
| Publication blockers remaining | 10 in review | 7 |

### Inline Markers Remaining By Type

| Type | Count |
| --- | ---: |
| BUSINESS_DECISION_REQUIRED | 1 |
| DESTINATION_REQUIRED | 2 |
| LEGAL_REVIEW_REQUIRED | 2 |
| ENGINEERING_VALIDATION_REQUIRED | 1 |
| ASSET_REQUIRED | 0 |
| PRICING_DECISION_REQUIRED | 0 |
| Total | 6 |

### Major Editorial Changes

- Rewrote the homepage first screen for faster clarity.
- Established **Choose your path** as the sole primary homepage CTA.
- Moved repeated validation concerns into a single register.
- Removed `/partners` page copy and kept partner handling as a separate decision.
- Replaced generic headings with specific, visitor-facing headings.
- Shortened pre-launch and limitation language.
- Kept Passport as the strongest trust explainer.
- Separated current availability, in-preparation work, and planned direction only where needed.
- Removed unsupported claims around authenticity, compliance, certification, anti-counterfeit protection, and guaranteed results.

### Summary Counts

- Pages revised: 4
- Document top-level sections: 13
- Page copy sections: 27
- Claims used: 26
- Claims excluded: 18
- Deduplicated validation items: 30
- Publication blockers remaining: 7
- Primary homepage CTA: Choose your path
