# Landing Homepage Implementation Report 01

Status: PASS

Task: implement and review the public Tasting & Toasting homepage v1 for `/`
before publication.

## File Scope

Changed files:

| File | Necessary | Reason |
| --- | --- | --- |
| `index.html` | Yes | Replaces the old prototype-led public homepage with the approved static homepage structure, copy, navigation, SEO tags, accessibility behavior, and responsive CSS. |
| `src/config/pages.json` | Yes | Updates the registered home page title so the page registry matches the implemented approved SEO title. The page-registry validator intentionally fails on title drift. |
| `tools/tests/test_page_registry.py` | Yes | Updates the required foundation-page title assertion to match the approved homepage title and the updated registry. |
| `docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md` | Yes | Required implementation and review report with validation evidence, CTA reconciliation, route decisions, screenshots, and known limitations. |
| `docs/implementation/screenshots/homepage-v1-review/*.jpg` | Yes | Durable browser review screenshots required by the publication-review task. |

No unrelated pages, application runtime files, backend files, deployment files,
dependencies, CAP runtime, authentication, subscriptions, marketplace runtime,
Ask Max runtime, Sommelier Workspace, Winery Workspace, or mobile application
files were changed.

## Source Path Note

The task references `docs/architecture/LANDING-CONTENT-ARCHITECTURE-01.md` and
`docs/architecture/LANDING-ROUTE-STRATEGY-01.md`. In this worktree, those
documents exist under `docs/strategy/`:

- `docs/strategy/LANDING-CONTENT-ARCHITECTURE-01.md`
- `docs/strategy/LANDING-ROUTE-STRATEGY-01.md`

Those matching source-of-truth files were used.

## Sections Verified

Implemented homepage structure count: 10.

| Order | Implemented item | Source requirement | Status |
| ---: | --- | --- | --- |
| 1 | Global navigation | Global navigation | Implemented |
| 2 | `#hero` | Hero | Implemented |
| 3 | `#choose-path` | Audience path section | Implemented |
| 4 | `#platform` | Platform explanation | Implemented |
| 5 | `#wine-lovers` | Wine Lovers section | Implemented |
| 6 | `#for-wineries` | For Wineries section | Implemented |
| 7 | `#passport` | Passport section | Implemented |
| 8 | `#trust-proof` | Trust and credibility section | Implemented |
| 9 | `#about` | About section | Implemented |
| 10 | `#final-cta` plus footer | Final CTA and footer transition | Implemented |

Heading review:

- One H1 only.
- H1 exactly matches Copy Pack v2.
- Main sections use H2 headings in the approved order.
- Cards, notices, and fact panels use H3 where needed.
- Footer uses grouped H2 headings.

## Copy Review

Exact Copy Pack v2 matches:

- SEO title.
- Meta description.
- Hero kicker, H1, body, why-it-matters sentence, primary CTA, and secondary CTA.
- `Start with your role` heading and intro.
- Audience card body copy for Wine Lovers, For Wineries, Passport, and Company and legal.
- `Wine stories need a place to travel.` headline and both platform paragraphs.
- Passport headline, body, and limitation copy.
- Current-status headline and the three status buckets.
- Pre-launch notice.
- Proof placeholder headline and copy.
- `Who we are.` about heading from the homepage spec.
- `Choose your path` final CTA heading.
- `Keep public paths simple.` footer-transition heading.

Reviewed deviations and corrections:

- Replaced the invented About heading `Company context, kept public and simple.` with `Who we are.`.
- Replaced the final CTA heading `Keep public paths simple.` with `Choose your path`.
- Moved `Keep public paths simple.` to the footer transition.
- Replaced the internal-feeling hero status label `Public homepage v1` with source-aligned current-status/pre-launch wording.
- Replaced the misleading Company/legal card action `Review legal information` to `Review company details` because the link points to `#about`.
- Removed visible Partners navigation/footer links while `/partners` has no implemented destination.

No unsupported claims were found after correction. The homepage does not claim
active app runtime, commercial wine sales, subscriptions, live event booking,
payments, final pricing, certification, anti-counterfeit protection, guaranteed
authenticity, legal compliance, self-serve winery onboarding, or live partner
flows.

