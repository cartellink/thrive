import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

type DailyLog = Tables<'daily_logs'>;

interface UseLatestLogReturn {
  latestLog: DailyLog | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLatestLog(userId: string | null): UseLatestLogReturn {
  const [latestLog, setLatestLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLatestLog = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data: logData, error: fetchError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setLatestLog(logData || null);
    } catch (err) {
      console.error('Error loading latest log:', err);
      setError('Failed to load latest log');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadLatestLog();
    }
  }, [userId, loadLatestLog]);

  const refetch = async () => {
    await loadLatestLog();
  };

  return {
    latestLog,
    loading,
    error,
    refetch,
  };
}
