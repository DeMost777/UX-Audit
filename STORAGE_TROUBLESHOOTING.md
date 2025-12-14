# Storage Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Images Not Loading After Upload

#### Check 1: Bucket is Public
1. Go to: **Storage → Buckets → design-uploads**
2. Verify **"Public bucket"** toggle is **ON**
3. If OFF, turn it ON and click Save

#### Check 2: Storage Policies Exist
1. Go to: **Storage → Policies**
2. Filter by bucket: `design-uploads`
3. You should see 3 policies:
   - "Users can upload own files" (INSERT)
   - "Users can view own files" (SELECT)
   - "Users can delete own files" (DELETE)

If policies are missing, run this SQL:

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

#### Check 3: RLS is Enabled
1. Go to: **Storage → Policies**
2. Check if **"Enable RLS"** is ON for storage.objects
3. It should be ON (this is the default)

#### Check 4: CORS Settings
Supabase storage should handle CORS automatically, but verify:
1. Check browser console for CORS errors
2. If you see CORS errors, you may need to configure CORS in Supabase project settings

### Issue 2: "Forbidden" or "Unauthorized" Errors

#### Solution: Check Authentication
1. Make sure you're logged in
2. Check browser console for auth errors
3. Verify the user ID matches the folder structure in storage

### Issue 3: Signed URLs Not Working

If using signed URLs (for private buckets):
1. Check if the signed URL is being generated correctly
2. Verify the URL hasn't expired (current code uses 1 year expiry)
3. Check browser console for specific error messages

### Issue 4: Public URLs Not Working

If bucket is public but URLs don't work:
1. Verify the URL format is correct:
   ```
   https://[project-id].supabase.co/storage/v1/object/public/design-uploads/[user-id]/[filename]
   ```
2. Try accessing the URL directly in browser
3. Check if the file actually exists in the bucket

## Complete Setup Checklist

### Step 1: Create/Verify Bucket
- [ ] Bucket name: `design-uploads`
- [ ] Public bucket: **ON**
- [ ] File size limit: 52428800 (50 MB)
- [ ] Allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`

### Step 2: Set Up Policies
- [ ] INSERT policy exists
- [ ] SELECT policy exists
- [ ] DELETE policy exists
- [ ] RLS is enabled

### Step 3: Test Upload
- [ ] Upload a file through the app
- [ ] Check if file appears in Storage → design-uploads
- [ ] Verify file path: `[user-id]/[timestamp]-[random].ext`

### Step 4: Test Image Loading
- [ ] Check browser console for errors
- [ ] Try accessing image URL directly
- [ ] Verify image loads on analysis page

## Debugging Steps

### 1. Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: Look for failed image requests
- Console tab: Look for error messages
- Check the actual URL being requested

### 2. Check Supabase Logs
1. Go to: **Logs → API Logs**
2. Look for storage-related errors
3. Check authentication errors

### 3. Test Direct URL Access
1. Upload a file
2. Copy the `file_url` from the database
3. Try opening it directly in a new browser tab
4. If it works, the issue is in the frontend
5. If it doesn't, the issue is in storage configuration

### 4. Verify Database Record
Check the `analyses` table:
```sql
SELECT id, file_name, file_url, status 
FROM analyses 
ORDER BY created_at DESC 
LIMIT 1;
```

Check if `file_url` is:
- Not NULL
- A valid Supabase storage URL
- Points to the correct bucket

## Quick Fix: Make Everything Public (Development Only)

If you're still having issues, you can temporarily make the bucket fully public:

```sql
-- Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'design-uploads';

-- Allow public read access (development only!)
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'design-uploads');
```

**⚠️ Warning**: This makes all files publicly accessible. Only use for development!

## Still Not Working?

1. **Check the exact error message** in browser console
2. **Share the error** so we can diagnose further
3. **Verify** the file actually uploaded to Supabase Storage
4. **Test** with a simple image file (small PNG)

---

**Most Common Fix**: Make sure "Public bucket" is ON and all 3 policies exist!

