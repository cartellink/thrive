// Date utilities
export function getTodayString(): string {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
}

export function getDateRange(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export function getYesterdayString(): string {
  const yesterday = new Date(Date.now() - 86400000);
  return yesterday.toLocaleDateString('en-CA');
}

// Calculation utilities
export function calculateProgress(
  current: number | null,
  start: number | null,
  target: number | null
): number {
  if (!start || !target) return 0;
  const totalLoss = start - target;
  const currentLoss = start - (current || start);
  return Math.max(0, Math.min(100, (currentLoss / totalLoss) * 100));
}

export function calculateBMI(weight: number, height: number): number {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// Array utilities
export function reorderArray<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

// Form utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

// File utilities
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File must be a JPEG, PNG, or WebP image' };
  }

  return { valid: true };
}

// String utilities
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
