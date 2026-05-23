(function () {
  var ALLOWED = ["en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro"];

  function normalizeCode(raw) {
    var c = (raw || "").toLowerCase().split("-")[0] || "en";
    if (c === "iw") c = "he";
    return c;
  }

  function pickLang() {
    var qLang = new URLSearchParams(window.location.search).get("lang");
    if (qLang) {
      var raw = normalizeCode(qLang);
      if (ALLOWED.indexOf(raw) === -1) return "en";
      return raw;
    }
    var list =
      typeof navigator !== "undefined" && navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator && navigator.language ? navigator.language : "en"];
    for (var i = 0; i < list.length; i++) {
      var cand = normalizeCode(list[i]);
      if (ALLOWED.indexOf(cand) !== -1) return cand;
    }
    return "en";
  }

  function htmlLang(code) {
    if (code === "pt") return "pt-PT";
    if (code === "uk") return "uk";
    return code;
  }

  function setDocumentLangAttr(lang) {
    document.documentElement.setAttribute("lang", htmlLang(lang));
    document.documentElement.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  }

  /** Language: ?lang= first, else first supported browser locale, else EN (matches TT-141 apply-tt141.js behavior). */
  function applySwitcherState(lang) {
    document.querySelectorAll("[data-lang-link]").forEach(function (el) {
      var code = el.getAttribute("data-lang-link") || "";
      var on = code === lang;
      el.classList.toggle("is-current-lang", on);
      if (on) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
  }

  function localeTable(data, lang) {
    var base = data.en || {};
    var loc = data[lang] || {};
    return Object.assign({}, base, loc);
  }

  function apply(data) {
    var lang = pickLang();
    setDocumentLangAttr(lang);
    var T = localeTable(data, lang);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.querySelector("[data-i18n], [data-i18n-html]")) return;
      var key = el.getAttribute("data-i18n");
      if (!key || T[key] == null) return;
      el.textContent = T[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      if (el.querySelector("[data-i18n], [data-i18n-html]")) return;
      var key = el.getAttribute("data-i18n-html");
      if (!key || T[key] == null) return;
      el.innerHTML = T[key];
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (!key || T[key] == null) return;
      el.setAttribute("title", T[key]);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (!key || T[key] == null) return;
      el.setAttribute("placeholder", T[key]);
    });
    document.querySelectorAll("[data-i18n-value]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-value");
      if (!key || T[key] == null) return;
      el.setAttribute("value", T[key]);
      if ("value" in el) el.value = T[key];
    });
    applySwitcherState(lang);
  }

  function applyWithoutTranslations() {
    var lang = pickLang();
    setDocumentLangAttr(lang);
    applySwitcherState(lang);
  }

  fetch("src/i18n/tt141-features.json")
    .then(function (r) {
      return r.json();
    })
    .then(apply)
    .catch(function () {
      applyWithoutTranslations();
    });
})();
