import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/EmptyState';
import { Heart, CheckCircle2, XCircle, Plus, Camera } from 'lucide-react';
import { UserHabitWithPreset, DailyHabitCompletion } from '@/types/app';

interface DashboardHabitsProps {
  userHabits: UserHabitWithPreset[];
  completions: DailyHabitCompletion[];
  onToggleHabit: (
    userHabitId: string,
    currentCount: number,
    dailyTarget: number,
    increment: boolean
  ) => Promise<void>;
}

export function DashboardHabits({
  userHabits,
  completions,
  onToggleHabit,
}: DashboardHabitsProps) {
  const router = useRouter();

  const bgColors = [
    'bg-blue-50 border-blue-200',
    'bg-purple-50 border-purple-200',
    'bg-orange-50 border-orange-200',
    'bg-green-50 border-green-200',
    'bg-pink-50 border-pink-200',
    'bg-indigo-50 border-indigo-200',
  ];

  return (
    <Card variant='outlined' className='border-indigo-200'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Heart className='h-4 w-4 text-indigo-600' />
            Today&apos;s Habits
          </CardTitle>
          <div className='flex items-center gap-2'>
            <Link href='/log'>
              <Button variant='outline' size='sm' className='h-8 px-2'>
                <Plus className='mr-1 h-3 w-3' />
                Log
              </Button>
            </Link>
            <Link href='/photos'>
              <Button variant='outline' size='sm' className='h-8 px-2'>
                <Camera className='mr-1 h-3 w-3' />
                Photos
              </Button>
            </Link>
            <Link href='/settings'>
              <Button variant='ghost' size='sm'>
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-2'>
        {userHabits.length === 0 ? (
          <EmptyState
            icon={Heart}
            title='No habits configured yet'
            description='Start building healthy habits by adding your first one.'
            action={{
              label: 'Add Habits',
              onClick: () => router.push('/settings'),
              variant: 'gradient',
            }}
            className='py-8'
          />
        ) : (
          userHabits.map((habit, index) => {
            const completion = completions.find(
              c => c.user_habit_id === habit.id
            );
            const currentCount = completion?.completion_count || 0;
            const dailyTarget = habit.daily_target || 1;
            const isCompleted = currentCount >= dailyTarget;
            const habitName =
              habit.custom_name || habit.habit_preset?.name || 'Habit';
            const habitIcon =
              habit.custom_icon || habit.habit_preset?.icon || '✓';

            const colorClass = bgColors[index % bgColors.length];

            return (
              <div
                key={habit.id}
                className={`flex items-center justify-between rounded-lg p-3 ${colorClass} transition-smooth hover-lift`}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`rounded-full p-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'} transition-smooth`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className='h-4 w-4 text-white' />
                    ) : (
                      <XCircle className='h-4 w-4 text-white' />
                    )}
                  </div>
                  <span className='mr-1 text-lg'>{habitIcon}</span>
                  <span className='text-sm font-medium text-gray-900'>
                    {habitName}
                  </span>
                </div>

                {dailyTarget === 1 ? (
                  <Switch
                    checked={isCompleted}
                    onCheckedChange={checked =>
                      onToggleHabit(
                        habit.id,
                        currentCount,
                        dailyTarget,
                        checked
                      )
                    }
                  />
                ) : (
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        onToggleHabit(
                          habit.id,
                          currentCount,
                          dailyTarget,
                          false
                        )
                      }
                      disabled={currentCount === 0}
                    >
                      -
                    </Button>
                    <span
                      className={`min-w-12 text-center text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}
                    >
                      {currentCount}/{dailyTarget}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        onToggleHabit(habit.id, currentCount, dailyTarget, true)
                      }
                      disabled={currentCount >= dailyTarget}
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
