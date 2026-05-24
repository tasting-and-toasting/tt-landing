(function () {
  var ALLOWED = ["en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro"];

  function normalizeCode(raw) {
    var c = (raw || "").toLowerCase().split("-")[0] || "en";
    if (c === "iw") c = "he";
    return c;
  }

  function pickLang() {
    var param = new URLSearchParams(window.location.search).get("lang");
    if (param != null && param !== "") {
      var pq = normalizeCode(param);
      if (ALLOWED.indexOf(pq) !== -1) {
        try {
          localStorage.setItem("tt_lang", pq);
        } catch (e) {}
        return pq;
      }
    }
    var saved = null;
    try {
      saved = localStorage.getItem("tt_lang");
    } catch (e) {}
    if (saved != null && saved !== "") {
      var sq = normalizeCode(saved);
      if (ALLOWED.indexOf(sq) !== -1) return sq;
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

  /** Append ?lang= or &lang=; preserve #-fragment. Skip if lang already present. */
  function appendLangQuery(href, lang) {
    if (/\blang=/.test(href)) return href;
    var hashIdx = href.indexOf("#");
    var basePart = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
    var hashPart = hashIdx >= 0 ? href.slice(hashIdx) : "";
    var qIdx = basePart.indexOf("?");
    var pathOnly = qIdx >= 0 ? basePart.slice(0, qIdx) : basePart;
    var qs = qIdx >= 0 ? basePart.slice(qIdx + 1) : "";
    if (qs.length) return pathOnly + "?" + qs + "&lang=" + encodeURIComponent(lang) + hashPart;
    return pathOnly + "?lang=" + encodeURIComponent(lang) + hashPart;
  }

  function rewriteInternalLinks(lang) {
    if (lang === "en") return;
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      if (href.charAt(0) === "#") return;
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return;
      try {
        var resolved = new URL(href, window.location.href);
        if (resolved.origin !== window.location.origin) return;
      } catch (e) {
        return;
      }
      a.setAttribute("href", appendLangQuery(href, lang));
    });
  }

  function injectLangSelector(currentLang) {
    if (document.querySelector(".tt-lang-switcher")) return;

    var langs = [
      { code: "en", label: "EN" },
      { code: "fr", label: "FR" },
      { code: "ru", label: "RU" },
      { code: "es", label: "ES" },
      { code: "uk", label: "UK" },
      { code: "it", label: "IT" },
      { code: "de", label: "DE" },
      { code: "he", label: "HE" },
      { code: "pt", label: "PT" },
      { code: "ka", label: "KA" },
      { code: "ro", label: "RO" },
    ];

    var switcher = document.createElement("div");
    switcher.className = "tt-lang-switcher";
    switcher.style.cssText =
      "position:fixed;top:12px;right:16px;z-index:9999;display:flex;gap:4px;flex-wrap:wrap;max-width:200px;background:rgba(0,0,0,0.7);padding:6px 8px;border-radius:4px;";

    langs.forEach(function (item) {
      var ln = document.createElement("a");
      ln.href = "?lang=" + encodeURIComponent(item.code);
      ln.textContent = item.label;
      ln.style.cssText =
        "font-size:11px;color:" +
        (item.code === currentLang ? "#c9a96e" : "#888") +
        ";font-weight:" +
        (item.code === currentLang ? "700" : "400") +
        ";text-decoration:none;font-family:monospace;";
      switcher.appendChild(ln);
    });

    document.body.appendChild(switcher);
  }

  /** Language: ?lang= first, persist to tt_lang, then localStorage, else browser locales. */
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

  function preparePage(lang) {
    setDocumentLangAttr(lang);
    rewriteInternalLinks(lang);
    injectLangSelector(lang);
  }

  function apply(data) {
    var lang = pickLang();
    preparePage(lang);
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
    preparePage(lang);
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
