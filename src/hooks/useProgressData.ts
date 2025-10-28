import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { getDateRange } from '@/lib/helpers';

type DailyLog = Tables<'daily_logs'>;
type UserHabit = Tables<'user_habits'>;
type DailyHabitCompletion = Tables<'daily_habit_completions'>;
type HabitPreset = Tables<'habit_presets'>;

export type UserHabitWithPreset = UserHabit & {
  habit_preset?: HabitPreset;
};

interface ChartDataPoint {
  date: string;
  weight: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  bmi: number | null;
}

interface HabitStat {
  habit: string;
  completedDays: number;
  percentage: number;
  name: string;
}

interface WeeklySummary {
  habitStats: HabitStat[];
  weightChange: number;
  totalLogs: number;
  averageWeight: number;
}

interface UseProgressDataReturn {
  logs: DailyLog[];
  userHabits: UserHabitWithPreset[];
  habitCompletions: DailyHabitCompletion[];
  loading: boolean;
  error: string | null;
  chartData: ChartDataPoint[];
  habitChartData: Array<{ habit: string; percentage: number }>;
  weeklySummary: WeeklySummary;
}

export function useProgressData(userId: string | null): UseProgressDataReturn {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [userHabits, setUserHabits] = useState<UserHabitWithPreset[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<
    DailyHabitCompletion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProgressData();
    }
  }, [userId]);

  const loadProgressData = async () => {
    if (!userId) return;

    try {
      // Load logs (last 30 days)
      const thirtyDaysAgoStr = getDateRange(30);

      const { data: logsData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('log_date', thirtyDaysAgoStr)
        .order('log_date', { ascending: true });

      setLogs(logsData || []);

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

      // Load habit completions for last 30 days
      const { data: completionsData } = await supabase
        .from('daily_habit_completions')
        .select('*')
        .eq('user_id', userId)
        .gte('completion_date', thirtyDaysAgoStr);

      setHabitCompletions(completionsData || []);
    } catch (err) {
      console.error('Error loading progress data:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklySummary = (): WeeklySummary => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Filter completions for this week
    const weekCompletions = habitCompletions.filter(completion => {
      const completionDate = new Date(completion.completion_date);
      return completionDate >= weekStart && completionDate <= weekEnd;
    });

    const totalDays = 7;

    // Calculate stats for each user habit
    const habitStats = userHabits.map(habit => {
      const dailyTarget = habit.daily_target || 1;

      // Count days where target was met
      const completedDays = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const dayCompletion = weekCompletions.find(
          c => c.user_habit_id === habit.id && c.completion_date === dateStr
        );

        return (
          dayCompletion && (dayCompletion.completion_count || 0) >= dailyTarget
        );
      }).filter(Boolean).length;

      const habitName =
        habit.custom_name || habit.habit_preset?.name || 'Habit';

      return {
        habit: habit.id,
        completedDays,
        percentage: (completedDays / totalDays) * 100,
        name: habitName,
      };
    });

    // Weight calculation
    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.log_date);
      return logDate >= weekStart && logDate <= weekEnd;
    });

    const weightChange =
      weekLogs.length > 0
        ? (weekLogs[weekLogs.length - 1].weight_kg || 0) -
          (weekLogs[0].weight_kg || 0)
        : 0;

    return {
      habitStats,
      weightChange,
      totalLogs: weekLogs.length,
      averageWeight:
        weekLogs.length > 0
          ? weekLogs.reduce((sum, log) => sum + (log.weight_kg || 0), 0) /
            weekLogs.length
          : 0,
    };
  };

  const prepareChartData = (): ChartDataPoint[] => {
    return logs.map(log => ({
      date: new Date(log.log_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      weight: log.weight_kg,
      bodyFat: log.body_fat_percent,
      muscleMass: log.muscle_mass_kg,
      bmi: log.bmi,
    }));
  };

  const prepareHabitChartData = () => {
    const weeklySummary = calculateWeeklySummary();
    return weeklySummary.habitStats.map(stat => ({
      habit: stat.name,
      percentage: stat.percentage,
    }));
  };

  const chartData = prepareChartData();
  const habitChartData = prepareHabitChartData();
  const weeklySummary = calculateWeeklySummary();

  return {
    logs,
    userHabits,
    habitCompletions,
    loading,
    error,
    chartData,
    habitChartData,
    weeklySummary,
  };
}
