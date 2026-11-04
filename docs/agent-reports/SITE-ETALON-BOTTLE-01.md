# SITE-ETALON-BOTTLE-01

Bottle passport (`bottle-scan.html`) redrawn to the CAP canon `BottleScan.dc.html` (tt-mobile `98a47a3`, copy in `~/projects/_tt-next-wave4/canon/`). Not merged. Not deployed.

Gate: `pwd` = `/Users/maximgeller/projects/tt-landing-etalon-bottle`, remote `tasting-and-toasting/tt-landing`, branch `feature/site-etalon-bottle-01`, status empty before the edit.

## Правда о странице до правки

Прочитан `bottle-scan.html` целиком (старая версия, 369 строк) и открыт на моке Tignanello `4a4d9b81-b9f4-4a6f-87e8-49056e9393dc` до замены файла. Снимки: `before-en-1440.png`, `before-ru-1440.png`, `before-ru-390.png`, `before-notfound-ru.png`, `before-error-en.png`.

Что страница умела:

- 12 языков и флажки (`en fr ru es uk it de he pt ka ro pl`). `CAP.wireSwitcher()` сохраняет `token` / `api` и ставит `?lang=`. Иврит — `dir=rtl`.
- Выбор API, строка 138 старого файла: `?api=` иначе `http://localhost:8088/api/cap` на localhost, иначе `https://tt-stack-prod.onrender.com/api/cap`. Только `GET /scan/:token`. POST регистрации сканирования в файле не было.
- Состояния: скелет загрузки; «не найдено» без токена и на HTTP 404/400; ошибка сети / не-ok с кнопкой «Try again». Отдельного экрана черновика в файле не было. Контур бутылки без заливки рисовался, когда `ownership_confirmed` ложно — это не экран «not yet published».
- Бейдж «Verification status» по `winery.verification_status`. Галочка владельца только если `ownership_confirmed`.
- Номер издания только когда есть и `bottle_number`, и `total_in_series`.
- ДНК как набор непустых строк (`family`, `land_story`, `philosophy`, `founding_story`, `signature_quote`). Пустой набор не рисовался.
- Путь бутылки: подписи `ev_*`, дата как `YYYY-MM-DD`. Если событий нет — блок всё равно был, с текстом «No provenance events recorded yet».
- Факты вина: цвет, сладость, сорта, апелласьон, стиль — только непустые. Крепость, состав, число бутылок и дата выпуска урожая не выводились.
- Ссылки: `vintage-passport.html?vintageId=`, `wine-passport.html?wineId=&winerySlug=`, `winery-passport.html?slug=`, плюс `lang`, если не `en`. На «не найдено» — `https://tastingandtoasting.com`. Сайт винодельни — кнопка, если есть и описание, и `website_url`.
- Свой SVG бутылки с именем вина на этикетке. Фото производителя и флаг страны не было.
- Шапка «Tasting & Toasting», подпись контекста «Scanned · bottle passport».

`?lang=ru` до правки. `html lang=ru`. Из подписей сменились только значения цвета и сладости: «Красное», «Сухое». «WINE FACTS», «COLOR», «Verification status: Claimed», «Climb the story», «Bottle not found» остались английскими: ключи `bp_*`, `fact_*`, `vs_*` в `src/i18n/cap-i18n.js` есть только в `en`, остальные языки падают в английский (`cap-i18n.js` `Object.assign({}, T.en, T[lang])`). Это совпадает с замечанием про боевую страницу бутылки приложения: переключатель языка не переводил каркас.

## Что перенесено

Обычный HTML/CSS/JS, без React и без `x-dc`. Шрифты как в эталоне: Fraunces, Cormorant Garamond, JetBrains Mono, Inter. Фон `#1A0B08`, золото `#C5A572`, плашка с радиальным градиентом, ДНК с градиентом `#2E0509 → #1A0B08`.

Порядок блоков: шапка CAP и крошки, плашка бутылки | вино, урожай, винодельня, ДНК, путь, кнопки Open vintage / Open wine / Visit winery.

Данные только из `GET {API}/scan/:token`. Строка выбора API сохранена: `bottle-scan.html:162`.

Пустое не рисуется (`bottle-scan.html:224` для крепости и те же проверки у остальных полей): нет числа серии — нет строки «No. n / »; нет крепости — нет «ABV»; нет года основания — нет «Founded»; нет стиля — нет плашки; нет событий — нет заголовка Timeline. На Tignanello после правки в тексте страницы нет `ABV`, нет `%`, нет `Founded`, нет `TIMELINE` (проверка Playwright на восстановленном коде).

Фото: `vintage.bottle_image_url`, затем `wine.hero_image_url`, без повтора URL. Хост → имя как в `lib/cap/bottle-photos.ts` коммита `98a47a3`: `bdxfamilies.fr` и `bordeauxfamilies.fr` → BDX Families, `pfaffenheim.com` → Cave de Pfaffenheim. Иной http(s)-хост — «Source: домен». Адрес без хоста не показывается (`photoCredit('/relative.jpg')` и `'not a url'` вернули `null`). Сломанная загрузка снимает кадр; когда не осталось ни одного — силуэт (`full-en-1440-photo-failed.png`: после обрыва обоих URL `sil: true`, кредита нет). Силуэт — контур из `canon/assets/bottle-bordeaux-lg-transparent.svg`, без блока C2PA. Фото целиком (`object-fit: contain`). Два кадра — полоска миниатюр. Просмотр: клик, закрытие Esc, крестиком и фоном (`full-en-1440-lightbox.png`). Подпись на плашке и в просмотре.

Флаг из `winery.country`. Italy и Luxembourg дают svg; `flagSvg('Atlantis')` и пустая строка — `""`. На Tignanello виден флаг Италии.

