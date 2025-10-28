import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Award, Zap, Sparkles } from 'lucide-react';
import { UserHabitWithPreset, HabitStreak } from '@/types/app';
import { cn } from '@/lib/utils';
import {
  getFireIntensity,
  getDaysUntilNextMilestone,
  MILESTONE_THRESHOLDS,
} from '@/lib/animations';
import { useState, useEffect, useRef } from 'react';

interface HabitStreaksProps {
  userHabits: UserHabitWithPreset[];
  streaks: HabitStreak[];
}

export function HabitStreaks({ userHabits, streaks }: HabitStreaksProps) {
  const [animatingStreaks, setAnimatingStreaks] = useState<Set<string>>(
    new Set()
  );
  const [celebratingMilestones, setCelebratingMilestones] = useState<
    Set<string>
  >(new Set());
  const previousStreakCounts = useRef<Record<string, number>>({});

  const habitsOnTrack = streaks.filter(
    s => (s.current_streak || 0) >= 3
  ).length;

  // Trigger animations when streaks change
  useEffect(() => {
    const newAnimatingStreaks = new Set<string>();
    const newCelebratingMilestones = new Set<string>();

    streaks.forEach(streak => {
      if (!streak.user_habit_id) return;

      const currentStreak = streak.current_streak || 0;
      const previousStreak =
        previousStreakCounts.current[streak.user_habit_id] || 0;

      // Update streak count with animation
      if (currentStreak !== previousStreak) {
        newAnimatingStreaks.add(streak.user_habit_id);

        // Check for milestone crossings
        const milestones = MILESTONE_THRESHOLDS.STREAK;
        const crossedMilestone = milestones.find(
          m => previousStreak < m && currentStreak >= m
        );

        if (crossedMilestone && streak.user_habit_id) {
          newCelebratingMilestones.add(streak.user_habit_id);
          setTimeout(() => {
            setCelebratingMilestones(prev => {
              const newSet = new Set(prev);
              newSet.delete(streak.user_habit_id!);
              return newSet;
            });
          }, 2000);
        }
      }

      // Update streak count
      if (streak.user_habit_id) {
        // Update ref for next comparison
        previousStreakCounts.current[streak.user_habit_id] = currentStreak;
      }
    });

    setAnimatingStreaks(newAnimatingStreaks);
    setCelebratingMilestones(newCelebratingMilestones);

    const timer = setTimeout(() => setAnimatingStreaks(new Set()), 500);
    return () => clearTimeout(timer);
  }, [streaks]);

  if (userHabits.length === 0) {
    return null;
  }

  const getMilestoneBadge = (streak: number) => {
    const milestones = MILESTONE_THRESHOLDS.STREAK;
    const achievedMilestones = milestones.filter(m => streak >= m);
    const latestMilestone = achievedMilestones[achievedMilestones.length - 1];

    if (!latestMilestone) return null;

    const badgeColors = {
      3: 'bg-orange-100 text-orange-700 border-orange-200',
      7: 'bg-blue-100 text-blue-700 border-blue-200',
      14: 'bg-purple-100 text-purple-700 border-purple-200',
      30: 'bg-green-100 text-green-700 border-green-200',
      100: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    return (
      <div
        className={cn(
          'flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium',
          badgeColors[latestMilestone as keyof typeof badgeColors] ||
            'bg-gray-100 text-gray-700'
        )}
      >
        <Award className='h-3 w-3' />
        {latestMilestone}d
      </div>
    );
  };

  // Animated streak counter component
  const AnimatedCounter = ({
    value,
    isAnimating,
  }: {
    value: number;
    isAnimating: boolean;
  }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      if (isAnimating) {
        const startValue = displayValue;
        const endValue = value;
        const duration = 300;
        const steps = 20;
        const stepDuration = duration / steps;
        const stepSize = (endValue - startValue) / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
          currentStep++;
          const newValue = Math.round(startValue + stepSize * currentStep);
          setDisplayValue(newValue);

          if (currentStep >= steps) {
            clearInterval(timer);
            setDisplayValue(endValue);
          }
        }, stepDuration);

        return () => clearInterval(timer);
      } else {
        setDisplayValue(value);
      }
    }, [value, isAnimating, displayValue]);

    return (
      <span
        className={cn(
          'text-sm font-bold transition-all duration-300',
          isAnimating && 'scale-110 animate-bounce'
        )}
      >
        {displayValue}
      </span>
    );
  };

  const getFireIcon = (
    streak: number,
    isAnimating: boolean,
    isCelebrating: boolean
  ) => {
    const intensity = getFireIntensity(streak);

    const fireClasses = {
      none: 'text-gray-400',
      ember: 'text-orange-400',
      small: 'text-orange-500',
      medium: 'text-orange-600',
      large: 'text-red-500',
      inferno: 'text-red-600',
    };

    const animationClasses = {
      none: '',
      ember: '',
      small: 'drop-shadow-sm',
      medium: 'drop-shadow-md',
      large: 'drop-shadow-lg',
      inferno: 'drop-shadow-xl',
    };

    return (
      <div className='relative'>
        <Flame
          className={cn(
            'h-3 w-3 transition-all duration-300',
            fireClasses[intensity.level as keyof typeof fireClasses],
            isAnimating &&
              animationClasses[
                intensity.level as keyof typeof animationClasses
              ],
            isCelebrating && 'scale-125 animate-bounce'
          )}
        />
        {/* Particle effects for high streaks */}
        {streak >= 7 && (
          <div className='absolute -top-1 -right-1'>
            <Sparkles
              className={cn(
                'h-2 w-2 text-yellow-400',
                isCelebrating && 'animate-ping'
              )}
            />
          </div>
        )}
        {/* Glow effect for very high streaks */}
        {streak >= 14 && (
          <div className='absolute inset-0 rounded-full bg-current opacity-20' />
        )}
      </div>
    );
  };

  return (
    <Card className='border-purple-200 bg-white'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2'>
            <Flame className='h-3 w-3 text-purple-500' />
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
            const isAnimating = animatingStreaks.has(habit.id);
            const isCelebrating = celebratingMilestones.has(habit.id);
            const daysUntilNext = getDaysUntilNextMilestone(currentStreak);
            const isNearMiss = currentStreak > 0 && currentStreak < 3;

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
                  'relative flex items-center justify-between rounded-lg border p-2 transition-all hover:shadow-sm',
                  streakColors[streakLevel],
                  isAnimating && 'animate-bounce',
                  isNearMiss && 'border-red-300 bg-red-50',
                  isCelebrating && 'ring-opacity-50 ring-2 ring-yellow-400'
                )}
              >
                {/* Celebration overlay */}
                {isCelebrating && (
                  <div className='absolute inset-0 rounded-lg bg-linear-to-r from-yellow-400/20 to-orange-400/20' />
                )}
                <div className='flex items-center gap-2'>
                  <div className='text-sm'>{habitIcon}</div>
                  <span className='max-w-[120px] truncate text-xs font-medium'>
                    {habitName}
                  </span>
                  {/* Milestone badge with celebration */}
                  {getMilestoneBadge(currentStreak) && (
                    <div
                      className={cn(
                        'transition-all duration-300',
                        isCelebrating && 'scale-110 animate-bounce'
                      )}
                    >
                      {getMilestoneBadge(currentStreak)}
                    </div>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    {getFireIcon(currentStreak, isAnimating, isCelebrating)}
                    <AnimatedCounter
                      value={currentStreak}
                      isAnimating={isAnimating}
                    />
                  </div>

                  {/* Progress to next milestone */}
                  {currentStreak > 0 && daysUntilNext > 0 && (
                    <div className='flex items-center gap-1'>
                      <div className='h-1 w-8 rounded-full bg-current opacity-20'>
                        <div
                          className='h-full rounded-full bg-current transition-all duration-500'
                          style={{
                            width: `${Math.min(100, (currentStreak / (currentStreak + daysUntilNext)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className='text-xs text-gray-500'>
                        {daysUntilNext}d
                      </span>
                    </div>
                  )}

                  {/* Near miss warning */}
                  {isNearMiss && (
                    <div className='flex items-center gap-1 text-red-500'>
                      <Zap className='h-3 w-3' />
                      <span className='text-xs font-medium'>Keep going!</span>
                    </div>
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
              🎉 {habitsOnTrack} habit{habitsOnTrack > 1 ? 's' : ''} on fire!
              Keep it up!
            </p>
          </div>
        )}

        {/* Achievement summary */}
        {habitsOnTrack === 0 && (
          <div className='mt-3 rounded-lg bg-linear-to-r from-orange-50 to-yellow-50 p-2 text-center'>
            <p className='text-xs font-medium text-gray-700'>
              🔥 Get your first 3-day streak to unlock the fire!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
