# Landing Content Inventory 01

Task: `Website Content Inventory and Evidence Map v1`

Scope: public Tasting & Toasting website content only for `/`, `/wine-lovers`,
`/for-wineries`, `/passport`, and `/partners`. This document inventories
existing website-ready content and supporting repository evidence for the 39
sections defined in `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md`.

This document does not write final marketing copy, design UI, create wireframes,
create HTML, modify routes, modify translations, modify SEO, modify deployment,
analyze the mobile app, or treat source code behavior as marketing evidence
unless it is documented and verifiable.

## Evidence Vocabulary

Evidence status:

- `VERIFIED_REPOSITORY_FACT`: documented in strategy, registry, config, or
  audited repository metadata.
- `VERIFIED_PUBLIC_CONTENT`: present in existing public website HTML or public
  legal pages.
- `DOCUMENTED_BUT_REQUIRES_REVIEW`: documented, but copy still needs owner,
  legal, privacy, pricing, winery, partner, or engineering review.
- `IMPLEMENTED_BUT_NOT_MARKETING_APPROVED`: implemented or prototyped, but not
  approved as public marketing evidence.
- `STRATEGIC_INTENT_ONLY`: described by the content architecture but not
  supported by approved evidence.
- `NO_EVIDENCE_FOUND`: no repository evidence found.

Claim risk:

- `LOW`
- `MEDIUM`
- `HIGH`
- `PROHIBITED_UNTIL_VERIFIED`

Readiness:

- `READY_FOR_COPY`
- `READY_WITH_LIMITATIONS`
- `NEEDS_FACT_CHECK`
- `NEEDS_BUSINESS_INPUT`
- `NEEDS_LEGAL_REVIEW`
- `NEEDS_ENGINEERING_VALIDATION`
- `NEEDS_ASSETS`
- `BLOCKED`

## Inventory Rows