Крошки и кнопки ведут на рабочие страницы. К каждому клику на моке: страница открылась и показала паспорт, не «not found».

| Клик | Куда | Что открылось |
| --- | --- | --- |
| крошка и «Visit winery» и «by» | `winery-passport.html?slug=marchesi-antinori` | Winery passport, Marchesi Antinori |
| крошка и «Open wine» | `wine-passport.html?wineId=985e8c45-b370-49f2-814e-e8db1a6c2b77&winerySlug=marchesi-antinori` | Wine passport, Tignanello |
| крошка и «Open vintage» | `vintage-passport.html?vintageId=70635a6d-3182-414c-97cb-96aaa8c9a9df` | Vintage passport, 2020 |

`winerySlug` оставлен: `wine-passport.html` строит ссылку назад на винодельню только из него. Расширение `.html` оставлено: локальный `python3 -m http.server` отдаёт файлы так, а Vercel `cleanUrls` снимает его на бою. Пометку NEW и блок Coming soon / Buy this bottle / Find a tasting на страницу не переносил.

Путь бутылки: подписи `ev_*` из `cap-i18n.js` (они есть на всех 12 языках). Дата — день, короткое имя месяца, год, без `Date`, чтобы сутки не сдвигались.

`?lang=ru` после правки меняет каркас: «Вино», «Урожай», «Крепость», «Путь бутылки», «Сбор урожая», «Бутылка №1», «© BDX Families, сайт производителя», «Не найдено». Проверены также `fr` (Vin / Ouvrir le millésime), `de`, `he` (`dir=rtl`), `ka`, `pl`.

Ширина 1440 и 390: `scrollWidth === clientWidth` на обоих наборах, en и ru. Горизонтальной прокрутки не было.

## Сохранено сверх эталона

- Переключатель 12 флажков, `?lang=`, RTL, `tt_lang`.
- Перевод каркаса страницы на 12 языков внутри `bottle-scan.html` (общий `cap-i18n.js` не менялся: для `bp_*` там английский запасной).
- Экран ошибки с «Повторить».
- Скелет загрузки.
- Бейдж статуса проверки по `winery.verification_status` (на Tignanello: «Verification status: Claimed» / «Статус проверки: Заявлено»). Чип `ownership_badge` — только если строка пришла в ответе. Галочка — только при `ownership_confirmed`.
- Ссылка «Explore Tasting & Toasting» на экране «не найдено».
- `winerySlug` и `lang` на ссылках паспортов.
- `?api=` для подмены адреса.
- В блоке ДНК, если они непустые: `founding_story`, `signature_quote`, строка «первая регистрация в стране». В макете `BottleScan.dc.html` этих трёх нет; старая страница показывала их как безымянные плашки.

Не переносилось, потому что этого не было в старом файле и это не поле ответа: экран черновика «Not yet published» (прототипный тумблер эталона; живой резолвер отдаёт черновик как 404 — это комментарий `bottle.tsx` в `98a47a3`, сам фильтр API в этом окне не проверялся) и POST регистрации скана.

## Наборы и слом

Мок: `node ~/projects/_tt-next-wave4/mock-cap-api.mjs` на `localhost:8088`. Страница: `python3 -m http.server 8090`.

Tignanello — каталог фикстур мока как есть (`vintage.abv` null, фото null, `timeline` пустой). Снимки `sparse-*`.

Полный набор: `docs/agent-reports/SITE-ETALON-BOTTLE-01/fixtures-full/`. В `scan.json` дописаны поля, которых не было у Tignanello, значениями из `canon/data.js`: `abv` 13.5, `bottles_produced` 1200, `bottle.total_in_series` 1200, пять событий `marek.timeline`, два URL из `SAMPLE_PRODUCER_PHOTOS` (это фото Louis Vallon с сайтов BDX Families, не снимок Tignanello). Мок с этим каталогом. Снимки `full-*`. Имя вина осталось Tignanello.

Слом: в `abvFact` пустое значение стало возвращать `"%"`. На Tignanello (`abv` null) блок урожая показал

```
ABV
%
```

Снимок `break-abv-tignanello-en-1440.png`. Проверка возвращена (`bottle-scan.html:223-228`). Повторный заход: блока ABV и строки `%` нет.

Неверный токен. Этот мок на любой `/api/cap/scan/:token` отдаёт один и тот же `scan.json` (200). Экран «не найдено» снят ответом HTTP 404: `?token=00000000-0000-0000-0000-000000000000&api=http://localhost:8090/missing`, плюс пустой токен на старой странице. Снимки `notfound-en-1440.png`, `notfound-ru-390.png`. Ошибка сети: `error-en-1440.png`.

Эталон рядом: `etalon-BottleScan-1440.png` — `http://localhost:8091/BottleScan.dc.html` (canon + support.js). На снимке видны пометки макета, которые на живую страницу не переносились: «NEW cross-links proposed» и имена Domaine Marek / Clos du Rocher.

## Снимки

`docs/agent-reports/SITE-ETALON-BOTTLE-01/`

- до: `before-en-1440.png`, `before-ru-1440.png`, `before-ru-390.png`, `before-notfound-ru.png`, `before-error-en.png`
- Tignanello после: `sparse-en-1440.png`, `sparse-ru-1440.png`, `sparse-en-390.png`, `sparse-ru-390.png`
- полный набор: `full-en-1440.png`, `full-ru-1440.png`, `full-en-390.png`, `full-ru-390.png`, `full-en-1440-lightbox.png`, `full-en-1440-photo2.png`, `full-en-1440-photo-failed.png`
- `notfound-en-1440.png`, `notfound-ru-390.png`, `error-en-1440.png`
- `break-abv-tignanello-en-1440.png`
- `etalon-BottleScan-1440.png`
