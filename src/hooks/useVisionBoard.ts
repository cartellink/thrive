import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

type VisionBoardItem = Tables<'vision_board_items'>;

interface UseVisionBoardReturn {
  items: VisionBoardItem[];
  loading: boolean;
  error: string | null;
  addTextItem: (
    title: string,
    description: string,
    theme: string
  ) => Promise<void>;
  addImageItem: (
    imageUrl: string,
    title?: string,
    description?: string
  ) => Promise<void>;
  updateItem: (
    itemId: string,
    updates: Partial<VisionBoardItem>
  ) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  addSampleContent: () => Promise<void>;
}

export function useVisionBoard(userId: string | null): UseVisionBoardReturn {
  const [items, setItems] = useState<VisionBoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVisionBoardData = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: itemsData } = await supabase
        .from('vision_board_items')
        .select('*')
        .eq('user_id', userId)
        .order('item_order', { ascending: true });

      setItems(itemsData || []);
    } catch (err) {
      console.error('Error loading vision board data:', err);
      setError('Failed to load vision board');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadVisionBoardData();
    }
  }, [userId, loadVisionBoardData]);

  const addTextItem = async (
    title: string,
    description: string,
    theme: string
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from('vision_board_items').insert({
        user_id: userId,
        title,
        description,
        theme,
        item_order: items.length,
      });

      if (error) {
        console.error('Error adding text item:', error);
        setError('Failed to add item');
      } else {
        await loadVisionBoardData();
      }
    } catch (err) {
      console.error('Error adding text item:', err);
      setError('Failed to add item');
    }
  };

  const addImageItem = async (
    imageUrl: string,
    title?: string,
    description?: string
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from('vision_board_items').insert({
        user_id: userId,
        image_url: imageUrl,
        title: title || null,
        description: description || null,
        item_order: items.length,
      });

      if (error) {
        console.error('Error adding image item:', error);
        setError('Failed to add image');
      } else {
        await loadVisionBoardData();
      }
    } catch (err) {
      console.error('Error adding image item:', err);
      setError('Failed to add image');
    }
  };

  const updateItem = async (
    itemId: string,
    updates: Partial<VisionBoardItem>
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('vision_board_items')
        .update(updates)
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating item:', error);
        setError('Failed to update item');
      } else {
        await loadVisionBoardData();
      }
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!userId) return;

    try {
      // Get item to delete image from storage if it exists
      const item = items.find(i => i.id === itemId);
      if (item?.image_url) {
        const urlParts = item.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${userId}/${fileName}`;

        await supabase.storage.from('vision-board').remove([filePath]);
      }

      const { error } = await supabase
        .from('vision_board_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting item:', error);
        setError('Failed to delete item');
      } else {
        await loadVisionBoardData();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const addSampleContent = async () => {
    if (!userId) return;

    const sampleItems = [
      {
        title: '2026 World Squash Masters',
        description:
          'My ultimate goal: compete in the championships in Perth, Australia. This keeps me motivated every single day.',
        theme: 'blue' as const,
      },
      {
        title: 'Target Weight: 72kg',
        description:
          "I'm currently at 78.8kg and working towards my goal of 72kg. Every workout gets me closer!",
        theme: 'green' as const,
      },
      {
        title: "Don't wish for it, work for it",
        description:
          'My daily motivation to stay focused on my fitness goals and push through challenges.',
        theme: 'amber' as const,
      },
      {
        title: 'Every expert was once a beginner',
        description:
          'Remembering that everyone starts somewhere helps me stay patient with my progress.',
        theme: 'purple' as const,
      },
      {
        title: "The only bad workout is the one that didn't happen",
        description:
          "This quote gets me moving even on days when I don't feel like exercising.",
        theme: 'rose' as const,
      },
      {
        title: 'Progress, not perfection',
        description:
          'Focusing on small improvements rather than expecting immediate perfection.',
        theme: 'indigo' as const,
      },
      {
        title: 'Daily Habits',
        description:
          'Stretch, Sleep 8 Hours, Drink Water, No Alcohol, No Night Snacks, Play Squash',
        theme: 'green' as const,
      },
      {
        title: 'Progress Photos',
        description:
          'Tracking my transformation with weekly photos to see the changes that the scale might not show.',
        theme: 'blue' as const,
      },
    ];

    try {
      for (let i = 0; i < sampleItems.length; i++) {
        const item = sampleItems[i];
        await supabase.from('vision_board_items').insert({
          user_id: userId,
          title: item.title,
          description: item.description,
          theme: item.theme,
          item_order: items.length + i,
        });
      }

      await loadVisionBoardData();
    } catch (err) {
      console.error('Error adding sample content:', err);
      setError('Failed to add sample content');
    }
  };

  return {
    items,
    loading,
    error,
    addTextItem,
    addImageItem,
    updateItem,
    deleteItem,
    addSampleContent,
  };
}
