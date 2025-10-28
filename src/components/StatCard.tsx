import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'gradient' | 'outlined';
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'indigo';
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  subtitle,
  trend,
  variant = 'default',
  color = 'blue',
  className,
}: StatCardProps) {
  const colorVariants = {
    blue: {
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-600',
    },
    green: {
      gradient: 'bg-gradient-to-br from-green-500 to-green-600',
      border: 'border-green-200',
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-600',
    },
    orange: {
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
      border: 'border-orange-200',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      icon: 'text-orange-600',
    },
    purple: {
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
      border: 'border-purple-200',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'text-purple-600',
    },
    pink: {
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
      border: 'border-pink-200',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      icon: 'text-pink-600',
    },
    indigo: {
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      border: 'border-indigo-200',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      icon: 'text-indigo-600',
    },
  };

  const colors = colorVariants[color];

  const variantStyles = {
    default: `border ${colors.border} ${colors.bg}`,
    gradient: `${colors.gradient} text-white border-0`,
    outlined: `border-2 ${colors.border} bg-white`,
  };

  return (
    <Card
      className={cn(
        'transition-smooth hover-lift',
        variantStyles[variant],
        className
      )}
    >
      <CardContent className='p-2'>
        <div className='mb-1 flex items-center justify-between'>
          <div
            className={cn(
              'rounded-md p-1',
              variant === 'gradient' ? 'bg-white/20' : colors.bg
            )}
          >
            <Icon
              className={cn(
                'h-3 w-3',
                variant === 'gradient' ? 'text-white' : colors.icon
              )}
            />
          </div>
          {trend && (
            <div
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </div>
          )}
        </div>

        <div className='space-y-0'>
          <div
            className={cn(
              'text-lg font-bold',
              variant === 'gradient' ? 'text-white' : colors.text
            )}
          >
            {value}
          </div>
          <p
            className={cn(
              'text-xs font-medium',
              variant === 'gradient' ? 'text-blue-100' : 'text-gray-600'
            )}
          >
            {label}
          </p>
          {subtitle && (
            <p
              className={cn(
                'text-xs',
                variant === 'gradient' ? 'text-blue-200' : 'text-gray-500'
              )}
            >
              {subtitle}
            </p>
          )}
          {trend?.label && (
            <p
              className={cn(
                'text-xs',
                variant === 'gradient' ? 'text-blue-200' : 'text-gray-500'
              )}
            >
              {trend.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
