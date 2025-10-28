-- Create storage buckets for progress photos and vision board images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('progress-photos', 'progress-photos', true),
  ('vision-board', 'vision-board', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own progress photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own progress photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own progress photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own progress photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own vision board images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own vision board images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own vision board images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own vision board images" ON storage.objects;

-- Helper function to get user.id from auth.uid()
CREATE OR REPLACE FUNCTION public.get_user_id_from_auth()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM public.users WHERE auth_user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage policies for progress-photos bucket
-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload own progress photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'progress-photos' 
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own photos
CREATE POLICY "Users can view own progress photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'progress-photos'
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own photos
CREATE POLICY "Users can update own progress photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'progress-photos'
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete own progress photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'progress-photos'
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

-- Storage policies for vision-board bucket
-- Allow authenticated users to upload their own vision board images
CREATE POLICY "Users can upload own vision board images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vision-board'
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own vision board images
CREATE POLICY "Users can view own vision board images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'vision-board'
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own vision board images
CREATE POLICY "Users can update own vision board images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vision-board'
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own vision board images
CREATE POLICY "Users can delete own vision board images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vision-board'
  AND public.get_user_id_from_auth()::text = (storage.foldername(name))[1]
);

