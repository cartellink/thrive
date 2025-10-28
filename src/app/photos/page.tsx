'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Trash2, Eye } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { AppShell } from '@/components/layout/AppShell';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

// Type aliases for cleaner usage
type User = Tables<'users'>;
type ProgressPhoto = Tables<'progress_photos'>;

export default function PhotosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPhotos = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      // Get user record
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (!userData) {
        router.push('/auth/onboarding');
        return;
      }

      setUser(userData);

      const { data: photosData } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', userData.id)
        .order('taken_at', { ascending: false });

      setPhotos(photosData || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('progress-photos').getPublicUrl(fileName);

      // Save photo record to database
      const { error: dbError } = await supabase.from('progress_photos').insert({
        user_id: user.id,
        photo_url: publicUrl,
        weight_at_time: null, // User can add this later
        body_fat_at_time: null,
      });

      if (dbError) {
        console.error('Database error:', dbError);
        return;
      }

      // Reload photos
      await loadPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser || !user) return;

      // Get photo URL to delete from storage
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      // Extract file path from URL
      const urlParts = photo.photo_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      // Delete from storage
      await supabase.storage.from('progress-photos').remove([filePath]);

      // Delete from database
      const { error } = await supabase
        .from('progress_photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', user.id);

      if (!error) {
        await loadPhotos();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const updatePhotoMetrics = async (
    photoId: string,
    weight?: number,
    bodyFat?: number
  ) => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser || !user) return;

      const { error } = await supabase
        .from('progress_photos')
        .update({
          weight_at_time: weight || null,
          body_fat_at_time: bodyFat || null,
        })
        .eq('id', photoId)
        .eq('user_id', user.id);

      if (!error) {
        await loadPhotos();
      }
    } catch (error) {
      console.error('Error updating photo metrics:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p>Loading your photos...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title='Progress Photos'
        showBackButton={true}
        backHref='/dashboard'
        variant='gradient'
      />

      <div className='space-y-8'>
        {/* Upload Section */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Camera className='h-5 w-5' />
              Add Progress Photo
            </CardTitle>
            <CardDescription>
              Upload photos to track your visual progress over time
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
                    Choose Photo
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
              />
            </div>
            <p className='mt-2 text-sm text-gray-500'>
              Supported formats: JPG, PNG, WebP. Max size: 10MB
            </p>
          </CardContent>
        </Card>

        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {photos.map(photo => (
              <Card key={photo.id} className='overflow-hidden'>
                <div className='relative aspect-square'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.photo_url}
                    alt='Progress photo'
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute top-2 right-2 flex gap-1'>
                    <IconButton
                      size='sm'
                      variant='secondary'
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <Eye className='h-3 w-3' />
                    </IconButton>
                    <IconButton
                      size='sm'
                      variant='destructive'
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </IconButton>
                  </div>
                </div>
                <CardContent className='p-4'>
                  <div className='mb-2 text-sm text-gray-600'>
                    {new Date(
                      photo.taken_at || Date.now()
                    ).toLocaleDateString()}
                  </div>
                  <div className='space-y-1 text-xs'>
                    {photo.weight_at_time && (
                      <div>Weight: {photo.weight_at_time} kg</div>
                    )}
                    {photo.body_fat_at_time && (
                      <div>Body Fat: {photo.body_fat_at_time}%</div>
                    )}
                    {!photo.weight_at_time && !photo.body_fat_at_time && (
                      <div className='text-gray-400'>No metrics recorded</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className='py-12 text-center'>
              <Camera className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                No photos yet
              </h3>
              <p className='mb-4 text-gray-600'>
                Start tracking your visual progress by uploading your first
                photo
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className='mr-2 h-4 w-4' />
                Upload First Photo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Photo Detail Modal */}
        {selectedPhoto && (
          <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
            <Card className='max-h-[90vh] w-full max-w-2xl overflow-y-auto'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle>Photo Details</CardTitle>
                  <IconButton
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedPhoto(null)}
                  >
                    ×
                  </IconButton>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='aspect-square'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPhoto.photo_url}
                    alt='Progress photo'
                    className='h-full w-full rounded-lg object-cover'
                  />
                </div>

                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='weight'>Weight at time of photo (kg)</Label>
                    <Input
                      id='weight'
                      type='number'
                      placeholder='Enter weight'
                      defaultValue={
                        selectedPhoto.weight_at_time?.toString() || ''
                      }
                      onBlur={e => {
                        const weight = e.target.value
                          ? parseFloat(e.target.value)
                          : undefined;
                        updatePhotoMetrics(
                          selectedPhoto.id,
                          weight,
                          selectedPhoto.body_fat_at_time || undefined
                        );
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor='bodyFat'>Body fat % at time of photo</Label>
                    <Input
                      id='bodyFat'
                      type='number'
                      placeholder='Enter body fat percentage'
                      defaultValue={
                        selectedPhoto.body_fat_at_time?.toString() || ''
                      }
                      onBlur={e => {
                        const bodyFat = e.target.value
                          ? parseFloat(e.target.value)
                          : undefined;
                        updatePhotoMetrics(
                          selectedPhoto.id,
                          selectedPhoto.weight_at_time || undefined,
                          bodyFat
                        );
                      }}
                    />
                  </div>

                  <div className='text-sm text-gray-600'>
                    Taken:{' '}
                    {new Date(
                      selectedPhoto.taken_at || Date.now()
                    ).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
