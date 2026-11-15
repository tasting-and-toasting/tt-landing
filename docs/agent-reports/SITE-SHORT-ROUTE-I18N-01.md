# SITE-SHORT-ROUTE-I18N-01 · tt-landing · короткая ссылка с QR-наклейки грузит языки

FROM: T&T NEXT → TO: T&T NEXT · ветка `SITE-SHORT-ROUTE-I18N-01` · дата 2026-11-15

## Что было
`/cap/b/<token>` в `vercel.json` сделан через rewrite на `/bottle-scan?token=:token`. Браузер при этом остаётся на `/cap/b/<token>`, поэтому:

1. **Языки.** `<script src="src/i18n/cap-i18n.js">` разрешался в `/cap/b/src/i18n/cap-i18n.js` и получал 404 (на проде сейчас: `curl -I https://www.tastingandtoasting.com/cap/b/src/i18n/cap-i18n.js` → `HTTP/2 404`). Без него `window.CAP` не определён, и скрипт страницы падает на первой строке. Гость видит пустую страницу, а не просто английский текст.
2. **Токен** (найдено по ходу работы, та же причина). Страница брала токен только из `?token=`. Rewrite не переносит query в адресную строку браузера, поэтому `location.search` пустой. Даже со скриптом страница показала бы «не найдено» и для настоящей бутылки.
3. **Ссылки с бутылки** (найдено по ходу работы). `pageHref('wine-passport.html', …)` давал относительную ссылку. С `/cap/b/<token>` она вела на `/cap/b/wine-passport.html?…`, а этот адрес снова совпадает с `/cap/b/:token` и открывает bottle-scan с токеном `wine-passport.html`.

## Что сделано
| Файл | Изменение |
|---|---|
| `bottle-scan.html`, `wine-passport.html`, `vintage-passport.html`, `winery-passport.html` | `src="src/i18n/cap-i18n.js"` → `src="/src/i18n/cap-i18n.js"`. Остальные подключения (`/src/passport/tt-head.css`, `/src/passport/tt-head.js`, `/assets/tt-logo.svg`, Google Fonts) уже были абсолютными. |
| `bottle-scan.html` | `pathToken()`: если `?token=` нет, токен берётся из пути `/cap/b/<token>` (с `decodeURIComponent`). `pageHref()` теперь даёт абсолютные ссылки: `/wine-passport?…` на сайте и `/wine-passport.html?…` при локальном открытии `.html`. Так же уже работает `href()` в wine/vintage. |
| `winery-passport.html` | `pageHref()` переведён на ту же абсолютную схему, для единообразия. На своём адресе страница и раньше работала. |
| `vercel.json` | **Не менялся.** Rewrite `/cap/b/:token` → `/bottle-scan?token=:token` корректен: он совпадает только с одним сегментом пути, файлы из корня Vercel отдаёт раньше rewrites, `/src/...` и `/assets/...` он не перехватывает. Redirect вместо rewrite не нужен: короткий адрес остаётся в строке браузера, как на наклейке. |
| `tools/passport-check/serve-vercel.js` | Локальный сервер, который применяет `vercel.json` (cleanUrls, rewrites, redirects). У `python -m http.server` нет rewrite, поэтому `/cap/b/…` локально раньше проверить было нечем. |
| `tools/passport-check/check-short-route.js` | Проверка короткого адреса в Playwright. API `/api/cap/**` заглушён ответом 404, на бэкенд не уходит ни одного запроса, сканирование не записывается. |

## Чем доказано
Токен везде фиктивный: `zz-not-a-real-token-0001`. Настоящий токен не вызывался.

**После правки** (`node tools/passport-check/serve-vercel.js 8766` + `check-short-route.js`), результат `ALL OK`:
- на всех 12 языках (en fr ru es uk it de he pt ka ro pl): `200 http://127.0.0.1:8766/src/i18n/cap-i18n.js`, `window.CAP` есть, запрос уходит на `/scan/zz-not-a-real-token-0001` (токен взят из пути), `html lang` совпадает с языком (he → `dir=rtl`, pt → `pt-PT`), 12 флагов, текущий флаг подсвечен;
- экран «не найдено»: 12 разных заголовков из 12, например ru «Мы не смогли это подтвердить. Такого кода нет в наших записях.», he «לא הצלחנו לאשר זאת. הקוד הזה אינו ברשומות שלנו.», ka «ამას ვერ დავადასტურებთ. ასეთი კოდი ჩვენს ჩანაწერებში არ არის.»;
- переключатель: открыть `/cap/b/<token>` без `?lang`, кликнуть флаг ru → адрес `/cap/b/zz-not-a-real-token-0001?lang=ru`, `lang=ru`, русский заголовок;
- ссылки с бутылки: `/wine-passport?wineId=w1&lang=ru`, `/winery-passport?slug=s1&lang=ru`, `/vintage-passport?vintageId=v1&lang=ru`;
- страницы на своих адресах (`/bottle-scan?token=…`, `/wine-passport?…`, `/vintage-passport?…`, `/winery-passport?…`): `cap-i18n.js` 200, `CAP` есть.

**До правки** (тот же тест на `HEAD` = origin/main, распакован через `git archive`): на каждом проверенном языке `404 http://127.0.0.1:8767/cap/b/src/i18n/cap-i18n.js`, `window.CAP missing`, `token from path not sent to /scan/`, `no not-found heading`. Прогон я прервал на ro (11 языков из 12), когда останавливал серверы; результат на всех 11 одинаковый. Тест воспроизводит прод-баг.

**Регресс:** `check-golden-master.js --no-shots` на изменённых страницах дал `CHECK PASSED` (6 вин × 2 ширины + винодельня × 2 ширины, живые данные прод-API, только чтение).

**Превью Vercel** (PR #34, автосборка `tt-landing-3fl4-git-site-short-a83481-…vercel.app`; превью закрыто Vercel Authentication, открыто в Chrome под сессией владельца, только чтение):
- `/cap/b/zz-not-a-real-token-0001?lang=ru`: `/src/i18n/cap-i18n.js` → 200, `CAP` есть, 12 флагов, `lang=ru`;
- клик по флагу de → `/cap/b/zz-not-a-real-token-0001?lang=de`, страница на немецком; запрос ушёл на `…/api/cap/scan/zz-not-a-real-token-0001`, то есть токен взят из пути;
- без `?api` на превью показывается экран **ошибки**, а не «не найдено»: прод-API отвечает CORS только для `www.tastingandtoasting.com`, у fetch status=0. Это свойство домена превью, не баг страницы. На проде origin разрешён;
- экран «не найдено» проверен с `?api=/__no-api__`: same-origin 404 самого превью, на бэкенд ничего не уходит. На всех 12 языках cap-i18n.js → 200, `html lang` совпадает (he `dir=rtl`, pt `pt-PT`), заголовки «не найдено» переведены на все 12 языков, тексты те же, что в локальной проверке.

## Не тронуто / вне задачи
- `cap-onboarding.html` и `cap-qr-sticker.html` тоже подключают `src/i18n/cap-i18n.js` относительным путём. Это не страницы паспорта, и под rewrite они не отдаются, так что сейчас ничего не ломается. Можно перевести отдельной мелкой задачей.
- Merge, deploy, Render и настройки Vercel не трогал.
