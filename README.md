# Vite + Pug + SCSS

Сборка проекта на Vite с Pug и SCSS. Многостраничный сайт с компонентным подходом и динамической загрузкой данных из JSON.

## 🚀 Быстрый старт

### Установка

Из-за конфликта зависимостей между Vite 8 и плагином `@mish.dev/vite-convert-pug-in-html` используйте:

```bash
npm install --legacy-peer-deps
```

### Работа с JSON
> Структура компонента содержит файл data.json
```
.
├── card.pug
├── card.scss
└── data.json
```
> Данные из data.json подгружаются автоматически и доступны в компонентах как глобальные переменные:
Папка компонента	Переменная
title/	TITLE_DATA
nav/	NAV_DATA
header/	HEADER_DATA

```
- const navData = typeof NAV_DATA !== 'undefined' ? NAV_DATA : {};
```
Но можно и без этого

⚙️ Конфигурация Vite
Проект использует кастомную сборку на Vite с набором плагинов для удобной разработки и сборки.

Основные возможности
Возможность	Описание
Pug + HTML	Автоматическая компиляция Pug в HTML
SCSS	Препроцессор с поддержкой импортов и миксинов
JSON-данные	Автоматическая загрузка data.json из компонентов
HMR	Горячая перезагрузка при изменении JSON
Плоская сборка	HTML-файлы собираются в корень dist/ без папок
Копирование ассетов	fonts/ и img/ копируются в сборку
Автодобавление .html	Внутренние ссылки получают расширение при сборке
Структура данных в компонентах
Каждый компонент в src/components/ может содержать data.json:

text
src/components/
├── title/
│   └── data.json     → TITLE_DATA
├── nav/
│   └── data.json     → NAV_DATA
└── footer/
    └── data.json     → FOOTER_DATA
Переменная создаётся автоматически: [ИМЯ_ПАПКИ]_DATA

Пример использования в Pug:

pug
- const data = typeof TITLE_DATA !== 'undefined' ? TITLE_DATA : {};
Сборка
bash
npm run build
Результат:

text
dist/
├── index.html
├── about.html
├── contact.html
├── fonts/           # скопировано из src/fonts/
├── img/             # скопировано из src/img/
└── assets/
    ├── main.js
    └── main.css
Разработка
bash
npm run dev
Сервер запускается на http://localhost:5173

Страницы доступны как /about, /contact (без .html)

Изменения в data.json → автоматическая перезагрузка

Плагины
Плагин	Назначение
pugJsonHmr	Отслеживает изменения data.json, инвалидирует модули, перезагружает страницу
flattenHtmlOutput	Перемещает HTML из папок в корень dist/
copyAssetsPlugin	Копирует fonts/ и img/ в сборку
addHtmlExtensionPlugin	Добавляет .html к внутренним ссылкам при сборке
devServerHtmlResolver	Позволяет открывать страницы без .html в dev-режиме
Переменные окружения
Для работы с JSON-данными используется dataProxy — объект с геттерами, который читает файлы при каждом обращении. Это позволяет обновлять данные без перезапуска сервера.

Зависимости
json
{
  "devDependencies": {
    "@mish.dev/vite-convert-pug-in-html": "^2.0.0",
    "pug": "^3.0.4",
    "sass": "^1.101.0",
    "vite": "^8.1.3"
  }
}
⚠️ Важно: При установке используйте --legacy-peer-deps из-за конфликта версий Vite и плагина:

bash
npm install --legacy-peer-deps
