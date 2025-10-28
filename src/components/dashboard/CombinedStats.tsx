import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, Trophy, Flame, Target, Zap } from 'lucide-react';
import { UserHabitWithPreset, HabitStreak } from '@/types/app';
import { cn } from '@/lib/utils';

interface CombinedStatsProps {
  weight: number | null;
  progress: number;
  daysSince: number;
  targetWeight?: number;
  userHabits: UserHabitWithPreset[];
  streaks: HabitStreak[];
}

export function CombinedStats({
  weight,
  progress,
  daysSince,
  targetWeight,
  userHabits,
  streaks,
}: CombinedStatsProps) {
  // Calculate motivational metrics
  const totalActiveStreaks = streaks.reduce(
    (sum, streak) => sum + streak.current_streak,
    0
  );
  const longestStreak = Math.max(...streaks.map(s => s.current_streak), 0);
  const habitsOnTrack = streaks.filter(s => s.current_streak >= 3).length;
  const streakMotivation =
    habitsOnTrack > 0 ? (habitsOnTrack / userHabits.length) * 100 : 0;

  return (
    <div className='mb-3 grid grid-cols-1 gap-3 md:grid-cols-2'>
      {/* Left Column - Stats Cards */}
      <div className='space-y-1'>
        {/* Weight Card */}
        <Card className='border-blue-200 bg-white'>
          <CardContent className='p-2'>
            <div className='mb-1 flex items-center justify-between'>
              <div className='rounded-md bg-blue-50 p-1'>
                <TrendingDown className='h-3 w-3 text-blue-600' />
              </div>
            </div>
            <div className='space-y-0'>
              <div className='text-lg font-bold text-blue-600'>
                {weight ? `${weight} kg` : '--'}
              </div>
              <p className='text-xs font-medium text-gray-600'>Weight</p>
              {targetWeight && (
                <p className='text-xs text-gray-500'>
                  Target: {targetWeight} kg
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Card with Visual Bar */}
        <Card className='border-green-200 bg-white'>
          <CardContent className='p-2'>
            <div className='mb-1 flex items-center justify-between'>
              <div className='rounded-md bg-green-50 p-1'>
                <Trophy className='h-3 w-3 text-green-600' />
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-lg font-bold text-green-600'>
                {progress.toFixed(1)}%
              </div>
              <p className='text-xs font-medium text-gray-600'>Progress</p>
              <Progress
                value={Math.max(0, Math.min(100, progress))}
                className='h-1 bg-gray-200'
              />
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className='border-orange-200 bg-white'>
          <CardContent className='p-2'>
            <div className='mb-1 flex items-center justify-between'>
              <div className='rounded-md bg-orange-50 p-1'>
                <Flame className='h-3 w-3 text-orange-600' />
              </div>
            </div>
            <div className='space-y-0'>
              <div className='text-lg font-bold text-orange-600'>
                {longestStreak}
              </div>
              <p className='text-xs font-medium text-gray-600'>Best Streak</p>
              <p className='text-xs text-gray-500'>days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Habit Streaks */}
      {userHabits.length > 0 && (
        <Card className='border-purple-200 bg-white'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <Zap className='h-3 w-3 text-purple-500' />
                Habit Streaks
              </div>
              <div className='text-xs text-gray-500'>
                {habitsOnTrack}/{userHabits.length} on track
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='space-y-2'>
              {userHabits.map(habit => {
                const streak = streaks.find(s => s.user_habit_id === habit.id);
                const currentStreak = streak?.current_streak || 0;
                const habitName =
                  habit.custom_name || habit.habit_preset?.name || 'Habit';
                const habitIcon =
                  habit.custom_icon || habit.habit_preset?.icon || '✓';

                // Motivational streak levels
                const streakLevel =
                  currentStreak >= 7
                    ? 'excellent'
                    : currentStreak >= 3
                      ? 'good'
                      : currentStreak >= 1
                        ? 'starting'
                        : 'none';

                const streakColors = {
                  excellent: 'text-green-600 bg-green-50 border-green-200',
                  good: 'text-blue-600 bg-blue-50 border-blue-200',
                  starting: 'text-orange-600 bg-orange-50 border-orange-200',
                  none: 'text-gray-600 bg-gray-50 border-gray-200',
                };

                return (
                  <div
                    key={habit.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-2 transition-all hover:shadow-sm',
                      streakColors[streakLevel]
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='text-sm'>{habitIcon}</div>
                      <span className='max-w-[120px] truncate text-xs font-medium'>
                        {habitName}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        <Flame
                          className={cn(
                            'h-3 w-3',
                            currentStreak >= 3
                              ? 'text-orange-500'
                              : 'text-gray-400'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm font-bold',
                            streakColors[streakLevel].split(' ')[0]
                          )}
                        >
                          {currentStreak}
                        </span>
                      </div>
                      {currentStreak >= 3 && (
                        <div className='h-1 w-8 rounded-full bg-current opacity-20' />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivational Footer */}
            {habitsOnTrack > 0 && (
              <div className='mt-3 rounded-lg bg-linear-to-r from-green-50 to-blue-50 p-2 text-center'>
                <p className='text-xs font-medium text-gray-700'>
                  🎉 {habitsOnTrack} habit{habitsOnTrack > 1 ? 's' : ''} on
                  fire! Keep it up!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
