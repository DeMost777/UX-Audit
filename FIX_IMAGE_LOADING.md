# Fix: Image Loading Error After Upload

## Problem
After uploading an image, you see an error when trying to load the image, and can't test the result page.

## Root Cause
The Supabase storage bucket `design-uploads` is set to **private** (`public: false`), but the code is trying to use public URLs. Private buckets require signed URLs or the bucket needs to be made public.

## Solution: Make Storage Bucket Public

### Option 1: Make Bucket Public (Recommended)

1. Go to your Supabase Dashboard:
   - https://supabase.com/dashboard/project/yrcschdxvruqpxcjqtnk/storage/buckets

2. Find the `design-uploads` bucket

3. Click on the bucket to open settings

4. Find the **"Public bucket"** toggle

5. **Turn it ON** to make the bucket public

6. Click **Save**

### Option 2: Update Database Schema (Alternative)

If you prefer to update via SQL, run this in your Supabase SQL Editor:

```sql
-- Make the bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'design-uploads';
```

## Why This Works

- **Public buckets**: Allow direct access via public URLs (no authentication needed)
- **Private buckets**: Require signed URLs that expire, or authentication headers

Since we're already checking authentication in our API routes, making the bucket public is safe and simpler.

## After Making Bucket Public

1. **Existing uploads**: May still have issues if they were uploaded with private URLs
   - Solution: Re-upload the files, or update existing records with new public URLs

2. **New uploads**: Will work immediately with public URLs

3. **Test**: Upload a new image and verify it loads correctly

## Alternative: Keep Bucket Private (Advanced)

If you want to keep the bucket private for security reasons, you'll need to:

1. Use signed URLs (they expire, so regenerate when needed)
2. Create an image proxy API endpoint that handles authentication
3. Update the frontend to use the proxy endpoint

The current code has been updated to handle both cases, but making the bucket public is the simplest solution.

## Verification

After making the bucket public:

1. Upload a new image
2. Check the `file_url` in the database - it should be a public URL
3. Try accessing the URL directly in a browser - it should load
4. The analysis/review pages should now display images correctly

---

**Quick Fix**: Go to Supabase Dashboard → Storage → `design-uploads` → Toggle "Public bucket" to ON → Save

