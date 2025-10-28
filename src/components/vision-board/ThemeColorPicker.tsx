import { THEME_COLORS, ThemeColor } from '@/lib/constants';

interface ThemeColorPickerProps {
  selectedTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
}

export function ThemeColorPicker({
  selectedTheme,
  onThemeChange,
}: ThemeColorPickerProps) {
  return (
    <div className='mt-2 flex items-center gap-2'>
      {THEME_COLORS.map(color => (
        <button
          key={color}
          type='button'
          onClick={() => onThemeChange(color)}
          className={`h-6 w-6 rounded-full border-2 transition-all ${
            selectedTheme === color
              ? `bg-${color}-600 border-${color}-800`
              : `bg-${color}-200 border-${color}-300 hover:bg-${color}-300`
          }`}
          title={`${color.charAt(0).toUpperCase() + color.slice(1)} theme`}
        />
      ))}
    </div>
  );
}
