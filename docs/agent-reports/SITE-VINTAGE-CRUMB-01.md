# SITE-VINTAGE-CRUMB-01 — винодельня в крошках урожая

ПАСПОРТ ОКНА  
ИМЯ:     fix/site-vintage-crumb-01  
РЕПО:    tt-landing  
ПАПКА:   /Users/maximgeller/projects/tt-landing-vintage-crumb  
ВЕТКА:   fix/site-vintage-crumb-01  
ОТ:      6a2f6c84eb16a34568ce71f6a73052f0bced2bd6  
ЗАДАЧА:  второй запрос GET /wines/:id для крошки винодельни на vintage-passport.html  

## Симптом

Ответ `GET /vintages/:id` (фикстура `_tt-next-wave4/fixtures/vintage.json`) даёт `wine_id`, `wine_name`, `wine_slug`, но не `winery_name` / `winery_slug`. Крошки начинались с вина: «Tignanello / 2020». Эталон: `~/projects/_tt-next-wave4/canon/VintagePassport.dc.html:24-28` — «винодельня / вино / урожай».

## Правка

`vintage-passport.html`: после успешного урожая страница рисуется сразу; параллельно `fetchWineryForCrumb` вызывает `GET {API}/wines/<wine_id>`, подставляет `winery_name` и `winery_slug` и перерисовывает крошки (и кнопку Visit winery). Ошибка или пустой ответ вина — без сообщения на экране, крошки как раньше.

## Проверка

Мок полный: `node ~/projects/_tt-next-wave4/mock-cap-api.mjs` на `:8088` (уже слушал). Статика этого репо: `python3 -m http.server 8093` (порт `8090` занят чужим python с другой версией страницы). URL:  
`http://localhost:8093/vintage-passport.html?vintageId=70635a6d-3182-414c-97cb-96aaa8c9a9df`

| Снимок | Что |
|--------|-----|
| `before-1440.png` | До правки: только Tignanello / 2020 |
| `after-1440.png` | После: Marchesi Antinori / Tignanello / 2020, ссылка на `/winery-passport.html?slug=marchesi-antinori` |
| `no-wine-api-1440.png` | Мок только с `vintage.json` на `:8095`, `?api=http://localhost:8095/api/cap` — `/wines` → 404, страница 2020 без ошибки, крошка без винодельни |
| `break-1440.png` | То же, что `before-1440.png`: без вставки звена винодельни звена нет |

## Слом (контроль)

Убрана вставка звена → на снимке `before-1440.png` / `break-1440.png` первого звена винодельни нет; только вино и год.
