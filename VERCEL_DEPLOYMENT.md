# Vercel Deployment Guide

## Environment Variables Setup

For your Vercel deployment to work, you **must** add these environment variables in your Vercel project settings.

### Step 1: Go to Vercel Project Settings

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **UX-Audit**
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Add these environment variables (one by one):

#### 1. Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://yrcschdxvruqpxcjqtnk.supabase.co`
- **Environment**: Production, Preview, Development (select all)

#### 2. Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_HYPzhWceRQ3OUHbvAyO0Pg_W1FKrtJP`
- **Environment**: Production, Preview, Development (select all)

#### 3. Supabase Service Role Key
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `sb_secret_edXCjtxazcOkkO4OwoCPhw_B2DIbiWy`
- **Environment**: Production, Preview, Development (select all)

#### 4. NextAuth URL
- **Name**: `NEXTAUTH_URL`
- **Value**: Your Vercel deployment URL (e.g., `https://ux-audit.vercel.app`)
- **Environment**: Production, Preview, Development (select all)
- **Note**: Vercel will provide this automatically, but you can set it manually

#### 5. NextAuth Secret
- **Name**: `NEXTAUTH_SECRET`
- **Value**: Generate one using: `openssl rand -base64 32`
- **Environment**: Production, Preview, Development (select all)
- **Important**: Use the same secret you have in `.env.local` or generate a new one

### Step 3: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

## Quick Setup Checklist

- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Added `NEXTAUTH_URL` (your Vercel domain)
- [ ] Added `NEXTAUTH_SECRET` (generated secret)
- [ ] Redeployed the application

## Troubleshooting

### "supabaseUrl is required" Error

**Cause**: Environment variables not set in Vercel

**Solution**: 
1. Go to Vercel Settings → Environment Variables
2. Add all required variables
3. Redeploy

### Build Fails

**Check**:
1. All environment variables are set
2. Variable names are correct (case-sensitive)
3. No extra spaces in values
4. Redeploy after adding variables

### Authentication Not Working

**Check**:
1. `NEXTAUTH_URL` matches your Vercel domain
2. `NEXTAUTH_SECRET` is set
3. Supabase credentials are correct
4. Database schema is set up in Supabase

## Environment Variables Reference

```env
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yrcschdxvruqpxcjqtnk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HYPzhWceRQ3OUHbvAyO0Pg_W1FKrtJP
SUPABASE_SERVICE_ROLE_KEY=sb_secret_edXCjtxazcOkkO4OwoCPhw_B2DIbiWy

# Required for NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret

# Optional
MAX_FILE_SIZE_MB=50
ANALYSIS_TIMEOUT_MS=30000
```

## Security Notes

- ✅ Environment variables are encrypted in Vercel
- ✅ Never commit `.env.local` to Git
- ✅ Use different secrets for production if needed
- ✅ Rotate secrets periodically

## Next Steps After Deployment

1. ✅ Set up environment variables
2. ✅ Verify deployment is successful
3. ✅ Test authentication (sign up/sign in)
4. ✅ Test file upload
5. ✅ Test analysis functionality
6. ✅ Set up custom domain (optional)

---

**Your app should now deploy successfully on Vercel!** 🚀

