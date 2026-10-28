# PASSPORT-SHORT-ROUTE-01

29.10.2026. Репозиторий `tasting-and-toasting/tt-landing`. Ветка `feature/passport-short-route-01`. Вершина `8d1305f62f120974867fc19ac914f4eb3b71b87c` (`git rev-parse HEAD` и `git rev-parse origin/main` совпали). Рабочее дерево до этого файла было чистым (`git status`).

Правило для `/w/:id` не добавлено. `vercel.json` не менялся.

## Образец, дословно

`vercel.json:37-38`:

```
      "source": "/cap/b/:token",
      "destination": "/bottle-scan?token=:token"
```

Объект целиком: `vercel.json:36-39`. Механизм: путь `/cap/b/:token` переписывается на `/bottle-scan`, а сегмент `:token` подставляется в запрос `?token=:token`.

Страница бутылки читает этот сегмент только из запроса. `bottle-scan.html:133-134`:

```
const qs = new URLSearchParams(location.search);
const token = (qs.get('token') || '').trim();
```

`pathname` в `bottle-scan.html` не читается (поиск `pathname` по файлу — нет совпадений).

## Почему стоп

Паспорт вина тоже читает идентификатор только из запроса. `wine-passport.html:114-115`:

```
const qs = new URLSearchParams(location.search);
const wineId = (qs.get('wineId') || '').trim();
```

Путь страница не читает: поиск `pathname` по `wine-passport.html` совпадений не дал. Пустой идентификатор обрывает загрузку. `wine-passport.html:269`: `if (!wineId) { renderNotFound(); return; }`.

Задание на этот случай: остановиться и показать, что правило должно превращать путь в запрос, как образец выше. Правило не написано. `wine-passport.html`, `join/index.html`, `.well-known/**` и остальные страницы не менялись. Деплоя не было.

## Что образец делает в браузере

Живой адрес `https://www.tastingandtoasting.com/cap/b/TESTTOKEN` отдаёт страницу бутылки: `curl -sI` дал `HTTP/2 200` и `content-disposition: inline; filename="bottle-scan"`.

В браузере на этом же адресе адресная строка осталась короткой, а запрос пустой:

`href` = `https://www.tastingandtoasting.com/cap/b/TESTTOKEN`  
`pathname` = `/cap/b/TESTTOKEN`  
`search` = пустая строка

Скрипт страницы задан относительным путём. `bottle-scan.html:10`: `<script src="src/i18n/cap-i18n.js"></script>`. С этого короткого адреса браузер запросил `https://www.tastingandtoasting.com/cap/b/src/i18n/cap-i18n.js`, ответ `404`, `CAP` — `undefined`, блок `#app` пустой.

У паспорта тот же относительный скрипт. `wine-passport.html:10`: `<script src="src/i18n/cap-i18n.js"></script>`. Короткий адрес `/w/<идентификатор>` в браузере не проверялся: правила нет.

Дверь гостя читает код и из запроса, и из пути. `join/index.html:213-228`. Паспорт так не умеет.

## Длина адреса

Настоящий идентификатор паспорта не получен. `GET https://tt-stack-prod.onrender.com/api/cap/wines` и `GET https://tt-stack-prod.onrender.com/api/cap/wineries` оба вернули `404` и тело `{"error":"NotFound","message":"The requested resource was not found."}`. В этом репозитории готового идентификатора нет. Длина полного адреса с настоящим идентификатором: NOT_VERIFIED.

Префиксы посчитаны в байтах (UTF-8, совпадает с числом символов):

| Строка | Байты |
|---|---|
| `https://www.tastingandtoasting.com/w/` | 37 |
| `https://www.tastingandtoasting.com/wine-passport?wineId=` | 56 |
| `https://www.tastingandtoasting.com/wine-passport.html?wineId=` | 61 |

Сравнение с пределом 78 байт для полного адреса: не сделано, идентификатор NOT_VERIFIED.

## Локальная проверка двух адресов

Не сделана. Короткого правила нет, поэтому короткий адрес паспорта не открывался.
