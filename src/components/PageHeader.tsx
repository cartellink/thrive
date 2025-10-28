import * as React from 'react';
import { ArrowLeft, Settings, LogOut } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
  navItems?: NavItem[];
}

export function PageHeader({
  title,
  showBackButton = false,
  backHref,
  onBack,
  actions,
  className,
  variant = 'default',
  navItems = [],
}: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const headerVariants = {
    default: 'bg-white/80 backdrop-blur-sm border-b border-gray-200',
    gradient:
      'bg-white/95 backdrop-blur-sm border-b border-gray-200 text-gray-900',
    glass: 'glass border-b border-white/20',
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 mb-3 w-full shadow-sm',
        headerVariants[variant],
        className
      )}
    >
      <div className='w-full px-3 sm:px-4 lg:px-6'>
        <div className='flex h-10 items-center justify-between'>
          <div className='flex items-center gap-2'>
            {showBackButton && (
              <IconButton
                variant={variant === 'glass' ? 'ghost-light' : 'ghost-dark'}
                size='sm'
                onClick={handleBack}
              >
                <ArrowLeft className='h-4 w-4' />
              </IconButton>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className='flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80'
            >
              <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600'>
                <span className='text-xs font-bold text-white'>T</span>
              </div>
              <h1
                className={cn(
                  'text-lg font-bold',
                  variant === 'glass' && 'text-white'
                )}
              >
                {title}
              </h1>
            </button>
          </div>

          {/* Navigation Items */}
          {navItems.length > 0 && (
            <nav className='hidden items-center gap-1 md:flex'>
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? variant === 'glass'
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 text-blue-700'
                        : variant === 'glass'
                          ? 'text-white/80 hover:bg-white/10 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {actions && <div className='flex items-center gap-2'>{actions}</div>}
        </div>
      </div>
    </header>
  );
}

// Convenience components for common actions
export function PageHeaderActions({
  onSettings,
  onLogout,
  variant = 'default',
}: {
  onSettings?: () => void;
  onLogout?: () => void;
  variant?: 'default' | 'gradient' | 'glass';
}) {
  return (
    <>
      {onSettings && (
        <IconButton
          variant={variant === 'glass' ? 'ghost-light' : 'ghost-dark'}
          size='sm'
          onClick={onSettings}
        >
          <Settings className='h-4 w-4' />
        </IconButton>
      )}
      {onLogout && (
        <IconButton
          variant={variant === 'glass' ? 'ghost-light' : 'ghost-danger'}
          size='sm'
          onClick={onLogout}
        >
          <LogOut className='h-4 w-4' />
        </IconButton>
      )}
    </>
  );
}
