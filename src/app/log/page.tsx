'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState } from '@/components/LoadingState';
import { AppShell } from '@/components/layout/AppShell';
import { Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

// Type aliases for cleaner usage
type User = Tables<'users'>;

export default function LogPage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    weight_kg: '',
    body_fat_percent: '',
    bmi: '',
    muscle_mass_kg: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadTodayLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTodayLog = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      // Get user record
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

      const today = new Date().toISOString().split('T')[0];
      const { data: logData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userData.id)
        .eq('log_date', today)
        .single();

      if (logData) {
        setFormData({
          weight_kg: logData.weight_kg?.toString() || '',
          body_fat_percent: logData.body_fat_percent?.toString() || '',
          bmi: logData.bmi?.toString() || '',
          muscle_mass_kg: logData.muscle_mass_kg?.toString() || '',
          notes: logData.notes || '',
        });
      }
    } catch (error) {
      console.error("Error loading today's log:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser || !user) {
        router.push('/auth/login');
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const logData = {
        user_id: user.id,
        log_date: today,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        body_fat_percent: formData.body_fat_percent
          ? parseFloat(formData.body_fat_percent)
          : null,
        bmi: formData.bmi ? parseFloat(formData.bmi) : null,
        muscle_mass_kg: formData.muscle_mass_kg
          ? parseFloat(formData.muscle_mass_kg)
          : null,
        notes: formData.notes || null,
      };

      // Check if a log already exists for today
      const { data: existingLog } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single();

      let error;
      if (existingLog) {
        // Update existing log
        const { error: updateError } = await supabase
          .from('daily_logs')
          .update(logData)
          .eq('id', existingLog.id);
        error = updateError;
      } else {
        // Insert new log
        const { error: insertError } = await supabase
          .from('daily_logs')
          .insert(logData);
        error = insertError;
      }

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading today's log..." size='lg' />;
  }

  return (
    <AppShell>
      <PageHeader
        title='Daily Log'
        showBackButton
        onBack={() => router.back()}
      />

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Today&apos;s Measurements</CardTitle>
          <CardDescription>
            Log your daily progress to track your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='weight'>Weight (kg)</Label>
                <Input
                  id='weight'
                  type='number'
                  step='0.1'
                  placeholder='Enter your weight'
                  value={formData.weight_kg}
                  onChange={e =>
                    setFormData({ ...formData, weight_kg: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='body_fat'>Body Fat %</Label>
                <Input
                  id='body_fat'
                  type='number'
                  step='0.1'
                  placeholder='Enter body fat percentage'
                  value={formData.body_fat_percent}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      body_fat_percent: e.target.value,
                    })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bmi'>BMI</Label>
                <Input
                  id='bmi'
                  type='number'
                  step='0.1'
                  placeholder='Enter BMI'
                  value={formData.bmi}
                  onChange={e =>
                    setFormData({ ...formData, bmi: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='muscle_mass'>Muscle Mass (kg)</Label>
                <Input
                  id='muscle_mass'
                  type='number'
                  step='0.1'
                  placeholder='Enter muscle mass'
                  value={formData.muscle_mass_kg}
                  onChange={e =>
                    setFormData({ ...formData, muscle_mass_kg: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <textarea
                id='notes'
                className='min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='Add any notes about your day...'
                value={formData.notes}
                onChange={e =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            {error && (
              <div className='rounded-lg bg-red-50 p-3 text-center text-sm text-red-600'>
                {error}
              </div>
            )}

            <div className='flex gap-3'>
              <Button type='submit' variant='gradient' loading={saving}>
                <Save className='mr-2 h-4 w-4' />
                {saving ? 'Saving...' : 'Save Log'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
