import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { TextCard } from '@/components/TextCard';
import { Target } from 'lucide-react';
import {
  VisionBoardItem,
  CollageItem,
  CollageLayout,
  ThemeColor,
} from '@/types/app';

interface DashboardVisionCollageProps {
  items: VisionBoardItem[];
  onItemClick: (item: VisionBoardItem) => void;
}

// Layout calculation hook for smart panel-aware positioning
const useCollageLayout = (
  items: CollageItem[],
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [layout, setLayout] = useState<CollageLayout[]>([]);

  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current || items.length === 0) {
        setLayout([]);
        return;
      }

      const container = containerRef.current;
      const panelWidth = container.offsetWidth;
      const panelHeight = Math.min(container.offsetHeight, 600);

      const gap = 8;
      const itemCount = items.length;
      const aspectRatio = panelWidth / panelHeight;
      const cols = Math.ceil(Math.sqrt(itemCount * aspectRatio));
      const rows = Math.ceil(itemCount / cols);

      const cardWidth = (panelWidth - (cols + 1) * gap) / cols;
      const cardHeight = (panelHeight - (rows + 1) * gap) / rows;

      const positions: CollageLayout[] = [];
      const usedSpace = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(false));

      items.forEach(item => {
        let placed = false;
        for (let r = 0; r < rows && !placed; r++) {
          for (let c = 0; c < cols && !placed; c++) {
            if (!usedSpace[r][c]) {
              const sizeVariation = 0.9 + Math.random() * 0.2;
              const w = cardWidth * sizeVariation;
              const h = cardHeight * sizeVariation;
              const offsetX = (Math.random() - 0.5) * 10;
              const offsetY = (Math.random() - 0.5) * 10;

              positions.push({
                id: item.id,
                x: gap + c * (cardWidth + gap) + offsetX,
                y: gap + r * (cardHeight + gap) + offsetY,
                width: w,
                height: h,
                rotation: (Math.random() - 0.5) * 8,
                zIndex: Math.floor(Math.random() * 10) + 1,
              });

              usedSpace[r][c] = true;
              placed = true;
            }
          }
        }
      });

      setLayout(positions);
    };

    const timeoutId = setTimeout(calculateLayout, 0);
    return () => clearTimeout(timeoutId);
  }, [items, containerRef]);

  return layout;
};

// Dynamic size calculator based on total card count
const calculateCardSizes = (totalCards: number) => {
  if (totalCards <= 8) {
    return {
      minSize: 140,
      maxSize: 200,
      baseSize: 170,
      variation: 0.1,
    };
  } else if (totalCards <= 15) {
    return {
      minSize: 120,
      maxSize: 180,
      baseSize: 150,
      variation: 0.1,
    };
  } else {
    return {
      minSize: 100,
      maxSize: 160,
      baseSize: 130,
      variation: 0.1,
    };
  }
};

// Generate collage items with organic sizing and positioning
const generateCollageItems = (items: VisionBoardItem[]) => {
  const sizes = calculateCardSizes(items.length);

  return items.map(item => {
    const sizeVariation = (Math.random() - 0.5) * sizes.variation;
    const baseWidth = sizes.baseSize + sizes.baseSize * sizeVariation;
    const baseHeight = sizes.baseSize + sizes.baseSize * sizeVariation;

    const width = Math.max(sizes.minSize, Math.min(sizes.maxSize, baseWidth));
    const height = Math.max(sizes.minSize, Math.min(sizes.maxSize, baseHeight));
    const rotation = (Math.random() - 0.5) * 10;
    const zIndex = Math.floor(Math.random() * 20) + 1;

    return {
      ...item,
      width,
      height,
      rotation,
      zIndex,
      isTextCard: !item.image_url,
    };
  });
};

export function DashboardVisionCollage({
  items,
  onItemClick,
}: DashboardVisionCollageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate collage items with memoization
  const collageItems = useMemo(() => {
    return generateCollageItems(items.slice(0, 12));
  }, [items]);

  // Calculate layout using the hook
  const layout = useCollageLayout(collageItems, containerRef);

  // Add resize observer for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Layout will automatically recalculate due to useLayoutEffect dependency
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (items.length === 0) {
    return (
      <div
        className='mb-6 overflow-hidden rounded-lg border-0 shadow-xl'
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className='p-8 text-center'>
          <div className='mx-auto'>
            <div className='mb-4 inline-flex items-center justify-center rounded-full bg-white/20 p-4 backdrop-blur-sm'>
              <Target className='h-12 w-12 text-white' />
            </div>
            <h1 className='mb-3 text-3xl font-bold text-white'>
              Ready to thrive? 💪
            </h1>
            <p className='mb-6 text-xl text-blue-100'>
              Create your vision board to stay motivated
            </p>
            <Link href='/vision-board'>
              <button className='rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg hover:bg-blue-50'>
                <Target className='mr-2 inline h-5 w-5' />
                Create Your Vision Board
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='mb-6 overflow-hidden rounded-lg border-0 shadow-xl'
      style={{ background: 'var(--gradient-surface)' }}
    >
      <div className='flex items-center justify-end p-4 pb-2 lg:p-6'>
        <Link
          href='/vision-board'
          className='transition-smooth text-sm font-medium text-blue-600 hover:text-blue-700'
        >
          Manage →
        </Link>
      </div>

      <div
        ref={containerRef}
        className='relative w-full px-4 pb-4 lg:px-6 lg:pb-6'
        style={{ minHeight: '320px' }}
      >
        {layout.map((position, index) => {
          const item = collageItems.find(i => i.id === position.id);
          if (!item) return null;

          return (
            <div
              key={item.id}
              className='transition-smooth hover-scale absolute cursor-pointer'
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${position.width}px`,
                height: `${position.height}px`,
                transform: `rotate(${position.rotation}deg)`,
                zIndex: position.zIndex,
              }}
              onClick={() => onItemClick(item as VisionBoardItem)}
            >
              {item.image_url ? (
                <div className='group relative h-full w-full cursor-pointer'>
                  <img
                    src={item.image_url}
                    alt={item.title || 'Vision board item'}
                    className='transition-smooth h-full w-full rounded-lg object-cover shadow-lg hover:shadow-xl'
                  />
                  {item.title && (
                    <div className='transition-smooth absolute inset-0 flex items-end rounded-lg bg-black/30 opacity-0 group-hover:opacity-100'>
                      <p className='w-full truncate p-2 text-xs font-medium text-white'>
                        {item.title}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <TextCard
                  text={item.title || 'Goal'}
                  theme={(item.theme as ThemeColor) || 'amber'}
                  index={index}
                  width={position.width}
                  height={position.height}
                  rotation={position.rotation}
                  zIndex={position.zIndex}
                />
              )}
            </div>
          );
        })}

        {items.length > 12 && (
          <div className='glass absolute right-4 bottom-4 rounded-lg px-3 py-1 shadow-lg'>
            <p className='text-xs font-medium text-gray-600'>
              +{items.length - 12} more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
