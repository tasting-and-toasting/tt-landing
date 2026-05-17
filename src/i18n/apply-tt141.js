(function () {
  function pickLang() {
    var qLang = new URLSearchParams(window.location.search).get("lang");
    if (qLang) return qLang.toLowerCase().split("-")[0] || "en";
    var n = (navigator.language || "en").toLowerCase();
    if (n.indexOf("pt") === 0) return "pt";
    if (n.indexOf("he") === 0 || n.indexOf("iw") === 0) return "he";
    if (n.indexOf("uk") === 0) return "uk";
    return n.substring(0, 2) || "en";
  }

  function apply(data) {
    var lang = pickLang();
    var T = data[lang] || data.en;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key && T[key] != null) el.textContent = T[key];
    });
  }

  fetch("src/i18n/tt141-features.json")
    .then(function (r) {
      return r.json();
    })
    .then(apply)
    .catch(function () {
      /* English stays in DOM if fetch fails (e.g. file://) */
    });
})();
