# Landing Content Architecture 01

## Summary

This document defines the canonical content architecture for the approved Phase 1
public Tasting & Toasting website pages:

- `/`
- `/wine-lovers`
- `/for-wineries`
- `/passport`
- `/partners`

This is a content planning document only. It does not define final marketing
copy, visual design, HTML implementation, route implementation, SEO metadata,
runtime behavior, application behavior, mobile behavior, pricing, legal terms,
or deployment behavior.

## Architecture Principles

- Keep the public website focused on approved Phase 1 pages.
- Treat `/` as the audience-routing and brand trust entry point.
- Treat `/wine-lovers`, `/for-wineries`, `/passport`, and `/partners` as
  distinct intent pages with clear conversion paths.
- Treat `/#about` as a homepage company anchor, not as a standalone Phase 1
  page.
- Keep consumer wine discovery separate from CAP passport infrastructure.
- Keep CAP Passport, Bottle Identity, EU QR, and EU e-label claims separate.
- Keep public inquiry flows separate from restricted partner/setup forms.
- Avoid unsupported claims about active sales, active subscriptions, guaranteed
  authenticity, legal certification, regulatory compliance, live booking,
  production SaaS maturity, or final pricing.

## Page Architecture

### `/`

#### Purpose

Introduce Tasting & Toasting as a wine experience and passport company, establish
trust, and route visitors to the correct Phase 1 audience path.

#### Primary Audience

New visitors who need to understand what Tasting & Toasting is and choose their
path.

#### Secondary Audience

Wine lovers, wineries, partners, press, investors, and operational collaborators
looking for a credible overview.

#### Primary Conversion Goal

Move visitors to the most relevant audience page.

#### Secondary Conversion Goal

Capture qualified interest through the appropriate waitlist or inquiry path once
the visitor self-selects an audience.

#### Key Trust Signals

- Clear pre-launch posture and non-transactional positioning until approvals are
  complete.
- Public passport surfaces with recorded provenance and verification status
  where valid passport data exists.
- Multilingual direction across public passport experiences.
- Distinct consumer, winery, passport, and partner pathways.
- Legal, privacy, and terms pages available from the footer.

#### Key Proof Elements

- Existing prototypes for consumer discovery and tasting flows.
- Existing API-backed passport page types for bottle, winery, wine, and vintage
  records.
- Existing restricted winery setup and partner feedback workflows.
- Existing route and product registry evidence for planned Phase 1 pages.

#### Required CTA

Route by audience: choose wine lover, winery, passport, or partner path.

#### Supporting CTA

Review passport explanation or legal/pre-launch information.

#### Recommended Sections

| Section name | Purpose | Estimated importance | Dependencies | Suggested internal links |
| --- | --- | --- | --- | --- |
| Brand and audience routing | Establish what the company does and route the visitor by intent. | Critical | Approved company positioning; legal review of pre-launch language; marketing assets. | `/wine-lovers`, `/for-wineries`, `/passport`, `/partners` |
| What Tasting & Toasting connects | Explain the relationship between wine discovery, tastings, passport data, wineries, and partners without selling a live product. | Critical | Product documentation; engineering validation for passport surfaces; legal review. | `/wine-lovers`, `/passport`, `/for-wineries` |
| Audience pathways | Present the four primary visitor paths and their jobs to be done. | High | Product boundaries for each Phase 1 page; CTA routing rules. | `/wine-lovers`, `/for-wineries`, `/passport`, `/partners` |
| Passport trust overview | Introduce public passport concepts as recorded data and verification status, not absolute certification. | High | Engineering validation; winery validation; legal review. | `/passport`, `/for-wineries` |
| Current status and launch posture | Clarify preparation/pilot status and avoid transactional expectations. | High | Legal review; product documentation; pricing review to confirm no public pricing claims. | `/legal`, `/terms`, `/privacy` |
| Proof snapshot | Summarize evidence-backed surfaces and pilot-ready workflows at a high level. | Medium | Screenshots; photography; testimonials if approved. | `/passport`, `/partners` |
| Footer navigation | Provide durable access to Phase 1 pages and required legal pages. | Critical | Legal page approval; final footer taxonomy. | `/wine-lovers`, `/for-wineries`, `/passport`, `/partners`, `/legal`, `/privacy`, `/terms` |

