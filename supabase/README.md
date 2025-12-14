# Supabase Database Setup

## Quick Setup Instructions

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/yrcschdxvruqpxcjqtnk
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

### Step 2: Run the Schema SQL

1. Open the file `schema.sql` in this directory
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click "Run" (or press Cmd/Ctrl + Enter)

### Step 3: Verify Tables Were Created

After running the SQL, verify the tables exist:

1. Go to "Table Editor" in the left sidebar
2. You should see these tables:
   - `users`
   - `analyses`
   - `analysis_results`
   - `analysis_metadata`

### Step 4: Verify Storage Bucket

1. Go to "Storage" in the left sidebar
2. You should see a bucket named `design-uploads`
3. Verify it's set to private (not public)

## What Gets Created

### Tables

1. **users** - User profiles (extends auth.users)
2. **analyses** - Design file uploads and analysis records
3. **analysis_results** - Individual issues found in each analysis
4. **analysis_metadata** - Analysis statistics and metadata

### Security

- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own data
- Storage bucket policies for file uploads

### Features

- Automatic user profile creation on signup
- Automatic `updated_at` timestamp updates
- Indexes for fast queries
- Foreign key constraints for data integrity

## Troubleshooting

**Error: "relation already exists"**
- Some tables might already exist. You can either:
  - Drop existing tables first (be careful!)
  - Or modify the SQL to use `CREATE TABLE IF NOT EXISTS` (already included)

**Error: "permission denied"**
- Make sure you're running the SQL as the project owner
- Check that you have the correct permissions in Supabase

**Storage bucket not created**
- The bucket creation might fail if it already exists
- Check the Storage section manually and create it if needed

## Next Steps

After running the schema:

1. ✅ Database tables created
2. ✅ Security policies configured
3. ✅ Storage bucket ready
4. ⏭️ Next: Set up authentication with NextAuth
5. ⏭️ Next: Create API routes for file uploads