| Page | Section | Intended message | Existing usable source material | Exact source file or repository location | Evidence status | Claim risk | Asset availability | Content readiness | Missing input | Responsible validation type | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Brand and audience routing | Tasting & Toasting is a pre-launch wine experience and passport company that routes visitors by audience. | Homepage meta, hero/about copy, footer, architecture route plan. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:92`; `index.html:6`; `index.html:719`; `index.html:803`; `src/config/pages.json:9` | VERIFIED_PUBLIC_CONTENT | MEDIUM | Brand logos exist: `assets/logo_nav.png`, `assets/logo_footer.png`; no approved hero image library. | READY_WITH_LIMITATIONS | Final approved public positioning and audience labels. | Legal + product + brand | Use pre-launch language and audience routing only; avoid live commerce or final product claims. |
| `/` | What Tasting & Toasting connects | Connect wine discovery, tastings, passport data, wineries, and partners without selling a live product. | Product registry documents Wine Lovers, CAP Passport, For Wineries, Partners, and safe claim boundaries. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:93`; `src/config/products.json:37`; `src/config/products.json:307`; `src/config/products.json:271`; `src/config/products.json:469` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | No approved diagrams or photography. | NEEDS_FACT_CHECK | Approved plain-language relationship between consumer experience and passport infrastructure. | Product + legal + engineering | Draft only conceptual connector copy after product owner confirms boundaries. |
| `/` | Audience pathways | Present the four Phase 1 visitor paths and their jobs to be done. | Architecture and route strategy approve `/wine-lovers`, `/for-wineries`, `/passport`, and `/partners` as Phase 1 pages. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:94`; `docs/strategy/LANDING-ROUTE-STRATEGY-01.md:17`; `docs/strategy/LANDING-ROUTE-STRATEGY-01.md:56`; `docs/strategy/LANDING-ROUTE-STRATEGY-01.md:83`; `docs/strategy/LANDING-ROUTE-STRATEGY-01.md:114` | VERIFIED_REPOSITORY_FACT | LOW | No special assets required beyond icons/links. | READY_FOR_COPY | Final CTA destination labels. | Product + routing | Use as navigation/routing content; do not add unsupported sub-routes. |
| `/` | Passport trust overview | Introduce passport concepts as recorded data and verification status, not absolute certification. | CAP Passport and Bottle Identity safe claims; public passport pages registered as API-backed. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:95`; `src/config/products.json:318`; `src/config/products.json:319`; `src/config/products.json:320`; `src/config/products.json:336`; `src/config/pages.json:212` | VERIFIED_REPOSITORY_FACT | MEDIUM | Passport page UI exists; approved screenshots missing. | NEEDS_ENGINEERING_VALIDATION | Approved explanation of verification status and allowed screenshots/examples. | Engineering + legal + winery | Use limited terms: recorded provenance, verification status, public passport data. |
| `/` | Current status and launch posture | Clarify pre-launch, pre-licensing, non-transactional status. | Homepage, legal, privacy, and terms pages state pre-launch/development status and no commercial transactions. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:96`; `index.html:719`; `legal.html:404`; `privacy.html:404`; `terms.html:404` | VERIFIED_PUBLIC_CONTENT | LOW | No asset needed. | READY_FOR_COPY | Legal owner should approve exact current wording before launch. | Legal | Reuse the documented pre-launch boundary in concise page copy. |
| `/` | Proof snapshot | Summarize evidence-backed surfaces and pilot-ready workflows without implying launch. | Page registry documents prototypes, API-backed passport pages, and restricted flows. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:97`; `src/config/pages.json:44`; `src/config/pages.json:61`; `src/config/pages.json:229`; `src/config/pages.json:246`; `src/config/pages.json:330`; `src/config/pages.json:350` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | Missing approved screenshots, photography, and testimonials. | NEEDS_ASSETS | Which proof surfaces may be shown publicly. | Engineering + legal + brand | Use a cautious evidence list until visuals and claims are approved. |
| `/` | Footer navigation | Provide durable links to Phase 1 and legal pages. | Existing footer links legal/privacy/terms and contact emails; architecture recommends Phase 1 footer links. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:98`; `index.html:873`; `index.html:891`; `index.html:899`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:406` | VERIFIED_PUBLIC_CONTENT | LOW | Brand footer logo exists. | READY_WITH_LIMITATIONS | Final footer taxonomy once new pages exist. | Legal + routing | Keep legal links and contacts; add Phase 1 pages only when implemented/reviewed. |
| `/wine-lovers` | Consumer promise and status | Consumer wine discovery is being prepared and is not active commerce. | Wine Lovers registry safe claim and public legal pre-launch boundaries. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:154`; `src/config/products.json:48`; `src/config/products.json:49`; `src/config/products.json:50`; `terms.html:485` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | No approved consumer photography. | READY_WITH_LIMITATIONS | Exact waitlist/interest CTA and launch timing. | Product + legal + pricing | Write copy around preparation/waitlist only; exclude active sales/subscription promises. |
| `/wine-lovers` | Discovery experience | Planned discovery, tasting, and education pillars, without final packages or prices. | Terms describe future wine education/tasting platform; prototypes demonstrate concepts but remain noindex. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:155`; `terms.html:466`; `src/config/pages.json:44`; `src/config/pages.json:99`; `src/config/products.json:48` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | Missing lifestyle/product photography. | NEEDS_ASSETS | Approved pillars and whether kits/events can be named in Phase 1 copy. | Product + legal + pricing | Use high-level planned pillars; avoid package names, delivery, or pricing. |
| `/wine-lovers` | Tasting and game concepts | Blind tasting and social tasting are prototype/planned experiences. | Blind Tasting and Toasts registry entries; game-flow prototype registered public-noindex. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:156`; `src/config/products.json:55`; `src/config/products.json:66`; `src/config/products.json:67`; `src/config/products.json:68`; `src/config/products.json:145`; `src/config/products.json:157` | IMPLEMENTED_BUT_NOT_MARKETING_APPROVED | MEDIUM | Prototype UI exists; no approved game screenshots. | READY_WITH_LIMITATIONS | Owner naming approval for Blind Tasting versus Blind Detective; screenshot approval. | Product + engineering + brand | Reference as prototype/planned experience; do not claim production multiplayer or paid events. |
| `/wine-lovers` | Taste notes and profile | Consumer notes and preference profile are planned personal experience features. | Tasting Notes and Taste Profile registry entries document safe and unsafe claims. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:157`; `src/config/products.json:91`; `src/config/products.json:102`; `src/config/products.json:103`; `src/config/products.json:104`; `src/config/products.json:109`; `src/config/products.json:120`; `src/config/products.json:121`; `src/config/products.json:122` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | No approved screenshots. | NEEDS_LEGAL_REVIEW | Privacy posture for notes/profile, account storage, recommendations, and data use. | Privacy + engineering + product | Keep as planned features; avoid active account storage, accuracy, or recommendation guarantees. |
| `/wine-lovers` | Passport-backed bottle context | Consumer enjoyment can connect to bottle-level recorded data where valid public passport data exists. | Scanner, CAP Passport, and Bottle Identity safe claims. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:158`; `src/config/products.json:127`; `src/config/products.json:139`; `src/config/products.json:307`; `src/config/products.json:319`; `src/config/products.json:325`; `src/config/products.json:337` | VERIFIED_REPOSITORY_FACT | MEDIUM | Missing approved scan screenshots. | NEEDS_ENGINEERING_VALIDATION | Approved example record/token and allowed screenshot set. | Engineering + legal + winery | Use limited passport context copy and link to `/passport` once available. |
| `/wine-lovers` | Availability and waitlist | Set launch/access expectations and capture consumer interest safely. | Product registry marks Wine Lovers CTA as waitlist and pricing unpublished; terms allow only waitlist/contact during pre-launch. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:159`; `src/config/products.json:45`; `src/config/products.json:47`; `src/config/products.json:50`; `terms.html:485` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | No form asset required; final flow missing. | NEEDS_BUSINESS_INPUT | Final consumer waitlist destination and data collection text. | Product + privacy + legal | Define a reviewed waitlist/contact flow before page copy is considered ready. |
| `/wine-lovers` | Related paths | Route wineries, partners, and passport-first visitors to the right page. | Architecture internal linking strategy. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:160`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:387` | VERIFIED_REPOSITORY_FACT | LOW | No special assets required. | READY_FOR_COPY | None beyond final route availability. | Routing | Use simple audience rerouting links. |
| `/for-wineries` | Winery-facing proposition and status | Wineries can prepare public digital passport data through controlled preparation/pilot positioning. | For Wineries and Winery Onboarding registry safe claims. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:216`; `src/config/products.json:271`; `src/config/products.json:282`; `src/config/products.json:283`; `src/config/products.json:284`; `src/config/products.json:289`; `src/config/products.json:301` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | Missing winery photography and approved sample records. | NEEDS_BUSINESS_INPUT | Pilot criteria and winery-facing status language. | Winery + legal + product | Use controlled/preparing positioning; avoid open self-serve or jurisdictional service claims. |
| `/for-wineries` | Passport data model overview | Explain winery, wine, vintage, and bottle passport relationships. | Public passport page types exist and render API-backed data. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:217`; `src/config/pages.json:229`; `src/config/pages.json:246`; `src/config/pages.json:262`; `src/config/pages.json:278`; `bottle-scan.html:235`; `winery-passport.html:214`; `wine-passport.html:204`; `vintage-passport.html:223` | VERIFIED_REPOSITORY_FACT | MEDIUM | Missing approved hierarchy diagram. | NEEDS_ENGINEERING_VALIDATION | Plain-language hierarchy approved by engineering and product. | Engineering + product + winery | Create a fact-checked explainer before final copy. |
| `/for-wineries` | Onboarding path | Describe controlled onboarding without exposing private setup forms. | CAP onboarding demo and access-code-gated setup are registered; setup posts to live endpoints and remains restricted/noindex. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:218`; `src/config/pages.json:176`; `src/config/pages.json:191`; `src/config/pages.json:333`; `src/config/pages.json:350`; `src/config/products.json:300`; `src/config/products.json:301`; `src/config/products.json:302` | IMPLEMENTED_BUT_NOT_MARKETING_APPROVED | HIGH | No approved onboarding screenshots. | NEEDS_LEGAL_REVIEW | Public inquiry path, data handling copy, access rules. | Legal + privacy + engineering + winery | Describe only controlled pilot access; do not link public visitors directly to restricted setup. |
| `/for-wineries` | Bottle identity | Bottle-level identity can display recorded bottle data and verification status. | Bottle Identity registry and bottle scan render fields including bottle number/series, ownership badge, verification status, timeline, wine/winery links. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:219`; `src/config/products.json:325`; `src/config/products.json:336`; `src/config/products.json:337`; `src/config/products.json:338`; `bottle-scan.html:235`; `bottle-scan.html:252`; `bottle-scan.html:268`; `bottle-scan.html:300` | VERIFIED_REPOSITORY_FACT | MEDIUM | Missing approved bottle passport screenshot and physical label photography. | NEEDS_ENGINEERING_VALIDATION | Engineering-approved field list and example. | Engineering + legal + winery | Use recorded bottle-level data language; avoid certification/anti-counterfeit guarantees. |
| `/for-wineries` | QR and e-label boundaries | QR access concepts are separate from EU compliance and e-label claims. | EU QR and EU E-label registry entries explicitly limit safe claims and prohibit compliance claims. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:220`; `src/config/products.json:343`; `src/config/products.json:354`; `src/config/products.json:355`; `src/config/products.json:356`; `src/config/products.json:361`; `src/config/products.json:372`; `src/config/products.json:373`; `src/config/products.json:374`; `src/config/pages.json:209` | DOCUMENTED_BUT_REQUIRES_REVIEW | PROHIBITED_UNTIL_VERIFIED | QR sticker preview exists; no approved compliance/e-label assets. | NEEDS_LEGAL_REVIEW | EU QR/e-label legal claim boundaries and package/pricing policy. | Legal + product + pricing | Keep QR as access exploration; prohibit compliance and legal-readiness claims. |
| `/for-wineries` | Winery proof requirements | Wineries need to provide profile, story, wine, vintage, bottle, and review materials to create passport content. | CAP onboarding collects basic profile, winery DNA, services, first wine, first vintage, bottle CAPs, passport preview, and submit-for-review. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:221`; `cap-onboarding.html:190`; `cap-onboarding.html:212`; `cap-onboarding.html:225`; `cap-onboarding.html:237`; `cap-onboarding.html:255`; `cap-onboarding.html:280`; `cap-onboarding.html:295` | IMPLEMENTED_BUT_NOT_MARKETING_APPROVED | MEDIUM | Missing approved checklist PDF/diagram and winery sample assets. | NEEDS_BUSINESS_INPUT | Approved public winery onboarding checklist and validation rules. | Winery + product + privacy | Convert the existing setup categories into a reviewed public checklist. |
| `/for-wineries` | Inquiry qualification | Route wineries into approved inquiry or pilot access path. | Partner/Winery setup flows exist but are restricted/noindex; Partners registry supports controlled inquiry. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:222`; `src/config/products.json:469`; `src/config/products.json:480`; `src/config/products.json:481`; `src/config/products.json:482`; `src/config/pages.json:330`; `src/config/pages.json:350` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | Form UI exists only in restricted/prototype flows. | NEEDS_LEGAL_REVIEW | Public winery inquiry form destination, fields, retention, and follow-up promise. | Privacy + legal + winery | Define a minimal public inquiry action before publishing. |
| `/for-wineries` | Related partner paths | Route non-winery organizations to partner content and consumers to wine-lover content. | Architecture and route strategy define `/partners` as segmented public partner hub. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:223`; `docs/strategy/LANDING-ROUTE-STRATEGY-01.md:114`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:389` | VERIFIED_REPOSITORY_FACT | LOW | No special assets required. | READY_FOR_COPY | None beyond final route availability. | Routing | Use simple route copy; keep wineries distinct from partners. |
| `/passport` | Passport concept and claim boundary | Passport pages can show recorded data and verification status; they cannot claim absolute authenticity or compliance. | CAP Passport, Bottle Identity, Scanner, EU QR, and EU E-label safe/unsafe claims. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:283`; `src/config/products.json:318`; `src/config/products.json:319`; `src/config/products.json:320`; `src/config/products.json:337`; `src/config/products.json:338`; `src/config/products.json:355`; `src/config/products.json:356` | VERIFIED_REPOSITORY_FACT | MEDIUM | Missing approved explainer visual. | READY_WITH_LIMITATIONS | Legal-approved disclaimer wording. | Legal + engineering | Build copy from safe claim boundaries and explicit limitations. |
| `/passport` | Passport object hierarchy | Explain winery, wine, vintage, and bottle passport relationships. | Registered passport pages and render paths link bottle to vintage, wine, and winery pages. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:284`; `src/config/pages.json:212`; `src/config/pages.json:232`; `src/config/pages.json:249`; `src/config/pages.json:265`; `bottle-scan.html:300`; `wine-passport.html:231`; `vintage-passport.html:232` | VERIFIED_REPOSITORY_FACT | LOW | Missing hierarchy diagram. | NEEDS_ASSETS | Diagram or approved visual explanation. | Engineering + brand | Prepare a diagram after engineering approves the model language. |
| `/passport` | What a scan can show | A valid scan can expose public passport fields where data exists. | Bottle scan renders bottle number/series, winery/wine/vintage identity, ownership, verification status, DNA tags, timeline, facts, description, and links. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:285`; `src/config/products.json:139`; `bottle-scan.html:235`; `bottle-scan.html:252`; `bottle-scan.html:268`; `bottle-scan.html:280`; `bottle-scan.html:300`; `bottle-scan.html:330` | VERIFIED_REPOSITORY_FACT | MEDIUM | Missing approved scan screenshots. | NEEDS_ENGINEERING_VALIDATION | Final field list and example token approved for public copy/screenshots. | Engineering + winery | Create a scan-field fact list; avoid saying every scan has every field. |
| `/passport` | Verification status and provenance | Verification status and provenance are recorded-data indicators, not absolute guarantees. | CAP safe claim allows traceability, recorded provenance, verification status; unsafe claim prohibits guaranteed authenticity. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:286`; `src/config/products.json:318`; `src/config/products.json:319`; `src/config/products.json:320`; `bottle-scan.html:252`; `bottle-scan.html:280` | VERIFIED_REPOSITORY_FACT | MEDIUM | No asset required, but screenshots need approval. | READY_WITH_LIMITATIONS | Legal-approved wording for "verification status" and "provenance". | Legal + engineering + winery | Use bounded explanation and limitation notice. |
| `/passport` | Consumer use cases | Consumers can use passport reading to understand bottle context, discovery, tasting, and collecting where data exists. | Wine Lovers, Scanner, and CAP Passport safe claims support discovery and scan context; collector is only provisional. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:287`; `src/config/products.json:49`; `src/config/products.json:139`; `src/config/products.json:319`; `src/config/products.json:210`; `src/config/products.json:212` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | Missing consumer usage photography/screenshots. | NEEDS_FACT_CHECK | Which consumer use cases are approved for Phase 1. | Product + legal | Keep consumer use cases general; avoid cellar custody/resale/valuation. |
| `/passport` | Winery use cases | Wineries can use passport data for public producer storytelling and controlled onboarding. | For Wineries and Winery Onboarding safe claims; CAP onboarding data categories. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:288`; `src/config/products.json:283`; `src/config/products.json:301`; `cap-onboarding.html:190`; `cap-onboarding.html:212`; `cap-onboarding.html:237`; `cap-onboarding.html:255` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | Missing winery photography and approved examples. | NEEDS_BUSINESS_INPUT | Approved winery examples and content rules. | Winery + product + legal | Use generic winery use cases pending real winery validation. |
| `/passport` | Partner use cases | Partners may connect passport infrastructure to collaborations, pilots, and trade interest. | Partners safe claim and restricted partner categories show possible partner types. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:289`; `src/config/products.json:480`; `src/config/products.json:481`; `src/config/products.json:482`; `for/index.html:106` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | Missing partner logos/testimonials/case studies. | NEEDS_BUSINESS_INPUT | Approved partner categories and examples. | Partner + legal + privacy | Mention controlled partner conversations only; do not imply active relationships. |
| `/passport` | Limitations and review status | State what passport does not yet claim or provide. | Architecture principles and product unsafe claims prohibit active sales, compliance, guaranteed authenticity, live SaaS maturity, and final pricing. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:290`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:28`; `src/config/products.json:320`; `src/config/products.json:338`; `src/config/products.json:356`; `src/config/products.json:374` | VERIFIED_REPOSITORY_FACT | LOW | No asset needed. | READY_FOR_COPY | Legal owner to approve final phrasing. | Legal | Include a limitations section in plain language. |
| `/passport` | Audience next steps | Route passport readers to wine lover, winery, or partner next steps. | Architecture CTA flow and internal linking strategy. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:291`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:382`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:394` | VERIFIED_REPOSITORY_FACT | LOW | No special assets required. | READY_FOR_COPY | Final inquiry/waitlist destinations. | Routing + product | Use audience-specific next steps after route destinations are implemented. |
| `/partners` | Partner entry and qualification | Clarify who should engage and that conversations are controlled. | Partners registry safe claim; partner route strategy audience list. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:348`; `src/config/products.json:469`; `src/config/products.json:480`; `src/config/products.json:481`; `src/config/products.json:482`; `docs/strategy/LANDING-ROUTE-STRATEGY-01.md:114` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | Missing partner imagery/logos. | NEEDS_BUSINESS_INPUT | Approved partner qualification categories and CTA. | Partner + privacy + legal | Use controlled inquiry positioning; avoid open self-serve. |
| `/partners` | Partnership categories | Define collaboration categories only where evidence supports them. | Restricted partner feedback form includes distribution, winery connections, restaurants/events, collector edition, strategic partnership, investment. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:349`; `for/index.html:106`; `docs/strategy/LANDING-ROUTE-STRATEGY-01.md:116`; `src/config/products.json:246`; `src/config/products.json:247`; `src/config/products.json:248` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | Missing partner logos and approved category visuals. | NEEDS_BUSINESS_INPUT | Which categories are public Phase 1 categories and which remain private. | Partner + legal + product | Convert to a reviewed public category list; no named partner claims. |
| `/partners` | Pilot and access model | Explain controlled inquiry, review, and pilot access without private forms. | Partners safe claim; Access page is confidential/noindex; Winery setup is access-code-gated. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:350`; `src/config/products.json:481`; `src/config/pages.json:144`; `src/config/pages.json:157`; `src/config/pages.json:333`; `src/config/pages.json:350`; `access.html:147` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | Restricted form UI exists; no approved public form. | NEEDS_LEGAL_REVIEW | Public inquiry form fields, retention, consent, and follow-up language. | Privacy + legal + engineering | Build content around inquiry/review; do not expose private access workflows. |
| `/partners` | Passport and winery ecosystem | Partner interest connects to passport data and winery onboarding. | CAP Passport, For Wineries, Winery Onboarding, and Partners registry entries. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:351`; `src/config/products.json:319`; `src/config/products.json:283`; `src/config/products.json:301`; `src/config/products.json:481` | DOCUMENTED_BUT_REQUIRES_REVIEW | MEDIUM | Missing ecosystem diagram and winery examples. | NEEDS_FACT_CHECK | Approved relationship between partner categories and winery/passport workflow. | Product + winery + partner | Keep as ecosystem-level explanation; avoid confirmed partner relationship claims. |
| `/partners` | Consumer experience relationship | Partners may intersect with consumer discovery without implying active marketplace sales. | Marketplace and Experience Host are planned/prototype only; unsafe claims prohibit active commerce, ticketing, booking inventory, and pricing. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:352`; `src/config/products.json:163`; `src/config/products.json:175`; `src/config/products.json:176`; `src/config/products.json:253`; `src/config/products.json:265`; `src/config/products.json:266` | DOCUMENTED_BUT_REQUIRES_REVIEW | PROHIBITED_UNTIL_VERIFIED | Missing event photography and partner venue assets. | NEEDS_LEGAL_REVIEW | Approval for any marketplace, event, restaurant, or booking language. | Legal + pricing + product | Mention only exploratory or planned relationships; prohibit live marketplace/booking claims. |
| `/partners` | Evidence and readiness snapshot | Identify infrastructure and prototype evidence at high level. | Registries show public-noindex prototypes, API-backed passport pages, restricted partner forms, and translation/runtime direction. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:353`; `src/config/pages.json:44`; `src/config/pages.json:80`; `src/config/pages.json:229`; `src/config/pages.json:330`; `src/config/products.json:444` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | Missing screenshots, testimonials, and partner proof. | NEEDS_ASSETS | Approved proof assets and which prototypes may be named publicly. | Engineering + legal + partner | Use "existing prototype/infrastructure evidence" only after review. |
| `/partners` | Public inquiry path | Define approved public inquiry action and follow-up expectations. | Partner-interest and restricted feedback forms post to live processors, but no approved public partner page/form exists. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:354`; `src/config/products.json:480`; `src/config/pages.json:330`; `for/index.html:106`; `winery-setup/index.html:1035` | DOCUMENTED_BUT_REQUIRES_REVIEW | HIGH | Existing forms are restricted/private; public form missing. | NEEDS_LEGAL_REVIEW | Public form fields, processor list, retention, response SLA, consent copy. | Privacy + legal + partner | Create a minimal reviewed public inquiry specification before final copy. |
| `/partners` | Related paths | Route wineries, consumers, and passport-specific visitors to dedicated pages. | Architecture internal linking strategy. | `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:355`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:389`; `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md:391` | VERIFIED_REPOSITORY_FACT | LOW | No special assets required. | READY_FOR_COPY | None beyond final route availability. | Routing | Use simple routing links; keep partner page broad but segmented. |

## Verified Fact Bank

Only the following facts are safe to use in website copy now, subject to final
plain-language editing and legal review where noted:

1. Tasting & Toasting has an existing public website at `tastingandtoasting.com`.
   Source: `README.md:3`.
2. The public homepage exists and is registered as `/` with `index.html`.
   Source: `src/config/pages.json:9`.
3. The current site is in pre-launch / development phase. Source:
   `legal.html:404`, `privacy.html:404`, `terms.html:404`.
4. No commercial wine sales, event ticketing, paid services, purchases, or
   payments are offered during pre-launch. Source: `index.html:719`,
   `terms.html:404`, `terms.html:638`.
5. During pre-launch, the service offers only information, waitlist registration
   for launch notifications, and contact/inquiry channels. Source:
   `terms.html:485`.
6. Public legal, privacy, and terms pages exist. Source:
   `src/config/pages.json:102`, `src/config/pages.json:116`,
   `src/config/pages.json:130`.
7. Public contact emails are `hello@tastingandtoasting.com`,
   `privacy@tastingandtoasting.com`, and `legal@tastingandtoasting.com`.
   Source: `index.html:899`, `index.html:900`, `index.html:901`.
8. Tasting And Toasting Inc. is identified in the website legal pages as a
   Delaware corporation. Source: `terms.html:411`, `terms.html:420`.
9. Tasting And Toasting SL is identified as the Spanish operating subsidiary,
   with some public pages noting pending/in-registration details. Source:
   `index.html:820`, `terms.html:438`, `privacy.html:458`.
10. Existing brand logo assets are present in `assets/logo_nav.png` and
    `assets/logo_footer.png`. Source: `assets/`.
11. The route registry classifies `/wine-lovers`, `/for-wineries`, `/passport`,
    and `/partners` as future-proposed Phase 1 public website pages, not current
    implemented HTML pages. Source:
    `docs/audits/LANDING-ROUTE-COVERAGE-01.md:116`.
12. The page registry records 25 current HTML page sources and no orphan pages.
    Source: `docs/audits/LANDING-PAGE-REGISTRY-01.md:7`,
    `docs/audits/LANDING-ROUTE-COVERAGE-01.md:41`.
13. The product registry says consumer wine discovery and tasting experiences
    are being prepared. Source: `src/config/products.json:49`.
14. The product registry says Blind Tasting gameplay is represented as a
    prototype experience. Source: `src/config/products.json:67`.
15. The product registry says tasting note capture is part of the planned
    consumer experience. Source: `src/config/products.json:103`.
16. The product registry says consumer preference profiling is planned to
    personalize future experiences. Source: `src/config/products.json:121`.
17. Bottle scan links can open public passport data where a valid token exists.
    Source: `src/config/products.json:139`.
18. Public passport pages can show traceability, recorded provenance,
    verification status, and public passport data. Source:
    `src/config/products.json:319`.
19. Bottle identity pages can display recorded bottle-level data and
    verification status. Source: `src/config/products.json:337`.
20. Partner conversations and pilots are available through controlled inquiry
    flows. Source: `src/config/products.json:481`.

Verified facts count: 20.

## Claims Requiring Validation

Claims requiring validation count: 35.

### Legal

1. Exact pre-launch disclaimer wording for all five Phase 1 pages.
2. Any statement about Spanish, EU, or jurisdiction-specific licensing status.
3. Any authenticity, certification, anti-counterfeit, or compliance-adjacent
   passport claim.
4. Any event, delivery, alcohol, or purchase-related wording.
5. Any claim that partner or winery inquiry forms are approved for public use.
6. Any statement about trademarks being pending or registered.

### Technical

1. Plain-language description of CAP data sources and API-backed public passport
   pages.
2. Exact scan behavior for `/cap/b/:token`, missing tokens, and valid tokens.
3. Final field list for bottle, winery, wine, and vintage passports.
4. Which prototype surfaces may be referenced publicly as evidence.

### Commercial/Pricing

1. Whether public pages should say no pricing, unpublished pricing, or "request
   access".
2. Any membership, subscription, premium, credits, or package language.
3. Any marketplace, checkout, cart, booking, or ticketing language.
4. Any winery, partner, trade, distributor, or pilot package claim.

### Winery

1. Approved winery pilot criteria.
2. Approved winery onboarding checklist and required materials.
3. Approved sample winery/passport records for public screenshots.
4. Any winery names, regions, producer relationships, or case studies.
5. Any winery validation language for verification status and provenance.

### Partner

1. Public partner categories for Phase 1.
2. Whether distribution, restaurants/events, strategic partnership, investment,
   and collector edition are public partner categories.
3. Any named partner, investor, restaurant, distributor, or regional claim.
4. Partner follow-up timeline or response promise.
5. Whether technology/integration partners are sufficiently evidenced.

### Product

1. Final public positioning for Tasting & Toasting.
2. Final boundaries between Wine Lovers, CAP Passport, For Wineries, and
   Partners.
3. Final naming for Blind Tasting versus Blind Detective.
4. Final boundaries for tasting notes, taste profile, marketplace, premium, and
   toasts.
5. Final boundaries between CAP Passport, Bottle Identity, EU QR, and EU
   E-label.
6. Whether collector and wine library concepts may appear in Phase 1 copy.

### Privacy/Security

1. Consumer waitlist fields, processor, consent text, and retention.
2. Winery inquiry fields, processor, consent text, and retention.
3. Partner inquiry fields, processor, consent text, and retention.
4. Data use for consumer taste notes and preference profiling.
5. Whether privacy statements with `[DATE]`, pending addresses, and TBD provider
   details need cleanup before launch.

## Asset Inventory

| Asset type | Available | Missing | Readiness |
| --- | --- | --- | --- |
| Logos | `assets/logo_nav.png`, `assets/logo_footer.png`, `assets/favicon-64.png`; logo used in `index.html:622` and `index.html:876`. | Approved logo usage rules, variants, and brand guidelines. | READY_WITH_LIMITATIONS |
| Product screenshots | Passport and prototype UI exists in HTML, but screenshots are not exported or approved. | Approved screenshots for homepage proof, `/wine-lovers`, `/for-wineries`, `/passport`, `/partners`. | NEEDS_ASSETS |
| Passport visuals | Bottle, winery, wine, vintage passport HTML and design references exist. | Approved diagram of hierarchy, approved scan example/token, approved QR/passport screenshots. | NEEDS_ASSETS |
| Winery photography | None found as repository assets. | Winery, vineyard, bottle, label, cellar, producer portraits. | NEEDS_ASSETS |
| Event photography | None found as repository assets. | Tastings, gatherings, venues, partner event photos. | NEEDS_ASSETS |
| Partner logos | None found. | Any partner/distributor/venue/investor logos and permissions. | NEEDS_ASSETS |
| Testimonials | No approved public testimonials found. | Consumer, winery, partner, sommelier, or press quotes with permissions. | NEEDS_ASSETS |
| Diagrams | No approved static diagrams found. | Passport hierarchy, scan flow, winery onboarding, partner ecosystem. | NEEDS_ASSETS |
| Videos | None found. | Product demo, scan demo, winery story, tasting/event video. | NEEDS_ASSETS |
| Icons | Inline SVGs and UI icons exist in HTML; no standalone approved icon set found. | Approved reusable icon set for Phase 1 pages. | READY_WITH_LIMITATIONS |

Asset gaps: product screenshots, approved passport hierarchy diagram, winery
photography, event photography, partner logos, testimonials, diagrams, videos,
approved icon set, brand usage rules.

## Content Gaps By Page

### `/`

- Final approved company positioning.
- Final audience-routing labels for Wine Lovers, For Wineries, Passport, and
  Partners.
- Approved brand/hero assets.
- Approved proof screenshot set.
- Legal-approved concise pre-launch copy for homepage.

### `/wine-lovers`

- Consumer waitlist destination and data collection language.
- Approved launch/access timing.
- Approved consumer photography or product screenshots.
- Final boundaries for discovery, tasting, notes, profile, toasts, premium, and
  marketplace.
- Owner naming decision for Blind Tasting versus Blind Detective.

### `/for-wineries`

- Winery pilot criteria and public inquiry path.
- Public winery onboarding checklist and data-use language.
- Engineering-approved passport hierarchy and field list.
- Legal-approved QR/e-label boundaries.
- Winery photography and approved sample passport records.

### `/passport`

- Engineering-approved plain-language scan explanation.
- Legal-approved verification/provenance disclaimer.
- Approved sample token or record for screenshots.
- Passport hierarchy diagram.
- Confirmed limitations copy.

### `/partners`

- Public partner categories and qualification criteria.
- Public partner inquiry form fields, consent, retention, and processor list.
- Approved follow-up expectation.
- Partner logos, testimonials, or case studies.
- Approval for any marketplace, event, trade, venue, or technology/integration
  language.

## Prohibited Claims

Prohibited claims count: 17.

The following must not appear on the website until verified and approved:

1. Guaranteed authenticity.
2. Absolute proof of authenticity.
3. Certified authenticity unless legally and operationally validated.
4. Anti-counterfeit guarantee.
5. EU regulatory compliance.
6. EU e-label certification or legal readiness.
7. Active paid wine sales.
8. Active subscriptions, membership billing, or final plan prices.
9. Live event ticketing, checkout, booking inventory, or cart checkout.
10. Licensed delivery or alcohol distribution readiness.
11. Open self-serve winery onboarding.
12. All winery services are live, certified, or compliant in every jurisdiction.
13. Named winery, distributor, restaurant, investor, or partner relationships
    without written permission.
14. Adoption numbers, scan volumes, active user counts, or active winery counts.
15. Production multiplayer game availability or downloadable product claims.
16. Production account storage, recommendation quality, taste-profile accuracy,
    or portability.
17. Complete platform automation, production SaaS maturity, all-route
    localization, or automated legal compliance.

## Copywriting Readiness

| Page | Readiness | Reason |
| --- | --- | --- |
| `/` | PARTIALLY_READY | Strong pre-launch/legal facts, route architecture, legal links, and brand logos exist. Final positioning, proof assets, and CTA labels still need approval. |
| `/wine-lovers` | PARTIALLY_READY | Safe repository claims support planned consumer discovery, prototypes, notes, profile, and waitlist posture. Needs final product boundaries, privacy review, pricing/legal limits, and consumer assets. |
| `/for-wineries` | PARTIALLY_READY | CAP onboarding, winery setup, and passport surfaces provide evidence. Needs winery validation, legal/privacy review, public inquiry rules, screenshots, and QR/e-label boundaries. |
| `/passport` | PARTIALLY_READY | This is the most evidence-backed page because public passport page types and safe claims exist. Needs legal disclaimer, engineering-approved field list, sample records, and visuals. |
| `/partners` | NOT_READY | Controlled partner inquiry is documented, but public categories, form/privacy language, partner proof, and any commercial/event/trade claims are not ready. |

## Next Input Requests

Smallest concrete input list:

1. Exact public positioning sentence for Tasting & Toasting.
   Affects: `/` Brand and audience routing; all page intros.
   Validator: Maksim/product + legal.
   Consequence if missing: homepage and page intros remain `NEEDS_BUSINESS_INPUT`.

2. Final waitlist/inquiry destinations and allowed form fields for consumer,
   winery, and partner interest.
   Affects: `/wine-lovers` Availability and waitlist; `/for-wineries` Inquiry
   qualification; `/partners` Public inquiry path.
   Validator: Maksim/product + privacy/legal.
   Consequence if missing: CTAs remain blocked or mailto-only.

3. Legal-approved claim boundary for passport verification, provenance,
   authenticity, QR, and e-label.
   Affects: `/`, `/for-wineries`, `/passport`.
   Validator: legal + engineering.
   Consequence if missing: passport and QR/e-label claims remain limited to
   registry-safe language only.

4. Engineering-approved passport field list and one approved public example
   record/token for screenshots.
   Affects: `/for-wineries` Passport data model and Bottle identity;
   `/passport` hierarchy and scan sections.
   Validator: engineering + winery/product.
   Consequence if missing: screenshots and field-specific copy remain
   `NEEDS_ENGINEERING_VALIDATION`.

5. Approved Phase 1 partner category list.
   Affects: `/partners` Partner entry, Partnership categories, Pilot/access
   model, Related paths.
   Validator: Maksim/partner owner + legal.
   Consequence if missing: `/partners` remains `NOT_READY`.

6. Approved asset pack or explicit asset-free launch decision.
   Affects: all pages, especially proof, discovery, winery, passport, and
   partner sections.
   Validator: brand/product.
   Consequence if missing: visual proof sections remain `NEEDS_ASSETS`.

7. Winery pilot criteria and public winery onboarding checklist.
   Affects: `/for-wineries` and `/passport` winery use cases.
   Validator: winery owner + legal/privacy.
   Consequence if missing: winery page copy remains generic and
   `NEEDS_BUSINESS_INPUT`.

8. Blind Tasting naming decision.
   Affects: `/wine-lovers` Tasting and game concepts.
   Validator: Maksim/product.
   Consequence if missing: use generic "blind tasting" only; no
   `Blind Detective` public claim.

## Summary Counts

- Sections inventoried: 39 of 39.
- Verified facts count: 20.
- Claims requiring validation count: 35.
- Prohibited claims count: 17.
- Asset gaps: 9 major gap groups.
- Page readiness: `/` PARTIALLY_READY; `/wine-lovers` PARTIALLY_READY;
  `/for-wineries` PARTIALLY_READY; `/passport` PARTIALLY_READY; `/partners`
  NOT_READY.
