import { XCircle, Target } from 'lucide-react';
import Image from 'next/image';
import { IconButton } from '@/components/ui/icon-button';
import { VisionBoardItem } from '@/types/app';

interface VisionBoardItemModalProps {
  item: VisionBoardItem | null;
  onClose: () => void;
}

export function VisionBoardItemModal({
  item,
  onClose,
}: VisionBoardItemModalProps) {
  // Force rebuild
  if (!item) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='transition-smooth max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        {item.image_url ? (
          <div className='relative'>
            <Image
              src={item.image_url}
              alt={item.title || 'Vision board item'}
              width={800}
              height={600}
              className='h-auto max-h-[85vh] w-full object-contain'
              priority
              unoptimized
            />
            {(item.title || item.description) && (
              <div className='absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-4'>
                {item.title && (
                  <h3 className='mb-2 text-xl font-semibold text-white'>
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className='text-white/90'>{item.description}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className='flex min-h-[60vh] items-center justify-center p-5'>
            <div className='w-full text-center'>
              <div className='mb-8'>
                <div
                  className={`mx-auto mb-6 inline-flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br ${
                    item.theme === 'blue'
                      ? 'from-blue-500 to-blue-700'
                      : item.theme === 'green'
                        ? 'from-green-500 to-green-700'
                        : item.theme === 'purple'
                          ? 'from-purple-500 to-purple-700'
                          : item.theme === 'rose'
                            ? 'from-rose-500 to-rose-700'
                            : item.theme === 'indigo'
                              ? 'from-indigo-500 to-indigo-700'
                              : 'from-amber-500 to-amber-700'
                  } text-white shadow-lg`}
                >
                  <Target className='h-12 w-12' />
                </div>
                <h2 className='mb-4 text-3xl font-bold text-gray-900'>
                  {item.title || 'Goal'}
                </h2>
                {item.description && (
                  <p className='mx-auto text-xl leading-relaxed text-gray-600'>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='absolute top-4 right-4'>
          <IconButton variant='secondary' size='sm' onClick={onClose}>
            <XCircle className='h-5 w-5' />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
