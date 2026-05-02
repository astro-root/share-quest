import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import type { Profile } from '@/lib/types';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'role'> | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, role')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} profile={profile} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
