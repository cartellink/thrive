'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHabits } from '@/components/dashboard/DashboardHabits';
import { HorizontalStats } from '@/components/dashboard/HorizontalStats';
import { HabitStreaks } from '@/components/dashboard/HabitStreaks';
import { DashboardVisionCollage } from '@/components/dashboard/DashboardVisionCollage';
import { VisionBoardItemModal } from '@/components/dashboard/VisionBoardItemModal';
import { LoadingState } from '@/components/LoadingState';
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
    <div>
      <DashboardVisionCollage
        items={visionBoardItems}
        onItemClick={setSelectedItem}
      />

      <HorizontalStats
        weight={latestLog?.weight_kg || null}
        progress={progress}
        targetWeight={user?.target_weight_kg || undefined}
        longestStreak={Math.max(...streaks.map(s => s.current_streak || 0), 0)}
        previousWeight={null}
        previousProgress={undefined}
        previousStreak={undefined}
      />

      <div className='mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2'>
        <DashboardHabits
          userHabits={userHabits}
          completions={completions}
          onToggleHabit={handleToggleHabit}
        />
        <HabitStreaks userHabits={userHabits} streaks={streaks} />
      </div>

      <VisionBoardItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
