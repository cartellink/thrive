// Animation utilities and milestone detection helpers

export const MILESTONE_THRESHOLDS = {
  PROGRESS: [25, 50, 75, 100],
  STREAK: [3, 7, 14, 30, 100],
  WEIGHT_LOSS: [1, 2.5, 5, 10], // kg milestones
};

export const ANIMATION_DURATIONS = {
  SHORT: 300,
  MEDIUM: 600,
  LONG: 1000,
  CELEBRATION: 2000,
};

export const FIRE_INTENSITY_LEVELS = {
  NONE: {
    min: 0,
    max: 0,
    className: 'text-gray-400',
    animation: 'none',
    level: 'none',
  },
  EMBER: {
    min: 1,
    max: 2,
    className: 'text-orange-400',
    animation: 'pulse',
    level: 'ember',
  },
  SMALL: {
    min: 3,
    max: 6,
    className: 'text-orange-500',
    animation: 'flicker',
    level: 'small',
  },
  MEDIUM: {
    min: 7,
    max: 13,
    className: 'text-orange-600',
    animation: 'glow',
    level: 'medium',
  },
  LARGE: {
    min: 14,
    max: 29,
    className: 'text-red-500',
    animation: 'intense',
    level: 'large',
  },
  INFERNO: {
    min: 30,
    max: Infinity,
    className: 'text-red-600',
    animation: 'inferno',
    level: 'inferno',
  },
};

// Milestone detection
export function detectMilestoneCrossing(
  currentValue: number,
  previousValue: number,
  thresholds: number[]
): number | null {
  for (const threshold of thresholds) {
    if (previousValue < threshold && currentValue >= threshold) {
      return threshold;
    }
  }
  return null;
}

// Get fire intensity based on streak length
export function getFireIntensity(streak: number) {
  for (const [key, config] of Object.entries(FIRE_INTENSITY_LEVELS)) {
    if (streak >= config.min && streak <= config.max) {
      return { ...config, level: key.toLowerCase() };
    }
  }
  return FIRE_INTENSITY_LEVELS.NONE;
}

// Calculate days until next streak milestone
export function getDaysUntilNextMilestone(currentStreak: number): number {
  const milestones = MILESTONE_THRESHOLDS.STREAK;
  const nextMilestone = milestones.find(m => m > currentStreak);
  return nextMilestone ? nextMilestone - currentStreak : 0;
}

// Generate celebration message based on milestone
export function getCelebrationMessage(
  type: 'progress' | 'streak' | 'weight',
  value: number
): string {
  switch (type) {
    case 'progress':
      return `🎉 ${value}% progress achieved!`;
    case 'streak':
      return `🔥 ${value}-day streak! You're on fire!`;
    case 'weight':
      return `⚖️ ${value}kg milestone reached!`;
    default:
      return '🎉 Milestone achieved!';
  }
}

// Local storage helpers for tracking previous values
export function getPreviousValue(key: string): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`thrive_${key}`);
  return stored ? parseFloat(stored) : null;
}

export function setPreviousValue(key: string, value: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`thrive_${key}`, value.toString());
}

// CSS animation classes
export const ANIMATION_CLASSES = {
  PULSE: 'animate-pulse',
  BOUNCE: 'animate-bounce',
  SPIN: 'animate-spin',
  PING: 'animate-ping',
  FADE_IN: 'animate-fade-in',
  SCALE_IN: 'animate-scale-in',
  SLIDE_UP: 'animate-slide-up',
  GLOW: 'animate-glow',
  FLICKER: 'animate-flicker',
  INTENSE: 'animate-intense',
};