## CTA Reconciliation

The homepage specification defines 19 CTA mappings. The previous report's
`17 live main-content CTA/link actions` count was incomplete because it mixed
visible rendered link instances with the specification mapping count and
excluded navigation mappings. The reconciled count is:

- Specification CTA mappings: 19.
- Implemented as live same-page or valid-route actions: 12 mappings.
- Implemented as legal/mail actions: 2 mappings.
- Withheld or rendered as plain text because destination routes are not
  implemented: 5 mappings.
- Footer links are not part of the 19 CTA mapping count; they are footer
  transition/support navigation and are reported separately.

| # | Section | Visible label | Destination or behavior | Specification reference | Implementation status | Reason |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Header nav | Wine Lovers | `#wine-lovers` | Header nav `Wine Lovers` to `/wine-lovers` | Implemented as same-page fallback | `/wine-lovers` has no registered source; same-page section preserves intent without a broken route. |
| 2 | Header nav | For Wineries | `#for-wineries` | Header nav `For Wineries` to `/for-wineries` | Implemented as same-page fallback | `/for-wineries` has no registered source; same-page section preserves intent without a broken route. |
| 3 | Header nav | Passport | `#passport` | Header nav `Passport` to `/passport` | Implemented as same-page fallback | `/passport` has no registered source; same-page section preserves intent without a broken route. |
| 4 | Header nav | Partners | Not rendered | Header nav `Partners` to `/partners` | Withheld | `/partners` has no registered source and no homepage Partners section; rendering it as an anchor would be misleading. |
| 5 | Header nav | About | `#about` | Header nav `About` to `/#about` | Implemented | Confirmed homepage anchor. |
| 6 | Hero | Choose your path | `#choose-path` | Hero primary CTA | Implemented | Anchor exists and scrolls with fixed-header offset. |
| 7 | Hero | Learn how Passport works | `#passport` | Hero secondary CTA to `/passport` | Implemented as same-page fallback | `/passport` has no registered source; same-page Passport section avoids a broken route. |
| 8 | Audience paths | For wine lovers | `#wine-lovers` | Audience card to `/wine-lovers` | Implemented as same-page fallback | Future route not implemented. |
| 9 | Audience paths | For wineries | `#for-wineries` | Audience card to `/for-wineries` | Implemented as same-page fallback | Future route not implemented. |
| 10 | Audience paths | Passport | `#passport` | Audience card to `/passport` | Implemented as same-page fallback | Future route not implemented. |
| 11 | Audience paths | Partners | Not rendered as a Partners CTA | Audience card to `/partners` | Withheld/consolidated | Partner page copy is outside Copy Pack v2 and `/partners` is not implemented; homepage instead uses the Copy Pack v2 `Company and legal` card. |
| 12 | Platform | For wine lovers | Plain text in connector list | Platform optional link to `/wine-lovers` | Withheld as link | Optional link; future route not implemented. |
| 13 | Platform | For wineries | Plain text in connector list | Platform optional link to `/for-wineries` | Withheld as link | Optional link; future route not implemented. |
| 14 | Platform | Passport | Plain text in connector list | Platform optional link to `/passport` | Withheld as link | Optional link; future route not implemented. |
| 15 | Passport | Learn how Passport works | Section itself, no self-link | Passport CTA to `/passport` | Withheld as self/future route | Dedicated `/passport` page is not implemented; the section already provides the explainer. Optional `For wineries` anchor is rendered. |
| 16 | Trust/proof | Legal notice, Privacy, Terms | `/legal`, `/privacy`, `/terms` | `Review legal information` | Implemented as three valid legal links | Legal support pages exist and are registered. |
| 17 | About | Email Tasting & Toasting | `mailto:hello@tastingandtoasting.com` | About email CTA | Implemented | Confirmed mailto route; no public form added. |
| 18 | Final CTA | Choose your path | `#choose-path` | Final CTA primary | Implemented | Anchor exists and scrolls with fixed-header offset. |
| 19 | Final CTA | Learn how Passport works | `#passport` | Final CTA secondary to `/passport` | Implemented as same-page fallback | `/passport` has no registered source; same-page Passport section avoids a broken route. |