### `/wine-lovers`

#### Purpose

Define the consumer-facing wine discovery path and show how Tasting & Toasting
helps people learn, taste, record preferences, and understand bottle stories.

#### Primary Audience

Wine-curious consumers and enthusiasts who want guided discovery and better
context around what they drink.

#### Secondary Audience

Groups, hosts, collectors, gift buyers, and partners evaluating the consumer
experience.

#### Primary Conversion Goal

Capture consumer interest for the wine lover experience.

#### Secondary Conversion Goal

Drive exploration of passport scanning as the trust layer behind the wine
experience.

#### Key Trust Signals

- Clear separation from active paid wine sales or live subscriptions.
- Sommelier-guided and educational framing where supported.
- Consumer tasting note and taste profile concepts marked as planned or
  preparing.
- Passport-backed bottle context where valid public passport data exists.
- Legal/pre-launch status linked from global navigation and footer.

#### Key Proof Elements

- Existing consumer membership and discovery prototype surfaces.
- Existing blind tasting game prototype surfaces.
- Existing website prototype surfaces for tasting notes and preferences.
- Existing public passport scan route behavior for valid bottle tokens.

#### Required CTA

Join the wine lover waitlist or register consumer interest.

#### Supporting CTA

Learn how the passport works.

#### Recommended Sections

| Section name | Purpose | Estimated importance | Dependencies | Suggested internal links |
| --- | --- | --- | --- | --- |
| Consumer promise and status | Frame the consumer experience as preparing/planned and clarify that it is not active commerce. | Critical | Legal review; product documentation; pricing review. | `/passport`, `/legal` |
| Discovery experience | Define the planned wine discovery, tasting, and education pillars without naming final packages or prices. | Critical | Product documentation; marketing assets; photography. | `/passport` |
| Tasting and game concepts | Place blind tasting and social tasting concepts within the consumer page. | High | Product documentation; engineering validation of prototype scope; owner naming approval. | `/passport` |
| Taste notes and profile | Explain the role of consumer notes and preference profiling as planned features. | High | Product documentation; privacy review; engineering validation. | `/passport`, `/privacy` |
| Passport-backed bottle context | Connect consumer enjoyment to bottle-level recorded data and verification status. | High | Engineering validation; winery validation; screenshots. | `/passport`, `/for-wineries` |
| Availability and waitlist | Set expectations for launch timing, access, and follow-up. | Critical | Legal review; pricing review; final inquiry/waitlist workflow. | `/partners`, `/legal` |
| Related paths | Route non-consumer visitors away cleanly. | Medium | Global linking strategy. | `/for-wineries`, `/passport`, `/partners` |

### `/for-wineries`

#### Purpose

Explain how wineries can prepare and manage public digital passport data,
participate in controlled onboarding, and understand future label/passport
directions.

#### Primary Audience

Wineries and producers evaluating Tasting & Toasting for public passport data,
bottle identity, and pilot onboarding.

#### Secondary Audience

Importers, distributors, regional wine bodies, compliance advisors, and partner
organizations reviewing winery-facing capabilities.

#### Primary Conversion Goal

Generate qualified winery pilot or onboarding inquiries.

#### Secondary Conversion Goal

Move visitors to the passport page for a neutral explanation of public passport
data.

#### Key Trust Signals

- Clear distinction between public winery marketing and restricted setup flows.
- Claims limited to recorded passport data, provenance, and verification status.
- Separate treatment of CAP Passport, Bottle Identity, EU QR, and EU e-label.
- Controlled pilot access rather than open self-serve onboarding.
- Privacy and legal review paths for submitted winery data.

#### Key Proof Elements

