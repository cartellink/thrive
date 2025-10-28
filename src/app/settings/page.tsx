'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Plus, LogOut } from 'lucide-react';
import { PageHeader, PageHeaderActions } from '@/components/PageHeader';
import { AppShell } from '@/components/layout/AppShell';
import { HabitPresetLibrary } from '@/components/settings/HabitPresetLibrary';
import { HabitListItem } from '@/components/settings/HabitListItem';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { supabase } from '@/lib/supabase';
import { HabitPreset } from '@/types/app';

export default function SettingsPage() {
  const [habitPresets, setHabitPresets] = useState<HabitPreset[]>([]);
  const [showPresetLibrary, setShowPresetLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    display_name: '',
    height_cm: '',
    starting_weight_kg: '',
    target_weight_kg: '',
    target_date: '',
  });

  // Use custom hooks
  const { user, profile } = useAuth();
  const {
    userHabits,
    updateDailyTarget,
    removeHabit,
    moveHabit,
    addHabitFromPreset,
  } = useHabits(user?.id || null);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      // Load habit presets
      const { data: presetsData } = await supabase
        .from('habit_presets')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      setHabitPresets(presetsData || []);

      // Set form data from user and profile
      if (user && profile) {
        setFormData({
          display_name: profile.display_name || '',
          height_cm: user.height_cm?.toString() || '',
          starting_weight_kg: user.starting_weight_kg?.toString() || '',
          target_weight_kg: user.target_weight_kg?.toString() || '',
          target_date: user.target_date || '',
        });
      }
    } catch (error) {
      console.error('Error loading settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Update profile (display name)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name || null,
        })
        .eq('id', user.auth_user_id);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      // Update user data (anonymized metrics)
      const { error: userError } = await supabase
        .from('users')
        .update({
          height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
          starting_weight_kg: formData.starting_weight_kg
            ? parseFloat(formData.starting_weight_kg)
            : null,
          target_weight_kg: formData.target_weight_kg
            ? parseFloat(formData.target_weight_kg)
            : null,
          target_date: formData.target_date || null,
        })
        .eq('id', user.id);

      if (userError) {
        setError(userError.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title='Settings'
        showBackButton={true}
        backHref='/dashboard'
        actions={<PageHeaderActions onLogout={handleLogout} />}
        variant='gradient'
      />

      <div className='space-y-6'>
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              saving={saving}
              error={error}
            />
          </CardContent>
        </Card>

        {/* Habit Management */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Heart className='h-5 w-5' />
              Habit Tracking
            </CardTitle>
            <CardDescription>
              Manage the daily habits you want to track
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* Active Habits List */}
              {userHabits.length > 0 ? (
                <div className='space-y-2'>
                  {userHabits.map((habit, index) => (
                    <HabitListItem
                      key={habit.id}
                      habit={habit}
                      index={index}
                      totalHabits={userHabits.length}
                      onUpdateDailyTarget={updateDailyTarget}
                      onMoveHabit={moveHabit}
                      onRemoveHabit={removeHabit}
                    />
                  ))}
                </div>
              ) : (
                <div className='py-8 text-center text-gray-500'>
                  <Heart className='mx-auto mb-3 h-12 w-12 text-gray-300' />
                  <p className='text-sm'>No habits added yet</p>
                  <p className='mt-1 text-xs text-gray-400'>
                    Add habits from the library below
                  </p>
                </div>
              )}

              {/* Add Habit Button */}
              <Button
                onClick={() => setShowPresetLibrary(!showPresetLibrary)}
                variant='outline'
              >
                <Plus className='mr-2 h-4 w-4' />
                {showPresetLibrary
                  ? 'Hide Habit Library'
                  : 'Add Habit from Library'}
              </Button>

              {/* Preset Library */}
              {showPresetLibrary && (
                <HabitPresetLibrary
                  habitPresets={habitPresets}
                  userHabits={
                    userHabits as Array<{ habit_preset_id?: string | null }>
                  }
                  onAddHabit={addHabitFromPreset}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <LogOut className='h-5 w-5' />
              Account Actions
            </CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='destructive' onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4' />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Thrive</CardTitle>
            <CardDescription>
              Your personal weight loss accountability partner
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm text-gray-600'>
            <p className='mb-2'>
              Thrive helps you track your fitness journey with daily metrics,
              habit tracking, progress photos, and personalized motivation.
            </p>
            <p>Version 1.0.0 - Built with Next.js and Supabase</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
