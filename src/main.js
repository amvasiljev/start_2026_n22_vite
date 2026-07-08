// src/main.js
console.log('🚀 Vite + Pug + SCSS работает!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Страница загружена');
});

window.onload = function () {
  let preloader = document.getElementById('preloader');
  preloader.classList.add('hide-preloader');
  setInterval(function () {
    preloader.classList.add('preloader-hidden');
  }, 990);
}

Fancybox.bind('[data-fancybox]', {
  // Custom options for all galleries
});
// fancybox end




// mask 



let formValidate = document.querySelectorAll('[data-app-form~="validate"]');

for (let form of formValidate) {

  let inputTel = form.querySelector('input[type=tel]');

  const maskOptions = {
    mask: '+{7} (000) 000-00-00',
    placeholderChar: '_',
    // lazy: false,  
  };
  const mask = IMask(inputTel, maskOptions);
}

// mask end 

document.querySelectorAll('[data-app-form~="validate"]').forEach(form => {
  const button = form.querySelector('[type="submit"]');
  const checkbox = form.querySelector('[data-check]');

  if (!button || !checkbox) return;

  button.disabled = !checkbox.checked;

  form.addEventListener('change', () => {
    button.disabled = !checkbox.checked;
  });
});




// default slider 



let sliders = document.querySelectorAll('[data-app-slider]');

sliderAll(sliders);

function sliderAll(elements) {
  elements.forEach((slider, idx) => {
    const index = idx + 1;
    const config = slider.getAttribute('data-app-slider') || '';

    // Парсим опции
    const opts = {};
    if (config) {
      config.split(' ').forEach(part => {
        part = part.trim();
        if (part === '') return;
        if (part.includes(':')) {
          const colonIndex = part.indexOf(':');
          const key = part.substring(0, colonIndex);
          const value = part.substring(colonIndex + 1);
          opts[key] = value;
        } else {
          opts[part] = true;
        }
      });
    }

    // Определяем количество слайдов
    let slidesPerView = 'auto';
    if (opts.slides) {
      const slidesValue = opts.slides;
      if (slidesValue === 'auto') {
        slidesPerView = 'auto';
      } else {
        const parsed = parseFloat(slidesValue);
        slidesPerView = isNaN(parsed) ? 'auto' : parsed;
      }
    }

    // Базовые настройки
    const settings = {
      spaceBetween: 0,
      slidesPerView: slidesPerView,
      effect: false,
      loop: false,
      initialSlide: 0,
      centeredSlides: false,
      freeMode: false,
      autoplay: false,
      speed: 500,
      paginationType: 'bullets'
    };

    // free - включает свободную прокрутку
    if (opts.free) {
      settings.freeMode = true;
    }

    if (opts.space) {
      settings.spaceBetween = false;
      settings.effect = 'fade';
      settings.paginationType = 'fraction';
    }

    if (opts.fraction) {
      settings.paginationType = 'fraction';
    }

    if (opts.loop) {
      settings.loop = true;
      settings.initialSlide = 0;
    }

    if (opts.center) {
      settings.centeredSlides = true;
    }

    if (opts.fade) {
      settings.effect = 'fade';
    }

    if (opts.auto) {
      const delay = opts.auto === true ? 3000 : parseInt(opts.auto);
      settings.autoplay = {
        delay: isNaN(delay) ? 3000 : delay,
        disableOnInteraction: false,
      };
    }

    if (opts.gap) {
      const gap = parseInt(opts.gap);
      settings.spaceBetween = isNaN(gap) ? 0 : gap;
    }

    // Добавляем уникальный класс слайдеру
    slider.classList.add(`swiper${index}`);

    // Поиск стрелок по атрибуту data-app-slider-arrow
    const nextBtn = slider.querySelector('[data-direction="next"]');
    const prevBtn = slider.querySelector('[data-direction="prev"]');

    // Добавляем уникальные атрибуты для стрелок
    if (nextBtn) nextBtn.setAttribute('data-app-slider-next', index);
    if (prevBtn) prevBtn.setAttribute('data-app-slider-prev', index);

    // Находим контейнер swiper
    const swiperContainer = slider.querySelector('.swiper');
    if (!swiperContainer) {
      console.error('Swiper container not found in slider', index);
      return;
    }
    swiperContainer.classList.add(`swiper${index}`);

    // Поиск блока пагинации
    const paginationBlock = slider.querySelector('[data-app-slider-pagination]');
    let paginationConfig = null;

    if (paginationBlock) {
      // Ищем .swiper-pagination внутри блока
      let paginationEl = paginationBlock.querySelector('.swiper-pagination');

      if (!paginationEl) {
        // Если нет .swiper-pagination, создаем его
        paginationEl = document.createElement('div');
        paginationEl.className = 'swiper-pagination';
        paginationBlock.appendChild(paginationEl);
      }

      // Добавляем уникальный атрибут
      paginationEl.setAttribute('data-app-slider-pagination-id', index);

      // Настройка пагинации
      paginationConfig = {
        el: `[data-app-slider-pagination-id="${index}"]`,
        clickable: true,
        type: settings.paginationType
      };

      if (settings.paginationType === 'fraction') {
        paginationConfig.renderFraction = function (currentClass, totalClass) {
          return '<span class="' + currentClass + '"></span>' +
            '<span class="fraction-separator"> / </span>' +
            '<span class="' + totalClass + '"></span>';
        };
      }
    } else {
      // Если нет блока пагинации, ищем стандартную
      const defaultPagination = slider.querySelector('.swiper-pagination');
      if (defaultPagination) {
        paginationConfig = {
          el: defaultPagination,
          clickable: true,
          type: settings.paginationType
        };

        if (settings.paginationType === 'fraction') {
          paginationConfig.renderFraction = function (currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span>' +
              '<span class="fraction-separator"> / </span>' +
              '<span class="' + totalClass + '"></span>';
          };
        }
      }
    }

    // Инициализация Swiper
    new Swiper(swiperContainer, {
      centeredSlides: settings.centeredSlides,
      slidesPerView: settings.slidesPerView,
      spaceBetween: settings.spaceBetween,
      effect: settings.effect || undefined,
      speed: settings.speed,
      loop: settings.loop,
      initialSlide: settings.initialSlide,
      autoplay: settings.autoplay,
      freeMode: settings.freeMode,
      pagination: paginationConfig,
      navigation: {
        nextEl: `[data-app-slider-next="${index}"]`,
        prevEl: `[data-app-slider-prev="${index}"]`,
      },
    });
  });
}

