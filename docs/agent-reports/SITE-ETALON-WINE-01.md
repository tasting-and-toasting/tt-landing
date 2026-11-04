# SITE-ETALON-WINE-01 — паспорт вина и урожая по эталону

REPO: tt-landing · BRANCH: `feature/site-etalon-wine-01` · DATE: 04.11.2026
Файлы: `wine-passport.html`, `vintage-passport.html`. Эталон не менялся: `~/projects/_tt-next-wave4/canon/`.

## Правда о страницах до правки

Обе страницы — узкая колонка 720px по макету 10.07, шрифты Fraunces и Inter, без Cormorant и JetBrains Mono, без фото и без силуэта.

Общее:

- 12 языков флажками: en, fr, ru, es, uk, it, de, he, pt, ka, ro, pl. `CAP.wireSwitcher()` сохраняет query. Hebrew ставит `dir=rtl` (`src/i18n/cap-i18n.js:316`).
- API: `?api=`, иначе `http://localhost:8088/api/cap` на localhost, иначе `https://tt-stack-prod.onrender.com/api/cap`.
- Состояния: скелет загрузки, «не найдено» (нет id, HTTP 400/404), ошибка сети с кнопкой повтора.
- Черновика не было. Регистрации сканирования не было: её делает `bottle-scan.html`, эти страницы её не вызывали.
- Бейдж проверки рисовался всегда. Если `verification_status` не приходил, подставлялся «Under review». У Tignanello поля нет (`fixtures/wine.json`), поэтому бейдж врал.

`wine-passport.html` до правки:

- `GET /api/cap/wines/:wineId`, рисует `wine` и `vintages`.
- Ссылка на винодельню только если в адресе есть `winerySlug` / `slug`: `winery-passport.html?slug=`.
- Строка урожая: `vintage-passport.html?vintageId=` плюс slug и язык. Год всегда; бутылки и ABV только если значение есть.
- Блоки при наличии данных: страна, адрес, местность, цвет, сладость, сорта, апелласьон, стиль, описание, цитата. Пустой список урожаев — отдельная плашка.
- «Не найдено» ведёт на `https://tastingandtoasting.com`.

`vintage-passport.html` до правки:

- `GET /api/cap/vintages/:vintageId`.
- Назад на вино: `wine-passport.html?wineId=`. На винодельню прямой ссылки не было, только если slug приехал в query и пользователь шёл через вино.
- Факты (бутылки, ABV, дата), полоски состава, чипы цвета/сладости/сортов, дегустация и производство. Пустой состав `{}` не рисовался.

`?lang=ru` до правки, снято на моке Tignanello (`before/wine-en-1440.png`, `before/wine-ru-1440.png`):

- Менялись только цвет и сладость: Red/Dry → Красное/Сухое. Эти ключи есть во всех 12 языках `cap-i18n.js`.
- Шапка страницы оставалась английской: Wine, Verification status, Country, Vintages, Vintage, Tasting notes. Ключи `wn_*`, `vt_*`, `vs_*` есть только в английской таблице (`cap-i18n.js:64-86`). Это тот же класс поломки, что на странице бутылки приложения: параметр языка не доходит до подписей.

## Что перенесено с эталона

Макет `WinePassport.dc.html` и `VintagePassport.dc.html`, фотопластинка как в `BottleScan.dc.html` и README канона. Обёртка x-dc на сайт не переносилась.

- Фон `#1A0B08`, золото `#C5A572`, сетка hero в две колонки, которые на 390 складываются в одну.
- Шрифты Google Fonts как в эталоне: Fraunces, Cormorant Garamond (цитата и дегустация), JetBrains Mono (метки, даты, числа), Inter.
- Шапка: CAP и крошки винодельня / вино / урожай. Имена только из ответа API.
- Слева фото или силуэт Bordeaux (пути из `canon/assets/bottle-bordeaux-lg-transparent.svg` и `bottle-bordeaux-md-transparent.svg`, вставлены в страницу). Черновик — силуэт с «?» из `bottle-anon-bordeaux-lg.svg`.
- Вино: кличка Wine, имя, чипы цвета/сладости/стиля, апелласьон, сорта, описание, цитата, «by {винодельня} →», затем урожаи карточками.
- Урожай: год, имя вина, чипы, блок Production (ABV, состав, бутылки, дата, EAN/UPC, заметки, дегустация), кнопки Open wine и Visit winery.
- Черновик, если `status === "draft"`. Не найдено — текст эталона. Ссылки: `/winery-passport?slug=`, `/wine-passport?wineId=`, `/vintage-passport?vintageId=`. На файловом сервере python к ним добавляется `.html`, иначе клик не открыл бы страницу; на сайте с `cleanUrls` (`vercel.json:3`) путь без расширения.
- Пометки NEW, COMING SOON, Buy this wine и подвал `docs/design/canon` не переносились.

