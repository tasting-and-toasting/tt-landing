# SITE-ETALON-WINERY-01 — паспорт винодельни по эталону

ПАСПОРТ ОКНА
ИМЯ:     feature/site-etalon-winery-01
РЕПО:    tt-landing
ПАПКА:   /Users/maximgeller/projects/tt-landing-etalon-winery
ВЕТКА:   feature/site-etalon-winery-01
ОТ:      53b2046 Merge pull request #28
ЗАДАЧА:  winery-passport.html по эталону CAP passport canon

Эталон, только чтение: `~/projects/_tt-next-wave4/canon/WineryPassport.dc.html` и `README.md`. Старый макет `_design/` не использовался.

Порты. `8090` уже слушал python из соседнего окна `tt-landing-etalon-bottle`, `8088` уже отдавал фикстуры Tignanello. Этот отчёт снят с этого репозитория на `http://127.0.0.1:8092`. Полный набор данных отдан копией мока на `8089` (`/tmp/mock-cap-api-8089.mjs`, каталог `/tmp/site-etalon-winery-full`). Оригинал мока и эталон не менялись.

## 1. Что страница умела до правки

Файл на старте: `winery-passport.html` при `53b2046`. Проверено в браузере до правки, снимки в `before/`.

- Двенадцать языков и флажки: разметка флажков в шапке, `src/i18n/cap-i18n.js` (`CAP.wireSwitcher`). `?lang=ru` ставит `html lang=ru` и подсвечивает русский флажок.
- Подписи от `?lang=ru` не менялись. Ключи `wp_*` есть только в английском блоке `src/i18n/cap-i18n.js:36-47`. Для остальных языков `CAP.t` берёт английский (`src/i18n/cap-i18n.js:318-321`). На стенде до правки текст en и ru совпал целиком, включая «WINERY», «Verification status: Claimed», «CHARACTER · DNA», «WINES · WALK THE CHAIN →», «1 wine». Это тот же класс поломки, что на странице бутылки приложения: параметр языка есть, подписи остаются английскими.
- Состояния: загрузка (скелет), не найдено при пустом `slug` или ответе 404/400, ошибка сети с кнопкой «Try again». Отдельного экрана черновика не было: `status` винодельни не читался.
- Регистрации сканирования не было. Поиска по `scan` и `POST` в файле не было. Строка «Passport · scanned from a bottle» была подписью шапки после загрузки, не вызовом API.
- Бейдж статуса проверки рисовался всегда: claimed, verified, certified, under_review, documents_submitted, rejected. Неизвестный статус показывался как under review.
- Бейдж владения рисовался только при `ownership_confirmed`, текст из `ownership_badge` или «Verified Winery».
- ДНК: непустые `family`, `land_story`, `philosophy`, `founding_story`, `signature_quote` одной кучей тегов.
- Услуги: объекты `{details, service_type}`, пустой список скрыт.
- Вина: `GET /wineries/:slug/wines`. Строка вела на `wine-passport.html?wineId=&winerySlug=`. Пустой список — отдельная заглушка. Если запрос вин не удался, блока не было.
- Описание винодельни внизу, если непустое. Герб с первой буквой имени.
- API: `?api=`, иначе `http://localhost:8088/api/cap` на localhost и `https://tt-stack-prod.onrender.com/api/cap` снаружи.
- Ссылки до правки: только строка вина и двенадцать флажков. На Tignanello строка вела на `wine-passport.html?wineId=985e8c45-b370-49f2-814e-e8db1a6c2b77&winerySlug=marchesi-antinori`.
- Горизонтального выступа на 1440 и 390 не было (`scrollWidth − clientWidth = 0`).

## 2. Что перенесено с эталона

`winery-passport.html`. Обычный HTML, CSS и JS. Обёртка `x-dc` не переносилась.

Порядок блоков как в `WineryPassport.dc.html`: шапка CAP и имя винодельни, герой (подпись Winery, имя, слоган, место, год основания, описание, бейдж, сайт), ДНК, вина, услуги.

Шрифты — та же ссылка Google Fonts, что в эталоне: Fraunces, Cormorant Garamond, JetBrains Mono, Inter. Фон `#1A0B08`, золото `#C5A572`, ДНК на градиенте `#2E0509 → #1A0B08`, сетка вин `minmax(260px, 1fr)`.

Имя в шапке берётся из `winery.name`, не из строк «Domaine Marek». Ссылка шапки: `winery-passport.html?slug=<winery.slug>`.

Пометки «NEW cross-links proposed» и блок «Coming soon / Producer dashboard / Demo» не переносились.

## 3. Пустое не рисуется