Final CTA count for review: 19 specification mappings reconciled. Current
rendered homepage intentionally has no broken links to `/wine-lovers`,
`/for-wineries`, `/passport`, or `/partners`.

## Route And Link Decisions

Every homepage `href` was reviewed.

Implemented live destinations:

- `/`
- `#main`
- `#choose-path`
- `#wine-lovers`
- `#for-wineries`
- `#passport`
- `#about`
- `/legal`
- `/privacy`
- `/terms`
- `mailto:hello@tastingandtoasting.com`
- `mailto:privacy@tastingandtoasting.com`
- `mailto:legal@tastingandtoasting.com`
- `?lang=` language URLs

Future route decisions:

- `/wine-lovers`: not linked directly; same-page `#wine-lovers` summary used.
- `/for-wineries`: not linked directly; same-page `#for-wineries` summary used.
- `/passport`: not linked directly; same-page `#passport` summary used.
- `/partners`: withheld from nav/footer and not linked; route note remains only
  as non-navigation context.

This follows the homepage spec and route strategy requirement to avoid broken
links and hide or defer unavailable Phase 1 route links until destination pages
are implemented and reviewed.

## Navigation Review

- Desktop navigation shows Wine Lovers, For Wineries, Passport, and About as
  working same-page links.
- Partners is deferred because no page or section exists.
- Mobile navigation uses a 44px menu button.
- Mobile menu opens and closes.
- `aria-expanded` changes from `false` to `true` on open and back to `false` on
  close.
- Escape closes the mobile menu and returns focus to the menu button.
- Menu links close the menu.
- Skip link is visible on focus and targets `#main`.
- Language behavior is preserved with a desktop language dropdown and mobile
  language links.
- No placeholder, JavaScript, empty, dead, or future-route hrefs remain.

## Responsive Review

Durable screenshots:

- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-375.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-375-viewport.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-768.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-768-viewport.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-1024.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-1024-viewport.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-1440.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-1440-viewport.jpg`
- `docs/implementation/screenshots/homepage-v1-review/homepage-v1-review-375-menu-open.jpg`

Results:

| Width | Result |
| ---: | --- |
| 375px | Pass: mobile nav visible, no horizontal overflow, no clipped text, CTAs stack cleanly, footer is single column, visible targets meet 44px. |
| 768px | Pass: mobile nav visible, no horizontal overflow, cards/sections stack cleanly, visible targets meet 44px. |
| 1024px | Pass: desktop nav visible, no horizontal overflow, footer is two columns, CTA rows wrap cleanly. |
| 1440px | Pass: desktop nav visible, compact language dropdown avoids nav collision, hero hierarchy is clear, footer is four columns. |

Observed layout:

- No horizontal overflow at any required breakpoint.
- No clipped CTA text.
- No navigation collisions.
- No card hover/focus layout shift.
- No unreadable text found in viewport spot checks.
- Full-page screenshots are intentionally tall; viewport screenshots were also
  captured for readable publication evidence.

## Accessibility Review

- One H1 verified.
- Semantic landmarks present: `header`, `main`, `section`, `nav`, `footer`.
- Heading hierarchy verified.
- Skip link implemented.
- Focus states use `:focus-visible`.
- Mobile menu is keyboard reachable and exposes `aria-expanded`.
- Escape closes mobile menu and returns focus to the menu trigger.
- Language dropdown is keyboard reachable and exposes `aria-expanded`.
- Visible interactive targets meet 44px minimum after correction.
- Existing logo images have meaningful alt text and declared dimensions.
- Decorative page grain is `aria-hidden`.
- Reduced-motion media query disables smooth scrolling and transition duration.
- Status is communicated through text, not color only.
- No focus trap is introduced; focus is not lost on menu close.

## SEO Review

- Title: `Tasting & Toasting | Wine Discovery And Bottle Passport Context`.
- Meta description matches Copy Pack v2.
- Canonical: `https://tastingandtoasting.com/`.
- Open Graph basics: type, title, description, URL, site name.
- Twitter card basics: summary, title, description.
- `og:image` intentionally omitted because no approved image exists.
- Unsupported schema intentionally omitted.
- Semantic headings implemented.
- Internal links route only to valid anchors, registered legal routes, `/`, or
  mailto/language behavior.
