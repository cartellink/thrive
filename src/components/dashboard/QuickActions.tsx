import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionCard } from '@/components/GradientCard';
import { Zap, Plus, BarChart3, Camera, Target } from 'lucide-react';
import { QUICK_ACTIONS } from '@/lib/constants';

export function QuickActions() {
  const router = useRouter();

  const iconMap = {
    Plus,
    BarChart3,
    Camera,
    Target,
  };

  return (
    <Card variant='outlined' className='border-yellow-200'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-1.5 text-sm'>
          <Zap className='h-3.5 w-3.5 text-yellow-500' />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-2'>
          {QUICK_ACTIONS.map(action => {
            const IconComponent = iconMap[action.icon];

            return (
              <ActionCard
                key={action.path}
                variant={action.variant}
                onClick={() => router.push(action.path)}
                className='h-12 [&>div]:!p-0'
              >
                <div className='flex h-full flex-col items-center justify-center gap-0'>
                  <IconComponent className='h-3.5 w-3.5' />
                  <span className='text-xs leading-tight font-semibold'>
                    {action.label}
                  </span>
                </div>
              </ActionCard>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