Пустое не рисуется. Нет значения — нет строки. Нет ни одного значения в блоке — нет блока с заголовком. Пустой `grape_composition: {}` не показывается. У Tignanello нет крепости, бутылок, даты и стиля: на снимке sparse их нет, карточка урожая — только «2020».

Фото: `wine.hero_image_url`, на урожае ещё `vintage.bottle_image_url` (и `hero_image_url`, если он есть в том же ответе). На странице вина к герою добавляются разные `bottle_image_url` урожаев из того же ответа. Кадр целиком, `object-fit: contain`. Два и больше — полоска миниатюр. Клик открывает просмотр; закрытие по Esc, крестику и фону проверено. Подпись «© {имя}, producer's website» по хосту, как `lib/cap/bottle-photos.ts`: bdxfamilies.fr и bordeauxfamilies.fr → BDX Families, pfaffenheim.com → Cave de Pfaffenheim. Другой http(s)-хост — «Source: {домен}». Адрес без хоста не показывается. Сломанная картинка снимается; если не осталось ни одной — силуэт.

Флаг страны — из `winery_country` (вино) или `winery.country` / `winery_country` (урожай, если поле есть в ответе). Неизвестная страна остаётся текстом без флага. Люксембург из макета не зашит.

## Сохранено сверх эталона

- Переключатель 12 языков и RTL для иврита. Подписи страницы лежат в самой странице, потому что `wn_*` / `vt_*` в общем словаре не переведены. `?lang=ru` после правки даёт «ВИНО», `?lang=fr` — «VIN», `?lang=he` — «יין» и `dir=rtl`.
- Скелет загрузки и экран ошибки с повтором.
- Ссылка «Explore Tasting & Toasting» на экранах «не найдено» и черновика. Проверено: `https://tastingandtoasting.com` отвечает 200.
- Бейдж «Verification status» только когда API прислал `verification_status` из известного набора. Ложный «Under review» убран: это было пустое значение.
- Страна, адрес и местность вина (их добавил WINERY-FIELDS-PAGE-01). Рядом со страной флаг, если страна известна.
- Плашка «урожаев ещё нет», если список пуст.
- Прежний выбор API и перенос `?api=` и `winerySlug` по ссылкам, чтобы цепочка винодельня → вино → урожай не теряла язык и мок.

Регистрация сканирования по-прежнему не на этих страницах.

## Проверка

Порты 8088 и 8090 уже держало соседнее окно бутылки. Разреженный набор снят с того же мока на 8088 (фикстуры Tignanello, `style`/`abv`/`hero` пустые). Страницы отдавались с `python3 -m http.server 8190`. Полный набор — копия фикстур в `/tmp/site-etalon-wine-full` (в репозиторий не входит) и копия мока на 8188; файл `mock-cap-api.mjs` не менялся. Эталон BottleScan отдан с порта 8191.

Полный набор заполнен только пустые поля значениями из `canon/data.js`: стиль Still, крепость 13.5, состав, 1200 бутылок, дата 2023-09-14, EAN, урожаи 2019 и 2022, фото SAMPLE_PRODUCER_PHOTOS, DNA/услуги в `winery.json`. Уже заполненный `dna.land_story` Tignanello не затирался.

Снимки Playwright в этой папке. Горизонтальной прокрутки нет: `scrollWidth` равен ширине окна на 1440 и 390, en и ru, оба набора.

- До: `before/`.
- Разреженный набор: `sparse-wine-*`, `sparse-vintage-*`.
- Полный: `full-wine-*`, `full-vintage-*`, просмотр `full-vintage-lightbox-en-1440.png`.
- Не найдено: `not-found-wine-en-1440.png`, `not-found-vintage-en-1440.png` (id не совпал с телом ответа; живой API на неизвестный id отвечает 404, страница это уже понимает).
- Эталон: `etalon-bottlescan-1440.png` (BottleScan.dc.html открылся, на пластине кредит BDX Families).

Слом: в `vintage-passport.html` проверка `abvPresent` была заменена на `return true`. На Tignanello снова появилась ячейка «%» — `break-abv-percent-tignanello.png`. Проверка возвращена. Повторный замер: ячеек ABV на разреженном урожае 0.

Клики на моке:

- Винодельня из крошек и «by Marchesi Antinori» открывает `winery-passport.html?slug=marchesi-antinori`, на странице имя Marchesi Antinori.
- Карточка 2020 открывает урожай `70635a6d-…` в состоянии ready. «Open wine» возвращает на вино. «Visit winery» открывает винодельню, когда slug есть в ответе или в query.
- Карточки 2019 и 2022 открывают маршрут урожая и показывают «не найдено»: мок отдаёт одно тело урожая, а id в теле не совпадает с запрошенным. Живой API отдал бы свой урожай или 404.
- Флаги языка сохраняют `wineId`.