- Existing winery onboarding and setup surfaces behind controlled access.
- Existing winery passport page rendering public API-backed data.
- Existing bottle, wine, and vintage passport page types.
- Existing QR sticker preview utility, limited to exploration unless reviewed.

#### Required CTA

Request winery pilot access or submit a winery inquiry.

#### Supporting CTA

View the passport overview.

#### Recommended Sections

| Section name | Purpose | Estimated importance | Dependencies | Suggested internal links |
| --- | --- | --- | --- | --- |
| Winery-facing proposition and status | Define who the page is for and state pilot/preparation status. | Critical | Product documentation; legal review; winery validation. | `/passport`, `/partners` |
| Passport data model overview | Explain winery, wine, vintage, and bottle passport relationships at a planning level. | Critical | Engineering validation; winery validation; product documentation. | `/passport` |
| Onboarding path | Describe controlled onboarding expectations without exposing private setup forms. | Critical | Legal review; privacy review; winery validation; engineering validation. | `/partners`, `/privacy` |
| Bottle identity | Explain bottle-level identity as recorded data and verification status. | High | Engineering validation; legal review; screenshots. | `/passport` |
| QR and e-label boundaries | Separate QR access concepts from regulatory compliance and e-label claims. | High | Legal review; product documentation; pricing review if packaged. | `/passport`, `/legal` |
| Winery proof requirements | List the kinds of producer materials needed to build passport content. | High | Winery validation; photography; marketing assets. | `/passport` |
| Inquiry qualification | Route wineries into an approved inquiry or pilot access path. | Critical | Final form workflow; privacy review; partner data handling review. | `/partners`, `/privacy` |
| Related partner paths | Route non-winery organizations to the partner page. | Medium | Global linking strategy. | `/partners`, `/wine-lovers` |

### `/passport`

#### Purpose

Define the public explanation of Tasting & Toasting passport surfaces: what they
can show, what they cannot claim, and how consumers, wineries, and partners
should understand recorded data and verification status.

#### Primary Audience

Consumers, wineries, and partners who need to understand the passport concept
before scanning, joining, or inquiring.

#### Secondary Audience

Collectors, distributors, regulators, press, and technical reviewers evaluating
passport trust claims.

#### Primary Conversion Goal

Build confidence in the passport concept and move each visitor to the relevant
audience page.

#### Secondary Conversion Goal

Support winery and partner inquiries by explaining the trust layer clearly.

#### Key Trust Signals

- API-backed public passport page types already exist for bottle, winery, wine,
  and vintage records.
- Public data should remain bounded to recorded provenance, traceability,
  verification status, and public passport data.
- Valid token scan behavior exists for bottle passport routes.
- Clear disclaimers against absolute authenticity, certification, or compliance
  claims unless separately reviewed.
- Legal, privacy, and terms pages remain accessible.

#### Key Proof Elements

- Existing `/cap/b/:token` rewrite behavior to bottle scan pages.
- Existing bottle scan page for bottle-level data.
- Existing winery, wine, and vintage passport pages.
- Existing multilingual public passport page direction.
- Existing design reference templates for passport page types.

#### Required CTA

Choose the relevant next step: wine lover path, winery path, or partner path.

#### Supporting CTA

Review legal/privacy information or request a passport-related conversation.

#### Recommended Sections

