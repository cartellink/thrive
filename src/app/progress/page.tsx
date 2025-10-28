'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressChart } from '@/components/progress/ProgressChart';
import { WeeklySummaryCard } from '@/components/progress/WeeklySummaryCard';
import { useAuth } from '@/hooks/useAuth';
import { useProgressData } from '@/hooks/useProgressData';

export default function ProgressPage() {
  // Use custom hooks
  const { user, loading: authLoading } = useAuth();
  const {
    chartData,
    weeklySummary,
    loading: progressLoading,
  } = useProgressData(user?.id || null);

  const loading = authLoading || progressLoading;

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <p className='mb-4 text-red-600'>Error loading user data</p>
          <Button onClick={() => (window.location.href = '/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='charts' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='charts'>Charts & Trends</TabsTrigger>
          <TabsTrigger value='summary'>Weekly Summary</TabsTrigger>
        </TabsList>

        <TabsContent value='charts' className='space-y-6'>
          {/* Weight Chart */}
          <ProgressChart
            data={chartData}
            dataKey='weight'
            title='Weight Trend'
            description='Your weight progression over the last 30 days'
            color='#2563eb'
            unit=' kg'
          />

          {/* Body Fat Chart */}
          <ProgressChart
            data={chartData}
            dataKey='bodyFat'
            title='Body Fat Percentage'
            description='Track your body composition changes'
            color='#dc2626'
            unit='%'
          />

          {/* Muscle Mass Chart */}
          <ProgressChart
            data={chartData}
            dataKey='muscleMass'
            title='Muscle Mass'
            description='Monitor your muscle mass changes'
            color='#16a34a'
            unit=' kg'
          />
        </TabsContent>

        <TabsContent value='summary' className='space-y-6'>
          <WeeklySummaryCard weeklyData={weeklySummary} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
