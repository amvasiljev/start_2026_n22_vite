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