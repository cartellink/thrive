import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

type User = Tables<'users'>;
type Profile = Tables<'profiles'>;

interface UseAuthReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadAuthData = useCallback(async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      // Load user data (anonymized)
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (!userData) {
        router.push('/auth/onboarding');
        return;
      }

      setUser(userData);

      // Load profile data (minimal auth info)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setProfile(profileData);
    } catch (err) {
      console.error('Error loading auth data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  return { user, profile, loading, error };
}
