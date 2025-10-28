import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextCardProps {
  text: string;
  theme?: 'amber' | 'blue' | 'green' | 'purple' | 'rose' | 'indigo';
  index?: number;
  totalItems?: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex?: number;
  className?: string;
  onClick?: () => void;
}

export function TextCard({
  text,
  theme = 'amber',
  index = 0,
  totalItems = 1,
  width,
  height,
  rotation = 0,
  zIndex = 1,
  className,
  onClick,
}: TextCardProps) {
  // Define theme color mappings
  const themeColors = {
    amber: {
      primary: 'bg-amber-600',
      primaryText: 'text-white',
      secondary: 'bg-amber-50',
      secondaryText: 'text-amber-900',
      border: 'border-amber-200',
    },
    blue: {
      primary: 'bg-blue-600',
      primaryText: 'text-white',
      secondary: 'bg-blue-50',
      secondaryText: 'text-blue-900',
      border: 'border-blue-200',
    },
    green: {
      primary: 'bg-green-600',
      primaryText: 'text-white',
      secondary: 'bg-green-50',
      secondaryText: 'text-green-900',
      border: 'border-green-200',
    },
    purple: {
      primary: 'bg-purple-600',
      primaryText: 'text-white',
      secondary: 'bg-purple-50',
      secondaryText: 'text-purple-900',
      border: 'border-purple-200',
    },
    rose: {
      primary: 'bg-rose-600',
      primaryText: 'text-white',
      secondary: 'bg-rose-50',
      secondaryText: 'text-rose-900',
      border: 'border-rose-200',
    },
    indigo: {
      primary: 'bg-indigo-600',
      primaryText: 'text-white',
      secondary: 'bg-indigo-50',
      secondaryText: 'text-indigo-900',
      border: 'border-indigo-200',
    },
  };

  const colors = themeColors[theme];

  // Alternate between primary and secondary styles based on index
  const isPrimary = index % 2 === 0;
  const baseClasses = isPrimary
    ? `${colors.primary} ${colors.primaryText}`
    : `${colors.secondary} ${colors.secondaryText} border ${colors.border}`;

  // Dynamic sizing based on number of items or explicit dimensions
  const getSizeClasses = () => {
    if (width && height) {
      // Use explicit dimensions
      if (width > 250 || height > 250) {
        return 'p-6 text-lg';
      } else if (width > 200 || height > 200) {
        return 'p-5 text-base';
      } else if (width > 150 || height > 150) {
        return 'p-4 text-sm';
      } else {
        return 'p-3 text-xs';
      }
    } else {
      // Use totalItems for responsive sizing
      if (totalItems <= 2) {
        return 'min-h-[200px] p-6 text-lg';
      } else if (totalItems <= 4) {
        return 'min-h-[150px] p-5 text-base';
      } else if (totalItems <= 6) {
        return 'min-h-[120px] p-4 text-sm';
      } else {
        return 'min-h-[100px] p-3 text-sm';
      }
    }
  };

  // Vary rounded corners for organic feel
  const roundedClass = ['rounded-md', 'rounded-lg', 'rounded-xl'][index % 3];

  return (
    <div
      className={cn(
        baseClasses,
        getSizeClasses(),
        roundedClass,
        'flex h-full w-full items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        zIndex: zIndex,
        minHeight: height ? `${height}px` : undefined,
        width: width ? `${width}px` : undefined,
      }}
      onClick={onClick}
    >
      <p className='text-center font-serif leading-tight font-medium'>{text}</p>
    </div>
  );
}

// Convenience component for vision board text cards
interface VisionTextCardProps {
  text: string;
  theme?: 'amber' | 'blue' | 'green' | 'purple' | 'rose' | 'indigo';
  index?: number;
  totalItems?: number;
  onClick?: () => void;
}

export function VisionTextCard({
  text,
  theme,
  index = 0,
  totalItems = 1,
  onClick,
}: VisionTextCardProps) {
  return (
    <TextCard
      text={text}
      theme={theme}
      index={index}
      totalItems={totalItems}
      onClick={onClick}
    />
  );
}

// Convenience component for dashboard motivational cards
interface MotivationalCardProps {
  text: string;
  theme?: 'amber' | 'blue' | 'green' | 'purple' | 'rose' | 'indigo';
  index?: number;
  onClick?: () => void;
}

export function MotivationalCard({
  text,
  theme,
  index = 0,
  onClick,
}: MotivationalCardProps) {
  return (
    <TextCard
      text={text}
      theme={theme}
      index={index}
      totalItems={6} // Assume dashboard has ~6 items
      onClick={onClick}
    />
  );
}
