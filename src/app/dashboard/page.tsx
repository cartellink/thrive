'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, PageHeaderActions } from '@/components/PageHeader';
import { LoadingState } from '@/components/LoadingState';
import { BottomNav } from '@/components/BottomNav';
import { DashboardVisionCollage } from '@/components/dashboard/DashboardVisionCollage';
import { DashboardHabits } from '@/components/dashboard/DashboardHabits';
import { CombinedStats } from '@/components/dashboard/CombinedStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { VisionBoardItemModal } from '@/components/dashboard/VisionBoardItemModal';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { useStreaks } from '@/hooks/useStreaks';
import { useVisionBoard } from '@/hooks/useVisionBoard';
import { useLatestLog } from '@/hooks/useLatestLog';
import { calculateProgress } from '@/lib/helpers';
import { VisionBoardItem } from '@/types/app';

export default function DashboardPage() {
  const [selectedItem, setSelectedItem] = useState<VisionBoardItem | null>(
    null
  );
  const router = useRouter();

  // Use custom hooks for data management
  const { user, loading: authLoading } = useAuth();
  const { userHabits, completions, toggleHabit } = useHabits(user?.id || null);
  const { streaks, updateStreaks } = useStreaks(user?.id || null);
  const { items: visionBoardItems } = useVisionBoard(user?.id || null);
  const { latestLog } = useLatestLog(user?.id || null);

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleToggleHabit = async (
    userHabitId: string,
    currentCount: number,
    dailyTarget: number,
    increment: boolean
  ) => {
    await toggleHabit(userHabitId, currentCount, dailyTarget, increment);

    // Update streaks after habit toggle
    const newCount = increment
      ? currentCount + 1
      : Math.max(0, currentCount - 1);
    const targetMet = newCount >= dailyTarget;
    await updateStreaks(userHabitId, targetMet, dailyTarget);
  };

  const progress = calculateProgress(
    latestLog?.weight_kg || null,
    user?.starting_weight_kg || null,
    user?.target_weight_kg || null
  );

  if (authLoading) {
    return <LoadingState message='Loading your dashboard...' size='lg' />;
  }

  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <p className='mb-4 text-red-600'>Error loading user data</p>
          <button onClick={() => router.push('/auth/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
        <DashboardVisionCollage
          items={visionBoardItems}
          onItemClick={setSelectedItem}
        />

        <CombinedStats
          weight={latestLog?.weight_kg || null}
          progress={progress}
          targetWeight={user?.target_weight_kg || undefined}
          userHabits={userHabits}
          streaks={streaks}
        />

        <div className='mb-3 grid grid-cols-1 gap-3 md:grid-cols-2'>
          <DashboardHabits
            userHabits={userHabits}
            completions={completions}
            onToggleHabit={handleToggleHabit}
          />
          <QuickActions />
        </div>

        <VisionBoardItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </main>

      <BottomNav />
    </div>
  );
}
