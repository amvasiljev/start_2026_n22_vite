// vite.config.js
import { defineConfig } from 'vite';
import { viteConvertPugInHtml } from '@mish.dev/vite-convert-pug-in-html';
import { readFileSync, existsSync, readdirSync, statSync, renameSync, mkdirSync, rmSync, copyFileSync } from 'fs';
import { resolve, join, dirname, basename, relative } from 'path';
import autoprefixer from 'autoprefixer';
const componentsDir = resolve(__dirname, 'src/components');
const srcDir = resolve(__dirname, 'src');

// Рекурсивно находим все data.json
function findDataFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findDataFiles(fullPath));
    } else if (item === 'data.json') {
      results.push(fullPath);
    }
  }
  return results;
}

// Создаём объект с геттерами, который читает JSON "на лету"
function createDataProxy() {
  const proxy = {};

  function updateProxy() {
    const dataFiles = findDataFiles(componentsDir);

    Object.keys(proxy).forEach(key => delete proxy[key]);

    for (const filePath of dataFiles) {
      try {
        const componentName = basename(dirname(filePath));
        const varName = componentName.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_DATA';

        Object.defineProperty(proxy, varName, {
          get() {
            try {
              const content = readFileSync(filePath, 'utf-8');
              const parsed = JSON.parse(content);
              return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                ? parsed
                : {};
            } catch (e) {
              console.error(`⚠️  Error reading ${filePath}:`, e.message);
              return {};
            }
          },
          enumerable: true,
          configurable: true
        });
      } catch (error) {
        console.error(`⚠️  Error setting up ${filePath}:`, error.message);
      }
    }
  }

  updateProxy();

  return { proxy, updateProxy };
}

// 🎯 Плагин для копирования ассетов с сохранением структуры
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const assetsToCopy = ['fonts', 'img'];

      for (const assetName of assetsToCopy) {
        const srcPath = join(srcDir, assetName);
        const destPath = join(distDir, assetName);

        if (existsSync(srcPath)) {
          copyDirRecursive(srcPath, destPath);
          console.log(`✅ Copied: ${assetName}/`);
        }
      }
    }
  };
}

// Рекурсивное копирование папки
function copyDirRecursive(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const items = readdirSync(src);
  for (const item of items) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// 🎯 Плагин для перемещения HTML-файлов из папок в корень после сборки
function flattenHtmlOutput() {
  return {
    name: 'flatten-html-output',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      
      if (!existsSync(distDir)) return;

      const items = readdirSync(distDir);
      
      for (const item of items) {
        const itemPath = join(distDir, item);
        const stat = statSync(itemPath);

        if (stat.isDirectory() && !['assets', 'fonts', 'img', 'public'].includes(item)) {
          const htmlFile = join(itemPath, 'index.html');
          
          if (existsSync(htmlFile)) {
            const newFileName = `${item}.html`;
            const newPath = join(distDir, newFileName);
            
            renameSync(htmlFile, newPath);
            console.log(`✅ Moved: ${item}/index.html → ${newFileName}`);
            
            try {
              rmSync(itemPath, { recursive: true, force: true });
            } catch (e) {
              console.warn(`⚠️  Could not remove folder ${item}:`, e.message);
            }
          }
        }
      }
    }
  };
}

// 🎯 Плагин для добавления .html к внутренним ссылкам при сборке
function addHtmlExtensionPlugin() {
  return {
    name: 'add-html-extension',
    apply: 'build', // Только при сборке
    transformIndexHtml(html) {
      // Заменяем href="/xxx" на href="/xxx.html"
      // Не трогаем: внешние ссылки (http), якоря (#), файлы с расширениями
      return html.replace(
        /href="(\/[^"#?]+)"/g,
        (match, path) => {
          // Если уже есть расширение — не трогаем
          if (/\.[a-z0-9]+$/i.test(path)) return match;
          // Если это корень — не трогаем
          if (path === '/') return match;
          return `href="${path}.html"`;
        }
      );
    }
  };
}

