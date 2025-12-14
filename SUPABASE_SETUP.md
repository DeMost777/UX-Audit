# Supabase Connection Setup Guide

## Quick Start - Connect to Your Supabase Account

Your Supabase project is already created. Follow these steps to connect your Next.js app.

### Step 1: Install Dependencies

Run this command in your project directory:

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install next-auth @auth/supabase-adapter
```

### Step 2: Create Environment Variables File

Create a file named `.env.local` in the root of your project (same level as `package.json`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yrcschdxvruqpxcjqtnk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HYPzhWceRQ3OUHbvAyO0Pg_W1FKrtJP
SUPABASE_SERVICE_ROLE_KEY=sb_secret_edXCjtxazcOkkO4OwoCPhw_B2DIbiWy

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Optional: Analysis settings
MAX_FILE_SIZE_MB=50
ANALYSIS_TIMEOUT_MS=30000
```

### Step 3: Generate NextAuth Secret

Run this command to generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET` in your `.env.local` file.

### Step 4: Verify .env.local is in .gitignore

Make sure `.env.local` is listed in your `.gitignore` file (it should already be there). This prevents accidentally committing your secrets to git.

### Step 5: Restart Development Server

After creating `.env.local`, restart your Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Your Supabase Project Information

- **Project ID**: `yrcschdxvruqpxcjqtnk`
- **Project URL**: `https://yrcschdxvruqpxcjqtnk.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/yrcschdxvruqpxcjqtnk

## Next Steps

After completing the setup above, the implementation will:

1. Create Supabase client utilities (`lib/supabase/`)
2. Set up database schema (tables for users, analyses, results)
3. Configure authentication with NextAuth
4. Set up file storage buckets in Supabase Storage
5. Create API routes for uploads and analysis

## Security Notes

- ✅ The publishable key is safe to use in browser code
- ⚠️ The secret key should ONLY be used in server-side code (API routes, server components)
- ⚠️ Never commit `.env.local` to git
- ⚠️ Keep your secret key secure and rotate it if compromised

## Troubleshooting

**Issue**: Environment variables not loading
- Solution: Restart the dev server after creating `.env.local`
- Check that the file is in the project root (not in `app/` or `components/`)

**Issue**: Connection errors
- Verify the project URL is correct
- Check that your Supabase project is active (not paused)
- Ensure RLS (Row Level Security) policies are set up correctly

**Issue**: CORS errors
- Supabase handles CORS automatically, but check your project settings
- Verify the `NEXT_PUBLIC_SUPABASE_URL` matches your project URL exactly

