import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { getTodayString, formatDateToISO } from '@/lib/helpers';

type HabitStreak = Tables<'habit_streaks'>;

interface UseStreaksReturn {
  streaks: HabitStreak[];
  loading: boolean;
  error: string | null;
  updateStreaks: (
    userHabitId: string,
    targetMetToday: boolean,
    dailyTarget: number
  ) => Promise<void>;
}

export function useStreaks(userId: string | null): UseStreaksReturn {
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStreaks = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: streaksData } = await supabase
        .from('habit_streaks')
        .select('*')
        .eq('user_id', userId);

      setStreaks(streaksData || []);
    } catch (err) {
      console.error('Error loading streaks:', err);
      setError('Failed to load streaks');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadStreaks();
    }
  }, [userId, loadStreaks]);

  const updateStreaks = async (
    userHabitId: string,
    targetMetToday: boolean,
    dailyTarget: number
  ) => {
    if (!userId) return;

    try {
      const today = getTodayString();

      // Calculate streak from scratch based on completion history
      const { data: completions } = await supabase
        .from('daily_habit_completions')
        .select('completion_date, completion_count')
        .eq('user_id', userId)
        .eq('user_habit_id', userHabitId)
        .order('completion_date', { ascending: false });

      // Get existing longest streak to preserve it
      const { data: existingStreak } = await supabase
        .from('habit_streaks')
        .select('longest_streak')
        .eq('user_id', userId)
        .eq('user_habit_id', userHabitId)
        .single();

      let longestStreak = existingStreak?.longest_streak || 0;

      // Calculate streak by going backwards from today
      let currentStreak = 0;
      let tempStreak = 0;

      // If target is met today, start counting from today
      if (targetMetToday) {
        tempStreak = 1;
        currentStreak = 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      }

      // Continue counting backwards for consecutive days
      let daysBack = 1;
      while (daysBack <= 365) {
        // Limit to prevent infinite loops
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - daysBack);
        const dateString = formatDateToISO(checkDate);

        const completion = completions?.find(
          c => c.completion_date === dateString
        );

        if (completion && completion.completion_count >= dailyTarget) {
          tempStreak++;
          currentStreak = Math.max(currentStreak, tempStreak);
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          // Streak broken
          break;
        }

        daysBack++;
      }

      // Update the streak record
      const { error: streakError } = await supabase
        .from('habit_streaks')
        .upsert(
          {
            user_id: userId,
            user_habit_id: userHabitId,
            habit_type: userHabitId, // Keep for backward compatibility
            current_streak: currentStreak,
            longest_streak: longestStreak,
            last_updated: today,
          },
          {
            onConflict: 'user_id,user_habit_id',
            ignoreDuplicates: false,
          }
        );

      if (streakError) {
        console.error('Error updating streak:', streakError);
        setError('Failed to update streak');
      } else {
        // Reload streaks
        await loadStreaks();
      }
    } catch (err) {
      console.error('Error updating streaks:', err);
      setError('Failed to update streaks');
    }
  };

  return {
    streaks,
    loading,
    error,
    updateStreaks,
  };
}
