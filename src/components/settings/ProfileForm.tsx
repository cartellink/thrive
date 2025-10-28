import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, User as UserIcon } from 'lucide-react';
import { PROFILE_FORM_FIELDS } from '@/lib/constants';

interface ProfileFormProps {
  formData: {
    display_name: string;
    height_cm: string;
    starting_weight_kg: string;
    target_weight_kg: string;
    target_date: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  error: string;
}

export function ProfileForm({
  formData,
  onInputChange,
  onSubmit,
  saving,
  error,
}: ProfileFormProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <UserIcon className='h-5 w-5' />
        <h3 className='text-lg font-semibold'>Profile Information</h3>
      </div>
      <p className='text-sm text-gray-600'>
        Update your personal information and goals
      </p>

      <form onSubmit={onSubmit} className='space-y-4'>
        {PROFILE_FORM_FIELDS.map(field => (
          <div key={field.id} className='space-y-2'>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className='ml-1 text-red-500'>*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={
                'placeholder' in field ? field.placeholder : undefined
              }
              value={formData[field.id as keyof typeof formData]}
              onChange={e => onInputChange(field.id, e.target.value)}
              step={'step' in field ? field.step : undefined}
              min={'min' in field ? field.min : undefined}
              max={'max' in field ? field.max : undefined}
              required={field.required}
            />
            {'helpText' in field && field.helpText && (
              <p className='text-sm text-gray-500'>{field.helpText}</p>
            )}
          </div>
        ))}

        {error && (
          <div className='rounded-md bg-red-50 p-3 text-center text-sm text-red-600'>
            {error}
          </div>
        )}

        <Button type='submit' disabled={saving}>
          {saving ? (
            <>
              <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
              Saving...
            </>
          ) : (
            <>
              <Save className='mr-2 h-4 w-4' />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