| Section name | Purpose | Estimated importance | Dependencies | Suggested internal links |
| --- | --- | --- | --- | --- |
| Passport concept and claim boundary | Define passport scope and prevent unsupported authenticity/compliance claims. | Critical | Legal review; product documentation; engineering validation. | `/for-wineries`, `/wine-lovers` |
| Passport object hierarchy | Explain winery, wine, vintage, and bottle passport relationships. | Critical | Engineering validation; product documentation; winery validation. | `/for-wineries` |
| What a scan can show | List information categories a valid scan may expose without writing final copy. | Critical | Engineering validation; screenshots; winery validation. | `/for-wineries`, `/privacy` |
| Verification status and provenance | Explain how recorded data and verification status should be understood. | High | Legal review; engineering validation; winery validation. | `/for-wineries`, `/partners` |
| Consumer use cases | Connect passport reading to discovery, tasting, collecting, and confidence. | High | Product documentation; consumer journey validation; marketing assets. | `/wine-lovers` |
| Winery use cases | Connect passport data to producer storytelling and controlled onboarding. | High | Winery validation; product documentation. | `/for-wineries` |
| Partner use cases | Connect passport infrastructure to collaborations, pilots, and trade partners. | Medium | Partner validation; legal review. | `/partners` |
| Limitations and review status | State what the passport does not yet claim or provide. | Critical | Legal review; product documentation; engineering validation. | `/legal`, `/terms`, `/privacy` |
| Audience next steps | Convert passport understanding into the correct public website path. | Critical | CTA routing rules; final inquiry/waitlist workflow. | `/wine-lovers`, `/for-wineries`, `/partners` |

### `/partners`

#### Purpose

Define the public partner entry point for organizations interested in pilots,
distribution, trade, venues, events, media, technology, or winery ecosystem
collaboration.

#### Primary Audience

Potential business partners, including importers, distributors, venues, regional
wine organizations, agencies, strategic collaborators, and investors.

#### Secondary Audience

Wineries, press, hosts, service providers, and technology/integration partners
who need the correct non-consumer entry point.

#### Primary Conversion Goal

Generate qualified partner inquiries through a reviewed public flow.

#### Secondary Conversion Goal

Route wineries and consumer visitors to the more specific Phase 1 pages.

#### Key Trust Signals

- Partner conversations and pilots are controlled, not open self-serve access.
- Private partner forms remain separate from public partner content.
- Partner data collection requires privacy and access review.
- The site distinguishes partners, wineries, wine trade, and consumer
  marketplace concepts.
- Pre-launch and legal status remain visible.

#### Key Proof Elements

- Existing restricted partner-interest and feedback workflows.
- Existing product registry references for partners and wine trade.
- Existing winery onboarding and passport infrastructure routes.
- Existing operations/event prototype concepts, treated as non-live unless
  separately approved.

#### Required CTA

Submit a partner inquiry through an approved public contact flow.

#### Supporting CTA

Route to winery inquiry or passport overview.

#### Recommended Sections

| Section name | Purpose | Estimated importance | Dependencies | Suggested internal links |
| --- | --- | --- | --- | --- |
| Partner entry and qualification | Clarify which partner types should engage and how conversations are handled. | Critical | Product documentation; legal review; privacy review. | `/for-wineries`, `/passport` |
| Partnership categories | Define collaboration categories such as winery ecosystem, trade, venues, experiences, media, strategic partners, and evidence-supported technology/integration partners. | High | Partner validation; product documentation; marketing assets. | `/for-wineries`, `/passport` |
| Pilot and access model | Explain controlled inquiry, review, and pilot access without exposing private forms. | Critical | Legal review; privacy review; engineering validation of inquiry flow. | `/privacy`, `/legal` |
| Passport and winery ecosystem | Show how partner interest connects to passport data and winery onboarding. | High | Winery validation; engineering validation; product documentation. | `/passport`, `/for-wineries` |
| Consumer experience relationship | Explain where partners may intersect with consumer discovery without implying active marketplace sales. | Medium | Product documentation; pricing review; legal review. | `/wine-lovers` |
| Evidence and readiness snapshot | Identify existing infrastructure and prototype evidence at a high level. | Medium | Screenshots; testimonials; engineering validation. | `/passport`, `/for-wineries` |
| Public inquiry path | Define the required public inquiry action and expectations for follow-up. | Critical | Approved form copy; privacy review; data retention policy. | `/privacy`, `/terms` |
| Related paths | Route wineries, consumers, and passport-specific visitors to dedicated pages. | Medium | Global linking strategy. | `/for-wineries`, `/wine-lovers`, `/passport` |

## Global Website Structure

### Page Relationships

- `/` is the primary website entry point and audience router.
- `/wine-lovers` is the consumer intent page and should receive consumer
  traffic from `/`, `/passport`, and relevant partner mentions.
