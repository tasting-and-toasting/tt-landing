/* =============================================================================
 * tt-trust.js — shared trust rules for the public CAP passport pages
 * (bottle-scan, wine-passport, vintage-passport, winery-passport,
 *  cap-qr-sticker, cap-onboarding).
 *
 * SECURITY B1 (security/b1-passport-display-integrity). Two rules live here and
 * nowhere else; docs/security/VERIFICATION-STATUS-DISPLAY.md explains them.
 *
 * 1. API ORIGIN. On a production host the pages talk ONLY to the allowlisted
 *    tt-stack API. The ?api= override is honoured only on a local development
 *    host (localhost, 127.x.x.x, ::1, 0.0.0.0) and only for http(s) URLs.
 *    Before this module every page did `qs.get('api') || ...`, so anyone could
 *    publish a tastingandtoasting.com link that rendered foreign data.
 *
 * 2. VERIFICATION STATUS. A "Verified" badge is shown only when the API says
 *    exactly `verification_status === "verified"` for the WINERY — the only
 *    verification state tt-stack defines with a writer (reviewer decision
 *    under_review -> verified; tt-stack api/src/cap/wineryVerificationLifecycle.ts).
 *    Anything else (missing, unknown, "certified", booleans, other casing) is
 *    NOT verified and gets no verified badge. Wine, vintage and bottle have no
 *    verification state in the API contract, so they never get one.
 *    Ownership confirmation is a separate signal and counts only when the API
 *    sends the boolean `true`.
 *
 * Works in the browser (window.TT_TRUST) and in node (require) so the rules are
 * unit-tested offline: tools/security/check-passport-trust.js.
 * ===========================================================================*/
(function (root) {
  "use strict";

  var PROD_API = "https://tt-stack-prod.onrender.com/api/cap";
  var LOCAL_API = "http://localhost:8088/api/cap";
  /* Every origin a passport page may fetch from on a production host.
   * vercel.json CSP connect-src must list exactly these (plus 'self'). */
  var ALLOWED_API_ORIGINS = ["https://tt-stack-prod.onrender.com"];

  /* Values tt-stack accepts for cap_wineries.verification_status
   * (WINERY_VERIFICATION_STATUSES). "submitted" is the alias tt-stack
   * normalises to "documents_submitted". */
  var WINERY_VERIFICATION_STATUSES = ["claimed", "documents_submitted", "under_review", "verified", "rejected"];
  var CONFIRMED_STATUS = "verified";

  function isLocalHost(hostname) {
    var h = String(hostname == null ? "" : hostname).toLowerCase();
    if (h === "localhost" || h === "0.0.0.0" || h === "::1" || h === "[::1]") return true;
    return /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h);
  }

  function searchOf(loc) {
    try { return new URLSearchParams((loc && loc.search) || ""); } catch (e) { return new URLSearchParams(""); }
  }

  function isHttpUrl(value) {
    if (typeof value !== "string") return false;
    var s = value.trim();
    if (!/^https?:\/\//i.test(s)) return false;
    try {
      var u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  /* The ?api= value, but only on a local development host. Used both to pick
   * the API and to carry the override into in-site links while developing. */
  function devApiOverride(loc) {
    if (!loc || !isLocalHost(loc.hostname)) return null;
    var v = searchOf(loc).get("api");
    return isHttpUrl(v) ? v.trim().replace(/\/+$/, "") : null;
  }

  function resolveApiBase(loc) {
    if (loc && isLocalHost(loc.hostname)) return devApiOverride(loc) || LOCAL_API;
    return PROD_API;
  }

  /* Normalise a raw winery verification_status from the API.
   * Returns one of WINERY_VERIFICATION_STATUSES or null (missing / unknown). */
  function normalizeWineryStatus(raw) {
    if (typeof raw !== "string") return null;
    var s = raw.trim();
    if (s === "submitted") s = "documents_submitted";
    return WINERY_VERIFICATION_STATUSES.indexOf(s) === -1 ? null : s;
  }

  /* status:   normalised value or null
   * verified: true ONLY for the confirmed reviewer decision
   * labelKey: neutral i18n key suffix for a known non-verified state, or null
   *           (null = render nothing, never a guessed label) */
  var LABEL = {
    claimed: "claimed",
    documents_submitted: "submitted",
    under_review: "under_review",
    verified: "verified",
    rejected: "rejected"
  };
  function wineryVerification(raw) {
    var s = normalizeWineryStatus(raw);
    return { status: s, verified: s === CONFIRMED_STATUS, labelKey: s ? LABEL[s] : null };
  }

  function isWineryVerified(raw) {
    return wineryVerification(raw).verified;
  }

  /* Ownership confirmation: strict boolean true from the API, top level first
   * (the scan and winery payloads carry it at both levels). */
  function ownershipConfirmed(payload, winery) {
    if (payload && typeof payload.ownership_confirmed === "boolean") return payload.ownership_confirmed === true;
    return !!(winery && winery.ownership_confirmed === true);
  }

  /* Only http(s) URLs may become an href/src built from API data. */
  function safeHttpUrl(value) {
    return isHttpUrl(value) ? value.trim() : "";
  }

  var api = {
    PROD_API: PROD_API,
    LOCAL_API: LOCAL_API,
    ALLOWED_API_ORIGINS: ALLOWED_API_ORIGINS.slice(),
    WINERY_VERIFICATION_STATUSES: WINERY_VERIFICATION_STATUSES.slice(),
    CONFIRMED_STATUS: CONFIRMED_STATUS,
    isLocalHost: isLocalHost,
    devApiOverride: devApiOverride,
    resolveApiBase: resolveApiBase,
    normalizeWineryStatus: normalizeWineryStatus,
    wineryVerification: wineryVerification,
    isWineryVerified: isWineryVerified,
    ownershipConfirmed: ownershipConfirmed,
    safeHttpUrl: safeHttpUrl
  };
  if (typeof Object.freeze === "function") Object.freeze(api);

  if (typeof module === "object" && module && module.exports) module.exports = api;
  if (root) root.TT_TRUST = api;
})(typeof window !== "undefined" ? window : null);
