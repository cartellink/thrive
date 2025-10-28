import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { getTodayString } from '@/lib/helpers';

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
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
        'en-CA'
      );

      const { data: existingStreaks } = await supabase
        .from('habit_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('user_habit_id', userHabitId);

      const existingStreak = existingStreaks?.[0];

      // Check if yesterday's target was met
      const { data: yesterdayCompletions } = await supabase
        .from('daily_habit_completions')
        .select('completion_count')
        .eq('user_id', userId)
        .eq('user_habit_id', userHabitId)
        .eq('completion_date', yesterday);

      const yesterdayCompletion = yesterdayCompletions?.[0];
      const yesterdayTargetMet =
        yesterdayCompletion &&
        yesterdayCompletion.completion_count >= dailyTarget;

      let newStreak = 0;
      let longestStreak = existingStreak?.longest_streak || 0;

      if (targetMetToday) {
        // Target is met today
        if (existingStreak?.last_updated === today) {
          // Already counted today - if current streak is 0, set it to at least 1
          newStreak = Math.max(existingStreak.current_streak, 1);
        } else if (
          existingStreak?.last_updated === yesterday &&
          yesterdayTargetMet
        ) {
          // Continue streak from yesterday
          newStreak = existingStreak.current_streak + 1;
        } else if (
          existingStreak?.last_updated === yesterday &&
          !yesterdayTargetMet
        ) {
          // Yesterday target wasn't met, start fresh
          newStreak = 1;
        } else {
          // First time or gap in days - start new streak
          newStreak = 1;
        }

        longestStreak = Math.max(newStreak, longestStreak);
      } else {
        // Target not met today
        if (existingStreak?.last_updated === today) {
          // We're on the same day - if we had a streak and we're just untoggling, decrement by 1
          // This handles the case where user toggles a habit off after completing it
          if (existingStreak.current_streak > 0) {
            newStreak = Math.max(0, existingStreak.current_streak - 1);
          } else {
            newStreak = 0;
          }
        } else {
          // Different day and not completed - streak broken
          newStreak = 0;
        }
      }

      const { error: streakError } = await supabase
        .from('habit_streaks')
        .upsert(
          {
            user_id: userId,
            user_habit_id: userHabitId,
            habit_type: userHabitId, // Keep for backward compatibility
            current_streak: newStreak,
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
