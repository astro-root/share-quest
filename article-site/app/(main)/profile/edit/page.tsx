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
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">プロフィール編集</h1>
        <ProfileEditForm profile={profile} isWriter={isWriter} />
      </div>
    </div>
  );
}