Правило: нет значения — нет строки; нет ни одного значения в блоке — нет блока с заголовком.

| Поле | Где | На Tignanello (8088) |
|---|---|---|
| год основания | `foundedLine`, `winery-passport.html:414-417` | строки «Founded» нет |
| слоган, описание, сайт | `renderPassport`, `winery-passport.html:580-596` | нет |
| колонка ДНК | `dnaBlock`, `winery-passport.html:430-438` | только Land, Family и Philosophy нет |
| услуги | `servicesBlock`, `winery-passport.html:485-486` | блока нет |
| место | `placeLine`, `winery-passport.html:419-424` | строка есть: locality, region и country непусты |
| неизвестная страна | `flagSvg`, `winery-passport.html:310-312` | имя страны есть, флажка нет. Проверено ответом со страной Atlantis: флажков 0 |

На полном наборе (8089) появляются слоган, «Founded 1958» / «Основано в 1958», описание, сайт, три колонки ДНК и три услуги.

## 4. Данные, флаг, фото, бейдж, ссылки

Адрес API и выбор хоста те же: `winery-passport.html:126`. Пишется только то, что пришло в `GET /wineries/:slug` и `GET /wineries/:slug/wines`.

Флаг — таблица английских имён и кодов страны в `flagSvg`. Italy на Tignanello даёт итальянский триколор. Люксембург в таблице есть (горизонтальный красный, белый, голубой, как в эталоне), но у этой винодельни страна Italy, её не подменял.

Фото вина: если `hero_image_url` — абсолютный http(s) и хост читается, вместо силуэта фото и подпись. Именованные хосты: `bdxfamilies.fr`, `bordeauxfamilies.fr` → «BDX Families»; `pfaffenheim.com` → «Cave de Pfaffenheim». Иной хост — «Source: {domain}». Хост не читается или картинка не грузится — силуэт, подписи нет (`photoCredit` `winery-passport.html:186`, срыв загрузки `winery-passport.html:511-512`). Подпись на карточке и ещё раз в просмотре. Просмотр открывается кнопкой Enlarge. На полном наборе снимок `full-en-1440-lightbox.png`: «© BDX Families, producer's website», файл `legende-louis-vallon-brut.png`.

Силуэт по цвету и стилю, пути из `canon/assets` без метаданных C2PA: игристое или имя с cuvée / champagne / crémant — champagne; white — riesling; иначе bordeaux. На полном наборе оба силуэта имеют viewBox `0 0 80 240` (riesling и champagne), у Tignanello фото.

Бейдж «Producer-asserted» при `verification_status = claimed` (`winery-passport.html:388-390`, `495`). На английском текст именно Producer-asserted; CSS эталона делает его капителью. На русском — «Заявлено производителем» (`b_claimed` из `cap-i18n.js`). Другие статусы остаются отдельным бейджем.

Ссылки строк:

- винодельня: `winery-passport.html?slug=<winery.slug>`
- вино: `wine-passport.html?wineId=<wine.id>&winerySlug=<winery.slug>`

`winerySlug` оставлен: его читает текущий `wine-passport.html:121` для ссылки назад. `?lang=` и `?api=` сохраняются. На python-сервере без cleanUrls открывается файл `.html`. На Vercel `cleanUrls: true` (`vercel.json:2`) тот же файл открывается как `/wine-passport`.

Урожая в ответе `/wineries/:slug/wines` нет, ссылку на урожай страница не выдумывает.

Черновик: `winery.status === 'draft'` → экран эталона с силуэтом «?» (`winery-passport.html:618`, `566`). Снимок `draft-en-1440.png` с подставленным ответом. Опубликованный Tignanello этот экран не показывает.

## 5. Сохранено сверх эталона

- Двенадцать флажков и переключатель. `?lang=` меняет подписи. На 390 все двенадцать языков: выступ 0, иврит `dir=rtl`. Подписи кикера: Winery, Domaine, Винодельня, Bodega, Виноробня, Cantina, Weingut, יקב, Quinta, მარანი, Cramă, Winnica.
- Экран ошибки и кнопка повтора. Снимок `error-en-1440.png` при `?api=http://127.0.0.1:1`.
- Ссылка «Explore Tasting & Toasting» на экране «не найдено». Кликом открылась `https://www.tastingandtoasting.com/` (HTTP 200).
- Пустой список вин: заголовок и текст «No wines listed yet», если запрос вин успешен и список пуст. Если запрос вин упал, блока нет.
- Счётчик вин.
- Сорта винограда второй строкой карточки.
- Колонки ДНК «происхождение» и «слова основателя», если в ответе есть `founding_story` или `signature_quote`. У Tignanello их нет, колонок нет.
- Бейдж для статусов кроме claimed.
- Бейдж из `ownership_badge`, если `ownership_confirmed` и этот текст ещё не показан.
- Скелет загрузки.
- Выбор API и `?api=`.
- `winerySlug` в ссылке на вино.

