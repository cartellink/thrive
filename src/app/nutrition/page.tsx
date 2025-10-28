'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/hooks/useAuth';

export default function NutritionPage() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingState message='Loading nutrition tracker...' size='lg' />;
  }

  return (
    <div className='py-6'>
      <Card>
        <CardHeader>
          <CardTitle>Daily Nutrition Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600'>
            Track your daily calories, macronutrients, and nutrition goals here!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
