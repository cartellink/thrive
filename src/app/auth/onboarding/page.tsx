'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AuthLayout,
  AuthForm,
  AuthField,
  AuthActions,
} from '@/components/layout/AuthLayout';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const [heightCm, setHeightCm] = useState('');
  const [startingWeight, setStartingWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Set default target date to 6 months from now
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    setTargetDate(sixMonthsFromNow.toISOString().split('T')[0]);
  }, []);

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Get the user record ID first
      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userRecord) {
        setError('User record not found');
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          height_cm: parseFloat(heightCm),
          starting_weight_kg: parseFloat(startingWeight),
          target_weight_kg: parseFloat(targetWeight),
          target_date: targetDate || null,
          onboarding_completed: true,
        })
        .eq('id', userRecord.id);

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Let's Get Started"
      subtitle='Tell us about your goals to personalize your experience'
    >
      <AuthForm onSubmit={handleOnboarding}>
        <AuthField>
          <Label htmlFor='height'>Height (cm)</Label>
          <Input
            id='height'
            type='number'
            value={heightCm}
            onChange={e => setHeightCm(e.target.value)}
            required
            min='100'
            max='250'
            step='0.1'
            placeholder='Enter your height'
          />
        </AuthField>

        <AuthField>
          <Label htmlFor='startingWeight'>Current Weight (kg)</Label>
          <Input
            id='startingWeight'
            type='number'
            value={startingWeight}
            onChange={e => setStartingWeight(e.target.value)}
            required
            min='30'
            max='300'
            step='0.1'
            placeholder='Enter your current weight'
          />
        </AuthField>

        <AuthField>
          <Label htmlFor='targetWeight'>Target Weight (kg)</Label>
          <Input
            id='targetWeight'
            type='number'
            value={targetWeight}
            onChange={e => setTargetWeight(e.target.value)}
            required
            min='30'
            max='300'
            step='0.1'
            placeholder='Enter your target weight'
          />
        </AuthField>

        <AuthField>
          <Label htmlFor='targetDate'>Target Date (optional)</Label>
          <Input
            id='targetDate'
            type='date'
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
          />
          <p className='text-sm text-gray-500'>
            Leave empty for no specific timeline
          </p>
        </AuthField>

        {error && (
          <div className='text-center text-sm text-red-600'>{error}</div>
        )}

        <AuthActions>
          <Button
            type='submit'
            className='w-full'
            variant='gradient'
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </Button>
        </AuthActions>
      </AuthForm>
    </AuthLayout>
  );
}
