# Vite + Pug + SCSS

Сборка проекта на Vite с Pug и SCSS. Многостраничный сайт с компонентным подходом и динамической загрузкой данных из JSON.

## 🚀 Быстрый старт

### Установка

Из-за конфликта зависимостей между Vite 8 и плагином `@mish.dev/vite-convert-pug-in-html` используйте:

```bash
npm install --legacy-peer-deps
```

## 🧩 Компоненты
Каждый компонент может содержать:

- component.pug — шаблон (миксин)

- data.json — данные компонента

- component.scss — стили

## Структура data.json
```json
{
  "presetName": {
    "type": "h1",
    "attr": "default fsz-46 black",
    "text": "Заголовок",
    "subtext": "Подзаголовок"
  }
}
```
## Использование компонента
```pug
include components/title/title

+title({
  preset: 'heroMain'
})
```
```pug
include components/nav/nav

+nav({
  type: 'header',
  maxLevel: 3
})
```
## 📦 Данные из JSON

Данные из `data.json` подгружаются автоматически и доступны в компонентах как глобальные переменные:

| Папка компонента | Переменная |
|------------------|------------|
| `title/` | `TITLE_DATA` |
| `nav/` | `NAV_DATA` |
| `header/` | `HEADER_DATA` |
| `footer/` | `FOOTER_DATA` |

```pug
- const data = typeof TITLE_DATA !== 'undefined' ? TITLE_DATA : {};
- const preset = data['heroMain'] || {};
h1= preset.text || 'Заголовок по умолчанию'
```

## 🎨 Стили
SCSS с поддержкой:
Переменные (_vars.scss)

- Миксины (_mixins.scss)
- Медиа-запросы
- Компонентные стили

Пример использования миксина:

```scss
@include m_320 {
  text-align: center;
}
```
Импорты в main.scss:

```scss
@import './utils/vars';
@import './utils/reset';
@import './utils/fonts';
@import './utils/mixins';
@import './utils/libs';
```

## 📄 Страницы
Все страницы лежат в src/pages/. После сборки в dist/ появляются HTML-файлы:
```text
dist/
├── index.html
├── about.html
├── contact.html
├── fonts/
├── img/
└── assets/
    ├── main.js
    └── main.css
```

## ⚙️ Конфигурация Vite
## ⚙️ Основные возможности

| Возможность | Описание |
|-------------|----------|
| **Pug + HTML** | Автоматическая компиляция Pug в HTML |
| **SCSS** | Препроцессор с поддержкой импортов и миксинов |
| **JSON-данные** | Автоматическая загрузка `data.json` из компонентов |
| **HMR** | Горячая перезагрузка при изменении JSON |
| **Плоская сборка** | HTML-файлы собираются в корень `dist/` без папок |
| **Копирование ассетов** | `fonts/` и `img/` копируются в сборку |
| **Автодобавление .html** | Внутренние ссылки получают расширение при сборке |