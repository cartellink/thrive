'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/hooks/useAuth';

export default function RecipePage() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingState message='Loading recipes...' size='lg' />;
  }

  return (
    <div className='py-6'>
      <Card>
        <CardHeader>
          <CardTitle>Recipe Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600'>
            Your healthy recipe collection will be available here soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
