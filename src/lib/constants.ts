// Theme colors for vision board and text cards
export const THEME_COLORS = [
  'amber',
  'blue',
  'green',
  'purple',
  'rose',
  'indigo',
] as const;

export type ThemeColor = (typeof THEME_COLORS)[number];

// Habit categories
export const HABIT_CATEGORIES = [
  'health',
  'nutrition',
  'productivity',
  'social',
  'wellness',
  'sports',
  'mental',
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

// Dashboard quick actions configuration
export const QUICK_ACTIONS = [
  {
    variant: 'blue' as const,
    icon: 'Plus' as const,
    label: 'Log',
    path: '/log',
  },
  {
    variant: 'green' as const,
    icon: 'BarChart3' as const,
    label: 'Progress',
    path: '/progress',
  },
  {
    variant: 'purple' as const,
    icon: 'Camera' as const,
    label: 'Photos',
    path: '/photos',
  },
  {
    variant: 'orange' as const,
    icon: 'Target' as const,
    label: 'Vision',
    path: '/vision-board',
  },
] as const;

// Dashboard stats configuration
export const DASHBOARD_STATS = [
  {
    icon: 'TrendingDown' as const,
    label: 'Weight',
    color: 'blue' as const,
    getValue: (data: { weight: number; targetWeight?: number }) =>
      `${data.weight} kg`,
    getSubtitle: (data: { targetWeight?: number }) =>
      data.targetWeight ? `Target: ${data.targetWeight} kg` : undefined,
  },
  {
    icon: 'Trophy' as const,
    label: 'Progress',
    color: 'green' as const,
    getValue: (data: { progress: number }) => `${data.progress.toFixed(1)}%`,
    getSubtitle: () => undefined,
  },
  {
    icon: 'Flame' as const,
    label: 'Streak',
    color: 'orange' as const,
    getValue: (data: { daysSince: number }) => data.daysSince,
    getSubtitle: () => 'days',
  },
] as const;

// Progress chart configuration
export const PROGRESS_CHARTS = [
  {
    key: 'weight',
    title: 'Weight Trend',
    description: 'Your weight progression over the last 30 days',
    dataKey: 'weight',
    color: '#2563eb',
    icon: 'TrendingDown' as const,
  },
  {
    key: 'bodyFat',
    title: 'Body Fat Percentage',
    description: 'Track your body composition changes',
    dataKey: 'bodyFat',
    color: '#dc2626',
    icon: 'TrendingUp' as const,
  },
  {
    key: 'muscleMass',
    title: 'Muscle Mass',
    description: 'Monitor your muscle mass changes',
    dataKey: 'muscleMass',
    color: '#16a34a',
    icon: 'TrendingUp' as const,
  },
] as const;

// Motivational quotes for dashboard
export const MOTIVATIONAL_QUOTES = [
  'Every expert was once a beginner',
  "The only bad workout is the one that didn't happen",
  'Progress, not perfection',
  "Don't wish for it, work for it",
  'Success is the sum of small efforts repeated day in and day out',
  'The pain you feel today is the strength you feel tomorrow',
  'Your only limit is your mind',
  "Champions are made when nobody's watching",
  'The comeback is always stronger than the setback',
  "Today's struggle is tomorrow's strength",
  "Believe you can and you're halfway there",
  'The future belongs to those who believe in their dreams',
  'What lies behind us and what lies before us are tiny matters compared to what lies within us',
  'The only way to do great work is to love what you do',
  'Success is not final, failure is not fatal: it is the courage to continue that counts',
  'You are never too old to set another goal or to dream a new dream',
  'The way to get started is to quit talking and begin doing',
  "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart",
  'The only impossible journey is the one you never begin',
  'Life is 10% what happens to you and 90% how you react to it',
];

// Function to generate a random motivational quote
export function getRandomMotivationalQuote(): string {
  return MOTIVATIONAL_QUOTES[
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  ];
}

// Function to generate multiple random quotes (ensuring no duplicates)
export function getRandomMotivationalQuotes(count: number): string[] {
  const shuffled = [...MOTIVATIONAL_QUOTES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, MOTIVATIONAL_QUOTES.length));
}

// Form field configurations
export const PROFILE_FORM_FIELDS = [
  {
    id: 'displayName',
    label: 'Display Name (optional)',
    type: 'text' as const,
    placeholder: 'How should we address you?',
    required: false,
  },
  {
    id: 'height',
    label: 'Height (cm)',
    type: 'number' as const,
    step: '0.1',
    min: '100',
    max: '250',
    required: false,
  },
  {
    id: 'startingWeight',
    label: 'Starting Weight (kg)',
    type: 'number' as const,
    step: '0.1',
    min: '30',
    max: '300',
    required: false,
  },
  {
    id: 'targetWeight',
    label: 'Target Weight (kg)',
    type: 'number' as const,
    step: '0.1',
    min: '30',
    max: '300',
    required: false,
  },
  {
    id: 'targetDate',
    label: 'Target Date',
    type: 'date' as const,
    required: false,
    helpText: 'Leave empty for no specific timeline',
  },
] as const;

export const LOG_FORM_FIELDS = [
  {
    id: 'weight',
    label: 'Weight (kg)',
    type: 'number' as const,
    step: '0.1',
    placeholder: 'Enter your weight',
    required: false,
  },
  {
    id: 'bodyFat',
    label: 'Body Fat %',
    type: 'number' as const,
    step: '0.1',
    placeholder: 'Enter body fat percentage',
    required: false,
  },
  {
    id: 'bmi',
    label: 'BMI',
    type: 'number' as const,
    step: '0.1',
    placeholder: 'Enter BMI',
    required: false,
  },
  {
    id: 'muscleMass',
    label: 'Muscle Mass (kg)',
    type: 'number' as const,
    step: '0.1',
    placeholder: 'Enter muscle mass',
    required: false,
  },
] as const;

// Storage bucket names
export const STORAGE_BUCKETS = {
  VISION_BOARD: 'vision-board',
  PROGRESS_PHOTOS: 'progress-photos',
} as const;
