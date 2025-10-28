'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Camera, Target, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/progress', icon: BarChart3, label: 'Progress' },
    { href: '/log', icon: Plus, label: 'Log', highlight: true },
    { href: '/photos', icon: Camera, label: 'Photos' },
    { href: '/vision-board', icon: Target, label: 'Goals' },
  ];

  return (
    <nav className='fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm md:hidden'>
      <div className='flex h-16 items-center justify-around px-2'>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className='-mt-8 flex flex-col items-center justify-center'
                aria-label={`${item.label} - Primary action`}
              >
                <div className='rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl'>
                  <Icon className='h-6 w-6' />
                </div>
                <span className='mt-2 text-xs font-medium text-gray-600'>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center transition-all duration-300',
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-6 w-6 transition-all duration-300',
                  isActive && 'scale-110'
                )}
              />
              <span className='mt-1 text-xs font-medium'>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