// slider default end



const burger = document.querySelector('[data-app-button~="burger"]');


const navMobile = document.querySelector('[data-app-nav-panel]');
const navBody = document.querySelector('body');
const navClose = document.querySelector('[data-app-button~="panel-close"]');
const navOverlay = document.querySelector('[data-app-nav-overlay]');

const toggleElements = [burger, navMobile, navBody];

function toggleActive() {
  toggleElements.forEach(el => {
    if (el) el.toggleAttribute('active');
    
  });
}

if (burger) {

  burger.addEventListener('click', toggleActive);
 

  if (navClose) {
    navClose.addEventListener('click', toggleActive);
  }
  navOverlay?.addEventListener('click', toggleActive);
  
}



// cookies 

const panel = document.querySelector('[data-app-cookies]');

if (panel) {
  const closeButton = document.querySelector('[data-app-button~="cookies"]');
  const crossButton = document.querySelector('[data-app-button~="cross"]');
  
  if (Cookies.get('policy_cookie2') === undefined) {
    setTimeout(function () {
      panel.setAttribute('data-visible', 'true');
    }, 2000);
  } else {
    panel.removeAttribute('data-visible');
  }
  
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      panel.removeAttribute('data-visible');
      Cookies.set('policy_cookie2', 'policy_cookie2', { expires: 7 });
    });
  }
  
  if (crossButton) {
    crossButton.addEventListener('click', function () {
      panel.removeAttribute('data-visible');
    });
  }
}


// table clear 
function cleanAndWrapAllTables() {

    if (!document || typeof document.querySelectorAll !== 'function') return;
    
    // Находим ВСЕ блоки data-app-text на странице
    const appTextBlocks = document.querySelectorAll('div[data-app-text]');
    
    // Проверка на существование блоков
    if (!appTextBlocks || appTextBlocks.length === 0) return;
    
    let totalTablesProcessed = 0;
    
    appTextBlocks.forEach((block, blockIndex) => {
        // Проверка существования блока
        if (!block || !block.querySelectorAll) return;
        
        // Находим все таблицы внутри текущего блока
        const tables = block.querySelectorAll('table');
        
        // Проверка на существование таблиц
        if (!tables || tables.length === 0) return;
        
        tables.forEach((table, tableIndex) => {
            // Проверка существования таблицы
            if (!table) return;
            
            // Очищаем инлайновые стили
            cleanInlineStyles(table);
            
    
            if (table.parentNode && table.parentNode.nodeType === 1 && 
                !table.parentNode.hasAttribute('data-app-text-table')) {
                
                // Создаём обёртку
                const wrapper = document.createElement('div');
                wrapper.setAttribute('data-app-text-table', '');
                wrapper.setAttribute('data-block-index', blockIndex);
                wrapper.setAttribute('data-table-index', tableIndex);
                
                // Оборачиваем таблицу
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
                totalTablesProcessed++;
            }
        });
    });
    
    // Логирование для отладки (опционально)
    if (totalTablesProcessed > 0 && console && console.log) {
        console.log(`Обработано ${totalTablesProcessed} таблиц`);
    }
}

