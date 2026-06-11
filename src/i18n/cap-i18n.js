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
      loading:"Loading…", nf_winery:"Winery not found.", nf_wine:"Wine not found.", nf_vintage:"Vintage not found.", nf_bottle:"This bottle could not be verified.",
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
      cap_verified:"CAP Verified", scan_story:"Scan to discover the story", bottle_word:"Bottle"
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
      cap_verified:"CAP vérifié", scan_story:"Scannez pour découvrir l'histoire", bottle_word:"Bouteille"
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
      cap_verified:"CAP подтверждён", scan_story:"Отсканируйте, чтобы узнать историю", bottle_word:"Бутылка"
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
      cap_verified:"CAP verificado", scan_story:"Escanea para descubrir la historia", bottle_word:"Botella"
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
      cap_verified:"CAP підтверджено", scan_story:"Скануйте, щоб дізнатися історію", bottle_word:"Пляшка"
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
      cap_verified:"CAP verificato", scan_story:"Scansiona per scoprire la storia", bottle_word:"Bottiglia"
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
      cap_verified:"CAP verifiziert", scan_story:"Scannen, um die Geschichte zu entdecken", bottle_word:"Flasche"
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
      cap_verified:"CAP מאומת", scan_story:"סרקו כדי לגלות את הסיפור", bottle_word:"בקבוק"
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
      cap_verified:"CAP verificado", scan_story:"Digitalize para descobrir a história", bottle_word:"Garrafa"
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
      cap_verified:"CAP დადასტურებული", scan_story:"დაასკანერე ისტორიის აღმოსაჩენად", bottle_word:"ბოთლი"
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
      cap_verified:"CAP verificat", scan_story:"Scanează pentru a descoperi povestea", bottle_word:"Sticlă"
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
      cap_verified:"CAP ZWERYFIKOWANO", scan_story:"Zeskanuj, aby poznać historię", bottle_word:"Butelka"
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
