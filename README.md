# Pulse Website

**Русский** · [English](README.en.md)

Публичный сайт проекта [Pulse](https://github.com/HubbaBubbaPrepod/pulse-monitor): Next.js 16, React 19, GSAP. Две языковые версии, светлая и тёмная темы, интерактивное превью, адаптивные анимации. На сайте нет аккаунтов, серверной телеметрии, аналитики и рекламных трекеров.

Сайт: **https://pulse.hubba-cloud.ru/**. Он отделён от приватных экземпляров монитора.

## Разработка

Node.js 22.13+:

```sh
npm ci
npm run dev
```

Локальный адрес: http://127.0.0.1:3095. Проверки перед публикацией:

```sh
npm run lint
npm run build
npm test
```

`next build` экспортирует HTML, CSS и JS в `out`. Для предпросмотра экспорта можно запустить любой статический HTTP-сервер с корнем `out`. Сайт не требует работающего Node.js на хостинге.

## Публикация и домен

GitHub Pages → Source: **GitHub Actions**. Workflow `.github/workflows/pages.yml` собирает, проверяет и публикует `main`. В настройках Pages укажите `pulse.hubba-cloud.ru`; `public/CNAME` содержит тот же домен.

DNS: `CNAME pulse → Hubbabubbaprepod.github.io` (DNS only на время проверки и выпуска сертификата). После выпуска сертификата включите **Enforce HTTPS** в Pages. Домен и HTTPS проверяются отдельно от успешной сборки.

## SEO

Статический HTML всех страниц; уникальные title/description, canonical, взаимные RU/EN hreflang с x-default, Open Graph и Twitter Card, JSON-LD WebSite/WebPage/SoftwareSourceCode/BreadcrumbList, `robots.txt`, `sitemap.xml`, `llms.txt`, SVG favicon и PNG apple-touch-icon. Sitemap и robots генерируются при сборке. Изменение домена требует обновить `lib/site.js`, `public/CNAME`, `public/llms.txt` и настройки Pages.

Проверки `scripts/site.test.mjs` читают готовый экспорт, проверяют SEO, язык, структурированные данные и локальные ссылки. Индексация, позиции поиска и полевые Core Web Vitals не гарантируются сборкой; после запуска проверьте домен в Google Search Console и Яндекс Вебмастере, отправьте sitemap.

## Контент и motion

Тексты RU/EN: `lib/site.js`. Страницы: `components/Site.jsx`; hero: `components/Hero.jsx`; GSAP: `components/Motion.jsx`. Основной текст доступен без JS; интерактивное превью загружается отдельно со скелетоном. Данные в превью иллюстративные, не реальные показатели пользователей. `prefers-reduced-motion` отключает анимации. Декоративные изображения серверов и контейнеров созданны специально для сайта; промпты — в `design/assets.json`.

Сейчас каталог описывает независимый Docker-модуль. Публикация пользовательских модулей через сайт потребует отдельного backend и пока не реализована.

## Лицензия

[MIT](LICENSE). Зависимости сохраняют свои лицензии.
