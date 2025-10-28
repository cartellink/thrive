import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { getTodayString } from '@/lib/helpers';

type UserHabit = Tables<'user_habits'>;
type HabitPreset = Tables<'habit_presets'>;
type DailyHabitCompletion = Tables<'daily_habit_completions'>;

export type UserHabitWithPreset = UserHabit & {
  habit_preset?: HabitPreset;
};

interface UseHabitsReturn {
  userHabits: UserHabitWithPreset[];
  completions: DailyHabitCompletion[];
  loading: boolean;
  error: string | null;
  toggleHabit: (
    userHabitId: string,
    currentCount: number,
    dailyTarget: number,
    increment: boolean
  ) => Promise<void>;
  updateDailyTarget: (habitId: string, newTarget: number) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  moveHabit: (habitId: string, direction: 'up' | 'down') => Promise<void>;
  addHabitFromPreset: (presetId: string) => Promise<void>;
}

export function useHabits(userId: string | null): UseHabitsReturn {
  const [userHabits, setUserHabits] = useState<UserHabitWithPreset[]>([]);
  const [completions, setCompletions] = useState<DailyHabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabitsData = useCallback(async () => {
    if (!userId) return;

    try {
      // Load user habits with preset data
      const { data: habitsData } = await supabase
        .from('user_habits')
        .select(
          `
          *,
          habit_preset:habit_presets(*)
        `
        )
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      setUserHabits(habitsData || []);

      // Load today's completions
      const today = getTodayString();
      const { data: completionsData } = await supabase
        .from('daily_habit_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('completion_date', today);

      setCompletions(completionsData || []);
    } catch (err) {
      console.error('Error loading habits data:', err);
      setError('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadHabitsData();
    }
  }, [userId, loadHabitsData]);

  const toggleHabit = async (
    userHabitId: string,
    currentCount: number,
    dailyTarget: number,
    increment: boolean
  ) => {
    if (!userId) return;

    try {
      const today = getTodayString();
      const newCount = increment
        ? currentCount + 1
        : Math.max(0, currentCount - 1);

      if (newCount === 0) {
        // Remove completion entirely
        await supabase
          .from('daily_habit_completions')
          .delete()
          .eq('user_id', userId)
          .eq('user_habit_id', userHabitId)
          .eq('completion_date', today);

        setCompletions(prev =>
          prev.filter(c => c.user_habit_id !== userHabitId)
        );
      } else {
        // Upsert with new count
        const { data } = await supabase
          .from('daily_habit_completions')
          .upsert(
            {
              user_id: userId,
              user_habit_id: userHabitId,
              completion_date: today,
              completion_count: newCount,
            },
            {
              onConflict: 'user_id,user_habit_id,completion_date',
            }
          )
          .select()
          .single();

        if (data) {
          setCompletions(prev => {
            const filtered = prev.filter(c => c.user_habit_id !== userHabitId);
            return [...filtered, data];
          });
        }
      }
    } catch (err) {
      console.error('Error toggling habit:', err);
      setError('Failed to update habit');
    }
  };

  const updateDailyTarget = async (habitId: string, newTarget: number) => {
    if (!userId || newTarget < 1 || newTarget > 20) return;

    try {
      await supabase
        .from('user_habits')
        .update({ daily_target: newTarget })
        .eq('id', habitId);

      setUserHabits(
        userHabits.map(h =>
          h.id === habitId ? { ...h, daily_target: newTarget } : h
        )
      );
    } catch (err) {
      console.error('Error updating daily target:', err);
      setError('Failed to update habit target');
    }
  };

  const removeHabit = async (habitId: string) => {
    if (!userId) return;

    try {
      await supabase
        .from('user_habits')
        .update({ is_active: false })
        .eq('id', habitId);

      setUserHabits(userHabits.filter(h => h.id !== habitId));
    } catch (err) {
      console.error('Error removing habit:', err);
      setError('Failed to remove habit');
    }
  };

  const moveHabit = async (habitId: string, direction: 'up' | 'down') => {
    const index = userHabits.findIndex(h => h.id === habitId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === userHabits.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newHabits = [...userHabits];
    const temp = newHabits[index];
    newHabits[index] = newHabits[newIndex];
    newHabits[newIndex] = temp;

    try {
      // Update display_order for both habits
      await supabase
        .from('user_habits')
        .update({ display_order: newIndex })
        .eq('id', temp.id);

      await supabase
        .from('user_habits')
        .update({ display_order: index })
        .eq('id', newHabits[index].id);

      setUserHabits(newHabits);
    } catch (err) {
      console.error('Error moving habit:', err);
      setError('Failed to reorder habits');
    }
  };

  const addHabitFromPreset = async (presetId: string) => {
    if (!userId) return;

    try {
      // First, get the preset to get its default_daily_target
      const { data: presetData, error: presetError } = await supabase
        .from('habit_presets')
        .select('default_daily_target')
        .eq('id', presetId)
        .single();

      if (presetError) {
        console.error('Error fetching preset:', presetError);
        setError('Failed to fetch habit preset');
        return;
      }

      const maxOrder = userHabits.reduce(
        (max, h) => Math.max(max, h.display_order || 0),
        -1
      );

      const { data, error } = await supabase
        .from('user_habits')
        .insert({
          user_id: userId,
          habit_preset_id: presetId,
          display_order: maxOrder + 1,
          is_active: true,
          daily_target: presetData?.default_daily_target || 1,
        })
        .select(
          `
          *,
          habit_preset:habit_presets(*)
        `
        )
        .single();

      if (error) {
        console.error('Error adding habit:', error);
        setError('Failed to add habit');
      } else if (data) {
        setUserHabits([...userHabits, data]);
      }
    } catch (err) {
      console.error('Error adding habit:', err);
      setError('Failed to add habit');
    }
  };

  return {
    userHabits,
    completions,
    loading,
    error,
    toggleHabit,
    updateDailyTarget,
    removeHabit,
    moveHabit,
    addHabitFromPreset,
  };
}
