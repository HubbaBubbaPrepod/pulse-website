import Site from '../../../components/Site';
import { pages, metadata } from '../../../lib/site';
export const dynamicParams = false;
export function generateStaticParams() {
  return pages.map((slug) => ({ slug: slug ? slug.split('/') : [] }));
}
export async function generateMetadata({ params }) {
  const { slug = [] } = await params;
  return metadata('ru', slug.join('/'));
}
export default async function Page({ params }) {
  const { slug = [] } = await params;
  return <Site lang="ru" slug={slug.join('/')} />;
}
