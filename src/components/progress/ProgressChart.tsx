import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '@/types/app';

interface ProgressChartProps {
  data: ChartData[];
  dataKey: string;
  title: string;
  description: string;
  color: string;
  unit?: string;
}

export function ProgressChart({
  data,
  dataKey,
  title,
  description,
  color,
  unit = '',
}: ProgressChartProps) {
  // Calculate dynamic Y-axis range based on actual data
  const getYAxisDomain = () => {
    if (!data || data.length === 0) return [0, 100];

    const values = data
      .map(d => d[dataKey as keyof ChartData])
      .filter(val => val !== null && val !== undefined) as number[];

    if (values.length === 0) return [0, 100];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    // Add 10% buffer on each side, but ensure minimum range for visibility
    const buffer = Math.max(range * 0.1, range * 0.05, 0.5);
    const domainMin = Math.max(0, min - buffer);
    const domainMax = max + buffer;

    return [domainMin, domainMax];
  };

  const yAxisDomain = getYAxisDomain();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className='text-sm text-gray-600'>{description}</p>
      </CardHeader>
      <CardContent>
        <div className='h-64 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
                tickFormatter={value =>
                  new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
              <YAxis
                domain={yAxisDomain}
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) => `${value.toFixed(1)}${unit}`}
              />
              <Tooltip
                labelFormatter={value => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [
                  `${value?.toFixed(1)}${unit}`,
                  dataKey,
                ]}
              />
              <Line
                type='monotone'
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
