import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'ライター一覧' };
export const revalidate = 60;

export default async function WritersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, role')
    .in('role', ['admin', 'writer'])
    .order('display_name', { ascending: true });

  const profiles = data ?? [];
  const admins = profiles.filter((p) => p.role === 'admin');
  const writers = profiles.filter((p) => p.role === 'writer');

  const ProfileCard = ({ p }: { p: typeof profiles[number] }) => {
    const name = p.display_name ?? p.username;
    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {p.avatar_url ? (
            <Image src={p.avatar_url} alt={name} width={48} height={48} className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-500 dark:text-gray-300 font-bold text-lg">{name[0].toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{name}</p>
          {p.bio && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{p.bio}</p>}
        </div>
        <Link href={'/writers/' + p.username}
          className="flex-shrink-0 text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:text-blue-700 transition-colors">
          一覧 &gt;
        </Link>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex gap-4">
        </div>
      </div>

      {admins.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-blue-800 dark:text-blue-400 border-b-2 border-blue-800 dark:border-blue-400 pb-1 mb-3">編集長</h2>
          {admins.map((p) => <ProfileCard key={p.id} p={p} />)}
        </section>
      )}

      {writers.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-blue-800 dark:text-blue-400 border-b-2 border-blue-800 dark:border-blue-400 pb-1 mb-3">ライター</h2>
          {writers.map((p) => <ProfileCard key={p.id} p={p} />)}
        </section>
      )}

      {profiles.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 py-16">ライターがいません</p>
      )}
    </div>
  );
}
