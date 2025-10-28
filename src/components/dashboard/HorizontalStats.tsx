import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, Trophy, Flame, TrendingUp, Minus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface HorizontalStatsProps {
  weight: number | null;
  progress: number;
  targetWeight?: number;
  longestStreak: number;
  previousWeight?: number | null;
  previousProgress?: number;
  previousStreak?: number;
}

export function HorizontalStats({
  weight,
  progress,
  targetWeight,
  longestStreak,
  previousWeight,
  previousProgress,
  previousStreak,
}: HorizontalStatsProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValuesRef = useRef({ weight, progress, longestStreak });
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger animation on value changes
  useEffect(() => {
    const prevValues = prevValuesRef.current;
    const hasChanged =
      prevValues.weight !== weight ||
      prevValues.progress !== progress ||
      prevValues.longestStreak !== longestStreak;

    if (hasChanged) {
      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Use setTimeout to defer the state update
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 600);
        prevValuesRef.current = { weight, progress, longestStreak };

        return () => clearTimeout(timer);
      }, 0);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [weight, progress, longestStreak]);

  // Calculate trends
  const weightTrend = weight && previousWeight ? weight - previousWeight : 0;
  const progressTrend = previousProgress ? progress - previousProgress : 0;
  const streakTrend = previousStreak ? longestStreak - previousStreak : 0;

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className='h-3 w-3 text-green-500' />;
    if (trend < 0) return <TrendingDown className='h-3 w-3 text-red-500' />;
    return <Minus className='h-3 w-3 text-gray-400' />;
  };

  const getTrendText = (trend: number, unit: string = '') => {
    if (trend > 0) return `+${trend.toFixed(1)}${unit}`;
    if (trend < 0) return `${trend.toFixed(1)}${unit}`;
    return 'No change';
  };

  return (
    <div className='mb-3 grid grid-cols-1 gap-3 md:grid-cols-3'>
      {/* Weight Card */}
      <Card
        className={cn(
          'border-blue-200 bg-white transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-lg'
        )}
      >
        <CardContent className='p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div
                className={cn(
                  'rounded-md bg-blue-50 p-1 transition-all duration-300',
                  isAnimating && 'animate-bounce'
                )}
              >
                <TrendingDown className='h-3 w-3 text-blue-600' />
              </div>
              <div>
                <div
                  className={cn(
                    'text-lg font-bold text-blue-600 transition-all duration-300'
                  )}
                >
                  {weight ? `${weight} kg` : '--'}
                </div>
                <p className='text-xs font-medium text-gray-600'>Weight</p>
                {targetWeight && (
                  <p className='text-xs text-gray-500'>
                    Target: {targetWeight} kg
                  </p>
                )}
                {/* Trend indicator */}
                {weightTrend !== 0 && (
                  <div className='mt-1 flex items-center gap-1'>
                    {getTrendIcon(weightTrend)}
                    <span
                      className={cn(
                        'text-xs font-medium',
                        weightTrend > 0 ? 'text-red-500' : 'text-green-500'
                      )}
                    >
                      {getTrendText(weightTrend, 'kg')} this week
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card
        className={cn(
          'border-green-200 bg-white transition-all duration-300 hover:scale-105 hover:border-green-300 hover:shadow-lg'
        )}
      >
        <CardContent className='p-3'>
          <div className='space-y-2'>
            {/* Header with icon and percentage */}
            <div className='flex items-center gap-2'>
              <div
                className={cn(
                  'rounded-md bg-green-50 p-1 transition-all duration-300',
                  isAnimating && 'animate-bounce'
                )}
              >
                <Trophy className='h-3 w-3 text-green-600' />
              </div>
              <div>
                <div
                  className={cn(
                    'text-lg font-bold text-green-600 transition-all duration-300'
                  )}
                >
                  {progress.toFixed(1)}%
                </div>
                <p className='text-xs font-medium text-gray-600'>Progress</p>
              </div>
            </div>

            {/* Full-width progress bar */}
            <Progress
              value={Math.max(0, Math.min(100, progress))}
              className='w-full'
              enableCelebration={true}
            />

            {/* Trend indicator */}
            {progressTrend !== 0 && (
              <div className='flex items-center gap-1'>
                {getTrendIcon(progressTrend)}
                <span
                  className={cn(
                    'text-xs font-medium',
                    progressTrend > 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {getTrendText(progressTrend, '%')} this week
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card
        className={cn(
          'border-orange-200 bg-white transition-all duration-300 hover:scale-105 hover:border-orange-300 hover:shadow-lg'
        )}
      >
        <CardContent className='p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div
                className={cn(
                  'rounded-md bg-orange-50 p-1 transition-all duration-300',
                  isAnimating && 'animate-bounce'
                )}
              >
                <Flame className='h-3 w-3 text-orange-600' />
              </div>
              <div>
                <div
                  className={cn(
                    'text-lg font-bold text-orange-600 transition-all duration-300'
                  )}
                >
                  {longestStreak}
                </div>
                <p className='text-xs font-medium text-gray-600'>Best Streak</p>
                <p className='text-xs text-gray-500'>days</p>
                {/* Trend indicator */}
                {streakTrend !== 0 && (
                  <div className='mt-1 flex items-center gap-1'>
                    {getTrendIcon(streakTrend)}
                    <span
                      className={cn(
                        'text-xs font-medium',
                        streakTrend > 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {getTrendText(streakTrend, ' days')} this week
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
