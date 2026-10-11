/* =============================================================================
 * cap-i18n.js — shared 12-language i18n engine for the CAP passport pages.
 *
 * Mirrors the index.html system (src/i18n/apply-tt141.js):
 *   - language resolution: ?lang= → localStorage["tt_lang"] → navigator → en
 *   - html[lang] + html[dir="rtl"] for Hebrew
 *   - the flag switcher (.lang-switcher-flags > .lang-flag-link[data-lang-link])
 * ...extended with PL (Polish) as the 12th language.
 *
 * Differences from index: the CAP pages render their body from live API data,
 * so this exposes CAP.t()/CAP.lang for the page's own render code, and
 * CAP.wireSwitcher() preserves the existing ?slug / ?token / ?api params when
 * switching language (index pages have no such params).
 * ===========================================================================*/
(function () {
  var ALLOWED = ["en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro", "pl"];

  var T = {
    en: {
      b_claimed:"Producer-claimed", b_review:"Under review", b_verified:"Verified", b_unverified:"Unverified",
      color_red:"Red", color_white:"White", color_rose:"Rosé", color_orange:"Orange", color_sparkling:"Sparkling",
      sweet_dry:"Dry", sweet_semi_dry:"Semi-dry", sweet_semi_sweet:"Semi-sweet", sweet_sweet:"Sweet",
      nav_winery:"WINERY PASSPORT", nav_wine:"WINE PASSPORT", nav_vintage:"VINTAGE PASSPORT",
      loading:"Loading…", nf_winery:"Winery not found.", nf_wine:"Wine not found.", nf_vintage:"Vintage not found.", nf_bottle:"This bottle could not be verified.", nf_slug_missing:"No winery specified.", nf_token_missing:"No bottle token specified.",
      founded:"Founded", dna_title:"Winery DNA", family:"The family", land:"The land", philosophy:"Philosophy", story:"Origin",
      services_title:"Experiences", wines_title:"Wines", contact_title:"Visit & contact", book:"Book a tasting", website:"Visit website",
      email:"Email", phone:"Phone", location:"Location", first_registered:"First registered vineyard in Poland",
      svc_degustation:"Tasting", svc_hotel:"Hotel", svc_restaurant:"Restaurant", svc_spa_winotherapy:"Spa & Winotherapy",
      svc_enotourism:"Enotourism", svc_weddings_events:"Weddings & Events", svc_gift_sets_shop:"Gift sets & Shop", svc_business_programs:"Business programs",
      overview:"About this wine", vintages_title:"Vintages", bottles:"bottles", back_wines:"All wines", back_wine:"Wine passport", back_winery:"Winery passport",
      total_bottles:"Bottles produced", abv:"Alcohol", year:"Vintage year", production:"The vintage", ageing:"Ageing potential", ageing_val:"Cellar-worthy", overview_vintage:"This vintage",
      verified_h:"Verified &amp; <em>Traceable</em>", bottle_of:"Bottle {n} of {t}", founder_words:"Founder's words", biography:"Bottle Biography",
      winery_section:"The winery", verified_facts:"Verified Facts", view_winery:"View winery", book_tasting:"Book a tasting", share:"Share this bottle", copied:"Link copied",
      ev_harvest:"Harvest", ev_fermentation:"Fermentation", ev_ageing:"Ageing", ev_bottling:"Bottling", ev_release:"Release",
      cap_verified:"CAP Verified", scan_story:"Scan to discover the story", bottle_word:"Bottle",
      wp_ctx_loading:"Winery passport", wp_ctx_ready:"Winery passport",
      wp_kick:"Winery", wp_verified_winery:"Verified Winery", wp_vs_prefix:"Verification status:",
      wp_dna_label:"Character · DNA", wp_services_label:"Services offered",
      wp_wines_label:"Wines · walk the chain →", wp_wines_one:"1 wine", wp_wines_many:"{n} wines",
      wp_wines_empty:"No wines listed yet", wp_wines_empty_sub:"This winery hasn't added wines to its passport.",
      wp_nf_kick:"Passport not found", wp_nf_title:"This winery couldn't be found.",
      wp_nf_body:"The link may be mistyped, or this winery is no longer listed on Tasting & Toasting.",
      wp_err_kick:"Something went wrong", wp_err_title:"We couldn't load this passport.",
      wp_err_body:"A problem on our end, not with the winery. Please try again.",
      wp_retry:"Try again", wp_explore:"Explore Tasting & Toasting",
      vs_verified:"Verified", vs_under_review:"Under review", vs_submitted:"Submitted",
      vs_claimed:"Claimed", vs_rejected:"Not verified",
      bp_ctx_loading:"Bottle passport", bp_ctx_ready:"Scanned · bottle passport",
      bp_kick:"This bottle", bp_edition:"Edition", bp_by:"by",
      bp_dna_label:"Maker's character · DNA",
      bp_timeline_label:"Provenance · this bottle's journey",
      bp_timeline_empty:"No provenance events recorded yet",
      bp_timeline_empty_sub:"The maker hasn't added this bottle's journey.",
      bp_facts_label:"Wine facts", bp_walk_label:"Climb the story →",
      bp_vintage_sub:"This year's release", bp_wine_sub:"The wine, all vintages",
      bp_winery_sub:"The maker · what else they produce",
      bp_nf_kick:"Bottle not found", bp_nf_title:"We couldn't confirm this. This code isn't in our records.",
      bp_nf_body:"Check the link or QR code and try again. If you believe this is an error, contact the producer directly.",
      bp_err_kick:"Something went wrong", bp_err_title:"We couldn't load this scan.",
      bp_err_body:"A problem on our end, not with your bottle. Please try again.",
      bp_retry:"Try again", bp_visit_website:"Visit {site}",
      fact_color:"Color", fact_sweetness:"Sweetness", fact_grapes:"Grapes",
      fact_appellation:"Appellation", fact_style:"Style",
      wn_ctx_loading:"Wine passport", wn_ctx_ready:"Wine passport",
      wn_kick:"Wine", wn_facts_label:"Product identity",
      wn_vintages_label:"Vintages · walk down →", wn_vintages_one:"1 vintage", wn_vintages_many:"{n} vintages",
      wn_vintages_empty:"No vintages listed yet",
      wn_vintages_empty_sub:"This wine doesn't have vintages on its passport yet.",
      wn_story_label:"The story",
      wn_nf_kick:"Wine not found", wn_nf_title:"This wine couldn't be found.",
      wn_nf_body:"The link may be mistyped, or this wine is no longer listed on Tasting & Toasting.",
      wn_err_kick:"Something went wrong", wn_err_title:"We couldn't load this wine.",
      wn_err_body:"A problem on our end, not with the wine. Please try again.",
      wn_retry:"Try again",
      vt_ctx_loading:"Vintage passport", vt_ctx_ready:"Vintage passport",
      vt_kick:"Vintage", vt_of:"of",
      vt_facts_label:"This harvest", vt_blend_label:"Blend · this year",
      vt_wine_context_label:"Wine",
      vt_tasting_label:"Tasting notes", vt_production_label:"Production notes",
      vt_fact_released:"Released",
      vt_nf_kick:"Vintage not found", vt_nf_title:"This vintage couldn't be found.",
      vt_nf_body:"The link may be mistyped, or this vintage is no longer listed on Tasting & Toasting.",
      vt_err_kick:"Something went wrong", vt_err_title:"We couldn't load this vintage.",
      vt_err_body:"A problem on our end, not with the vintage. Please try again.",
      vt_retry:"Try again",
      wn_un_kick:"Passport update in progress", wn_un_title:"Information about this wine is being updated.",
      wn_un_body:"Please try opening the passport later.",
      wn_un_note:"We are refining some details to give you the most accurate information. The passport will be available again once the update is complete.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Producer-asserted", wn_producer_label:"Producer", wn_by:"by", wn_coming_label:"Coming soon", wn_demo_badge:"Demo", wn_buy_title:"Buy this wine", wn_buy_body:"Placeholder for direct purchase — not wired to a store yet.", wn_shop_cta:"Shop →", wn_released:"Released",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_crumb_bottle:"Bottle No.{n}", bp_st_minted:"Minted", bp_st_claimed:"Claimed", bp_st_active:"Active", bp_st_activated:"Activated", bp_st_void:"Void", bp_scans_n:"{n} scans", bp_sec_vintage:"Vintage", bp_fact_composition:"Composition", bp_link_vintage:"Vintage passport", bp_buy_title:"Buy this bottle", bp_tasting_title:"Find a tasting nearby", bp_tasting_body:"Placeholder for local tasting events. No scheduling data exists yet.", bp_tasting_cta:"Browse →", bp_vd_kick:"Revoked", bp_vd_title:"This bottle has been revoked.", bp_vd_body:"The producer has withdrawn this code, so its passport is no longer shown. If you have questions about the bottle, contact the producer directly.",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wy_dash_title:"Producer dashboard", wy_dash_body:"Placeholder for scan volume, geography and counterfeit signals. Nothing is tracked yet.", wy_dash_cta:"Open dashboard →"
    },
    fr: {
      b_claimed:"Déclaré par le producteur", b_review:"En cours de vérification", b_verified:"Vérifié", b_unverified:"Non vérifié",
      color_red:"Rouge", color_white:"Blanc", color_rose:"Rosé", color_orange:"Orange", color_sparkling:"Effervescent",
      sweet_dry:"Sec", sweet_semi_dry:"Demi-sec", sweet_semi_sweet:"Moelleux", sweet_sweet:"Doux",
      nav_winery:"PASSEPORT DU DOMAINE", nav_wine:"PASSEPORT DU VIN", nav_vintage:"PASSEPORT DU MILLÉSIME",
      loading:"Chargement…", nf_winery:"Domaine introuvable.", nf_wine:"Vin introuvable.", nf_vintage:"Millésime introuvable.", nf_bottle:"Cette bouteille n'a pas pu être vérifiée.",
      founded:"Fondé en", dna_title:"ADN du domaine", family:"La famille", land:"La terre", philosophy:"Philosophie", story:"Origine",
      services_title:"Expériences", wines_title:"Vins", contact_title:"Visite & contact", book:"Réserver une dégustation", website:"Visiter le site",
      email:"E-mail", phone:"Téléphone", location:"Lieu", first_registered:"Premier vignoble enregistré de Pologne",
      svc_degustation:"Dégustation", svc_hotel:"Hôtel", svc_restaurant:"Restaurant", svc_spa_winotherapy:"Spa & vinothérapie",
      svc_enotourism:"Œnotourisme", svc_weddings_events:"Mariages & événements", svc_gift_sets_shop:"Coffrets & boutique", svc_business_programs:"Programmes pro",
      overview:"À propos de ce vin", vintages_title:"Millésimes", bottles:"bouteilles", back_wines:"Tous les vins", back_wine:"Passeport du vin", back_winery:"Passeport du domaine",
      total_bottles:"Bouteilles produites", abv:"Alcool", year:"Millésime", production:"Le millésime", ageing:"Potentiel de garde", ageing_val:"Apte au vieillissement", overview_vintage:"Ce millésime",
      verified_h:"Vérifié et <em>traçable</em>", bottle_of:"Bouteille {n} sur {t}", founder_words:"Les mots du fondateur", biography:"Biographie de la bouteille",
      winery_section:"Le domaine", verified_facts:"Faits vérifiés", view_winery:"Voir le domaine", book_tasting:"Réserver une dégustation", share:"Partager cette bouteille", copied:"Lien copié",
      ev_harvest:"Vendange", ev_fermentation:"Fermentation", ev_ageing:"Élevage", ev_bottling:"Mise en bouteille", ev_release:"Commercialisation",
      cap_verified:"CAP vérifié", scan_story:"Scannez pour découvrir l'histoire", bottle_word:"Bouteille",
      wn_un_kick:"Mise à jour du passeport en cours", wn_un_title:"Les informations sur ce vin sont en cours de mise à jour.",
      wn_un_body:"Veuillez réessayer d'ouvrir le passeport plus tard.",
      wn_un_note:"Nous précisons certaines informations afin de vous présenter les données les plus exactes. Le passeport sera de nouveau accessible dès la fin de la mise à jour.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Déclaré par le producteur", wn_producer_label:"Producteur", wn_by:"par", wn_coming_label:"Bientôt", wn_demo_badge:"Démo", wn_buy_title:"Acheter ce vin", wn_buy_body:"Emplacement pour l'achat direct — la boutique n'est pas encore connectée.", wn_shop_cta:"Boutique →", wn_released:"Sortie", wn_ctx_loading:"Passeport du vin", wn_ctx_ready:"Passeport du vin", wn_kick:"Vin", wn_facts_label:"À propos du vin", wn_vintages_label:"Millésimes · descendez →", wn_vintages_empty:"Aucun millésime pour l'instant", wn_vintages_empty_sub:"Ce vin n'a pas encore de millésimes sur son passeport.", wn_nf_kick:"Vin introuvable", wn_nf_title:"Ce vin n'a pas pu être trouvé.", wn_nf_body:"Le lien est peut-être erroné, ou ce vin n'est plus référencé sur Tasting & Toasting.", wn_err_kick:"Une erreur est survenue", wn_err_title:"Impossible de charger ce vin.", wn_err_body:"Le problème vient de chez nous, pas du vin. Veuillez réessayer.", wn_retry:"Réessayer", fact_appellation:"Appellation", fact_style:"Style", fact_released:"Sortie",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Passeport de la bouteille", bp_ctx_ready:"Scanné · passeport de la bouteille", bp_crumb_bottle:"Bouteille n°{n}", bp_st_minted:"Code émis", bp_st_claimed:"Attribuée", bp_st_active:"Active", bp_st_activated:"Activée", bp_st_void:"Annulée", bp_scans_n:"{n} scans", bp_sec_vintage:"Millésime", bp_fact_composition:"Composition", bp_timeline_label:"Provenance · le parcours de cette bouteille", bp_timeline_empty:"Aucun événement de provenance enregistré", bp_timeline_empty_sub:"Le producteur n'a pas encore ajouté le parcours de cette bouteille.", bp_link_vintage:"Passeport du millésime", bp_buy_title:"Acheter cette bouteille", bp_tasting_title:"Trouver une dégustation à proximité", bp_tasting_body:"Emplacement pour les dégustations locales. Aucune donnée de calendrier n'existe encore.", bp_tasting_cta:"Parcourir →", bp_vd_kick:"Révoquée", bp_vd_title:"Cette bouteille a été révoquée.", bp_vd_body:"Le producteur a retiré ce code, son passeport n'est donc plus affiché. Pour toute question sur la bouteille, contactez directement le producteur.", bp_nf_kick:"Bouteille introuvable", bp_nf_title:"Nous n'avons pas pu le confirmer. Ce code n'est pas dans nos registres.", bp_nf_body:"Vérifiez le lien ou le QR code et réessayez. Si vous pensez qu'il s'agit d'une erreur, contactez directement le producteur.", bp_err_kick:"Une erreur s'est produite", bp_err_title:"Nous n'avons pas pu charger ce scan.", bp_err_body:"Un problème de notre côté, pas avec votre bouteille. Veuillez réessayer.", bp_retry:"Réessayer", wp_explore:"Découvrir Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Passeport du domaine", wp_ctx_ready:"Passeport du domaine", wp_wines_empty:"Aucun vin répertorié", wp_wines_empty_sub:"Ce domaine n'a pas encore ajouté de vins à son passeport.", wp_nf_kick:"Passeport introuvable", wp_nf_title:"Ce domaine n'a pas pu être trouvé.", wp_nf_body:"Le lien est peut-être incorrect, ou ce domaine n'est plus répertorié sur Tasting & Toasting.", wp_err_kick:"Une erreur s'est produite", wp_err_title:"Nous n'avons pas pu charger ce passeport.", wp_err_body:"Un problème de notre côté, pas avec le domaine. Veuillez réessayer.", wp_retry:"Réessayer", wy_dash_title:"Tableau de bord du producteur", wy_dash_body:"Emplacement pour le volume de scans, la géographie et les signaux de contrefaçon. Rien n'est encore suivi.", wy_dash_cta:"Ouvrir le tableau de bord →"
    },
    ru: {
      b_claimed:"Заявлено производителем", b_review:"На проверке", b_verified:"Подтверждено", b_unverified:"Не подтверждено",
      color_red:"Красное", color_white:"Белое", color_rose:"Розовое", color_orange:"Оранжевое", color_sparkling:"Игристое",
      sweet_dry:"Сухое", sweet_semi_dry:"Полусухое", sweet_semi_sweet:"Полусладкое", sweet_sweet:"Сладкое",
      nav_winery:"ПАСПОРТ ВИНОДЕЛЬНИ", nav_wine:"ПАСПОРТ ВИНА", nav_vintage:"ПАСПОРТ УРОЖАЯ",
      loading:"Загрузка…", nf_winery:"Винодельня не найдена.", nf_wine:"Вино не найдено.", nf_vintage:"Урожай не найден.", nf_bottle:"Эту бутылку не удалось подтвердить.",
      founded:"Основано в", dna_title:"ДНК винодельни", family:"Семья", land:"Земля", philosophy:"Философия", story:"Происхождение",
      services_title:"Впечатления", wines_title:"Вина", contact_title:"Визит и контакты", book:"Забронировать дегустацию", website:"Перейти на сайт",
      email:"Эл. почта", phone:"Телефон", location:"Адрес", first_registered:"Первый зарегистрированный виноградник в Польше",
      svc_degustation:"Дегустация", svc_hotel:"Отель", svc_restaurant:"Ресторан", svc_spa_winotherapy:"Спа и винотерапия",
      svc_enotourism:"Энотуризм", svc_weddings_events:"Свадьбы и мероприятия", svc_gift_sets_shop:"Подарочные наборы и магазин", svc_business_programs:"Бизнес-программы",
      overview:"Об этом вине", vintages_title:"Урожаи", bottles:"бутылок", back_wines:"Все вина", back_wine:"Паспорт вина", back_winery:"Паспорт винодельни",
      total_bottles:"Произведено бутылок", abv:"Крепость", year:"Год урожая", production:"Урожай", ageing:"Потенциал выдержки", ageing_val:"Подходит для погреба", overview_vintage:"Этот урожай",
      verified_h:"Подтверждено и <em>прослеживаемо</em>", bottle_of:"Бутылка {n} из {t}", founder_words:"Слова основателя", biography:"Биография бутылки",
      winery_section:"Винодельня", verified_facts:"Подтверждённые факты", view_winery:"Открыть винодельню", book_tasting:"Забронировать дегустацию", share:"Поделиться бутылкой", copied:"Ссылка скопирована",
      ev_harvest:"Сбор урожая", ev_fermentation:"Ферментация", ev_ageing:"Выдержка", ev_bottling:"Розлив", ev_release:"Выпуск",
      cap_verified:"CAP подтверждён", scan_story:"Отсканируйте, чтобы узнать историю", bottle_word:"Бутылка",
      wn_un_kick:"Паспорт обновляется", wn_un_title:"Информация об этом вине временно обновляется.",
      wn_un_body:"Пожалуйста, попробуйте открыть паспорт позже.",
      wn_un_note:"Мы уточняем некоторые сведения, чтобы предоставить вам наиболее актуальную информацию. Паспорт снова станет доступен после завершения обновления.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Заявлено производителем", wn_producer_label:"Производитель", wn_by:"от", wn_coming_label:"Скоро", wn_demo_badge:"Демо", wn_buy_title:"Купить это вино", wn_buy_body:"Место для прямой покупки — магазин пока не подключён.", wn_shop_cta:"В магазин →", wn_released:"Выпуск", wn_ctx_loading:"Паспорт вина", wn_ctx_ready:"Паспорт вина", wn_kick:"Вино", wn_facts_label:"О вине", wn_vintages_label:"Урожаи · пройдите вниз →", wn_vintages_empty:"Урожаи пока не указаны", wn_vintages_empty_sub:"У этого вина пока нет урожаев в паспорте.", wn_nf_kick:"Вино не найдено", wn_nf_title:"Это вино не удалось найти.", wn_nf_body:"Возможно, в ссылке опечатка, или это вино больше не представлено в Tasting & Toasting.", wn_err_kick:"Что-то пошло не так", wn_err_title:"Не удалось загрузить это вино.", wn_err_body:"Это сбой на нашей стороне, а не с вином. Пожалуйста, попробуйте ещё раз.", wn_retry:"Попробовать снова", fact_appellation:"Апелласьон", fact_style:"Стиль", fact_released:"Выпуск",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Паспорт бутылки", bp_ctx_ready:"Отсканировано · паспорт бутылки", bp_crumb_bottle:"Бутылка №{n}", bp_st_minted:"Выпущен код", bp_st_claimed:"Закреплена", bp_st_active:"Активна", bp_st_activated:"Активирована", bp_st_void:"Аннулирована", bp_scans_n:"сканирований: {n}", bp_sec_vintage:"Урожай", bp_fact_composition:"Состав", bp_timeline_label:"Происхождение · путь бутылки", bp_timeline_empty:"События происхождения пока не записаны", bp_timeline_empty_sub:"Производитель ещё не добавил путь этой бутылки.", bp_link_vintage:"Паспорт урожая", bp_buy_title:"Купить эту бутылку", bp_tasting_title:"Найти дегустацию рядом", bp_tasting_body:"Заглушка для местных дегустаций. Данных о расписании пока нет.", bp_tasting_cta:"Смотреть →", bp_vd_kick:"Отозвана", bp_vd_title:"Эта бутылка отозвана.", bp_vd_body:"Производитель отозвал этот код, поэтому паспорт больше не показывается. Если у вас есть вопросы о бутылке, свяжитесь с производителем напрямую.", bp_nf_kick:"Бутылка не найдена", bp_nf_title:"Мы не смогли это подтвердить. Такого кода нет в наших записях.", bp_nf_body:"Проверьте ссылку или QR-код и попробуйте снова. Если считаете это ошибкой, свяжитесь с производителем напрямую.", bp_err_kick:"Что-то пошло не так", bp_err_title:"Не удалось загрузить сканирование.", bp_err_body:"Проблема на нашей стороне, не с вашей бутылкой. Попробуйте снова.", bp_retry:"Повторить", wp_explore:"Открыть Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Паспорт винодельни", wp_ctx_ready:"Паспорт винодельни", wp_wines_empty:"Вина пока не добавлены", wp_wines_empty_sub:"Эта винодельня ещё не добавила вина в свой паспорт.", wp_nf_kick:"Паспорт не найден", wp_nf_title:"Эту винодельню найти не удалось.", wp_nf_body:"Возможно, ссылка набрана с ошибкой или эта винодельня больше не представлена в Tasting & Toasting.", wp_err_kick:"Что-то пошло не так", wp_err_title:"Не удалось загрузить этот паспорт.", wp_err_body:"Проблема на нашей стороне, не с винодельней. Попробуйте снова.", wp_retry:"Повторить", wy_dash_title:"Панель производителя", wy_dash_body:"Заглушка для числа сканирований, географии и сигналов о подделках. Пока ничего не отслеживается.", wy_dash_cta:"Открыть панель →"
    },
    es: {
      b_claimed:"Declarado por el productor", b_review:"En revisión", b_verified:"Verificado", b_unverified:"Sin verificar",
      color_red:"Tinto", color_white:"Blanco", color_rose:"Rosado", color_orange:"Naranja", color_sparkling:"Espumoso",
      sweet_dry:"Seco", sweet_semi_dry:"Semiseco", sweet_semi_sweet:"Semidulce", sweet_sweet:"Dulce",
      nav_winery:"PASAPORTE DE LA BODEGA", nav_wine:"PASAPORTE DEL VINO", nav_vintage:"PASAPORTE DE LA AÑADA",
      loading:"Cargando…", nf_winery:"Bodega no encontrada.", nf_wine:"Vino no encontrado.", nf_vintage:"Añada no encontrada.", nf_bottle:"No se pudo verificar esta botella.",
      founded:"Fundada en", dna_title:"ADN de la bodega", family:"La familia", land:"La tierra", philosophy:"Filosofía", story:"Origen",
      services_title:"Experiencias", wines_title:"Vinos", contact_title:"Visita y contacto", book:"Reservar una cata", website:"Visitar la web",
      email:"Correo", phone:"Teléfono", location:"Ubicación", first_registered:"Primer viñedo registrado de Polonia",
      svc_degustation:"Cata", svc_hotel:"Hotel", svc_restaurant:"Restaurante", svc_spa_winotherapy:"Spa y vinoterapia",
      svc_enotourism:"Enoturismo", svc_weddings_events:"Bodas y eventos", svc_gift_sets_shop:"Estuches y tienda", svc_business_programs:"Programas de empresa",
      overview:"Sobre este vino", vintages_title:"Añadas", bottles:"botellas", back_wines:"Todos los vinos", back_wine:"Pasaporte del vino", back_winery:"Pasaporte de la bodega",
      total_bottles:"Botellas producidas", abv:"Alcohol", year:"Añada", production:"La añada", ageing:"Potencial de guarda", ageing_val:"Apto para guarda", overview_vintage:"Esta añada",
      verified_h:"Verificado y <em>trazable</em>", bottle_of:"Botella {n} de {t}", founder_words:"Palabras del fundador", biography:"Biografía de la botella",
      winery_section:"La bodega", verified_facts:"Datos verificados", view_winery:"Ver la bodega", book_tasting:"Reservar una cata", share:"Compartir esta botella", copied:"Enlace copiado",
      ev_harvest:"Vendimia", ev_fermentation:"Fermentación", ev_ageing:"Crianza", ev_bottling:"Embotellado", ev_release:"Salida al mercado",
      cap_verified:"CAP verificado", scan_story:"Escanea para descubrir la historia", bottle_word:"Botella",
      wn_un_kick:"Actualización del pasaporte en curso", wn_un_title:"La información sobre este vino se está actualizando.",
      wn_un_body:"Por favor, intente abrir el pasaporte más tarde.",
      wn_un_note:"Estamos precisando algunos datos para ofrecerle la información más actualizada. El pasaporte volverá a estar disponible cuando finalice la actualización.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Declarado por el productor", wn_producer_label:"Productor", wn_by:"por", wn_coming_label:"Próximamente", wn_demo_badge:"Demo", wn_buy_title:"Comprar este vino", wn_buy_body:"Espacio para la compra directa: la tienda aún no está conectada.", wn_shop_cta:"Tienda →", wn_released:"Lanzamiento", wn_ctx_loading:"Pasaporte del vino", wn_ctx_ready:"Pasaporte del vino", wn_kick:"Vino", wn_facts_label:"Sobre el vino", wn_vintages_label:"Añadas · baje →", wn_vintages_empty:"Todavía no hay añadas", wn_vintages_empty_sub:"Este vino aún no tiene añadas en su pasaporte.", wn_nf_kick:"Vino no encontrado", wn_nf_title:"No se pudo encontrar este vino.", wn_nf_body:"Puede que el enlace esté mal escrito o que el vino ya no figure en Tasting & Toasting.", wn_err_kick:"Algo salió mal", wn_err_title:"No pudimos cargar este vino.", wn_err_body:"Es un problema nuestro, no del vino. Inténtelo de nuevo.", wn_retry:"Intentar de nuevo", fact_appellation:"Denominación", fact_style:"Estilo", fact_released:"Lanzamiento",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Pasaporte de la botella", bp_ctx_ready:"Escaneado · pasaporte de la botella", bp_crumb_bottle:"Botella n.º{n}", bp_st_minted:"Código emitido", bp_st_claimed:"Reclamada", bp_st_active:"Activa", bp_st_activated:"Activada", bp_st_void:"Anulada", bp_scans_n:"{n} escaneos", bp_sec_vintage:"Añada", bp_fact_composition:"Composición", bp_timeline_label:"Procedencia · recorrido de la botella", bp_timeline_empty:"Aún no hay eventos de procedencia", bp_timeline_empty_sub:"El productor no ha añadido el recorrido de esta botella.", bp_link_vintage:"Pasaporte de la añada", bp_buy_title:"Comprar esta botella", bp_tasting_title:"Buscar una cata cercana", bp_tasting_body:"Marcador para catas locales. Aún no existen datos de programación.", bp_tasting_cta:"Explorar →", bp_vd_kick:"Anulada", bp_vd_title:"Esta botella ha sido anulada.", bp_vd_body:"El productor ha retirado este código, por lo que su pasaporte ya no se muestra. Si tienes dudas sobre la botella, contacta directamente con el productor.", bp_nf_kick:"Botella no encontrada", bp_nf_title:"No pudimos confirmarlo. Este código no está en nuestros registros.", bp_nf_body:"Revisa el enlace o el código QR e inténtalo de nuevo. Si crees que es un error, contacta directamente con el productor.", bp_err_kick:"Algo ha ido mal", bp_err_title:"No pudimos cargar este escaneo.", bp_err_body:"Un problema de nuestro lado, no de tu botella. Inténtalo de nuevo.", bp_retry:"Reintentar", wp_explore:"Descubre Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Pasaporte de la bodega", wp_ctx_ready:"Pasaporte de la bodega", wp_wines_empty:"Aún no hay vinos", wp_wines_empty_sub:"Esta bodega aún no ha añadido vinos a su pasaporte.", wp_nf_kick:"Pasaporte no encontrado", wp_nf_title:"No se ha podido encontrar esta bodega.", wp_nf_body:"Puede que el enlace esté mal escrito o que esta bodega ya no figure en Tasting & Toasting.", wp_err_kick:"Algo ha ido mal", wp_err_title:"No pudimos cargar este pasaporte.", wp_err_body:"Un problema de nuestro lado, no de la bodega. Inténtalo de nuevo.", wp_retry:"Reintentar", wy_dash_title:"Panel del productor", wy_dash_body:"Marcador para el volumen de escaneos, la geografía y las señales de falsificación. Aún no se registra nada.", wy_dash_cta:"Abrir panel →"
    },
    uk: {
      b_claimed:"Заявлено виробником", b_review:"На перевірці", b_verified:"Підтверджено", b_unverified:"Не підтверджено",
      color_red:"Червоне", color_white:"Біле", color_rose:"Рожеве", color_orange:"Помаранчеве", color_sparkling:"Ігристе",
      sweet_dry:"Сухе", sweet_semi_dry:"Напівсухе", sweet_semi_sweet:"Напівсолодке", sweet_sweet:"Солодке",
      nav_winery:"ПАСПОРТ ВИНОРОБНІ", nav_wine:"ПАСПОРТ ВИНА", nav_vintage:"ПАСПОРТ ВРОЖАЮ",
      loading:"Завантаження…", nf_winery:"Виноробню не знайдено.", nf_wine:"Вино не знайдено.", nf_vintage:"Врожай не знайдено.", nf_bottle:"Цю пляшку не вдалося підтвердити.",
      founded:"Засновано", dna_title:"ДНК виноробні", family:"Родина", land:"Земля", philosophy:"Філософія", story:"Походження",
      services_title:"Враження", wines_title:"Вина", contact_title:"Візит і контакти", book:"Забронювати дегустацію", website:"Відвідати сайт",
      email:"Ел. пошта", phone:"Телефон", location:"Розташування", first_registered:"Перший зареєстрований виноградник у Польщі",
      svc_degustation:"Дегустація", svc_hotel:"Готель", svc_restaurant:"Ресторан", svc_spa_winotherapy:"Спа та винотерапія",
      svc_enotourism:"Енотуризм", svc_weddings_events:"Весілля та події", svc_gift_sets_shop:"Подарункові набори та магазин", svc_business_programs:"Бізнес-програми",
      overview:"Про це вино", vintages_title:"Врожаї", bottles:"пляшок", back_wines:"Усі вина", back_wine:"Паспорт вина", back_winery:"Паспорт виноробні",
      total_bottles:"Вироблено пляшок", abv:"Міцність", year:"Рік врожаю", production:"Врожай", ageing:"Потенціал витримки", ageing_val:"Для витримки", overview_vintage:"Цей врожай",
      verified_h:"Підтверджено та <em>простежувано</em>", bottle_of:"Пляшка {n} з {t}", founder_words:"Слова засновника", biography:"Біографія пляшки",
      winery_section:"Виноробня", verified_facts:"Підтверджені факти", view_winery:"Відкрити виноробню", book_tasting:"Забронювати дегустацію", share:"Поділитися пляшкою", copied:"Посилання скопійовано",
      ev_harvest:"Збір врожаю", ev_fermentation:"Бродіння", ev_ageing:"Витримка", ev_bottling:"Розлив", ev_release:"Випуск",
      cap_verified:"CAP підтверджено", scan_story:"Скануйте, щоб дізнатися історію", bottle_word:"Пляшка",
      wn_un_kick:"Паспорт оновлюється", wn_un_title:"Інформація про це вино тимчасово оновлюється.",
      wn_un_body:"Будь ласка, спробуйте відкрити паспорт пізніше.",
      wn_un_note:"Ми уточнюємо деякі відомості, щоб надати вам найактуальнішу інформацію. Паспорт знову стане доступним після завершення оновлення.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Заявлено виробником", wn_producer_label:"Виробник", wn_by:"від", wn_coming_label:"Незабаром", wn_demo_badge:"Демо", wn_buy_title:"Купити це вино", wn_buy_body:"Місце для прямої купівлі — магазин ще не підключено.", wn_shop_cta:"До магазину →", wn_released:"Випуск", wn_ctx_loading:"Паспорт вина", wn_ctx_ready:"Паспорт вина", wn_kick:"Вино", wn_facts_label:"Про вино", wn_vintages_label:"Врожаї · прогортайте вниз →", wn_vintages_empty:"Врожаї ще не вказані", wn_vintages_empty_sub:"У цього вина ще немає врожаїв у паспорті.", wn_nf_kick:"Вино не знайдено", wn_nf_title:"Це вино не вдалося знайти.", wn_nf_body:"Можливо, у посиланні помилка, або це вино більше не представлене в Tasting & Toasting.", wn_err_kick:"Щось пішло не так", wn_err_title:"Не вдалося завантажити це вино.", wn_err_body:"Це збій на нашому боці, а не з вином. Будь ласка, спробуйте ще раз.", wn_retry:"Спробувати ще раз", fact_appellation:"Апеласьйон", fact_style:"Стиль", fact_released:"Випуск",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Паспорт бутилки", bp_ctx_ready:"Відскановано · паспорт бутилки", bp_crumb_bottle:"Бутилка №{n}", bp_st_minted:"Код випущено", bp_st_claimed:"Закріплена", bp_st_active:"Активна", bp_st_activated:"Активована", bp_st_void:"Анульована", bp_scans_n:"сканувань: {n}", bp_sec_vintage:"Врожай", bp_fact_composition:"Склад", bp_timeline_label:"Походження · шлях бутилки", bp_timeline_empty:"Події походження поки не записані", bp_timeline_empty_sub:"Виробник ще не додав шлях цієї бутилки.", bp_link_vintage:"Паспорт врожаю", bp_buy_title:"Купити цю бутилку", bp_tasting_title:"Знайти дегустацію поблизу", bp_tasting_body:"Заглушка для місцевих дегустацій. Даних про розклад поки немає.", bp_tasting_cta:"Дивитися →", bp_vd_kick:"Відкликана", bp_vd_title:"Цю бутилку відкликано.", bp_vd_body:"Виробник відкликав цей код, тому паспорт більше не показується. Якщо у вас є питання про бутилку, зв'яжіться з виробником напряму.", bp_nf_kick:"Бутилку не знайдено", bp_nf_title:"Ми не змогли це підтвердити. Такого коду немає в наших записах.", bp_nf_body:"Перевірте посилання або QR-код і спробуйте ще раз. Якщо вважаєте це помилкою, зв'яжіться з виробником напряму.", bp_err_kick:"Щось пішло не так", bp_err_title:"Не вдалося завантажити це сканування.", bp_err_body:"Проблема на нашому боці, не з вашою бутилкою. Спробуйте ще раз.", bp_retry:"Спробувати ще раз", wp_explore:"Відкрити Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Паспорт виноробні", wp_ctx_ready:"Паспорт виноробні", wp_wines_empty:"Вина поки не додані", wp_wines_empty_sub:"Ця виноробня ще не додала вина до свого паспорта.", wp_nf_kick:"Паспорт не знайдено", wp_nf_title:"Цю виноробню не вдалося знайти.", wp_nf_body:"Можливо, посилання введено з помилкою або ця виноробня більше не представлена в Tasting & Toasting.", wp_err_kick:"Щось пішло не так", wp_err_title:"Не вдалося завантажити цей паспорт.", wp_err_body:"Проблема на нашому боці, не з виноробнею. Спробуйте ще раз.", wp_retry:"Спробувати ще раз", wy_dash_title:"Панель виробника", wy_dash_body:"Заглушка для кількості сканувань, географії та сигналів про підробки. Поки нічого не відслідковується.", wy_dash_cta:"Відкрити панель →"
    },
    it: {
      b_claimed:"Dichiarato dal produttore", b_review:"In verifica", b_verified:"Verificato", b_unverified:"Non verificato",
      color_red:"Rosso", color_white:"Bianco", color_rose:"Rosato", color_orange:"Orange", color_sparkling:"Spumante",
      sweet_dry:"Secco", sweet_semi_dry:"Semisecco", sweet_semi_sweet:"Semidolce", sweet_sweet:"Dolce",
      nav_winery:"PASSAPORTO DELLA CANTINA", nav_wine:"PASSAPORTO DEL VINO", nav_vintage:"PASSAPORTO DELL'ANNATA",
      loading:"Caricamento…", nf_winery:"Cantina non trovata.", nf_wine:"Vino non trovato.", nf_vintage:"Annata non trovata.", nf_bottle:"Impossibile verificare questa bottiglia.",
      founded:"Fondata nel", dna_title:"DNA della cantina", family:"La famiglia", land:"La terra", philosophy:"Filosofia", story:"Origine",
      services_title:"Esperienze", wines_title:"Vini", contact_title:"Visita e contatti", book:"Prenota una degustazione", website:"Visita il sito",
      email:"E-mail", phone:"Telefono", location:"Luogo", first_registered:"Primo vigneto registrato in Polonia",
      svc_degustation:"Degustazione", svc_hotel:"Hotel", svc_restaurant:"Ristorante", svc_spa_winotherapy:"Spa e vinoterapia",
      svc_enotourism:"Enoturismo", svc_weddings_events:"Matrimoni ed eventi", svc_gift_sets_shop:"Confezioni regalo e shop", svc_business_programs:"Programmi business",
      overview:"Su questo vino", vintages_title:"Annate", bottles:"bottiglie", back_wines:"Tutti i vini", back_wine:"Passaporto del vino", back_winery:"Passaporto della cantina",
      total_bottles:"Bottiglie prodotte", abv:"Alcol", year:"Annata", production:"L'annata", ageing:"Potenziale di invecchiamento", ageing_val:"Da invecchiamento", overview_vintage:"Questa annata",
      verified_h:"Verificato e <em>tracciabile</em>", bottle_of:"Bottiglia {n} di {t}", founder_words:"Le parole del fondatore", biography:"Biografia della bottiglia",
      winery_section:"La cantina", verified_facts:"Fatti verificati", view_winery:"Vedi la cantina", book_tasting:"Prenota una degustazione", share:"Condividi questa bottiglia", copied:"Link copiato",
      ev_harvest:"Vendemmia", ev_fermentation:"Fermentazione", ev_ageing:"Affinamento", ev_bottling:"Imbottigliamento", ev_release:"Immissione sul mercato",
      cap_verified:"CAP verificato", scan_story:"Scansiona per scoprire la storia", bottle_word:"Bottiglia",
      wn_un_kick:"Aggiornamento del passaporto in corso", wn_un_title:"Le informazioni su questo vino sono in aggiornamento.",
      wn_un_body:"Per favore, prova ad aprire il passaporto più tardi.",
      wn_un_note:"Stiamo precisando alcuni dettagli per offrirti le informazioni più aggiornate. Il passaporto sarà di nuovo disponibile al termine dell'aggiornamento.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Dichiarato dal produttore", wn_producer_label:"Produttore", wn_by:"di", wn_coming_label:"Prossimamente", wn_demo_badge:"Demo", wn_buy_title:"Acquista questo vino", wn_buy_body:"Spazio per l'acquisto diretto: il negozio non è ancora collegato.", wn_shop_cta:"Negozio →", wn_released:"Uscita", wn_ctx_loading:"Passaporto del vino", wn_ctx_ready:"Passaporto del vino", wn_kick:"Vino", wn_facts_label:"Sul vino", wn_vintages_label:"Annate · scendi →", wn_vintages_empty:"Nessuna annata indicata", wn_vintages_empty_sub:"Questo vino non ha ancora annate nel suo passaporto.", wn_nf_kick:"Vino non trovato", wn_nf_title:"Non è stato possibile trovare questo vino.", wn_nf_body:"Il link potrebbe essere errato, oppure il vino non è più presente su Tasting & Toasting.", wn_err_kick:"Qualcosa è andato storto", wn_err_title:"Non siamo riusciti a caricare questo vino.", wn_err_body:"È un problema nostro, non del vino. Riprova.", wn_retry:"Riprova", fact_appellation:"Denominazione", fact_style:"Stile", fact_released:"Uscita",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Passaporto della bottiglia", bp_ctx_ready:"Scansionato · passaporto della bottiglia", bp_crumb_bottle:"Bottiglia n.{n}", bp_st_minted:"Codice emesso", bp_st_claimed:"Assegnata", bp_st_active:"Attiva", bp_st_activated:"Attivata", bp_st_void:"Annullata", bp_scans_n:"{n} scansioni", bp_sec_vintage:"Annata", bp_fact_composition:"Composizione", bp_timeline_label:"Provenienza · il percorso della bottiglia", bp_timeline_empty:"Nessun evento di provenienza registrato", bp_timeline_empty_sub:"Il produttore non ha ancora aggiunto il percorso di questa bottiglia.", bp_link_vintage:"Passaporto dell'annata", bp_buy_title:"Acquista questa bottiglia", bp_tasting_title:"Trova una degustazione nelle vicinanze", bp_tasting_body:"Segnaposto per le degustazioni locali. Non esistono ancora dati sul calendario.", bp_tasting_cta:"Sfoglia →", bp_vd_kick:"Revocata", bp_vd_title:"Questa bottiglia è stata revocata.", bp_vd_body:"Il produttore ha ritirato questo codice, quindi il suo passaporto non viene più mostrato. Per domande sulla bottiglia, contatta direttamente il produttore.", bp_nf_kick:"Bottiglia non trovata", bp_nf_title:"Non abbiamo potuto confermarlo. Questo codice non è nei nostri registri.", bp_nf_body:"Controlla il link o il codice QR e riprova. Se ritieni che sia un errore, contatta direttamente il produttore.", bp_err_kick:"Qualcosa è andato storto", bp_err_title:"Non abbiamo potuto caricare questa scansione.", bp_err_body:"Un problema dalla nostra parte, non della tua bottiglia. Riprova.", bp_retry:"Riprova", wp_explore:"Scopri Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Passaporto della cantina", wp_ctx_ready:"Passaporto della cantina", wp_wines_empty:"Nessun vino presente", wp_wines_empty_sub:"Questa cantina non ha ancora aggiunto vini al suo passaporto.", wp_nf_kick:"Passaporto non trovato", wp_nf_title:"Non è stato possibile trovare questa cantina.", wp_nf_body:"Il link potrebbe essere errato, oppure questa cantina non è più presente su Tasting & Toasting.", wp_err_kick:"Qualcosa è andato storto", wp_err_title:"Non abbiamo potuto caricare questo passaporto.", wp_err_body:"Un problema dalla nostra parte, non della cantina. Riprova.", wp_retry:"Riprova", wy_dash_title:"Pannello del produttore", wy_dash_body:"Segnaposto per il volume di scansioni, la geografia e i segnali di contraffazione. Nulla viene ancora tracciato.", wy_dash_cta:"Apri pannello →"
    },
    de: {
      b_claimed:"Vom Erzeuger angegeben", b_review:"In Prüfung", b_verified:"Verifiziert", b_unverified:"Nicht verifiziert",
      color_red:"Rot", color_white:"Weiß", color_rose:"Rosé", color_orange:"Orange", color_sparkling:"Schaumwein",
      sweet_dry:"Trocken", sweet_semi_dry:"Halbtrocken", sweet_semi_sweet:"Lieblich", sweet_sweet:"Süß",
      nav_winery:"WEINGUT-PASS", nav_wine:"WEIN-PASS", nav_vintage:"JAHRGANGS-PASS",
      loading:"Wird geladen…", nf_winery:"Weingut nicht gefunden.", nf_wine:"Wein nicht gefunden.", nf_vintage:"Jahrgang nicht gefunden.", nf_bottle:"Diese Flasche konnte nicht verifiziert werden.",
      founded:"Gegründet", dna_title:"DNA des Weinguts", family:"Die Familie", land:"Das Land", philosophy:"Philosophie", story:"Ursprung",
      services_title:"Erlebnisse", wines_title:"Weine", contact_title:"Besuch & Kontakt", book:"Verkostung buchen", website:"Website besuchen",
      email:"E-Mail", phone:"Telefon", location:"Ort", first_registered:"Erstes registriertes Weingut Polens",
      svc_degustation:"Verkostung", svc_hotel:"Hotel", svc_restaurant:"Restaurant", svc_spa_winotherapy:"Spa & Weintherapie",
      svc_enotourism:"Önotourismus", svc_weddings_events:"Hochzeiten & Events", svc_gift_sets_shop:"Geschenksets & Shop", svc_business_programs:"Business-Programme",
      overview:"Über diesen Wein", vintages_title:"Jahrgänge", bottles:"Flaschen", back_wines:"Alle Weine", back_wine:"Wein-Pass", back_winery:"Weingut-Pass",
      total_bottles:"Produzierte Flaschen", abv:"Alkohol", year:"Jahrgang", production:"Der Jahrgang", ageing:"Reifepotenzial", ageing_val:"Lagerfähig", overview_vintage:"Dieser Jahrgang",
      verified_h:"Verifiziert &amp; <em>rückverfolgbar</em>", bottle_of:"Flasche {n} von {t}", founder_words:"Worte des Gründers", biography:"Biografie der Flasche",
      winery_section:"Das Weingut", verified_facts:"Verifizierte Fakten", view_winery:"Weingut ansehen", book_tasting:"Verkostung buchen", share:"Diese Flasche teilen", copied:"Link kopiert",
      ev_harvest:"Lese", ev_fermentation:"Gärung", ev_ageing:"Reifung", ev_bottling:"Abfüllung", ev_release:"Markteinführung",
      cap_verified:"CAP verifiziert", scan_story:"Scannen, um die Geschichte zu entdecken", bottle_word:"Flasche",
      wn_un_kick:"Pass wird aktualisiert", wn_un_title:"Die Informationen zu diesem Wein werden gerade aktualisiert.",
      wn_un_body:"Bitte versuchen Sie später, den Pass zu öffnen.",
      wn_un_note:"Wir präzisieren einige Angaben, um Ihnen die aktuellsten Informationen zu bieten. Der Pass ist nach Abschluss der Aktualisierung wieder verfügbar.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Vom Erzeuger angegeben", wn_producer_label:"Erzeuger", wn_by:"von", wn_coming_label:"Demnächst", wn_demo_badge:"Demo", wn_buy_title:"Diesen Wein kaufen", wn_buy_body:"Platzhalter für den Direktkauf — der Shop ist noch nicht angebunden.", wn_shop_cta:"Shop →", wn_released:"Freigabe", wn_ctx_loading:"Weinpass", wn_ctx_ready:"Weinpass", wn_kick:"Wein", wn_facts_label:"Über den Wein", wn_vintages_label:"Jahrgänge · nach unten →", wn_vintages_empty:"Noch keine Jahrgänge", wn_vintages_empty_sub:"Für diesen Wein sind noch keine Jahrgänge im Pass eingetragen.", wn_nf_kick:"Wein nicht gefunden", wn_nf_title:"Dieser Wein konnte nicht gefunden werden.", wn_nf_body:"Der Link ist womöglich fehlerhaft, oder der Wein ist bei Tasting & Toasting nicht mehr gelistet.", wn_err_kick:"Etwas ist schiefgelaufen", wn_err_title:"Wir konnten diesen Wein nicht laden.", wn_err_body:"Das Problem liegt bei uns, nicht am Wein. Bitte versuchen Sie es erneut.", wn_retry:"Erneut versuchen", fact_appellation:"Appellation", fact_style:"Stil", fact_released:"Freigabe",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Flaschen-Pass", bp_ctx_ready:"Gescannt · Flaschen-Pass", bp_crumb_bottle:"Flasche Nr.{n}", bp_st_minted:"Code ausgegeben", bp_st_claimed:"Zugeordnet", bp_st_active:"Aktiv", bp_st_activated:"Aktiviert", bp_st_void:"Ungültig", bp_scans_n:"{n} Scans", bp_sec_vintage:"Jahrgang", bp_fact_composition:"Zusammensetzung", bp_timeline_label:"Herkunft · der Weg dieser Flasche", bp_timeline_empty:"Noch keine Herkunftsereignisse erfasst", bp_timeline_empty_sub:"Der Erzeuger hat den Weg dieser Flasche noch nicht hinzugefügt.", bp_link_vintage:"Jahrgangs-Pass", bp_buy_title:"Diese Flasche kaufen", bp_tasting_title:"Verkostung in der Nähe finden", bp_tasting_body:"Platzhalter für Verkostungen in der Nähe. Es gibt noch keine Termindaten.", bp_tasting_cta:"Durchsuchen →", bp_vd_kick:"Widerrufen", bp_vd_title:"Diese Flasche wurde widerrufen.", bp_vd_body:"Der Erzeuger hat diesen Code zurückgezogen, daher wird der Pass nicht mehr angezeigt. Bei Fragen zur Flasche wenden Sie sich direkt an den Erzeuger.", bp_nf_kick:"Flasche nicht gefunden", bp_nf_title:"Wir konnten das nicht bestätigen. Dieser Code ist nicht in unseren Aufzeichnungen.", bp_nf_body:"Prüfen Sie den Link oder QR-Code und versuchen Sie es erneut. Wenn Sie glauben, dass dies ein Fehler ist, wenden Sie sich direkt an den Erzeuger.", bp_err_kick:"Etwas ist schiefgelaufen", bp_err_title:"Wir konnten diesen Scan nicht laden.", bp_err_body:"Ein Problem auf unserer Seite, nicht mit Ihrer Flasche. Bitte versuchen Sie es erneut.", bp_retry:"Erneut versuchen", wp_explore:"Tasting & Toasting entdecken",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Weingut-Pass", wp_ctx_ready:"Weingut-Pass", wp_wines_empty:"Noch keine Weine eingetragen", wp_wines_empty_sub:"Dieses Weingut hat noch keine Weine in seinen Pass eingetragen.", wp_nf_kick:"Pass nicht gefunden", wp_nf_title:"Dieses Weingut konnte nicht gefunden werden.", wp_nf_body:"Der Link ist möglicherweise falsch, oder dieses Weingut ist bei Tasting & Toasting nicht mehr aufgeführt.", wp_err_kick:"Etwas ist schiefgelaufen", wp_err_title:"Wir konnten diesen Pass nicht laden.", wp_err_body:"Ein Problem auf unserer Seite, nicht beim Weingut. Bitte versuchen Sie es erneut.", wp_retry:"Erneut versuchen", wy_dash_title:"Erzeuger-Dashboard", wy_dash_body:"Platzhalter für Scan-Volumen, Geografie und Fälschungssignale. Es wird noch nichts erfasst.", wy_dash_cta:"Dashboard öffnen →"
    },
    he: {
      b_claimed:"הוצהר על ידי היצרן", b_review:"בבדיקה", b_verified:"מאומת", b_unverified:"לא מאומת",
      color_red:"אדום", color_white:"לבן", color_rose:"רוזה", color_orange:"כתום", color_sparkling:"מבעבע",
      sweet_dry:"יבש", sweet_semi_dry:"חצי יבש", sweet_semi_sweet:"חצי מתוק", sweet_sweet:"מתוק",
      nav_winery:"דרכון היקב", nav_wine:"דרכון היין", nav_vintage:"דרכון הבציר",
      loading:"טוען…", nf_winery:"היקב לא נמצא.", nf_wine:"היין לא נמצא.", nf_vintage:"הבציר לא נמצא.", nf_bottle:"לא ניתן היה לאמת את הבקבוק הזה.",
      founded:"נוסד בשנת", dna_title:"הדנ\"א של היקב", family:"המשפחה", land:"האדמה", philosophy:"פילוסופיה", story:"מקור",
      services_title:"חוויות", wines_title:"יינות", contact_title:"ביקור ויצירת קשר", book:"הזמנת טעימה", website:"לאתר",
      email:"דוא\"ל", phone:"טלפון", location:"מיקום", first_registered:"הכרם הרשום הראשון בפולין",
      svc_degustation:"טעימה", svc_hotel:"מלון", svc_restaurant:"מסעדה", svc_spa_winotherapy:"ספא וטיפולי יין",
      svc_enotourism:"תיירות יין", svc_weddings_events:"חתונות ואירועים", svc_gift_sets_shop:"מארזי מתנה וחנות", svc_business_programs:"תוכניות עסקיות",
      overview:"על היין הזה", vintages_title:"בצירים", bottles:"בקבוקים", back_wines:"כל היינות", back_wine:"דרכון היין", back_winery:"דרכון היקב",
      total_bottles:"בקבוקים שיוצרו", abv:"אלכוהול", year:"שנת בציר", production:"הבציר", ageing:"פוטנציאל התיישנות", ageing_val:"מתאים להתיישנות", overview_vintage:"הבציר הזה",
      verified_h:"מאומת <em>וניתן למעקב</em>", bottle_of:"בקבוק {n} מתוך {t}", founder_words:"דברי המייסד", biography:"הביוגרפיה של הבקבוק",
      winery_section:"היקב", verified_facts:"עובדות מאומתות", view_winery:"צפייה ביקב", book_tasting:"הזמנת טעימה", share:"שיתוף הבקבוק", copied:"הקישור הועתק",
      ev_harvest:"בציר", ev_fermentation:"תסיסה", ev_ageing:"התיישנות", ev_bottling:"מילוי בבקבוקים", ev_release:"שחרור לשוק",
      cap_verified:"CAP מאומת", scan_story:"סרקו כדי לגלות את הסיפור", bottle_word:"בקבוק",
      wn_un_kick:"הדרכון בעדכון", wn_un_title:"המידע על היין הזה מתעדכן כרגע.",
      wn_un_body:"אנא נסו לפתוח את הדרכון מאוחר יותר.",
      wn_un_note:"אנו מדייקים כמה פרטים כדי להציג לכם את המידע המעודכן ביותר. הדרכון יהיה זמין שוב בתום העדכון.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"נמסר על ידי היצרן", wn_producer_label:"יצרן", wn_by:"מאת", wn_coming_label:"בקרוב", wn_demo_badge:"דמו", wn_buy_title:"לרכוש יין זה", wn_buy_body:"מקום לרכישה ישירה — החנות עדיין אינה מחוברת.", wn_shop_cta:"לחנות →", wn_released:"שוחרר", wn_ctx_loading:"דרכון היין", wn_ctx_ready:"דרכון היין", wn_kick:"יין", wn_facts_label:"על היין", wn_vintages_label:"בצירים · גללו למטה →", wn_vintages_empty:"אין עדיין בצירים", wn_vintages_empty_sub:"ליין זה אין עדיין בצירים בדרכון.", wn_nf_kick:"היין לא נמצא", wn_nf_title:"לא הצלחנו למצוא יין זה.", wn_nf_body:"ייתכן שהקישור שגוי, או שהיין אינו מופיע עוד ב-Tasting & Toasting.", wn_err_kick:"משהו השתבש", wn_err_title:"לא הצלחנו לטעון יין זה.", wn_err_body:"התקלה אצלנו, לא ביין. נסו שוב.", wn_retry:"נסו שוב", fact_appellation:"אפלסיון", fact_style:"סגנון", fact_released:"שוחרר",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"דרכון הבקבוק", bp_ctx_ready:"נסרק · דרכון הבקבוק", bp_crumb_bottle:"בקבוק מס׳{n}", bp_st_minted:"הקוד הונפק", bp_st_claimed:"שויכה", bp_st_active:"פעיל", bp_st_activated:"הופעל", bp_st_void:"בוטל", bp_scans_n:"{n} סריקות", bp_sec_vintage:"בציר", bp_fact_composition:"הרכב", bp_timeline_label:"מקור · מסלול הבקבוק", bp_timeline_empty:"לא נרשמו עדיין אירועי מקור", bp_timeline_empty_sub:"היצרן עדיין לא הוסיף את מסלול הבקבוק.", bp_link_vintage:"דרכון הבציר", bp_buy_title:"לקנות את הבקבוק הזה", bp_tasting_title:"למצוא טעימה בקרבת מקום", bp_tasting_body:"מקום שמור לטעימות מקומיות. אין עדיין נתוני לוח זמנים.", bp_tasting_cta:"לעיון →", bp_vd_kick:"בוטל", bp_vd_title:"הבקבוק הזה בוטל.", bp_vd_body:"היצרן ביטל את הקוד הזה, ולכן הדרכון אינו מוצג יותר. אם יש לך שאלות על הבקבוק, פנה ישירות ליצרן.", bp_nf_kick:"הבקבוק לא נמצא", bp_nf_title:"לא הצלחנו לאמת את זה. הקוד הזה אינו ברשומות שלנו.", bp_nf_body:"בדוק את הקישור או קוד ה-QR ונסה שוב. אם לדעתך זו טעות, פנה ישירות ליצרן.", bp_err_kick:"משהו השתבש", bp_err_title:"לא הצלחנו לטעון את הסריקה.", bp_err_body:"תקלה אצלנו, לא בבקבוק שלך. נסה שוב.", bp_retry:"לנסות שוב", wp_explore:"לגלות את Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"דרכון היקב", wp_ctx_ready:"דרכון היקב", wp_wines_empty:"עדיין לא נוספו יינות", wp_wines_empty_sub:"היקב הזה עדיין לא הוסיף יינות לדרכון שלו.", wp_nf_kick:"הדרכון לא נמצא", wp_nf_title:"לא הצלחנו למצוא את היקב הזה.", wp_nf_body:"ייתכן שהקישור שגוי, או שהיקב הזה אינו מופיע יותר ב-Tasting & Toasting.", wp_err_kick:"משהו השתבש", wp_err_title:"לא הצלחנו לטעון את הדרכון.", wp_err_body:"תקלה אצלנו, לא ביקב. נסה שוב.", wp_retry:"לנסות שוב", wy_dash_title:"לוח הבקרה של היצרן", wy_dash_body:"מקום שמור לנפח סריקות, גאוגרפיה וסימני זיוף. שום דבר לא נמדד עדיין.", wy_dash_cta:"לפתוח את לוח הבקרה →"
    },
    pt: {
      b_claimed:"Declarado pelo produtor", b_review:"Em verificação", b_verified:"Verificado", b_unverified:"Não verificado",
      color_red:"Tinto", color_white:"Branco", color_rose:"Rosé", color_orange:"Laranja", color_sparkling:"Espumante",
      sweet_dry:"Seco", sweet_semi_dry:"Meio-seco", sweet_semi_sweet:"Meio-doce", sweet_sweet:"Doce",
      nav_winery:"PASSAPORTE DA QUINTA", nav_wine:"PASSAPORTE DO VINHO", nav_vintage:"PASSAPORTE DA COLHEITA",
      loading:"A carregar…", nf_winery:"Quinta não encontrada.", nf_wine:"Vinho não encontrado.", nf_vintage:"Colheita não encontrada.", nf_bottle:"Não foi possível verificar esta garrafa.",
      founded:"Fundada em", dna_title:"ADN da quinta", family:"A família", land:"A terra", philosophy:"Filosofia", story:"Origem",
      services_title:"Experiências", wines_title:"Vinhos", contact_title:"Visita e contacto", book:"Reservar uma prova", website:"Visitar o site",
      email:"E-mail", phone:"Telefone", location:"Localização", first_registered:"Primeira vinha registada da Polónia",
      svc_degustation:"Prova", svc_hotel:"Hotel", svc_restaurant:"Restaurante", svc_spa_winotherapy:"Spa e vinoterapia",
      svc_enotourism:"Enoturismo", svc_weddings_events:"Casamentos e eventos", svc_gift_sets_shop:"Conjuntos de oferta e loja", svc_business_programs:"Programas empresariais",
      overview:"Sobre este vinho", vintages_title:"Colheitas", bottles:"garrafas", back_wines:"Todos os vinhos", back_wine:"Passaporte do vinho", back_winery:"Passaporte da quinta",
      total_bottles:"Garrafas produzidas", abv:"Álcool", year:"Colheita", production:"A colheita", ageing:"Potencial de guarda", ageing_val:"Próprio para guarda", overview_vintage:"Esta colheita",
      verified_h:"Verificado e <em>rastreável</em>", bottle_of:"Garrafa {n} de {t}", founder_words:"As palavras do fundador", biography:"Biografia da garrafa",
      winery_section:"A quinta", verified_facts:"Factos verificados", view_winery:"Ver a quinta", book_tasting:"Reservar uma prova", share:"Partilhar esta garrafa", copied:"Ligação copiada",
      ev_harvest:"Vindima", ev_fermentation:"Fermentação", ev_ageing:"Estágio", ev_bottling:"Engarrafamento", ev_release:"Lançamento",
      cap_verified:"CAP verificado", scan_story:"Digitalize para descobrir a história", bottle_word:"Garrafa",
      wn_un_kick:"Atualização do passaporte em curso", wn_un_title:"As informações sobre este vinho estão a ser atualizadas.",
      wn_un_body:"Por favor, tente abrir o passaporte mais tarde.",
      wn_un_note:"Estamos a precisar alguns dados para lhe apresentar a informação mais atual. O passaporte ficará novamente disponível após a conclusão da atualização.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Declarado pelo produtor", wn_producer_label:"Produtor", wn_by:"por", wn_coming_label:"Em breve", wn_demo_badge:"Demo", wn_buy_title:"Comprar este vinho", wn_buy_body:"Espaço para a compra direta — a loja ainda não está ligada.", wn_shop_cta:"Loja →", wn_released:"Lançamento", wn_ctx_loading:"Passaporte do vinho", wn_ctx_ready:"Passaporte do vinho", wn_kick:"Vinho", wn_facts_label:"Sobre o vinho", wn_vintages_label:"Colheitas · desça →", wn_vintages_empty:"Ainda sem colheitas", wn_vintages_empty_sub:"Este vinho ainda não tem colheitas no passaporte.", wn_nf_kick:"Vinho não encontrado", wn_nf_title:"Não foi possível encontrar este vinho.", wn_nf_body:"A ligação pode estar errada, ou o vinho já não consta na Tasting & Toasting.", wn_err_kick:"Algo correu mal", wn_err_title:"Não conseguimos carregar este vinho.", wn_err_body:"O problema é nosso, não do vinho. Tente novamente.", wn_retry:"Tentar novamente", fact_appellation:"Denominação", fact_style:"Estilo", fact_released:"Lançamento",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Passaporte da garrafa", bp_ctx_ready:"Lido · passaporte da garrafa", bp_crumb_bottle:"Garrafa n.º{n}", bp_st_minted:"Código emitido", bp_st_claimed:"Atribuída", bp_st_active:"Ativa", bp_st_activated:"Ativada", bp_st_void:"Anulada", bp_scans_n:"{n} leituras", bp_sec_vintage:"Colheita", bp_fact_composition:"Composição", bp_timeline_label:"Proveniência · o percurso da garrafa", bp_timeline_empty:"Ainda não há eventos de proveniência", bp_timeline_empty_sub:"O produtor ainda não adicionou o percurso desta garrafa.", bp_link_vintage:"Passaporte da colheita", bp_buy_title:"Comprar esta garrafa", bp_tasting_title:"Encontrar uma degustação por perto", bp_tasting_body:"Espaço reservado para degustações locais. Ainda não existem dados de agenda.", bp_tasting_cta:"Explorar →", bp_vd_kick:"Revogada", bp_vd_title:"Esta garrafa foi revogada.", bp_vd_body:"O produtor retirou este código, pelo que o passaporte já não é mostrado. Se tiver dúvidas sobre a garrafa, contacte diretamente o produtor.", bp_nf_kick:"Garrafa não encontrada", bp_nf_title:"Não conseguimos confirmar. Este código não está nos nossos registos.", bp_nf_body:"Verifique o link ou o código QR e tente novamente. Se achar que é um erro, contacte diretamente o produtor.", bp_err_kick:"Algo falhou", bp_err_title:"Não conseguimos carregar esta leitura.", bp_err_body:"Um problema do nosso lado, não com a sua garrafa. Tente novamente.", bp_retry:"Tentar novamente", wp_explore:"Descobrir Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Passaporte da quinta", wp_ctx_ready:"Passaporte da quinta", wp_wines_empty:"Ainda não há vinhos", wp_wines_empty_sub:"Esta quinta ainda não adicionou vinhos ao seu passaporte.", wp_nf_kick:"Passaporte não encontrado", wp_nf_title:"Não foi possível encontrar esta quinta.", wp_nf_body:"O link pode estar incorreto, ou esta quinta já não consta na Tasting & Toasting.", wp_err_kick:"Algo falhou", wp_err_title:"Não conseguimos carregar este passaporte.", wp_err_body:"Um problema do nosso lado, não com a quinta. Tente novamente.", wp_retry:"Tentar novamente", wy_dash_title:"Painel do produtor", wy_dash_body:"Espaço reservado para o volume de leituras, a geografia e sinais de contrafação. Ainda não é registado nada.", wy_dash_cta:"Abrir painel →"
    },
    ka: {
      b_claimed:"მწარმოებლის მიერ მითითებული", b_review:"შემოწმების პროცესში", b_verified:"დადასტურებული", b_unverified:"დაუდასტურებელი",
      color_red:"წითელი", color_white:"თეთრი", color_rose:"ვარდისფერი", color_orange:"ქარვისფერი", color_sparkling:"ცქრიალა",
      sweet_dry:"მშრალი", sweet_semi_dry:"ნახევრად მშრალი", sweet_semi_sweet:"ნახევრად ტკბილი", sweet_sweet:"ტკბილი",
      nav_winery:"მარნის პასპორტი", nav_wine:"ღვინის პასპორტი", nav_vintage:"მოსავლის პასპორტი",
      loading:"იტვირთება…", nf_winery:"მარანი ვერ მოიძებნა.", nf_wine:"ღვინო ვერ მოიძებნა.", nf_vintage:"მოსავალი ვერ მოიძებნა.", nf_bottle:"ამ ბოთლის დადასტურება ვერ მოხერხდა.",
      founded:"დაარსდა", dna_title:"მარნის დნმ", family:"ოჯახი", land:"მიწა", philosophy:"ფილოსოფია", story:"წარმოშობა",
      services_title:"შთაბეჭდილებები", wines_title:"ღვინოები", contact_title:"ვიზიტი და კონტაქტი", book:"დააჯავშნე დეგუსტაცია", website:"ვებგვერდზე გადასვლა",
      email:"ელ. ფოსტა", phone:"ტელეფონი", location:"მდებარეობა", first_registered:"პოლონეთის პირველი რეგისტრირებული ვენახი",
      svc_degustation:"დეგუსტაცია", svc_hotel:"სასტუმრო", svc_restaurant:"რესტორანი", svc_spa_winotherapy:"სპა და ვინოთერაპია",
      svc_enotourism:"ენოტურიზმი", svc_weddings_events:"ქორწილები და ღონისძიებები", svc_gift_sets_shop:"სასაჩუქრე ნაკრები და მაღაზია", svc_business_programs:"ბიზნესპროგრამები",
      overview:"ამ ღვინის შესახებ", vintages_title:"მოსავლები", bottles:"ბოთლი", back_wines:"ყველა ღვინო", back_wine:"ღვინის პასპორტი", back_winery:"მარნის პასპორტი",
      total_bottles:"წარმოებული ბოთლები", abv:"ალკოჰოლი", year:"მოსავლის წელი", production:"მოსავალი", ageing:"დავარგების პოტენციალი", ageing_val:"დასავარგებლად ვარგისი", overview_vintage:"ეს მოსავალი",
      verified_h:"დადასტურებული და <em>თვალყურდევნებადი</em>", bottle_of:"ბოთლი {n} / {t}", founder_words:"დამფუძნებლის სიტყვები", biography:"ბოთლის ბიოგრაფია",
      winery_section:"მარანი", verified_facts:"დადასტურებული ფაქტები", view_winery:"მარნის ნახვა", book_tasting:"დააჯავშნე დეგუსტაცია", share:"ბოთლის გაზიარება", copied:"ბმული დაკოპირდა",
      ev_harvest:"რთველი", ev_fermentation:"დუღილი", ev_ageing:"დავარგება", ev_bottling:"ჩამოსხმა", ev_release:"გამოშვება",
      cap_verified:"CAP დადასტურებული", scan_story:"დაასკანერე ისტორიის აღმოსაჩენად", bottle_word:"ბოთლი",
      wn_un_kick:"პასპორტი განახლდება", wn_un_title:"ამ ღვინის შესახებ ინფორმაცია დროებით განახლდება.",
      wn_un_body:"გთხოვთ, სცადოთ პასპორტის გახსნა მოგვიანებით.",
      wn_un_note:"ჩვენ ვაზუსტებთ ზოგიერთ დეტალს, რომ მოგაწოდოთ ყველაზე ზუსტი ინფორმაცია. პასპორტი ხელახლა ხელმისაწვდომი გახდება განახლების დასრულების შემდეგ.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"მითითებულია მწარმოებლის მიერ", wn_producer_label:"მწარმოებელი", wn_by:"მწარმოებელი:", wn_coming_label:"მალე", wn_demo_badge:"დემო", wn_buy_title:"ამ ღვინის შეძენა", wn_buy_body:"ადგილი პირდაპირი შესყიდვისთვის — მაღაზია ჯერ არ არის დაკავშირებული.", wn_shop_cta:"მაღაზია →", wn_released:"გამოშვება", wn_ctx_loading:"ღვინის პასპორტი", wn_ctx_ready:"ღვინის პასპორტი", wn_kick:"ღვინო", wn_facts_label:"ღვინის შესახებ", wn_vintages_label:"მოსავლები · ჩამოდით →", wn_vintages_empty:"მოსავლები ჯერ არ არის მითითებული", wn_vintages_empty_sub:"ამ ღვინის პასპორტში ჯერ არ არის მოსავლები.", wn_nf_kick:"ღვინო ვერ მოიძებნა", wn_nf_title:"ამ ღვინის პოვნა ვერ მოხერხდა.", wn_nf_body:"შესაძლოა ბმული არასწორია, ან ღვინო აღარ არის Tasting & Toasting-ზე.", wn_err_kick:"რაღაც ვერ გამოვიდა", wn_err_title:"ამ ღვინის ჩატვირთვა ვერ მოხერხდა.", wn_err_body:"ხარვეზი ჩვენს მხარესაა, არა ღვინოში. გთხოვთ, სცადოთ კვლავ.", wn_retry:"ხელახლა ცდა", fact_appellation:"აპელასიონი", fact_style:"სტილი", fact_released:"გამოშვება",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"ბოთლის პასპორტი", bp_ctx_ready:"დასკანერებულია · ბოთლის პასპორტი", bp_crumb_bottle:"ბოთლი №{n}", bp_st_minted:"კოდი გამოშვებულია", bp_st_claimed:"მიბმულია", bp_st_active:"აქტიური", bp_st_activated:"აქტივირებული", bp_st_void:"გაუქმებული", bp_scans_n:"სკანირება: {n}", bp_sec_vintage:"მოსავალი", bp_fact_composition:"შემადგენლობა", bp_timeline_label:"წარმომავლობა · ბოთლის გზა", bp_timeline_empty:"წარმომავლობის მოვლენები ჯერ არ არის ჩაწერილი", bp_timeline_empty_sub:"მწარმოებელს ჯერ არ დაუმატებია ამ ბოთლის გზა.", bp_link_vintage:"მოსავლის პასპორტი", bp_buy_title:"ამ ბოთლის შეძენა", bp_tasting_title:"ახლომდებარე დეგუსტაციის მოძიება", bp_tasting_body:"ადგილობრივი დეგუსტაციების ადგილი. განრიგის მონაცემები ჯერ არ არსებობს.", bp_tasting_cta:"დათვალიერება →", bp_vd_kick:"გაუქმებულია", bp_vd_title:"ეს ბოთლი გაუქმებულია.", bp_vd_body:"მწარმოებელმა გააუქმა ეს კოდი, ამიტომ პასპორტი აღარ ჩანს. თუ ბოთლის შესახებ კითხვები გაქვთ, დაუკავშირდით მწარმოებელს პირდაპირ.", bp_nf_kick:"ბოთლი ვერ მოიძებნა", bp_nf_title:"ვერ დავადასტურეთ. ეს კოდი არ არის ჩვენს ჩანაწერებში.", bp_nf_body:"შეამოწმეთ ბმული ან QR-კოდი და სცადეთ ხელახლა. თუ ფიქრობთ, რომ ეს შეცდომაა, დაუკავშირდით მწარმოებელს პირდაპირ.", bp_err_kick:"რაღაც ვერ გამოვიდა", bp_err_title:"ამ სკანირების ჩატვირთვა ვერ მოხერხდა.", bp_err_body:"პრობლემა ჩვენს მხარესაა და არა თქვენს ბოთლში. სცადეთ ხელახლა.", bp_retry:"ხელახლა ცდა", wp_explore:"Tasting & Toasting-ის აღმოჩენა",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"მარნის პასპორტი", wp_ctx_ready:"მარნის პასპორტი", wp_wines_empty:"ღვინოები ჯერ არ არის დამატებული", wp_wines_empty_sub:"ამ მარანს ჯერ არ დაუმატებია ღვინოები პასპორტში.", wp_nf_kick:"პასპორტი ვერ მოიძებნა", wp_nf_title:"ეს მარანი ვერ მოიძებნა.", wp_nf_body:"შესაძლოა ბმული შეცდომითაა შეყვანილი, ან ეს მარანი აღარ არის Tasting & Toasting-ზე.", wp_err_kick:"რაღაც ვერ გამოვიდა", wp_err_title:"ამ პასპორტის ჩატვირთვა ვერ მოხერხდა.", wp_err_body:"პრობლემა ჩვენს მხარესაა და არა მარანში. სცადეთ ხელახლა.", wp_retry:"ხელახლა ცდა", wy_dash_title:"მწარმოებლის პანელი", wy_dash_body:"ადგილი სკანირებების რაოდენობის, გეოგრაფიისა და ფალსიფიკაციის სიგნალებისთვის. ჯერ არაფერი აღირიცხება.", wy_dash_cta:"პანელის გახსნა →"
    },
    ro: {
      b_claimed:"Declarat de producător", b_review:"În verificare", b_verified:"Verificat", b_unverified:"Neverificat",
      color_red:"Roșu", color_white:"Alb", color_rose:"Rosé", color_orange:"Portocaliu", color_sparkling:"Spumant",
      sweet_dry:"Sec", sweet_semi_dry:"Demisec", sweet_semi_sweet:"Demidulce", sweet_sweet:"Dulce",
      nav_winery:"PAȘAPORTUL CRAMEI", nav_wine:"PAȘAPORTUL VINULUI", nav_vintage:"PAȘAPORTUL RECOLTEI",
      loading:"Se încarcă…", nf_winery:"Crama nu a fost găsită.", nf_wine:"Vinul nu a fost găsit.", nf_vintage:"Recolta nu a fost găsită.", nf_bottle:"Această sticlă nu a putut fi verificată.",
      founded:"Fondată în", dna_title:"ADN-ul cramei", family:"Familia", land:"Pământul", philosophy:"Filozofie", story:"Origine",
      services_title:"Experiențe", wines_title:"Vinuri", contact_title:"Vizită și contact", book:"Rezervă o degustare", website:"Vizitează site-ul",
      email:"E-mail", phone:"Telefon", location:"Locație", first_registered:"Prima vie înregistrată din Polonia",
      svc_degustation:"Degustare", svc_hotel:"Hotel", svc_restaurant:"Restaurant", svc_spa_winotherapy:"Spa și vinoterapie",
      svc_enotourism:"Enoturism", svc_weddings_events:"Nunți și evenimente", svc_gift_sets_shop:"Seturi cadou și magazin", svc_business_programs:"Programe pentru companii",
      overview:"Despre acest vin", vintages_title:"Recolte", bottles:"sticle", back_wines:"Toate vinurile", back_wine:"Pașaportul vinului", back_winery:"Pașaportul cramei",
      total_bottles:"Sticle produse", abv:"Alcool", year:"Recolta", production:"Recolta", ageing:"Potențial de învechire", ageing_val:"Potrivit pentru învechire", overview_vintage:"Această recoltă",
      verified_h:"Verificat și <em>trasabil</em>", bottle_of:"Sticla {n} din {t}", founder_words:"Cuvintele fondatorului", biography:"Biografia sticlei",
      winery_section:"Crama", verified_facts:"Fapte verificate", view_winery:"Vezi crama", book_tasting:"Rezervă o degustare", share:"Distribuie această sticlă", copied:"Link copiat",
      ev_harvest:"Cules", ev_fermentation:"Fermentare", ev_ageing:"Învechire", ev_bottling:"Îmbuteliere", ev_release:"Lansare",
      cap_verified:"CAP verificat", scan_story:"Scanează pentru a descoperi povestea", bottle_word:"Sticlă",
      wn_un_kick:"Pașaportul se actualizează", wn_un_title:"Informațiile despre acest vin sunt în curs de actualizare.",
      wn_un_body:"Vă rugăm să încercați să deschideți pașaportul mai târziu.",
      wn_un_note:"Precizăm unele detalii pentru a vă oferi cele mai actuale informații. Pașaportul va fi din nou disponibil după finalizarea actualizării.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Declarat de producător", wn_producer_label:"Producător", wn_by:"de", wn_coming_label:"În curând", wn_demo_badge:"Demo", wn_buy_title:"Cumpără acest vin", wn_buy_body:"Spațiu pentru achiziția directă — magazinul nu este încă conectat.", wn_shop_cta:"Magazin →", wn_released:"Lansare", wn_ctx_loading:"Pașaportul vinului", wn_ctx_ready:"Pașaportul vinului", wn_kick:"Vin", wn_facts_label:"Despre vin", wn_vintages_label:"Recolte · coborâți →", wn_vintages_empty:"Încă nu sunt recolte", wn_vintages_empty_sub:"Acest vin nu are încă recolte în pașaport.", wn_nf_kick:"Vinul nu a fost găsit", wn_nf_title:"Nu am putut găsi acest vin.", wn_nf_body:"Linkul poate fi greșit sau vinul nu mai este listat pe Tasting & Toasting.", wn_err_kick:"Ceva nu a mers bine", wn_err_title:"Nu am putut încărca acest vin.", wn_err_body:"Problema este la noi, nu la vin. Încercați din nou.", wn_retry:"Încercați din nou", fact_appellation:"Denumire de origine", fact_style:"Stil", fact_released:"Lansare",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Pașaportul sticlei", bp_ctx_ready:"Scanat · pașaportul sticlei", bp_crumb_bottle:"Sticla nr.{n}", bp_st_minted:"Cod emis", bp_st_claimed:"Atribuită", bp_st_active:"Activă", bp_st_activated:"Activată", bp_st_void:"Anulată", bp_scans_n:"{n} scanări", bp_sec_vintage:"Recoltă", bp_fact_composition:"Compoziție", bp_timeline_label:"Proveniență · drumul sticlei", bp_timeline_empty:"Încă nu există evenimente de proveniență", bp_timeline_empty_sub:"Producătorul nu a adăugat încă drumul acestei sticle.", bp_link_vintage:"Pașaportul recoltei", bp_buy_title:"Cumpără această sticlă", bp_tasting_title:"Găsește o degustare în apropiere", bp_tasting_body:"Spațiu rezervat pentru degustări locale. Încă nu există date de program.", bp_tasting_cta:"Răsfoiește →", bp_vd_kick:"Revocată", bp_vd_title:"Această sticlă a fost revocată.", bp_vd_body:"Producătorul a retras acest cod, așa că pașaportul nu mai este afișat. Dacă aveți întrebări despre sticlă, contactați direct producătorul.", bp_nf_kick:"Sticlă negăsită", bp_nf_title:"Nu am putut confirma. Acest cod nu se află în registrele noastre.", bp_nf_body:"Verificați linkul sau codul QR și încercați din nou. Dacă credeți că este o eroare, contactați direct producătorul.", bp_err_kick:"Ceva nu a funcționat", bp_err_title:"Nu am putut încărca această scanare.", bp_err_body:"O problemă de partea noastră, nu cu sticla dumneavoastră. Încercați din nou.", bp_retry:"Încearcă din nou", wp_explore:"Descoperă Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Pașaportul cramei", wp_ctx_ready:"Pașaportul cramei", wp_wines_empty:"Încă nu există vinuri", wp_wines_empty_sub:"Această cramă nu a adăugat încă vinuri în pașaportul său.", wp_nf_kick:"Pașaport negăsit", wp_nf_title:"Această cramă nu a putut fi găsită.", wp_nf_body:"Linkul poate fi greșit sau această cramă nu mai este listată pe Tasting & Toasting.", wp_err_kick:"Ceva nu a funcționat", wp_err_title:"Nu am putut încărca acest pașaport.", wp_err_body:"O problemă de partea noastră, nu cu crama. Încercați din nou.", wp_retry:"Încearcă din nou", wy_dash_title:"Panoul producătorului", wy_dash_body:"Spațiu rezervat pentru numărul de scanări, geografie și semnale de contrafacere. Încă nu se urmărește nimic.", wy_dash_cta:"Deschide panoul →"
    },
    pl: {
      b_claimed:"Deklarowane przez producenta", b_review:"W weryfikacji", b_verified:"Zweryfikowane", b_unverified:"Niezweryfikowane",
      color_red:"Czerwone", color_white:"Białe", color_rose:"Różowe", color_orange:"Pomarańczowe", color_sparkling:"Musujące",
      sweet_dry:"Wytrawne", sweet_semi_dry:"Półwytrawne", sweet_semi_sweet:"Półsłodkie", sweet_sweet:"Słodkie",
      nav_winery:"PASZPORT WINNICY", nav_wine:"PASZPORT WINA", nav_vintage:"PASZPORT ROCZNIKA",
      loading:"Wczytywanie…", nf_winery:"Nie znaleziono winnicy.", nf_wine:"Nie znaleziono wina.", nf_vintage:"Nie znaleziono rocznika.", nf_bottle:"Nie udało się zweryfikować tej butelki.",
      founded:"Założono", dna_title:"DNA winnicy", family:"Rodzina", land:"Ziemia", philosophy:"Filozofia", story:"Początek",
      services_title:"Doświadczenia", wines_title:"Wina", contact_title:"Odwiedziny i kontakt", book:"Zarezerwuj degustację", website:"Odwiedź stronę",
      email:"E-mail", phone:"Telefon", location:"Lokalizacja", first_registered:"Pierwsza zarejestrowana winnica w Polsce",
      svc_degustation:"Degustacja", svc_hotel:"Hotel", svc_restaurant:"Restauracja", svc_spa_winotherapy:"Spa i winoterapia",
      svc_enotourism:"Enoturystyka", svc_weddings_events:"Wesela i wydarzenia", svc_gift_sets_shop:"Zestawy prezentowe i sklep", svc_business_programs:"Programy biznesowe",
      overview:"O tym winie", vintages_title:"Roczniki", bottles:"butelek", back_wines:"Wszystkie wina", back_wine:"Paszport wina", back_winery:"Paszport winnicy",
      total_bottles:"Wyprodukowane butelki", abv:"Zawartość alkoholu", year:"Rocznik", production:"Rocznik", ageing:"Potencjał dojrzewania", ageing_val:"Do leżakowania", overview_vintage:"Ten rocznik",
      verified_h:"Zweryfikowane i <em>identyfikowalne</em>", bottle_of:"Butelka {n} z {t}", founder_words:"Słowa założyciela", biography:"Historia butelki",
      winery_section:"Winnica", verified_facts:"Zweryfikowane fakty", view_winery:"Zobacz winnicę", book_tasting:"Zarezerwuj degustację", share:"Udostępnij", copied:"Skopiowano link",
      ev_harvest:"Zbiory", ev_fermentation:"Fermentacja", ev_ageing:"Dojrzewanie", ev_bottling:"Butelkowanie", ev_release:"Wprowadzenie na rynek",
      cap_verified:"CAP ZWERYFIKOWANO", scan_story:"Zeskanuj, aby poznać historię", bottle_word:"Butelka",
      wn_un_kick:"Paszport jest aktualizowany", wn_un_title:"Informacje o tym winie są właśnie aktualizowane.",
      wn_un_body:"Prosimy spróbować otworzyć paszport później.",
      wn_un_note:"Uzupełniamy niektóre dane, aby przedstawić Państwu najbardziej aktualne informacje. Paszport będzie znów dostępny po zakończeniu aktualizacji.",
      /* WINE-PASSPORT-CANON-01 */
      pa_label:"Zadeklarowane przez producenta", wn_producer_label:"Producent", wn_by:"od", wn_coming_label:"Wkrótce", wn_demo_badge:"Demo", wn_buy_title:"Kup to wino", wn_buy_body:"Miejsce na zakup bezpośredni — sklep nie jest jeszcze podłączony.", wn_shop_cta:"Sklep →", wn_released:"Premiera", wn_ctx_loading:"Paszport wina", wn_ctx_ready:"Paszport wina", wn_kick:"Wino", wn_facts_label:"O winie", wn_vintages_label:"Roczniki · przewiń w dół →", wn_vintages_empty:"Brak roczników", wn_vintages_empty_sub:"To wino nie ma jeszcze roczników w paszporcie.", wn_nf_kick:"Nie znaleziono wina", wn_nf_title:"Nie udało się znaleźć tego wina.", wn_nf_body:"Link może być błędny albo wino nie jest już dostępne w Tasting & Toasting.", wn_err_kick:"Coś poszło nie tak", wn_err_title:"Nie udało się wczytać tego wina.", wn_err_body:"Problem jest po naszej stronie, nie po stronie wina. Spróbuj ponownie.", wn_retry:"Spróbuj ponownie", fact_appellation:"Apelacja", fact_style:"Styl", fact_released:"Premiera",
      /* CAP-PASSPORT-FAMILY-CANON-01 · bottle */
      bp_ctx_loading:"Paszport butelki", bp_ctx_ready:"Zeskanowano · paszport butelki", bp_crumb_bottle:"Butelka nr {n}", bp_st_minted:"Kod wydany", bp_st_claimed:"Przypisana", bp_st_active:"Aktywna", bp_st_activated:"Aktywowana", bp_st_void:"Unieważniona", bp_scans_n:"skanowania: {n}", bp_sec_vintage:"Rocznik", bp_fact_composition:"Skład", bp_timeline_label:"Pochodzenie · droga butelki", bp_timeline_empty:"Brak zapisanych zdarzeń pochodzenia", bp_timeline_empty_sub:"Producent nie dodał jeszcze drogi tej butelki.", bp_link_vintage:"Paszport rocznika", bp_buy_title:"Kup tę butelkę", bp_tasting_title:"Znajdź degustację w pobliżu", bp_tasting_body:"Element zastępczy dla lokalnych degustacji. Nie ma jeszcze danych o terminach.", bp_tasting_cta:"Przeglądaj →", bp_vd_kick:"Unieważniona", bp_vd_title:"Ta butelka została unieważniona.", bp_vd_body:"Producent wycofał ten kod, więc paszport nie jest już pokazywany. Jeśli masz pytania o butelkę, skontaktuj się bezpośrednio z producentem.", bp_nf_kick:"Nie znaleziono butelki", bp_nf_title:"Nie mogliśmy tego potwierdzić. Tego kodu nie ma w naszych rejestrach.", bp_nf_body:"Sprawdź link lub kod QR i spróbuj ponownie. Jeśli uważasz, że to błąd, skontaktuj się bezpośrednio z producentem.", bp_err_kick:"Coś poszło nie tak", bp_err_title:"Nie udało się wczytać skanu.", bp_err_body:"Problem po naszej stronie, nie z twoją butelką. Spróbuj ponownie.", bp_retry:"Spróbuj ponownie", wp_explore:"Odkryj Tasting & Toasting",
      /* CAP-PASSPORT-FAMILY-CANON-01 · winery */
      wp_ctx_loading:"Paszport winnicy", wp_ctx_ready:"Paszport winnicy", wp_wines_empty:"Brak dodanych win", wp_wines_empty_sub:"Ta winnica nie dodała jeszcze win do swojego paszportu.", wp_nf_kick:"Nie znaleziono paszportu", wp_nf_title:"Nie udało się znaleźć tej winnicy.", wp_nf_body:"Link może być błędny albo ta winnica nie jest już dostępna w Tasting & Toasting.", wp_err_kick:"Coś poszło nie tak", wp_err_title:"Nie udało się wczytać tego paszportu.", wp_err_body:"Problem po naszej stronie, nie z winnicą. Spróbuj ponownie.", wp_retry:"Spróbuj ponownie", wy_dash_title:"Panel producenta", wy_dash_body:"Element zastępczy dla liczby skanowań, geografii i sygnałów podrobień. Nic nie jest jeszcze mierzone.", wy_dash_cta:"Otwórz panel →"
    }
  };

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
        try { localStorage.setItem("tt_lang", pq); } catch (e) {}
        return pq;
      }
    }
    var saved = null;
    try { saved = localStorage.getItem("tt_lang"); } catch (e) {}
    if (saved) { var sq = normalizeCode(saved); if (ALLOWED.indexOf(sq) !== -1) return sq; }
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var cand = normalizeCode(list[i]);
      if (ALLOWED.indexOf(cand) !== -1) return cand;
    }
    return "en";
  }
  function htmlLang(c) { return c === "pt" ? "pt-PT" : c; }

  var lang = pickLang();
  document.documentElement.setAttribute("lang", htmlLang(lang));
  document.documentElement.setAttribute("dir", lang === "he" ? "rtl" : "ltr");

  var table = Object.assign({}, T.en, T[lang] || {});
  function t(key) {
    if (table[key] != null) return table[key];
    return T.en[key] != null ? T.en[key] : key;
  }

  // Point each flag link at the current page+params with lang swapped in,
  // and mark the active one. Preserves ?slug / ?token / ?api / #hash.
  function wireSwitcher() {
    document.querySelectorAll("[data-lang-link]").forEach(function (el) {
      var code = el.getAttribute("data-lang-link");
      var params = new URLSearchParams(window.location.search);
      params.set("lang", code);
      el.setAttribute("href", window.location.pathname + "?" + params.toString() + window.location.hash);
      var on = code === lang;
      el.classList.toggle("is-current-lang", on);
      if (on) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
  }

  // Apply translations to any static [data-i18n]/[data-i18n-html] elements.
  function applyStatic() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key && table[key] != null) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (key && table[key] != null) el.innerHTML = t(key);
    });
  }

  window.CAP = { lang: lang, t: t, wireSwitcher: wireSwitcher, applyStatic: applyStatic, ALLOWED: ALLOWED };
})();
