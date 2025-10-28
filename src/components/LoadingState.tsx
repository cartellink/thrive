import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'minimal';
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  variant = 'default',
  className,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinnerVariants = {
    default: 'spinner',
    gradient: 'spinner-gradient',
    minimal:
      'animate-spin rounded-full border-2 border-gray-200 border-t-gray-600',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-8',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full border-2',
          sizeClasses[size],
          spinnerVariants[variant]
        )}
      />

      {message && (
        <p
          className={cn(
            'mt-4 text-sm font-medium',
            variant === 'gradient' ? 'text-white' : 'text-gray-600'
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// Convenience components for common loading states
export function PageLoading({
  message = 'Loading page...',
}: {
  message?: string;
}) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <LoadingState message={message} size='lg' />
    </div>
  );
}

export function CardLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className='flex items-center justify-center p-8'>
      <LoadingState message={message} size='md' />
    </div>
  );
}

export function ButtonLoading({
  message = 'Loading...',
  variant = 'default',
}: {
  message?: string;
  variant?: 'default' | 'gradient' | 'minimal';
}) {
  return (
    <div className='flex items-center gap-2'>
      <LoadingState message='' size='sm' variant={variant} />
      <span className='text-sm'>{message}</span>
    </div>
  );
}

export function InlineLoading({
  message = 'Loading...',
  size = 'sm',
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className='flex items-center gap-2'>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'
        )}
      />
      <span className='text-sm text-gray-600'>{message}</span>
    </div>
  );
}

// Skeleton loading components
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded bg-gray-200', className)} />;
}

export function CardSkeleton() {
  return (
    <div className='space-y-4 p-6'>
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-4 w-1/2' />
      <Skeleton className='h-20 w-full' />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  );
}
