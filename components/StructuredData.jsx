import { legal } from '../lib/legal.mjs';
import { copy, url, github, origin, metadata } from '../lib/site';
import { guideContent, publicationDate } from '../lib/guides';
export default function StructuredData({ lang, slug }) {
  const t = copy[lang],
    guide = guideContent[slug.slice('guides/'.length)]?.[lang];
  const pageURL = origin + url(lang, slug),
    title = metadata(lang, slug).title;
  const graph = [
    {
      '@type': 'WebSite',
      '@id': origin + '/#website',
      name: 'Pulse',
      url: origin,
      inLanguage: ['ru', 'en'],
    },
    {
      '@type': 'WebPage',
      '@id': pageURL + '#page',
      url: pageURL,
      name: title,
      inLanguage: lang,
      isPartOf: { '@id': origin + '/#website' },
    },
  ];
  if (guide)
    graph.push({
      '@type': 'TechArticle',
      '@id': pageURL + '#article',
      headline: guide.title,
      description: guide.description,
      inLanguage: lang,
      datePublished: publicationDate,
      dateModified: publicationDate,
      mainEntityOfPage: { '@id': pageURL + '#page' },
      author: { '@type': 'Person', name: 'HubbaBubbaPrepod', url: github },
      image: origin + '/assets/social-preview.jpg',
      citation: (guide.title.includes('Docker') ? [github + '/pulse-module-docker'] : []).concat(
        github + '/pulse-monitor',
        github + '/pulse-agent',
      ),
    });
  else if (!Object.hasOwn(legal.documents, slug))
    graph.push({
      '@type': 'SoftwareSourceCode',
      name: slug === 'modules/docker' ? 'Pulse Docker Module' : 'Pulse Monitor',
      codeRepository:
        github + (slug === 'modules/docker' ? '/pulse-module-docker' : '/pulse-monitor'),
      programmingLanguage: slug === 'modules/docker' ? ['Go'] : ['Go', 'TypeScript'],
      license: 'https://opensource.org/license/mit',
      runtimePlatform: 'Linux, Windows',
      description: slug === 'modules/docker' ? t.dockerIntro : t.intro,
    });
  if (slug) {
    const crumbs = [{ name: 'Pulse', item: origin + url(lang) }];
    if (slug.includes('/')) {
      const parent = slug.split('/')[0];
      crumbs.push({
        name: parent === 'guides' ? (lang === 'ru' ? 'Руководства' : 'Guides') : t.catalog,
        item: origin + url(lang, parent),
      });
    }
    crumbs.push({ name: guide?.title || title, item: pageURL });
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        ...crumb,
      })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
          /</g,
          '\\u003c',
        ),
      }}
    />
  );
}