- `src/config/pages.json` home title matches the implemented HTML title.

## Language Behavior

Verified behavior:

- Existing language selector remains present.
- `?lang=en` sets `html lang="en"` and `dir="ltr"`.
- `?lang=he` sets `html lang="he"` and `dir="rtl"`.
- The language button reflects the current language code.
- For non-English languages, the shared runtime rewrites internal route links
  with `?lang=...` where applicable.
- New homepage copy remains English because no new translation entries were
  added in this scoped task.

Publication note:

- The homepage preserves language state and selector behavior but should not be
  described as fully translated. No visible claim of complete translation was
  added.

## JavaScript And Browser Behavior

- External script preserved: `src/i18n/apply-tt141.js`.
- Inline script count: 1.
- Inline script handles mobile menu, language dropdown, anchor scrolling, Escape
  close behavior, and focus return.
- No console errors observed.
- No uncaught exceptions observed.
- Anchor scrolling works and respects reduced motion.
- No event-listener duplication found in static review.
- No unnecessary framework or dependency added.

## Performance Review

- No dependency was added.
- No heavy framework was added.
- No remote video remains on the homepage.
- No hero media, screenshots, or speculative photography were added.
- Existing Google Fonts are preserved with `display=swap`.
- Existing logo assets use declared dimensions.
- Footer logo is lazy-loaded.
- JavaScript remains small and native.
- Layout shift risk is limited by declared logo dimensions, no late media
  inserts, stable card sizing, and asset-free proof sections.

## Asset Gaps

No new assets were created.

Remaining approved-asset gaps:

- Approved hero image.
- Approved Passport hierarchy diagram.
- Approved Passport screenshot or sample record.
- Approved proof screenshot set.
- Approved winery or consumer photography.
- Approved partner logos or testimonials.

The homepage uses the approved existing assets only:

- `assets/logo_nav.png`
- `assets/logo_footer.png`
- `assets/favicon-64.png`

## Known Limitations

- `/wine-lovers`, `/for-wineries`, `/passport`, and `/partners` are still
  future-proposed routes without registered HTML source files.
- Future-route CTAs are therefore implemented as same-page anchors, plain text,
  or withheld according to route readiness.
- Partner routing is deferred until `/partners` is implemented and reviewed.
- The homepage is English-first while preserving existing language-selection
  behavior.
- HTML validation used the available Python parser smoke check; no standalone
  W3C validator is installed in the repository.
- CSS validation used browser parsing and visual inspection; no standalone CSS
  validator is installed in the repository.

## Validation Results

Commands run:

- `git diff --check`: pass.
- `git status --short`: pass; exact status captured below.
- `git diff --stat`: pass; exact stat captured below.
- `git diff -- index.html`: reviewed.
- `git diff -- src/config/pages.json`: reviewed.
- `git diff -- tools/tests/test_page_registry.py`: reviewed.
- `git diff -- docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md`: reviewed as a new file.
- `python3 tools/validate-page-registry.py`: pass.
- `python3 tools/validate-foundation-config.py`: pass.
- `python3 tools/audit-route-coverage.py`: pass.
- `python3 -m pytest tools/tests`: pass; 34 passed.
- `node --check src/i18n/apply-tt141.js`: pass.
- Inline JavaScript parse check: pass; 1 inline script parsed.
- HTML parser smoke check: pass.
- Homepage href check: pass.
- Browser console check: pass; no errors.
- Browser responsive checks: pass at 375px, 768px, 1024px, 1440px.

Exact final `git status --short` is expected to include:

```text
 M index.html
 M src/config/pages.json
 M tools/tests/test_page_registry.py
?? docs/implementation/LANDING-HOMEPAGE-IMPLEMENTATION-REPORT-01.md
?? docs/implementation/screenshots/
```

## Scope Confirmation

Not implemented:

- `/wine-lovers`
- `/for-wineries`
- `/passport`
- `/partners`
- Application runtime
- Mobile application
- Backend
- Authentication
- Subscriptions
- CAP runtime
- Marketplace runtime
- Ask Max runtime
- Sommelier Workspace
- Winery Workspace
- Deployment

No commit, push, merge, pull request, or deployment was performed.
