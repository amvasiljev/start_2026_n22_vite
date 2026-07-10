markdown
# 📱 Инструкция по использованию слайдера

## 🚀 Быстрый старт

### 1. Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
2. Базовая структура HTML
html
<div class="slider" data-app-slider="опции">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Слайд 1</div>
    <div class="swiper-slide">Слайд 2</div>
    <div class="swiper-slide">Слайд 3</div>
  </div>
  
  <!-- Пагинация (точки) -->
  <div class="swiper-pagination"></div>
  
  <!-- Стрелки -->
  <button data-app-slider-arrow="prev" aria-label="Назад">
    <svg><!-- иконка стрелки --></svg>
  </button>
  <button data-app-slider-arrow="next" aria-label="Вперед">
    <svg><!-- иконка стрелки --></svg>
  </button>
</div>
3. Инициализация JS
javascript
let sliders = document.querySelectorAll('[data-app-slider]');
sliderAll(sliders);
📖 Атрибут data-app-slider
Все настройки слайдера передаются через атрибут data-app-slider. Опции разделяются пробелом.

Правила написания
Правило	Пример
Опции через пробел	slides:3 gap:20 loop
Значение через двоеточие	slides:2, gap:20, auto:5000
Флаги без значения	free, loop, center
Пустой атрибут	data-app-slider=""
⚙️ Доступные опции
Опция	По умолчанию	Пример	Что делает
slides:число	auto	slides:2	Количество слайдов на экране
gap:число	0	gap:20	Отступ между слайдами (px)
free	выкл	free	Свободная прокрутка с инерцией
loop	выкл	loop	Бесконечная прокрутка
center	выкл	center	Центрирование активного слайда
auto	выкл	auto	Автопрокрутка (3000 мс)
auto:число	3000	auto:5000	Автопрокрутка с задержкой
fraction	выкл	fraction	Дробная пагинация (1 / 5)
fade	выкл	fade	Эффект затухания
space	выкл	space	Спецрежим (fade + fraction)
🎯 Атрибут data-app-slider-arrow
Для стрелок используется атрибут data-app-slider-arrow со значением prev или next.

Примеры
html
<!-- Кнопка "назад" -->
<button data-app-slider-arrow="prev" aria-label="Назад">
  <svg>...</svg>
</button>

<!-- Кнопка "вперед" -->
<button data-app-slider-arrow="next" aria-label="Вперед">
  <svg>...</svg>
</button>

<!-- С дополнительным модификатором для стилей -->
<button data-app-slider-arrow="default prev" aria-label="Назад">
  <svg>...</svg>
</button>
Важно: JS ищет наличие слов prev или next в атрибуте. Модификаторы (например default) не влияют на работу, только на стили.

📝 Примеры использования
Обычный слайдер с 3 слайдами
html
<div class="slider" data-app-slider="slides:3 gap:20">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Слайд 1</div>
    <div class="swiper-slide">Слайд 2</div>
    <div class="swiper-slide">Слайд 3</div>
  </div>
  <div class="swiper-pagination"></div>
  <button data-app-slider-arrow="prev">←</button>
  <button data-app-slider-arrow="next">→</button>
</div>
Бесконечная карусель с автопрокруткой
html
<div class="slider" data-app-slider="loop slides:3 auto:4000 gap:15">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Слайд 1</div>
    <div class="swiper-slide">Слайд 2</div>
    <div class="swiper-slide">Слайд 3</div>
  </div>
  <div class="swiper-pagination"></div>
  <button data-app-slider-arrow="prev">←</button>
  <button data-app-slider-arrow="next">→</button>
</div>
Галерея со свободной прокруткой
html
<div class="slider" data-app-slider="free slides:2.5 gap:15 center">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Изображение 1</div>
    <div class="swiper-slide">Изображение 2</div>
    <div class="swiper-slide">Изображение 3</div>
  </div>
  <div class="swiper-pagination"></div>
  <button data-app-slider-arrow="prev">←</button>
  <button data-app-slider-arrow="next">→</button>
</div>
Слайдер с дробной пагинацией
html
<div class="slider" data-app-slider="fraction slides:1">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Слайд 1</div>
    <div class="swiper-slide">Слайд 2</div>
    <div class="swiper-slide">Слайд 3</div>
  </div>
  <div class="swiper-pagination"></div>
  <button data-app-slider-arrow="prev">←</button>
  <button data-app-slider-arrow="next">→</button>
</div>
Эффект fade
html
<div class="slider" data-app-slider="fade slides:1 auto:3000">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Слайд 1</div>
    <div class="swiper-slide">Слайд 2</div>
  </div>
  <div class="swiper-pagination"></div>
  <button data-app-slider-arrow="prev">←</button>
  <button data-app-slider-arrow="next">→</button>
</div>
🎨 Стилизация стрелок (пример)
scss
[data-app-slider-arrow] {
  aspect-ratio: 1/1;
  cursor: pointer;
  background: transparent;
  border: none;
  color: black;
  transition: color 0.2s ease;
  
  &:hover {
    color: #007aff;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

[data-app-slider-arrow] svg {
  width: 44px;
  height: 44px;
  display: block;
}
⚠️ Важные замечания
Условие	Требование
loop	минимум 3 слайда
fade	рекомендуется slides:1
free	по умолчанию выключен
Стрелки	могут быть в любом месте внутри .slider
Пагинация	опциональна, класс .swiper-pagination
🔧 Troubleshooting
Проблема	Решение
Слайдер не инициализируется	Проверьте атрибут data-app-slider
Стрелки не работают	Проверьте атрибут data-app-slider-arrow="prev/next"
Несколько слайдеров конфликтуют	Каждый получает уникальные атрибуты автоматически
Автоплей не работает	Проверьте что нет конфликта с free
📋 Структура Pug миксина (для справки)
pug
mixin slider(attr, news)
  if news
    div(data-app-slider=attr)
      div(data-app-slider-options)
        +title('Заголовок', '', '', 'h2')
        div(data-app-slider-arrows)
          button(data-app-slider-arrow="default prev" aria-label="Назад")
            svg.slider__svg
              use(xlink:href= img + "sprite.svg#svg_arrow_slider")
          button(data-app-slider-arrow="default next" aria-label="Вперед")
            svg.slider__svg
              use(xlink:href= img + "sprite.svg#svg_arrow_slider")
      .swiper
        .swiper-wrapper
          .swiper-slide
            p Слайд 1
          .swiper-slide
            p Слайд 2
        .swiper-pagination
Версия: 1.0

text

Ширина слайда = (Ширина контейнера - (Количество_видимых_слайдов - 1) * margin) / Количество_видимых_слайдов


[data-app-slider~=service] {

    $slide-gap: #{clampValue(600, 1440, 16, 30)};
    .swiper{

        @include m_320{
            margin-right: -28px;
        }

        &-slide{
            width: calc((100% - 2 * $slide-gap) / 3);
            margin-right: $slide-gap;

            @include m_768{
                width: calc((100% - $slide-gap) / 2);
            }

            @include m_320{
                width: 280px;
            }
        }
    }
    
}