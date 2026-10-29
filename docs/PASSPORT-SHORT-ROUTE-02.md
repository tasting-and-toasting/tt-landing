# PASSPORT-SHORT-ROUTE-02 — короткий адрес паспорта через переадресацию

**Репозиторий:** `tasting-and-toasting/tt-landing`  
**Ветка:** `feature/passport-short-route-02` (от `origin/main`, вершина `8d1305f`)  
**Дата:** 29.10.2026  
**Изменённый файл:** только `vercel.json`

---

## 0. Решение владельца (дословно)

«Утверждаю короткий постоянный адрес, ведущий на существующую публичную страницу паспорта. Использовать существующий идентификатор паспорта и существующую архитектуру маршрутов. Не создавать второй паспорт.»

**Контракт:** `https://www.tastingandtoasting.com/w/<идентификатор>` переадресует на существующую страницу паспорта с тем же идентификатором в строке запроса (`wineId`). Страница паспорта читает идентификатор только из query: `wine-passport.html:114-115`.

---

## 1. Виды правил в `vercel.json` (до и после задачи)

| Вид | Строки | Назначение | Пример из файла |
|-----|--------|------------|-----------------|
| `cleanUrls` | `vercel.json:2` | Убирает `.html` из публичных URL | Не отдельное правило; эффект: `/wine-passport` → `wine-passport.html` |
| `trailingSlash` | `vercel.json:3` | Запрет завершающего `/` в каноническом URL | `false` — без пример-правила в массиве |
| `headers` | `vercel.json:4-26` | Добавляет HTTP-заголовки по маске пути | `source: "/(.*)"` + `X-Frame-Options` (`vercel.json:6-10`); точечно `/.well-known/apple-app-site-association` (`vercel.json:13-17`) |
| `redirects` | `vercel.json:27-33` | **Переадресация:** ответ 307/308, браузер меняет адрес в строке | **Новое:** `/w/:id` → `/wine-passport?wineId=:id`, `permanent: true` (`vercel.json:28-31`) |
| `rewrites` | `vercel.json:34-59` | **Подмена пути:** сервер отдаёт другой ресурс, **URL в браузере не меняется** | `/join/:code` → `/join?code=:code` (`vercel.json:51-54`); `/cap/b/:token` → `/bottle-scan?token=:token` (`vercel.json:43-46`) |

### Переадресация vs подмена пути

- **Переадресация (`redirects`):** клиент получает `Location`, переходит на новый URL; относительные пути скриптов и стилей считаются от **нового** пути. Подходит для `/w/:id`, потому что страница паспорта ожидает `wineId` в query, а не в сегменте пути.
- **Подмена (`rewrites`):** браузер остаётся на `/w/...`, query может быть пустым — как на живой двери `/cap/b/TESTTOKEN`; относительный `src/i18n/cap-i18n.js` уходит в `/w/src/...` и даёт 404. Эту модель для паспорта **не** используем.

---

## 2. Добавленное правило

```json
{
  "source": "/w/:id",
  "destination": "/wine-passport?wineId=:id",
  "permanent": true
}
```

**Расположение:** `vercel.json:28-31`.

**Постоянная переадресация (308):** короткий URL задуман как стабильная точка входа для QR; связь «короткий путь → каноническая страница с query» не меняется, кэширование 308 безопасно для неизменяемого контракта.

**Не тронуто:** `wine-passport.html`, `join/index.html`, `.well-known/**`, rewrite `/cap/b/:token` (`vercel.json:43-46`).

---

## 3. Длина короткого адреса

Шаблон: `https://www.tastingandtoasting.com/w/` + идентификатор UUID (36 символов).

```
python3 -c "u='https://www.tastingandtoasting.com/w/'+'a'*8+'-'+'a'*4+'-'+'a'*4+'-'+'a'*4+'-'+'a'*12; print(len(u.encode('utf-8')))"
→ 73
```

**73 байта** (UTF-8), лимит QR **78** — не превышен.

---

## 4. Локальная проверка

**Среда:** `npx vercel dev --listen 3456 --scope maksims-projects-2ee098b0 --yes` в `~/projects/tt-landing-shortw2` (вывод CLI: `Ready! Available at http://localhost:3456`).

| Шаг | URL | Наблюдение |
|-----|-----|------------|
| Короткий | `http://localhost:3456/w/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa` | `HTTP/1.1 308 Permanent Redirect`, `location: /wine-passport?wineId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa` |
| Полный (после перехода) | `http://localhost:3456/wine-passport?wineId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa` | `HTTP/1.1 200 OK`, `Content-Type: text/html`, тело содержит `<script src="src/i18n/cap-i18n.js">` (`wine-passport.html:10`) |
| Скрипт с канонического пути | `http://localhost:3456/src/i18n/cap-i18n.js` | `HTTP/1.1 200 OK` (не 404) |

Идентификатор на полном адресе — в query (`wineId=...`); страница по-прежнему читает его через `URLSearchParams(location.search)` (`wine-passport.html:114-115`).

**После выкатки владелец:** открыть `https://www.tastingandtoasting.com/w/<реальный wineId 36 символов>` — адресная строка должна стать `/wine-passport?wineId=<тот же id>`, страница загружается, в Network нет 404 на `/src/i18n/cap-i18n.js`.

---

## 5. Статус

**DONE** — правило в `vercel.json`, локальная проверка через `vercel dev` пройдена, деплой не выполнялся (по заданию).
