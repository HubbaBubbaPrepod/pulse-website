import {origin,pages,url} from '../lib/site';
import {publicationDate} from '../lib/guides';
export const dynamic = 'force-static';
export default function sitemap() { return ['ru','en'].flatMap(lang => pages.map(slug => ({url:origin+url(lang,slug),...(slug.startsWith('guides/')?{lastModified:publicationDate}:{})}))); }