// Кастомный плагин для быстрого HMR с инвалидацией модулей
function pugJsonHmr() {
  let serverInstance = null;
  let reloadTimeout = null;

  return {
    name: 'pug-json-hmr',
    configureServer(server) {
      serverInstance = server;
      server.watcher.add(componentsDir);

      const isDataJson = (path) =>
        path.endsWith('data.json') && path.includes(componentsDir);

      function invalidateHtmlModules() {
        try {
          const moduleGraph = server.moduleGraph;
          if (!moduleGraph) return;

          const moduleMap = moduleGraph.idToModuleMap || moduleGraph.moduleMap;
          if (!moduleMap || typeof moduleMap.entries !== 'function') return;

          for (const [id, module] of moduleMap.entries()) {
            if (id.endsWith('.html') || id.endsWith('.pug')) {
              moduleGraph.invalidateModule(module);
            }
          }
        } catch (e) {
          console.error('⚠️  Error invalidating modules:', e.message);
        }
      }

      function debouncedReload() {
        if (reloadTimeout) clearTimeout(reloadTimeout);
        reloadTimeout = setTimeout(() => {
          try {
            server.ws.send({ type: 'full-reload' });
          } catch (e) {
            console.error('⚠️  Error sending reload:', e.message);
          }
        }, 150);
      }

      server.watcher.on('change', (changedPath) => {
        if (isDataJson(changedPath)) {
          const relativePath = changedPath.replace(resolve(__dirname) + '/', '');
          console.log(`\n🔄 ${relativePath} changed!`);
          invalidateHtmlModules();
          debouncedReload();
        }
      });

      server.watcher.on('add', (addedPath) => {
        if (isDataJson(addedPath)) {
          const relativePath = addedPath.replace(resolve(__dirname) + '/', '');
          console.log(`\n➕ New component: ${relativePath}`);

          if (serverInstance._dataProxy) {
            serverInstance._dataProxy.updateProxy();
          }

          invalidateHtmlModules();
          debouncedReload();
        }
      });

      server.watcher.on('unlink', (removedPath) => {
        if (isDataJson(removedPath)) {
          const relativePath = removedPath.replace(resolve(__dirname) + '/', '');
          console.log(`\n🗑️  Component removed: ${relativePath}`);

          if (serverInstance._dataProxy) {
            serverInstance._dataProxy.updateProxy();
          }

          invalidateHtmlModules();
          debouncedReload();
        }
      });
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith('data.json') && file.includes(componentsDir)) {
        try {
          const moduleGraph = server.moduleGraph;
          if (!moduleGraph) return;

          const moduleMap = moduleGraph.idToModuleMap || moduleGraph.moduleMap;
          if (!moduleMap || typeof moduleMap.entries !== 'function') return;

          const modulesToInvalidate = [];

          for (const [id, module] of moduleMap.entries()) {
            if (id.endsWith('.html') || id.endsWith('.pug')) {
              modulesToInvalidate.push(module);
            }
          }

          if (modulesToInvalidate.length > 0) {
            console.log(`\n🔥 Invalidating ${modulesToInvalidate.length} HTML/Pug modules...`);
            return modulesToInvalidate;
          }
        } catch (e) {
          console.error('⚠️  Error in handleHotUpdate:', e.message);
        }
      }
    }
  };
}

// 🎯 Middleware для dev server — резолвит /contacts → /contacts.html
function devServerHtmlResolver() {
  return {
    name: 'dev-server-html-resolver',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0].split('#')[0];
        
        // Не трогаем ассеты и уже существующие пути
        if (url.includes('.') || url === '/') return next();
        
        // Пробуем найти файл с .html
        const htmlPath = resolve(srcDir, `${url}.html`);
        if (existsSync(htmlPath)) {
          req.url = `${url}.html`;
        }
        
        next();
      });
    }
  };
}

// Создаём proxy с геттерами
const { proxy: dataProxy, updateProxy } = createDataProxy();
dataProxy._updateProxy = updateProxy;

// Показываем найденные файлы при старте
const initialFiles = findDataFiles(componentsDir);
console.log(`\n📦 Found ${initialFiles.length} data.json files:`);
initialFiles.forEach(file => {
  console.log(`   ✓ ${file.replace(resolve(__dirname) + '/', '')}`);
});

export default defineConfig({
  root: 'src',
  publicDir: resolve(__dirname, 'public'),
  plugins: [
    pugJsonHmr(),
    viteConvertPugInHtml({
      locals: dataProxy
    }),
    flattenHtmlOutput(),
    copyAssetsPlugin(),
    addHtmlExtensionPlugin(), // 🎯 Добавляет .html при сборке
    devServerHtmlResolver() // 🎯 Резолвит без .html в dev
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      }
    }
  },
  server: {
    open: true,
  },
  css: {
     postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead']
        })
      ]
    },
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import'],
        quietDeps: true,
      }
    }
  }
});