- `/for-wineries` is the winery intent page and should receive winery/producer
  traffic from `/`, `/passport`, and `/partners`.
- `/passport` is the trust-layer explainer and should be cross-linked from every
  Phase 1 page.
- `/partners` is the public business collaboration entry point and should route
  wineries to `/for-wineries` when the visitor is specifically a producer.
- `/#about` is the homepage company anchor recommended by the route strategy;
  it should support credibility without becoming a standalone Phase 1 page.
- Legal pages remain footer-level support pages, not primary Phase 1 marketing
  pages.

### Recommended User Journeys

- New visitor: `/` -> relevant audience page -> `/passport` if trust context is
  needed -> waitlist or inquiry.
- Wine lover: `/wine-lovers` -> `/passport` -> consumer waitlist.
- Winery: `/for-wineries` -> `/passport` -> winery pilot inquiry.
- Passport-first visitor: `/passport` -> `/wine-lovers`, `/for-wineries`, or
  `/partners` based on intent.
- Partner: `/partners` -> `/passport` or `/for-wineries` -> partner inquiry.
- Company/status visitor: `/` -> `/#about` -> `/partners` or legal support.
- Compliance-sensitive visitor: any Phase 1 page -> `/legal`, `/privacy`, or
  `/terms`.

### Internal Linking Strategy

- Every Phase 1 page should link to `/passport` because passport trust is the
  shared proof layer.
- `/passport` should link back to `/wine-lovers`, `/for-wineries`, and
  `/partners` as audience-specific next steps.
- `/wine-lovers` should link to `/passport` and provide secondary links to
  `/for-wineries` and `/partners` for misrouted visitors.
- `/for-wineries` should link to `/passport`, `/partners`, and legal/privacy
  support pages.
- `/partners` should link to `/for-wineries`, `/passport`, `/wine-lovers`, and
  legal/privacy support pages.
- `/#about` should be linked from homepage navigation and footer as a company
  credibility anchor, not as `/about`.
- Avoid linking public visitors directly to restricted partner/setup flows until
  those flows have explicit access, privacy, and content approval.

### CTA Flow

- `/`: audience selection CTA first; secondary passport/legal exploration.
- `/wine-lovers`: consumer waitlist/interest first; passport explanation second.
- `/for-wineries`: winery pilot inquiry first; passport overview second.
- `/passport`: audience-specific next step first; legal/privacy review second.
- `/partners`: partner inquiry first; winery/passport routing second.
- `/#about`: company credibility and status support only; no standalone
  conversion path required.

### Breadcrumb Recommendations

- Do not use deep breadcrumbs for the Phase 1 top-level pages because they sit
  directly under the homepage.
- Use simple contextual breadcrumbs only if a later implementation introduces
  nested pages or article/detail content.
- Recommended pattern for future nested pages: `Home / Audience / Detail`.
- Tokenized or record-specific passport pages need a separate breadcrumb policy
  and should not be defined by this document.

### Footer Relationships

- Primary footer links: `/`, `/wine-lovers`, `/for-wineries`, `/passport`,
  `/partners`, `/#about`.
- Legal footer links: `/legal`, `/privacy`, `/terms`.
- Footer should not expose restricted setup, access-code, personalized partner,
  prototype, design, internal preview, `/about`, `/contact`, or `/technology`
  routes.
- Footer labels should keep audience paths distinct from legal support pages.
- Footer should preserve pre-launch truth and avoid transactional language until
  licensing, pricing, and legal approvals are complete.

## Content Dependency Matrix

Legend:

- Required: needed before final website copy can be approved.
- Conditional: needed if the page includes that proof or claim.
- Not required: not needed for Phase 1 content approval.