Статичная фраза «Passport · scanned from a bottle» не перенесена: за ней не было сканирования. В шапке имя винодельни из ответа.

## 6. Язык до и после

До правки `?lang=ru` подписи не менял. Снимки `before/tignanello-en-1440.png` и `before/tignanello-ru-1440.png`, текст совпал.

После правки на Tignanello русский экран: «Винодельня», «Заявлено производителем», «ДНК», «Земля», «Вина», «1 вино», «Красное». Клик по русскому флажку с английской страницы открыл `?lang=ru` и кикер «Винодельня».

## 7. Снимки

Каталог `docs/agent-reports/SITE-ETALON-WINERY-01/`. Выступ документа на каждом кадре 1440 и 390 был 0.

| Файл | Что |
|---|---|
| `before/tignanello-en-1440.png`, `before/tignanello-ru-1440.png`, `before/tignanello-en-390.png` | до правки |
| `tignanello-en-1440.png`, `tignanello-en-390.png`, `tignanello-ru-1440.png`, `tignanello-ru-390.png` | Tignanello, мок 8088 |
| `full-en-1440.png`, `full-en-390.png`, `full-ru-1440.png`, `full-ru-390.png` | полный набор, мок 8089 |
| `full-en-1440-lightbox.png` | открытое фото |
| `notfound-missing-slug-en-1440.png` | нет slug |
| `notfound-invalid-id-en-1440.png`, `notfound-invalid-id-ru-1440.png` | slug `not-a-winery`, ответ 404 |
| `break-founded-en-1440.png` | слом, потом возвращён |
| `draft-en-1440.png`, `error-en-1440.png` | черновик и ошибка сети |
| `etalon-BottleScan-1440.png` | эталон `BottleScan.dc.html` через его `support.js` |

Мок `mock-cap-api.mjs` на любой slug винодельни отдаёт один `winery.json` (маршрут строка 18, ответ 200 если файл есть). Поэтому `?slug=does-not-exist` на 8088 показывает Tignanello, а не «не найдено». Экран «не найдено» проверен пустым slug и отдельным ответом 404.

Полный набор — копия фикстур. Пустые поля Tignanello заполнены из `canon/data.js` (`marek`, `SAMPLE_PRODUCER_PHOTOS`), имя, slug, страна, locality, region и уже заполненный `land_story` не затирались. Добавлены вина Pierres Blanches и Cuvée Antoine, у Tignanello `hero_image_url` первого образца. В `vintage.json` / `wine-vintages.json` дописаны крепость 13.5, 1200 бутылок и урожаи 2019, 2020, 2022. Эти файлы страница винодельни не читает. Каталог лежит в `/tmp`, в репозиторий не входил.

## 8. Слом

У `foundedLine` убрана строка `if (!y) return ''`. На Tignanello, где `founded_year` пустой, появилась строка «Founded» без года (`HAS_YEAR=false`). Снимок `break-founded-en-1440.png`. Строка возвращена: `winery-passport.html:416`. Повторный заход: элемента `.founded` нет, слова Founded в тексте нет.

## 9. Клики

| Куда нажал | Куда открылось | Открылось |
|---|---|---|
| имя в шапке | `winery-passport.html?slug=marchesi-antinori` | да, HTTP 200, на экране Marchesi Antinori |
| карточка Tignanello | `wine-passport.html?wineId=985e8c45-b370-49f2-814e-e8db1a6c2b77&winerySlug=marchesi-antinori` | да, HTTP 200, заголовок Tignanello |
| Pierres Blanches, Cuvée Antoine | `wine-passport.html?wineId=w-riesling` и `wineId=w-cremant` | файл открылся, HTTP 200. Мок на любой id вина отдаёт один `wine.json`, поэтому на экране снова Tignanello. Это мок, не адрес ссылки |
| двенадцать флажков | тот же паспорт с `lang=` | русский флажок кликнут, подписи сменились. Остальные href собраны со страницы |
| сайт винодельни на полном наборе | `https://marek-winery.example/` | браузер пошёл по адресу из ответа. Имя не резолвится: `ERR_NAME_NOT_RESOLVED`. В `data.js` это примерный адрес, не живой сайт |
| Explore на «не найдено» | `https://www.tastingandtoasting.com/` | да, HTTP 200 |
| Enlarge | просмотр фото поверх страницы | да, подпись источника видна |

Ссылок на урожай на странице нет.
