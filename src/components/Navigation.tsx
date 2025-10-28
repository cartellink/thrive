import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  variant?: 'default' | 'gradient' | 'glass';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Recipe', href: '/recipe' },
  { label: 'Progress', href: '/progress' },
  { label: 'Vision Board', href: '/vision-board' },
];

export function Navigation({ variant = 'default' }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className='flex items-center gap-1'>
      {NAV_ITEMS.map(item => {
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
  );
}
