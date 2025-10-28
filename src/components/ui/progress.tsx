'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import { Confetti } from './confetti';
import {
  detectMilestoneCrossing,
  MILESTONE_THRESHOLDS,
} from '@/lib/animations';

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  showMilestones?: boolean;
  enableCelebration?: boolean;
}

function Progress({
  className,
  value = 0,
  showMilestones = true,
  enableCelebration = true,
  ...props
}: ProgressProps) {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [previousValue, setPreviousValueState] = React.useState<number | null>(
    null
  );

  // Detect milestone crossings and trigger celebration
  React.useEffect(() => {
    if (!enableCelebration || previousValue === null || value === null) {
      setPreviousValueState(value);
      return;
    }

    const milestone = detectMilestoneCrossing(
      value,
      previousValue,
      MILESTONE_THRESHOLDS.PROGRESS
    );
    if (milestone !== null) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setPreviousValueState(value);
  }, [value, previousValue, enableCelebration]);

  const progressValue = Math.max(0, Math.min(100, value || 0));

  return (
    <>
      <ProgressPrimitive.Root
        data-slot='progress'
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner',
          className
        )}
        {...props}
      >
        {/* Milestone markers */}
        {showMilestones && (
          <div className='absolute inset-0 flex items-center justify-between px-1'>
            {MILESTONE_THRESHOLDS.PROGRESS.map(milestone => (
              <div
                key={milestone}
                className={cn(
                  'h-1 w-1 rounded-full transition-all duration-300',
                  progressValue >= milestone
                    ? 'bg-white shadow-sm'
                    : 'bg-gray-400'
                )}
                style={{ left: `${milestone}%` }}
              />
            ))}
          </div>
        )}

        {/* Progress indicator with gradient */}
        <ProgressPrimitive.Indicator
          data-slot='progress-indicator'
          className={cn(
            'relative h-full w-full flex-1 transition-all duration-500 ease-out',
            'bg-linear-to-r from-blue-500 via-blue-400 to-green-500',
            'shadow-sm',
            progressValue >= 75 && 'shadow-green-500/50',
            progressValue >= 50 && progressValue < 75 && 'shadow-blue-500/50',
            progressValue < 50 && 'shadow-blue-500/30'
          )}
          style={{
            transform: `translateX(-${100 - progressValue}%)`,
            background:
              progressValue >= 75
                ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)'
                : progressValue >= 50
                  ? 'linear-gradient(90deg, #3b82f6, #60a5fa, #10b981)'
                  : 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)',
          }}
        >
          {/* Shimmer effect */}
          <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent' />

          {/* Glow effect for high progress */}
          {progressValue >= 75 && (
            <div className='absolute inset-0 bg-green-400/20' />
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>

      {/* Confetti celebration */}
      {showConfetti && <Confetti trigger={showConfetti} />}
    </>
  );
}

export { Progress };
