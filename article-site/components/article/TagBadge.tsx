import Link from 'next/link';

interface Tag { id: string; name: string; slug: string }

const COLORS = [
  'bg-violet-100 text-violet-700 hover:bg-violet-200',
  'bg-sky-100 text-sky-700 hover:bg-sky-200',
  'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  'bg-rose-100 text-rose-700 hover:bg-rose-200',
  'bg-amber-100 text-amber-700 hover:bg-amber-200',
  'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  'bg-teal-100 text-teal-700 hover:bg-teal-200',
  'bg-pink-100 text-pink-700 hover:bg-pink-200',
];

function colorFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function TagBadge({ tag, onClick }: { tag: Tag; onClick?: () => void }) {
  const color = colorFor(tag.slug);
  if (onClick) {
    return (
      <button onClick={onClick}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${color}`}>
        #{tag.name}
      </button>
    );
  }
  return (
    <Link href={`/articles?tag=${tag.slug}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${color}`}>
      #{tag.name}
    </Link>
  );
}