function cleanInlineStyles(element) {
    // Проверка существования элемента
    if (!element || typeof element.removeAttribute !== 'function') return;
    
    // Удаляем style атрибут
    if (element.hasAttribute('style')) {
        element.removeAttribute('style');
    }
    

    const attrsToRemove = [
        'width', 'height', 'border', 'cellspacing', 'cellpadding',
        'align', 'valign', 'bgcolor', 'bordercolor', 'frame', 'rules',
        'style', 'class'
    ];
    
    attrsToRemove.forEach(attr => {
        if (element.hasAttribute && element.hasAttribute(attr)) {
            element.removeAttribute(attr);
        }
    });
    

    if (element.children && element.children.length > 0) {
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i] && children[i].nodeType === 1) {
                cleanInlineStyles(children[i]);
            }
        }
    }
}


if (document && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
  
        if (typeof cleanAndWrapAllTables === 'function') {
            setTimeout(cleanAndWrapAllTables, 50);
        }
    });
}


if (document && document.readyState === 'loading') {
    // Ждём событие
} else {
  
    if (typeof cleanAndWrapAllTables === 'function') {
        setTimeout(cleanAndWrapAllTables, 50);
    }
}




// faq


document.addEventListener('DOMContentLoaded', function () {
  const allDetails = document.querySelectorAll('[data-app-faq-list] details');

  // Инициализация
  allDetails.forEach(function (details) {
    const answer = details.querySelector('[itemprop="acceptedAnswer"]');

    if (!details.hasAttribute('open')) {
      answer.style.display = 'none';
    }
  });

  // Один обработчик для всех аккордеонов
  document.addEventListener('click', function (e) {
    const summary = e.target.closest('[data-app-faq-list] details summary');
    if (!summary) return;

    e.preventDefault();

    const details = summary.parentElement;
    const answer = details.querySelector('[itemprop="acceptedAnswer"]');
    const wasOpen = answer.style.display !== 'none' && getComputedStyle(answer).display !== 'none';

    // Находим родительский список
    const faqList = details.closest('[data-app-faq-list]');

    // Закрываем все открытые в этом же списке
    faqList.querySelectorAll('details').forEach(function (otherDetails) {
      if (otherDetails !== details) {
        const otherAnswer = otherDetails.querySelector('[itemprop="acceptedAnswer"]');
        const otherWasOpen = otherAnswer.style.display !== 'none' && getComputedStyle(otherAnswer).display !== 'none';

        if (otherWasOpen) {
          slideUp(otherAnswer, 300, function () {
            otherDetails.removeAttribute('open');
            // Сохраняем display: none
            otherAnswer.style.display = 'none';
          });
        }
      }
    });

    // Переключаем текущий
    if (wasOpen) {
      slideUp(answer, 300, function () {
        details.removeAttribute('open');
        // Сохраняем display: none
        answer.style.display = 'none';
      });
    } else {
      // Убираем display: none перед slideDown
      answer.style.display = 'block';
      slideDown(answer, 300);
      details.setAttribute('open', 'open');
    }
  });

  function slideUp(element, duration, callback) {
    // Получаем текущие стили
    const height = element.offsetHeight;
    const paddingTop = getComputedStyle(element).paddingTop;
    const paddingBottom = getComputedStyle(element).paddingBottom;
    const marginTop = getComputedStyle(element).marginTop;
    const marginBottom = getComputedStyle(element).marginBottom;

    // Сохраняем исходные значения
    element.dataset.originalPaddingTop = paddingTop;
    element.dataset.originalPaddingBottom = paddingBottom;
    element.dataset.originalMarginTop = marginTop;
    element.dataset.originalMarginBottom = marginBottom;

    element.style.boxSizing = 'border-box';
    element.style.transition = `height ${duration}ms ease, padding ${duration}ms ease, margin ${duration}ms ease`;
    element.style.height = height + 'px';
    element.style.overflow = 'hidden';

    element.offsetHeight; // принудительный reflow

    element.style.height = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';

    setTimeout(function () {
      element.style.display = 'none';
      // Очищаем только анимационные стили
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition');

      if (callback) callback();
    }, duration);
  }

  function slideDown(element, duration) {
    // Восстанавливаем исходные padding и margin
    if (element.dataset.originalPaddingTop) {
      element.style.paddingTop = element.dataset.originalPaddingTop;
      element.style.paddingBottom = element.dataset.originalPaddingBottom;
      element.style.marginTop = element.dataset.originalMarginTop;
      element.style.marginBottom = element.dataset.originalMarginBottom;
    }

    element.style.display = 'block';
    element.style.overflow = 'hidden';
    element.style.boxSizing = 'border-box';

    // Получаем полную высоту
    const height = element.scrollHeight;

    // Начинаем с 0
    element.style.height = '0';

    // Принудительный reflow
    element.offsetHeight;

    // Анимируем до полной высоты
    element.style.transition = `height ${duration}ms ease`;
    element.style.height = height + 'px';

    setTimeout(function () {
      // Убираем только анимационные стили, оставляем padding/margin
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition');
    }, duration);
  }
});


