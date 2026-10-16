import LegalPage from './LegalPage';
import { legal } from '../lib/legal.mjs';
import StructuredData from './StructuredData';
import Guides, { GuideTeasers } from './Guides';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from './Header';
import Hero from './Hero';
import Motion from './Motion';
import Dashboard from './Dashboard';
import { Mark } from './Graphics';
import { copy, url, github, pages } from '../lib/site';
function Eyebrow({ number, children }) {
  return (
    <div className="eyebrow">
      <span>{number}</span>
      <span>/</span>
      {children}
    </div>
  );
}
function FeatureGrid({ lang }) {
  return (
    <div className="feature-grid">
      {copy[lang].featureItems.map(([title, description], i) => (
        <article className="feature" key={title} data-reveal>
          <span className="number">0{i + 1} /</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}
function Features({ lang }) {
  const t = copy[lang];
  return (
    <section className="section container" id="features">
      <div className="section-head" data-reveal>
        <div>
          <Eyebrow number="02">{lang === 'ru' ? 'НАБЛЮДЕНИЕ' : 'OBSERVABILITY'}</Eyebrow>
          <h2>{t.featuresTitle}</h2>
        </div>
        <p>{t.featuresIntro}</p>
      </div>
      <FeatureGrid lang={lang} />
    </section>
  );
}
function Architecture({ lang }) {
  const t = copy[lang];
  return (
    <section className="section container split">
      <div data-reveal>
        <Eyebrow number="03">SELF-HOSTED</Eyebrow>
        <h2>{t.stageTitle}</h2>
        <p>{t.stageIntro}</p>
        <Link className="text-link" href={url(lang, 'install')}>
          {t.docs}
          <span>↗</span>
        </Link>
      </div>
      <div className="architecture" data-reveal>
        <div className="node">
          <strong>{t.browser}</strong>
          <small>DESKTOP · TABLET · MOBILE</small>
        </div>
        <svg className="connections" viewBox="0 0 400 60" aria-hidden="true">
          <path d="M200 0V60" className="connection-track" />
          <path d="M200 0V60" className="connection-pulse" />
        </svg>
        <div className="node monitor-node">
          <Mark />
          <strong>PULSE MONITOR</strong>
          <small>{t.monitor} · HTTPS</small>
        </div>
        <svg className="connections" viewBox="0 0 400 60" aria-hidden="true">
          <path d="M200 0V25H85V60M200 25H315V60" className="connection-track" />
          <path d="M200 0V25H85V60M200 25H315V60" className="connection-pulse" />
        </svg>
        <div className="node-grid">
          <div className="node">
            <strong>Linux</strong>
            <small>{t.agent}</small>
          </div>
          <div className="node">
            <strong>Windows</strong>
            <small>{t.agent}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
function Modules({ lang, heading = true }) {
  const t = copy[lang];
  return (
    <section className="section container split" id="modules">
      <div data-reveal>
        {heading && (
          <>
            <Eyebrow number="04">MODULES</Eyebrow>
            <h2>{t.modulesTitle}</h2>
          </>
        )}
        <p>{t.modulesIntro}</p>
        <div className="actions">
          <Link className="button secondary" href={url(lang, 'modules')}>
            {t.catalog}
            <span>↗</span>
          </Link>
          <a
            className="text-link"
            href={
              github +
              '/pulse-monitor/blob/main/docs/MODULES' +
              (lang === 'en' ? '.en' : '') +
              '.md'
            }
          >
            {t.makeModule}
            <span>↗</span>
          </a>
        </div>
      </div>
      <article className="module-card" data-reveal>
        <div className="module-product">
          <Image
            src="/assets/containers.webp"
            width={1536}
            height={1024}
            alt={
              lang === 'ru'
                ? 'Объёмная иллюстрация контейнеров'
                : 'Three-dimensional container illustration'
            }
          />
        </div>
        <h3>
          Docker<span className="tag">MODULE / 01</span>
        </h3>
        <p>{t.dockerIntro}</p>
        <div className="module-tags">
          <span className="tag">CPU + RAM</span>
          <span className="tag">NETWORK</span>
          <span className="tag">LOGS</span>
        </div>
        <Link className="text-link" href={url(lang, 'modules/docker')}>
          {t.openModule}
          <span>↗</span>
        </Link>
      </article>
    </section>
  );
}
function Steps({ lang }) {
  const t = copy[lang];
  return (
    <section className="section container" id="install">
      <div className="section-head" data-reveal>
        <div>
          <Eyebrow number="05">GET STARTED</Eyebrow>
          <h2>{t.stepsTitle}</h2>
        </div>
        <Link href={url(lang, 'install')} className="text-link">
          {t.docs}
          <span>↗</span>
        </Link>
      </div>
      <div className="steps">
        {t.steps.map(([title, description], i) => (
          <article className="step" data-reveal key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
            <a
              className="text-link"
              href={
                i === 0
                  ? github + '/pulse-monitor/releases/latest'
                  : i === 1
                    ? github + '/pulse-agent/releases/latest'
                    : url(lang, 'install')
              }
            >
              {i < 2 ? (lang === 'ru' ? 'Скачать релиз' : 'Download release') : t.docs}
              <span>↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
function Home({ lang }) {
  const t = copy[lang];
  return (
    <>
      <Hero lang={lang} />
      <section className="section container dashboard-section" id="overview">
        <div className="section-head" data-reveal>
          <div>
            <Eyebrow number="01">{lang === 'ru' ? 'ОДНА ПАНЕЛЬ' : 'ONE DASHBOARD'}</Eyebrow>
            <h2>
              {lang === 'ru'
                ? 'От деталей — к полной картине.'
                : 'From the details to the whole picture.'}
            </h2>
          </div>
          <p>{t.featuresIntro}</p>
        </div>
        <div className="dashboard-arrival">
          <Dashboard lang={lang} />
        </div>
        <div className="preview-caption">
          <span>{t.demoLabel}</span>
          <span>CPU / RAM / DISK / NETWORK / LOGS</span>
        </div>
      </section>
      <Features lang={lang} />
      <Architecture lang={lang} />
      <section className="ownership">
        <div className="container section">
          <div className="section-head" data-reveal>
            <div>
              <Eyebrow number="A">{lang === 'ru' ? 'НЕЗАВИСИМОСТЬ' : 'OWNERSHIP'}</Eyebrow>
              <h2>{t.ownTitle}</h2>
            </div>
            <p>{t.ownIntro}</p>
          </div>
          <div className="ownership-grid">
            {t.ownItems.map(([title, description]) => (
              <article key={title} data-reveal>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Modules lang={lang} />
      <Steps lang={lang} />
      <GuideTeasers lang={lang} />
      <section className="section container faq">
        <div data-reveal>
          <Eyebrow number="06">FAQ</Eyebrow>
          <h2>{t.faqTitle}</h2>
        </div>
        <div>
          {t.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
function Installation({ lang }) {
  const t = copy[lang],
    en = lang === 'en';
  return (
    <>
      <section className="page-hero container">
        <Eyebrow number="01">INSTALLATION</Eyebrow>
        <h1>{t.installTitle}</h1>
        <p>{t.installIntro}</p>
      </section>
      <div className="container">
        <article className="prose">
          <h2>01. {t.steps[0][0]}</h2>
          <p>
            {en
              ? 'Download the archive for the machine that will host the monitor from GitHub Releases. Extract it: the executable and out directory must stay together. Choose a persistent data directory.'
              : 'Скачай архив для сервера монитора из GitHub Releases и распакуй. Исполняемый файл и папка out должны находиться рядом. Выбери постоянную папку для данных.'}
          </p>
          <a className="text-link" href={github + '/pulse-monitor/releases/latest'}>
            Pulse Monitor — GitHub Releases ↗
          </a>
          <h3>Linux</h3>
          <pre>
            <code>{'./pulse-monitor -addr 127.0.0.1:8080 -data ./data -static ./out'}</code>
          </pre>
          <h3>Windows / PowerShell</h3>
          <pre>
            <code>{'.\\pulse-monitor.exe -addr 127.0.0.1:8080 -data .\\data -static .\\out'}</code>
          </pre>
          <p>
            {en
              ? 'Open the monitor in your browser and register the owner account. For remote access, put it behind an HTTPS reverse proxy and configure the firewall. Do not expose an unencrypted login page to the Internet.'
              : 'Открой монитор в браузере и зарегистрируй владельца. Для доступа извне настрой обратный прокси с HTTPS и firewall. Не публикуй страницу входа в Интернет без шифрования.'}
          </p>
          <h2>02. {t.steps[1][0]}</h2>
          <p>
            {en
              ? 'Add a node in the Servers section. The monitor issues a node token and an agent command. Download the agent release for that node’s operating system and architecture, then use the generated command.'
              : 'Добавь узел в разделе «Серверы». Монитор выдаст токен узла и команду запуска агента. Скачай релиз агента для ОС и архитектуры этого узла, затем используй команду из панели.'}
          </p>
          <a className="text-link" href={github + '/pulse-agent/releases/latest'}>
            Pulse Agent — GitHub Releases ↗
          </a>
          <div className="notice">
            <p>
              {en
                ? 'The agent needs your monitor URL and the token of its own node. Keep tokens private. Operating-system detection happens automatically.'
                : 'Агенту нужны адрес твоего монитора и токен именно его узла. Не публикуй токены. ОС определяется автоматически.'}
            </p>
          </div>
          <h2>03. {t.steps[2][0]}</h2>
          <p>
            {en
              ? 'Check that the node is online and telemetry arrives. Configure the monitor and agent as services so they start after a reboot. Back up the monitor data directory and keep the agent token safe.'
              : 'Проверь, что узел online и данные поступают. Настрой монитор и агента как службы, чтобы они запускались после перезагрузки. Делай резервную копию папки данных монитора и сохраняй токен агента.'}
          </p>
          <h3>{en ? 'Platform support' : 'Поддерживаемые платформы'}</h3>
          <p>Linux amd64 · Linux arm64 · Windows amd64</p>
          <p>
            {en
              ? 'GPU metrics require a supported GPU and drivers. Optional packet capture requires TShark and suitable privileges; network interface and connection monitoring works independently.'
              : 'Для метрик GPU нужны поддерживаемая видеокарта и драйверы. Необязательный захват пакетов требует TShark и подходящих прав; мониторинг интерфейсов и соединений работает отдельно.'}
          </p>
          <a
            className="text-link"
            href={github + '/pulse-monitor/blob/main/docs/INSTALL' + (en ? '.en' : '') + '.md'}
          >
            {t.docs} ↗
          </a>
        </article>
      </div>
    </>
  );
}
function ModulePage({ lang, docker }) {
  const t = copy[lang],
    en = lang === 'en';
  return (
    <>
      <section className="page-hero container">
        <Eyebrow number="01">{docker ? 'DOCKER MODULE' : 'MODULE CATALOG'}</Eyebrow>
        <h1>{docker ? t.dockerTitle : t.catalog}</h1>
        <p>{docker ? t.dockerIntro : t.catalogIntro}</p>
      </section>
      {docker ? (
        <div className="container split module-detail">
          <div className="prose">
            <h2>{en ? 'Container visibility, inside Pulse.' : 'Контейнеры — внутри Pulse.'}</h2>
            <p>{t.dockerNote}</p>
            <ul>
              <li>
                {en
                  ? 'Container state, names, images and counts.'
                  : 'Состояние контейнеров, имена, образы и счётчики.'}
              </li>
              <li>
                {en
                  ? 'Current CPU and working-set memory.'
                  : 'Текущая нагрузка CPU и используемая память.'}
              </li>
              <li>
                {en
                  ? 'Network counters and container logs.'
                  : 'Сетевые счётчики и журналы контейнеров.'}
              </li>
            </ul>
            <p>
              {en
                ? 'Install the JSON package from a release through your monitor’s Modules page. Configure access to Docker on each selected server. The module collector executes native code: review the source and trust the author before installing.'
                : 'Установи JSON-пакет релиза через страницу «Модули» своего монитора. Настрой доступ к Docker на каждом выбранном сервере. Коллектор выполняет нативный код: перед установкой проверь источник и автора.'}
            </p>
            <div className="actions">
              <a className="button" href={github + '/pulse-module-docker/releases/latest'}>
                {en ? 'Download module' : 'Скачать модуль'}
                <span>↗</span>
              </a>
              <a className="button secondary" href={github + '/pulse-module-docker'}>
                GitHub ↗
              </a>
            </div>
          </div>
          <Image
            src="/assets/containers.webp"
            width={1536}
            height={1024}
            alt={en ? 'Docker container illustration' : 'Иллюстрация контейнеров Docker'}
            className="detail-hardware"
          />
        </div>
      ) : (
        <Modules lang={lang} heading={false} />
      )}
    </>
  );
}
export default function Site({ lang, slug }) {
  if (!pages.includes(slug)) notFound();
  const t = copy[lang];
  return (
    <>
      <a href="#main" className="skip">
        {t.skip}
      </a>
      <Header lang={lang} slug={slug} />
      <StructuredData lang={lang} slug={slug} />
      <Motion key={lang + slug}>
        <main id="main">
          {Object.hasOwn(legal.documents, slug) ? (
            <LegalPage lang={lang} document={slug} />
          ) : slug === '' ? (
            <Home lang={lang} />
          ) : slug === 'guides' || slug.startsWith('guides/') ? (
            <Guides lang={lang} slug={slug} />
          ) : slug === 'install' ? (
            <Installation lang={lang} />
          ) : slug.startsWith('modules') ? (
            <ModulePage lang={lang} docker={slug === 'modules/docker'} />
          ) : (
            <>
              <section className="page-hero container">
                <Eyebrow number="01">FEATURES</Eyebrow>
                <h1>{t.featuresTitle}</h1>
                <p>{t.featuresIntro}</p>
              </section>
              <Features lang={lang} />
              <section className="container section">
                <Dashboard lang={lang} />
                <p className="preview-caption">{t.demoLabel}</p>
              </section>
              <Architecture lang={lang} />
            </>
          )}
          {!Object.hasOwn(legal.documents, slug) && (
            <section className="closing container" data-reveal>
              <div className="eyebrow">PULSE / GET STARTED</div>
              <h2>{t.closing}</h2>
              <p>{t.closingIntro}</p>
              <div className="actions">
                <Link className="button" href={url(lang, 'install')}>
                  {t.install}
                  <span>→</span>
                </Link>
                <a className="button secondary" href={github + '/pulse-monitor'}>
                  {t.source}
                  <span>↗</span>
                </a>
              </div>
            </section>
          )}
        </main>
      </Motion>
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <Link href={url(lang)} className="brand">
              <Mark />
              PULSE
            </Link>
            <div className="footer-links">
              <Link href={url(lang, 'features')}>{t.nav[0]}</Link>
              <Link href={url(lang, 'modules')}>{t.catalog}</Link>
              <Link href={url(lang, 'install')}>{t.docs}</Link>
              <a href={github + '/pulse-monitor'}>Monitor ↗</a>
              <a href={github + '/pulse-agent'}>Agent ↗</a>
              <a href={github + '/pulse-module-docker'}>Docker ↗</a>
            </div>
          </div>
          <div className="footer-note">
            <span>{t.license}</span>
            <span>{t.privacy}</span>
            <nav className="legal-footer-links" aria-label={legal.labels[lang].navigation}>
              {Object.entries(legal.documents).map(([key, value]) => (
                <Link key={key} href={url(lang, key)}>
                  {value[lang].title}
                </Link>
              ))}
            </nav>
            <span>MADE FOR PEOPLE, BY PEOPLE.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
