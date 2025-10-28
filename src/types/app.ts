import { Tables } from '@/types/supabase';

// Re-export Supabase types for convenience
export type User = Tables<'users'>;
export type Profile = Tables<'profiles'>;
export type DailyLog = Tables<'daily_logs'>;
export type HabitStreak = Tables<'habit_streaks'>;
export type VisionBoardItem = Tables<'vision_board_items'>;
export type UserHabit = Tables<'user_habits'>;
export type DailyHabitCompletion = Tables<'daily_habit_completions'>;
export type HabitPreset = Tables<'habit_presets'>;
export type ProgressPhoto = Tables<'progress_photos'>;

// Extended types for joined data
export type UserHabitWithPreset = UserHabit & {
  habit_preset?: HabitPreset;
};

// Chart data types
export interface ChartDataPoint {
  date: string;
  weight: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  bmi: number | null;
}

export interface HabitChartDataPoint {
  habit: string;
  percentage: number;
}

// Habit statistics
export interface HabitStat {
  habit: string;
  completedDays: number;
  percentage: number;
  name: string;
}

export interface WeeklySummary {
  habitStats: HabitStat[];
  weightChange: number;
  totalLogs: number;
  averageWeight: number;
}

// Form field configuration types
export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'password';
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
  required?: boolean;
  helpText?: string;
}

// Dashboard configuration types
export interface QuickActionConfig {
  variant:
    | 'blue'
    | 'green'
    | 'purple'
    | 'orange'
    | 'pink'
    | 'indigo'
    | 'primary';
  icon: string;
  label: string;
  path: string;
}

export interface DashboardStatConfig {
  icon: string;
  label: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'indigo';
  getValue: (data: Record<string, unknown>) => string | number;
}

export interface ProgressChartConfig {
  key: string;
  title: string;
  description: string;
  dataKey: string;
  color: string;
  icon: string;
}

// Theme types
export type ThemeColor =
  | 'amber'
  | 'blue'
  | 'green'
  | 'purple'
  | 'rose'
  | 'indigo';
export type HabitCategory =
  | 'health'
  | 'nutrition'
  | 'productivity'
  | 'social'
  | 'wellness'
  | 'sports'
  | 'mental';

// Collage layout types
export interface CollageItem {
  id: string;
  title?: string | null;
  image_url?: string | null;
  theme?: ThemeColor;
  isMotivational?: boolean;
  randomIndex?: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex?: number;
}

export interface CollageLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface ChartData {
  date: string;
  weight?: number | null;
  bodyFat?: number | null;
  muscleMass?: number | null;
  bmi?: number | null;
  [key: string]: string | number | null | undefined;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// File upload types
export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Validation types
export interface ValidationResult {
  valid: boolean;
  error?: string;
}
