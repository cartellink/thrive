import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { TrendingDown, Calendar } from 'lucide-react';

interface WeeklySummaryCardProps {
  weeklyData: {
    habitStats: Array<{
      habit: string;
      completedDays: number;
      percentage: number;
      name: string;
    }>;
    weightChange: number;
    totalLogs: number;
    averageWeight: number;
  };
}

export function WeeklySummaryCard({ weeklyData }: WeeklySummaryCardProps) {
  const stats = [
    {
      icon: TrendingDown,
      value: `${weeklyData.averageWeight.toFixed(1)} kg`,
      label: 'Avg Weight',
      trend: {
        value: Math.abs(weeklyData.weightChange),
        isPositive: weeklyData.weightChange >= 0,
        label: weeklyData.weightChange >= 0 ? 'Weight gain' : 'Weight loss',
      },
      color: 'blue' as const,
    },
    {
      icon: Calendar,
      value: `${weeklyData.totalLogs}/7`,
      label: 'Days Logged',
      color: 'green' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
        <p className='text-sm text-gray-600'>
          Your performance over the last 7 days
        </p>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              trend={stat.trend}
              color={stat.color}
            />
          ))}
        </div>

        {/* Habit Performance */}
        {weeklyData.habitStats.length > 0 && (
          <div className='mt-6'>
            <h3 className='mb-4 text-lg font-semibold'>Habit Performance</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {weeklyData.habitStats.map((stat, index) => (
                <div key={index} className='rounded-lg border p-4'>
                  <div className='mb-2 flex items-center justify-between'>
                    <h4 className='font-medium'>{stat.name}</h4>
                    <span className='text-sm text-gray-500'>
                      {stat.completedDays}/7 days
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className={`h-2 rounded-full ${
                        stat.percentage >= 70
                          ? 'bg-green-500'
                          : stat.percentage >= 40
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <p className='mt-1 text-xs text-gray-500'>
                    {stat.percentage.toFixed(0)}% completion rate
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
