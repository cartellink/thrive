'use client';

import { PageHeader, PageHeaderActions } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function RecipePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <PageHeader
        title='Thrive'
        navItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Recipe', href: '/recipe' },
        ]}
        actions={
          <PageHeaderActions
            onSettings={() => router.push('/settings')}
            onLogout={handleLogout}
          />
        }
        variant='gradient'
      />

      <main className='mx-auto max-w-7xl px-3 pb-16 sm:px-4 md:pb-3 lg:px-6'>
        <div className='py-6'>
          <Card>
            <CardHeader>
              <CardTitle>Recipe Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>
                Your healthy recipe collection will be available here soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
