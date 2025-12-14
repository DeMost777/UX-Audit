# Storage Bucket Setup Checklist

## ✅ Bucket Configuration

Make sure your `design-uploads` bucket has these settings:

### 1. Basic Settings
- **Name**: `design-uploads` (must match exactly)
- **Public bucket**: ✅ **ON** (toggle enabled)
- **File size limit**: `52428800` bytes (50 MB)
- **Allowed MIME types**: 
  - `image/png`
  - `image/jpeg`
  - `image/jpg`

### 2. Storage Policies

The bucket needs these policies (they should be created automatically, but verify):

#### Policy 1: Users can upload own files
```sql
CREATE POLICY "Users can upload own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Policy 2: Users can view own files
```sql
CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Policy 3: Users can delete own files
```sql
CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🔍 How to Verify

1. **Go to Storage → Policies** in Supabase
2. **Find policies for `design-uploads` bucket**
3. **Verify all 3 policies exist**

## 🛠️ If Policies Are Missing

Run this SQL in Supabase SQL Editor:

```sql
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
```

## ✅ Quick Check

After setup, test by:
1. Uploading an image through your app
2. Checking if it appears in the bucket
3. Verifying the image loads on the analysis page

---

**Important**: Make sure "Public bucket" is **ON** for images to load correctly!

