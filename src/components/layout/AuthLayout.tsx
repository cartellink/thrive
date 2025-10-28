import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8'>
      <div
        className={cn(
          'w-full max-w-4xl rounded-xl border bg-white shadow-xl',
          className
        )}
      >
        <div className='border-b border-gray-100 px-8 py-10 text-center sm:px-12 md:px-16'>
          <h1 className='mb-4 text-3xl font-bold text-gray-900'>{title}</h1>
          {subtitle && <p className='text-lg text-gray-600'>{subtitle}</p>}
        </div>
        <div className='px-8 py-10 sm:px-12 md:px-16'>{children}</div>
      </div>
    </div>
  );
}

// Convenience components for common auth patterns
interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function AuthForm({ children, onSubmit, className }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      {children}
    </form>
  );
}

interface AuthFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthField({ children, className }: AuthFieldProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

interface AuthActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthActions({ children, className }: AuthActionsProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

interface AuthFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthFooter({ children, className }: AuthFooterProps) {
  return (
    <div className={cn('mt-4 text-center text-sm', className)}>{children}</div>
  );
}
