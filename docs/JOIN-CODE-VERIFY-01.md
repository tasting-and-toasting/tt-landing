# JOIN-CODE-VERIFY-01

**Задача:** страница `/join/<CODE>` не должна подтверждать несуществующий код.  
**Репозиторий:** `tasting-and-toasting/tt-landing`  
**Ветка:** `fix/join-code-verify-01`  
**База на выдачу задачи:** `origin/main` @ `8d1305f62f120974867fc19ac914f4eb3b71b87c`  
**Дата:** 28.10.2026  

## FIRST GATE (28.10.2026)

| Проверка | Факт |
|----------|------|
| `pwd` | `/Users/maximgeller/projects/tt-landing-joincheck` |
| `git remote -v` | `origin` → `git@github.com:tasting-and-toasting/tt-landing.git` |
| `git branch --show-current` | `fix/join-code-verify-01` |
| `git status` | чисто |
| `git rev-parse origin/main` | `8d1305f62f120974867fc19ac914f4eb3b71b87c` |

## 1. Разбор `join/index.html` (до правки)

### Проверка формы кода (шесть символов A–Z0–9)

| Что | Строки |
|-----|--------|
| Регулярное выражение `CODE_SHAPE` | `join/index.html:155` |
| `normalizeCode()` — очистка и тест формы | `join/index.html:201–205` |
| Чтение кода из URL (`readCode`) | `join/index.html:217–228` |
| Валидация при отправке формы | `join/index.html:339–357` |
| Решение «код есть» → экран подтверждения | `join/index.html:363–365` |

Серверный запрос **не выполняется**: явно задокументировано в `join/index.html:121–128`.

### Ссылка в приложение

| Что | Строки |
|-----|--------|
| Схема `APP_SCHEME` | `join/index.html:166` |
| Сборка URL `appLink(code, pass)` | `join/index.html:237–240` |
| Кнопка «Open in the app» / `href` | `join/index.html:283` |

Пример цели: `tastingandtoasting://join/<CODE>` (`join/index.html:238`).

### Текст «Вы у нужной двери»

| Язык | Где |
|------|-----|
| Английский fallback в разметке | `join/index.html:276` (`join_title_ok`: «You're at the right door») |
| Русский в словаре i18n | `src/i18n/tt141-features.json:2281` (`join_title_ok`: «Вы у нужной двери») |
| Тело под русским заголовком | `src/i18n/tt141-features.json:2282` (`join_body_ok`) |

Экран рисуется функцией `renderCode()` — `join/index.html:272–298`.

## 2. Поиск серверной «двери» (есть ли игра по коду без токена)

### В этом репозитории (`tt-landing`)

| Проверка | Результат |
|----------|-----------|
| Каталог `api/` | **нет** (0 файлов) |
| `fetch` / `XMLHttpRequest` в `join/` | **нет** |
| `vercel.json` rewrites для join | только `/join/:code` → `/join?code=:code` (`vercel.json:45–46`) |
| Другие страницы: API CAP | `https://tt-stack-prod.onrender.com/api/cap` (например `bottle-scan.html:138`) — **не** join |

### То, что страница уже вызывает

**Ничего.** Единственные внешние ресурсы join-страницы: шрифты Google и `/src/i18n/apply-tt141.js` (`join/index.html:9–18`).

### Смежный код (вне scope правок, для факта)

| Источник | Факт |
|----------|------|
| `join/index.html:121–128` | Пре-авторизационного резолвера кода **нет намеренно** (оракул по кодам). |
| `tt-mobile/lib/games/joinLink.ts:14–20` | То же решение: код тратится только через `POST /v2/games/join` с токеном. |
| `tt-stack/api/src/routes/v2_games.ts:1991–1993` | `POST /games/join` с `{ preHandler: fastify.authenticate }` — **не** публичная проверка «есть ли игра». |
| `curl https://tt-stack-prod.onrender.com/api/join/XQJVT4` | HTTP **404**, тело `NotFound` (28.10.2026). |
| `curl https://www.tastingandtoasting.com/api/join/XQJVT4` | HTTP **404** (28.10.2026). |

**Вывод:** готовой HTTP-«двери», которую landing может вызвать **до** показа «Вы у нужной двери», **не найдено**. Придумывать URL или прокси в `tt-landing` запрещено условием задачи.

## 3. Реализация

**Не выполнялась.** Остановка на п. 2 задачи — ждёт решения владельца (новый публичный контракт в `tt-stack` или иной согласованный endpoint).

## 4. Красный контроль (прод, до правки)

**URL:** `https://www.tastingandtoasting.com/join/XQJVT4?lang=ru`  
**Код XQJVT4:** выдуманный (игры нет — по условию задачи).

Наблюдение в браузере (28.10.2026):

- Заголовок: **«Вы у нужной двери»** (соответствует `join_title_ok` / `tt141-features.json:2281`).
- Код на экране: **XQJVT4**.
- Кнопка: **«Открыть в приложении»** (ref link `tastingandtoasting://join/XQJVT4` — логика `join/index.html:237–240`, `283`).

Скриншот: `page-2026-10-28T11-04-51-497Z.png` (сессия browser MCP).

Тот же дефект для `NWTED7` vs `XQJVT4` на проде подтверждён владельцем 28.10.2026 (слово в слово один экран) — поведение согласуется с `join/index.html:363–365` (любой код правильной **формы** → `renderCode`).

## 5. Зелёный контроль и поломка проверки

| Шаг | Статус |
|-----|--------|
| После правки на выдуманном коде — отказ | **не выполнен** (нет реализации) |
| Намеренно сломать проверку → снова ложное подтверждение | **не выполнен** |
| Настоящий код NWTED7 → приложение | **не проверялся агентом на телефоне**; сценарий владельца 28.10 (QR → регистрация → вход) **не трогался** |

## 6. Что гость видит сегодня (три случая)

| Случай | Поведение (факт кода) |
|--------|------------------------|
| Код формата 6×A–Z0–9 | Экран «Вы у нужной двери», кнопка в приложение (`renderCode`, `join/index.html:272–283`) |
| Код не той формы | Экран «That code doesn't look right» / форма (`renderEntry`, `join/index.html:300–310`) |
| «Кода нет в базе» | **Не различается** от «код есть» — отдельного состояния **нет** |

После будущей реализации (при появлении серверной двери) целевое поведение описано в DEV-CONTROL: найден → как сейчас; не найден → честный текст, без кнопки; сбой сети → код + нейтральный текст.

## 7. Изменения в репозитории

| Файл | Изменение |
|------|-----------|
| `join/index.html` | **не менялся** (BLOCKED) |
| `docs/JOIN-CODE-VERIFY-01.md` | этот отчёт |

## 8. PR

Ссылка: *(заполнить после `gh pr create`)*

---

[28.10.2026 | FROM: DEV-CONTROL | TO: CURSOR | TASK: JOIN-CODE-VERIFY-01 | REPO: tt-landing | BRANCH: fix/join-code-verify-01 | FEATURE: страница входа не подтверждает несуществующий код | STATUS: BLOCKED]
