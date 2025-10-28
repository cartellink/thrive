import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeColorPicker } from './ThemeColorPicker';
import { ThemeColor } from '@/types/app';

interface VisionBoardFormProps {
  onSubmit: (
    title: string,
    description: string,
    theme: ThemeColor
  ) => Promise<void>;
  onCancel: () => void;
  initialTitle?: string;
  initialDescription?: string;
  initialTheme?: ThemeColor;
  title?: string;
}

export function VisionBoardForm({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialDescription = '',
  initialTheme = 'amber',
  title = 'Add Text Card',
}: VisionBoardFormProps) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
  });
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(initialTheme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      await onSubmit(formData.title, formData.description, selectedTheme);
    }
  };

  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              name='title'
              placeholder='e.g., Move faster on court'
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              name='description'
              placeholder='Why this goal matters to you...'
              rows={3}
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Theme Color</Label>
            <ThemeColorPicker
              selectedTheme={selectedTheme}
              onThemeChange={setSelectedTheme}
            />
          </div>
          <div className='flex gap-2'>
            <Button type='submit'>Add Card</Button>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
