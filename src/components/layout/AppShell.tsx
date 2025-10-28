'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { PageHeader, PageHeaderActions } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  showBottomNav?: boolean;
  showNavigation?: boolean;
}

// Map paths to page titles (currently unused but kept for future use)
// const PAGE_TITLES: Record<string, string> = {
//   '/dashboard': 'Thrive',
//   '/nutrition': 'Nutrition Tracker',
//   '/progress': 'Progress Tracking',
//   '/vision-board': 'Vision Board',
//   '/log': 'Daily Log',
//   '/photos': 'Progress Photos',
//   '/settings': 'Settings',
// };

export function AppShell({
  children,
  className,
  showBottomNav = true,
  showNavigation = true,
}: AppShellProps) {
  // const pathname = usePathname();
  const router = useRouter();

  // const pageTitle = PAGE_TITLES[pathname] || 'Thrive';
  // const isMainPage = pathname === '/dashboard' || pathname === '/nutrition';

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <PageHeader
        title='Thrive'
        variant='gradient'
        showNavigation={showNavigation}
        actions={
          <PageHeaderActions
            onSettings={() => router.push('/settings')}
            onLogout={handleLogout}
          />
        }
      />

      <main
        className={cn(
          'mx-auto max-w-7xl px-3 sm:px-4 lg:px-6',
          showBottomNav ? 'pb-16 md:pb-3' : 'pb-3',
          className
        )}
      >
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}

// Convenience wrapper for pages that need the full app shell
interface AppPageProps {
  children: React.ReactNode;
  className?: string;
}

export function AppPage({ children, className }: AppPageProps) {
  return <AppShell className={className}>{children}</AppShell>;
}
