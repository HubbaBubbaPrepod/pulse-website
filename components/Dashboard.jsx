'use client';
import dynamic from 'next/dynamic';
const Preview = dynamic(() => import('./Preview'), {
  ssr: false,
  loading: () => (
    <div className="preview skeleton-preview" role="status" aria-label="Loading interface preview">
      <div className="skeleton-bar" />
      <div className="skeleton-grid">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="skeleton-block" key={i} />
        ))}
      </div>
      <div className="skeleton-chart" />
    </div>
  ),
});
export default function Dashboard({ lang }) {
  return <Preview lang={lang} />;
}
