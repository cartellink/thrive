import * as React from 'react';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

export function AppShell({
  children,
  className,
  showBottomNav = true,
}: AppShellProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
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
