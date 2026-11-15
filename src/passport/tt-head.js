/* Back button of the shared passport header: history back, or the site home
 * when the passport was opened directly (QR scan, shared link). */
(function () {
  var LABEL = { en:"Back", fr:"Retour", ru:"Назад", es:"Atrás", uk:"Назад", it:"Indietro", de:"Zurück", he:"חזרה", pt:"Voltar", ka:"უკან", ro:"Înapoi", pl:"Wstecz" };
  var lang = (window.CAP && window.CAP.lang) || "en";
  document.querySelectorAll("[data-tt-back]").forEach(function (b) {
    b.setAttribute("aria-label", LABEL[lang] || LABEL.en);
    b.addEventListener("click", function () {
      var internal = document.referrer && document.referrer.indexOf(location.origin) === 0;
      if (internal && history.length > 1) history.back();
      else location.href = "/";
    });
  });
})();
