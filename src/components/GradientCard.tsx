import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GradientCardProps {
  children: React.ReactNode;
  variant?:
    | 'blue'
    | 'purple'
    | 'green'
    | 'orange'
    | 'pink'
    | 'indigo'
    | 'primary';
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function GradientCard({
  children,
  variant = 'primary',
  className,
  hover = true,
  glass = false,
  onClick,
}: GradientCardProps) {
  const gradientVariants = {
    primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-600',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
  };

  return (
    <Card
      className={cn(
        'border-0 text-white shadow-lg',
        gradientVariants[variant],
        hover && 'hover-lift cursor-pointer',
        glass && 'glass border-white/20',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  return (
    <Card
      className={cn(
        'glass border-white/20 text-white',
        hover && 'hover-lift cursor-pointer',
        className
      )}
    >
      {children}
    </Card>
  );
}

// Convenience components for common card patterns
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?:
    | 'blue'
    | 'purple'
    | 'green'
    | 'orange'
    | 'pink'
    | 'indigo'
    | 'primary';
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = 'primary',
  onClick,
  className,
}: FeatureCardProps) {
  return (
    <GradientCard
      variant={variant}
      hover={!!onClick}
      className={cn(onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <CardContent className='p-4 text-center'>
        <div className='mb-3 inline-flex items-center justify-center rounded-full bg-white/20 p-3 backdrop-blur-sm'>
          {icon}
        </div>
        <h3 className='mb-1 text-base font-semibold'>{title}</h3>
        <p className='text-sm leading-relaxed text-blue-100'>{description}</p>
      </CardContent>
    </GradientCard>
  );
}

interface ActionCardProps {
  children: React.ReactNode;
  variant?:
    | 'blue'
    | 'purple'
    | 'green'
    | 'orange'
    | 'pink'
    | 'indigo'
    | 'primary';
  onClick?: () => void;
  className?: string;
}

export function ActionCard({
  children,
  variant = 'primary',
  onClick,
  className,
}: ActionCardProps) {
  return (
    <GradientCard
      variant={variant}
      hover={!!onClick}
      className={cn(onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <CardContent className='p-3'>{children}</CardContent>
    </GradientCard>
  );
}
