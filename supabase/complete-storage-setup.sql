-- Complete Storage Setup for design-uploads bucket
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- 1. CREATE BUCKET (if it doesn't exist)
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'design-uploads',
  'design-uploads',
  true,  -- IMPORTANT: Set to true for public access
  52428800, -- 50MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,  -- Ensure it's public
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg'];

-- ============================================
-- 2. DROP EXISTING POLICIES (if any)
-- ============================================
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- ============================================
-- 3. CREATE STORAGE POLICIES
-- ============================================

-- Policy: Users can upload their own files
CREATE POLICY "Users can upload own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own files
CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Public read access (for public bucket)
-- This allows anyone to read files from a public bucket
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'design-uploads');

-- ============================================
-- 4. VERIFY SETUP
-- ============================================
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types
FROM storage.buckets
WHERE id = 'design-uploads';

-- Check policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%design-uploads%' 
  OR (policyname LIKE '%design%' AND qual::text LIKE '%design-uploads%');

