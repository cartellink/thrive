import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { TextCard } from '@/components/TextCard';
import { Edit, Trash2, Upload, Plus, Target } from 'lucide-react';
import { VisionBoardItem, ThemeColor } from '@/types/app';

interface VisionBoardGridProps {
  items: VisionBoardItem[];
  onEditItem: (item: VisionBoardItem) => void;
  onDeleteItem: (itemId: string) => void;
  onUploadImage?: () => void;
  onAddTextCard?: () => void;
  onAddSampleContent?: () => void;
}

export function VisionBoardGrid({
  items,
  onEditItem,
  onDeleteItem,
  onUploadImage,
  onAddTextCard,
  onAddSampleContent,
}: VisionBoardGridProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className='py-12 text-center'>
          <div className='mx-auto mb-4 h-12 w-12 text-gray-400'>📋</div>
          <h3 className='mb-2 text-lg font-medium text-gray-900'>
            Start building your vision
          </h3>
          <p className='mb-6 text-gray-600'>
            Add images and text cards that represent your goals and motivations.
            Try the masonry layout with sample content to see how it works!
          </p>
          <div className='flex flex-col justify-center gap-3 sm:flex-row'>
            {onUploadImage && (
              <Button onClick={onUploadImage}>
                <Upload className='mr-2 h-4 w-4' />
                Upload Image
              </Button>
            )}
            {onAddTextCard && (
              <Button variant='outline' onClick={onAddTextCard}>
                <Plus className='mr-2 h-4 w-4' />
                Add Text Card
              </Button>
            )}
            {onAddSampleContent && (
              <Button variant='secondary' onClick={onAddSampleContent}>
                <Target className='mr-2 h-4 w-4' />
                Add Sample Content
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {items.map((item, index) => (
        <Card
          key={item.id}
          className='break-inside-avoid overflow-hidden transition-shadow duration-200 hover:shadow-lg'
        >
          {item.image_url ? (
            <div className='group relative'>
              <img
                src={item.image_url}
                alt={item.title || 'Vision board image'}
                className='h-auto w-full rounded-t-lg object-contain'
              />
              <div className='absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                <IconButton
                  size='sm'
                  variant='secondary'
                  onClick={() => onEditItem(item)}
                >
                  <Edit className='h-3 w-3' />
                </IconButton>
                <IconButton
                  size='sm'
                  variant='destructive'
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 className='h-3 w-3' />
                </IconButton>
              </div>
              {(item.title || item.description) && (
                <div className='bg-white p-3'>
                  {item.title && (
                    <h3 className='mb-1 text-sm font-semibold'>{item.title}</h3>
                  )}
                  {item.description && (
                    <p className='text-xs text-gray-600'>{item.description}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className='group relative'>
              <TextCard
                text={item.title || 'Goal'}
                theme={(item.theme as ThemeColor) || 'amber'}
                index={index}
                totalItems={items.length}
              />
              <div className='absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                <IconButton
                  size='sm'
                  variant='secondary'
                  onClick={() => onEditItem(item)}
                >
                  <Edit className='h-3 w-3' />
                </IconButton>
                <IconButton
                  size='sm'
                  variant='destructive'
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 className='h-3 w-3' />
                </IconButton>
              </div>
              {item.description && (
                <div className='bg-white p-3'>
                  <p className='text-xs text-gray-600'>{item.description}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
