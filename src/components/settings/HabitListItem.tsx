import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { UserHabitWithPreset } from '@/types/app';

interface HabitListItemProps {
  habit: UserHabitWithPreset;
  index: number;
  totalHabits: number;
  onUpdateDailyTarget: (habitId: string, newTarget: number) => Promise<void>;
  onMoveHabit: (habitId: string, direction: 'up' | 'down') => Promise<void>;
  onRemoveHabit: (habitId: string) => Promise<void>;
}

export function HabitListItem({
  habit,
  index,
  totalHabits,
  onUpdateDailyTarget,
  onMoveHabit,
  onRemoveHabit,
}: HabitListItemProps) {
  const habitName = habit.custom_name || habit.habit_preset?.name || 'Habit';
  const habitIcon = habit.custom_icon || habit.habit_preset?.icon || '✓';
  const habitCategory = habit.habit_preset?.category || 'custom';
  const dailyTarget = habit.daily_target || 1;

  return (
    <div className='flex items-center gap-2 rounded-lg border bg-gray-50 p-3'>
      <div className='flex flex-1 items-center gap-2'>
        <span className='text-2xl'>{habitIcon}</span>
        <div className='flex-1'>
          <div className='text-sm font-medium'>{habitName}</div>
          <div className='mt-1 flex items-center gap-2'>
            <Badge variant='secondary' className='text-xs capitalize'>
              {habitCategory}
            </Badge>
            <div className='flex items-center gap-1 text-xs text-gray-600'>
              <span>Daily target:</span>
              <Input
                type='number'
                min='1'
                max='20'
                value={dailyTarget}
                onChange={e =>
                  onUpdateDailyTarget(habit.id, parseInt(e.target.value) || 1)
                }
                className='h-6 w-14 px-2 text-xs'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <IconButton
          variant='ghost'
          size='sm'
          onClick={() => onMoveHabit(habit.id, 'up')}
          disabled={index === 0}
        >
          <ChevronUp className='h-4 w-4' />
        </IconButton>
        <IconButton
          variant='ghost'
          size='sm'
          onClick={() => onMoveHabit(habit.id, 'down')}
          disabled={index === totalHabits - 1}
        >
          <ChevronDown className='h-4 w-4' />
        </IconButton>
        <IconButton
          variant='ghost-danger'
          size='sm'
          onClick={() => onRemoveHabit(habit.id)}
        >
          <Trash2 className='h-4 w-4' />
        </IconButton>
      </div>
    </div>
  );
}
