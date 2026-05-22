(function () {
  var ALLOWED = ["en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro"];

  function pickLang() {
    var qLang = new URLSearchParams(window.location.search).get("lang");
    if (!qLang) return "en";
    var raw = qLang.toLowerCase();
    raw = raw.split("-")[0] || raw;
    if (raw === "iw") raw = "he";
    if (ALLOWED.indexOf(raw) === -1) return "en";
    return raw;
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

  /** Current language (?lang first; default EN). */
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
      var key = el.getAttribute("data-i18n");
      if (key && T[key] != null) el.textContent = T[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (key && T[key] != null) el.innerHTML = T[key];
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