// faq end



// Dialogs 


// (() => {
//   'use strict';

//   const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
//   const lightboxDialog = document.getElementById('lightbox');
//   const lightboxImg = lightboxDialog?.querySelector('img');
  
//   // Хранилище уже инициализированных элементов (защита от дублей)
//   const initialized = new WeakSet();

//   // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
  
//   const hasToken = (attr, token) => attr?.split(/\s+/).includes(token);
//   const getImageSrc = (img, fallback = PLACEHOLDER) => img?.currentSrc || img?.src || fallback;
  
//   const updateDialogImage = (sourceImg, dialogImg) => {
//     if (!sourceImg || !dialogImg) return;
//     const newSrc = getImageSrc(sourceImg);
//     if (dialogImg.src !== newSrc) {
//       dialogImg.src = newSrc;
//       dialogImg.alt = sourceImg.alt || dialogImg.alt;
//       dialogImg.loading = 'eager';
//     }
//   };
  
//   const closeDialog = (targetDialog) => {
//     if (!targetDialog) return;
//     const img = targetDialog.querySelector('img');
//     if (img) img.setAttribute('src', PLACEHOLDER);
//     targetDialog.close();
//   };
  
//   const getCardByTrigger = (btn) => btn.closest('[data-app-card~="dialog"]');

//   // === ИНИЦИАЛИЗАЦИЯ ТРИГГЕРОВ (можно вызывать многократно) ===
//   const initTriggers = (root = document) => {
//     root.querySelectorAll('[data-dialog-open]').forEach(btn => {
//       // Пропускаем уже обработанные
//       if (initialized.has(btn)) return;
//       initialized.add(btn);
      
//       btn.addEventListener('click', e => {
//         const dialogId = btn.dataset.dialogOpen;
//         const dialog = document.getElementById(dialogId);
//         if (!dialog) return;
        
//         e.preventDefault();
//         e.stopPropagation();
        
//         // Подстановка картинки только для лайтбокса
//         if (hasToken(dialogId, 'lightbox') || hasToken(dialog.dataset.appDialog, 'lightbox')) {
//           const card = getCardByTrigger(btn);
//           const sourceImg = card?.querySelector('img');
//           updateDialogImage(sourceImg, dialog.querySelector('img'));
//         }
//         dialog.showModal();
//       });
//     });
//   };

//   // === ОБЩИЕ ОБРАБОТЧИКИ (вешаются ОДИН РАЗ на document) ===
//   const initGlobalHandlers = () => {
//     // Закрытие: делегирование (работает для ВСЕХ диалогов, даже динамических)
//     document.addEventListener('click', e => {
//       const closeBtn = e.target.closest('[data-dialog-close]');
//       const isBackdrop = e.target instanceof HTMLDialogElement && e.target.open;
//       if (closeBtn || isBackdrop) {
//         const targetDialog = closeBtn?.closest('dialog') || e.target;
//         closeDialog(targetDialog);
//       }
//     });
    
//     // Esc для лайтбокса
//     if (lightboxDialog) {
//       lightboxDialog.addEventListener('close', () => {
//         lightboxImg?.setAttribute('src', PLACEHOLDER);
//       });
//     }
    
//     // Клик по карточке (делегирование через document)
//     document.addEventListener('click', e => {
//       const card = e.target.closest('[data-app-card~="dialog"]');
//       if (!card) return;
//       // Игнорируем интерактивные элементы
//       if (e.target.closest('a, button, input, textarea, select')) return;
      
//       const triggerBtn = card.querySelector('[data-dialog-open]');
//       if (hasToken(triggerBtn?.dataset.dialogOpen, 'lightbox')) {
//         triggerBtn.click();
//       }
//     }, { capture: true }); // capture: true, чтобы сработало раньше stopPropagation
//   };

//   // === ПУБЛИЧНЫЙ API для внешнего вызова ===
//   window.Dialogs = {
//     // Вызывать после вставки нового контента через AJAX
//     init: (root = document) => initTriggers(root),
//     // Принудительно переинициализировать всё (редко нужно)
//     reinit: () => {
//       initialized.clear();
//       initTriggers();
//     }
//   };

//   // === СТАРТ ===
//   if (lightboxDialog && lightboxImg) {
//     initGlobalHandlers();  // один раз
//     initTriggers();        // при загрузке страницы
//   } else {
//     console.warn('Dialog #lightbox not found');
//   }
  
// })();