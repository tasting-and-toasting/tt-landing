# MERGE-WINERY-FIELDS-01

**Окно:** w-merge-winery
**Дата:** 31.10.2026
**Кто дал задачу:** DEV-CONTROL
**Разрешение владельца:** «да» на слияние #404, #27 и #28
**Деплой tt-stack не делался.** Слияния tt-landing сами попали в бой, потому что `main` лендинга выкатывается сам.

## 1. Шлюз tt-stack

| Проверка | Факт |
|---|---|
| pwd | `/Users/maximgeller/projects/tt-stack-winery-fields` |
| remote | `https://github.com/tasting-and-toasting/tt-stack.git` |
| дерево | чисто |
| ветка worktree | `feature/winery-public-fields-01` |
| HEAD | `0f3d76a169ce352039c01ec01df1965e5392ea01` |

## 2. #404 не слит

Запрос открыт: https://github.com/tasting-and-toasting/tt-stack/pull/404
Голова: `0f3d76a169ce352039c01ec01df1965e5392ea01`
База на момент проверки: `60a5a25cfe44cabf178e0ce61336ae0d46b343c9` (`v3/foundation`, merge #403)
Состояние GitHub: `MERGEABLE`, `mergeStateStatus` `UNSTABLE`

CI красный. Слияние не делалось.

Прогон `41197811448`, job `124527434273`, имя проверки `api src typecheck + tests`:
1 failed, 4612 passed, 11 skipped.
Упавший тест: `the public read contract CAP already had > names winery_country, winery_address and winery_locality, and withholds contacts and service columns`
Файл: `api/src/routes/service_wine_passports.test.ts:532`
Сообщение: `trust: winery 127d09d5-d9c7-4813-ae6b-c92fc653df47 cannot become verified without a production reviewer decision in the same transaction`
Сторож: `cap_wineries_verified_projection_guard()`
Запрос теста на этой строке ставит `verification_status = 'verified'` вместе с почтой, телефоном, широтой, долготой и `is_seed`.

Две другие проверки того же прогона зелёные: `runner unit suites`, `fresh rebuild from an empty database`.

Вершина `origin/v3/foundation` после отказа: `60a5a25cfe44cabf178e0ce61336ae0d46b343c9`. Нового merge-коммита нет. Render не трогался.

## 3. #27 слит

https://github.com/tasting-and-toasting/tt-landing/pull/27
Состояние: `MERGED` в `2026-10-31T13:15:32Z`
Merge-коммит: `136ee6c8e3a71eeb3123960b11d49d5881fff9fb`
Родители: `427a06c5fd14df0a5ce553cef1a513e4b84f9ab2` и `367a500fb3cb373dfe26d220c72b69e7d2048b96`
Сообщение: `Merge pull request #27 from tasting-and-toasting/feature/winery-fields-page-01`
Проверки Vercel на этот коммит: `tt-landing-3fl4` success, `tt-landing-shortw2` success.

Боевой HTML `https://www.tastingandtoasting.com/wine-passport` после выкладки содержал `winery_country` (строка сборки 157) и ещё `height:58px` у шапки. ETag до #28: `31453ea70591ed0332f3e019508382d8`. Last-Modified: `Sat, 31 Oct 2026 13:15:50 GMT`.

## 4. Страницы двух опубликованных вин

Идентификаторы взяты как два паспорта, которые уже отвечали в бою. Имена подтверждены ответом API в этой сессии.

| Вино | Идентификатор | Страница | Короткий адрес | API |
|---|---|---|---|---|
| Marcel Martin La Garde Crémant de Loire Brut Tête de Cuvée | `cfc8644e-d53c-4d85-b5fc-11ff4a882acc` | `200` | `308` на `/wine-passport?wineId=cfc8644e-d53c-4d85-b5fc-11ff4a882acc` | `200` |
| Muré Pinot Gris Pierres Sèches | `7ea4bfc2-e6c7-404c-aabd-6af356a8fe20` | `200` | `308` на `/wine-passport?wineId=7ea4bfc2-e6c7-404c-aabd-6af356a8fe20` | `200` |

Коды сняты после выкладки #28, `curl` без следования перенаправлению.

Консоль Chrome (headless, origin `https://www.tastingandtoasting.com`) на обеих страницах:

`Access to fetch at 'https://tt-stack-prod.onrender.com/api/cap/wines/<id>' from origin 'https://www.tastingandtoasting.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

Дальше: `Failed to load resource: net::ERR_FAILED`.
На первом вине ещё `favicon.ico` отвечает `404` (`curl` того же адреса: `404`).

На экране обеих страниц текст: `SOMETHING WENT WRONG` / `We couldn't load this wine.` Имени вина в DOM нет. Это не следствие #27 или #28: адрес API в странице тот же, что был до слияния (`const API` на боевом HTML, строка 125 после выкладки). Отказ CORS описан в `api/src/buildApp.ts:179-188`: неизвестный Origin не получает заголовок `Access-Control-Allow-Origin`. Ответ `curl` с `Origin: https://www.tastingandtoasting.com` на тот же `GET` был `200` и без этого заголовка.

## 5. #28 слит

https://github.com/tasting-and-toasting/tt-landing/pull/28
Состояние: `MERGED` в `2026-10-31T13:20:03Z`
Merge-коммит: `53b20468f8a1961ffa295601ea0b68290e8540db`
Родители: `136ee6c8e3a71eeb3123960b11d49d5881fff9fb` и `5427d3a4984432156114df700cb09413473b3393`
Сообщение: `Merge pull request #28 from tasting-and-toasting/fix/flags-overlap-390-01`
Проверки Vercel: `tt-landing-3fl4` success, `tt-landing-shortw2` success.
Боевой HTML после выкладки: ETag `6525b054b8815ed5d53b89fe42253d2b`, строка 25 `.brandbar{min-height:58px;...}`, строка `winery_country` на месте.

## 6. Ширина 390

Chrome headless, viewport 390×844, deviceScaleFactor 2, страница первого вина после выкладки #28.

| Мера | Значение |
|---|---|
| `innerWidth` / `clientWidth` / `scrollWidth` | 390 / 390 / 390 |
| горизонтальный выступ | 0 |
| высота `.brandbar` | 103 |
| низ флагов | 93 |
| флаги вне шапки | нет |
| пересечение флага с `.ctx` («WINE PASSPORT») | нет |
| пересечение флага с `.brandname` | нет |
| пересечение флага с `h1` | нет |
| верх `h1` | 382.61 |

`h1` на этом кадре это заголовок ошибки `We couldn't load this wine.`, не имя вина: тело вина не пришло из-за CORS из раздела 4. Шапка до этого заголовка не доезжает: низ шапки 103, верх заголовка 382.61. Второй ряд флагов внутри шапки, подпись `WINE PASSPORT` остаётся в первом ряду.

Тот же замер на втором вине: высота шапки 103, выступ 0, пересечений нет. Экран тот же, ошибка загрузки.

Кадр боя снят с первого вина на этой ширине. В репозиторий не клался: коммит этой задачи только файл отчёта.

## 7. Страна, адрес и местность в бою

Их на боевой странице нет. Это ожидаемо, пока владелец не выкатил tt-stack.

Ключи ответа `GET https://tt-stack-prod.onrender.com/api/cap/wines/<id>` у обоих вин: `winery_id`, `winery_slug`, `winery_name`. Ключей `winery_country`, `winery_address`, `winery_locality` в JSON нет. Подписей Country, Address, Locality в тексте экрана нет.

#404 не слит, вершина `v3/foundation` остаётся `60a5a25cfe44cabf178e0ce61336ae0d46b343c9`. Прод tt-stack этой задачей не выкатывался.

Отдельно: даже когда ключи появятся в API, нынешняя страница их не покажет, пока браузер с `https://www.tastingandtoasting.com` не сможет прочитать ответ. Сейчас чтение режет CORS, раздел 4. Это не замена отсутствующим полям и не дефект «поля должны были появиться сегодня».

## 8. Что не делалось

Другие запросы не сливались. `--force`, `--admin`, squash и rebase не использовались. Render и ручной деплой не трогались. Боевые данные не писались.

## Product Change Impact

Описания #27 и #28 раздела `## Product Change Impact` не содержали. Слияние не останавливалось из-за этого: блокировка слияния решением владельца запрещена, разрешение на эти два запроса было.

Поведение, видимое пользователю, изменилось слитыми запросами лендинга.

| # | Поверхность | Что изменилось |
|---|---|---|
| 1 | Manuals | нет |
| 2 | Ask Max | нет |
| 3 | Prompts | нет |
| 4 | Navigation | нет |
| 5 | UI и экраны | страница паспорта вина: строки места, когда ответ их принесёт; шапка растёт, когда флаги переносятся (`wine-passport.html` на `53b20468`) |
| 6 | Routes | нет. `/w/:id` по-прежнему `308` |
| 7 | Onboarding | нет |
| 8 | Screenshots | кадр боя описан в разделе 6, в репозиторий не положен |
| 9 | Permissions | нет |
| 10 | Roles | нет |
| 11 | Terminology | подписи Country, Address, Locality есть в странице и не видны, пока полей нет в ответе |
| 12 | Public surfaces | `https://www.tastingandtoasting.com/wine-passport` и `/w/<id>` |
| 13 | Related features | UNKNOWN. Реестр feature_id в этом окне не открывался |
| 14 | Analytics | нет |
| 15 | Tests | нет нового теста в этом коммите. Красный тест #404 назван в разделе 2 |

- **Нужно ли обновление знания:** нет в этом окне. Поля в бою ещё не видны.
- **Нужен ли пересмотр prompt:** нет
- **Нужен ли пересмотр снимков:** нет. Кадр раздела 6 это проверка шапки, не манифест.
- **Задачи на потом:** починить красный тест #404 и слить его отдельно; CORS `www.tastingandtoasting.com` к публичному чтению вина не входит в эту задачу.

Затронутые `feature_id`: UNKNOWN

[31.10.2026 | FROM: DEV-CONTROL | TO: w-merge-winery | TASK: MERGE-WINERY-FIELDS-01 | REPO: tt-stack, tt-landing | BRANCH: слияния | FEATURE: сведения о винодельне и шапка | STATUS: BLOCKED]
