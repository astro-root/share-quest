import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';

export const metadata: Metadata = { title: 'プロフィール編集' };

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, role')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  const isWriter = profile.role === 'writer' || profile.role === 'admin';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 pb-2 border-b border-gray-200 dark:border-gray-700 mb-6">プロフィール編集</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <ProfileEditForm profile={profile} isWriter={isWriter} />
      </div>
    </div>
  );
}
