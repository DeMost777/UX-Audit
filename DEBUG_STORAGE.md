# Debug Storage Issues

## Quick Test

1. **Open your browser console** (F12)
2. **Navigate to**: `http://localhost:3000/api/storage/test`
3. **Check the response** - it will show:
   - If bucket exists and is public
   - If you have files uploaded
   - Sample URLs (public and signed)
   - Any errors

## Common Issues

### Issue 1: Bucket Not Public

**Check**: Look at the test endpoint response
- If `bucket.public` is `false`, the bucket is private

**Fix**: Run this SQL in Supabase:
```sql
UPDATE storage.buckets
SET public = true
WHERE id = 'design-uploads';
```

### Issue 2: No Public Read Policy

Even if bucket is public, you need a public read policy:

**Fix**: Run this SQL:
```sql
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'design-uploads');
```

### Issue 3: URL Format Wrong

**Check**: Look at the `file_url` in your database:
```sql
SELECT id, file_name, file_url 
FROM analyses 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected format**:
```
https://[project-id].supabase.co/storage/v1/object/public/design-uploads/[user-id]/[filename]
```

### Issue 4: File Doesn't Exist

**Check**: Go to Supabase Dashboard → Storage → design-uploads
- Verify files are actually uploaded
- Check the file path matches what's in the database

## Step-by-Step Debugging

1. **Test Storage Configuration**:
   ```
   GET /api/storage/test
   ```
   This will show you exactly what's wrong

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Go to Network tab
   - Try to load an image
   - Look for failed requests
   - Check the error message

3. **Check Database**:
   ```sql
   SELECT id, file_name, file_url, status 
   FROM analyses 
   WHERE user_id = auth.uid()
   ORDER BY created_at DESC;
   ```

4. **Test URL Directly**:
   - Copy the `file_url` from database
   - Paste it in a new browser tab
   - If it loads → Frontend issue
   - If it doesn't → Storage configuration issue

## Quick Fix Script

Run this complete SQL script in Supabase SQL Editor:

```sql
-- 1. Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'design-uploads';

-- 2. Create public read policy
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'design-uploads');

-- 3. Verify
SELECT id, name, public FROM storage.buckets WHERE id = 'design-uploads';
```

## Still Not Working?

1. **Check the test endpoint**: `/api/storage/test`
2. **Share the response** so we can see what's wrong
3. **Check browser console** for specific error messages
4. **Verify** you ran the SQL scripts in Supabase

---

**Most likely issue**: Bucket is not public OR missing public read policy!