| Page | Product documentation | Legal review | Pricing review | Engineering validation | Winery validation | Marketing assets | Photography | Screenshots | Testimonials |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Required | Required | Required | Required | Conditional | Required | Conditional | Conditional | Conditional |
| `/wine-lovers` | Required | Required | Required | Required | Conditional | Required | Required | Conditional | Conditional |
| `/for-wineries` | Required | Required | Required | Required | Required | Required | Required | Required | Conditional |
| `/passport` | Required | Required | Not required | Required | Required | Conditional | Conditional | Required | Conditional |
| `/partners` | Required | Required | Conditional | Required | Conditional | Required | Conditional | Conditional | Conditional |

### Dependency Summary

- Product documentation is required for all pages because each page depends on
  clear product boundaries and status.
- Legal review is required for all pages because the site is pre-launch and must
  avoid unsupported commerce, compliance, authenticity, and data-use claims.
- Pricing review is required wherever subscriptions, memberships, partner
  packages, winery services, pilots, trade, or paid access may be implied.
- Engineering validation is required wherever the page references existing
  passport, scan, onboarding, inquiry, localization, or prototype evidence.
- Winery validation is required for winery-facing and passport content, and
  conditional for homepage, wine lover, and partner references.
- Marketing assets, photography, screenshots, and testimonials are not uniformly
  present in the repository and must be created or approved before final copy
  relies on them.

## Content Gaps

The following information does not yet exist in the repository in a final,
approved form and will need to be created before website copy is written.

### Company And Positioning Gaps

- Final approved public positioning for Tasting & Toasting.
- Final pre-launch status language for all public pages.
- Approved audience taxonomy and visitor routing labels.
- Approved brand boilerplate for footer and legal-adjacent contexts.
- Final market/geography language for Spain, Europe, or any other territory.

### Product Boundary Gaps

- Final Phase 1 product descriptions for Wine Lovers, For Wineries, Passport,
  and Partners.
- Final approved relationship between consumer experiences and passport
  infrastructure.
- Final naming and boundaries for blind tasting, toasts, taste profile, tasting
  notes, premium membership, and marketplace concepts.
- Final naming and boundaries for CAP Passport, Bottle Identity, Scanner, EU QR,
  and EU e-label.
- Final winery onboarding scope and pilot access criteria.
- Final partner categories, qualification rules, and follow-up process.

### Legal, Compliance, And Pricing Gaps

- Approved legal language for pre-launch, non-transactional public pages.
- Approved claim boundaries for provenance, verification status, authenticity,
  certification, traceability, QR labels, and e-label/compliance language.
- Approved privacy language for consumer interest, winery inquiry, and partner
  inquiry flows.
- Final public pricing policy or explicit no-pricing policy for Phase 1 pages.
- Licensing and commercial availability status for wine sales, subscriptions,
  event booking, and paid services.
- Data retention and consent details for all public inquiry forms.

### Technical And Evidence Gaps

- Engineering-approved plain-language description of passport data sources and
  scan behavior.
- Engineering-approved explanation of winery, wine, vintage, and bottle passport
  relationships.
- Confirmation of which public passport screenshots or examples may be used.
- Confirmation of which existing prototype surfaces may be referenced publicly.
- Final inquiry/waitlist flow destinations for consumers, wineries, and
  partners.
- Accessibility and localization content requirements for Phase 1 copy.

### Winery And Partner Gaps

- Approved winery case studies or pilot descriptions.
- Winery-validated sample passport records and data fields.
- Winery onboarding checklist and content requirements.
- Partner qualification categories and examples.
- Partner testimonial permissions or pilot quotes.
- Trade, distributor, venue, media, and technology partner use cases.

### Asset Gaps

- Approved brand image library.
- Approved winery, bottle, tasting, and event photography.
- Approved product screenshots for passport pages and inquiry flows.
- Approved diagrams or explainers for passport hierarchy.
- Approved testimonial source list and permissions.
- Approved logos or partner marks, if any are to be shown.

## Validation Notes

This document intentionally avoids:

- final marketing copy;
- UI or page design;
- HTML implementation;
- JavaScript, runtime, route, registry, translation, SEO, deployment,
  application, or mobile changes;
- commits, pushes, or pull requests.
