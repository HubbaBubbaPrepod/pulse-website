import { legal } from './legal.mjs';
import { guideContent, guideSlugs, publicationDate } from './guides.js';
export const origin = 'https://pulse.hubba-cloud.ru';
export const github = 'https://github.com/HubbaBubbaPrepod';
export const pages = [
  '',
  'features',
  'install',
  'modules',
  'modules/docker',
  'guides',
  ...guideSlugs.map((slug) => 'guides/' + slug),
  ...Object.keys(legal.documents),
];
export function url(lang, slug = '') {
  return `${lang === 'en' ? '/en' : ''}/${slug ? `${slug}/` : ''}`;
}
export const copy = {
  ru: {
    nav: ['Возможности', 'Модули', 'Документация'],
    install: 'Установить Pulse',
    explore: 'Смотреть возможности',
    heading: ['Твои серверы.', 'Под полным контролем.'],
    intro: 'Ресурсы, процессы, сеть и логи — в одной панели.',
    scroll: 'Листай, чтобы увидеть больше',
    theme: 'Переключить тему',
    menu: 'Открыть меню',
    skip: 'Перейти к содержимому',
    featuresTitle: 'Всё, что происходит. В одном месте.',
    featuresIntro:
      'От нагрузки процессора до сетевых соединений. Переключай серверы, находи нужный процесс и смотри историю событий.',
    featureItems: [
      [
        'Ресурсы без догадок',
        'CPU, память, диски и доступные GPU. История нагрузки и графики показывают изменения во времени.',
      ],
      [
        'Процессы в деталях',
        'Находи процессы, сортируй по памяти и CPU, смотри PID и потребление ресурсов.',
      ],
      [
        'Сеть под контролем',
        'Скорость интерфейсов, сетевые соединения, локальные и удалённые адреса. Захват пакетов доступен при настройке TShark.',
      ],
      [
        'Логи с историей',
        'Системные события и журналы приложений, которые собирает агент. Фильтры по серверу, источнику и уровню.',
      ],
      [
        'Твой интерфейс',
        'Светлая и тёмная темы, редактор цветов и шрифтов, компактный режим. Панель подстраивается под твой экран.',
      ],
      [
        'Обновления в реальном времени',
        'Следи за свежими данными через поток обновлений или выбирай удобный интервал отображения.',
      ],
    ],
    demoLabel: 'Интерактивное превью · демонстрационные данные',
    demoTitle: 'Обзор сервера',
    demoTabs: ['Ресурсы', 'Процессы', 'Сеть', 'Логи'],
    stageTitle: 'Инфраструктура сложная. Наблюдение — простое.',
    stageIntro:
      'Монитор работает на твоём сервере. Агенты собирают данные на других узлах. Ты открываешь панель с любого устройства.',
    browser: 'Твой браузер',
    monitor: 'Твой монитор',
    agent: 'Go-агент',
    ownTitle: 'Твои данные остаются у тебя.',
    ownIntro:
      'Pulse — самостоятельное решение с открытым кодом. Сам выбираешь, где хранить данные и кто получает доступ к панели.',
    ownItems: [
      ['Self-hosted', 'Разверни монитор в своей инфраструктуре.'],
      ['Open source', 'Читай код, участвуй и создавай свои модули.'],
      ['MIT', 'Используй и изменяй по условиям лицензии MIT.'],
    ],
    modulesTitle: 'Больше, чем мониторинг.',
    modulesIntro:
      'Расширяй Pulse отдельными модулями. Подключи Docker или создай интеграцию для своей инфраструктуры.',
    dockerIntro:
      'Контейнеры, текущая нагрузка CPU, память, сетевые счётчики и логи. Независимый модуль с собственным репозиторием.',
    openModule: 'Открыть модуль',
    makeModule: 'Создать свой модуль',
    catalog: 'Каталог модулей',
    stepsTitle: 'Три шага до контроля.',
    steps: [
      ['Разверни монитор', 'Скачай готовый релиз, запусти монитор и создай аккаунт владельца.'],
      [
        'Подключи агенты',
        'Добавь сервер в панели и запусти Go-агент с адресом монитора и токеном узла.',
      ],
      [
        'Открой панель',
        'Смотри данные, подключай модули и настраивай интерфейс с любого устройства.',
      ],
    ],
    docs: 'Читать документацию',
    faqTitle: 'Без лишних вопросов.',
    faq: [
      [
        'Pulse бесплатный?',
        'Да. Код монитора, агента и Docker-модуля опубликован под лицензией MIT. Ты самостоятельно оплачиваешь только свою инфраструктуру.',
      ],
      [
        'Нужен отдельный агент?',
        'Да. Go-агент работает на каждом наблюдаемом сервере и отправляет данные твоему монитору. Монитор и агент распространяются отдельно.',
      ],
      [
        'Поддерживаются Linux и Windows?',
        'Да. В релизах есть сборки для Linux amd64, Linux arm64 и Windows amd64. Доступность некоторых метрик зависит от ОС, драйверов и прав агента.',
      ],
      [
        'Куда отправляются данные?',
        'На адрес твоего монитора. Этот публичный сайт описывает проект и не собирает телеметрию с твоих серверов.',
      ],
      [
        'Можно подключать свои модули?',
        'Да. Модули расширяют Agent и Monitor. WASI-компоненты работают через посредника с разрешениями; нативные компоненты требуют полного доверия. Исходники и каждую версию проверяй до установки.',
      ],
    ],
    closing: 'Вся инфраструктура. Твоя точка контроля.',
    closingIntro: 'Установи Pulse и начни наблюдать за своими серверами.',
    source: 'Исходный код',
    license: 'Открытый код · MIT',
    privacy: 'Без аналитики и рекламных трекеров',
    installTitle: 'Установка Pulse Monitor и Go-агента',
    installIntro:
      'Разверни монитор на одном сервере и подключи агенты на остальных узлах. Данные будут храниться в твоей инфраструктуре.',
    catalogIntro:
      'Независимые расширения для Pulse. Модули и темы публикуются через GitHub и проходят модерацию в Marketplace. Подключение каталога в Monitor добровольное; ручной импорт JSON сохраняется.',
    dockerTitle: 'Docker-модуль для Pulse',
    dockerNote:
      'Устанавливается через раздел «Модули» в твоей панели. Docker 3 использует WASI и посредника Agent; чтение, логи и управление разрешаются отдельно для каждого сервера.',
  },
  en: {
    nav: ['Features', 'Modules', 'Documentation'],
    install: 'Install Pulse',
    explore: 'Explore features',
    heading: ['Your servers.', 'Under your control.'],
    intro: 'Resources, processes, network and logs — in one dashboard.',
    scroll: 'Scroll to explore',
    theme: 'Switch theme',
    menu: 'Open menu',
    skip: 'Skip to content',
    featuresTitle: 'Everything happening. In one place.',
    featuresIntro:
      'From CPU load to network connections. Switch servers, find the process you need and explore event history.',
    featureItems: [
      [
        'Resources, clearly',
        'CPU, memory, disks and supported GPUs. Load history and charts show changes over time.',
      ],
      [
        'Processes in detail',
        'Find processes, sort by memory or CPU, and inspect PIDs and resource usage.',
      ],
      [
        'Network visibility',
        'Interface rates, connections, local and remote addresses. Packet capture is available with TShark configured.',
      ],
      [
        'Logs with history',
        'System events and application logs collected by the agent. Filter by server, source and severity.',
      ],
      [
        'Your interface',
        'Light and dark themes, a color and font editor, and compact mode. The dashboard adapts to your screen.',
      ],
      [
        'Real-time updates',
        'Follow fresh telemetry through streamed updates or choose a comfortable display interval.',
      ],
    ],
    demoLabel: 'Interactive preview · illustrative data',
    demoTitle: 'Server overview',
    demoTabs: ['Resources', 'Processes', 'Network', 'Logs'],
    stageTitle: 'Complex infrastructure. Simple visibility.',
    stageIntro:
      'Host the monitor on your server. Agents collect data on other nodes. Open your dashboard from any device.',
    browser: 'Your browser',
    monitor: 'Your monitor',
    agent: 'Go agent',
    ownTitle: 'Your data stays with you.',
    ownIntro:
      'Pulse is self-hosted and open source. You choose where your data lives and who can access the dashboard.',
    ownItems: [
      ['Self-hosted', 'Run the monitor in your infrastructure.'],
      ['Open source', 'Read the code, contribute and build your own modules.'],
      ['MIT', 'Use and modify it under the MIT license.'],
    ],
    modulesTitle: 'Beyond monitoring.',
    modulesIntro:
      'Extend Pulse with independent modules. Connect Docker or build an integration for your infrastructure.',
    dockerIntro:
      'Containers, current CPU usage, memory, network counters and logs. An independent module with its own repository.',
    openModule: 'Explore module',
    makeModule: 'Build a module',
    catalog: 'Module catalog',
    stepsTitle: 'Three steps to visibility.',
    steps: [
      ['Deploy the monitor', 'Download a release, start the monitor and create the owner account.'],
      [
        'Connect your agents',
        'Add a server in the dashboard and run its Go agent with the monitor URL and node token.',
      ],
      [
        'Open your dashboard',
        'Explore telemetry, connect modules and customize the interface from any device.',
      ],
    ],
    docs: 'Read the documentation',
    faqTitle: 'Answers, upfront.',
    faq: [
      [
        'Is Pulse free?',
        'Yes. The monitor, agent and Docker module are published under the MIT license. You provide and pay for your own infrastructure.',
      ],
      [
        'Do I need an agent?',
        'Yes. A Go agent runs on each monitored server and sends data to your monitor. The monitor and agent are distributed separately.',
      ],
      [
        'Does it support Linux and Windows?',
        'Yes. Releases include Linux amd64, Linux arm64 and Windows amd64 builds. Some metrics depend on the operating system, drivers and agent permissions.',
      ],
      [
        'Where does the data go?',
        'To the URL of your monitor. This public website describes the project and does not collect telemetry from your servers.',
      ],
      [
        'Can I add my own modules?',
        'Yes. Modules extend Agent and Monitor. WASI components use a permission broker; native components require full trust. Review source and each version before installing.',
      ],
    ],
    closing: 'Your infrastructure. One point of control.',
    closingIntro: 'Install Pulse and start monitoring your servers.',
    source: 'Source code',
    license: 'Open source · MIT',
    privacy: 'No analytics or advertising trackers',
    installTitle: 'Install Pulse Monitor and the Go agent',
    installIntro:
      'Deploy the monitor on one server and connect agents on the other nodes. Your telemetry stays in your infrastructure.',
    catalogIntro:
      'Independent Pulse extensions. Modules and themes are published through GitHub and reviewed in Marketplace. Connecting Monitor to the catalog is optional; manual JSON import remains available.',
    dockerTitle: 'Docker module for Pulse',
    dockerNote:
      'Install through Modules in your dashboard. Docker 3 uses WASI and the Agent broker, with per-server grants for reading, logs and container control.',
  },
};
export function metadata(lang, slug = '') {
  const t = copy[lang];
  const titles = {
    '':
      lang === 'ru'
        ? 'Pulse — мониторинг серверов Linux и Windows'
        : 'Pulse — self-hosted Linux & Windows server monitoring',
    features:
      lang === 'ru'
        ? 'Мониторинг CPU, памяти, процессов, сети и логов'
        : 'CPU, memory, process, network and log monitoring',
    install: t.installTitle,
    modules: t.catalog,
    'modules/docker': t.dockerTitle,
  };
  const descriptions = {
    '': `${t.intro} ${t.stageIntro}`,
    features: t.featuresIntro,
    install: t.installIntro,
    modules: t.catalogIntro,
    'modules/docker': t.dockerIntro,
  };
  const guide = guideContent[slug.slice('guides/'.length)]?.[lang];
  titles.guides =
    lang === 'ru'
      ? 'Руководства по мониторингу Linux, Windows и Docker'
      : 'Linux, Windows and Docker monitoring guides';
  descriptions.guides =
    lang === 'ru'
      ? 'Практические инструкции Pulse: установка, несколько серверов, Docker-контейнеры и поиск процессов с высоким расходом памяти.'
      : 'Practical Pulse guides for deployment, multiple servers, Docker containers and high-memory process investigation.';
  if (guide) {
    titles[slug] = guide.title;
    descriptions[slug] = guide.description;
  }
  const legalPage = legal.documents[slug]?.[lang];
  if (legalPage) {
    titles[slug] = legalPage.title;
    descriptions[slug] = legalPage.description;
  }
  const title = titles[slug] + (slug ? ' | Pulse' : '');
  const image =
    slug === 'modules/docker' ? '/assets/docker-social.jpg' : '/assets/social-preview.jpg';
  return {
    metadataBase: new URL(origin),
    title,
    description: descriptions[slug],
    alternates: {
      canonical: url(lang, slug),
      languages: { ru: url('ru', slug), en: url('en', slug), 'x-default': url('en', slug) },
    },
    openGraph: {
      type: guide ? 'article' : 'website',
      ...(guide
        ? { publishedTime: publicationDate, modifiedTime: publicationDate, authors: [github] }
        : {}),
      siteName: 'Pulse',
      title,
      description: descriptions[slug],
      url: url(lang, slug),
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: lang === 'ru' ? 'en_US' : 'ru_RU',
      images: [
        { url: image, width: 1774, height: 887, alt: 'Pulse — self-hosted server monitoring' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: descriptions[slug],
      images: [image],
    },
    robots: { index: true, follow: true },
    icons: { icon: '/assets/favicon.svg', apple: '/assets/apple-touch-icon.png' },
  };
}
