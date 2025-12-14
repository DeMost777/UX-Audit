# GitHub Setup Guide - Flow UX AI

Complete instructions for pushing your Flow UX AI project to GitHub.

## Prerequisites

- Git installed on your system
- GitHub account created
- Terminal/Command line access

## Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open your terminal in the project directory and run:

```bash
cd "/Users/denysmostovyi/Documents/PROJECTOR - AI project - v2.0"
git init
```

### Step 2: Verify .gitignore is Correct

Make sure `.gitignore` includes these important files (already configured):
- `.env.local` - Contains your Supabase secrets
- `node_modules/` - Dependencies
- `.next/` - Next.js build files
- `.DS_Store` - macOS system files

**⚠️ IMPORTANT**: Never commit `.env.local` or any file containing API keys or secrets!

### Step 3: Add All Files to Git

```bash
git add .
```

This stages all files except those in `.gitignore`.

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Flow UX AI MVP

- File upload system with Supabase Storage
- Rule-based UX analysis engine
- Visual canvas with issue highlights
- Dashboard for saved analyses
- PDF export functionality
- NextAuth authentication
- Complete Phase 1 MVP"
```

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `flow-ux-ai` (or your preferred name)
   - **Description**: "Automate UX audits with AI precision - Phase 1 MVP"
   - **Visibility**: Choose **Private** (recommended) or **Public**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 6: Add GitHub Remote

After creating the repository, GitHub will show you commands. Use the HTTPS URL:

```bash
git remote add origin https://github.com/YOUR_USERNAME/flow-ux-ai.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 7: Rename Main Branch (if needed)

```bash
git branch -M main
```

### Step 8: Push to GitHub

```bash
git push -u origin main
```

You'll be prompted for your GitHub username and password (or personal access token).

### Step 9: Verify Push

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files

## Authentication Options

### Option A: Personal Access Token (Recommended)

If you're asked for a password, use a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Flow UX AI")
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token as your password when pushing

### Option B: SSH Key (Alternative)

If you prefer SSH:

1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Use SSH URL: `git remote set-url origin git@github.com:YOUR_USERNAME/flow-ux-ai.git`

## Quick Command Summary

```bash
# Initialize repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Flow UX AI MVP"

# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/flow-ux-ai.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Future Updates

After making changes, use these commands:

```bash
# Check status
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Important Security Notes

### ⚠️ NEVER Commit These Files:

- `.env.local` - Contains Supabase API keys
- `.env` - Environment variables
- Any file with API keys, secrets, or passwords
- `node_modules/` - Too large, use npm install
- `.next/` - Build files, regenerated

### ✅ Safe to Commit:

- Source code (`.ts`, `.tsx`, `.js`, `.jsx`)
- Configuration files (`package.json`, `tsconfig.json`)
- Documentation (`.md` files)
- Public assets
- `.gitignore`

## Environment Variables Setup

Since `.env.local` is not committed, you need to:

1. **For Local Development**: Keep your `.env.local` file locally
2. **For Deployment** (Vercel, etc.):
   - Add environment variables in your hosting platform's dashboard
   - Use the same variables from your `.env.local`

### Required Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Repository Structure

Your repository should include:

```
flow-ux-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── analysis/          # Analysis pages
│   ├── dashboard/         # Dashboard page
│   └── ...
├── components/            # React components
├── lib/                   # Utilities and libraries
│   ├── analysis/          # Analysis engine
│   ├── pdf/               # PDF generator
│   └── supabase/          # Supabase clients
├── supabase/             # Database schema
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── README.md             # Project documentation
└── ...                   # Other config files
```

## Troubleshooting

### "Repository not found"
- Check that the repository name is correct
- Verify you have access to the repository
- Make sure you're using the correct username

### "Permission denied"
- Use Personal Access Token instead of password
- Check SSH key setup if using SSH
- Verify GitHub account permissions

### "Large files" error
- Make sure `node_modules/` is in `.gitignore`
- Don't commit `.next/` or build files
- Use Git LFS for large files if needed

### "Branch protection" error
- Some repositories have branch protection
- You may need to create a pull request instead
- Check repository settings

## Next Steps After Pushing

1. **Add Repository Description**: Update on GitHub
2. **Add Topics/Tags**: Help others find your project
3. **Create README**: Add project overview (already exists)
4. **Set Up CI/CD**: Consider GitHub Actions for testing
5. **Deploy**: Connect to Vercel or other hosting

## Deployment

After pushing to GitHub, you can:

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy automatically

2. **Deploy to Other Platforms**:
   - Follow platform-specific instructions
   - Remember to add environment variables

## Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Help**: https://docs.github.com
- **Git Commands**: Run `git help <command>` for help

---

**Remember**: Keep your `.env.local` file secure and never commit it to GitHub!

