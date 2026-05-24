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

    var navEl =
      document.querySelector("nav") ||
      document.querySelector("header nav") ||
      document.querySelector(".nav-links") ||
      document.querySelector("[class*=\"nav\"]");

    var FLAGS = {
      en:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4"/><path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/></svg>',
      fr:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ED2939"/></svg>',
      ru:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#0033A0"/><rect y="13" width="30" height="7" fill="#CC0000"/></svg>',
      es:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>',
      uk:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="10" fill="#005BBB"/><rect y="10" width="30" height="10" fill="#FFD500"/></svg>',
      it:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/></svg>',
      de:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="7" fill="#000"/><rect y="7" width="30" height="6" fill="#DD0000"/><rect y="13" width="30" height="7" fill="#FFCE00"/></svg>',
      he:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect y="3" width="30" height="3" fill="#0038b8"/><rect y="14" width="30" height="3" fill="#0038b8"/><polygon points="15,7 18.5,13 11.5,13" fill="none" stroke="#0038b8" stroke-width="1.2"/><polygon points="15,13 18.5,7 11.5,7" fill="none" stroke="#0038b8" stroke-width="1.2"/></svg>',
      pt:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="12" height="20" fill="#006600"/><rect x="12" width="18" height="20" fill="#FF0000"/><circle cx="12" cy="10" r="4" fill="#FFD700" stroke="#003399" stroke-width="0.8"/></svg>',
      ka:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect x="12" width="6" height="20" fill="#FF0000"/><rect y="7" width="30" height="6" fill="#FF0000"/></svg>',
      ro:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="10" height="20" fill="#002B7F"/><rect x="10" width="10" height="20" fill="#FCD116"/><rect x="20" width="10" height="20" fill="#CE1126"/></svg>',
    };

    var wrap = document.createElement("div");
    wrap.className = "tt-lang-switcher";
    wrap.style.cssText =
      "margin-left:auto;display:flex;align-items:center;position:relative;flex-shrink:0;font-family:monospace;";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = FLAGS[currentLang] || FLAGS.en;
    btn.style.cssText =
      "width:32px;height:22px;border:1.5px solid rgba(201,169,110,0.6);border-radius:3px;cursor:pointer;background:none;padding:0;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,0.4);";
    btn.setAttribute("aria-label", "Select language");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-haspopup", "listbox");

    var dropdown = document.createElement("div");
    dropdown.setAttribute("role", "listbox");
    dropdown.style.cssText =
      "display:none;position:absolute;top:26px;right:0;background:rgba(10,5,5,0.95);border:1px solid rgba(201,169,110,0.3);border-radius:4px;padding:8px;flex-wrap:wrap;gap:6px;width:160px;box-sizing:border-box;";



    var langsList = ["en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro"];

    langsList.forEach(function (code) {
      var a = document.createElement("a");
      a.href = "?lang=" + encodeURIComponent(code);
      a.innerHTML = FLAGS[code];
      var borderGold = code === currentLang ? "2px solid #c9a96e" : "1px solid #333";
      a.style.cssText =
        "width:32px;height:22px;display:inline-flex;border-radius:2px;overflow:hidden;border:" +
        borderGold +
        ";opacity:" +
        (code === currentLang ? "1" : "0.7") +
        ";";
      a.setAttribute("aria-label", code.toUpperCase());
      a.title = code.toUpperCase();
      dropdown.appendChild(a);
    });

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dropdown.style.display !== "flex";
      dropdown.style.display = open ? "flex" : "none";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener(
      "click",
      function () {
        dropdown.style.display = "none";
        btn.setAttribute("aria-expanded", "false");
      },
      false
    );

    wrap.appendChild(btn);
    wrap.appendChild(dropdown);

    if (navEl && navEl.appendChild) {
      navEl.appendChild(wrap);
    } else {
      wrap.style.cssText =
        "margin-left:0;display:flex;align-items:center;position:fixed;top:58px;right:16px;z-index:9999;font-family:monospace;";
      document.body.appendChild(wrap);
    }

    if (!document.getElementById("tt-lang-switcher-style")) {
      var style = document.createElement("style");
      style.id = "tt-lang-switcher-style";
      style.textContent = ".tt-lang-switcher svg{width:100%;height:100%;display:block}";
      document.head.appendChild(style);
    }
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
