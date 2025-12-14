-- Make the design-uploads bucket public
-- Run this in your Supabase SQL Editor to fix image loading issues

UPDATE storage.buckets
SET public = true
WHERE id = 'design-uploads';

-- Verify the change
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'design-uploads';

