'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Upload, Plus, Target } from 'lucide-react';
import { VisionBoardGrid } from '@/components/vision-board/VisionBoardGrid';
import { VisionBoardForm } from '@/components/vision-board/VisionBoardForm';
import { useAuth } from '@/hooks/useAuth';
import { useVisionBoard } from '@/hooks/useVisionBoard';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ThemeColor, VisionBoardItem } from '@/types/app';

export default function VisionBoardPage() {
  const [editingItem, setEditingItem] = useState<VisionBoardItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use custom hooks
  const { user, loading: authLoading } = useAuth();
  const {
    items,
    addTextItem,
    addImageItem,
    updateItem,
    deleteItem,
    loading: itemsLoading,
  } = useVisionBoard(user?.id || null);
  const { uploadImage, uploading } = useImageUpload();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const imageUrl = await uploadImage(file, 'vision-board', user.id);
      if (imageUrl) {
        // Add the image to vision board
        await addImageItem(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAddTextItem = async (
    title: string,
    description: string,
    theme: ThemeColor
  ) => {
    await addTextItem(title, description, theme);
    setShowAddForm(false);
  };

  const handleUpdateItem = async (
    itemId: string,
    updates: { title: string; description: string; theme: ThemeColor }
  ) => {
    await updateItem(itemId, updates);
    setEditingItem(null);
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
  };

  const addSampleContent = async () => {
    if (!user) return;

    const sampleItems = [
      {
        title: '2026 World Squash Masters',
        description:
          'My ultimate goal: compete in the championships in Perth, Australia. This keeps me motivated every single day.',
        theme: 'blue' as ThemeColor,
      },
      {
        title: 'Target Weight: 72kg',
        description:
          "I'm currently at 78.8kg and working towards my goal of 72kg. Every workout gets me closer!",
        theme: 'green' as ThemeColor,
      },
      {
        title: "Don't wish for it, work for it",
        description:
          'My daily motivation to stay focused on my fitness goals and push through challenges.',
        theme: 'amber' as ThemeColor,
      },
      {
        title: 'Every expert was once a beginner',
        description:
          'Remembering that everyone starts somewhere helps me stay patient with my progress.',
        theme: 'purple' as ThemeColor,
      },
      {
        title: "The only bad workout is the one that didn't happen",
        description:
          "This quote gets me moving even on days when I don't feel like exercising.",
        theme: 'rose' as ThemeColor,
      },
      {
        title: 'Progress, not perfection',
        description:
          'Focusing on small improvements rather than expecting immediate perfection.',
        theme: 'indigo' as ThemeColor,
      },
      {
        title: 'Daily Habits',
        description:
          'Stretch, Sleep 8 Hours, Drink Water, No Alcohol, No Night Snacks, Play Squash',
        theme: 'green' as ThemeColor,
      },
      {
        title: 'Progress Photos',
        description:
          'Tracking my transformation with weekly photos to see the changes that the scale might not show.',
        theme: 'blue' as ThemeColor,
      },
    ];

    for (const item of sampleItems) {
      await addTextItem(item.title, item.description, item.theme);
    }
  };

  const loading = authLoading || itemsLoading;

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p>Loading your vision board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Target Metrics Card */}
      {user && (
        <Card className='mb-8 border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-blue-800'>
              <Target className='h-5 w-5' />
              Your Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {user.target_weight_kg} kg
                </div>
                <div className='text-sm text-blue-700'>Target Weight</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {user.starting_weight_kg && user.target_weight_kg
                    ? (user.starting_weight_kg - user.target_weight_kg).toFixed(
                        1
                      )
                    : '0'}{' '}
                  kg
                </div>
                <div className='text-sm text-green-700'>Weight Loss Goal</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {user.target_date
                    ? new Date(user.target_date).toLocaleDateString()
                    : 'No deadline'}
                </div>
                <div className='text-sm text-purple-700'>Target Date</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Items Section */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Add to Your Vision Board</CardTitle>
          <CardDescription>
            Upload images or add text cards to keep yourself motivated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4'>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className='mr-2 h-4 w-4' />
                  Upload Image
                </>
              )}
            </Button>
            <Button onClick={() => setShowAddForm(true)} variant='outline'>
              <Plus className='mr-2 h-4 w-4' />
              Add Text Card
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='hidden'
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Text Form */}
      {showAddForm && (
        <VisionBoardForm
          onSubmit={handleAddTextItem}
          onCancel={() => setShowAddForm(false)}
          title='Add Text Card'
        />
      )}

      {/* Vision Board Items */}
      <VisionBoardGrid
        items={items}
        onEditItem={setEditingItem}
        onDeleteItem={handleDeleteItem}
        onUploadImage={() => fileInputRef.current?.click()}
        onAddTextCard={() => setShowAddForm(true)}
        onAddSampleContent={addSampleContent}
      />

      {/* Edit Item Modal */}
      {editingItem && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <Card className='w-full max-w-lg'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Edit Item</CardTitle>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditingItem(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <VisionBoardForm
                onSubmit={(title, description, theme) =>
                  handleUpdateItem(editingItem.id, {
                    title,
                    description,
                    theme,
                  })
                }
                onCancel={() => setEditingItem(null)}
                initialTitle={editingItem.title || ''}
                initialDescription={editingItem.description || ''}
                initialTheme={(editingItem.theme as ThemeColor) || 'amber'}
                title='Edit Item'
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
