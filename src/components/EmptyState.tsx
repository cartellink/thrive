import * as React from 'react';
import { LucideIcon, Heart, Target, Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'gradient';
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-8 text-center',
        className
      )}
    >
      <div className='mb-4 inline-flex items-center justify-center rounded-full bg-gray-100 p-4'>
        <Icon className='h-8 w-8 text-gray-400' />
      </div>

      <h3 className='mb-1 text-lg font-semibold text-gray-900'>{title}</h3>

      <p className='mb-4 text-gray-600'>{description}</p>

      {action && (
        <Button
          onClick={action.onClick}
          variant={
            action.variant === 'gradient'
              ? 'gradient'
              : action.variant || 'default'
          }
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Convenience components for common empty states
interface EmptyHabitsProps {
  onAddHabit: () => void;
}

export function EmptyHabits({ onAddHabit }: EmptyHabitsProps) {
  return (
    <EmptyState
      icon={Heart}
      title='No habits yet'
      description='Start building healthy habits by adding your first one. Small steps lead to big changes!'
      action={{
        label: 'Add Your First Habit',
        onClick: onAddHabit,
        variant: 'gradient',
      }}
    />
  );
}

interface EmptyVisionBoardProps {
  onAddItem: () => void;
}

export function EmptyVisionBoard({ onAddItem }: EmptyVisionBoardProps) {
  return (
    <EmptyState
      icon={Target}
      title='Create your vision board'
      description='Add images and goals that inspire you. Visualizing your dreams makes them more achievable!'
      action={{
        label: 'Add Your First Goal',
        onClick: onAddItem,
        variant: 'gradient',
      }}
    />
  );
}

interface EmptyPhotosProps {
  onUploadPhoto: () => void;
}

export function EmptyPhotos({ onUploadPhoto }: EmptyPhotosProps) {
  return (
    <EmptyState
      icon={Camera}
      title='No photos yet'
      description='Track your progress with photos. Visual evidence of your transformation is incredibly motivating!'
      action={{
        label: 'Upload Your First Photo',
        onClick: onUploadPhoto,
        variant: 'gradient',
      }}
    />
  );
}

interface EmptyLogsProps {
  onLogEntry: () => void;
}

export function EmptyLogs({ onLogEntry }: EmptyLogsProps) {
  return (
    <EmptyState
      icon={Plus}
      title='No entries yet'
      description='Start logging your daily progress. Consistency is key to achieving your goals!'
      action={{
        label: 'Log Your First Entry',
        onClick: onLogEntry,
        variant: 'gradient',
      }}
    />
  );
}
