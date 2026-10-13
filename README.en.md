# Pulse Website

[Русский](README.md) · **English**

Public product website for [Pulse](https://github.com/HubbaBubbaPrepod/pulse-monitor), built with Next.js 16, React 19 and GSAP. Russian and English pages, light and dark themes, an interactive preview and responsive motion. No accounts, server telemetry, analytics or advertising trackers.

Website: **https://pulse.hubba-cloud.ru/**. This public site is separate from private monitor deployments.

## Development

Requires Node.js 22.13+:

```sh
npm ci
npm run dev
```

Local URL: http://127.0.0.1:3095. Validate before deployment:

```sh
npm run lint
npm run build
npm test
```

Next.js exports static HTML, CSS and JS into `out`. Preview the export with any static HTTP server rooted at `out`. Hosting needs no Node.js process.

## Deployment and domain

GitHub Pages → Source: **GitHub Actions**. `.github/workflows/pages.yml` builds, checks and deploys `main`. Set `pulse.hubba-cloud.ru` in Pages settings; `public/CNAME` contains the same domain.

DNS: `CNAME pulse → Hubbabubbaprepod.github.io`. Use DNS-only while verification and certificate issuance complete. Enable **Enforce HTTPS** after the certificate is issued. Domain and TLS readiness are checked separately from build success.

## SEO

Prerendered HTML, unique titles and descriptions, canonical URLs, reciprocal RU/EN hreflang with x-default, Open Graph and Twitter Card, JSON-LD WebSite/WebPage/SoftwareSourceCode/BreadcrumbList, robots.txt, sitemap.xml, llms.txt, SVG favicon and PNG Apple icon. Sitemap and robots are generated at build time. To change the domain, update `lib/site.js`, `public/CNAME`, `public/llms.txt` and Pages settings.

`scripts/site.test.mjs` validates exported SEO, document language, structured data and local links. Builds cannot guarantee indexing, search rankings or field Core Web Vitals. Verify ownership in Google Search Console and Yandex Webmaster and submit the sitemap after launch.

## Content and motion

RU/EN copy: `lib/site.js`. Pages: `components/Site.jsx`; hero: `components/Hero.jsx`; GSAP: `components/Motion.jsx`. Primary content works without JavaScript. The interactive preview loads separately with a skeleton; its telemetry is illustrative. Animations respect reduced-motion preferences. Custom server and container illustrations are generated assets; prompts are recorded in `design/assets.json`.

The current catalog lists the independent Docker module. User submissions require a separate backend and are not implemented yet.

## License

[MIT](LICENSE). Dependencies retain their respective licenses.

## Guides and changes

`/guides/` and `/en/guides/` contain six practical guides. Content and publication dates live in `lib/guides.js`; the template is `components/Guides.jsx`. Update article dates when the instructions change, not on every build. Check commands against the documented release. See [CHANGELOG.md](CHANGELOG.md).
