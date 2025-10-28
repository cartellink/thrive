import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { HabitPreset } from '@/types/app';
import { HABIT_CATEGORIES } from '@/lib/constants';

interface HabitPresetLibraryProps {
  habitPresets: HabitPreset[];
  userHabits: Array<{ habit_preset_id?: string | null }>;
  onAddHabit: (presetId: string) => Promise<void>;
}

export function HabitPresetLibrary({
  habitPresets,
  userHabits,
  onAddHabit,
}: HabitPresetLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPresets = habitPresets
    .filter(
      preset =>
        selectedCategory === 'all' || preset.category === selectedCategory
    )
    .filter(preset => !userHabits.some(uh => uh.habit_preset_id === preset.id));

  return (
    <div className='rounded-lg border bg-gray-50 p-4'>
      <div className='mb-4'>
        <label className='mb-2 block text-sm font-semibold'>
          Choose from preset habits
        </label>
        <div className='flex flex-wrap gap-2'>
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className='cursor-pointer'
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {HABIT_CATEGORIES.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className='cursor-pointer capitalize'
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className='max-h-96 space-y-2 overflow-y-auto'>
        {filteredPresets.map(preset => (
          <div
            key={preset.id}
            className='flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 transition-colors hover:border-indigo-300'
            onClick={() => onAddHabit(preset.id)}
          >
            <span className='text-2xl'>{preset.icon}</span>
            <div className='flex-1'>
              <div className='text-sm font-medium'>{preset.name}</div>
              {preset.description && (
                <div className='mt-0.5 text-xs text-gray-500'>
                  {preset.description}
                </div>
              )}
              {(preset.default_daily_target || 1) > 1 && (
                <div className='mt-0.5 text-xs font-medium text-indigo-600'>
                  Target: {preset.default_daily_target}x per day
                </div>
              )}
            </div>
            <Plus className='h-5 w-5 text-indigo-600' />
          </div>
        ))}
      </div>
    </div>
  );
}
