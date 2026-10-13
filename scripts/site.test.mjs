import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {pages,origin,url,metadata} from '../lib/site.js';
for (const lang of ['ru','en']) for (const slug of pages) {
  test(`${lang} ${slug || 'home'}: static content and SEO`,async()=>{
    const path=`out${url(lang,slug)}index.html`;
    const html=await readFile(path,'utf8');
    assert.match(html,new RegExp(`<html[^>]*lang="${lang}"`));
    assert.equal((html.match(/<h1[\s>]/g)||[]).length,1);
    assert.ok(html.includes(`rel="canonical" href="${origin+url(lang,slug)}"`));
    for(const alternate of ['ru','en']) assert.ok(html.includes(`hrefLang="${alternate}" href="${origin+url(alternate,slug)}"`));
    assert.match(html,/<meta name="description" content="[^"]{20,}"/);
    assert.match(html,/<meta property="og:image"/);
    const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    assert.ok(json);assert.ok(JSON.parse(json[1])['@graph'].length>=3);
    assert.ok(html.includes('PULSE'));assert.ok(html.length<2_000_000);
    const links=[...html.matchAll(/(?:href|src)="(\/(?!\/)[^"?#]*)/g)].map(match=>match[1]);
    for (const link of new Set(links)) {
      if(!link || link==='/')continue;
      const file=link.endsWith('/')?`out${link}index.html`:`out${link}`;
      await access(file);
    }
    assert.ok(metadata(lang,slug).description);
  });
}
test('robots, sitemap and deployment domain',async()=>{
  assert.equal((await readFile('out/CNAME','utf8')).trim(),'pulse.hubba-cloud.ru');
  const robots=await readFile('out/robots.txt','utf8');
  assert.ok(robots.includes(origin+'/sitemap.xml'));
  const sitemap=await readFile('out/sitemap.xml','utf8');
  for(const lang of ['ru','en'])for(const slug of pages)assert.ok(sitemap.includes(origin+url(lang,slug)));
  await access('out/.nojekyll');
});
