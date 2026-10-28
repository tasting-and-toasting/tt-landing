# JOIN-TEXT-HONEST-01 — отчёт

**Репозиторий:** tasting-and-toasting/tt-landing  
**Ветка:** fix/join-text-honest-01  
**origin/main на старте:** `8d1305f62f120974867fc19ac914f4eb3b71b87c`  
**Режим:** implement (не read-only)

## Рамка владельца (дословно)

«Существующий сценарий не менять. QR должен открывать приложение Tasting & Toasting и передавать код игры. Промежуточную веб-страницу оставить. Это fallback для телефонов без приложения, Android при проблемах с App Links и компьютеров. Исправить ложный текст "Вы у нужной двери". Страница не должна подтверждать существование игры без проверки. Новый API проверки кодов не создавать.»

## 1. Тексты экрана при верной форме кода (до правки)

Источник разметки: `join/index.html` функция `renderCode()` (строки шаблона до правки — см. `origin/main`).

| Строка (main) | Ключ / элемент | Текст (EN fallback в HTML) | Утверждает существование игры? |
|---------------|----------------|----------------------------|--------------------------------|
| 275 | `join_kick` | Guest entry | Нет |
| 276 | `join_title_ok` | You're at the right door | **Да** — «нужная дверь» = верная игра/мероприятие |
| 277 | `join_body_ok` | This is the code for tonight's tasting. Open the app to take your seat. | **Да** — «сегодняшняя дегустация», «ваше место» |
| 279 | `join_code_label` | Your game code | Нет (подпись формата, не проверка игры) |
| 280 | (значение) | `{code}` | Нет |
| 281 | `join_pass_note` (если `?pass=`) | A prepaid seat is attached to this link. | Нет (факт параметра в ссылке, не проверка игры) |
| 283 | `join_open_app` | Open in the app | Нет |
| 284 | `join_hint_open` | …opens it on your seat… | **Да** — «ваше место» без проверки (не менялось по объёму задачи: правка title/body) |
| 251–252 | `join_no_app_*` | No app on this phone? / …seats you at the tasting… | Частично («место за столом») — блок **не трогали** по заданию |
| 287–293 | `join_byhand_*`, шаги | Entering it by hand / Type {code} | Нет |
| 296 | `join_footnote_*` | Wrong code? / Enter a different one | Нет |

Русские строки до правки: `src/i18n/tt141-features.json:2281-2282` — «Вы у нужной двери», «Это код сегодняшней дегустации…» (**да**, те же утверждения).

## 2. Что изменено

### `join/index.html:276-277`

| | Было | Стало |
|---|------|-------|
| EN title | You're at the right door | Your code is ready |
| EN body | This is the code for tonight's tasting. Open the app to take your seat. | Tap below to open the app with this code. |

### `src/i18n/tt141-features.json:745-746` (en)

| | Было | Стало |
|---|------|-------|
| `join_title_ok` | You're at the right door | Your code is ready |
| `join_body_ok` | This is the code for tonight's tasting. Open the app to take your seat. | Tap below to open the app with this code. |

### `src/i18n/tt141-features.json:2281-2282` (ru)

| | Было | Стало |
|---|------|-------|
| `join_title_ok` | Вы у нужной двери | Код записан |
| `join_body_ok` | Это код сегодняшней дегустации. Откройте приложение, чтобы занять своё место. | Нажмите кнопку ниже — приложение откроется с этим кодом. |

**Не менялось:** `vercel.json`, App Links, кнопка «Открыть в приложении», `appLink()`, блок «нет приложения», три шага ручного ввода, серверная проверка (по-прежнему отсутствует — см. `join/index.html:121-128`).

## 3. Проверка в браузере

Локально: `python3 -m http.server 8765` из корня репозитория. Без rewrite Vercel код передаётся как `?code=` (логика `readCode()` — `join/index.html:217-220`).

### Верная форма (6 символов)

- URL: `http://127.0.0.1:8765/join/index.html?code=ABC234&lang=ru`
- Заголовок: **Код записан**
- Текст: **Нажмите кнопку ниже — приложение откроется с этим кодом.**
- Пластина кода: **ABC234**
- Кнопка: **Открыть в приложении**

### Неверная форма (5 символов)

- URL: `http://127.0.0.1:8765/join/index.html?code=ABC12&lang=ru`
- Заголовок: **Этот код не похож на правильный**
- Текст: **Код игры — ровно шесть символов…** (без изменений)
- Поле с значением **ABC12**, кнопка **Продолжить**

## 4. Кнопка «Открыть в приложении» — адрес не изменился

Формирование ссылки (без изменений в diff):

**До (`origin/main`), `join/index.html:237-239`:**

```javascript
  function appLink(code, pass) {
    var url = APP_SCHEME + '://join/' + encodeURIComponent(code);
    return pass ? url + '?pass=' + encodeURIComponent(pass) : url;
```

**После (рабочая копия), `join/index.html:237-239` — те же строки.**

Вставка в кнопку: `join/index.html:283` — по-прежнему `href="' + esc(appLink(code, pass)) + '"`.

Проверка в браузере для `code=ABC234`: `href` = `tastingandtoasting://join/ABC234` (CDP `Runtime.evaluate` на `#open-app`).

## 5. Статус

**Completed** — тексты title/body на экране «код принят по форме» приведены к честным формулировкам; сценарий и deep link без изменений; проверка в браузере выполнена локально (не production deploy).
